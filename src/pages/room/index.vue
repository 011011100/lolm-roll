<script setup>
import { onScopeDispose, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router/auto'
import { forgetRoomToken, getRoomToken, roomRequest, saveRoomToken } from '../../composables/useRoom.js'
import '../../styles/room.css'

const router = useRouter()
const route = useRoute()
const code = ref(/^\d{6}$/.test(String(route.query.code || '')) ? String(route.query.code) : '')
const pending = ref('')
const errorMessage = ref('')
let controller
let disposed = false

async function enterRoom(action) {
  if (pending.value)
    return
  const roomCode = code.value.trim()
  if (action === 'join' && !/^\d{6}$/.test(roomCode)) {
    errorMessage.value = '请输入 6 位数字房间码。'
    return
  }
  pending.value = action
  errorMessage.value = ''
  controller = new AbortController()
  try {
    const token = action === 'join' ? getRoomToken(roomCode) : ''
    if (token) {
      try {
        await roomRequest(`/${roomCode}`, { token, signal: controller.signal })
        if (!disposed)
          await router.push(`/room/${roomCode}`)
        return
      }
      catch (error) {
        if (disposed)
          return
        if (error.status !== 401 && error.status !== 404)
          throw error
        forgetRoomToken(roomCode)
      }
    }
    const data = await roomRequest(action === 'create' ? '' : `/${roomCode}/join`, {
      method: 'POST',
      signal: controller.signal,
    })
    if (disposed)
      return
    saveRoomToken(data.room.code, data.token)
    await router.push(`/room/${data.room.code}`)
  }
  catch (error) {
    if (!disposed)
      errorMessage.value = error.message
  }
  finally {
    if (!disposed)
      pending.value = ''
  }
}

onScopeDispose(() => {
  disposed = true
  controller?.abort()
})
</script>

<template>
  <section class="room-entry room-page" aria-labelledby="room-entry-title">
    <div class="room-intro">
      <p class="room-eyebrow">
        五人随机 · 房间组队
      </p>
      <h1 id="room-entry-title" class="room-title">
        五个人，<br><span>同一场未知。</span>
      </h1>
      <p class="room-description">
        把房间码分享给队友，集齐 5 人后由房主开始。<br>
        每人只会看到自己的英雄、位置、天赋和召唤师技能。
      </p>
      <div class="room-entry-links">
        <RouterLink class="room-text-link" to="/">
          返回首页
        </RouterLink>
        <RouterLink class="room-text-link" to="/roll/true">
          本机五人随机
        </RouterLink>
      </div>
    </div>

    <div class="room-entry-panel">
      <div class="room-create-block">
        <p class="room-step-label">
          邀请你的队友
        </p>
        <h2>创建一个新房间</h2>
        <p class="room-small-note">
          你将成为房主，并占用一个位置。
        </p>
        <button class="room-button room-button-primary room-button-wide" :disabled="Boolean(pending)" @click="enterRoom('create')">
          {{ pending === 'create' ? '正在创建…' : '创建房间' }}
          <span aria-hidden="true">↗</span>
        </button>
      </div>
      <div class="room-divider">
        <span>或者，加入队友的房间</span>
      </div>
      <form class="room-join-form" @submit.prevent="enterRoom('join')">
        <label for="room-code-input">房间码</label>
        <div class="room-join-row">
          <input
            id="room-code-input"
            v-model="code"
            class="room-code-input"
            name="room-code"
            type="text"
            inputmode="numeric"
            autocomplete="off"
            placeholder="6 位数字"
            maxlength="6"
            pattern="[0-9]{6}"
            title="请输入 6 位数字房间码"
            required
            :disabled="Boolean(pending)"
          >
          <button class="room-button room-button-secondary" type="submit" :disabled="Boolean(pending)">
            {{ pending === 'join' ? '加入中…' : '加入房间' }}
          </button>
        </div>
      </form>
      <p v-if="errorMessage" class="room-message room-message-error" role="alert">
        {{ errorMessage }}
      </p>
    </div>
  </section>
</template>
