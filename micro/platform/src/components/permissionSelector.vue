<template lang="pug">
.permission-selector(v-loading="!loaded")
  .tree-box
    .c-box.flex
      el-checkbox(v-model="selectAll.authTree" label="全选" @change="status => handleSelectAll(status, 'authTree')")
      el-input(v-model="filterText.authTree" placeholder="请输入关键字" size="small" @input="filterNodes($event, 'authTree')")
    el-tree-v2(:height="267" :ref="treeRef.authTree" node-key="id", :data='orgData.authTree', :props='defaultProps', @check='(self, isSelect) => onClick(self, isSelect, "authTree")', :default-expanded-keys="defaultExpandedKeys"  show-checkbox, :filter-method="filterNode" check-strictly)
</template>
<script lang="ts" setup>
import { nextTick, onMounted, reactive, ref, toRefs, watch } from 'vue'
import { Role } from '@/service/manage'
import { identityInfo } from '@/service/platform'
import { ElMessage } from 'element-plus'
import { cloneDeep, intersection, map, zipObject, countBy, filter, isEmpty } from 'lodash'

const props: any = defineProps({
  type: String,
  resourceId: Number,
  echoData: {
    type: Object,
    default: () => ({})
  }
})

const defaultProps = {
  label: "value",
  children: "children",
  value: "id",
  disabled: "disabled"
}

const dataOrigin = {
  authTree: []
}

/**
 *
 * @date 2022-11-24 14:02:58
 * @author Joe
 * @description 相关表单数据
 *
 */
const dataForm: any = reactive({
  orgData: cloneDeep(dataOrigin),
  allData: cloneDeep(dataOrigin),
  selectedForm: cloneDeep(dataOrigin),
  // 复选框回显数据
  defaultChecked: cloneDeep(dataOrigin),
  selectAll: {
    authTree: false
  }
})
const filterText = ref({})
const treeRef: any = {
  authTree: ref()
}

const { orgData, selectedForm, defaultChecked, selectAll, allData } = toRefs(dataForm)

const loaded = ref(false)
const configsData = ref()
const configsKeys = ref(['agency', 'subarea', 'tenant'])
const isTenant = ref(false)
const authTreeCheckedNodes: any = ref([])
const defaultExpandedKeys: any = ref([])

/**
 *
 * @date 2022-11-24 14:02:20
 * @author Joe
 * @description 相关接口
 *
 */
const dataApi: any = reactive({
  authTree: async () => {
    const { data, msg, code }: any = await Role.getAuthTree()
    // const { data, msg, code }: any = await identityInfo.getBasedepartmentList()
    if (code === 200) {
      const cloneData = cloneDeep(data)

      allData.value.authTree = orgData.value.authTree = cloneData
    } else {
      ElMessage.error(msg)
    }
  },
})

/**
 *
 * 回显数据
 *
 */
const dataEcho = (obj: any) => {
  const data = transformObject(obj)
  let paramsData: any = zipObject(configsKeys.value, configsKeys.value.map(() => []))
  for (let v of data) {
    selectAuthTreeNode(v.id, 'authTree')
    if (!paramsData?.[v.code]) paramsData[v.code] = []
    paramsData[v.code].push(v.value)
  }
  selectedForm.value['authTree'] = obj
}

function transformObject(input: any) {
  const result = []
  // 遍历输入对象的属性
  for (const key in input) {
    if (input.hasOwnProperty(key)) {
      // 检查属性的值是否为非空数组
      if (Array.isArray(input[key]) && input[key].length > 0) {
        // 将数组中的每个元素转换为 { code: key, value: element }
        for (const element of input[key]) {
          result.push({ code: key, value: element, id: key + element })
        }
      }
    }
  }
  return result
}

/**
 *
 * @date 2023-12-25 18:24:03
 * @author Joe
 * @description 将数据解析成树结构
 *
 */
const getTrees = (departments: any, parentCode = null) => {
  const tree: any = []
  for (const department of departments) {
    if (department.parentCode === parentCode) {
      const children = getTrees(departments, department.code)
      if (children.length) {
        department.children = children
      }
      tree.push(department)
    }
  }
  return tree
}


/**
 *
 * @date 2023-12-25 17:53:25
 * @author Joe
 * @description 找到最后一级元素
 *
 */
function findLastLevelCodes(nodes: any, parentCodeProperty = 'parent') {
  const hasParentCode = nodes.some((node: any) => node[parentCodeProperty] !== undefined)
  const getLastLevelCodes = (nodes: any, parentCode = null, result = [] as any) => {
    const children = nodes.filter((node: any) => node[parentCodeProperty] === parentCode)
    if (children.length === 0) {
      result.push(parentCode || '')
    } else {
      for (const child of children) {
        getLastLevelCodes(nodes, child?.code || child?.value, result)
      }
    }
    return result
  }
  // 如果没有 parentCode 属性，且存在 code 属性，则所有 code 都是最后一级
  if (!hasParentCode && nodes.every((node: any) => node.code !== undefined || node.value !== undefined)) {
    return nodes.map((node: any) => node.code || node.value)
  }
  return getLastLevelCodes(nodes)
}


/**
 *
 * @date 2023-12-25 18:20:42
 * @author Joe
 * @description 返回b数组中在a数组中存在的元素数组
 *
 */
function removeNonexistentElements(a: any, b: any) {
  const commonElements = intersection(a, b)
  return commonElements
}

/**
 *
 * @date 2022-11-24 14:50:31
 * @author Joe
 * @description 保存
 *
 */
