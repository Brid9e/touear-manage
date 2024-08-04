/*
 * @Author: Joe
 * @Date: 2022-11-26 16:12:58
 * @LastEditors: Joe
 * @LastEditTime: 2022-11-27 13:58:36
 * @FilePath: /management-micro/main/src/micro-app.ts
 * @Description:
 *
 * Copyright (c) 2022 by Brid9e wangdongqiao1997@163.com, All Rights Reserved.
 */
import store from './micro-store'
const microApps = [
  {
    name: 'platform',
    entry: '//127.0.0.1:7200',
    activeRule: '/platform',
  },
  {
    name: 'multimedia',
    entry: '//127.0.0.1:7400',
    activeRule: '/multimedia',
  },
  {
    name: 'ecard',
    entry: '//127.0.0.1:7600',
    activeRule: '/ecard',
  }
]

const apps = microApps.map((item) => {
  return {
    ...item,
    container: `#app-container`, // 子应用挂载的div
    props: {
      routerBase: item.activeRule, // 下发基础路由
      // getGlobalState: store.getGlobalState, // 下发getGlobalState方法
    },
  }
})

export default apps
