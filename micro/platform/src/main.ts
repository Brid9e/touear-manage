/*
 * @Author: Joe
 * @Date: 2022-10-09 16:02:14
 * @LastEditors: Joe
 * @LastEditTime: 2022-11-27 13:07:47
 * @FilePath: /management-micro/micro/platform/src/main.ts
 * @Description:
 *
 * Copyright (c) 2022 by Brid9e wangdongqiao1997@163.com, All Rights Reserved.
 */

import './public-path'
import { createApp } from 'vue'
import App from './App.vue'
import Storage from '@/assets/scripts/storage'
import { store, key } from './store'
import routes from './router'
import {
  renderWithQiankun,
  qiankunWindow,
  QiankunProps,
} from 'vite-plugin-qiankun/dist/helper'
import ElementPuls from 'element-plus'
import {
  createRouter,
  createWebHashHistory,
  createWebHistory,
} from 'vue-router'

import 'element-plus/dist/index.css'
import '@/assets/scss/global.scss'
import '@/assets/scss/style.scss'

// const _window: any = window
// function setDomain() {
//   // _window.ISNK = document.domain.indexOf('172') > -1 // 如果是172客户的域名,那就拿客户地址,自动判断,这里搞个全局判断标志
//   _window.ORIGIN =
//     process.env.NODE_ENV === 'development'
//       ? process.env.VITE_ORIGIN_DEV
//       : _window.ISNK
//         ? process.env.VITE_ORIGIN_PRO
//         : process.env.VITE_ORIGIN_PRO_TEST
// }

//  设置主域名,但不跟随基座端口变化而变化
// setDomain()

let router = null
let instance: any = null
let history: any = null

function render(props: QiankunProps = {}) {
  let { container }: any = props
  history = createWebHistory(
    qiankunWindow.__POWERED_BY_QIANKUN__ ? '/manage' + (sessionStorage.authPath || '') : '/'
  )
  router = createRouter({
    history,
    routes,
  })
  instance = createApp(App)
  instance.use(router)
  instance.use(store, key)
  instance.use(ElementPuls)
  instance.config.globalProperties.$configs = Storage.get('configsManage', false)
  instance.config.globalProperties.$isDev = true
  instance.mount(container ? container.querySelector('#platform') : '#platform')
  if (!qiankunWindow.__POWERED_BY_QIANKUN__) {
    store.state.funcButton = new Proxy({}, { get: () => new Proxy({}, { get: () => true }) })
  }
}

const initQianKun = () => {
  renderWithQiankun({
    mount(props: any) {
      props.onGlobalStateChange((state: any, prev: any) => {
        store.state.funcButton = state.funcButton
      })
      props.setGlobalState({
        name: 'manage-platform',
        loading: false,
      })
      render(props)
      // console.log(instance.config.globalProperties.$route,"444444444")
    },
    bootstrap() {
      console.log('bootstrap')
    },
    unmount(props: any) {
      console.log('unmount platform')
      instance.unmount()
      if (instance?._container?.innerHTML) instance._container.innerHTML = ''
      history.destroy() // 不卸载router会导致其他应用路由失败
      router = null
      instance = null
    },
    update(props: any) {
      // console.log('viteapp update', props.closePath)
      if (props.clearHistory) {
        history.destroy() // 不卸载router会导致其他应用路由失败
      }
      // console.log('props', props)
      if (props.scrollTop) store.state.scrollTop = props.scrollTop
      // if (props.funcButton) store.state.funcButton = props.funcButton
    },
  })
}

qiankunWindow.__POWERED_BY_QIANKUN__ ? initQianKun() : render()
