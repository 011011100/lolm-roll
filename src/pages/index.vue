<script setup>

import {useRouter} from 'vue-router';

const router = useRouter()
  function jumpRoll(isFive) {
    router.push(`/roll/${encodeURIComponent(isFive)}`)
  }
</script>

<template>
  <div>
    <div class="roll">
      LOLM-ROLL
    </div>
    <div style="display: flex;justify-content: space-between;">
      <div class="roll-two" @click="jumpRoll(false)">
        单人随机
      </div>
      <div class="roll-two" @click="jumpRoll(true)">
        五人随机
      </div>
    </div>
  </div>
</template>

<style scoped>
.roll {
  font-family: Calibri;
  font-size: 190px;
  background: -webkit-linear-gradient(315deg, #61e7e2 25%, #4bfcac);
  -webkit-text-fill-color: transparent;
  -webkit-background-clip: text;
}

.roll-two {
  font-family: Calibri;
  font-size: 50px;
  background: -webkit-linear-gradient(315deg, #0e568a 25%, #1347bb);
  -webkit-text-fill-color: transparent;
  -webkit-background-clip: text;
}
</style>
