/* eslint test/no-import-node-test: off */
import assert from 'node:assert/strict'
import { once } from 'node:events'
import { mkdtemp, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { it } from 'node:test'
import { createAppServer } from '../server/http.js'
import { createRoomStore } from '../server/rooms.js'

async function setup(t, options = {}) {
  const directory = await mkdtemp(join(tmpdir(), 'lolm-http-'))
  await writeFile(join(directory, 'index.html'), '<!doctype html><title>LOLM ROLL test</title>')
  await writeFile(join(directory, 'example.js'), 'export const test = true')
  const server = createAppServer({ distDir: directory, ...options })
  server.listen(0, '127.0.0.1')
  await once(server, 'listening')
  const base = `http://127.0.0.1:${server.address().port}`
  t.after(async () => {
    await new Promise((resolve) => {
      server.close(resolve)
      server.closeAllConnections()
    })
    await rm(directory, { recursive: true, force: true })
  })
  async function request(path, { token, method = 'GET', headers = {}, body } = {}) {
    const response = await fetch(`${base}${path}`, {
      method,
      headers: { ...(token && { Authorization: `Bearer ${token}` }), ...headers },
      body,
    })
    return { status: response.status, headers: response.headers, body: await response.json() }
  }
  return { base, request }
}

it('concurrent last-seat joins admit one member only, then distribute private results', async (t) => {
  const { request } = await setup(t)
  const hostResponse = await request('/api/rooms', { method: 'POST' })
  assert.equal(hostResponse.status, 201)
  assert.equal(hostResponse.headers.get('cache-control'), 'no-store')
  const host = hostResponse.body
  const path = `/api/rooms/${host.room.code}`
  const guests = await Promise.all(Array.from({ length: 3 }, () => request(`${path}/join`, { method: 'POST' })))
  assert.ok(guests.every(guest => guest.status === 201))
  const racers = await Promise.all(Array.from({ length: 8 }, () => request(`${path}/join`, { method: 'POST' })))
  assert.equal(racers.filter(response => response.status === 201).length, 1)
  for (const rejected of racers.filter(response => response.status !== 201)) {
    assert.equal(rejected.status, 409)
    assert.deepEqual(rejected.body, { error: { code: 'ROOM_FULL', message: '房间已满' } })
  }
  const fifth = racers.find(response => response.status === 201).body
  const members = [host, ...guests.map(guest => guest.body), fifth]
  assert.equal((await request(path, { token: host.token })).body.room.memberCount, 5)
  const nonHostStart = await request(`${path}/start`, { method: 'POST', token: fifth.token })
  assert.equal(nonHostStart.status, 403)
  assert.equal(nonHostStart.body.error.code, 'HOST_ONLY')
  const started = await request(`${path}/start`, { method: 'POST', token: host.token })
  assert.equal(started.status, 200)
  const snapshots = await Promise.all(members.map(member => request(path, { token: member.token })))
  const results = snapshots.map(snapshot => snapshot.body.room.result)
  assert.equal(new Set(results.map(result => result.characterRoll)).size, 5)
  for (const [index, snapshot] of snapshots.entries()) {
    assert.equal(snapshot.headers.get('cache-control'), 'no-store')
    const serialized = JSON.stringify(snapshot.body)
    for (const member of members)
      assert.equal(serialized.includes(member.token), false)
    for (const [otherIndex, result] of results.entries()) {
      if (otherIndex !== index)
        assert.equal(serialized.includes(JSON.stringify(result.characterRoll)), false)
    }
  }
  assert.deepEqual((await request(`${path}/start`, { method: 'POST', token: host.token })).body, started.body)
  const resumed = await request(path, { token: fifth.token })
  assert.deepEqual(resumed.body, snapshots[4].body)
})

it('api requires bearer identity and ignores body/query attempts to select another member', async (t) => {
  const { request } = await setup(t)
  const host = (await request('/api/rooms', { method: 'POST' })).body
  const path = `/api/rooms/${host.room.code}`
  const guest = (await request(`${path}/join`, { method: 'POST' })).body
  for (const options of [{}, { token: host.room.members[0].id }, { token: 'x'.repeat(43) }]) {
    const response = await request(path, options)
    assert.equal(response.status, 401)
    assert.equal(response.body.error.code, 'INVALID_MEMBER')
  }
  const impersonated = await request(`${path}/start?token=${host.token}`, {
    method: 'POST',
    token: guest.token,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token: host.token, memberId: host.room.members[0].id, isHost: true, result: 'FAKE' }),
  })
  assert.equal(impersonated.status, 403)
  assert.equal(impersonated.body.error.code, 'HOST_ONLY')
  const notFull = await request(`${path}/start`, { method: 'POST', token: host.token })
  assert.equal(notFull.status, 409)
  assert.equal(notFull.body.error.code, 'ROOM_NOT_FULL')
  assert.equal((await request(`${path}/leave`, { method: 'POST', token: guest.token })).status, 200)
  assert.equal((await request(path, { token: guest.token })).status, 401)
  assert.equal((await request(path, { token: host.token })).body.room.memberCount, 1)
})

