<!--
 * @Author       : Joe
 * @Date         : 2022-08-25 13:58:27
 * @LastEditTime : 2022-08-30 09:33:30
 * @LastEditors  : Joe
 * @FilePath     : /management/src/apps/selfService/views/equipment/index.vue
-->
<template lang="pug">
el-dialog(title='明细', :close-on-click-modal="false", @closed='closed' :width="1000")
  .third-register
    HeadOperation
      //- el-input(v-model="searchForm.name" :prefix-icon='Search', placeholder='通过终端类型查询', clearable, @keydown.enter='getAuthRegisterList')
      el-select(v-model="searchForm['baseEquipment.name']" placeholder='通过终端类型查询' clearable filterable)
        el-option(v-for="item in state.platTypeLevel" :key="item.code" :label="item.name" :value="item.code")
      //- el-input(v-model="searchForm['baseAccount.name']" :prefix-icon='Search', placeholder='通过姓名查询', clearable, @keydown.enter='getAuthRegisterList')
      el-input(v-model="searchForm['baseAccount.sno']" :prefix-icon='Search', placeholder='通过学号查询', clearable, @keydown.enter='getAuthRegisterList')
      el-button(:icon='Search', type='primary', @click='getAuthRegisterList("messageBox")') 查询
      el-button(:icon='Refresh', @click='toReset') 重置
      //- template(#right)
        el-button(:icon='Plus', type='primary', @click='showEdit = true;editForm = {};')  添加
      //- template(#fold)
        el-form(inline)
          el-row
            el-col(:xs='12', :sm='12', :md='8', :lg='6', :xl='4')
              el-form-item(label='校区：')
                campusSelector(v-model="searchForm.campusCode")
                //- el-select(v-model="searchForm.campusCode" placeholder='请选择校区' clearable filterable)
                  el-option(v-for="item in campusSelect" :key="item.code" :label="item.name" :value="item.code")
            el-col(:xs='12', :sm='12', :md='8', :lg='6', :xl='4')
              el-form-item(label='商户号：')
                el-input(v-model="searchForm.partnerKey" placeholder='请输入商户号' clearable)

    //- 列表
    el-table(:data='authRegisterList', border, size='middle')
      el-table-column(label='姓名', prop='name')
      el-table-column(label='学号', prop='sno')
      el-table-column(label='终端类型', prop='baseEquipment.name')
      //- el-table-column(label='校区', prop='baseEquipment.campusName')
      //- el-table-column(label='设备', prop='baseEquipment.equipmentName')
      //- el-table-column(label='状态', width='90', align="center")
        template(#default="scope")
          el-tag(:type="scope.row.status ? 'success' : 'danger'") {{ scope.row.status ? '可用' : '不可用'}}
      //- el-table-column(label='操作', width='60')
        template(#default='scope')
          //- el-button(type='primary', link, @click='showEdit = true;editForm = cloneDeep(scope.row);') 编辑
          el-button(type='danger', link, @click='del(scope.row, "messageBox")') 删除
    .flex-center
      el-pagination(@size-change='pagination.handleSizeChange', @current-change='pagination.handleCurrentChange', :current-page='pagination.current', :page-size='pagination.size', layout="total, sizes, prev, pager, next, jumper", :total='pagination.total', background)

    //- 添加或编辑
    el-dialog(v-model="showEdit" title="添加注册信息" @closed="closed" :width="400")
      el-form(label-width='80px', ref="editRef", :model="editForm", :rules="rules")
        el-form-item(label="注册名称", prop="name")
          el-input(v-model="editForm.name" placeholder='请输入注册名称' clearable)
      template(#footer)
        el-button(@click='showEdit = false') 取消
        el-button(type='primary', @click='add(editRef, "messageBox")') 确定
</template>
<script lang="ts" setup>
import { reactive, ref, onMounted, watch } from 'vue'
import HeadOperation from '@/components/headOperation.vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
import { Refresh, Plus, Search } from '@element-plus/icons-vue'
import { Home } from '@/service/manage'
import { useStore } from 'vuex'
import { key } from '@/store'
// import { cloneDeep } from 'lodash'


const props = defineProps({
  status: {
    type: Number,
    default: null,
  },
  show: {
    type: Boolean,
    default: false
  }
})

let searchForm = ref({
  'baseEquipment.name': 'app',
  'baseAccount.name': '',
  'baseAccount.sno': ''
})
const store = useStore(key)
const { state } = store
let editForm = ref({})
const showEdit = ref(false)
const authRegisterList = ref([])
const editRef = ref<FormInstance>()
const loading = ref(false)

// 分页相关
const pagination = reactive({
  total: 0,
  current: 1,
  size: 10,
  handleSizeChange: (_size: any) => {
    pagination.size = _size
    getAuthRegisterList()
  },
  handleCurrentChange: (_current: any) => {
    pagination.current = _current
    getAuthRegisterList()
  }
})

// 校验规则
const rules = reactive<FormRules>({
  name: [
    { required: true, message: '请输入注册名称', trigger: 'blur' },
  ]
})

// 获取注册列表
const getAuthRegisterList = async (msgBox?: string) => {
  console.log(props.status)
  const params = {
    current: pagination.current,
    size: pagination.size,
    status: props.status || undefined,
    'baseEquipment.name': searchForm.value?.['baseEquipment.name'] || undefined,
    'baseAccount.name': searchForm.value?.['baseAccount.name'] || undefined,
    'baseAccount.sno': searchForm.value?.['baseAccount.sno'] || undefined
  }
  const { data: res, msg, code }: any = await Home.getDetails(params, msgBox)
  if (code == 200) {
    authRegisterList.value = res.records
    pagination.total = res.total
  }
}

// 关闭弹框
const closed = () => {
  // editRef.value?.resetFields()
  // editForm.value = {}
  toReset()
}

// 重置查询表单
const toReset = () => searchForm.value = { 'baseEquipment.name': 'app', 'baseAccount.name': '', 'baseAccount.sno': '' }

watch(() => props.show, (v) => {
  v && getAuthRegisterList()
})

onMounted(() => {
  // getAuthRegisterList()
})


</script>

<style lang="scss" scoped>
.third-register {

  :deep(.el-input),
  :deep(.el-select) {
    max-width: 160px;
  }
}
</style>