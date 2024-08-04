<template lang="pug">
el-tree-select(
  :props="defaultProps"
  :data="departList"
  node-key="value"
  check-strictly)
</template>
<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { identityInfo } from '@/service/platform'

const defaultProps = {
  children: 'children',
  label: 'title',
}

const departList = ref([])

// 获取部门
const getDepartList = async () => {
  const { data: res, code, msg }: any = await identityInfo.getBasedepartmentTreeList()
  // /berserker-base/basedepartment/gettree
  if (code === 200) {
    departList.value = res
  }
}

onMounted(() => {
  getDepartList()
})
</script>
<style lang="scss" scoped>
.el-select-v2 {
  width: 100%;
}
</style>