it('mutations enforce same-site origin and request size limits', async (t) => {
  const { base, request } = await setup(t)
  const forbidden = await request('/api/rooms', { method: 'POST', headers: { Origin: 'https://other.example' } })
  assert.equal(forbidden.status, 403)
  assert.equal(forbidden.body.error.code, 'INVALID_ORIGIN')
  assert.equal(forbidden.headers.get('access-control-allow-origin'), null)
  assert.equal((await request('/api/rooms', { method: 'POST', headers: { Origin: base } })).status, 201)
  const oversized = await request('/api/rooms', { method: 'POST', body: 'x'.repeat(1025) })
  assert.equal(oversized.status, 413)
  assert.equal(oversized.body.error.code, 'BODY_TOO_LARGE')
  const streamed = await fetch(`${base}/api/rooms`, {
    method: 'POST',
    body: (async function* () {
      yield 'x'.repeat(512)
      yield 'y'.repeat(1025)
    })(),
    duplex: 'half',
  })
  assert.equal(streamed.status, 413)
  assert.equal((await streamed.json()).error.code, 'BODY_TOO_LARGE')
})

it('creation is rate limited, health stays available, and the window resets', async (t) => {
  let time = 0
  const { request } = await setup(t, { now: () => time, store: createRoomStore({ now: () => time }) })
  for (let index = 0; index < 12; index++)
    assert.equal((await request('/api/rooms', { method: 'POST' })).status, 201)
  const limited = await request('/api/rooms', { method: 'POST' })
  assert.equal(limited.status, 429)
  assert.equal(limited.body.error.code, 'RATE_LIMITED')
  assert.equal(limited.headers.get('retry-after'), '60')
  assert.equal((await request('/api/health')).status, 200)
  time = 60_000
  assert.equal((await request('/api/rooms', { method: 'POST' })).status, 201)
})

it('proxy IP trust is opt-in and uses the nearest forwarded address', async (t) => {
  const untrusted = await setup(t)
  const trusted = await setup(t, { trustProxy: true })
  for (let index = 0; index < 13; index++) {
    const options = { method: 'POST', headers: { 'X-Forwarded-For': `192.0.2.123, 192.0.2.${index + 1}` } }
    assert.equal((await untrusted.request('/api/rooms', options)).status, index < 12 ? 201 : 429)
    assert.equal((await trusted.request('/api/rooms', options)).status, 201)
  }
  const fixedNearest = await setup(t, { trustProxy: true })
  for (let index = 0; index < 13; index++) {
    const response = await fixedNearest.request('/api/rooms', {
      method: 'POST',
      headers: { 'X-Forwarded-For': `192.0.2.${index + 1}, 192.0.2.200` },
    })
    assert.equal(response.status, index < 12 ? 201 : 429)
  }
})

it('serves SPA deep links and assets with health, while missing assets and APIs stay 404', async (t) => {
  const { base, request } = await setup(t)
  for (const path of ['/', '/room', '/room/123456', '/roll/false']) {
    const response = await fetch(`${base}${path}`)
    assert.equal(response.status, 200)
    assert.match(response.headers.get('content-type'), /text\/html/)
    assert.match(await response.text(), /LOLM ROLL test/)
  }
  const asset = await fetch(`${base}/example.js`)
  assert.equal(asset.status, 200)
  assert.equal(asset.headers.get('cache-control'), 'public, max-age=3600')
  assert.match(asset.headers.get('content-type'), /text\/javascript/)
  assert.equal((await fetch(`${base}/example.js`, { method: 'HEAD' })).status, 200)
  assert.equal((await fetch(`${base}/missing.png`)).status, 404)
  assert.equal((await request('/api/missing')).status, 404)
  assert.equal((await request('/api')).status, 404)
  assert.equal((await request('/api/rooms/not-a-code')).status, 404)
  assert.equal((await request('/api/rooms/123456', { method: 'DELETE' })).status, 405)
  assert.deepEqual((await request('/api/health')).body, { ok: true })
})
