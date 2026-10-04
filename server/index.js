import process from 'node:process'
import { createAppServer } from './http.js'
import { createRoomStore } from './rooms.js'

const store = createRoomStore()
const server = createAppServer({ store, trustProxy: process.env.TRUST_PROXY === '1' })
const port = Number(process.env.PORT || 3000)
const cleanup = setInterval(() => store.sweep(), 30_000)
cleanup.unref()

server.listen(port, '0.0.0.0', () => {
  process.stdout.write(`LOLM ROLL listening on port ${port}\n`)
})

for (const signal of ['SIGTERM', 'SIGINT']) {
  process.once(signal, () => {
    clearInterval(cleanup)
    server.close(() => process.exit(0))
  })
}
