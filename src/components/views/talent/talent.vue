<script setup>
import {computed} from "vue";

const props = defineProps({
  talentName: String,
})

const ImgUrl = computed(() => {
  return "/assets/talent/" + props.talentName + ".webp"
})

</script>

<template>
  <div>
    <img :src="ImgUrl" :alt="talentName" width="64" height="64">
  </div>
</template>

<style scoped>

</style>
