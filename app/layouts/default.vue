<script lang="ts" setup>

</script>

<template>
  <main class="flex flex-col min-h-svh">
    <AppHeader class="app-header-bg" />

    <div class="p-16 pb-[var(--van-nav-bar-height)] flex-1">
      <slot />
    </div>

    <AppFooter />
  </main>
</template>

<style scoped>
.app-header-bg {
  margin-top: 8vw;
}
</style>
