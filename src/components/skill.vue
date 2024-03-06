<script setup>
const props = defineProps({
  skillName: String,
  width: {
    type: Number,
    default: 64,
  },
  height: {
    type: Number,
    default: 64,
  },
})

const ImgUrl = computed(() => {
  return `/assets/skill/${props.skillName}.webp`
})
</script>

<template>
  <img :src="ImgUrl" :alt="skillName" :width="width" :height="height">
</template>

<style scoped>

</style>
