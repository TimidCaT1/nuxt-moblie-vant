<script setup lang="ts">
import type { LocaleObject } from '@nuxtjs/i18n'
import type { PickerColumn } from 'vant'
import type { ComputedRef } from 'vue'
import { Locale } from 'vant'

const emit = defineEmits(['show'])

const { $median } = useNuxtApp()

function changeStatusBar(color: 'auto' | 'light' | 'dark') {
  $median.screen.setMode({ mode: color })
}

const color = useColorMode()
const authStore = useAuthStore()

const user = authStore.user

useHead({
  meta: [{
    id: 'theme-color',
    name: 'theme-color',
    content: () => color.value === 'dark' ? '#222222' : '#ffffff',
  }],
})

const checked = computed({
  get: () => color.value === 'dark',
  set: (val: boolean) => {
    color.preference = val ? 'dark' : 'light'
    changeStatusBar(color.preference as 'auto' | 'light' | 'dark')
  },
})

const { setLocale, t } = useI18n()
const i18n = useNuxtApp().$i18n

const showLanguagePicker = ref(false)

const languageValues = ref<string[]>([i18n.locale.value])

const { locales } = useI18n() as { locales: ComputedRef<LocaleObject[]> }

const menus = computed(() => [
  { title: t('menu.User'), route: 'user' },
])

function onLanguageConfirm(event: { selectedOptions: PickerColumn }) {
  const lang = event.selectedOptions[0]?.code

  setLocale(lang)
  Locale.use(lang)
  localStorage.setItem('lang', lang)

  showLanguagePicker.value = false
}

function onPageButtonDown() {
  emit('show')
}
</script>

<template>
  <div>
    <div class="app-avatar-bg flex items-center justify-between">
      <div class="app-avatar">
        <VanImage width="25vw" height="25vw" radius="50%" fit="cover" src="/avatar2.jpg" alt="Avatar" />
        <div class="app-avatar-name">
          <span>{{ user?.username }}</span>
        </div>
        <div class="app-avatar-email">
          <span>{{ user?.email }}</span>
        </div>
      </div>
    </div>
    <div class="app-menu">
      <VanCellGroup inset>
        <VanCell :title="$t('menu.darkMode')" center>
          <template #right-icon>
            <ClientOnly>
              <VanSwitch v-model="checked" size="20px" aria-label="on/off Dark Mode" />
            </ClientOnly>
          </template>
        </VanCell>

        <VanCell
          :title="$t('menu.language')" :value="locales.find(i => i.code === i18n.locale.value)?.name" is-link
          @click="showLanguagePicker = true"
        />

        <template v-for="item in menus" :key="item.route">
          <VanCell :title="item.title" :to="item.route" is-link @click="onPageButtonDown()" />
        </template>
        <VanCell :title="$t('menu.logout')" is-link @click="() => $router.push('/logout')" />
      </VanCellGroup>

      <van-popup v-model:show="showLanguagePicker" position="bottom">
        <van-picker
          v-model="languageValues" :columns="locales" :columns-field-names="{ text: 'name', value: 'code' }"
          @confirm="onLanguageConfirm" @cancel="showLanguagePicker = false"
        />
      </van-popup>
    </div>
  </div>
</template>

<style scoped lang="scss">
.app-avatar-bg {
  height: 34vw;
  width: 100%;
  background-color: #f7f8fa;
}

.app-menu {
  padding-top: 20vw;
  width: 100%;
  height: calc(100vh - 34vw);
  background-color: var(--c-primary);
  border-radius: 15px 15px 0 0;
  box-shadow: rgba(0, 0, 0, 0.2) 0px -2px 12px;
  z-index: 1000;
}

.app-menu::before {
  content: '';
  position: absolute;
  top: -10px;
  left: 0;
  width: 100%;
  height: 10px;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.25), transparent);
  border-radius: 15px 15px 0 0;
}

:deep(.van-cell-group--inset) {
  margin: 0vw 3vw;
  border-radius: var(--van-cell-group-inset-radius);
  overflow: hidden;
}

.app-avatar {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 20px auto;
  .app-avatar-name {
    position: absolute;
    top: 22vw;
    left: 35vw;
    font-size: 6vw;
    color: #db8645;
    font-weight: bold;
    text-shadow: 0 2px 4px rgba(76, 102, 110, 0.5);
  }
  .app-avatar-email {
    position: absolute;
    top: 35vw;
    left: 35vw;
    font-size: 4vw;
    color: #ffffffc5;
    font-weight: 500;
    text-shadow: 0 2px 4px rgba(76, 102, 110, 0.5);
  }
}

.app-avatar .van-image {
  position: relative;
  right: 20vw;
  top: 15vw;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25); /* 阴影 */
  border-radius: 50%; /* 保证完全圆形 */
}
</style>
