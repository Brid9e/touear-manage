<template lang="pug">
el-form(v-loading="!loaded" label-position="top")
  el-row(v-if="isTenant && loaded" :gutter="10")
    el-col(v-if="configsKeys.includes('campus')" :span="12")
      el-form-item
        template(#label)
          el-tag 校区
        el-scrollbar.tree-box.column
          .c-box.flex
            el-checkbox(v-model="selectAll.campus" label="全选" @change="status => handleSelectAll(status, 'campus')")
            el-input(v-model="filterText.campus" placeholder="请输入校区名称" size="small" @input="filterNodes($event, 'campus')")
          el-tree(:ref="treeRef.campus" :default-checked-keys="defaultChecked['campus']", node-key="code", :data='orgData.campus', :props='{ label: "name", children: "children" }', @check='(self, isSelect) => onClick(self, isSelect, "campus")', show-checkbox, :filter-node-method="filterNode")
    el-col(v-if="configsKeys.includes('department')" :span="12")
      el-form-item
        template(#label)
          el-tag 部门
        .tree-box
          .c-box.flex
            el-checkbox(v-model="selectAll.department" label="全选" @change="status => handleSelectAll(status, 'department')")
            el-input(v-model="filterText.department" placeholder="请输入部门名称" size="small" @input="filterNodes($event, 'department')")
          el-tree-v2(:height="267" :ref="treeRef.department" :default-checked-keys="defaultChecked['department']", node-key="value",  :data='orgData.department', :props='{ label: "title", children: "children", value: "value" }', @check='(self, isSelect) => onClick(self, isSelect, "department")', show-checkbox, default-expand-all :filter-method="filterNode")
    el-col(v-if="configsKeys.includes('identity')" :span="12")
      el-form-item
        template(#label)
          el-tag 身份
        el-scrollbar.tree-box.column
          .c-box.flex
            el-checkbox(v-model="selectAll.identity" label="全选" @change="status => handleSelectAll(status, 'identity')")
            el-input(v-model="filterText.identity" placeholder="请输入身份名称" size="small" @input="filterNodes($event, 'identity')")
          el-tree(:ref="treeRef.identity" :default-checked-keys="defaultChecked['identity']", node-key="code", :data='orgData.identity', :props='{ label: "name", children: "children" }', @check='(self, isSelect) => onClick(self, isSelect, "identity")', show-checkbox, :filter-node-method="filterNode")
  //- el-form-item(label='专业')
    .tree-box
      el-tree(:default-checked-keys="defaultChecked['profess']", node-key="code", :data='orgData.profession', :props='{ label: "label", children: "children" }', @check='(self, isSelect) => onClick(self, isSelect, "profession")', show-checkbox, default-expand-all)
  //- el-form-item(label='班级')
    .tree-box
      el-tree(:default-checked-keys="defaultChecked['classs']", node-key="code", :data='orgData.classs', :props='{ label: "label", children: "children" }', @check='(self, isSelect) => onClick(self, isSelect, "classs")', show-checkbox, default-expand-all)
  el-row(v-else-if="!isTenant && loaded" :gutter="10")
    el-col(:span="12")
      el-form-item
        template(#label)
          el-tag 数据授权
        .tree-box
          .c-box.flex
            el-checkbox(v-model="selectAll.authTree" label="全选" @change="status => handleSelectAll(status, 'authTree')")
            el-input(v-model="filterText.authTree" placeholder="请输入关键字" size="small" @input="filterNodes($event, 'authTree')")
          el-tree-v2(:height="267" :ref="treeRef.authTree" node-key="id", :data='orgData.authTree', :props='defaultProps', @check='(self, isSelect) => onClick(self, isSelect, "authTree")', :default-expanded-keys="defaultExpandedKeys"  show-checkbox, :filter-method="filterNode" check-strictly)
  .empty(v-else)
    el-empty
</template>
<script lang="ts" setup>
import { nextTick, onMounted, onUnmounted, reactive, ref, toRefs } from 'vue'
import { Agency, getDataAuthConfig, Role } from '@/service/manage'
import { Group, identityInfo } from '@/service/platform'
import { ElMessage } from 'element-plus'
import { cloneDeep, intersection, map, isEmpty, pullAllBy, zipObject, countBy, filter } from 'lodash'

const props: any = defineProps({
  type: String,
  resourceId: Number,
})

const defaultProps = {
  label: "value",
  children: "children",
  value: "id",
  disabled: "disabled"
}

const dataOrigin = {
  campus: [],
  department: [],
  identity: [],
  profession: [],
  classs: [],
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
  campus: '',
  department: '',
  identity: '',
  profession: '',
  classs: '',
  orgData: cloneDeep(dataOrigin),
  allData: cloneDeep(dataOrigin),
  selectedForm: cloneDeep(dataOrigin),
  // 复选框回显数据
  defaultChecked: cloneDeep(dataOrigin),
  selectAll: {
    campus: false,
    department: false,
    identity: false,
    profession: false,
    classs: false,
    authTree: false
  }
})
const filterText = ref({})
const treeRef: any = {
  campus: ref(),
  department: ref(),
  identity: ref(),
  profession: ref(),
  classs: ref(),
  authTree: ref()
}


const { orgData, selectedForm, defaultChecked, selectAll, allData } = toRefs(dataForm)

const loaded = ref(false)

const configsData = ref()
const configsKeys = ref()
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
  getListAllExtendInfoCode: async () => {
    const params = {
      type: props.type,
      resourceId: props.resourceId, //roleid
      codeList: configsKeys.value?.join(',')
    }
    const { data, msg, code } = await identityInfo.getListAllExtendInfo(params)
    if (code === 200) {
      let obj: any = {}
      let arr: any = []
      if (isTenant.value) {
        for (let k in allData.value) arr.push(...findLastLevelCodes(allData.value[k]))
        for (let val of data) {
          if (!obj[val.code]) obj[val.code] = []
          obj[val.code].push(val.value)
        }
        for (let key in obj) {
          defaultChecked.value[key] = selectedForm.value[key] = removeNonexistentElements(arr, obj[key])
        }
      } else {
        for (let v of data) {
          arr.push(v.code + v.value)
        }
        for (let key of arr) {
          selectAuthTreeNode(key, 'authTree')
        }
        let paramsData: any = zipObject(configsKeys.value, configsKeys.value.map(() => []))
        for (let v of data) {
          if (!paramsData?.[v.code]) paramsData[v.code] = []
          paramsData[v.code].push(v.value)
        }
        selectedForm.value['authTree'] = paramsData
      }

    } else {
      ElMessage.error(msg)
    }
  },
  campus: async () => {
    const { data, msg, code } = await Group.getCampusList()
    if (code === 200) {
      orgData.value.campus = allData.value.campus = cloneDeep(data)
    } else {
      ElMessage.error(msg)
    }
  },
  identity: async () => {
    const { data, msg, code } = await identityInfo.getIdentityList()
    if (code === 200) {
      orgData.value.identity = allData.value.identity = cloneDeep(data)
    } else {
      ElMessage.error(msg)
    }
  },

  department: async () => {
    const { data, msg, code }: any = await identityInfo.getBasedepartmentTreeList()
    // const { data, msg, code }: any = await identityInfo.getBasedepartmentList()
    if (code === 200) {
      // orgData.value.department = getTrees(cloneDeep(data))
      allData.value.department = orgData.value.department = cloneDeep(data)
    } else {
      ElMessage.error(msg)
    }
  },
  authTree: async () => {
    const { data, msg, code }: any = await Role.getAuthTree()
    // const { data, msg, code }: any = await identityInfo.getBasedepartmentList()
    if (code === 200) {
      const cloneData = cloneDeep(data)
      // for (let v of cloneData) {
      //   defaultExpandedKeys.value.push(v.id)
      // }
      allData.value.authTree = orgData.value.authTree = cloneData
    } else {
      ElMessage.error(msg)
    }
  },
})

/**
 *
 * 获取数据权限配置
 *
 */
async function getAuthConfig() {
  const { data: res, msg, code } = await getDataAuthConfig()
  if (code === 200) {
    configsData.value = res
    configsKeys.value = Object.keys(configsData.value)
    // campus identity department
    isTenant.value = !isEmpty(intersection(configsKeys.value, ['campus', 'department', 'identity']))
  }
}

/**
 *
 * @date 2023-12-25 18:24:03
 * @author Joe
 * @description 将数据解析成树结构
 *
 */
const getTrees = (departments: any, parentCode = null) => {
  const tree = []
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
const saveDataLimits = async () => {
  for (let key in allData.value) {
    const checkedNodes = treeRef[key].value?.getCheckedNodes()
    const halfCheckedNodes = treeRef[key].value?.getHalfCheckedNodes()
    try {
      onClick(null, {
        checkedNodes: checkedNodes || [],
        halfCheckedNodes: halfCheckedNodes || []
      }, key)
    } catch (error) {
      // console.log(error)
    }

  }
  let params: any = {
    type: props.type,
    resourceId: props.resourceId,
    resourceMap: {
      campus: selectedForm.value.campus?.length > 0 ? selectedForm.value.campus : undefined,
      department: selectedForm.value.department?.length > 0 ? selectedForm.value.department : undefined,
      identity: selectedForm.value.identity?.length > 0 ? selectedForm.value.identity : undefined,
      profession: selectedForm.value.profession?.length > 0 ? selectedForm.value.profession : undefined,
      class: selectedForm.value.classs?.length > 0 ? selectedForm.value.classs : undefined,
      ...selectedForm.value.authTree
    }
  }
  // console.log('params', params)
  const res: any = await Agency.saveOrEditExtendInfoForRole(params)
  return new Promise((resove, reject) => {
    if (res.code === 200) resove(res)
    else reject(res)
  })
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
  return filter(filteredNodes, (e: any) => counts[e.id] === 1)
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
  console.log(selectedForm.value)
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

const init = async () => {
  if (loaded.value) return
  await getAuthConfig()
  if (isTenant.value) {
    // 走租户
    for (let v of configsKeys.value) {
      await dataApi[v]()
    }
  } else {
    // 走管理员
    await dataApi.authTree()
  }
  loaded.value = true
  await dataApi.getListAllExtendInfoCode()
}

// 筛选
const filterNode = (value: string, data: any) => {
  if (!value) return true
  return (data?.name || data?.title || data?.value).includes(value)
}

// watch(filterText, (val) => {
// })


const filterNodes = (val: any, type: any) => {
  treeRef[type].value!.filter(val)
}


// interface Department {
//   code: string
//   name: any
//   parentCode: string | null
//   type: number
//   tenantId: string | null
// }

// // 模拟一个5000个的大数据
// const generateLargeArray = (count: number) => {
//   const largeArray: Department[] = []
//   const generateCode = (index: number): string => {
//     return `00${index}`.slice(-3)
//   }
//   for (let i = 0; i < count; i++) {
//     const department: Department = {
//       code: generateCode(i),
//       name: Math.floor(Math.random() * 10000).toString(),
//       parentCode: null, // 所有节点同级，父节点为 null
//       type: 1,
//       tenantId: null,
//     }
//     largeArray.push(department)
//   }
//   return largeArray
// }

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

onUnmounted(() => {
  //
})

defineExpose({
  saveDataLimits,
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

.tree-box {
  width: 100%;
  height: 300px;
  border: 1px solid #dcdfe6;
  border-radius: var(--el-input-border-radius, var(--el-border-radius-base));
  transition: border-color .3s ease;
  overflow: hidden;

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

  &:hover {
    border-color: var(--el-text-color-placeholder);
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

    .el-checkbox {}

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
