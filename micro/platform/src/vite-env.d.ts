/// <reference types="vite/client" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

declare module 'sortablejs'
declare module 'crypto-js'
declare module 'js-base64'
declare module 'element-plus/dist/locale/zh-cn'
