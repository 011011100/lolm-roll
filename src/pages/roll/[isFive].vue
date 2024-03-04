<script setup>
import {onMounted, ref} from 'vue'
import {useRoute, useRouter} from 'vue-router';
import {rollUtil} from "@/components/js/rollUtil";
import One from "@/components/views/one.vue";
import Five from "@/components/views/five.vue";

const route = useRoute()
const isFive = route.params.isFive

const r = useRouter()

const data = ref([])

// 页面渲染时执行
onMounted(() => {
  roll()
})

function roll() {
  let forNum = 1
  let fivePosition = [...rollUtil.rollFivePosition()];
  let fiveCharacter = [...rollUtil.rollFiveCharacter()];
  if (isFive === 'true') {
    forNum = 5
  }
  for (let i = 0; i < forNum; i++) {
    let o = {
      characterRoll: "",
      positionRoll: "",
      skillRoll: [],
      talentRoll: "",
    }
    o.characterRoll = fiveCharacter[i]
    o.positionRoll = fivePosition[i]
    if (o.positionRoll === "打野") {
      o.skillRoll = rollUtil.rollSkillJug()
    } else {
      o.skillRoll = rollUtil.rollSkill();
    }
    o.talentRoll = rollUtil.rollTalent();
    data.value.push(o);
  }
}

</script>

<template>
  <div style="display: flex">
    <template v-if="isFive === 'true'">
      <five :roll-data-list="data"></five>
    </template>
    <template v-else>
      <one :roll-data="data[0]"></one>
    </template>
  </div>
</template>

<style>

</style>
