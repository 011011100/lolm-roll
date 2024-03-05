<script setup>
import Character from '@/components/views/character/character.vue'
import Skill from '@/components/views/skill/skill.vue'
import Talent from '@/components/views/talent/talent.vue'
import Position from '@/components/views/position/position.vue'

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
  <Character :character-name="rollData.characterRoll" />
  <div style="display: flex;justify-content: space-between">
    <Talent :talent-name="rollData.talentRoll" />
    <Position :portion="rollData.positionRoll" />
    <div style="display: flex">
      <Skill :skill-name="rollData.skillRoll[0]" />
      <Skill :skill-name="rollData.skillRoll[1]" />
    </div>
  </div>
</template>

<style>

</style>
