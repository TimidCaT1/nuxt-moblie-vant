<script setup lang="ts">
import type { ConfigProviderTheme } from 'vant'
import useKeepalive from '~/composables/keepalive'
import { appName } from '~/constants'

useHead({
  title: appName,
})

const color = useColorMode()
// const auth = useAuth()

// 初始化用户状态
onMounted(() => {
  if (!sessionStorage.getItem('firstOpen')) {
    console.log('这是本次启动的第一次打开')
    sessionStorage.setItem('firstOpen', 'true')
    // 👉 在这里做你的“初次启动逻辑”
    // 先加载页面
  }
  else {
    console.log('已经打开过了')
  }
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
    <!-- <NuxtLoadingIndicator /> -->

    <div>
      <NuxtLayout>
        <NuxtPage :keepalive="{ include: keepAliveRouteNames }" />
      </NuxtLayout>
    </div>
  </VanConfigProvider>
</template>
