<!-- markdownlint-disable MD033 MD041 -->

<div id="top" align="center">

<img src="https://cdn.jsdelivr.net/gh/vue-zone/static/cover.png" alt="cover" />

<h1 align="center">nuxt-vant-mobile</h1>

An mobile web apps template based on the Nuxt _⁴_ ecosystem.

一个基于 Nuxt _⁴_ 生态系统的移动 web 应用模板，帮助你快速完成业务开发。

<p>
<img src="https://img.shields.io/github/license/vue-zone/nuxt-vant-mobile" alt="license" />
<img src="https://img.shields.io/github/package-json/v/vue-zone/nuxt-vant-mobile" alt="version" />
<img src="https://img.shields.io/github/repo-size/vue-zone/nuxt-vant-mobile" alt="repo-size" />
<img src="https://img.shields.io/github/languages/top/vue-zone/nuxt-vant-mobile" alt="languages" />
<img src="https://img.shields.io/github/issues-closed/vue-zone/nuxt-vant-mobile" alt="issues" />
</p>

[🌐预览](https://nuxt-vant-mobile.netlify.app) / [📖文档](https://vue-zone.github.io/docs/nuxt3-vant-mobile/) / [🗨️交流](https://github.com/vue-zone/vue3-vant-mobile/issues/56) / [📝反馈](https://github.com/vue-zone/nuxt-vant-mobile/issues)

[![Ask DeepWiki](https://deepwiki.com/badge.svg)](https://deepwiki.com/vue-zone/nuxt-vant-mobile) [![Netlify Status](https://api.netlify.com/api/v1/badges/1eb0d3f7-69a1-4972-a2b7-9e317ffa5c63/deploy-status)](https://app.netlify.com/sites/nuxt-vant-mobile/deploys)

</div>

## Features

- 💚 [Nuxt](https://nuxt.com/) - SSR, ESR, File-based routing, components auto importing, modules, etc

- ⚡️ Vite - Instant HMR

- 🎨 [UnoCSS](https://github.com/unocss/unocss) - The instant on-demand atomic CSS engine

- 😃 Use icons from any icon sets in Pure CSS, powered by [UnoCSS](https://github.com/unocss/unocss)

- 🔥 The `<script setup>` syntax

- 🌍 [I18n ready](./i18n/locales)

- 🍍 [State Management via Pinia](https://github.com/vuejs/pinia), see [./app/composables/counter.ts](./app/composables/counter.ts)

- 📑 [Layout system](./app/layouts)

- 📥 APIs auto importing - for Composition API and custom composables

- 🦾 TypeScript, of course

- ☁️ Deploy on [Netlify](https://www.netlify.com), zero-config

## Nuxt Modules

- [Vant](https://github.com/youzan/vant) - Vue UI library for mobile web apps
- [Nuxt ESLint](https://github.com/nuxt/eslint) - collection of ESLint-related packages for Nuxt
- [i18n](https://github.com/nuxt-modules/i18n) - i18n module for Nuxt
- [ColorMode](https://github.com/nuxt-modules/color-mode) - dark and Light mode with auto detection made easy with Nuxt
- [UnoCSS](https://github.com/unocss/unocss) - the instant on-demand atomic CSS engine
- [Pinia](https://github.com/vuejs/pinia) - intuitive, type safe, light and flexible Store for Vue
- [Pinia Persistedstate](https://github.com/prazdevs/pinia-plugin-persistedstate) - configurable persistence and rehydration of Pinia stores
- [DevTools](https://github.com/nuxt/devtools) - unleash Nuxt Developer Experience

## IDE

We recommend using [VS Code](https://code.visualstudio.com/) with [Volar](https://github.com/johnsoncodehk/volar) to get the best experience (You might want to disable [Vetur](https://vuejs.github.io/vetur/) if you have it)

## Try it now

> nuxt-vant-mobile requires Node 20+

### GitHub Template

[Create a repo from this template on GitHub](https://github.com/vue-zone/nuxt-vant-mobile/generate)

### Clone to local

If you prefer to do it manually with the cleaner git history

```bash
npx tiged vue-zone/nuxt-vant-mobile my-nuxt-app
cd my-nuxt-app
pnpm i # If you don't have pnpm installed, run: npm install -g pnpm
```

## Usage

### Development

Just run and visit <http://localhost:3000>

```bash
pnpm dev
```

### Build

To build the App, run

```bash
pnpm build
```

And you will see the generated file in `.output` that ready to be served.
