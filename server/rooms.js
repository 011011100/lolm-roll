import { createHash, randomBytes, randomInt, randomUUID } from 'node:crypto'
import { CHARACTER_NAMES, POSITION_NAMES, SKILL_NAMES, TALENT_NAMES } from '../shared/pools.js'

const CAPACITY = 5

export class RoomError extends Error {
  constructor(status, code, message) {
    super(message)
    this.status = status
    this.code = code
  }
}

function sample(pool, count) {
  const available = [...pool]
  return Array.from({ length: count }, () => available.splice(randomInt(available.length), 1)[0])
}

export function rollTeam() {
  const heroes = sample(CHARACTER_NAMES, CAPACITY)
  const positions = sample(POSITION_NAMES, CAPACITY)
  const skills = SKILL_NAMES.filter(skill => skill !== '惩戒')
  return heroes.map((characterRoll, index) => ({
    characterRoll,
    positionRoll: positions[index],
    skillRoll: positions[index] === '打野' ? ['惩戒', ...sample(skills, 1)] : sample(skills, 2),
    talentRoll: TALENT_NAMES[randomInt(TALENT_NAMES.length)],
  }))
}

function tokenKey(token) {
  if (typeof token !== 'string' || !/^[\w-]{43}$/.test(token))
    throw new RoomError(401, 'INVALID_MEMBER', '成员身份已失效，请重新加入房间')
  return createHash('sha256').update(token).digest('hex')
}

export function createRoomStore({
  now = Date.now,
  roomTtlMs = 2 * 60 * 60 * 1000,
  memberTtlMs = 60 * 1000,
  maxRooms = 1000,
} = {}) {
  const rooms = new Map()

  function clean(room) {
    const time = now()
    if (time >= room.expiresAt) {
      rooms.delete(room.code)
      return
    }
    if (room.status === 'waiting') {
      for (const [key, member] of room.members) {
        if (time - member.lastSeen >= memberTtlMs)
          room.members.delete(key)
      }
    }
    if (room.members.size === 0) {
      rooms.delete(room.code)
      return
    }
    if (![...room.members.values()].some(member => member.id === room.hostId))
      room.hostId = room.members.values().next().value.id
  }

  function sweep() {
    for (const room of rooms.values())
      clean(room)
  }

  function find(code) {
    const room = rooms.get(code)
    if (room)
      clean(room)
    if (!rooms.has(code))
      throw new RoomError(404, 'ROOM_NOT_FOUND', '房间不存在或已过期，请重新创建或加入')
    return room
  }

  function authenticate(room, token) {
    const member = room.members.get(tokenKey(token))
    if (!member)
      throw new RoomError(401, 'INVALID_MEMBER', '成员身份已失效，请重新加入房间')
    member.lastSeen = now()
    return member
  }

  function project(room, member) {
    const isHost = room.hostId === member.id
    return {
      code: room.code,
      status: room.status,
      memberCount: room.members.size,
      capacity: CAPACITY,
      isHost,
      canStart: isHost && room.status === 'waiting' && room.members.size === CAPACITY,
      members: [...room.members.values()].map(current => ({
        id: current.id,
        seat: current.seat,
        isHost: current.id === room.hostId,
        isYou: current.id === member.id,
      })),
      result: member.result ? { ...member.result, skillRoll: [...member.result.skillRoll] } : null,
      expiresAt: new Date(room.expiresAt).toISOString(),
    }
  }

  function addMember(room) {
    const token = randomBytes(32).toString('base64url')
    const occupied = new Set([...room.members.values()].map(member => member.seat))
    const seat = Array.from({ length: CAPACITY }, (_, index) => index + 1).find(index => !occupied.has(index))
    const member = { id: randomUUID(), seat, lastSeen: now(), result: null }
    room.members.set(tokenKey(token), member)
    if (!room.hostId)
      room.hostId = member.id
    return { token, room: project(room, member) }
  }

  return {
    sweep,
    create() {
      sweep()
      if (rooms.size >= maxRooms)
        throw new RoomError(429, 'SERVER_BUSY', '当前房间较多，请稍后再试')
      let code
      do
        code = String(randomInt(100000, 1000000))
      while (rooms.has(code))
      const room = { code, status: 'waiting', members: new Map(), hostId: null, expiresAt: now() + roomTtlMs }
      rooms.set(code, room)
      return addMember(room)
    },
    join(code) {
      const room = find(code)
      if (room.status === 'started')
        throw new RoomError(409, 'ROOM_STARTED', '房间已开始随机，无法加入')
      if (room.members.size >= CAPACITY)
        throw new RoomError(409, 'ROOM_FULL', '房间已满')
      return addMember(room)
    },
    get(code, token) {
      const room = find(code)
      return { room: project(room, authenticate(room, token)) }
    },
    start(code, token) {
      const room = find(code)
      const member = authenticate(room, token)
      if (member.id !== room.hostId)
        throw new RoomError(403, 'HOST_ONLY', '仅房主可以开始随机')
      if (room.status === 'started')
        return { room: project(room, member) }
      if (room.members.size !== CAPACITY)
        throw new RoomError(409, 'ROOM_NOT_FULL', '需要满 5 人后才能开始随机')
      const results = rollTeam()
      let index = 0
      for (const current of room.members.values())
        current.result = results[index++]
      room.status = 'started'
      return { room: project(room, member) }
    },
    leave(code, token) {
      const room = find(code)
      authenticate(room, token)
      room.members.delete(tokenKey(token))
      clean(room)
      return { ok: true }
    },
  }
}
