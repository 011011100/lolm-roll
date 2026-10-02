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
  <div class="five-layout" role="list" aria-label="五人随机阵容">
    <div
      v-for="(index, i) of sort"
      :key="i"
      class="five-item"
      role="listitem"
    >
      <Case :roll-data="index" compact />
    </div>
  </div>
</template>

<style scoped>
.five-layout {
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 14px;
  width: 100%;
}

.five-item {
  min-width: 0;
}

@media (max-width: 1000px) {
  .five-layout {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}

@media (max-width: 680px) {
  .five-layout {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 12px;
  }
}

@media (max-width: 600px) {
  .five-layout {
    grid-template-columns: minmax(0, 1fr);
  }
}
</style>
