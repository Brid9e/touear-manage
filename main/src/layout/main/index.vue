<!--
 * @Author: Joe
 * @Date: 2022-10-11 18:11:06
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2024-04-23 09:16:08
 * @FilePath: /management-micro/main/src/layout/main/index.vue
 * @Description:
 *
 * Copyright (c) 2022 by Brid9e wangdongqiao1997@163.com, All Rights Reserved.
-->

<template lang="pug">
el-scrollbar.Main-window.main-box-shadow(@scroll="scrollTop" :class="{'clear-bg': clearBg }")
  Breadcrumb
  //- .micro-page(:id="`page-${item.code}`"  v-for="item in microAppList" :key="item.code" v-show="$route?.name == item.code")
  RouterView(v-slot="{ Component }")
    KeepAlive
      component(:key="$route?.path" :is="Component" v-if="$route?.meta.keepAlive")

</template>

<script lang="ts" setup>
import { ref, watch, reactive, onMounted, computed } from "vue"
import { useRouter, useRoute } from "vue-router"
import { useStore } from "vuex"
import { key, store } from "@/store"
import Breadcrumb from "../header/breadcrumb.vue"
import { localIP } from '../../../../address'
// import { map, reduce } from 'lodash'
// import { microAppList } from '../../../../api.config'
// import { portMap } from '../../../../microPort'
// import { loadMicroApp, prefetchApps, start, initGlobalState } from "qiankun"

const { state } = useStore(key)
const route = useRoute()
const router = useRouter()

// 微应用loading
// const loading: any = ref(reduce(microAppList, (result: any, value: any) => {
//   result[value.code] = true
//   return result
// }, {}))

// 不显示背景
const clearBg = computed(() => {
  let arr: any = ["dashboard"]
  return arr.includes(route.name)
})

// 本地开发环境跳转地址
// const myIp = localIP
// const entryObj: any = reactive(reduce(microAppList, (result: any, value: any) => {
//   result[value.code] = `//${myIp || "127.0.0.1"}:${(portMap as any)[value.code]}`
//   return result
// }, {}))

// 创建预加载列表
// const prefetchAppList = map(microAppList, ({ name, code }: any) => {
//   return { name: code, entry: process.env.NODE_ENV == "development" ? entryObj[code] : state.configs.base }
// })

// 预加载
// prefetchApps(prefetchAppList)

// 监听路由变化，判断路由为子应用时（item.meta.isMicroApp）手动注册子应用
watch(
  () => router.currentRoute.value,
  async (item: any, oItem: any) => {
    await store.dispatch("defaultActiveMeauAction", item.fullPath)
  },
  { immediate: true }
)

// const scrollTop = (val: any) => {
//   state.microList["manage-platform"]?.update({ scrollTop: val.scrollTop })
// }

// // 初始化qiankun
// const initQiankunData = () => {
//   const _state = { name: "", loading: true, funcButton: state.funcButton }
//   const actions = initGlobalState(_state)
//   actions.onGlobalStateChange((state: any, prev: any) => (loading.value[state.name] = state.loading))
// }

onMounted(() => {
  // 启动qiankun，必选，否则会出现第一次加载白屏的情况
  // start()
  // initQiankunData()
})

// watch(
//   () => state.funcButton,
//   (val: any) => {
//     if (JSON.stringify(val) !== "{}") {
//       initQiankunData()
//     }
//   }
// )
</script>

<style lang="scss" scoped>
.Main-window {
  width: 100%;
  background-color: var(--main-color-default);
  height: calc(100vh - 0.625rem - 60px) !important;
  border-radius: var(--main-border-radius) 0 0 0;
  padding: 3.25rem 1.25rem 1.25rem !important;
  box-sizing: border-box;
  overflow-x: hidden;
}

.clear-bg {
  background-color: transparent !important;
  box-shadow: none !important;
  padding-top: 0 !important;
  padding-left: 0 !important;
  padding-bottom: 0 !important;
}
</style>
