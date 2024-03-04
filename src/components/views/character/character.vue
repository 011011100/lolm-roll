<script setup>
  import {computed} from "vue";
  const props = defineProps({
    characterName: String,
  })

  const ImgUrl = computed(()=>{
    return "/public/assets/characterImg/" + props.characterName + ".jpg"
  })
</script>

<template>
  {{ImgUrl}}
  <img :src="ImgUrl" :alt="characterName">
</template>

<style >

</style>
