<script setup>
import {onMounted,ref} from 'vue'
import {useRoute, useRouter} from 'vue-router';
import Character from "@/components/views/character/character.vue";
import Position from "@/components/views/position/position.vue";
import Skill from "@/components/views/skill/skill.vue";
import Talent from "@/components/views/talent/talent.vue";
import {CharacterName} from "@/components/enums/characterName.js";
import {PositionName} from "@/components/enums/positionName.js";
import {SkillName} from "@/components/enums/skillName.js";
import {TalentName} from "@/components/enums/talentName.js";

const route = useRoute()
const isFive = route.params.isFive

const r = useRouter()

const data = ref([])

// 页面渲染时执行
onMounted(() => {
  console.log("roll")
  roll()
})

function roll() {
  let forNum = 1
  let fivePosition = [...rollFivePosition()];
  if (isFive === 'true' ) {
    forNum = 5
  }
  console.log(fivePosition)
  for ( let i = 0; i < forNum; i++) {
    let o = {
      characterRoll: "",
      positionRoll: null,
      skillRoll: [],
      talentRoll: 0,
    }
    o.characterRoll = rollCharacter();
    o.positionRoll = rollPosition();
    if (isFive === 'true') {
      o.positionRoll = fivePosition[i]
    }
    if (o.positionRoll === "打野"){
      o.skillRoll = rollSkillJug()
    }else {
      o.skillRoll = rollSkill();
    }
    o.talentRoll = rollTalent();
    data.value.push(o);
  }
  console.log(data)
}

// 随机英雄
function rollCharacter() {
  const random = Math.floor(Math.random() * CharacterName.length)
  return CharacterName[random];
}

// 随机位置s
function rollFivePosition() {
  let pn = [...PositionName]
  // 随机5个位置
  let rr = []
  for (let i = 0; i < 5; i++) {
    let number = Math.floor(Math.random() * pn.length);
    rr.push(pn[number])
    pn.splice(number, 1)
  }
  return rr
}

// 随机位置
function rollPosition() {
  return PositionName[Math.floor(Math.random() * PositionName.length)];
}


// 随机召唤师技能
function rollSkillJug() {
  // 复制SkillName至sn
  let sn = [...SkillName]
  let number = 6;
  let n1 = sn[number];
  // 在sn中去除n1
  sn.splice(number, 1)
  let n2 = sn[Math.floor(Math.random() * sn.length)];
  return [n1, n2]
}

// 随机召唤师技能
function rollSkill() {
  // 复制SkillName至sn
  let sn = [...SkillName]
  // 去除惩戒
  sn.splice(sn.length-1, 1)
  let number = Math.floor(Math.random() * sn.length);
  let n1 = sn[number];
  // 在sn中去除n1
  sn.splice(number, 1)
  let n2 = sn[Math.floor(Math.random() * sn.length)];
  return [n1, n2]
}

// 随机主天赋
function rollTalent() {
  return Math.floor(Math.random() * TalentName.length);
}

</script>

<template>
  <div style="display: flex">
    <template v-for="i in isFive === 'true' ? 5: 1">
      <div v-if="data[i-1]" style="display: flex;flex-direction: column">
        <character :character-name="data[i-1].characterRoll"></character>
        <position :portion="data[i-1].positionRoll"></position>
        <skill :skill="data[i-1].skillRoll[0]"></skill>
        <skill :skill="data[i-1].skillRoll[1]"></skill>
        <talent :talent="data[i-1].talentRoll"></talent>
      </div>
    </template>
  </div>
</template>

<style>

</style>
