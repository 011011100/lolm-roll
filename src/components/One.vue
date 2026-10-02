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
  width: min(100%, 370px);
  margin-inline: auto;
}
</style>
