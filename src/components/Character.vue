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
    aspectRatio: `${props.width} / ${props.height}`,
  }
})
</script>

<template>
  <DestylerImageRoot :style="rootStyle" class="character-portrait">
    <DestylerImage :src="imgUrl" :alt="props.name" class="portrait-image" />
    <DestylerImageFallback class="portrait-fallback">
      {{ props.name }}
    </DestylerImageFallback>
  </DestylerImageRoot>
</template>

<style scoped>
.character-portrait {
  display: block;
  width: 100%;
  overflow: hidden;
}

.portrait-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center 25%;
}

.portrait-fallback {
  display: grid;
  place-items: center;
  width: 100%;
  height: 100%;
  color: var(--color-gold);
}
</style>
