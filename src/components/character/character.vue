<script setup>
const props = defineProps({
  characterName: String,
  weight: {
    type: Number,
    default: 308,
  },
  height: {
    type: Number,
    default: 560,
  },
})

const ImgUrl = computed(() => {
  return `/assets/character/${props.characterName}.jpg`
})
</script>

<template>
  <img :src="ImgUrl" :alt="characterName" :width="weight" :height="height">
</template>

<style>

</style>
