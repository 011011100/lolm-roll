<script setup>
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router/auto'
import { rollFiveCharacter, rollFivePosition, rollSkill, rollSkillJug, rollTalent } from '../../composables/roll.js'

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
  <section class="roll-page" :class="{ 'roll-page-solo': isFive !== 'true' }" aria-labelledby="result-title">
    <header class="result-header">
      <div>
        <p class="result-eyebrow">
          <span aria-hidden="true" />{{ isFive === 'true' ? '五人随机' : '单人随机' }}
        </p>
        <h1 id="result-title">
          {{ isFive === 'true' ? '五个位置，无限可能。' : '你的下一位英雄。' }}
        </h1>
        <p class="result-description">
          {{ isFive === 'true' ? '阵容已就位，和队友打出新的默契。' : '带上这套搭配，开启不一样的一局。' }}
        </p>
      </div>
      <span class="result-decoration" aria-hidden="true">{{ isFive === 'true' ? '05' : '01' }}</span>
    </header>
    <template v-if="isFive === 'true'">
      <Five :roll-data-list="data" />
    </template>
    <template v-else>
      <One v-if="data[0]" :roll-data="data[0]" />
    </template>
  </section>
</template>

<style scoped>
.roll-page {
  width: 100%;
  min-width: 0;
}

.result-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  margin-bottom: 30px;
}

.result-eyebrow {
  display: flex;
  align-items: center;
  gap: 9px;
  color: var(--color-gold);
  font-size: 11px;
  letter-spacing: 3px;
}

.result-eyebrow span {
  width: 6px;
  height: 6px;
  border: 1px solid currentColor;
  transform: rotate(45deg);
}

.result-header h1 {
  margin-top: 10px;
  font-size: clamp(26px, 3vw, 36px);
  font-weight: 500;
  letter-spacing: 1px;
  line-height: 1.4;
}

.result-description {
  margin-top: 10px;
  color: var(--color-muted);
  font-size: 13px;
  line-height: 1.8;
}

.result-decoration {
  color: rgb(213 183 125 / 13%);
  font-family: Georgia, serif;
  font-size: 88px;
  font-style: italic;
  line-height: 1;
}

.roll-page-solo .result-header {
  justify-content: center;
  text-align: center;
}

.roll-page-solo .result-eyebrow {
  justify-content: center;
}

.roll-page-solo .result-decoration {
  display: none;
}

@media (min-width: 1001px) and (max-height: 800px) {
  .result-header {
    margin-bottom: 24px;
  }

  .result-header h1 {
    font-size: 30px;
  }

  .result-description {
    margin-top: 6px;
  }
}

@media (max-width: 600px) {
  .result-header {
    gap: 8px;
    margin-bottom: 24px;
  }

  .result-decoration {
    display: none;
  }

  .result-description {
    font-size: 12px;
  }
}
</style>
