<script setup>
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
  <div
    v-for="index of sort"
    :key="index"
    class="flex px-2 flex-col"
  >
    <Case :roll-data="index" />
  </div>
</template>

<style>

</style>
