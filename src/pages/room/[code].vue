<script setup>
import { computed, onScopeDispose, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router/auto'
import One from '../../components/One.vue'
import { roomStorageWarning, useRoom } from '../../composables/useRoom.js'
import '../../styles/room.css'

const route = useRoute()
const router = useRouter()
const code = computed(() => String(route.params.code || ''))
const { room, loading, pending, errorMessage, connectionMessage, fatalMessage, start, leave } = useRoom(code)
const copyMessage = ref('')
const seats = computed(() => Array.from({ length: 5 }, (_, index) => ({
  number: index + 1,
  member: room.value?.members.find(member => member.seat === index + 1),
})))
const isStarted = computed(() => room.value?.status === 'started')
let disposed = false

async function copyCode() {
  const currentCode = code.value
  try {
    await navigator.clipboard.writeText(currentCode)
    if (!disposed && code.value === currentCode)
      copyMessage.value = '房间码已复制，发给队友即可加入。'
  }
  catch {
    if (!disposed && code.value === currentCode)
      copyMessage.value = '复制失败，请手动复制上方房间码。'
  }
}

async function leaveRoom() {
  if (await leave())
    await router.replace('/room')
}

onScopeDispose(() => {
  disposed = true
})
</script>

<template>
  <section class="room-lobby room-page" :class="{ 'room-lobby-started': isStarted }" aria-labelledby="room-title">
    <template v-if="fatalMessage">
      <div class="room-empty-state">
        <p class="room-eyebrow">
          五人随机
        </p>
        <h1 id="room-title" class="room-title">
          重新与队友会合
        </h1>
        <p class="room-description" role="alert">
          {{ fatalMessage }}
        </p>
        <RouterLink class="room-button room-button-primary" :to="{ path: '/room', query: /^\d{6}$/.test(code) ? { code } : {} }">
          创建或加入房间
        </RouterLink>
      </div>
    </template>
    <template v-else>
      <header class="room-lobby-header">
        <div>
          <p class="room-eyebrow">
            {{ isStarted ? '五人随机 · 仅你可见' : '五人随机 · 等待队友' }}
          </p>
          <h1 id="room-title" class="room-title">
            {{ isStarted ? '你的专属随机结果' : '五个位置，等你们到齐。' }}
          </h1>
          <p class="room-description">
            {{ isStarted ? '带上你的搭配，与队友一起出发。' : '分享房间码，满 5 人后由房主开始随机。' }}
          </p>
        </div>
        <div class="room-code-block">
          <span class="room-step-label">房间码</span>
          <div class="room-code-row">
            <span class="room-code-value">{{ code }}</span>
            <button class="room-copy-button" aria-label="复制房间码" @click="copyCode">
              复制
            </button>
          </div>
          <p v-if="copyMessage" class="room-copy-message" role="status">
            {{ copyMessage }}
          </p>
        </div>
      </header>

      <p v-if="roomStorageWarning" class="room-message" role="status">
        {{ roomStorageWarning }}
      </p>
      <p v-if="connectionMessage" class="room-message" role="status">
        {{ connectionMessage }}
      </p>
      <p v-if="errorMessage" class="room-message room-message-error" role="alert">
        {{ errorMessage }}
      </p>

      <div v-if="loading && !room" class="room-loading" role="status">
        正在连接房间…
      </div>
      <div v-else-if="room" class="room-content">
        <div class="room-roster" :class="{ 'room-roster-compact': isStarted }">
          <div class="room-roster-heading">
            <p class="room-count" role="status">
              当前人数 <strong>{{ room.memberCount }}</strong><span>/ 5</span>
            </p>
            <span class="room-status-badge" :class="{ 'room-status-full': room.memberCount === 5 }">
              {{ isStarted ? '随机已完成' : room.memberCount === 5 ? '房间已满' : `还差 ${5 - room.memberCount} 人` }}
            </span>
          </div>
          <ol class="room-seats" aria-label="房间成员">
            <li v-for="seat in seats" :key="seat.number" class="room-seat" :class="{ 'room-seat-joined': seat.member, 'room-seat-self': seat.member?.isYou }">
              <span class="room-seat-emblem" aria-hidden="true">{{ seat.member ? String(seat.number).padStart(2, '0') : '+' }}</span>
              <span class="room-seat-name">{{ seat.member ? seat.member.isYou ? '你已就位' : `队友 ${seat.number}` : isStarted ? '已离开' : '等待加入' }}</span>
              <span class="room-seat-role">{{ seat.member ? seat.member.isHost ? '房主' : '队员' : isStarted ? '本局已开始' : '空闲位置' }}</span>
            </li>
          </ol>
        </div>

        <div v-if="isStarted" class="room-private-result">
          <One v-if="room.result" :roll-data="room.result" />
          <p v-else class="room-description" role="status">
            正在获取你的随机结果…
          </p>
          <p class="room-result-note">
            {{ roomStorageWarning ? '这份结果仅你可见，请保持此页面打开。' : '这份结果仅你可见，刷新页面也会保留。' }}
          </p>
        </div>

        <div v-else class="room-start-panel">
          <button v-if="room.isHost" class="room-button room-button-primary room-start-button" :disabled="!room.canStart || Boolean(pending)" @click="start">
            {{ pending === 'start' ? '正在随机…' : room.canStart ? '开始随机' : `等待队友（${room.memberCount}/5）` }}
            <span v-if="room.canStart && !pending" aria-hidden="true">↗</span>
          </button>
          <p v-else class="room-waiting-text" role="status">
            {{ room.memberCount === 5 ? '房间已满，等待房主开始随机' : '等待队友加入，满员后由房主开始随机' }}
          </p>
          <p class="room-small-note">
            离线超过 1 分钟将让出位置；房主离开后自动转交。
          </p>
        </div>

        <div class="room-bottom-row">
          <span class="room-small-note">房间与结果最多保留 2 小时</span>
          <button class="room-text-link" :disabled="Boolean(pending)" @click="leaveRoom">
            {{ pending === 'leave' ? '正在离开…' : '离开房间' }}
          </button>
        </div>
      </div>
      <div v-else class="room-loading">
        <RouterLink class="room-text-link" to="/room">
          返回创建或加入房间
        </RouterLink>
      </div>
    </template>
  </section>
</template>
