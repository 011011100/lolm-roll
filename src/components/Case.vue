<script setup>
const props = defineProps({
  rollData: {
    type: Object,
    required: true,
  },
  compact: {
    type: Boolean,
    default: false,
  },
})
</script>

<template>
  <article class="champion-card" :class="{ 'champion-card-solo': !props.compact }" :aria-label="`${props.rollData.positionRoll}：${props.rollData.characterRoll}`">
    <div class="card-art">
      <Character :name="props.rollData.characterRoll" />
      <div class="portrait-shade" aria-hidden="true" />
      <div class="position-badge">
        <span class="position-diamond" aria-hidden="true" />
        <Position :portion="props.rollData.positionRoll" />
      </div>
      <div class="champion-identity">
        <span class="identity-caption">你的英雄</span>
        <h2>{{ props.rollData.characterRoll }}</h2>
      </div>
    </div>
    <div class="card-loadout">
      <div class="rune-row">
        <div class="rune-icon">
          <Talent :talent-name="props.rollData.talentRoll" />
        </div>
        <div class="loadout-copy">
          <span class="loadout-label">基石符文</span>
          <span class="loadout-value">{{ props.rollData.talentRoll }}</span>
        </div>
      </div>
      <div class="spells-row">
        <span class="loadout-label">召唤师技能</span>
        <div class="spells-list">
          <div v-for="skill in props.rollData.skillRoll" :key="skill" class="spell-item">
            <Skill :skill-name="skill" :width="28" :height="28" />
            <span>{{ skill }}</span>
          </div>
        </div>
      </div>
    </div>
  </article>
</template>

<style scoped>
.champion-card {
  width: 100%;
  height: 100%;
  min-width: 0;
  overflow: hidden;
  border: 1px solid rgb(213 183 125 / 24%);
  border-radius: 3px;
  background: #0d1a24;
  box-shadow: 0 14px 36px rgb(0 0 0 / 16%);
}

.card-art {
  position: relative;
  height: clamp(250px, 25vw, 340px);
  overflow: hidden;
  background: #152531;
}

.card-art :deep(.character-portrait) {
  height: 100%;
  aspect-ratio: auto;
}

.portrait-shade {
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, rgb(4 12 18 / 24%), transparent 30%, rgb(6 15 23 / 20%) 56%, #0d1a24 100%);
}

.position-badge {
  position: absolute;
  top: 16px;
  left: 16px;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 10px;
  border: 1px solid rgb(213 183 125 / 36%);
  background: rgb(7 16 24 / 86%);
  color: #ebd4aa;
  font-size: 12px;
  letter-spacing: 2px;
}

.position-diamond {
  width: 5px;
  height: 5px;
  background: var(--color-gold);
  transform: rotate(45deg);
}

.champion-identity {
  position: absolute;
  bottom: 13px;
  inset-inline: 18px;
}

.identity-caption {
  color: #c3c9cb;
  font-size: 10px;
  letter-spacing: 3px;
}

.champion-identity h2 {
  margin-top: 6px;
  font-size: clamp(20px, 2vw, 26px);
  font-weight: 600;
  letter-spacing: 1px;
  line-height: 1.4;
  overflow-wrap: anywhere;
  text-wrap: balance;
}

.card-loadout {
  padding: 4px 18px 18px;
}

.rune-row {
  display: flex;
  align-items: center;
  gap: 10px;
  min-height: 62px;
  padding-bottom: 13px;
  border-bottom: 1px solid rgb(152 167 181 / 14%);
}

.rune-icon {
  display: grid;
  place-items: center;
  width: 44px;
  height: 44px;
  flex-shrink: 0;
  border: 1px solid rgb(213 183 125 / 15%);
  border-radius: 50%;
  background: #08121b;
}

.rune-icon :deep(img) {
  width: 36px;
  height: 36px;
  object-fit: contain;
}

.loadout-copy {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.loadout-label {
  color: var(--color-muted);
  font-size: 11px;
  letter-spacing: 1px;
}

.loadout-value {
  color: #e5d5b6;
  font-size: 14px;
}

.spells-row {
  padding-top: 12px;
}

.spells-list {
  display: flex;
  flex-wrap: wrap;
  gap: 9px 12px;
  margin-top: 9px;
}

.spell-item {
  display: flex;
  align-items: center;
  gap: 6px;
  color: #c5cdd2;
  font-size: 11px;
  white-space: nowrap;
}

.spell-item :deep(img) {
  border: 1px solid rgb(213 183 125 / 30%);
  border-radius: 3px;
}

.champion-card-solo .card-art {
  height: 390px;
}

.champion-card-solo .champion-identity h2 {
  font-size: 32px;
}

.champion-card-solo .card-loadout {
  display: grid;
  grid-template-columns: 0.9fr 1.1fr;
  gap: 16px;
  padding: 6px 22px 22px;
}

.champion-card-solo .rune-row {
  border: 0;
  padding: 0;
}

.champion-card-solo .spells-row {
  padding: 0 0 0 16px;
  border-left: 1px solid rgb(152 167 181 / 14%);
}

.champion-card-solo .spells-list {
  column-gap: 8px;
}

@media (min-width: 1001px) and (max-height: 800px) {
  .card-art {
    height: 32vh;
    min-height: 210px;
  }

  .champion-card-solo .card-art {
    height: 310px;
  }
}

@media (max-width: 600px) {
  .champion-card:not(.champion-card-solo) {
    display: grid;
    grid-template-columns: 44% 56%;
  }

  .champion-card:not(.champion-card-solo) .card-art {
    height: 220px;
  }

  .champion-card:not(.champion-card-solo) .card-loadout {
    align-self: center;
    padding: 16px 14px;
  }

  .champion-card:not(.champion-card-solo) .champion-identity {
    inset-inline: 12px;
  }

  .champion-card:not(.champion-card-solo) .champion-identity h2 {
    font-size: 20px;
  }

  .champion-card:not(.champion-card-solo) .position-badge {
    top: 12px;
    left: 12px;
  }

  .champion-card-solo .card-art {
    height: 380px;
  }
}

@media (max-width: 400px) {
  .champion-card-solo .card-loadout {
    grid-template-columns: 1fr;
  }

  .champion-card-solo .spells-row {
    padding: 14px 0 0;
    border-left: 0;
    border-top: 1px solid rgb(152 167 181 / 14%);
  }
}
</style>
