import { onScopeDispose, ref, watch } from 'vue'

const memoryTokens = new Map()
const storagePrefix = 'lolm-room-member:'
export const roomStorageWarning = ref('')

export function getRoomToken(code) {
  if (memoryTokens.has(code))
    return memoryTokens.get(code)
  try {
    return sessionStorage.getItem(`${storagePrefix}${code}`) || ''
  }
  catch {
    return ''
  }
}

export function saveRoomToken(code, token) {
  memoryTokens.set(code, token)
  try {
    sessionStorage.setItem(`${storagePrefix}${code}`, token)
    roomStorageWarning.value = ''
  }
  catch {
    roomStorageWarning.value = '浏览器未允许保存房间身份，请保持此页面打开，刷新可能导致无法找回结果。'
  }
}

export function forgetRoomToken(code) {
  // Keep a tombstone so failed storage removal cannot revive a former identity.
  memoryTokens.set(code, '')
  try {
    sessionStorage.removeItem(`${storagePrefix}${code}`)
  }
  catch {
    // In-memory membership is still cleared when browser storage is unavailable.
  }
}

export async function roomRequest(path, { method = 'GET', token = '', signal } = {}) {
  const controller = new AbortController()
  const abort = () => controller.abort()
  let timedOut = false
  const timeout = setTimeout(() => {
    timedOut = true
    controller.abort()
  }, 12000)
  if (signal?.aborted)
    controller.abort()
  else
    signal?.addEventListener('abort', abort, { once: true })

  try {
    const response = await fetch(`/api/rooms${path}`, {
      method,
      signal: controller.signal,
      credentials: 'omit',
      cache: 'no-store',
      headers: {
        Accept: 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    })
    const data = await response.json().catch(() => null)
    if (!response.ok) {
      const error = new Error(data?.error?.message || '房间服务暂时不可用，请稍后再试。')
      error.status = response.status
      error.code = data?.error?.code
      throw error
    }
    if (!data)
      throw new Error('房间服务响应异常，请稍后再试。')
    return data
  }
  catch (error) {
    if (signal?.aborted)
      throw error
    if (timedOut)
      throw new Error('连接超时，请检查网络后重试。')
    if (error instanceof TypeError)
      throw new Error('暂时无法连接房间，请检查网络。')
    throw error
  }
  finally {
    clearTimeout(timeout)
    signal?.removeEventListener('abort', abort)
  }
}

export function useRoom(roomCode) {
  const room = ref(null)
  const loading = ref(true)
  const pending = ref('')
  const errorMessage = ref('')
  const connectionMessage = ref('')
  const fatalMessage = ref('')
  let code = ''
  let token = ''
  let generation = 0
  let timer
  let controller
  let disposed = false

  function cancelRequest() {
    generation++
    clearTimeout(timer)
    controller?.abort()
    controller = undefined
  }

  function isCurrent(version) {
    return !disposed && version === generation
  }

  function handleError(error, isPoll) {
    if (error.status === 401 || error.status === 404) {
      fatalMessage.value = error.status === 401
        ? '你已离开房间或离线时间过长，请重新加入。'
        : '房间已结束或过期，请创建新房间。'
      forgetRoomToken(code)
      room.value = null
      return
    }
    if (isPoll)
      connectionMessage.value = `${error.message} 正在自动重连…`
    else
      errorMessage.value = error.message
  }

  function scheduleRefresh() {
    clearTimeout(timer)
    if (!disposed && !fatalMessage.value && token)
      timer = setTimeout(refresh, 2000)
  }

  async function refresh() {
    if (controller || pending.value || disposed || !token || fatalMessage.value)
      return
    const version = generation
    controller = new AbortController()
    try {
      const data = await roomRequest(`/${code}`, { token, signal: controller.signal })
      if (!isCurrent(version))
        return
      room.value = data.room
      connectionMessage.value = ''
    }
    catch (error) {
      if (isCurrent(version))
        handleError(error, true)
    }
    finally {
      if (isCurrent(version)) {
        controller = undefined
        loading.value = false
        scheduleRefresh()
      }
    }
  }

  async function performAction(action) {
    if (pending.value || !token || fatalMessage.value || disposed)
      return false
    if (action === 'start' && !room.value?.canStart)
      return false
    cancelRequest()
    const version = generation
    pending.value = action
    errorMessage.value = ''
    controller = new AbortController()
    try {
      const data = await roomRequest(`/${code}/${action}`, {
        method: 'POST',
        token,
        signal: controller.signal,
      })
      if (!isCurrent(version))
        return false
      if (action === 'leave') {
        forgetRoomToken(code)
        token = ''
        room.value = null
      }
      else {
        room.value = data.room
        connectionMessage.value = ''
      }
      return true
    }
    catch (error) {
      if (isCurrent(version))
        handleError(error, false)
      return false
    }
    finally {
      if (isCurrent(version)) {
        controller = undefined
        pending.value = ''
        loading.value = false
        scheduleRefresh()
      }
    }
  }

  watch(roomCode, (value) => {
    cancelRequest()
    code = String(value || '')
    token = getRoomToken(code)
    room.value = null
    pending.value = ''
    errorMessage.value = ''
    connectionMessage.value = ''
    fatalMessage.value = ''
    loading.value = true
    if (!/^\d{6}$/.test(code))
      fatalMessage.value = '房间码应为 6 位数字，请重新输入。'
    else if (!token)
      fatalMessage.value = '请先加入房间，获得自己的队友位置。'
    if (fatalMessage.value)
      loading.value = false
    else
      refresh()
  }, { immediate: true })

  onScopeDispose(() => {
    disposed = true
    cancelRequest()
  })

  return {
    room,
    loading,
    pending,
    errorMessage,
    connectionMessage,
    fatalMessage,
    start: () => performAction('start'),
    leave: () => performAction('leave'),
  }
}
