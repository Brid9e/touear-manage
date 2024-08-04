<template lang="pug">
#language-pack
  el-tabs.child-tab(v-model="activeLocal" type="card" @tab-change="searchValue = ''")
    el-tab-pane(v-for="item in initPlatType(state.platTypeList)" :label="item.name" :name="item.code" :key="item.code")
  HeaderOperation
    el-input(:prefix-icon="Search" v-model="searchValue" @keydown.enter="onSearch" placeholder="通过关键字筛选" clearable)
    el-button(type="primary" @click="onSearch" :icon="Search") 查询
    //- template(#fold)
    template(#right)
      el-button(type="primary" @click="showAdd = true" :icon="Plus") 添加 {{ platTypeMap[activeLocal] }} 多语言
      el-button(type="danger" @click="onDeleteAll" :icon="Delete") 全部清空
  langEditor(ref="langComRef" :platType="activeLocal" :searchValue="searchValue")
  AddDialog(v-model="showAdd" @cancel="showAdd = false" :title="platTypeMap[activeLocal]" :platType="activeLocal" @onSucceed="onSucceed")
  DelAllDialog(v-model="showDel" :type="activeLocal" @closed="val => showDel = val" :platTypeMap="platTypeMap" @onSucceed="onSucceed")
</template>
<script lang="ts" setup>
import { computed, ref } from 'vue'
import type { Ref } from 'vue'
import { key } from '@/store'
import { useStore } from 'vuex'
import langEditor from './modules/langEditor.vue'
import HeaderOperation from '@/components/headOperation.vue'
import AddDialog from './modules/addDialog.vue'
import DelAllDialog from './modules/delAllDialog.vue'
import { Search, Delete, Plus } from '@element-plus/icons-vue'

const store = useStore(key)
const { state } = store
const langComRef: any = ref<Ref>()
const searchValue = ref<Ref>()
const showAdd = ref<Boolean>(false)
const showDel = ref(false)
const platTypeMap = ref()

// 初始化终端类型
const initPlatType = (platTypeList: any) => {
  const obj: any = {}
  for (const v of platTypeList) {
    obj[v.code] = v.name
  }
  platTypeMap.value = obj
  return platTypeList
}

// 默认tab为第一个终端类型
const activeLocal: any = ref(initPlatType(state.platTypeList)[0]?.code)

// 成功时
const onSucceed = () => {
  langComRef.value.getLanguageData(activeLocal.value, 'messageBox')
}

// 筛选查询
const onSearch = () => {
  langComRef.value.pagination.current = 1
  langComRef.value.getLanguageData(activeLocal.value, 'messageBox')
}

// 打开全部删除弹框
const onDeleteAll = () => {
  showDel.value = true
}
</script>
<style lang="scss" scoped></style>
