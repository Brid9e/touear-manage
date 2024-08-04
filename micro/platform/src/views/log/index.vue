<template lang="pug">
headOperation
  el-input(v-model='form.path', :prefix-icon='Search', placeholder='请输入路径', clearable, style='margin-right: 12px', @keydown.enter='toFilter')
  el-button(:icon='Search', type='primary', @click='toFilter') 查询
  el-button(:icon='Refresh', @click='toReset') 重置
  template(#fold)
      el-form(label-width='120px', inline)
        el-row
          el-col(:xs='12', :sm='12', :md='8', :lg='6', :xl='4')
            el-form-item(label='请求方式：')
              el-select(v-model='form.method', placeholder='请选择')
                el-option(label='GET', value='GET')
                el-option(label='POST', value='POST')
          el-col(:xs='12', :sm='12', :md='8', :lg='6', :xl='4')
            el-form-item(label='IP：')
              el-input(v-model='form.ip', placeholder='请输入内容')
          el-col(:xs='12', :sm='12', :md='8', :lg='6', :xl='4')
            el-form-item(label='请求开始时间：')
              el-date-picker(v-model='form.startRequestTime' type='datetime' placeholder='请选择'  format="YYYY-MM-DD hh:mm:ss"  value-format="YYYY-MM-DD hh:mm:ss")
          el-col(:xs='12', :sm='12', :md='8', :lg='6', :xl='4')
            el-form-item(label='请求结束时间：')
              el-date-picker(v-model='form.endRequestTime' type='datetime' placeholder='请选择'  format="YYYY-MM-DD hh:mm:ss"  value-format="YYYY-MM-DD hh:mm:ss")
.table-content
  el-table(:data='table.tableData', v-loading='tableLoading')
    el-table-column(type='expand')
      template(#default='props')
        div.table-inner(m='4')
          p
            span 请求数据:
            | {{ props.row.params }}
          p
            span 浏览器:
            | {{ props.row.userAgent }}
          p
            span 服务名:
            | {{ props.row.serviceId }}
          p
            span 区域:
            | {{ props.row.region }}
    el-table-column.text-center(prop='accountId', label='编号')
    el-table-column.text-center(prop='path', label='请求地址')
    el-table-column.text-center(prop='method', label='请求方式')
    el-table-column.text-center(prop='requestTime', label='请求时间')
    el-table-column.text-center(prop='responseTime', label='响应时间')
    el-table-column.text-center(prop='httpStatus', label='响应状态')
    el-table-column.text-center(prop='useTime', label='耗时')
    el-table-column.text-center(prop='ip', label='IP')
    el-table-column.text-center(prop='accessId', label='终端')
    el-table-column.text-center(prop='error', label='错误信息')
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
import _ from 'lodash'
import HeadOperation from '@/components/headOperation.vue'
const router = useRouter()
const route = useRoute()
const { state }: any = useStore(key)
const form: any = reactive({
  path: '',
  ip: '',
  method: '',
  startRequestTime: '',
  endRequestTime: ''
})
const table: any = reactive({
  currentPage: 1,
  total: 0,
  pageSize: 10,
  tableData: [],
  tableLoading: true
})
const toReset = () => {
  Object.keys(form).forEach((key: any) => {
    form[key] = ''
  })
}
const toFilter = () => {
  table.currentPage = 1
  getTableData('messageBox')
}
const getTableData = async(feedbackType?: string) => {
  const params ={
    current: table.currentPage,
    size: table.pageSize,
    ...form
  }
  const res = await Log.gatewayAccessLogs(params);
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
