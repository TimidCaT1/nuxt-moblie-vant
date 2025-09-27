import type Median from 'median-js-bridge'

declare module '#app' {
  interface NuxtApp {
    $median: typeof Median
  }
}
