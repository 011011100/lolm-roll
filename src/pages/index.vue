<script setup>
import { DestylerButton } from '@destyler/button'

const router = useRouter()

function jumpRoll(isFive) {
  router.push(`/roll/${encodeURIComponent(isFive)}`)
}
</script>

<template>
  <div>
    <div class="text-9xl text-green-gradient">
      LOLM-ROLL
    </div>
    <div class="flex justify-between mt-6">
      <DestylerButton
        class="text-5xl cursor-pointer text-blue-gradient"
        @click="jumpRoll(false)"
      >
        单人随机
      </DestylerButton>
      <DestylerButton
        class="text-5xl cursor-pointer text-blue-gradient"
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
</style>
