<script setup>
import {PositionName} from "@/components/enums/positionName.js";

defineProps({
  portion: String
})

</script>

<template>
  <div>
    {{ portion }}
  </div>
</template>

<style scoped>

</style>
