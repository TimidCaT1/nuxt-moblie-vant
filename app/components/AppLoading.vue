<script setup>
defineProps({
  loading: Boolean,
})
</script>

<template>
  <div v-if="loading" class="app-loading">
    <!-- 你的加载动画或内容 -->
    <h1>Loading...</h1>
  </div>
</template>

<style>
.app-loading {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}
</style>
