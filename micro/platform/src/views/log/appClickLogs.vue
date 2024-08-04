<template lang="pug">
headOperation
  el-input(v-model='form.appName', :prefix-icon='Search',@input="form.appId = ''"  placeholder='请输入应用名称', clearable, style='margin-right: 12px', @keydown.enter='toFilter')
  el-button(:icon='Search', type='primary', @click='toFilter') 查询
  el-button(:icon='Refresh', @click='toReset') 重置
  template(#fold)
      el-form(label-width='120px', inline)
        el-row
          el-col(:xs='12', :sm='12', :md='8', :lg='6', :xl='4')
            el-form-item(label='选择应用：')
              el-select(v-model="form.appId" placeholder="请选择应用" clearable @change="form.appName = ''")
                el-option(v-for="(item, index) in appSelect" :key="index" :label="item.appName" :value="item.bh")
          //- el-col(:xs='12', :sm='12', :md='8', :lg='6', :xl='4')
          //-   el-form-item(label='终端类型：')
          //-     el-select(v-model="form.platType" placeholder="请选择终端类型" clearable)
          //-       el-option(v-for="(item, index) in platSelect" :key="index" :label="item.name" :value="item.code")
          el-col(:xs='12', :sm='12', :md='12', :lg='8', :xl='6')
            el-form-item(label='时间：')
              el-date-picker(v-model="form.date" value-format="YYYY-MM-DD HH:mm:ss" type="datetimerange" style="width: auto;" placeholder='请输入内容' range-separator="至")
.table-content
  el-table(:data='table.tableData', v-loading='tableLoading', size='medium')
    el-table-column.text-center(prop='ROW_ID', label='编号', width="80", align='center', )
    el-table-column.text-center(prop='ACCOUNT_NAME', label='用户名')
    el-table-column.text-center(prop='ACCOUNT_SNO', label='学号')
    el-table-column.text-center(prop='ACCOUNT_MOBILE', label='手机号码')
    el-table-column.text-center(prop='APP_APP_NAME', label='应用名称')
    el-table-column.text-center(prop='APP_APP_ID', label='应用编号')
    el-table-column.text-center(prop='CREATE_TIME', label='发生时间')
  el-pagination.flex-box.flex-center(background, @size-change='handleSizeChange', @current-change='handleCurrentChange', :current-page='table.currentPage', :page-sizes='[10, 20, 30, 40]', :page-size='table.pageSize', layout='total, sizes, prev, pager, next, jumper', :total='table.total')
</template>

<script lang="ts" setup>
import { defineComponent, reactive, toRefs, ref } from 'vue'
import { ElMessage, ElTable } from 'element-plus'
import { Cloud } from '@/service/cloud'
import { Log } from '@/service/platform/index'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { key } from '@/store'
import { App } from '@/service/platform';
import _ from 'lodash'
import HeadOperation from '@/components/headOperation.vue'
const router = useRouter()
const route = useRoute()
const store = useStore(key)
const { state } = store
let form: any = reactive({
  // platType: '', // app, pc, 暂不支持
  appId: '',
  appName: '',
  date: []
})
// const plat = ['app', 'pc']
// const platTypeLevel = store.state.platTypeLevel
// const platSelect = store.state.platTypeLevel.filter((o:any)=>{ return plat.includes(o.code) })
const platTypeLevel = store.state.platTypeLevel
const platType = store.state.platTypeLevel.filter((o:any)=>{ return o.code !== 'selfService'}).map((m:any) => {return m.code} )
const table: any = reactive({
  currentPage: 1,
  total: 0,
  pageSize: 10,
  tableData: [],
  tableLoading: true
})
const toReset = () => {
  form = {}
}
const toFilter = () => {
  table.currentPage = 1
  getTableData('messageBox')
}
const getTableData = async(feedbackType?: string) => {
  let params:any = {
    current: table.currentPage,
    size: table.pageSize,
    type: 'app',
    appId: form?.appId,
    appName: form?.appName,
    startCreateTime: form?.date?.[0],
    endCreateTime: form?.date?.[1]
  }
  params = _.pickBy({
    ...params
  })
  const res = await Log.gatAppClickLogs(params);
  if (res && res.data && res.data.records) {
    table.tableLoading = false
    const data = res.data.records
    table.tableData = data
    table.total = res.data.total
  } else {
    table.tableLoading = false
  }
}
getTableData()
const handleSizeChange = (val: number) => {
  table.pageSize = val
  table.currentPage = 1
  getTableData()
}
const handleCurrentChange = (val: number) => {
  table.currentPage = val
  getTableData()
}
const appSelect = ref([])
// 获取应用列表
const getAppSelectList = async () => {
  const params: any = {
    platType: platType.join(',')
  }
  const { data: res, msg, code }: any = await App.getZappListAll(params)
  if (code === 200) appSelect.value = res
}
getAppSelectList()
</script>
<style lang="scss" scoped>
.table-inner{
  padding: 15px;
  p{
    margin-bottom:5px;
    span{color:#999;}
  }
}
</style>
