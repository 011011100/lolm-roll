<script setup>
const props = defineProps({
  rollData: {
    type: Object,
    default: () => {
      return {
        characterRoll: '',
        positionRoll: '',
        skillRoll: [],
        talentRoll: '',
      }
    },
  },
})
</script>

<template>
  <Character :name="props.rollData.characterRoll" />
  <div class="flex justify-between">
    <Talent :talent-name="props.rollData.talentRoll" />
    <Position :portion="props.rollData.positionRoll" />
    <div class="flex">
      <Skill :skill-name="props.rollData.skillRoll[0]" />
      <Skill :skill-name="props.rollData.skillRoll[1]" />
    </div>
  </div>
</template>

<style>

</style>
