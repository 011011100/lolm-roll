<script setup>
const props = defineProps({
  rollData: Object,
})
</script>

<template>
  <div class="flex flex-col">
    <Case :roll-data="props.rollData" />
  </div>
</template>
