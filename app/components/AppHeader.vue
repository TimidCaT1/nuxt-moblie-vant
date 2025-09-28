<script setup lang="ts">
import { useAppFooterRouteNames as routeWhiteList } from '~/config'

const route = useRoute()
const router = useRouter()
const showRight = ref(false)

function onBack() {
  if (window.history.state.back)
    history.back()
  else
    router.replace('/')
}

const { t } = useI18n()

/**
 * Get page title
 * Located in i18n/locales/json
 */
const title = computed(() => {
  if (route.name) {
    return t(`navbar.${route.name}`)
  }

  return t('navbar.Undefined')
})

const showRightIcon = computed(() => {
  if (route.name === 'Home') {
    return true
  }

  return false
})
/**
 * Display the left arrow
 * If route name is in route white list, display left arrow
 */
const showLeftArrow = computed(() => {
  if (route.name && routeWhiteList.includes(route.name)) {
    return true
  }

  return false
})
function showRightFunc() {
  showRight.value = true
  console.log('showRightFunc')
  console.log(title)
}

function handleShowRightFalse() {
  console.log('handleShowRightFalse')
  showRight.value = false
}
</script>

<template>
  <div class="app-header">
    <div class="container">
      <van-nav-bar clickable placeholder fixed :left-arrow="!showLeftArrow" @click-left="onBack">
        <template #right>
          <van-icon v-if="showRightIcon" name="qr" size="24" @click="showRightFunc" />
        </template>
      </van-nav-bar>
    </div>

    <!-- 右侧弹出 -->
    <van-popup v-model:show="showRight" position="right" :style="{ width: '80%', height: '100%' }">
      <appMenu @show="handleShowRightFalse" />
    </van-popup>
  </div>
</template>

<style scoped>
/* .container {} */

:deep(.van-nav-bar) {
  background: var(--van-background);
}

:deep(.van-nav-bar--fixed) {
  margin-top: 8vw;
}
</style>
