<script setup>
const route = useRoute()
const isFive = route.params.isFive

const data = ref([])

// 页面渲染时执行
onMounted(() => {
  roll()
})

function roll() {
  let forNum = 1
  const fivePosition = [...rollFivePosition()]
  const fiveCharacter = [...rollFiveCharacter()]
  if (isFive === 'true')
    forNum = 5

  for (let i = 0; i < forNum; i++) {
    const o = {
      characterRoll: '',
      positionRoll: '',
      skillRoll: [],
      talentRoll: '',
    }
    o.characterRoll = fiveCharacter[i]
    o.positionRoll = fivePosition[i]
    if (o.positionRoll === '打野')
      o.skillRoll = rollSkillJug()
    else
      o.skillRoll = rollSkill()

    o.talentRoll = rollTalent()
    data.value.push(o)
  }
}
</script>

<template>
  <div style="display: flex">
    <template v-if="isFive === 'true'">
      <Five :roll-data-list="data" />
    </template>
    <template v-else>
      <One :roll-data="data[0]" />
    </template>
  </div>
</template>

<style>

</style>
