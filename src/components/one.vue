<script setup>
import Case from '@/components/views/case.vue'

const props = defineProps({
  rollData: Object,
})
</script>

<template>
  <div class="flex flex-col">
    <Case :roll-data="props.rollData" />
  </div>
</template>
