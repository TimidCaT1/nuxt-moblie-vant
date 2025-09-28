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
      this is user Icon and title
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

<style scoped>
.app-avatar-bg {
  height: 34vw;
  width: 100%;
  background-color: var(--c-primary);
}

.app-menu {
  padding-top: 12vw;
  width: 100%;
  height: calc(100vh - 34vw);
  background-color: rgb(var(--c-primary-300));
  z-index: 1000;
}
</style>
