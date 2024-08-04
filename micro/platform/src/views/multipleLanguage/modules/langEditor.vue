<template lang='pug'>
#lang-editor
  el-table(:data="tableData" row-key="id" v-loading="loading" lazy :load="load" :tree-props="{ children: 'children', hasChildren: 'haveChildren' }")
    //- el-table-column(label="编号" prop="id" align="center", :width="100")
    //- el-table-column(label="编号" prop="id" width="90" align="center")
    el-table-column(label="多语言Key" prop="languageKey" show-overflow-tooltip)
      template(#default="scope")
        //- el-input(v-if="scope.row.isEdit" v-model="editData.languageKey" placeholder="请输入多语言Key" :disabled="scope.row.loading" type="textarea")
        span {{ scope.row.languageKey }}
    el-table-column(label="中文·简体" prop="cn" show-overflow-tooltip)
      template(#default="scope")
        el-input(v-if="scope.row.isEdit" v-model="editData.languageCn" placeholder="请输入中文·简体内容" :disabled="scope.row.loading" type="textarea")
        span(v-else) {{ scope.row.languageCn }}
    el-table-column(label="中文·繁体" prop="hk" show-overflow-tooltip)
      template(#default="scope")
        el-input(v-if="scope.row.isEdit" v-model="editData.languageHk" placeholder="请输入中文·繁体内容" :disabled="scope.row.loading" type="textarea")
        span(v-else) {{ scope.row.languageHk }}
    el-table-column(label="英文" prop="en" show-overflow-tooltip)
      template(#default="scope")
        el-input(v-if="scope.row.isEdit" v-model="editData.languageEn" placeholder="请输入英文内容" :disabled="scope.row.loading" type="textarea")
        span(v-else) {{ scope.row.languageEn }}
    //- el-table-column(label="英文" prop="en")
      template(#default="scope")
        span {{ scope.row }}
    el-table-column(label="操作" width="110")
      template(#default="scope")
        el-button(v-if="!scope.row.isEdit && !scope.row.haveChildren" type="primary" link @click="editItem(scope.row)") 编辑
        el-button(v-if="scope.row.isEdit && !scope.row.haveChildren" :disabled="scope.row.loading" type="primary" link @click="saveItem(scope.row, 'messageBox')" :loading="scope.row.loading") 保存
        el-button(v-if="scope.row.isEdit && !scope.row.haveChildren" type="primary" link @click="cancelItem(scope.row, scope.$index)") 取消
        el-button(v-if="!scope.row.isEdit" type="danger" link @click="removeItem(scope.row)") 删除

  .flex-center
    el-pagination(@size-change='pagination.handleSizeChange', @current-change='pagination.handleCurrentChange', :current-page='pagination.current', :page-size='pagination.size', layout="total, sizes, prev, pager, next, jumper", :total='pagination.total', background)
</template>
<script lang='ts' setup>
import { ref, watch, onMounted, reactive } from 'vue'
import type { Ref } from 'vue'
import { cloneDeep, isEmpty } from 'lodash'
import { getTableTree } from '@/assets/scripts/utils'
import { Language } from '@/service/platform'
import { ElMessage, ElMessageBox } from 'element-plus'

const props = defineProps({
  data: {
    type: Array,
    default: []
  },
  platType: {
    type: String,
    default: ''
  },
  searchValue: {
    type: String,
    default: ''
  }
})

const loading = ref(false)
// 表格数据
const tableData: any = ref()
// 缓存编辑数据
const catchEditData: any = ref({})
// 编辑数据
const editData: any = ref()
// 缓存表格数据
const catchTableData: any = ref({})

// 分页相关
const pagination = reactive({
  total: 0,
  current: 1,
  size: 10,
  handleSizeChange: (_size: any) => {
    pagination.size = _size
    getLanguageData(props.platType)
  },
  handleCurrentChange: (_current: any) => {
    pagination.current = _current
    getLanguageData(props.platType)
  }
})

// 转为表格的数结构
const dataToTree = (data: any) => {
  return getTableTree.generateOptions(data, { nodeKey: 'id', parentNodeKey: 'parentId', childrenKey: 'children' }, { isEdit: false })
}

// 保存
const saveItem = async (item: any, msgBox: string) => {
  item.loading = true
  const params = {
    id: editData.value.id,
    languageCn: editData.value.languageCn,
    languageEn: editData.value.languageEn,
    languageHk: editData.value.languageHk,
    languageKey: editData.value.languageKey,
  }
  const { data: res, code } = await Language.editLanguage(params, msgBox)
  item.isEdit = item.loading = false
  if (code === 200) tableData.value = getTableTree.replaceObjectById(tableData.value, item.id, editData.value, { idKey: 'id', childrenKey: 'children' })
}

// 编辑
const editItem = (item: any) => {
  editData.value = catchEditData.value[item.id] = cloneDeep(item)
  item.isEdit = true
}

// 取消
const cancelItem = (item: any, i: number) => {
  item.isEdit = false
  item = catchEditData.value[item.id]
}


//  删除
const removeItem = async (item: any) => {
  ElMessageBox.confirm("确定删除该条多语言数据吗?", "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning"
  }).then(async () => {
    const { data: res, code } = await Language.removeLanguage(item.id, 'messageBox')
    if (code === 200) {
      ElMessage.success('删除成功')
      getLanguageData(props.platType)
    }
  })
}


const getLanguageData = async (type: string, msgBox?: string, isParent = props?.searchValue ? 0 : 1) => {
  loading.value = true
  const params = {
    platType: type,
    current: pagination.current,
    size: pagination.size,
    isParent,
    info: props?.searchValue || undefined
  }
  const { data: res, code } = await Language.getLanguagePage(params, msgBox)
  loading.value = false
  if (code === 200) {
    pagination.total = res.total
    // tableData.value = catchTableData.value[type] = dataToTree(res.records)
    // tableData.value = dataToTree(res.records)
    tableData.value = res.records
  }
}


//

const load = async (row: any, treeNode: unknown, resolve: (date: any) => void) => {
  console.log(row)
  const params = {
    parentId: row.id,
    platType: props.platType,
    size: 1000,
  }
  const { data: res, code } = await Language.getLanguagePage(params, 'messageBox')
  loading.value = false
  if (code === 200) {
    resolve(res.records)
  }
}

watch(() => props.platType, (type: string) => {
  pagination.current = 1
  getLanguageData(type)
}, {
  immediate: true
})

defineExpose({
  getLanguageData,
  pagination
})
</script>
<style lang='scss' scoped>
#lang-editor {
  :deep(.el-table__placeholder) {
    display: block;
  }

  :deep(.el-table__indent) {
    padding: 0 !important;
  }

}

:deep(.el-table__row--level-1) {
  background-color: var(--el-fill-color-lighter) !important;
}
</style>