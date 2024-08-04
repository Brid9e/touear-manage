<!--
 * @Author: Joe
 * @Date: 2022-10-12 13:33:12
 * @LastEditors: Joe
 * @LastEditTime: 2022-10-14 16:30:56
 * @FilePath: /management_micro/main/src/layout/aside/subMenu.vue
 * @Description:
 *
 * Copyright (c) 2022 by Brid9e wangdongqiao1997@163.com, All Rights Reserved.
 @mouseenter="item.options=true" @mouseleave="item.options=false"
-->
<template lang='pug'>
#SubMenu
  .sub-item(v-for="item in menuDataList" :key="item.node")
    el-menu-item(v-if="!item.child || item.child?.length === 0" :index="item.index" @click="selectMenu(item)")
      .icon-box(v-if="item.icon && isCollapse")
        el-icon(:size="16")
          component(:is="ElIconAll[item.icon]")
      template(#title)
        .icon-box(v-if="item.icon")
          el-icon(:size="16")
            component(:is="ElIconAll[item.icon]")
        .titles(style="width:100%")
          span {{item.name}}
    el-sub-menu(popper-class="menu-popper" v-else :index="item.index")
      template(#title)
        .icon-box(v-if="item.icon")
          el-icon(:size="isCollapse ? 20 : 16")
            component(:is="ElIconAll[item.icon]")
        .titles(style="width:100%")
          span {{item.name}}
      SubMenu(:menuDataList="item.child")
</template>
<script lang='ts' setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router';
import SubMenu from './subMenu.vue'
import { useStore } from 'vuex'
import { key } from '@/store'
import * as ElIcons from '@element-plus/icons-vue'
import { logSave } from '@/service/manage';
// import ThirdPage from '@/views/thirdPage/index.vue'

const router = useRouter()
const route = useRoute()
const ElIconAll = computed(() => ElIcons)
const { state } = useStore(key)

const props = defineProps({
  menuDataList: Array,
  isCollapse: Boolean
})

const selectMenu = (data: any) => {
  // statistic(data)
  initShortcut()
  if (data.index.indexOf('iframe_') > -1) {
    const _PATH = data.index.split('iframe_')[1]
    router.push({ path: `/${_PATH}` })
    if (!duplicateShortcut(data.index)) state.shortcut.push({ ...data, path: `/${_PATH}`, isActive: true, isMicroApp: true })
    else duplicateShortcut(data.index).isActive = true
    sessionStorage.shortcut = JSON.stringify(state.shortcut)
  } else if (data.index.indexOf('http://') > -1 || data.index.indexOf('https://') > -1) {
    if (data.target === '_blank') {
      window.open(data.index, '_blank');
      return
    }
    if (!duplicateShortcut(data.index)) state.shortcut.push({ ...data, path: `/thirdPage?url=${data.index}`, isActive: true, isMicroApp: true, isThird: true })
    else duplicateShortcut(data.index).isActive = true
    router.push({ path: 'thirdPage', query: { url: data.index } })

  } else {
    if (!duplicateShortcut(data.index)) state.shortcut.push({ ...data, path: data.index, isActive: true, isMicroApp: false })
    else duplicateShortcut(data.index).isActive = true
    router.push({ path: data.index })
  }
  sessionStorage.shortcut = JSON.stringify(state.shortcut)
}

const initShortcut = () => {
  for (let val of state.shortcut) {
    val.isActive = false
  }
}

const duplicateShortcut = (index: string): any => {
  for (let val of state.shortcut) {
    if (val.index === index) return val
  }
  return false
}

/**
 * 统计菜单访问
 * @param routeData
 */
async function statistic(routeData: any) {
  if (routeData?.index === route.path) return
  const params = {
    type: 'manageMenu',
    appId: routeData?.node
  }
  await logSave(params, 'null').catch()
}
</script>
