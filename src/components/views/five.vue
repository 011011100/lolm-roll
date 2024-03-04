<script setup>

import Case from "@/components/views/case.vue";
import {computed} from "vue";

const props = defineProps({
  rollDataList: Array
})

const sort = computed(() => {
  let showDataList = []
  for (let rollDataListElement of props.rollDataList) {
    switch (rollDataListElement.positionRoll) {
      case "上单":
        showDataList[0] = rollDataListElement
        break
      case "打野":
        showDataList[1] = rollDataListElement
        break
      case "中单":
        showDataList[2] = rollDataListElement
        break
      case "射手":
        showDataList[3] = rollDataListElement
        break
      case "辅助":
        showDataList[4] = rollDataListElement
        break
    }
  }
  return showDataList
})

</script>

<template>
  <div v-for="index of sort" style="display: flex;
    padding-left: 8px;
    padding-right: 8px;
    flex-direction: column;">
    <case :roll-data="index"></case>
  </div>
</template>

<style>

</style>
