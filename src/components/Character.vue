<script setup>
import { computed } from 'vue'

const props = defineProps({
  name: {
    type: String,
    required: true,
  },
  width: {
    type: Number,
    required: false,
    default: 308,
  },
  height: {
    type: Number,
    required: false,
    default: 560,
  },
})

const imgUrl = computed(() => {
  return `/assets/character/${props.name}.jpg`
})
const rootStyle = computed(() => {
  return {
    width: `${props.width}px`,
    height: `${props.height}px`,
  }
})
</script>

<template>
  <DestylerImageRoot :style="rootStyle" class="block overflow-hidden">
    <DestylerImage :src="imgUrl" :alt="props.name" class="w-full h-full object-cover" />
    <DestylerImageFallback class="flex h-full w-full items-center justify-center rounded-full ">
      {{ props.name }}
    </DestylerImageFallback>
  </DestylerImageRoot>
</template>
