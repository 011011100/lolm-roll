<script setup>
</script>

<template>
  <main class="app-main">
    <router-view />
  </main>
</template>

<style scoped>
.app-main {
  min-height: 100vh;
  min-height: 100dvh;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  padding:
    max(12px, env(safe-area-inset-top))
    max(12px, env(safe-area-inset-right))
    max(12px, env(safe-area-inset-bottom))
    max(12px, env(safe-area-inset-left));
  box-sizing: border-box;
}
</style>
