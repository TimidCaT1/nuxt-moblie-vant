import process from 'node:process'
import { appDescription } from './app/constants/index'
import preload from './app/utils/preload'
import { currentLocales } from './i18n/i18n'

export default defineNuxtConfig({
  modules: [
    '@vant/nuxt',
    '@unocss/nuxt',
    '@nuxtjs/color-mode',
    '@nuxt/eslint',
    '@nuxtjs/i18n',
    '@pinia/nuxt',
    'pinia-plugin-persistedstate/nuxt',
  ],

  spaLoadingTemplate: './spa-loading-template.html',
  runtimeConfig: {
    // 服务端可见
    databaseUrl: process.env.NUXT_DATABASE_URL,
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE || '/api',
    },
  },

  css: [
    './app/styles/vars.css',
    './app/styles/global.css',
    './app/styles/default-theme.css',
  ],

  postcss: {
    plugins: {
      'autoprefixer': {},

      // https://github.com/wswmsword/postcss-mobile-forever
      'postcss-mobile-forever': {
        appSelector: '#__nuxt',
        viewportWidth: 375,
        maxDisplayWidth: 600,
        // devtools excluded
        exclude: /@nuxt/,
        border: true,
        // Need to convert fixed selector list
        rootContainingBlockSelectorList: [
          '.van-tabbar',
          '.van-popup',
          '.van-popup--bottom',
          '.van-popup--top',
          '.van-popup--left',
          '.van-popup--right',
        ],
      },
    },
  },

  colorMode: {
    classSuffix: '',
    preference: 'system',
    fallback: 'light',
    storageKey: 'nuxt-color-mode',
  },

  i18n: {
    locales: currentLocales,
    strategy: 'no_prefix',
    detectBrowserLanguage: {
      useCookie: true,
    },
    langDir: 'locales',
    defaultLocale: 'zh-CN',
    // Reletive to the i18n directory
    vueI18n: './i18n.config.ts',
  },

  app: {
    head: {
      viewport: 'width=device-width,initial-scale=1,viewport-fit=cover',
      link: [
        { rel: 'icon', href: '/favicon.ico', sizes: 'any' },
      ],
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1, viewport-fit=cover' },
        { name: 'description', content: appDescription },
        { name: 'apple-mobile-web-app-status-bar-style', content: 'black-translucent' },
        { name: 'theme-color', media: '(prefers-color-scheme: light)', content: '#ffffff' },
        { name: 'theme--', media: '(prefers-color-scheme: dark)', content: '#222222' },
      ],
      script: [
        { innerHTML: preload(), type: 'text/javascript', tagPosition: 'head' },
      ],

    },
    spaLoaderTag: '<div class="spa-loader">正在初始化应用...</div>',
  },

  vite: {
    build: {
      target: 'esnext',
    },
    optimizeDeps: {
      include: [
        '@intlify/core-base',
        '@intlify/shared',
        '@vue/devtools-core',
        '@vue/devtools-kit',
      ],
    },
  },

  experimental: {
    typedPages: true,
  },

  devtools: {
    enabled: true,
  },

  typescript: {
    shim: false,
  },

  features: {
    // For UnoCSS
    inlineStyles: false,
  },

  eslint: {
    config: {
      standalone: false,
    },
  },

  compatibilityDate: '2025-07-18',
})
