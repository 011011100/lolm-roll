<script setup>
  import {computed} from "vue";
  const props = defineProps({
    characterName: String,
  })

  const ImgUrl = computed(()=>{
    return "src/assets/characterImg/" + props.characterName + ".jpg"
  })
</script>

<template>
  <img :src="ImgUrl" :alt="characterName">
</template>

<style >

</style>
