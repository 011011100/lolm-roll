import process from 'node:process'
import { createServer } from 'vite'
import { createAppServer } from '../server/http.js'

const api = createAppServer()
let vite
let stopping = false

async function stop(exitCode = 0) {
  if (stopping)
    return
  stopping = true
  api.closeAllConnections()
  await Promise.all([
    new Promise(resolve => api.close(resolve)),
    vite?.close(),
  ])
  process.exitCode = exitCode
}

process.once('SIGINT', () => stop())
process.once('SIGTERM', () => stop())

try {
  await new Promise((resolve, reject) => {
    api.once('error', reject)
    api.listen(Number(process.env.API_PORT || 3000), '127.0.0.1', resolve)
  })
  vite = await createServer()
  await vite.listen()
  vite.printUrls()
}
catch (error) {
  console.error(error)
  await stop(1)
}
