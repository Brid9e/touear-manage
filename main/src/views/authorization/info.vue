<template lang="pug">
div
  el-empty(v-if="!authLoading && (!authList || Object.keys(authList).length === 0)" description='暂无授权内容')
  el-tabs.demo-tabs(v-else v-model='tabsValue' type='card' @tab-click='handleClick')
    el-tab-pane.font-size-14(label='基础权限' name='base')
      div(v-if="authType.value !== '-1'")
        TableTitle(title='授权类型')
        .bg
          el-row(:gutter='20')
            el-col(:span='12')
              span.title 授权类型：
              span {{authType.name}}类型
            el-col(:span='12')
              span.title {{authType.name}}数量：
              span {{authType.value === '-2' ? '已开启共享父级渠道商权限' : authType.value}}
      div.marign-t-b(v-for="(item, key) in authList")
        div(v-if="key === 'expirationTime'")
          TableTitle(title='日期权限')
          .bg
            span.title 过期时间：
            span {{item[0].value}}
    el-tab-pane(label='平台权限' name='platform')
      div.marign-t-b.font-size-14
        TableTitle(title='平台权限')
        .bg
          el-row
            .flex()
              span.title.title-table 平台类型：
              el-table.table-s(:data="authList['platformType']" )
                el-table-column(label='平台名称', prop="code" )
                  template(#default='scope')
                    span {{platTypeList.find(p => {return p.code === scope.row.code})?.name}}
                el-table-column(label='有效期', prop="expirationTime")  
                el-table-column(label='数量', prop="number")      
      div.marign-t-b.font-size-14
        TableTitle(title='终端权限')
        .bg
          span.title 终端类型：
          template(v-if="authList['terminalType']" v-for="(o, i) in authList['terminalType']", :key="i")
            el-tag.marign-r-2(v-if="terminalTypeList.find(p => {return p.code === o.code})") {{terminalTypeList.find(p => {return p.code === o.code})?.name}} 
              span.ter-num(v-if="o.num")  (数量：{{o.num}})
      div.marign-t-b.font-size-14(v-if="messageList.length > 0" )
        TableTitle(title='消息通道')
        .bg
          el-row
            .flex()
              span.title.title-table 消息通道：
              el-table( :span-method='objectSpanMethod' :data='messageList'  border='' )
                el-table-column(prop='typeName' label='类型' )
                el-table-column(prop='messageName' label='名称')
                //- el-table-column(prop='index' label='index')
                //- el-table-column(prop='num' label='num')
    el-tab-pane(label='基础应用权限' name='appBaseInfo')
      .bg
        el-table(:data='appBaseTable.dataTable', style='width: 100%', border,v-loading='appBaseTable.loading')
          el-table-column.text-center(label='序号', width='80', align='center')
            template(#default='scope')
              span {{(appBaseTable.currentPage - 1) * appBaseTable.pageSize + scope.$index + 1}}
          //- el-table-column.text-center(prop='appId', label='编号', width='80', align='center')
          el-table-column(prop='appName', label='应用名称')
          el-table-column(prop='appCode', label='应用代码')
          el-table-column(prop='platformType', label='平台类型')
            template(#default='scope')
              .dot-box(v-if='scope.row.platformType')
                el-badge.mark(is-dot :type="colorList[platTypeList.findIndex(item => item.code === scope.row.platformType)]")
                span.text {{platTypeList.find(item => item.code === scope.row.platformType)?.name}}
          el-table-column(prop='platType', label='终端类型' width='220')
            template(#default='scope')
              div(v-if='scope.row.platType')
                span(v-for='(ele, i) in scope.row.platType.split(",")', :key='i')
                  el-tag.margin-right-x(v-if="terminalTypeList.find((e) => e.code === ele)?.name") {{ terminalTypeList.find((e) => e.code === ele)?.name }} 
        .flex-center
          el-pagination.margin-bottom-3x(@size-change='appsHandleSizeChangeBase', @current-change='appsHandleCurrentChangeBase', :current-page='appBaseTable.currentPage', :page-sizes='[10, 20, 30, 40]', :page-size='appBaseTable.pageSize', layout='total, sizes, prev, pager, next, jumper', :total='appBaseTable.total', background)
    el-tab-pane(label='增值服务应用权限' name='appInfo')
      .bg
        el-table(:data='appTable.dataTable', style='width: 100%', border, v-loading='appTable.loading')
          el-table-column.text-center(label='序号', width='80', align='center')
            template(#default='scope')
              span {{(appTable.currentPage - 1) * appTable.pageSize + scope.$index + 1}}					
          //- el-table-column.text-center(prop='appId', label='编号', width='80', align='center')
          el-table-column(prop='appName', label='应用名称')
          el-table-column(prop='appCode', label='应用代码')
          el-table-column(prop='platformType', label='平台类型')
            template(#default='scope')
              .dot-box(v-if='scope.row.platformType')
                el-badge.mark(is-dot :type="colorList[platTypeList.findIndex(item => item.code === scope.row.platformType)]")
                span.text {{platTypeList.find(item => item.code === scope.row.platformType)?.name}}
          el-table-column(prop='platType', label='终端类型' width='220')
            template(#default='scope')
              div(v-if='scope.row.platType')
                span(v-for='(ele, i) in scope.row.platType.split(",")', :key='i')
                  el-tag.margin-right-x(v-if="terminalTypeList.find((e) => e.code === ele)?.name") {{ terminalTypeList.find((e) => e.code === ele)?.name }}
          el-table-column(prop='parent', label='当前剩余', align='center')
            template(#default='scope')
              span {{ scope.row.residue ? scope.row.residue:'无限制' }}
          el-table-column.is-required(prop='number', label='数量' width='180', align='center')
        .flex-center
          el-pagination.margin-bottom-3x(@size-change='appsHandleSizeChange', @current-change='appsHandleCurrentChange', :current-page='appTable.currentPage', :page-sizes='[10, 20, 30, 40]', :page-size='appTable.pageSize', layout='total, sizes, prev, pager, next, jumper', :total='appTable.total', background)
  </template>
<script lang="ts" setup>
import { ref, reactive, onMounted, computed, watch } from 'vue'
import TableTitle from '@/components/tableTitle.vue'
import { Subarea, Agency, Tenant } from '@/service/manage'
import { ElMessage } from 'element-plus'
import { useStore } from 'vuex'
import { key } from '@/store'
import _ from 'lodash'

const store = useStore(key)
const { state } = store
const colorList = ['warning', 'success', 'primary', 'danger', 'info']
const authType = reactive({
  type: '',
  name: '',
  value: '-1'
})
//授权数据的回显
let authList: any = ref({})
let messageList: any = ref([])
let authLoading: any = ref(true)
const channelList = ref([])

const getExtendInfoData = async () => {
  if (!state.userInfo?.agencyId && state.userInfo?.agencyId!==0) {
    authLoading.value = false
    return
  }
  const params: any = {
    id: state.userInfo?.agencyId,
  }
  const res: any = await Agency.getExtendInfoList(params)
  if (res.code === 200) {
    authList.value = res.data
    if (authList.value['tenantMaxNum'] && authList.value['tenantMaxNum'].length > 0 && authList.value['tenantMaxNum'][0].value !== '-1') {
      authType.type = 'tenant'
      authType.name = "租户"
      authType.value = authList.value['tenantMaxNum'][0].value
    } else if (authList.value['userMaxNum'] && authList.value['userMaxNum'].length > 0 && authList.value['userMaxNum'][0].value !== '-1') {
      authType.type = 'user'
      authType.name = "用户"
      authType.value = authList.value['userMaxNum'][0].value
    }
    const { data: resT, msgT, code }: any = await Agency.getAgencyChannelTree()
    if (code === 200) {
      channelList.value = resT
    } else {
      ElMessage.error(msgT)
    }
    authList.value['messageChannel'].forEach((element: any) => {
      const index = channelList.value.findIndex((c: any) => { return c.code === element.value })
      element.channels.forEach((o: any, i: number) => {
        const obj = {
          index: i,
          num: element.channels.length,
          type: element.value,
          typeName: (channelList.value[index] as any).name,
          message: o,
          messageName: (channelList.value[index] as any).channels.find((c: any) => { return c.code === o })?.name
        }
        messageList.value.push(obj)
      })
    })
    authList.value['terminalType'] = authList.value['terminalType'].map((o:any) => {
      let obj = {}
      if (_.isObject(o)) {
        obj = {
          code: _.keys(o)[0],
          num: (_.values(o)[0] as any).number
        }
      } else {
        obj = {
          code: o,
        }
      }
      return obj
    })
    getAppList()
  } else {
    ElMessage.error(res.msg)
  }
}
getExtendInfoData()
// tab
const tabsValue = ref('base')
//平台类型&终端类型 字典
const platTypeList: any = ref({})
const terminalTypeList: any = ref({})
const getTypeByAuthList = async () => {
  const { data: res, msg, code }: any = await Agency.getTypeByAuth()
  if (code === 200) {
    platTypeList.value = res.platformType || []
    terminalTypeList.value = res.terminalType || []
  } else {
    ElMessage.error(msg)
  }
}
getTypeByAuthList()
const objectSpanMethod = ({ row, column, rowIndex, columnIndex }: any) => {
  if (columnIndex === 0) {
    if (row.index === 0) {
      return {
        rowspan: row.num,
        colspan: 1,
      }
    } else {
      return {
        rowspan: 0,
        colspan: 0,
      }
    }
  }
}
// 应用
const appBaseTable: any = reactive({
  currentPage: 1,
  total: 0,
  pageSize: 10,
  data: [],
  dataTable: [],
  loading: true
})
const appList = ref([])
const appTable: any = reactive({
  currentPage: 1,
  total: 0,
  pageSize: 10,
  data: [],
  dataTable: [],
  loading: true
})
const getAppList = async () => {
  appBaseTable.loading = true
  appTable.loading = true
  const plat = authList.value.platformType.map((o: any) => { return o.code })
  let params: any = {
    platformTypeSet: plat?.join(","),
    platTypeSet: authList.value.terminalType?.join(","),
  }
  const { data: res, code, msg }: any = await Tenant.getAppListGroupPlatform(params)
  appTable.loading = false
  res.forEach((element: any) => {
    appBaseTable.data = appBaseTable.data.concat(element.baseApp)
    appBaseTable.total = appBaseTable.data.length
    appList.value = appList.value.concat(element.valueAddedApp)
    appTable.data = appList.value.filter((o: any) => {
      const obj = authList.value['appCode'].find((a: any) => { a.appCode === o.appCode })
      if (obj) {
        return o
      }
    })
  })
  appBaseTable.dataTable = appBaseTable.data?.slice(0, appBaseTable.pageSize)
  authList.value['appCode'].forEach((app: any) => {
    const obj: any = appList.value.find((a: any) => { return a.appCode === app.appCode })
    if (obj) {
      obj.number = app.number
      obj.use = app.use
      obj.residue = app.residue
      appTable.data.push(obj)
    }
  })
  appTable.dataTable = appTable.data?.slice(0, appTable.pageSize)
  appTable.total = appTable.data.length
  appBaseTable.loading = false
  appTable.loading = false
}
// 增值应用分页
const appsHandleSizeChange = (val: number) => {
  appTable.pageSize = val
  appTable.currentPage = 1
  appTable.dataTable = appTable.data?.slice(0, val)
}
const appsHandleCurrentChange = (val: number) => {
  appTable.currentPage = val
  appTable.dataTable = appTable.data.slice((val - 1) * appTable.pageSize, appTable.pageSize * val)
}
// 基础应用分页
const appsHandleSizeChangeBase = (val: number) => {
  appBaseTable.pageSize = val
  appBaseTable.currentPage = 1
  appBaseTable.dataTable = appBaseTable.data?.slice(0, val)
}
const appsHandleCurrentChangeBase = (val: number) => {
  appBaseTable.currentPage = val
  appBaseTable.dataTable = appBaseTable.data.slice((val - 1) * appBaseTable.pageSize, appBaseTable.pageSize * val)
}
</script>
<style lang="scss" scoped>
.text {
  color: v-bind (color);
}

.marign-t-b {
  margin: 16px 0;
}

.marign-r-2 {
  margin-right: 8px;
}

.marign-bottom-2x {
  margin-bottom: 8px;
}

.col-line {
  line-height: 30px;
}

.title {
  margin-right: 4px;
  color: #999;
}

.title-table {
  width: 80px;
  margin-top: 6px;
}

.bg {
  background-color: var(--el-fill-color-light);
  border-radius: 4px;
  padding: 15px;
}

.table-s {
  border-radius: 8px;
}

.flex {
  display: flex;
  width: 100%;
}
.ter-num {
  color:#999;
  padding-left:3px;
}
</style>