const resultData = () => {
  for (let key in allData.value) {
    const checkedNodes = treeRef[key].value?.getCheckedNodes()
    const halfCheckedNodes = treeRef[key].value?.getHalfCheckedNodes()
    onClick(null, {
      checkedNodes: checkedNodes || [],
      halfCheckedNodes: halfCheckedNodes || []
    }, key)
  }
  return selectedForm.value.authTree

  // let params: any = {
  //   type: props.type,
  //   resourceId: props.resourceId,
  //   resourceMap: selectedForm.value.authTree
  // }

  // console.log()

  // const res: any = await Agency.saveOrEditExtendInfo(params)
  // return new Promise((resove, reject) => {
  //   if (res.code === 200) resove(res)
  //   else reject(res)
  // })
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
  return filter(filteredNodes, e => counts[e.id] === 1)
}

/**
 *
 * @date 2022-11-24 14:01:37
 * @author Joe
 * @description 节点被点击后，获取该节点和该节点的父节点(authTree除外)
 *
 */
const onClick = (self: any, isSelect: any, type: string) => {
  let paramsData: any
  if (type === 'authTree') {
    // 管理员提交数据
    paramsData = zipObject(configsKeys.value, configsKeys.value.map(() => []))
    if (self) selectAuthTreeNode(self.id, type)
    const data = filterSelectedNodes(treeRef[type].value?.getCheckedNodes())
    for (let v of data) {
      if (!paramsData?.[v.type]) paramsData[v.type] = []
      paramsData[v.type].push(v.key)
    }
  } else {
    // 租户提交数据
    paramsData = []
    for (let val of isSelect.checkedNodes) paramsData.push(val?.code || val?.value)
    for (let val of isSelect.halfCheckedNodes) paramsData.push(val?.code || val?.value)
  }
  selectedForm.value[type] = paramsData
}

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
    allChecking = !authTreeCheckedNodes.value.includes(currentNode.key)
    if (n.children?.length > 0) {
      for (let item of n.children) {
        if (item.disabled) return
        treeRef[type].value.setChecked(item.key, handleAll !== undefined ? handleAll : !authTreeCheckedNodes.value.includes(currentNode.key))
        deepCheckedChildren(item)
      }
    }
  }

  const currentNode = treeRef[type].value?.getNode(key)
  treeRef[type].value.setChecked(key, handleAll !== undefined ? handleAll : !authTreeCheckedNodes.value.includes(key))
  deepCheckedChildren(currentNode)
  // 非父级全选操作，才执行向上寻找父级
  !allChecking && deepCheckedParent(currentNode)
  // 最终选择节点的id列表
  authTreeCheckedNodes.value = treeRef[type].value.getCheckedKeys()
}

/**
 *
 * ✅全选
 *
 */
const handleSelectAll = async (status: boolean, type: string) => {
  let arr: any = []
  if (type === 'authTree') {
    arr = map(allData.value[type], 'id')
    for (let key of arr) {
      selectAuthTreeNode(key, type, status)
    }
    return
  }
  if (status) {
    arr = map(allData.value[type], type === 'department' ? 'value' : 'code')
    treeRef[type].value?.setCheckedKeys(arr)
  } else {
    treeRef[type].value.setCheckedKeys([])
    arr = []
  }

  selectedForm.value[type] = arr
}

// 筛选
const filterNode = (value: string, data: any) => {
  if (!value) return true
  return (data?.name || data?.title || data?.value).includes(value)
}

const filterNodes = (val: any, type: any) => {
  treeRef[type].value!.filter(val)
}

function clear() {
  orgData.value = cloneDeep(dataOrigin)
  allData.value = cloneDeep(dataOrigin)
  selectedForm.value = cloneDeep(dataOrigin)
  defaultChecked.value = cloneDeep(dataOrigin)
  authTreeCheckedNodes.value = []
  loaded.value = false
  for (let key in selectAll.value) {
    selectAll.value[key] = false
  }
}

const init = async () => {
  if (loaded.value) return
  // await getAuthConfig()
  await dataApi.authTree()
  // await props.cbFunction()
  loaded.value = true
  // dataApi.getListAllExtendInfoCode()
}

watch([() => props.echoData, loaded], (val) => {
  if (!isEmpty(val[0]) && val[1]) {
    dataEcho(val[0])
  }
})

onMounted(() => {
  init()
})

defineExpose({
  resultData,
  init,
  clear
})

</script>

<style lang="scss" scoped>
.empty {
  width: 100%;
}

.el-form {
  display: flex;

  .el-form-item {
    width: 100%;
  }
}

.el-row {
  width: 100%;
}

.el-select {
  width: 100%;
}

.permission-selector {
  width: 100%;
  height: 300px;



}

.tree-box {
  border: 1px solid #dcdfe6;
  border-radius: var(--el-input-border-radius, var(--el-border-radius-base));
  transition: border-color .3s ease;
  overflow: hidden;

  &:hover {
    border-color: var(--el-text-color-placeholder);
  }

  &.column {
    // display: flex;

    // background-color: red;
    .el-scrollbar__wrap {
      width: 100%;
    }

    .el-tree {
      // width: 100%;
    }
  }

  :deep(.el-tree-node__content) {
    background-color: transparent !important;

    &:hover {
      background-color: transparent !important;
    }
  }



  .c-box {
    background-color: #ffffff;
    width: 100%;
    position: sticky;
    top: 0;
    left: 0;
    padding: 0 0.5rem 0 1.5rem;
    box-sizing: border-box;
    border-bottom: 1px solid #dcdfe6;
    z-index: 2;

    .el-input {
      width: 12.5rem;
    }

    &.flex {
      display: flex;
      align-items: center;
      width: 100%;
      justify-content: space-between;
    }
  }
}
</style>