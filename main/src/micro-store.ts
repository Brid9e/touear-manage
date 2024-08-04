/*
 * @Author: Joe
 * @Date: 2022-11-26 18:14:49
 * @LastEditors: Joe
 * @LastEditTime: 2022-11-26 18:35:13
 * @FilePath: /management-micro/main/src/micro-store.ts
 * @Description:
 *
 * Copyright (c) 2022 by Brid9e wangdongqiao1997@163.com, All Rights Reserved.
 */
import { initGlobalState } from 'qiankun'
import { reactive } from 'vue'

// 父应用的初始state
// Vue.observable是为了让initialState变成可响应：https://cn.vuejs.org/v2/api/#Vue-observable。
const initialState: any = reactive({
  user: {
    name: 'Joe',
  },
  ignore: '__test',
  num: 0,
})

const actions: any = initGlobalState(initialState)

actions.onGlobalStateChange((newState: any, prev: any) => {
  // state: 变更后的状态; prev 变更前的状态
  console.log('main change', JSON.stringify(newState), JSON.stringify(prev))

  for (const key in newState) {
    initialState[key] = newState[key]
  }
})

// 定义一个获取state的方法下发到子应用
actions.getGlobalState = (key: any) => (key ? initialState[key] : initialState)
// 有key，表示取globalState下的某个子级对象
// 无key，表示取全部

export default actions
