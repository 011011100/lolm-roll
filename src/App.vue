<template>
  <div class="app-shell">
    <header class="site-header">
      <div class="brand" aria-label="LOLM ROLL">
        <svg class="brand-mark" viewBox="0 0 36 40" fill="none" aria-hidden="true">
          <path d="M18 2 34 11v18L18 38 2 29V11L18 2Z" stroke="currentColor" />
          <path d="m18 9 10 6v11l-10 6-10-6V15l10-6Z" fill="currentColor" fill-opacity=".12" />
          <path d="m11 24 7-12 7 12H11Z" stroke="currentColor" />
          <path d="M18 19v8" stroke="currentColor" />
        </svg>
        <span>LOLM<span class="brand-divider">/</span>ROLL</span>
      </div>
      <div class="site-context">
        <span class="context-line" aria-hidden="true" />
        英雄联盟手游<span class="context-detail"> · 随机阵容</span>
      </div>
    </header>

    <main class="app-main">
      <router-view />
    </main>

    <footer class="site-footer">
      <span>每一次随机，都是新的开场。</span>
      <span>随机结果仅供娱乐</span>
    </footer>
  </div>
</template>

<style>
:root {
  color-scheme: dark;
  font-family: "PingFang SC", "Microsoft YaHei", system-ui, sans-serif;
  color: #f3eee3;
  background: #071018;
  font-synthesis: none;
  -webkit-font-smoothing: antialiased;
  --color-gold: #d5b77d;
  --color-muted: #98a7b5;
  --color-line: rgb(213 183 125 / 18%);
}

* {
  box-sizing: border-box;
}

body {
  margin: 0;
  min-width: 320px;
  background:
    radial-gradient(ellipse at 82% 35%, rgb(32 87 97 / 17%), transparent 52%),
    radial-gradient(ellipse at 12% 90%, rgb(89 67 37 / 10%), transparent 46%),
    #071018;
}

button {
  font: inherit;
}

::selection {
  color: #071018;
  background: #d5b77d;
}

.app-shell {
  width: min(100%, 1440px);
  min-height: 100vh;
  min-height: 100svh;
  margin-inline: auto;
  padding: 0 clamp(20px, 4.2vw, 64px);
  display: flex;
  flex-direction: column;
}

.site-header {
  min-height: 100px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  border-bottom: 1px solid var(--color-line);
}

.brand {
  display: flex;
  align-items: center;
  gap: 14px;
  font-size: 17px;
  font-weight: 600;
  letter-spacing: 3px;
}

.brand-mark {
  width: 32px;
  height: 36px;
  color: var(--color-gold);
}

.brand-divider {
  margin-inline: 9px;
  color: var(--color-gold);
  font-weight: 300;
}

.site-context {
  display: flex;
  align-items: center;
  color: var(--color-muted);
  font-size: 12px;
  letter-spacing: 2px;
}

.context-line {
  width: 24px;
  height: 1px;
  margin-right: 14px;
  background: var(--color-gold);
}

.app-main {
  flex: 1;
  display: flex;
  align-items: center;
  width: 100%;
  min-width: 0;
  padding-block: 32px;
}

.site-footer {
  min-height: 66px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  border-top: 1px solid var(--color-line);
  color: #82909c;
  font-size: 11px;
  letter-spacing: 1px;
}

@media (min-width: 1001px) and (max-height: 800px) {
  .site-header {
    min-height: 80px;
  }

  .app-main {
    padding-block: 24px;
  }

  .site-footer {
    min-height: 50px;
  }
}

@media (max-width: 760px) {
  .site-header {
    min-height: 76px;
  }

  .brand {
    gap: 9px;
    font-size: 13px;
    letter-spacing: 1.8px;
  }

  .brand-mark {
    width: 25px;
    height: 30px;
  }

  .brand-divider {
    margin-inline: 6px;
  }

  .site-context {
    font-size: 10px;
    letter-spacing: 1px;
  }

  .context-line,
  .context-detail {
    display: none;
  }

  .app-main {
    padding-block: 32px;
  }

  .site-footer {
    min-height: 64px;
    font-size: 10px;
    letter-spacing: 0;
  }
}
</style>
