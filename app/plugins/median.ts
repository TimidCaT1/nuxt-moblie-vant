import { defineNuxtPlugin } from '#app'
import Median from 'median-js-bridge'

export default defineNuxtPlugin(() => {
  // 只在客户端可用
  return {
    provide: {
      median: Median,
    },
  }
})
