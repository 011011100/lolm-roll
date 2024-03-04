<script setup>

import Character from "@/components/views/character/character.vue";
import Skill from "@/components/views/skill/skill.vue";
import Talent from "@/components/views/talent/talent.vue";
import Position from "@/components/views/position/position.vue";

const props = defineProps({
  rollData: {
    type: Object,
    default: {
      characterRoll: String,
      positionRoll: String,
      skillRoll: [],
      talentRoll: String
    }
  }
})

</script>

<template>
  <character :character-name="rollData.characterRoll"></character>
  <div style="display: flex;justify-content: space-between">
    <talent :talent-name="rollData.talentRoll"></talent>
    <position :portion="rollData.positionRoll"></position>
    <div style="display: flex">
      <skill :skill-name="rollData.skillRoll[0]"></skill>
      <skill :skill-name="rollData.skillRoll[1]"></skill>
    </div>
  </div>
</template>

<style>

</style>
