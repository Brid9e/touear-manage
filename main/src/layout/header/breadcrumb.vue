<template lang='pug'>
#Breadcrumb(v-show="$route.name !== 'dashboard'")
  el-breadcrumb(v-if="breadcrumb?.length > 0" separator="/")
    el-breadcrumb-item(v-for="item in breadcrumb" :key="item.node") {{ item.name }}
  span.breadcrumb-item(v-else) {{ $route.meta.title }}
</template>
<script lang='ts' setup>
import { watch, ref, reactive, computed } from 'vue'
import { key } from '@/store';
import { useStore } from 'vuex';
import { useRoute, useRouter } from 'vue-router';

const { state } = useStore(key)
const route = useRoute()
const breadcrumb = ref([])

const defaultActiveMeauItem = computed(() => {
  const path = state.defaultActiveMeau?.slice(1)
  const item = state.orgMenuData?.find((r: any) => {
    if (r.path?.indexOf('manage-') >= 0 && path === r.path?.split('manage-')[1]) return r
    if (['http://', 'https://']?.includes(r.scheme) && path?.split('thirdPage?url=')[1] === `${r.scheme}${r.path}`) return r
    if (path === r.path) return r
  })
  return item || route.meta.title
})

const initData = computed(() => [defaultActiveMeauItem.value, state.menuData])

watch(initData, (data) => {
  if (data[0] && data[1]?.length > 0) {
    const breadcrumbData = findParents(data[1], data[0].menuId)
    breadcrumb.value = breadcrumbData
  }
})

// 寻找所有父级
const findParents = (treeData: any, node: any) => {
  let allparents: any = []
  if (treeData.length == 0) return
  let findele = (data: any, node: any) => {
    if (!node) return
    data.forEach((item: any, index: number) => {
      if (item.node === node) {
        allparents.unshift(item)
        findele(treeData, item.parentNode)
      } else if (!!item.child) findele(item.child, node)
    })
  }
  findele(treeData, node)
  return allparents
}

</script>
<style lang='scss' scoped>
#Breadcrumb {
  height: 2rem;
  // height: 100%;
  // width: 20vw;
  opacity: 0.6;
  flex-shrink: 0;
  // background-color: green;
  position: absolute;
  top: 0;
  display: flex;
  align-items: flex-end;
  // margin-right: 2rem;

  .breadcrumb-item {
    font-weight: 400;
    color: var(--el-text-color-regular);
    cursor: text;
    font-size: 14px;
  }
}
</style>