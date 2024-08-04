/*
 * @Author: Joe
 * @Date: 2022-10-09 14:44:24
 * @LastEditors: Joe
 * @LastEditTime: 2022-11-27 13:00:02
 * @FilePath: /management-micro/main/src/main.ts
 * @Description:
 *
 * Copyright (c) 2022 by Brid9e wangdongqiao1997@163.com, All Rights Reserved.
 */

import '@/service/init'
import '@/assets/scss/default.scss'
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import ECharts from 'vue-echarts'
import { store, key } from './store'
import ElementPlus from 'element-plus'
import version from '@/service/version'

import '@/assets/scss/global.scss'
import '@/assets/scss/style.scss'
import 'element-plus/dist/index.css'

const instance: any = createApp(App)
  .use(version)
  .use(router)
  .use(store, key)
  .component('v-chart', ECharts)
  .use(ElementPlus)
  .mount('#app')

// // 定义loader方法，loading改变时，将变量赋值给App.vue的data中的isLoading
// function loader(loading: any) {
//   if (instance.isLoading) {
//     instance.isLoading = loading
//   }
// }

// // 给子应用配置加上loader方法
// const apps = microApps.map((item) => {
//   return {
//     ...item,
//     loader,
//   }
// })

// registerMicroApps(apps, {
//   beforeLoad: async (app) => {
//     console.log('before load app.name====>>>>>', app.name, app)
//   },
//   beforeMount: [
//     async (app) => {
//       console.log('[LifeCycle] before mount %c%s', 'color: green', app.name)
//     },
//   ],
//   afterMount: [
//     async (app) => {
//       console.log('[LifeCycle] after mount %c%s', 'color: green', app.name)
//     },
//   ],
//   afterUnmount: [
//     async (app) =>
//       console.log('[LifeCycle] after unmount %c%s', 'color: green', app.name),
//   ],
// })
// // // setDefaultMountApp("/platform")
// start()
