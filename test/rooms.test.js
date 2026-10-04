/* eslint test/no-import-node-test: off */
import assert from 'node:assert/strict'
import { it } from 'node:test'
import { createRoomStore, rollTeam } from '../server/rooms.js'
import { CHARACTER_NAMES, POSITION_NAMES, SKILL_NAMES, TALENT_NAMES } from '../shared/pools.js'

function populated(store) {
  const host = store.create()
  const members = [host, ...Array.from({ length: 4 }, () => store.join(host.room.code))]
  return { code: host.room.code, host, members }
}

function expectError(action, status, code) {
  assert.throws(action, error => error.status === status && error.code === code)
}

it('only a host in a full room can start, and starting twice keeps all results', () => {
  const store = createRoomStore()
  const host = store.create()
  const { code } = host.room
  assert.match(code, /^\d{6}$/)
  assert.equal(host.room.memberCount, 1)
  assert.equal(host.room.isHost, true)
  assert.equal(host.room.canStart, false)
  assert.equal(host.room.result, null)
  expectError(() => store.start(code, host.token), 409, 'ROOM_NOT_FULL')
  const guests = Array.from({ length: 4 }, () => store.join(code))
  assert.equal(store.get(code, host.token).room.canStart, true)
  assert.equal(guests.at(-1).room.memberCount, 5)
  assert.equal(guests.at(-1).room.canStart, false)
  expectError(() => store.join(code), 409, 'ROOM_FULL')
  expectError(() => store.start(code, guests[0].token), 403, 'HOST_ONLY')
  const first = store.start(code, host.token)
  assert.equal(first.room.status, 'started')
  assert.equal(first.room.canStart, false)
  assert.deepEqual(store.start(code, host.token), first)
  expectError(() => store.join(code), 409, 'ROOM_STARTED')
})

it('each snapshot includes exactly its own result and no membership secrets', () => {
  const store = createRoomStore()
  const { code, host, members } = populated(store)
  store.start(code, host.token)
  const rooms = members.map(member => store.get(code, member.token).room)
  assert.equal(new Set(rooms.map(room => room.result.characterRoll)).size, 5)
  assert.deepEqual(new Set(rooms.map(room => room.result.positionRoll)), new Set(POSITION_NAMES))
  for (const [index, room] of rooms.entries()) {
    assert.deepEqual(Object.keys(room).sort(), ['canStart', 'capacity', 'code', 'expiresAt', 'isHost', 'memberCount', 'members', 'result', 'status'])
    assert.equal(room.members.filter(member => member.isYou).length, 1)
    for (const member of room.members)
      assert.deepEqual(Object.keys(member).sort(), ['id', 'isHost', 'isYou', 'seat'])
    const serialized = JSON.stringify(room)
    for (const [otherIndex, other] of rooms.entries()) {
      if (index !== otherIndex)
        assert.equal(serialized.includes(JSON.stringify(other.result.characterRoll)), false)
    }
    for (const member of members)
      assert.equal(serialized.includes(member.token), false)
  }
  const mutated = store.get(code, host.token).room
  mutated.result.skillRoll.push('FAKE')
  mutated.members[0].isHost = false
  assert.deepEqual(store.get(code, host.token).room, rooms[0])
})

it('public member IDs, room codes, and other-room tokens cannot impersonate a member', () => {
  const store = createRoomStore()
  const { code, host } = populated(store)
  const unrelated = store.create()
  for (const token of [undefined, code, host.room.members[0].id, unrelated.token, 'x'.repeat(43)]) {
    expectError(() => store.get(code, token), 401, 'INVALID_MEMBER')
    expectError(() => store.start(code, token), 401, 'INVALID_MEMBER')
    expectError(() => store.leave(code, token), 401, 'INVALID_MEMBER')
  }
})

it('waiting heartbeat expiry releases seats, preserves active members, and transfers host', () => {
  let time = 0
  const store = createRoomStore({ now: () => time })
  const { code, host, members } = populated(store)
  time = 40_000
  const guest = members[1]
  store.get(code, guest.token)
  time = 60_000
  const room = store.get(code, guest.token).room
  assert.equal(room.memberCount, 1)
  assert.equal(room.isHost, true)
  assert.equal(room.members[0].seat, 2)
  expectError(() => store.get(code, host.token), 401, 'INVALID_MEMBER')
  const newcomer = store.join(code)
  assert.equal(newcomer.room.members.find(member => member.isYou).seat, 1)
  assert.equal(newcomer.room.isHost, false)
  store.leave(code, guest.token)
  assert.equal(store.get(code, newcomer.token).room.isHost, true)
  store.leave(code, newcomer.token)
  expectError(() => store.join(code), 404, 'ROOM_NOT_FOUND')
})

it('a heartbeat resumes the same seat without joining twice', () => {
  let time = 0
  const store = createRoomStore({ now: () => time })
  const host = store.create()
  time = 59_000
  const original = store.get(host.room.code, host.token)
  time = 90_000
  const resumed = store.get(host.room.code, host.token)
  assert.deepEqual(resumed, original)
  assert.equal(resumed.room.memberCount, 1)
})

it('started rooms retain private results through disconnects but expire after two hours', () => {
  let time = 0
  const store = createRoomStore({ now: () => time })
  const { code, host, members } = populated(store)
  const first = store.start(code, host.token)
  time = 70_000
  store.sweep()
  assert.deepEqual(store.get(code, host.token), first)
  const guestResult = store.get(code, members[1].token).room.result
  store.leave(code, host.token)
  const nextHost = store.get(code, members[1].token).room
  assert.equal(nextHost.memberCount, 4)
  assert.equal(nextHost.isHost, true)
  assert.deepEqual(store.start(code, members[1].token).room.result, guestResult)
  expectError(() => store.join(code), 409, 'ROOM_STARTED')
  time = 2 * 60 * 60 * 1000
  expectError(() => store.get(code, members[1].token), 404, 'ROOM_NOT_FOUND')
})

it('room allocation is bounded and expired rooms free capacity', () => {
  let time = 0
  const store = createRoomStore({ now: () => time, maxRooms: 2 })
  store.create()
  store.create()
  expectError(() => store.create(), 429, 'SERVER_BUSY')
  time = 60_000
  assert.equal(store.create().room.memberCount, 1)
})

it('random teams always use valid pools, unique heroes/positions, and jungle-only smite', () => {
  for (let attempt = 0; attempt < 100; attempt++) {
    const team = rollTeam()
    assert.equal(team.length, 5)
    assert.equal(new Set(team.map(result => result.characterRoll)).size, 5)
    assert.deepEqual(new Set(team.map(result => result.positionRoll)), new Set(POSITION_NAMES))
    for (const result of team) {
      assert.ok(CHARACTER_NAMES.includes(result.characterRoll))
      assert.ok(TALENT_NAMES.includes(result.talentRoll))
      assert.equal(result.skillRoll.length, 2)
      assert.equal(new Set(result.skillRoll).size, 2)
      assert.ok(result.skillRoll.every(skill => SKILL_NAMES.includes(skill)))
      assert.equal(result.skillRoll.includes('惩戒'), result.positionRoll === '打野')
    }
  }
})
