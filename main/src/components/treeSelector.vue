<template lang="pug">
el-tree-select(
  :ref="treeRef.authTree"
  :props="defaultProps"
  :data="datasList"
  :node-key="selectTypes === 'auth' ? 'id' : 'value'"
  :multiple="false"
  show-checkbox
  filterable
  :check-strictly='true'
  :collapse-tags-tooltip='true'
  collapse-tags
  :default-expanded-keys="defaultExpandedKeys"
  @check='(self, isSelect) => onClick(self, isSelect, "authTree")'
  )
//- el-input(
//-   v-model="filterText"
//-   style="width: 240px"
//-   placeholder="Filter keyword"
//- )
</template>
<script lang="ts" setup>
import { ref, onMounted, useAttrs, watch } from 'vue'
import { identityInfo } from '@/service/platform'
import { Type, getAuthTree } from '@/service/multiMedia'
import { cloneDeep, intersection, map, isEmpty, pullAllBy, zipObject, countBy, filter } from 'lodash'
// 获取tree展示数据
const props = defineProps(["selectTypes", "isTenant", "configsKeys"])
const defaultProps = {
  label: props.selectTypes === 'auth' ? "value" : 'title',
  children: "children",
  value: props.selectTypes === 'auth' ? "id" : 'value',
  disabled: "disabled"
}
const emits = defineEmits<{ (e: 'authParams', src: any): void }>()
const datasList: any = ref([])
const filterText = ref('')
const treeRef: any = {
  authTree: ref()
}
const authTreeCheckedNodes: any = ref([])
const defaultExpandedKeys: any = ref([])
watch(filterText, (val) => {
  treeRef.value!.filter(val)
})
// 获取部门
const getDepartList = async () => {
  const { data: res, code, msg }: any = await identityInfo.getBasedepartmentTreeList()
  if (code === 200) {
    datasList.value = res
  }
}

// 获取权限树
const getAuthList = async () => {
  const { data, code, msg }: any = await getAuthTree()
  if (code === 200) {
    datasList.value = data
  }
  if (code === 200) {
    const cloneData = cloneDeep(data)
    const deep = (data: any) => {
      for (let v of data) {
        v.disabled = !v.selected
        v.id = v.type + v.key
        defaultExpandedKeys.value.push(v.id)
        if (v.children?.length > 0) {
          deep(v.children)
        }
      }
    }
    deep(cloneData)
    // console.log('defaultExpandedKeys---------', defaultExpandedKeys.value)
    // allData.value.authTree = orgData.value.authTree = cloneData
  }
}
// 获取通知类型
const getMediaType = async () => {
  const { data: res, code, msg }: any = await Type.getMediaType({
    isTree: 1,
    parentId: 1
  })
  if (code === 200) {
    datasList.value = res
  }
}
watch(
  () => props.selectTypes,
  async (newV: any, oldV: any) => {
    if (newV === 'noticeType') {
      getMediaType()
    }
    if (newV === 'depart') {
      getDepartList()
    }
    if (newV === 'auth') {
      await getAuthList()
      // 测试下拉回显
      // if (props.selectTypes === 'auth') {
      //   const data = [
      //     {
      //       code: 'agency',
      //       value: '2'
      //     },
      //     {
      //       code: 'tenant',
      //       value: '829935'
      //     }
      //   ]
      //   const arr = ['agency2', 'tenant829935']
      //   for (let key of arr) {
      //     selectAuthTreeNode(key, 'authTree')
      //   }
      // let paramsData: any = zipObject(props.configsKeys, props.configsKeys.map(() => []))
      // for (let v of data) {
      //   if (!paramsData?.[v.code]) paramsData[v.code] = []
      //   paramsData[v.code].push(v.value)
      // }
      // }
    }
  },
  { immediate: true }
)
/**
 *
 * 点击某个节点复选框时
 * @param {*} key 点击节点的key
 * @param {*} type code
 * @param {*} handleAll 是否点击了全选
 *
 */
