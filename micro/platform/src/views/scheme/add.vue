<template lang="pug">
div
  //- p SAAS -- {{SAAS}} -- {{schemeEditorUrl}}
  el-tabs(v-model='activeName', type='card', @tab-click='tabClickTabs' v-if="!SAAS")
    //- el-tab-pane(label="自定义方案")
    el-tab-pane(label='可选择方案', name='first')
      HeadOperation
        el-input(:prefix-icon="Search", v-model='form.name', placeholder='通过方案名称筛选', clearable, @keydown.enter='inquire')
        el-button(:icon='Search', type='primary', @click='inquire') 查询
        el-button(:icon='Refresh', @click='reset') 重置
        template(#right)
          el-button(:icon='Close', @click='clearSelection', :disabled='multipleSelection.length === 0') 取消选择
          el-button(:icon='Check', @click='addSelection', type='primary', :disabled='multipleSelection.length === 0 || !state.funcButton.schemeAddInstall') 添加已选
            span(v-if='multipleSelection.length > 0') &nbsp;({{ multipleSelection.length }})
        template(#fold)
          el-form(label-width='90px', inline)
            el-row
              el-col(:xs="12", :sm="12", :md="8", :lg="6", :xl="4")
                el-form-item(label='方案名称')
                  el-input(v-model='form.name', placeholder='请输入关键字', clearable)
              el-col(:xs="12", :sm="12", :md="8", :lg="6", :xl="4")
                el-form-item(label='用户类型')
                  el-select.display-block(v-model='form.userType', placeholder='请选择', clearable)
                    el-option(v-for='(item, i) in userTypeList', :key='i', :label='item?.name', :value='item.label')
              el-col(:xs="12", :sm="12", :md="8", :lg="6", :xl="4")
                el-form-item(label='终端类型')
                  el-select.display-block(v-model='form.platType', placeholder='请选择', clearable)
                    el-option(v-for='(item, i) in platTypeLevel', :key='i', :label='item?.name', :value='item.code')
      .table-content
        //- | {{tableData}}
        el-table(ref='multipleTableRef', :data='tableData', v-loading='loading', @selection-change='handleSelectionChange', :row-key='getRowKeys')
          el-table-column(type='selection', width='50', align='center', :selectable='selectable', :reserve-selection='true')
          el-table-column(label='安装状态', width='110', prop='installFlag', align='center')
            template(#default='scope')
              el-tag(:type='scope.row.installFlag ? "info" : scope.row.installing ? "success" : "primary"')
                .tag-box
                  el-icon(v-if="scope.row.installing" class="is-loading" :size="14")
                    Loading
                  span(v-if="scope.row.installing") 正在安装
                  span(v-else) {{ scope.row.installFlag ? "已安装" : "未安装" }}
          el-table-column(prop='name', label='方案名称')
          el-table-column(prop='code', label='方案代码')
                | 【{{platTypeList?.find(e => e.code ===key)?.name}}】 {{value}}
          el-table-column(prop='userType', label='用户类型')
            template(#default='scope')
              //- |{{scope.row.userType}} {{userTypeList}}
              span(v-if='scope.row.userType') {{ userTypeList?.find((item) => item.label === scope.row.userType)?.name }}
          el-table-column(prop='userType', label='终端类型')
            template(#default='scope')
              //- span  {{scope.row.platType}}
              div(v-if='scope.row.platType')
                span.dot-list(v-for='(ele, i) in scope.row.platType.split(",")', :key='i') {{ platTypeLevel?.find((e) => e.code === ele)?.name }}
          el-table-column(label='操作', width='80' align="center")
            template(#default='scope')
              el-button(link type="primary" :href="null" @click='checkScheme(scope.row)' :disabled='!state.funcButton.schemeAddView') 查看
              //- el-button(size='mini', @click='checkScheme(scope.row)', plain, type='primary') 查看
        el-pagination.flex-box.flex-center(background @size-change='handleSizeChange', @current-change='handleCurrentChange', :current-page='currentPage + 1', :page-sizes='[10, 20, 30, 40]', :page-size='pageSize', layout='total, sizes, prev, pager, next, jumper', :total='total')
    el-tab-pane(label='自定义方案', name='second' v-if="state.funcButton.schemeAddCustom")
      iframe.scheme-editor(:src='schemeEditorUrl')
  div(v-else v-loading="iframeLoading" style="min-height: 500px;")
    //- h3 iframe
    iframe.scheme-editor(:src='schemeEditorUrl')
</template>

<script lang="ts" setup>
import { ref, getCurrentInstance, watch, onActivated } from 'vue'
import { ElMessage, ElTable } from 'element-plus'
import { Cloud } from '@/service/cloud'
import { Scheme, Module, Menu } from '@/service/platform/index'
// import { App } from '@/service/platform/index'
// import { Scheme as FromSchemeClass } from '@/service/scheme/index'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { key } from '@/store'
// import { getFileFromOnlineImg } from '@/assets/scripts/file'
// import { objDelete } from '@/assets/scripts/utils'
import _ from 'lodash'
import HandleScheme from '@/assets/scripts/installScheme'
import { Close, Check, Search, Refresh, Loading } from '@element-plus/icons-vue'
import TableTitle from '@/components/tableTitle.vue'
import HeadOperation from '@/components/headOperation.vue'

// const { appContext }: any = getCurrentInstance()
const router = useRouter()
const route = useRoute()
// const store =
const { state }: any = useStore(key)
// const { state } = store
// const moduleTypeList = state.moduleTypeList
const SAAS = ref(state.deploymentType)
// console.log('---SAAS', SAAS.value)
const userTypeList = state.userTypeList
const platTypeList = state.platTypeList
const platTypeLevel = state.platTypeLevel
const installStatusList = state.installStatusList

const schemeEditorUrl = ref('')
const activeName = ref('first')
const isInstalling = ref(false)
const iframeLoading = ref(false)

let form: any = ref({
  name: null,
  userType: null,
  platType: null
})

const multipleTableRef = ref<InstanceType<typeof ElTable>>()
const multipleSelection: any = ref([])

let tableData: any = ref([])
let schemeList: any = ref([])
let loading = ref(false)
let total = ref(0) // 总数
let currentPage = ref(0) // 页码
const pageSize = ref(10) // 页数

// watch(route, async (val: any) => {
//   if (val?.name === 'schemeAdd') {
//     await getSchemeList()
//     await getCloudSchemeList()
//   }
// })

onActivated(async () => {
  await getSchemeList()
  await getCloudSchemeList()
})


const clearSelection = () => multipleTableRef.value!.clearSelection()  // 清除勾选

const inquire = () => {
  currentPage.value = 0
  getCloudSchemeList(1)
}

const reset = () => {
  for (const key in form.value) form.value[key] = null
}

const handleSelectionChange = (val: any) => multipleSelection.value = val // 监听表单选项

const getRowKeys = (row: any) => row.code // 返回唯一标记值，这里的 id 是唯一的

// ---TEST---
const TEST__ = () => {
  // let codeArrAll = tableData.value.filter((r: any) => selectCodeArrAll.filter((_r: any) => r.code === _r))
  // tableData.value[0].installFlag = 1
}

// // 查询方案列表
const getSchemeList = async () => {
  const { data: res, code, msg }: any = await Scheme.getAppScheduleList()
  if (code === 200) schemeList.value = res
  else console.log(msg)
}

//  支持终端类型
let platTypeArr: any = []
platTypeList.forEach((element: any) => {
  platTypeArr.push(element.code)
})
// 查询云端方案列表
const getCloudSchemeList = async (type?: number) => {
  const params: any = {
    page: currentPage.value,
    size: pageSize.value,
    type: 'common'
    // platType: platTypeArr.join(',')
  }
  if (type === 1) {
    //查询
    for (const key in form.value) {
      if (form.value[key]) {
        params[key] = form.value[key]
      }
    }
  }
  // loading.value = true
  // console.log('888', await Cloud.getModuleListPage(params))
  const { data: res, status, message }: any = await Cloud.getSchemeListPage(params)
  loading.value = false
  if (status === 200) {
    // console.log(res, status, message)
    res.data.forEach((element: any) => {
      element.installing = false
      const index = schemeList.value.findIndex((item: any) => item.schemeCode === element.code)
      // console.log(index)
      index >= 0 ? element.installFlag = 1 : element.installFlag = 0 // 判断本地是否安装
    })
    tableData.value = res.data
    total.value = res.totalSize
    // console.log('res=', res, moduleList.value)
  } else {
    console.log(message)
  }
}

getSchemeList().then(() => {
  getCloudSchemeList()
})

const handleSizeChange = (val: number) => {
  console.log(`每页 ${val} 条`)
  pageSize.value = val
  getCloudSchemeList()
}

const handleCurrentChange = (val: number) => {
  console.log(`当前页: ${val}`)
  currentPage.value = val
  getCloudSchemeList()
}

const selectable = (row: any, index: number) => {
  // 是否可选
  // console.log(row, index)
  if (row.installFlag) {
    row.disabled = true
    return false
  } else {
    return true
  }
}

const checkScheme = (item: any) => {
  let toSchemeEditViewUrl_readonly = `${state.configs.cloudUrl}/cloud-scheme?name=${item?.name}&platType=${item.platType}&userType=${item.userType}&code=${item.code}&type=${item.type == 'common' ? 'common' : 'app'}&readonly=1`
  // let toSchemeEditViewUrl_readonly = `http://192.168.3.190:9991?token=${state.token}&name=${item?.name}&platType=${item.platType}&userType=${item.userType}&code=${item.code}&schemeType=${Number(item.type || 'common') ? 'app' : 'common'}&readonly=1`
  if (process.env.NODE_ENV === 'development') toSchemeEditViewUrl_readonly = `http://192.168.3.190:9991?name=${item?.name}&platType=${item.platType}&userType=${item.userType}&code=${item.code}&type=${item.type == 'common' ? 'common' : 'app'}&readonly=1`
  const ele_a = document.createElement('a')
  ele_a.setAttribute('href', toSchemeEditViewUrl_readonly)
  ele_a.target = 'blank'
  ele_a.click()
  // window.location.href = toSchemeEditViewUrl_readonly
}

const toAddScheme = (callback?: any) => {
  let index = ''
  if (process.env.NODE_ENV === 'development') index = state.devHost.layoutEditor
  else index =`${state.configs.base}/layout-editor`
  let url = `${index}?token=${state.token}&type=scheme`
  schemeEditorUrl.value = url
  callback()
}

const tabClickTabs = (val: any) => {
  if (val.props.label === '自定义方案') {
    if (schemeEditorUrl.value) return
    toAddScheme()
  }
}

const addSelection = async () => {
  for (const val of multipleSelection.value) val.installing = true
  await new HandleScheme().install(multipleSelection.value, {
    tableData: tableData.value, statusChange: {
      success: {
        installFlag: 1,
        installing: false,
        loading: 0,
        disabled: false
      },
      fail: {
        installFlag: 0,
        installing: false,
        loading: 0,
        disabled: false
      }
    }
  })
  multipleTableRef.value!.clearSelection()
}
onActivated(() => {
  if (SAAS.value) {
    iframeLoading.value = true
    toAddScheme(() => {
      iframeLoading.value = false
    })
  }
})
</script>
<style lang="scss" scoped>
.scheme-editor {
  width: 100%;
  /* height: 100%; */
  height: calc(100vh - 5rem - 60px - 41px);
  border: none;
}

.tag-box {
  display: flex;
  align-items: center;

  .el-icon {
    margin-right: 3px;
  }
}

.pagination-group {
  display: flex;
  align-items: center;
  justify-content: space-between;

  .button-group {
    margin-top: 24px;
  }
}
</style>
