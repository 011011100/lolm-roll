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
  compact: {
    type: Boolean,
    default: false,
  },
})
</script>

<template>
  <Character
    :name="props.rollData.characterRoll"
    :width="props.compact ? 140 : 308"
    :height="props.compact ? 250 : 560"
  />
  <div class="info-row">
    <Talent :talent-name="props.rollData.talentRoll" />
    <Position :portion="props.rollData.positionRoll" />
    <div class="flex">
      <Skill :skill-name="props.rollData.skillRoll[0]" />
      <Skill :skill-name="props.rollData.skillRoll[1]" />
    </div>
  </div>
</template>

<style scoped>
.info-row {
  display: flex;
  justify-content: space-between;
}
</style>