function selectAuthTreeNode(key: any, type: string, handleAll?: boolean) {

  // 是否为全选操作
  let allChecking = false

  /**
   * 获取所有子级的key
   */
  const getChildrenAllKeys = (n: any) => {
    let arr: any[] = []
    const deepGetChildrenKeys = (children: any) => {
      if (children?.length > 0) {
        children.forEach((item: any) => {
          !item.disabled && arr.push(item.key)
          deepGetChildrenKeys(item.children)
        })
      }
    }
    deepGetChildrenKeys(n.parent?.children)
    return arr
  }

  /**
   * 判断是否全选了节点的子级，若与父级的children数量不一致，即为非全选
   * 后续取消所有父级的勾选
   */
  const allElementsExist = (arr1: any, arr2: any) => {
    const inter = intersection(arr1, arr2);
    return inter.length === arr1.length;
  }

  /**
   * 由下级往上级选择逻辑
   */
  const deepCheckedParent = (n: any) => {
    const keys = getChildrenAllKeys(n)
    const allCheckKeys = treeRef[type].value.getCheckedKeys()
    const noDeep = allElementsExist(keys, allCheckKeys)
    console.log('---------由下往上deepCheckedParent', keys, allCheckKeys, noDeep)
    if (!noDeep) {
      allChecking = false
      treeRef[type].value.setChecked(n.parent.key, noDeep)
      deepCheckedParent(n.parent)
    }
  }
  /**
   * 由上级往下级选择逻辑(全选逻辑)
   */
  const deepCheckedChildren = (n: any) => {
    allChecking = !authTreeCheckedNodes.value.includes(currentNode?.key)
    console.log('------由上到下', allChecking, currentNode.key, n.children)
    if (n.children?.length > 0) {
      for (let item of n.children) {
        if (item.disabled) return
        treeRef[type].value.setChecked(item.key, handleAll !== undefined ? handleAll : !authTreeCheckedNodes.value.includes(currentNode.key))
        deepCheckedChildren(item)
      }
    }
  }

  const currentNode = treeRef[type].value?.getNode(key)
  // console.log('-------currentNode', key, treeRef[type].value, currentNode)
  // console.log('-----------ckecked', handleAll !== undefined ? handleAll : !authTreeCheckedNodes.value.includes(key))
  // treeRef[type].value.setChecked('subarea2', true)
  // treeRef[type].value.setChecked('agency2', true)
  treeRef[type].value.setChecked(key, handleAll !== undefined ? handleAll : !authTreeCheckedNodes.value.includes(key))
  deepCheckedChildren(currentNode)
  // 非父级全选操作，才执行向上寻找父级
  console.log('-----allChecking', allChecking)
  !allChecking && deepCheckedParent(currentNode)
  // 最终选择节点的id列表
  authTreeCheckedNodes.value = treeRef[type].value.getCheckedKeys()
}
/**
 * 处理authTree，若全选，只取父级
 * @param selectedNodes 仅authTree的数据
 */
function filterSelectedNodes(selectedNodes: any) {
  const filteredNodes = cloneDeep(selectedNodes)
  // 使用单个循环遍历所有节点
  for (const node of filteredNodes) {
    flatChildren(node, filteredNodes)
  }
  // 计数，取出只出现一次的元素
  const counts = countBy(filteredNodes, 'id')
  return filter(filteredNodes, (e: any) => counts[e.id] === 1)
}

const onClick = (self: any, isSelect: any, type: string) => {
  if (props.selectTypes !== 'auth') return
  let paramsData: any
  paramsData = zipObject(props.configsKeys, props.configsKeys?.map(() => []))
  // if (self) selectAuthTreeNode(self.id, type)
  const data = treeRef[type].value?.getCheckedNodes()
  for (let v of data) {
    if (!paramsData?.[v.type]) paramsData[v.type] = []
    paramsData[v.type].push(v.key)
  }
  // console.log('-----data', treeRef[type].value?.getCheckedNodes())
  // console.log('--------aaaa----------', props.isTenant, props.configsKeys, paramsData)
  /*  if (type === 'authTree') {
     // 管理员提交数据
     paramsData = zipObject(props.configsKeys, props.configsKeys?.map(() => []))
     // if (!props.isTenant) paramsData = ['agency', 'subarea', 'tenant']
     console.log('--------aaaa----------', props.isTenant, props.configsKeys, paramsData)

     if (self) selectAuthTreeNode(self.id, type)
     const data = filterSelectedNodes(treeRef[type].value?.getCheckedNodes())
     console.log('-----data', data)
     for (let v of data) {
       if (!paramsData?.[v.type]) paramsData[v.type] = []
       paramsData[v.type].push(v.key)
     }
   } else {
     // 租户提交数据
     paramsData = []
     for (let val of isSelect.checkedNodes) paramsData.push(val?.code || val?.value)
     for (let val of isSelect.halfCheckedNodes) paramsData.push(val?.code || val?.value)
   } */
  emits('authParams', paramsData)
  console.log('paramsData', paramsData)
  // selectedForm.value[type] = paramsData
}
/**
 * 扁平Nodes
 * @param item
 */
const flatChildren = (item: any, nodes: any) => {
  if (item?.children?.length > 0) {
    for (const v of item.children) {
      nodes.push(v)
      flatChildren(v, nodes)
    }
  }
}
onMounted(() => {
})
</script>
<style lang="scss" scoped>
.el-select-v2 {
  width: 100%;
}
</style>
