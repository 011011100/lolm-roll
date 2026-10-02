<script setup>
import { DestylerButton } from '@destyler/button'
import { useRouter } from 'vue-router/auto'

const router = useRouter()

function jumpRoll(isFive) {
  router.push(`/roll/${encodeURIComponent(isFive)}`)
}
</script>

<template>
  <section class="home" aria-labelledby="home-title">
    <div class="home-copy">
      <p class="eyebrow">
        <span class="eyebrow-line" aria-hidden="true" />
        WILD RIFT · RANDOM PICK
      </p>
      <h1 id="home-title">
        下一局，<br>
        <span>交给命运。</span>
      </h1>
      <p class="intro">
        暂时放下拿手英雄，试试未知的组合。<br>
        一个人出发，或和队友一起，随机开启下一局。
      </p>
      <div class="action-row">
        <DestylerButton
          class="action-btn action-btn-primary"
          @click="jumpRoll(false)"
        >
          <span class="action-copy">
            <span class="action-label">单人随机</span>
            <span class="action-caption">一个人的新尝试</span>
          </span>
          <span class="action-arrow" aria-hidden="true">↗</span>
        </DestylerButton>
        <DestylerButton
          class="action-btn action-btn-secondary"
          @click="jumpRoll(true)"
        >
          <span class="action-copy">
            <span class="action-label">五人随机</span>
            <span class="action-caption">五个人的默契挑战</span>
          </span>
          <span class="action-arrow" aria-hidden="true">↗</span>
        </DestylerButton>
      </div>
      <p class="home-note">
        英雄 · 天赋 · 召唤师技能，每一局都有新可能
      </p>
    </div>

    <div class="hero-art" aria-hidden="true">
      <div class="art-orbit art-orbit-outer" />
      <div class="art-orbit art-orbit-inner" />
      <div class="art-cross art-cross-top">
        +
      </div>
      <div class="art-cross art-cross-bottom">
        +
      </div>
      <div class="champion champion-ahri">
        <img src="/assets/character/阿狸.jpg" alt="" draggable="false">
        <div class="champion-name">
          <span>九尾妖狐</span>阿狸
        </div>
      </div>
      <div class="champion champion-yasuo">
        <img src="/assets/character/亚索.jpg" alt="" draggable="false">
        <div class="champion-name">
          <span>疾风剑豪</span>亚索
        </div>
      </div>
      <div class="champion champion-hwei">
        <img src="/assets/character/彗.jpg" alt="" draggable="false">
        <div class="champion-name">
          <span>异画师</span>彗
        </div>
      </div>
      <div class="art-caption">
        <span /> YOUR NEXT CHAMPION AWAITS <span />
      </div>
    </div>
  </section>
</template>

<style scoped>
.home {
  display: grid;
  grid-template-columns: 1fr 1fr;
  align-items: center;
  gap: 28px;
  width: 100%;
  padding: 0;
}

.home-copy,
.hero-art {
  min-width: 0;
}

.eyebrow {
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 0 0 27px;
  color: #d5b77d;
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.2em;
}

.eyebrow-line {
  width: 28px;
  height: 1px;
  background: currentColor;
}

h1 {
  margin: 0;
  color: #f3eee3;
  font-size: clamp(42px, 5.2vw, 72px);
  font-weight: 700;
  line-height: 1.25;
  letter-spacing: -0.055em;
}

h1 span {
  color: #d5b77d;
}

.intro {
  margin: 27px 0 35px;
  color: #98a7b5;
  font-size: 14px;
  line-height: 1.95;
}

.action-row {
  display: flex;
  gap: 12px;
  max-width: 450px;
}

.action-btn {
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  min-width: 0;
  min-height: 82px;
  padding: 17px 20px;
  border: 1px solid transparent;
  border-radius: 3px;
  cursor: pointer;
  text-align: left;
  font: inherit;
  transition: background-color 180ms ease, border-color 180ms ease, transform 180ms ease;
}

.action-btn-primary {
  color: #182025;
  background: #d5b77d;
  border-color: #d5b77d;
}

.action-btn-secondary {
  color: #f3eee3;
  background: rgb(213 183 125 / 3%);
  border-color: rgb(213 183 125 / 32%);
}

.action-copy {
  display: flex;
  flex-direction: column;
  gap: 7px;
}

.action-label {
  font-size: 16px;
  font-weight: 600;
  letter-spacing: 0.03em;
}

.action-caption {
  color: #52616e;
  font-size: 10px;
  line-height: 1.35;
  letter-spacing: 0.025em;
}

.action-btn-secondary .action-caption {
  color: #98a7b5;
}

.action-arrow {
  font-size: 24px;
  line-height: 1;
  font-weight: 300;
}

.action-btn:focus-visible {
  outline: 2px solid #86cfc7;
  outline-offset: 5px;
  transition: none;
}

.action-btn:active {
  transform: scale(0.98);
}

.home-note {
  margin: 20px 0 0;
  color: #82929f;
  font-size: 11px;
  line-height: 1.7;
}

.hero-art {
  position: relative;
  height: 480px;
  isolation: isolate;
}

