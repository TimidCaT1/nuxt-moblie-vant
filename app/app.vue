<script setup lang="ts">
import type { ConfigProviderTheme } from 'vant'
import useKeepalive from '~/composables/keepalive'
import { appName } from '~/constants'

useHead({
  title: appName,
})

const color = useColorMode()
const auth = useAuth()

// 初始化用户状态
onMounted(() => {
  auth.restoreUser()
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
    <NuxtLoadingIndicator />
    <NuxtLayout>
      <NuxtPage :keepalive="{ include: keepAliveRouteNames }" />
    </NuxtLayout>
  </VanConfigProvider>
</template>
