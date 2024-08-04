<script lang='ts' setup>
import { ref, computed, watch, onActivated } from 'vue'
import { map, cloneDeep, flatMap, difference } from 'lodash'

const treeProps = {
  value: 'authorityId',
  label: 'menuName',
  children: 'children',
  class: customNodeClass, // 自定义节点样式
}

const props = defineProps({
  data: {
    type: Array,
    default: () => []
  },
  checked: {
    type: Array,
    default: () => []
  }
})
const treeRef = ref()

/**
 * 处理后的数据
 */
const newData = computed(() => {
  const _data = cloneDeep(props.data)
  deepHandle(_data)
  return _data
})

/**
 * 自定义节点class
 * @param data
 * @param node
 */
function customNodeClass(data: any, node: Node) {
  if (data.parentId === -1) {
    return 'is-action'
  }
  return null
}

/**
 * 递归处理数据
 * @param data
 */
function deepHandle(data: any) {
  if (!Array.isArray(data) || data.length === 0) return;
  for (const v of data) {
    if (v.children && v.children.length > 0) {
      deepHandle(v.children);
    } else if (v.actionList && v.actionList.length > 0) {
      for (const a of v.actionList) {
        a.menuName = a.actionName;
        a.parentId = -1;
      }
      v.children = v.actionList;
    }
  }
}


/**
 * 获取所有的选中节点
 */
const getCheckedKeys = () => [...treeRef.value?.getCheckedKeys(), ...treeRef.value?.getHalfCheckedKeys()]

/**
 * 平滑滚动到指定节点
 * @param name
 */
async function smoothTo(row: any) {
  const el = document.getElementById(row?.menuName)
  if (el) {
    el.scrollIntoView({ block: 'start' })
  }
}

function test(params: any) {
  // console.log(params)
}

/**
 * 展开json tree
 * @param nodes
 */
function getNodesWithChildren(nodes: any): any {
  return flatMap(nodes, (node: any) => {
    const result = node.children && node.children.length > 0 ? [node.authorityId] : [];
    return result.concat(getNodesWithChildren(node.children || []));
  })
}

watch(() => props.checked, (val: any) => {
  if (val) {
    const parentIds = getNodesWithChildren(newData.value)
    // console.log(parentIds)
    const keys = val?.map(Number)
    treeRef.value.setCheckedKeys(difference(keys, parentIds), false)
  }
})

defineExpose({
  getCheckedKeys
})

</script>
<template lang='pug'>
.menu-editor-box
  el-scrollbar.left-menu
    p(v-for="item in newData" @click="smoothTo(item)") {{ item.menuName }}
  el-scrollbar.menu-editor
    el-tree(ref="treeRef" :data="newData", :props="treeProps", show-checkbox, default-expand-all, node-key="authorityId" @check="test")
      template(#default="{ node, data }")
        h4(:id="data?.menuName" v-if="!data?.parentId") {{ data?.menuName }}
        span(v-if="data?.parentId && data?.parentId !== -1") {{ data?.menuName }}
        span(v-if="data?.parentId === -1")
          | {{ data?.menuName }}
          span(style="color: var(--main-primary);margin-right: 5px;")  [按钮]
</template>
<style lang='scss' scoped>
.menu-editor-box {
  width: 100%;
  height: 400px;
  display: flex;
  overflow: hidden;
  border: 1px solid #dcdfe6;
  border-radius: var(--el-input-border-radius, var(--el-border-radius-base));
  transition: border-color .3s ease;

  h4 {
    color: var(--main-primary);
  }

  &:hover {
    border-color: var(--el-text-color-placeholder);
  }

  .menu-editor {
    width: 100%;
    border-left: 1px solid #dcdfe6;
  }

  .left-menu {
    display: inline-block;
    white-space: nowrap;
    flex-shrink: 0 !important;

    p {
      padding: .125rem 1.25rem .125rem .625rem;
      cursor: pointer;

      &:hover {
        background-color: var(--el-fill-color-light);
      }
    }

  }
}
</style>