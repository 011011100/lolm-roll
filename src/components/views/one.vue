<script setup>
import Case from "@/components/views/case.vue";

const props = defineProps({
  rollData: Object
})

</script>

<template>
  <div class="one-case">
    <case :roll-data="rollData"></case>
  </div>
</template>

<style>

.one-case {
  display: flex;
  flex-direction: column;
}

</style>
