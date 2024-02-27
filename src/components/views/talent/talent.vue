<script setup>
import {TalentName} from "@/components/enums/talentName.js";

defineProps({
  talent: Number
})

</script>

<template>
  <div>
    {{ TalentName[talent]}}
  </div>
</template>

<style scoped>

</style>
