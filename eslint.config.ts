import antfu from '@antfu/eslint-config'
import nuxt from './.nuxt/eslint.config.mjs'

export default nuxt(
  await antfu({
    unocss: true,
    formatters: true,
    rules: {
      'no-console': 'off',
      // 或者更温和的警告级别
      // 'no-console': 'warn',
    },
  }),
)
