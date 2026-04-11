<script setup>
import { DestylerButton } from '@destyler/button'

const router = useRouter()

function jumpRoll(isFive) {
  router.push(`/roll/${encodeURIComponent(isFive)}`)
}
</script>

<template>
  <div class="home">
    <div class="title text-green-gradient">
      LOLM-ROLL
    </div>
    <div class="action-row">
      <DestylerButton
        class="action-btn cursor-pointer text-blue-gradient"
        @click="jumpRoll(false)"
      >
        单人随机
      </DestylerButton>
      <DestylerButton
        class="action-btn cursor-pointer text-blue-gradient"
        @click="jumpRoll(true)"
      >
        五人随机
      </DestylerButton>
    </div>
  </div>
</template>

<style scoped>
.text-green-gradient {
  background: -webkit-linear-gradient(315deg, #61e7e2 25%, #4bfcac);
  -webkit-text-fill-color: transparent;
  -webkit-background-clip: text;
}

.text-blue-gradient {
  background: -webkit-linear-gradient(315deg, #0e568a 25%, #1347bb);
  -webkit-text-fill-color: transparent;
  -webkit-background-clip: text;
}

.home {
  width: min(100%, 960px);
}

.title {
  font-size: clamp(2.2rem, 8vw, 7rem);
  text-align: center;
}

.action-row {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  margin-top: 24px;
}

.action-btn {
  font-size: clamp(1.5rem, 5vw, 3rem);
}

@media (max-width: 640px) {
  .action-row {
    flex-direction: column;
  }
}
</style>
