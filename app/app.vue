<script setup lang="ts">
import type { ConfigProviderTheme } from 'vant'
import useKeepalive from '~/composables/keepalive'
import { appName } from '~/constants'
import { useAuthStore } from '~/stores/auth'

useHead({
  title: appName,
})

const authStore = useAuthStore()
const color = useColorMode()
const route = useRoute()

// 监听路由变化
watch(() => route.path, (newPath, oldPath) => {
  console.log('路由变化:', { 从: oldPath, 到: newPath, 登录状态: authStore.isLoggedIn })
})

// 监听用户登录状态变化
watch(() => authStore.isLoggedIn, (newStatus) => {
  console.log('用户登录状态变化:', newStatus)
})

// 初始化时恢复用户
onMounted(() => {
  authStore.restoreUser()
})

const mode = computed(() => {
  return color.value as ConfigProviderTheme
})

const keepAliveRouteNames = computed(() => {
  return useKeepalive().routeCaches as string[]
})
</script>

<template>
  <VanConfigProvider :theme="mode">
    <NuxtLayout>
      <NuxtPage :keepalive="{ include: keepAliveRouteNames }" />
    </NuxtLayout>
  </VanConfigProvider>
</template>