.hero-art::before {
  position: absolute;
  z-index: -1;
  inset: 2% -5% 5%;
  border-radius: 50%;
  background: radial-gradient(ellipse, rgb(70 131 127 / 15%), transparent 66%);
  content: '';
}

.art-orbit {
  position: absolute;
  z-index: -1;
  top: 50%;
  left: 50%;
  width: 92%;
  aspect-ratio: 1;
  border: 1px solid rgb(213 183 125 / 10%);
  border-radius: 50%;
  transform: translate(-50%, -50%);
}

.art-orbit-inner {
  width: 73%;
  border-color: rgb(213 183 125 / 6%);
}

.art-cross {
  position: absolute;
  color: #7e795f;
  font-size: 16px;
  font-weight: 200;
}

.art-cross-top {
  top: 9px;
  left: 19%;
}

.art-cross-bottom {
  right: 8%;
  bottom: 30px;
}

.champion {
  position: absolute;
  overflow: hidden;
  border: 1px solid rgb(213 183 125 / 35%);
  border-radius: 100px 100px 3px 3px;
  background: #10232b;
  box-shadow: 0 22px 50px rgb(0 0 0 / 24%);
}

.champion::after {
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, transparent 45%, rgb(7 16 24 / 14%) 60%, rgb(7 16 24 / 95%) 100%);
  content: '';
}

.champion img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center top;
}

.champion-ahri {
  top: 70px;
  left: 0;
  width: 37%;
  height: 335px;
  transform: rotate(-8deg);
}

.champion-yasuo {
  top: 72px;
  right: 0;
  width: 37%;
  height: 335px;
  transform: rotate(8deg);
}

.champion-ahri img,
.champion-yasuo img {
  filter: saturate(0.65) brightness(0.72);
}

.champion-hwei {
  z-index: 1;
  top: 16px;
  left: 29%;
  width: 42%;
  height: 421px;
  border-color: rgb(213 183 125 / 65%);
}

.champion-name {
  position: absolute;
  z-index: 1;
  right: 0;
  bottom: 20px;
  left: 0;
  color: #f3eee3;
  font-size: 23px;
  letter-spacing: 0.15em;
  text-align: center;
}

.champion-name span {
  display: block;
  margin-bottom: 6px;
  color: #d5b77d;
  font-size: 9px;
  letter-spacing: 0.22em;
}

.champion-hwei .champion-name {
  bottom: 28px;
  font-size: 31px;
}

.art-caption {
  position: absolute;
  right: 0;
  bottom: 18px;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  color: #82929f;
  font-size: 8px;
  letter-spacing: 0.19em;
}

.art-caption span {
  width: 24px;
  height: 1px;
  background: rgb(213 183 125 / 30%);
}

@media (hover: hover) and (pointer: fine) {
  .action-btn-primary:hover {
    background: #e4c997;
    border-color: #e4c997;
  }

  .action-btn-secondary:hover {
    background: rgb(213 183 125 / 9%);
    border-color: rgb(213 183 125 / 65%);
  }
}

@media (min-width: 761px) and (max-width: 1000px) {
  .home {
    gap: 18px;
  }

  .hero-art {
    height: 410px;
  }

  .champion-ahri,
  .champion-yasuo {
    height: 267px;
  }

  .champion-hwei {
    height: 345px;
  }

  .action-btn {
    padding: 15px 13px;
  }

  .action-arrow {
    font-size: 20px;
  }

  .intro {
    font-size: 12px;
  }
}

@media (max-width: 760px) {
  .home {
    grid-template-columns: 1fr;
    gap: 36px;
    padding: 8px 0;
  }

  .eyebrow {
    margin-bottom: 19px;
    font-size: 9px;
  }

  h1 {
    font-size: clamp(42px, 10.8vw, 65px);
    line-height: 1.2;
  }

  .intro {
    margin: 22px 0 26px;
    font-size: 12px;
  }

  .action-row {
    max-width: none;
    gap: 10px;
  }

  .action-btn {
    min-height: 76px;
    gap: 8px;
    padding: 15px 12px;
  }

  .action-arrow {
    font-size: 20px;
  }

  .action-label {
    font-size: 15px;
  }

  .action-caption {
    font-size: 9px;
  }

  .home-note {
    margin-top: 16px;
    font-size: 10px;
  }

  .hero-art {
    justify-self: center;
    width: min(100%, 420px);
    height: 330px;
  }

  .champion-ahri,
  .champion-yasuo {
    top: 40px;
    width: 35%;
    height: 226px;
  }

  .champion-hwei {
    top: 0;
    left: 30%;
    width: 40%;
    height: 284px;
  }

  .champion-name {
    bottom: 15px;
    font-size: 18px;
  }

  .champion-hwei .champion-name {
    bottom: 20px;
    font-size: 25px;
  }

  .art-caption {
    bottom: 2px;
    font-size: 7px;
  }

  .art-cross-top {
    top: 0;
    left: 12%;
  }

  .art-cross-bottom {
    bottom: 12px;
    right: 4%;
  }
}

@media (prefers-reduced-motion: reduce) {
  .action-btn {
    transition: none;
  }

  .action-btn:active {
    transform: none;
  }
}
</style>
