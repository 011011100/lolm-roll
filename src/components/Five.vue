<script setup>
import { computed } from 'vue'

const props = defineProps({
  rollDataList: Array,
})

const sort = computed(() => {
  const showDataList = []
  for (const rollDataListElement of props.rollDataList) {
    switch (rollDataListElement.positionRoll) {
      case '上单':
        showDataList[0] = rollDataListElement
        break
      case '打野':
        showDataList[1] = rollDataListElement
        break
      case '中单':
        showDataList[2] = rollDataListElement
        break
      case '射手':
        showDataList[3] = rollDataListElement
        break
      case '辅助':
        showDataList[4] = rollDataListElement
        break
    }
  }
  return showDataList
})
</script>

<template>
  <div class="five-layout">
    <div
      v-for="(index, i) of sort"
      :key="i"
      class="five-item"
    >
      <Case :roll-data="index" compact />
    </div>
  </div>
</template>

<style scoped>
.five-layout {
  display: flex;
  gap: 8px;
  width: 100%;
  overflow-x: auto;
  padding: 8px;
  box-sizing: border-box;
  scroll-snap-type: x mandatory;
}

.five-item {
  flex: 0 0 auto;
  scroll-snap-align: start;
}

@media (min-width: 1024px) {
  .five-layout {
    justify-content: center;
    overflow-x: visible;
  }
}

@media (orientation: landscape) and (max-height: 500px) {
  .five-layout {
    gap: 6px;
    padding: 4px;
  }
}
</style>
