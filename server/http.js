import { createHash } from 'node:crypto'
import { readFile } from 'node:fs/promises'
import { createServer } from 'node:http'
import { extname, resolve, sep } from 'node:path'
import { fileURLToPath } from 'node:url'
import { RoomError, createRoomStore } from './rooms.js'

const DEFAULT_DIST = fileURLToPath(new URL('../dist', import.meta.url))
const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
}

function json(response, status, body) {
  response.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store',
    'X-Content-Type-Options': 'nosniff',
  })
  response.end(JSON.stringify(body))
}

function bearer(request) {
  const match = /^Bearer ([\w-]{43})$/.exec(request.headers.authorization || '')
  if (!match)
    throw new RoomError(401, 'INVALID_MEMBER', '成员身份已失效，请重新加入房间')
  return match[1]
}

function checkOrigin(request) {
  const origin = request.headers.origin
  if (!origin)
    return
  try {
    const parsed = new URL(origin)
    if (['http:', 'https:'].includes(parsed.protocol) && parsed.host === request.headers.host)
      return
  }
  catch {}
  throw new RoomError(403, 'INVALID_ORIGIN', '请从当前网站操作房间')
}

async function checkBody(request) {
  let size = 0
  if (Number(request.headers['content-length']) > 1024) {
    request.resume()
    throw new RoomError(413, 'BODY_TOO_LARGE', '请求内容过大')
  }
  await new Promise((resolveBody, reject) => {
    function finish(error) {
      request.off('data', onData)
      request.off('end', onEnd)
      request.off('error', finish)
      request.off('aborted', onAborted)
      if (error) {
        request.resume()
        reject(error)
      }
      else {
        resolveBody()
      }
    }
    function onData(chunk) {
      size += chunk.length
      if (size > 1024)
        finish(new RoomError(413, 'BODY_TOO_LARGE', '请求内容过大'))
    }
    function onEnd() {
      finish()
    }
    function onAborted() {
      finish(new RoomError(400, 'REQUEST_ABORTED', '请求已中断'))
    }
    request.on('data', onData)
    request.once('end', onEnd)
    request.once('error', finish)
    request.once('aborted', onAborted)
  })
}

function createRateLimiter(now) {
  const entries = new Map()
  let nextSweep = 0
  return (key, limit) => {
    const time = now()
    if (time >= nextSweep) {
      for (const [current, entry] of entries) {
        if (time >= entry.expiresAt)
          entries.delete(current)
      }
      nextSweep = time + 60_000
    }
    let entry = entries.get(key)
    if (!entry || time >= entry.expiresAt) {
      if (!entry && entries.size >= 10000)
        throw new RoomError(429, 'RATE_LIMITED', '请求过于频繁，请稍后再试')
      entry = { count: 0, expiresAt: time + 60_000 }
      entries.set(key, entry)
    }
    if (++entry.count > limit)
      throw new RoomError(429, 'RATE_LIMITED', '请求过于频繁，请稍后再试')
  }
}

export function createAppServer({
  store = createRoomStore(),
  distDir = DEFAULT_DIST,
  trustProxy = false,
  now = Date.now,
} = {}) {
  const root = resolve(distDir)
  const limit = createRateLimiter(now)

  async function serveStatic(request, response, pathname) {
    if (!['GET', 'HEAD'].includes(request.method))
      throw new RoomError(405, 'METHOD_NOT_ALLOWED', '不支持此请求方式')
    let decoded
    try {
      decoded = decodeURIComponent(pathname)
    }
    catch {
      throw new RoomError(400, 'INVALID_PATH', '无效的请求路径')
    }
    const path = resolve(root, `.${decoded}`)
    if (path !== root && !path.startsWith(`${root}${sep}`))
      throw new RoomError(404, 'NOT_FOUND', '页面不存在')
    // Only extensionless application routes fall back to the SPA entrypoint.
    const target = extname(path) ? path : resolve(root, 'index.html')
    let content
    try {
      content = await readFile(target)
    }
    catch (error) {
      if (error.code === 'ENOENT' || error.code === 'EISDIR')
        throw new RoomError(404, 'NOT_FOUND', '页面不存在')
      throw error
    }
    const extension = extname(target)
    response.writeHead(200, {
      'Content-Type': TYPES[extension] || 'application/octet-stream',
      'Content-Length': content.length,
      'Cache-Control': extension === '.html' ? 'no-cache' : 'public, max-age=3600',
      'X-Content-Type-Options': 'nosniff',
    })
    response.end(request.method === 'HEAD' ? undefined : content)
  }

  const server = createServer(async (request, response) => {
    try {
      const { pathname } = new URL(request.url, 'http://localhost')
      if (pathname === '/api/health' && request.method === 'GET') {
        json(response, 200, { ok: true })
        return
      }
      if (pathname !== '/api' && !pathname.startsWith('/api/')) {
        await serveStatic(request, response, pathname)
        return
      }

      const forwarded = request.headers['x-forwarded-for']?.split(',').at(-1)?.trim()
      const address = (trustProxy && forwarded) || request.socket.remoteAddress || 'unknown'
      const authorization = request.headers.authorization || ''
      const identity = /^Bearer [\w-]{43}$/.test(authorization)
        ? createHash('sha256').update(authorization).digest('hex')
        : address
      limit(`requests:${identity}`, 180)

      if (request.method === 'POST') {
        checkOrigin(request)
        await checkBody(request)
      }
      if (pathname === '/api/rooms' && request.method === 'POST') {
        limit(`create:${address}`, 12)
        json(response, 201, store.create())
        return
      }
      const match = /^\/api\/rooms\/(\d{6})(?:\/(join|start|leave))?$/.exec(pathname)
      if (!match)
        throw new RoomError(404, 'NOT_FOUND', '接口不存在')
      const [, code, action] = match
      if (request.method === 'POST' && action === 'join') {
        limit(`join:${address}`, 60)
        json(response, 201, store.join(code))
      }
      else if (request.method === 'GET' && !action) {
        json(response, 200, store.get(code, bearer(request)))
      }
      else if (request.method === 'POST' && action === 'start') {
        json(response, 200, store.start(code, bearer(request)))
      }
      else if (request.method === 'POST' && action === 'leave') {
        json(response, 200, store.leave(code, bearer(request)))
      }
      else {
        throw new RoomError(405, 'METHOD_NOT_ALLOWED', '不支持此请求方式')
      }
    }
    catch (error) {
      if (error instanceof RoomError) {
        if (error.status === 429)
          response.setHeader('Retry-After', '60')
        json(response, error.status, { error: { code: error.code, message: error.message } })
      }
      else {
        console.error('Request failed:', error)
        json(response, 500, { error: { code: 'INTERNAL_ERROR', message: '服务暂时不可用，请稍后重试' } })
      }
    }
  })
  server.requestTimeout = 10_000
  server.headersTimeout = 10_000
  server.keepAliveTimeout = 5000
  return server
}
