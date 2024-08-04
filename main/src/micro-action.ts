/*
 * @Author: Joe
 * @Date: 2022-11-26 18:36:28
 * @LastEditors: Joe
 * @LastEditTime: 2022-11-26 18:36:30
 * @FilePath: /management-micro/main/src/micro-action.ts
 * @Description: 
 * 
 * Copyright (c) 2022 by Brid9e wangdongqiao1997@163.com, All Rights Reserved. 
 */
//主应用的src/action.js
import { initGlobalState } from 'qiankun'

export const initialState: any = {
  globalLocation: {
    SUID: 123123,
    station: 'TTT'
  }
}
const actions: any = initGlobalState(initialState)

// 定义一个获取state的方法下发到子应用
actions.getGlobalState = (key: any) => {
  // 有key，表示取globalState下的某个子级对象
  // 无key，表示取全部
  return key ? initialState[key] : initialState
}

actions.onGlobalStateChange((newState: any, prev: any) => {
  // state: 变更后的状态; prev 变更前的状态
  // console.log('main change', JSON.stringify(newState), JSON.stringify(prev));

  for (let key in newState) {
    initialState[key] = newState[key]
  }
});

export default actions
