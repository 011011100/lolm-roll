<script setup>
const props = defineProps({
  rollData: Object,
})
</script>

<template>
  <div class="one-layout">
    <Case :roll-data="props.rollData" />
  </div>
</template>

<style scoped>
.one-layout {
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>
