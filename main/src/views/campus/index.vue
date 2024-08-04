<!--
 * @Author       : Joe
 * @Date         : 2022-08-25 13:58:27
 * @LastEditTime : 2022-08-30 09:33:30
 * @LastEditors  : Joe
 * @FilePath     : /management/src/apps/selfService/views/equipment/index.vue
-->
<template lang="pug">
.campus-manage
  HeadOperation
    el-input(:prefix-icon='Search', v-model="searchForm.name", placeholder='通过校区名称查询', clearable, @keydown.enter='getCampusList("messageBox")')
    el-input(:prefix-icon='Search', v-model="searchForm.code", placeholder='通过校区code查询', clearable, @keydown.enter='getCampusList("messageBox")')
    el-button(:icon='Search', type='primary', @click='getCampusList("messageBox")') 查询
    el-button(:icon='Refresh', @click='toReset') 重置
    template(#right)
      //- el-button.margin-left-3x(:icon='Histogram', type='primary',@click='') 统计
      el-button(:loading="outputLoading" :icon="Plus" type='primary', @click="dialogTitle = '添加校区';showDialog = true") 添加

  el-table(:data="campusList" border v-loading="loading")
    el-table-column(label='校区编号', prop="code")
    el-table-column(label='校区名称', prop="name")
    el-table-column(label='操作' width="120")
      template(#default="scope")
        el-button(type="primary" link @click="editForm = cloneDeep(scope.row);dialogTitle = '编辑校区';showDialog = true") 编辑
        el-button(type="danger" link @click="remove(scope.row.code, scope.row.name, 'messageBox')") 删除

  el-dialog(:title="dialogTitle" v-model="showDialog" :width="400" @closed="closed")
    el-form(label-width='100px', ref="editRef", :model="editForm", :rules="rules")
      el-form-item(v-if="isAdd" label="校区Code" prop="code")
        el-input(v-model="editForm.code" placeholder="请输入校区Code")
      el-form-item(label="校区名称" prop="name")
        el-input(v-model="editForm.name" placeholder="请输入校区名称")
    template(#footer)
      el-button(@click="showDialog = false") 取消
      el-button(type="primary" @click="editOrAdd(editRef, 'messageBox')") 确定
      //-
  .flex-center
    el-pagination(@size-change='pagination.handleSizeChange', @current-change='pagination.handleCurrentChange', :current-page='pagination.current', :page-size='pagination.size', layout="total, sizes, prev, pager, next, jumper", :total='pagination.total', background)
</template>

<script lang="ts" setup>
import { ref, onMounted, reactive, computed } from 'vue'
import HeadOperation from '@/components/headOperation.vue'
import { Refresh, Plus, Search, MagicStick, DocumentChecked, Tools, User, Notification, Printer, CirclePlus, Delete, Close, Paperclip, Link, Upload, Histogram } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus';
import { Campus } from '@/service/manage';
import { cloneDeep } from 'lodash'

const campusList = ref([])
const searchForm: any = ref({})
const editForm: any = ref({})
const editRef = ref()
const showDialog = ref(false)
const loading = ref(false)
const dialogTitle = ref('添加校区')
const pages = ref(0)

const rules = reactive({
  name: [
    { required: true, message: '请输入校区名称', trigger: 'blur' },
  ],
  code: [
    { required: true, message: '请输入校区code', trigger: 'blur' },
  ]
})

const isAdd = computed(() => dialogTitle.value === '添加校区')

// 分页相关
const pagination = reactive({
  total: 0,
  current: 1,
  size: 10,
  handleSizeChange: (_size: any) => {
    pagination.size = _size
    getCampusList()
  },
  handleCurrentChange: (_current: any) => {
    pagination.current = _current
    getCampusList()
  }
})

// 查询校区列表
const getCampusList = async (msgBox?: string) => {
  loading.value = true
  const params = {
    current: pagination.current,
    size: pagination.size,
    name: searchForm.value?.name || undefined,
    code: searchForm.value?.code || undefined,
  }
  const { data: res, msg, code }: any = await Campus.getCampusPage(params, msgBox)
  loading.value = false
  if (code === 200) {
    campusList.value = res.records
    pages.value = res.pages
    pagination.total = res.total
  }
}

// 添加或编辑校区
const editOrAdd = async (ref: any, msgBox: string) => {
  if (!ref) return
  await ref.validate(async (valid: any, fields: any) => {
    if (valid) {
      const params = {
        code: editForm.value?.code || undefined,
        name: editForm.value?.name || undefined
      }
      const { data: res, msg, code }: any = await Campus[isAdd.value ? 'addCampus' : 'editCampus'](params, msgBox)
      if (code === 200) {
        showDialog.value = false
        ElMessage.success(isAdd.value ? '添加成功' : '编辑成功')
        getCampusList()
      }
    }
  })
}

// 删除校区
const remove = async (code: string, name: string, msgBox: string) => {
  ElMessageBox.confirm(`你确定要删除 ${name} 校区相关信息吗？`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消'
  })
    .then(async () => {
      const params = {
        code
      }
      const { data: res, msg, code: _code }: any = await Campus.removeCampus(params, msgBox)
      if (_code === 200) {
        ElMessage.success('删除成功')
        getCampusList()
      }
    })
    .catch(() => {
      return
    })


}


// 重置
const toReset = () => {
  searchForm.value = {}
}

// 关闭
const closed = () => {
  editRef.value?.resetFields()
  editForm.value = {}
}

onMounted(() => {
  getCampusList()
})

</script>