<template lang="pug">
div
  el-tabs(v-model='listName', type='card', @tab-click='tabClickTabs' :before-leave="beforeLeave")
    el-tab-pane(label='基础应用', name='0')
    el-tab-pane(label='公共应用', name='1')
  headOperation
    el-input(v-model='form.appName', :prefix-icon='Search', placeholder='请输入应用名称', clearable, style='margin-right: 12px', @keydown.enter='toFilterTable')
    el-button(:icon='Search', type='primary', @click='toFilterTable') 查询
    el-button(:icon='Refresh', @click='toReset') 重置
    template(#right)
      el-button(:icon='Plus', type='primary', @click='toAdd', :disabled='!state.funcButton.appListAdd') 添加
    template(#fold)
      el-form(label-width='100px', inline)
        el-row
          el-col(:xs='12', :sm='12', :md='8', :lg='6', :xl='4')
            el-form-item(label='代码：')
              el-input(v-model='form.appCode', placeholder='请输入内容')
          el-col(:xs='12', :sm='12', :md='8', :lg='6', :xl='4')
            el-form-item(label='编号：')
              el-input(v-model='form.appId', placeholder='请输入内容')
          el-col(:xs='12', :sm='12', :md='8', :lg='6', :xl='4')
            el-form-item(label='类型：')
              el-select(v-model='form.appType', placeholder='请选择')
                el-option(v-for='item in typeList', :key='item.bh', :label='item.name', :value='item.bh')
          el-col(:xs='12', :sm='12', :md='8', :lg='6', :xl='4')
            el-form-item(label='终端类型：')
              el-select(v-model='form.platType', placeholder='请选择')
                el-option(v-for='item in platTypeLevel', :key='item.oode', :label='item.name', :value='item.code')
          el-col(:xs='12', :sm='12', :md='8', :lg='6', :xl='4')
            el-form-item(label='用户类型：')
              el-select(v-model='formUserType', placeholder='请选择', multiple)
                el-option(label='用户', value='user')
                el-option(label='商户', value='mercacc')
          el-col(:xs='12', :sm='12', :md='8', :lg='6', :xl='4')
            el-form-item(label='状态：')
              el-radio-group(v-model='form.status')
                el-radio(:label='1') 有效
                el-radio(:label='0') 无效
          el-col(:xs='12', :sm='12', :md='8', :lg='6', :xl='4')
            el-form-item(label='是否自定义：')
              el-radio-group(v-model='form.flagIsSelfApp')
                el-radio(label='1') 是
                el-radio(label='0') 否
          //- el-col(:xs='12', :sm='12', :md='8', :lg='6', :xl='4')
          //-   el-form-item
          //-     el-button(:icon='Search', type='primary', @click='toFilterTable') 查询
          //-     el-button(:icon='Refresh', @click='toReset') 重置
  .table-content
    el-table(:data='tableData[listName]', v-loading='table[listName].tableLoading')
      el-table-column(v-if="listName === '0' && !isSystem"  label='安装状态' width="90" align="center")
        template(#default='scope')
          el-tag(:type='scope.row.installed === "1" ? "" : "info"') {{ scope.row.installed === '1' ? "已安装" : "未安装" }}
      el-table-column(prop='bh', label='编号', align='center', width="100")
      el-table-column(v-if="listName === '1' && isSystem" label='添加人' width="90")
        template(#default='scope')
          span {{ scope.row.operatorName }}
      el-table-column(prop='appName', label='名称')
      el-table-column(prop='appIcon', label='图标')
        template(#default='scope')
          div(style='height: 36px')
            div(v-if='scope.row.iconArr.length > 1')
              el-popover(placement='bottom-start', trigger='hover', :width='scope.row.iconArr.length * 70')
                .table-icon-list
                  .img-item.text-center(v-for='o in scope.row.iconArr', :key='o.code')
                    el-image(:src='o.src', style='width: 36px; height: 36px')
                      template(#error='')
                        el-image(:src='defaultAppIcon', style='width: 34px; height: 34px')
                    p.font-size-12.text-gray-6 {{ o.name }}
                template(#reference)
                  div
                    el-image(:src='scope.row.iconArr.find((o:any) => {return o.src}).src', style='width: 36px; height: 36px')
                      template(#error='')
                        el-image(:src='defaultAppIcon', style='width: 34px; height: 34px')
                    el-icon.icon-arrowDown
                      ArrowDown
            div(v-else)
              el-image(v-if='scope.row.iconArr.length > 0', :src='scope.row.iconArr[0].src', style='width: 36px; height: 36px')
                template(#error='')
                  el-image(:src='defaultAppIcon', style='width: 34px; height: 34px')
              el-image(v-else, :src='defaultAppIcon', style='width: 34px; height: 34px')
      //- el-table-column(prop='developerId', label='是否自定义',)
        template(#default='scope')
          span {{ scope.row.flagIsSelfApp === "0" ? "否" : "是" }}
      el-table-column(v-if="isSystem" label='租户')
        template(#default='scope')
          el-button(type='primary', link, @click='clickToolbtn("check-tenant", scope.row)') {{ listName === '0' ? scope.row.tenantCount : '查看' }}
      el-table-column.text-left(prop='state', label='终端类型')
        template(#default='scope')
          span.dot-list(v-for='(item, index) in getPlatArr(scope.row.platType)', :key='index') {{ item.name }}
          //- el-popover(placement='bottom-start', :width='200', trigger='hover')
            el-tag.margin-right-x.margin-bottom-x(v-for='(item, index) in getPlatArr(scope.row.platType)', :key='index') {{ item.name }}
            template(#reference='')
              //- .paltType-tags.text-ellipsis(style='width: 150px')
              span.dot-list(v-for='(item, index) in getPlatArr(scope.row.platType)', :key='index') {{ item.name }}
      el-table-column(prop='userType', label='用户类型')
        template(#default='scope')
          span(v-if="scope.row.userType === 'user' || scope.row.userType === 'common'") 用户
          span(v-if="scope.row.userType === 'common'") 、
          span(v-if="scope.row.userType === 'mercacc' || scope.row.userType === 'common'") 商户
      el-table-column(prop='status', label='状态', width="80", align="center")
        template(#default='scope')
          el-switch(v-model='scope.row.status', :disabled='!state.funcButton.appListEdit', :active-value='1', :inactive-value='0', :before-change='changeStatus.bind(this, scope.row)')
      el-table-column(label='操作', width='200')
        template(#default='scope')
          el-button(link, type='primary', @click='clickToolbtn("check", scope.row)') 查看
          el-button(link, type='primary', @click='clickToolbtn("edit", scope.row)', :disabled='!state.funcButton.appListEdit || scope.row.editAndDelete !== "1"') 编辑
          el-button(type='danger', link, @click='clickToolbtn("delete", scope.row)', :disabled='!state.funcButton.appListRemove || scope.row.editAndDelete !== "1"') 删除
          MoreHandle
            el-button(type='primary', :disabled='!state.funcButton.appListEditSchemeSetting || Number(scope.row.supportSchedule) !== 1', link, @click='clickToolbtn("edit-setScheme", scope.row)') 设计方案
            el-button(type='primary', link, @click='clickToolbtn("shelves", scope.row)' :disabled='!state.funcButton.appLaunch') 上架
            el-button(v-if="listName === '0' && !isSystem" type='primary', link, @click='clickToolbtn("install", scope.row)' :disabled="scope.row.installed === '1'") 安装
              //- el-button(type='primary', link, @click='clickToolbtn("edit-setConpoment", scope.row)', :disabled='!state.funcButton.appListEdit') 组件
              //- el-button(type='primary', link, @click='clickToolbtn("edit-setLimit", scope.row)', :disabled='!state.funcButton.appListEdit') 权限
    el-pagination.flex-box.flex-center(background, @size-change='handleSizeChange', @current-change='handleCurrentChange', :current-page='table[listName].currentPage', :page-sizes='[10, 20, 30, 40]', :page-size='table[listName].pageSize', layout='total, sizes, prev, pager, next, jumper', :total='table[listName].total')

  el-dialog(v-model='showEditApp', :width='1000', :title='"编辑应用-" + currentRow.appName')
    el-scrollbar(style='height: 60vh')
      edit-form(v-if='showEditApp', :info='currentRow', ref='editForm', :typeList='typeList', :tabValue='editTabValue', :componentList='componentList')
    template(#footer)
      span.dialog-footer
        el-button(@click='showEditApp = false') 取 消
        el-button(type='primary', @click='confirmEditApp') 确 定

  el-drawer(v-model='showCheckApp', :title='"查看应用-" + currentRow.appName' size="40%")
    app-detail-all(v-if='showCheckApp', :info='currentRow', :componentList='componentList', :typeList='typeList')

  el-dialog(v-model='showSetScheme', :width='820', title='方案设置')
    set-scheme(v-if='showSetScheme && Number(currentRow.supportSchedule) === 1', :info='currentRow')

  TenantList(v-model="showTenantList" v-bind="{type: listName, show:showTenantList, info: currentRow}" @closed="currentRow = {}")
  Authorization(v-model="showAuthorization" v-bind="{show:showAuthorization, info: currentRow}" @closed="currentRow = {}" @onClosed="showAuthorization = false")
  Configs(v-model="showConfigs" v-bind="{show:showConfigs, info: currentRow}" @closed="currentRow = {}" @onClosed="showConfigs = false" @configsResult="directInstall")
</template>
<script lang="ts" setup>
import { computed, reactive, toRefs, ref, onActivated } from 'vue'
import { ArrowDown, Check, Close, Search, Refresh, Plus } from '@element-plus/icons-vue'
import FilterContent from '@/components/filterContent/index.vue'
import TableTitle from '@/components/tableTitle.vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { key } from '@/store/index'
import { App, Theme, Module } from '@/service/platform'
import { ElMessage, ElMessageBox } from 'element-plus'
import { cloneDeep, isEmpty } from 'lodash'
import EditForm from '../components/appEdit/editForm.vue'
import setScheme from '../components/appEdit/setScheme.vue'
import AppDetailAll from '../components/appDetailAll.vue'
import HeadOperation from '@/components/headOperation.vue'
import TenantList from './tenantList.vue'
import Authorization from './authorization.vue'
import Configs from './configs.vue'
import { getFileFromOnlineImg } from '@/assets/scripts/file'
import MoreHandle from '@/components/moreHandle.vue'

const defaultAppIcon = new URL('../../../assets/images/example.svg', import.meta.url).href
const visible = ref(true)
const store = useStore(key)
const { state } = store
const router = useRouter()
const form: any = reactive({
  appName: '',
  appCode: '',
  bh: '',
  appType: '',
  flagIsSelfApp: '',
  appId: '',
  platType: '',
  userType: ''
})
const formUserType = ref([])
const currentRow = ref({})

const listName = ref('0')
const showSetScheme = ref(false)

// [0]: 0普通操作 | 1超管 | 2区域管理员 | 3渠道商超管 | 4租户超级管理员
// const userFlag = computed(() => {
//   return state.userInfo?.flag?.[0] || null
// })

// true: 普通操作、超管、区域管理员、渠道商超管  false: 租户管理员
const isSystem = computed(() => {
  return state.userInfo?.identityType === 'system'
})

const showTenantList = ref(false)
const showAuthorization = ref(false)
const showConfigs = ref(false)

// 组件list
let componentList = ref([])
const getComponent = async () => {
  const res = await Module.getZcomList({ comType: 1 })
  componentList.value = res.data
  // componentList.value = res.data.filter((o: any) => {
  //   return plstStr.includes(o.platType)
  // })
}
getComponent()
// 应用类型
getTypeList()
const typeList = ref([])
async function getTypeList() {
  const res = await App.getZappTListAll({ status: 1 })
  if (res && res.data) {
    typeList.value = res.data
  }
}
// 终端类型
const platTypeArray = store.state.platTypeList
const platTypeLevel = store.state.platTypeLevel
const getPlatArr = (appPT: any) => {
  const res = platTypeLevel.filter((o: any) => {
    return appPT?.includes(o.code)
  })
  return res
}

// const plstStr = platTypeArray.map((o: any) => {
//   return o.code
// })
// edit
const showEditApp = ref(false)
const editForm = ref()
const confirmEditApp = async () => {
  editForm.value.submit(async (data: any) => {
    if (data.yesList.length > 0) {
      // getTableData()
      // showEditApp.value = false
      const index: number = tableData.value.findIndex((item: any) => {
        return item.bh === data.yesList[0].bh
      })
      data.yesList[0].iconArr = getIconArr(data.yesList[0].icon)
      if (data.yesList[0].url) {
        data.yesList[0].url = urlTranslate(data.yesList[0].url)
      }
      getTableData()
      await editForm.value?.setLimitRef?.ruleFormRef?.confirm()
      // tableData.value[index] = data.yesList[0]
      showEditApp.value = false
      ElMessage({

        message: '编辑成功！',
        type: 'success'
      })
    } else {
      const msg: any = data.notList[0]
      ElMessageBox({
        title: '',
        center: true,
        type: 'error',
        showConfirmButton: false,
        customClass: 'common-error-feedback',
        message: msg
      })
    }
  })
}
const editButtonDisabled = computed(() => {
  return editForm.value ? editForm.value.buttonDisabled : false
})
// check
const showCheckApp = ref(false)
// delete
const deleteApp = (appId: number, appName: string, item: any) => {
  ElMessageBox.confirm('确定删除“' + appName + '”应用？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(() => {
      table[listName.value].tableLoading = true
      let installConfigFormStr = ''
      if (item.installConfigResult) {
        const obj =
          JSON.parse(item.installConfig).find((item: any) => {
            return item.type === 'el-button' && item.children[0] === 'submit-delete'
          }) || {}
        const a = obj.effect ? obj.effect.fetch : null
        if (a) {
          installConfigFormStr = JSON.stringify({
            // action: a.action.replace('$manage$', configs.base),
            action: a?.action,
            data: JSON.parse(item.installConfigResult),
            method: a?.method
          })
        }
      }
      const params = {
        bh: appId,
        installConfigForm: installConfigFormStr
      }
      App.deleteApp(params, 'messageBox').then((r) => {
        table[listName.value].tableLoading = false
        if (r.code === 200) {
          table[listName.value].currentPage = 1
          getTableData()
          ElMessage({

            message: '删除成功',
            type: 'success'
          })
        }
      })
    })
    .catch(() => { })
}
// click tool
const editTabValue = ref('')
const clickToolbtn = (type: string, data: any) => {
  currentRow.value = data
  if (type === 'edit') {
    if (data.editAndDelete !== "1") return
    showEditApp.value = true
    editTabValue.value = 'baseInfo'
    return
  }
  if (type === 'check') {
    showCheckApp.value = true
    return
  }
  if (type === 'delete') {
    if (data.editAndDelete !== "1") return
    deleteApp(data.bh, data.appName, data)
    return
  }
  if (type === 'edit-setConpoment') {
    showEditApp.value = true
    editTabValue.value = 'componentSet'
    return
  }
  if (type === 'edit-setLimit') {
    showEditApp.value = true
    editTabValue.value = 'limitSet'
    return
  }
  if (type === 'edit-setScheme') {
    showSetScheme.value = true
    return
  }

  if (type === 'check-tenant') {
    showTenantList.value = true
    return
  }

  if (type === 'shelves') {
    if(!state.funcButton.appLaunch) return
    showAuthorization.value = true
    return
  }

  if (type === 'install') {
    if (data?.flagIsConfiguration === '1') {
      showConfigs.value = true
      return
    }
    // TODO
    directInstall(data)
  }
}

/**
 * 租户超管安装应用
 */
async function directInstall(data: any, isCharge = false) {
  console.log(data)
  const element = data
  let formData: any = new FormData()
  let submitInstallApi = null
  let installConfigForm = ''
  if (element.extraConfig?.installConfig && isCharge) {
    const obj = element.extraConfig.installConfig.find((item: any) => {
      return item.type === 'el-button' && item.children[0] === 'submit-add'
    }) || {}
    submitInstallApi = obj.effect ? obj.effect.fetch : null
    installConfigForm = JSON.stringify({
      action: submitInstallApi?.action,
      data: element.extraConfig.installConfigSubmit,
      method: submitInstallApi?.method
    })
  }
  // 应用obj
  const obj: any = {
    // icon: element.icon ? element.icon : '',
    appId: element.bh,
    appCode: element.appCode, // 必填， 第三方没有的， 后端自己生成
    status: element.status, // 状态； 前端传1 (0 无效，1有效)
    appNameEn: element.appNameEn || '', // 非必填 ！！！！！
    url: element.url, // 应用地址
    showTitle: element.showTitle, // 是否显示头【0:否 1:是】；默认值：是
    purviewSetting: '', // 权限，暂时不用解析，
    appName: element.appName, // 必填
    appDesc: element.appDesc, // app描述；非必填
    userType: element.userType, // 应用所属用户类型；非必填，默认值：通用
    component: element.component || '', // 应用绑定的组件code逗号连接
    installConfig: isCharge ? JSON.stringify(element.extraConfig.installConfig) : element.installConfig, // 安装配置
    installConfigForm: isCharge ? installConfigForm : element.installConfigForm,
    webApi: element.webApi || '', // 应用接口；非必填
    // route: '', // 前端页面路由名;非必填
    platType: element.platType,
    appType: element.appType, // 应用类型； 非必填
    isPersist: element.isPersist, // 保留数据0-否 1-是 不允许删除；非必填
    flagIsConfiguration: element.flagIsConfiguration, //是否是需要配置 1-是, 0-不是；  必填
    flagIsSelfApp: element.flagIsSelfApp, //是否是第三方应用 1-是, 0-不是；  必填
    flagIsTopApp: element.flagIsTopApp, // 是否置顶(默认应用)
    // flagIsAdSupport: element.flagIsAdSupport, // 是否能设置广告：0否1是； 默认值：否
    flagIsShow: element.flagIsShow, // 是否在界面显示 ；默认值：是
    flagIsCloud: element.flagIsCloud,
    flagIsEmbeddedRedirect: element.flagIsEmbeddedRedirect, // 是否内嵌跳转；默认值：否
    developerId: element.developerId, // 用户ID:默认为0；非必填
    authMethods: element.authMethods, // 认证方式
    flagIsLoginRequired: element.flagIsLoginRequired, // 是否需要登录；默认值：否
    supportSchedule: element.supportSchedule,
    isAllowCloning: isCharge ? !!element.extraConfig?.isAllowClone : element.isAllowCloning, //是否允许克隆
    flagIsAuthContent: element.flagIsAuthContent, // 是否有认证内容
    flagIsHelpContent: element.flagIsHelpContent, // 是否有帮助内容
    flagIsLimitYktTime: element.flagIsLimitYktTime, //是否限制一卡通服务时间
    flagIsSystem: element.flagIsSystem, //是否限制一卡通服务时间
    // operateTime: element.operateTime === null ? '' : element.operateTime,
    repeatInstall: element.repeatInstall,
    basePublic: element.basePublic,
    installed: '1',
  }

  Object.keys(obj).forEach((key) => {
    if (obj[key] === null || obj[key] === undefined) {
      obj[key] = ''
    }
    formData.append(`zApp[0].${key}`, obj[key])
  })
  const { data: res, msg, code } = await App.editApp(formData)
  if (code === 200) {
    ElMessage({
      message: '安装成功',
      type: 'success'
    })
    getTableData()
    showConfigs.value = false
  } else {
    ElMessage({
      message: msg,
      type: 'error'
    })
  }
}

// 查询
const toFilterTable = () => {
  table[listName.value].currentPage = 1
  table[listName.value].tableLoading = true
  getTableData(false, 'messageBox')
}
const toReset = () => {
  Object.keys(form).forEach((key: any) => {
    form[key] = ''
  })
}
// 图标init
const getIconArr = (iconStr: string) => {
  const objIcon: any = iconStr ? JSON.parse(iconStr) : []
  const arr: any = []
  Object.keys(objIcon).forEach((key) => {
    const cP = platTypeLevel.find((o: any) => {
      return o.code === key
    })
    if (cP) {
      const obj: any = {
        code: key,
        name: cP.name,
        src: objIcon[key] + '?timeStamp=' + new Date().getTime()
      }
      arr.push(obj)
    }
  })
  return arr
}
// 修改状态
const changeStatus = async (item: any) => {
  return new Promise((resolve, reject) => {
    ElMessageBox.confirm(`确定将“${item.appName}”设为${item.status ? '无效' : '有效'}应用？`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
      .then(() => {
        const formData = new FormData()
        const obj: any = {
          appId: item.bh,
          appCode: item.appCode, // 必填， 自定义没有的， 后端自己生成
          // appName: item.appName, // 必填
          status: item.status ? 0 : 1 // 状态； 前端传1 (0 无效，1有效)
          // flagIsSelfApp: item.flagIsSelfApp,
          // showTitle: item.showTitle
        }
        Object.keys(obj).forEach((key) => {
          formData.append(`zApp[0].${key}`, obj[key])
        })
        App.editApp(formData).then((res: any) => {
          const { code, data } = res
          if (code === 200 && data.yesList.length > 0) {
            ElMessage({
              message: '修改成功',
              type: 'success'
            })
            resolve(true)
          } else {
            resolve(false)
          }
        })
      })
      .catch(() => { })
  })
}
// table
const tableData: any = ref([])
const table: any = reactive([{
  currentPage: 1,
  total: 0,
  pageSize: 10,
  tableLoading: true
}, {
  currentPage: 1,
  total: 0,
  pageSize: 10,
  tableLoading: true
}])
const handleSizeChange = (val: number) => {
  table[listName.value].pageSize = val
  table[listName.value].currentPage = 1
  getTableData()
}
const handleCurrentChange = (val: number) => {
  table[listName.value].currentPage = val
  getTableData()
}
// url转化为父级结构的
const urlTranslate = (urlData: any) => {
  const url = JSON.parse(urlData)
  const urlNew: any = []
  url.forEach((o: any) => {
    if (o.parentCode) {
      const index = urlNew.findIndex((u: any) => {
        return u.code === o.parentCode
      })
      if (index === -1) {
        const pObj = platTypeArray.find((p: any) => {
          return p.code === o.parentCode
        })
        pObj.children = [o]
        urlNew.push(pObj)
      } else {
        urlNew[index].children.push(o)
      }
      // const index = ()
    } else {
      urlNew.push(o)
    }
  })
  return JSON.stringify(urlNew)
}
async function getTableData(useCatch = false, feedbackType?: string) {
  if (useCatch && !isEmpty(tableData.value[listName.value])) {
    tableData.value[listName.value] = tableData.value[listName.value]
    return
  }
  table[listName.value].tableLoading = true
  let params: any = {
    current: table[listName.value].currentPage,
    // current: 4,
    size: table[listName.value].pageSize,
    basePublic: listName.value
  }
  if (formUserType.value.length === 0) {
    form.userType = ''
  } else if (formUserType.value.length === 1) {
    form.userType = formUserType.value[0]
  } else if (formUserType.value.length === 2) {
    form.userType = 'common'
  }
  const exitForm: any = {}
  Object.keys(form).forEach((key: any) => {
    if (form[key] !== '') {
      exitForm[key] = form[key]
    }
  })
  params = { ...params, ...exitForm }
  const res = await App.pageByPermission(params, feedbackType)
  if (res?.data?.records) {
    const data = res.data.records
    data.forEach((element: any) => {
      element.iconArr = getIconArr(element.icon)
      if (element.iconArr.length > 0) {
        element.masterImg = element.iconArr[0].src
        element.extraConfig = {
          img: element.iconArr
        }
      }
      // if (element.url) {
      //   element.url = urlTranslate(element.url)
      // }
    })
    table[listName.value].tableLoading = false
    tableData.value[listName.value] = data
    table[listName.value].total = res.data.total
  } else {
    table[listName.value].tableLoading = false
  }
}
const toAdd = () => {
  router.push({ name: 'appAdd', query: { keepAlive: '0' } })
}

// 切换前检查表格是否加载完毕
function beforeLeave() {
  return !table[listName.value].tableLoading
}

const refTable = toRefs(table)

/**
 * 切换tab时
 * @param val
 */
function tabClickTabs(val: any) {
  if (table[listName.value].tableLoading) return
  listName.value = val.paneName
  toReset()
  getTableData(true)
}

onActivated(() => {
  getTableData()
  store.dispatch('getFrontConfig')
})
</script>
<style scoped lang="scss">
// .el-pagination {
//   display: flex;
//   justify-content: center;
//   align-items: center;
// }
.el-form--inline .el-form-item {
  margin-right: 10px;
}

.text {
  color: v-bind (color);
}

.el-table .warning-row {
  background: oldlace;
}

.el-table .success-row {
  background: #f0f9eb;
}

.app-icon {
  width: 30px;
  height: auto;
}

.el-table .cell {
  line-height: normal;
}

.table-icon-list .img-item {
  display: inline-block;
  line-height: 20px;
  margin-right: 20px;

  &:last-child {
    margin-right: 0;
  }
}

.icon-arrowDown svg {
  width: 14px;
  height: 14px;
  color: #999;
}

.icon-small svg {
  width: 20px;
  height: 20px;
}

.el-select {
  display: block;
}

.el-avatar {
  background-color: transparent;
}
</style>
