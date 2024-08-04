<template lang="pug">
div
  //- | {{tableData}}
  HeadOperation
    el-input(:prefix-icon='Search', v-model='form.comName', placeholder='通过组件名称筛选', clearable, style='margin-right: 12px', @keydown.enter='inquire')
    el-button(:icon='Search', type='primary', @click='inquire') 查询
    el-button(:icon='Refresh', @click='reset') 重置
    template(#right)
      el-button(:icon='Close', @click='clearSelection', :disabled='multipleSelection.length === 0') 取消选择
      el-button(:icon='Check', @click='addSelection', type='primary', :disabled='multipleSelection.length === 0 || !state.funcButton.moduleInstall') 添加已选
        span(v-if='multipleSelection.length > 0') &nbsp;({{ multipleSelection.length }})
    template(#fold)
      //- filter-content
      el-form(label-width='100px', inline)
        el-row
          el-col(:xs='12', :sm='12', :md='8', :lg='6', :xl='4')
            el-form-item(label='组件类型：')
              el-select.display-block(v-model='form.comType', placeholder='请选择', clearable)
                el-option(v-for='(item, i) in moduleTypeList', :key='i', :label='item.name', :value='item.id')
          el-col(:xs='12', :sm='12', :md='8', :lg='6', :xl='4')
            el-form-item(label='终端类型：')
              el-select.display-block(v-model='form.platType', placeholder='请选择', clearable)
                el-option(v-for='(item, i) in platTypeLevel', :key='i', :label='item.name', :value='item.code')

  .table-content
    //- p multipleSelection {{multipleSelection}}
    //- p selectData {{selectData.length}}
    //- TableTitle(title="组件列表")
    el-table(ref='multipleTableRef', :data='tableData', style='width: 100%; min-height: 535px', v-loading='loading', @selection-change='handleSelectionChange', @select='handleSelect', :row-key='getRowKeys')
      //- el-table-column(prop="bh" label="组件ID" align="center" width="80")
      el-table-column(type='selection', width='50', align='center', :selectable='selectable', :reserve-selection='true')
      //- el-table-column(label='安装状态', width='90', prop='installFlag', align='center')
        template(#default='scope')
          el-tag(:type='scope.row.installFlag ? "info" : ""') {{ scope.row.installFlag ? "已安装" : "未安装" }}
          //- .dot-box
            el-badge(is-dot :type="scope.row.installFlag ? 'success' : 'primary'")
            span.text 已安装
      el-table-column(prop='comIconUrl', label='组件图示', align='center', width='200')
        template(#default='scope')
          el-image(v-if="scope.row.comIconUrl" style='height: 30px', :src='scope.row.comIconUrl')
      el-table-column(prop='comName', label='组件名称')
      el-table-column(prop='nameEn', label='英文名称')
      el-table-column(prop='comCode', label='组件代码')
      el-table-column(prop='comType', label='组件类型')
        template(#default='scope')
          //- .dot-box
            el-badge.mark(is-dot, :type='colorList[scope.row.comType - 1]')
            span.text {{ moduleTypeList.find((item) => item.id === scope.row.comType).name }}
          span {{ moduleTypeList?.find((item) => item.id === scope.row.comType).name }}
          //- span(:class="'text-' + colorList[scope.row.comType - 1]") {{moduleTypeList.find(item => item.id === scope.row.comType).name}}
      el-table-column(prop='userType', label='用户类型')
        template(#default='scope')
          div(v-if='scope.row.userType')
            span(v-if='scope.row.userType === "common"')
              span.dot-list(v-for='(item, i) in userTypeList')
                | {{ item.name }}
                //- span(v-if="i + 1 < userTypeList.length") &nbsp;/&nbsp;
            span(v-else)
              | {{ userTypeList.find((item) => item.label === scope.row.userType)?.name }}
      el-table-column(prop='platType', label='终端类型', width='210')
        template(#default='scope')
          span.dot-list(v-for='(item, i) in scope.row.platType.split(",")', :key='i') {{ platTypeLevel.find((subItem) => subItem.code === item).name }}
            //- p {{platTypeList?.find(item  => item.code === scope.row.platType).children.length > 0}}
          //- p {{platTypeList?.find(item  => item.code === scope.row.platType).childern}}
      el-table-column(label='操作', width='80', align='center')
        template(#default='scope')
          el-button(link, type='primary', @click='checkModule(scope.row)') 查看
          //- el-link(type="primary" :href="null" @click='checkModule(scope.row)') 查看
          //- el-button(size="mini" @click="checkModule(scope.row)" plain  type="primary") 查看
    el-pagination.flex-box.flex-center(background, @size-change='handleSizeChange', @current-change='handleCurrentChange', :current-page='currentPage', :page-sizes='[10, 20, 30, 40]', :page-size='pageSize', layout='total, sizes, prev, pager, next, jumper', :total='total')
  //- .margin-top-2x.text-right
  //-   el-button(:icon="Close" @click="clearSelection" :disabled="multipleSelection.length === 0") 取消选择
  //-   el-button(:icon="Check" @click="addSelection" type="primary" :disabled="multipleSelection.length === 0 || !state.funcButton.moduleInstall") 添加已选
  //-     span(v-if="multipleSelection.length > 0") &nbsp;({{multipleSelection.length}})
  el-drawer(v-model='dialogFormVisible', size='40%', :title='currentModule.comName')
    //- p {{currentModule}}
    el-descriptions(title='基本信息', :column='2')
      el-descriptions-item(label='组件代码') {{ currentModule.comCode }}
      el-descriptions-item(label='组件名称') {{ currentModule.comName }}
      el-descriptions-item(label='英文名称') {{ currentModule.nameEn }}
      el-descriptions-item(label='组件类型') {{ moduleTypeList?.find((item) => item.id === currentModule.comType).name }}
      el-descriptions-item(label='用户类型')
        span(v-if='currentModule.userType === "common"')
          span.dot-list(v-for='(item, i) in userTypeList') {{ item.name }}
        span(v-else) {{ userTypeList.find((item) => item.label === currentModule.userType)?.name }}
      el-descriptions-item(label='终端类型', v-if='currentModule.platType')
        span.dot-list(v-for='(item, i) in currentModule.platType.split(",")', :key='i') {{ platTypeLevel.find((subItem) => subItem.code === item).name }}
      el-descriptions-item(v-if='currentModule.comType === 1', label='显示应用最大数量')
        el-button(type='primary', link, @click='toBindApps') {{ currentModule.extraConfig.maxNumber }} 查看
      el-descriptions-item(label='组件图示')
        el-popover(placement='right-end', width='auto', trigger='hover')
          el-image(:src='currentModule.comIconUrl')
          template(#reference)
            el-image(style='height: 40px; cursor: pointer', :src='currentModule.comIconUrl')
      el-descriptions-item(label='说明', v-if='currentModule.description') {{ currentModule.description }}
  el-dialog(v-model='isProgress', title='添加中', width='30%', align-center)
    el-progress(:percentage='percentage', :indeterminate='true')
    p.text-center {{ progressText }}
</template>

<script lang="ts" setup>
import { ref, getCurrentInstance, onActivated } from 'vue'
import type { ElTable } from 'element-plus'
import { Cloud } from '@/service/cloud'
import { App, Module } from '@/service/platform/index'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { key } from '@/store'
import { getFileFromOnlineImg } from '@/assets/scripts/file'
// import FilterContent from '@/components/filterContent/index.vue'
// import TableTitle from '@/components/tableTitle.vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Search, Refresh, Check, Close } from '@element-plus/icons-vue'
import HeadOperation from '@/components/headOperation.vue'
// const { appContext }: any = getCurrentInstance()
const router = useRouter()
// const store =
const { state } = useStore(key)
const moduleTypeList = state.moduleTypeList
const userTypeList = state.userTypeList
const platTypeList = state.platTypeList
const platTypeLevel = state.platTypeLevel
const installStatusList = state.installStatusList
const colorList = ref(['primary', 'success', 'warning', 'danger', 'info'])

let form: any = ref({
  comName: null,
  comType: null,
  userType: null,
  platType: null
})
const dialogFormVisible = ref(false)
const currentModule: any = ref({})

const isProgress: any = ref(false)
const progressText: any = ref('')
const percentage: any = ref(0)
const inquire = () => {
  currentPage.value = 1
  getCloudModuleList(1, 'messageBox')
}
const reset = () => {
  for (const key in form.value) {
    form.value[key] = null
  }
  getCloudModuleList(1)
}
const multipleTableRef = ref<InstanceType<typeof ElTable>>()
const multipleSelection = ref([]) // 选中数据
// const selectData: any = ref([]) // 全部选中数据
const addSelection = async () => {
  // console.log(multipleSelection.value)
  const formData = new FormData()
  // multipleSelection.value.forEach((element: any, index: number) => {
  for (let i = 0; i < multipleSelection.value.length; i++) {
    const element: any = multipleSelection.value[i]
    const obj: any = {
      appIconStyle: element.appIconStyle,
      comCode: element.comCode,
      // iconImage: '',
      name: element.comName,
      comType: element.comType,
      defaultTheme: element.defaultTheme,
      description: element.description,
      nameEn: element.nameEn,
      platType: element.platType,
      userType: element.userType
    }
    if (element.extraConfig) {
      if (element.extraConfig.appIconStyle) obj.appIconStyle = element.extraConfig.appIconStyle
      if (element.extraConfig.maxNumber) obj.maxNumber = element.extraConfig.maxNumber
      if (element.extraConfig.isAllApps) obj.isAllApps = element.extraConfig.isAllApps
    }
    const file: any = await getFileFromOnlineImg(element.comIconUrl, element.comCode + '.png')
    Object.keys(obj).forEach((key) => {
      if (obj[key]) formData.append(`zCom[${i}].${key}`, obj[key])
    })
    if (file) formData.append(`zCom[${i}].iconImage`, file)
  }
  // console.log('----', formData)
  addModule(formData)
}
let successData: any = [] // 添加成功组件数据
// 添加组件
const addModule = async (formData: any) => {
  // const message = appContext.config.globalProperties.$message({
  //   message: '添加中...',
  //   duration: 0
  // })
  isProgress.value = true
  percentage.value = 0
  const timer = setInterval(() => {
    // console.log(1)
    percentage.value += 8
    if (percentage.value >= 99) {
      percentage.value = 99
    }
    // console.log(percentage.value)
  }, 200)
  progressText.value = '正在添加组件...'
  const { data, code, msg }: any = await Module.addZcom(formData, 'messageBox')
  // message.close()

  console.log(data, code, msg)
  if (code === 200) {
    if (data.length === 0) {
      successData = multipleSelection.value
      // s
    } else {
      let arr: any = []
      data.forEach((element: any) => {
        // console.log(element.name)
        const index = multipleSelection.value?.findIndex((item: any) => item.comCode === element.comCode)
        multipleSelection.value.splice(index, 1)
        // console.log(index)
        arr.push(element.name + '（错误信息：' + element.errormsg + ')')
      })
      successData = multipleSelection.value
      // const opt: IMsgBoxOptions = {
      //   title: '添加失败',
      //   type: 'warning',
      //   message: arr.join('，\n'),
      //   showCancelButton: false
      // }
      // msgbox.open(opt)
      ElMessageBox.confirm(arr.join('，\n'), '添加失败', {
        confirmButtonText: '确定',
        showCancelButton: false,
        type: 'warning'
      })
    }
    // console.log('successData', successData)
    if (successData?.findIndex((item: any) => item.comType === 1) > -1) {
      // 应用类组件个数
      console.log(
        '应用类组件个数',
        successData.filter((item: any) => item.comType === 1)
      )
      const number = successData.filter((item: any) => item.comType === 1).length
      //存在应用类型组件
      getAppAllList().then((list: any) => {
        // alert('getAppAllList:' + list.length)
        let key: any = 0 // 应用组件数量
        successData.forEach((element: any, i: number) => {
          if (element.comType === 1) {
            console.log('索引 key' , key, element.comCode  )
            key++
            addModuleBindApp(element.comCode, key, number)
          }
          const index = tableData.value?.findIndex((item: any) => item.comCode === element.comCode)
          // console.log(index)
          // if (index > -1) {
          //   // 修改安装状态
          //   tableData.value[index].installFlag = 1
          // }
          moduleList.value.push(element)
        })
      })
    } else {
      successData.forEach((element: any, i: number) => {
        const index = tableData.value?.findIndex((item: any) => item.comCode === element.comCode)
        // if (index > -1) {
        //   // 修改安装状态
        //   tableData.value[index].installFlag = 1
        // }
        moduleList.value.push(element)
      })
      isProgress.value = false
      // percentage.value = 0
      clearInterval(timer)
      // ElMessage({
      //   showClose: true,
      //   message: '添加完成',
      //   type: "success"
      // })
      ElMessage.success('添加完成')
    }

    clearSelection()
  }
}
// 查询组件绑定应用
const getModuleBindApp = async (comCode: string) => {
  let moduleBindApp = []
  // const moduleBindApp = []
  const notInstalledApp: any = []
  const { data, status, message }: any = await Cloud.getModuleBindApp({ comCode }, 'messageBox')
  if (status === 200) {
    // console.log('getModuleBindApp', data)
    moduleBindApp = data
    const arr: any = []
    data.forEach((element: any) => {
      arr.push(element.appCode)
    })
    let obj: any = {}
    obj[comCode] = arr
    if (sessionStorage.getItem('cloudModuleBindApp')) {
      let data = JSON.parse(sessionStorage.getItem('cloudModuleBindApp') as string)
      data = { ...data, ...obj }
      sessionStorage.setItem('cloudModuleBindApp', JSON.stringify(data))
    } else {
      sessionStorage.setItem('cloudModuleBindApp', JSON.stringify(obj))
    }
  } else {
    // ElMessage({
    //   showClose: true,
    //   message: message,
    //   type: 'error'
    // })
    // ElMessage.error(message)
    // appContext.config.globalProperties.$message.danger(message)
  }
  return moduleBindApp
}
// 查询已安装应用
let allApp: any = []

const getAppAllList = () => {
  // let allApp = []
  return new Promise((resolve, reject) => {
    App.getAppAll({ flagIsSelfApp: 0 })
      .then((r) => {
        if ((r.code = 200)) {
          allApp = r.data
          resolve(r.data)
        } else {
          ElMessage.error(r.msg)
        }
      })
      .catch((err) => {
        ElMessage.error(err.msg)
      })
  })
}
// 添加组件绑的应用
// let message: any = null
const addModuleBindApp = async (comCode: string, index: number, total: number) => {
  let timer: any = null
  if (index === 0) {
    isProgress.value = true
    timer = setInterval(() => {
      // console.log(1)
      percentage.value += 8
      if (percentage.value >= 99) {
        percentage.value = 99
      }
      // console.log(percentage.value)
    }, 200)
    progressText.value = '正在添加组件绑定应用...'
  }
  const moduleBindApp: any = await getModuleBindApp(comCode)
  const addAppList: any = []
  // 过滤已安装应用
  // console.log('allApp', allApp)
  // alert('addModuleBindApp:' + allApp.length)
  console.log('addAppList: 0 -- ', index, total)
  // if (moduleBindApp.length > 0) {
  moduleBindApp.forEach((element: any) => {
    const num: number = allApp?.findIndex((item: any) => item === element.appCode)
    if (num === -1) {
      addAppList.push(element)
      // moduleBindApp.splice(n, 1)
    }
  })
  console.log('addModuleBindApp', allApp, comCode, moduleBindApp, addAppList, addAppList.length > 0)
  if (addAppList.length > 0) {
    const formData = new FormData()
    // bindAppList.forEach((element: any, j: number) => {
    for (let j = 0; j < addAppList.length; j++) {
      const element = transAppData(addAppList[j])
      const obj: any = {
        appCode: element.appCode, // 必填， 第三方没有的， 后端自己生成
        appName: element.appName, // 必填
        appDesc: element.appDesc, // app描述；非必填
        status: 1, // 状态； 前端传1 (0 无效，1有效)
        appNameEn: element.appNameEn, // 非必填 ！！！！！
        flagIsSelfApp: 0, //是否是第三方应用 1-是, 0-不是；  必填
        // appUserType: element.appUserType, // 应用所属用户类型；非必填，默认值：通用
        userType: element.appUserType, // 应用所属用户类型；非必填，默认值：通用
        showTitle: 1, // 是否显示头【0:否 1:是】；默认值：是
        url: JSON.stringify(element.extraConfig.url), // 应用地址
        // component: comCode, // 应用绑定的组件code逗号连接
        purviewSetting: '', // 权限，暂时不用解析，
        installConfig: JSON.stringify(element.extraConfig.installConfig),
        webApi: element.webApi, // 应用接口；非必填
        route: element.route, // 前端页面路由名;非必填
        platType: element.platType,
        appType: 4, // 应用类型； 必填
        isPersist: 0, // 保留数据0-否 1-是 不允许删除；非必填
        flagIsTopApp: 0, // 是否置顶(默认应用)
        flagIsAdSupport: 0, // 是否能设置广告：0否1是； 默认值：否
        flagIsShow: 1, // 是否在界面显示 ；默认值：是
        flagIsEmbeddedRedirect: 0, // 是否内嵌跳转；默认值：否
        developerId: '', // 用户ID:默认为0；非必填
        authMethods: element.authMethods,// 认证方式
        flagIsLoginRequired: '1', // 是否需要登录
        supportSchedule: (element.supportSchedule === undefined ? 0 : element.supportSchedule), // 是否支持方案
        isAllowCloning: element.extraConfig?.isAllowClone ? true : false //是否允许克隆
      }
      // console.log('obj', element, obj)
      Object.keys(obj).forEach((key) => {
        // console.log(`zApp[${j}].${key}`, obj[key])
        formData.append(`zApp[${j}].${key}`, obj[key])
      })
      // console.log('8888', element.extraConfig.img)
      for (let m = 0; m < element.extraConfig.img.length; m++) {
        const subElement = element.extraConfig.img[m]
        if (subElement.src) {
          // alert(1)
          const file: any = await getFileFromOnlineImg(subElement.src, element.appCode + '.png')
          // alert(2)
          if (file) element.extraConfig.img[m].file = file
          // formData.append(`zApp[${j}].iconByFile[${m}].file`, file)
          // formData.append(`zApp[${j}].iconByFile[${m}].type`, subElement.code)
        }
        // console.log(`zApp[${j}].iconByFile[${m}].file`, file)
        // console.log(`zApp[${j}].iconByFile[${m}].type`, subElement.code)
      }
      // let s = 0
      element.extraConfig.img.forEach((imgO: any, i: number) => {
        if (imgO.file) {
          formData.append(`zApp[${j}].iconByFile[${i}].file`, imgO.file)
          formData.append(`zApp[${j}].iconByFile[${i}].type`, imgO.code)
          // s = s + 1
        }
      })
    }
    // alert('添加应用')
    const { data, code, msg } = await App.addApp(formData)
    if (code === 200) {
      console.log('添加组件绑定应用', index, total, comCode, data)
      allApp = allApp.concat(data.yesList)
      console.log('111', data, index, total, index === total)
      if (index === total) {
        console.log('最后一次', index, total, comCode, data)
        // // 组件关联应用
        // message.close()
        isProgress.value = false
        // percentage.value = 0
        clearInterval(timer)
        // ElMessage({
        //   showClose: true,
        //   message: '添加完成',
        //   type: 'success'
        // })
        ElMessage.success('添加完成')
        // appContext.config.globalProperties.$message.success('添加完成')
        // alert('getLocalModuleList')
        getLocalModuleList()
      }
    } else {
      isProgress.value = false
      // percentage.value = 0
      ElMessage.error(msg)
      // ElMessage({
      //   showClose: true,
      //   message: msg,
      //   type: 'error'
      // })
    }
    // console.log('addApp', res)
  } else {
    console.log('addAppList: 0 -- ', index, total, index + 1 === total)
    if (index === total) {
      // message.close()
      isProgress.value = false
      // percentage.value = 0
      // clearInterval(timer)
      clearInterval(timer)
      // ElMessage({
      //   showClose: true,
      //   message: "添加完成",
      //   type: "success"
      // })
      ElMessage.success('添加完成')
      // appContext.config.globalProperties.$message.success('添加完成')
      getLocalModuleList()
    }
  }
  // } else { // 应用类组件没有绑定应用
  //   console.log('没有绑定应用')
  //   isProgress.value = false
  //   ElMessage({
  //     showClose: true,
  //     message: "添加完成",
  //     type: "success"
  //   })
  //   getLocalModuleList()
  // }

  // console.log()
}
//  查询组件id
const getLocalModuleList = async () => {
  // console.log('getLocalModuleList', comCode)
  const { data: res, code, message }: any = await Module.getZcomList()
  if (code === 200) {
    console.log('getLocalModuleList', res, successData)
    // const arr = res.records.filter((item: any) => )
    const arr: any = []
    successData.forEach((element: any) => {
      const module = res?.find((item: any) => item.comCode === element.comCode)
      if (module) arr.push(module)
    })
    getLocalAppList(arr)
    // console.log('successModuleData', successData)
    // console.log('cloudModuleBindApp', sessionStorage.getItem('cloudModuleBindApp'))
  } else {
    console.log(message)
  }
}
//  查询本地组件关联的应用id
const getLocalAppList = async (moduleList: any) => {
  // console.log('getLocalAppList', appsList)
  const { data: res, code, msg } = await App.getZappListAll()
  if (code === 200) {
    console.log('getLocalAppList', res, moduleList, sessionStorage.getItem('cloudModuleBindApp'))
    const cloudModuleBindApp = JSON.parse(sessionStorage.getItem('cloudModuleBindApp') as string)
    // const arr = []

    moduleList.forEach((element: any) => {
      const acaList: any = []
      if (cloudModuleBindApp[element.comCode]) {
        cloudModuleBindApp[element.comCode].forEach((appEle: any) => {
          const app = res?.find((item: any) => item.appCode === appEle)
          if (app) acaList.push({ appId: app.bh })
        })
      }
      // appId
      // let obj = {
      //   comId: element.bh,
      //   acaList: acaList
      // }
      // arr.push(obj)
      setModuleBindApp(element.bh, acaList)
    })
    // console.log('cloudModuleBindApp', sessionStorage.getItem('cloudModuleBindApp'))
    // console.log('cloudModuleBindApp', sessionStorage.getItem('cloudModuleBindApp'))
    // appAll.value = res
  } else {
    console.log(msg)
    // ElMessage.error('未获取到应用列表')
  }
}
// 组件应用绑定关系
const setModuleBindApp = async (bh: any, acaList: any) => {
  const params = {
    comId: bh,
    acaList
  }
  console.log('setComBindApp', params)
  // setComBindApp
  const { data: res, code, msg }: any = await Module.setComBindApp(params)
  if (code === 200) {
    // data.tableData = res
    console.log('setLocalComBindApp', res, code, msg)
  } else {
    ElMessage.error(msg)
    // ElMessage({
    //   message: msg,
    //   type: 'error'
    // })
    // appContext.config.globalProperties.$message.danger(msg)
  }
  sessionStorage.removeItem('cloudModuleBindApp')
}
const clearSelection = () => {
  // 清除勾选
  multipleTableRef.value!.clearSelection()
}
const handleSelect = (val: any) => {
  console.log('handleSelect', val)
}
const handleSelectionChange = (val: any) => {
  console.log('handleSelectionChange', val)
  // 监听表单选项
  multipleSelection.value = val
}
const getRowKeys = (row: any) => {
  return row.comCode // 返回唯一标记值，这里的 id 是唯一的
}
let tableData: any = ref([])
let moduleList: any = ref([])
let loading = ref(false)
let total = ref(0) // 总数
let currentPage = ref(1) // 页码
const pageSize = ref(10) // 页数
// 查询组件列表
const getModuleList = async () => {
  const { data: res, code, msg }: any = await Module.getZcomList()
  if (code === 200) {
    moduleList.value = res
    // console.log('getModuleList=', res)
  } else {
    console.log(msg)
  }
}
//  支持终端类型
let platTypeArr: any = []
platTypeList.forEach((element: any) => {
  platTypeArr.push(element.code)
})

// console.log(platTypeArr.join(','))
// 查询云端组件列表
const getCloudModuleList = async (type?: number, feedbackType?: string) => {
  // getSelectData()
  const params: any = {
    page: currentPage.value - 1,
    size: pageSize.value,
    // platType: platTypeArr.join(',')
  }
  if (type === 1) {
    //查询
    console.log(form.value)
    for (const key in form.value) {
      if (form.value[key]) {
        if (key === 'platType') {
          const obj = platTypeLevel?.find((item: any) => item.code === form.value[key])
          // console.log(obj)
          console.log('----', obj.parentCode)
          if (obj.parentCode) {
            // form.value[key] = obj.parentCode
            // params[key] = obj.parentCode
            params[key] = obj.parentCode
          } else {
            params[key] = obj.code
          }
        } else {
          params[key] = form.value[key]
        }
      }
    }
  }
  // console.log('params', params)
  loading.value = true
  // console.log('888', await Cloud.getModuleListPage(params))
  const { data: res, status, message }: any = await Cloud.getModuleListPage(params, feedbackType)
  loading.value = false
  if (status === 200) {
    // console.log(res, status, message)
    res.data.forEach((element: any) => {
      // element.myPage = currentPage.value
      // 终端类型转为小类
      const children = platTypeList?.find((item: any) => item.code === element.platType)?.children
      if (children.length > 0) {
        // console.log(element.platType, children)
        const arr: any = []
        children.forEach((subEle: any) => {
          arr.push(subEle.code)
        })
        element.platType = arr.join(',')
      }
      const index = moduleList.value?.findIndex((item: any) => item.comCode === element.comCode)
      // if (index > -1) {
      //   // 判断本地是否安装
      //   element.installFlag = 1
      // } else {
      //   element.installFlag = 0
      // }
    })
    tableData.value = res.data
    total.value = res.totalSize
  }
}

const handleSizeChange = (val: number) => {
  console.log(`每页 ${val} 条`)
  pageSize.value = val
  getCloudModuleList(1)
}
const handleCurrentChange = (val: number) => {
  console.log(`当前页: ${val}`)
  currentPage.value = val
  getCloudModuleList(1)
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
const checkModule = (item: any) => {
  dialogFormVisible.value = true
  currentModule.value = item
}
const toBindApps = (item: any) => {
  dialogFormVisible.value = false
  router.push({
    name: 'moduleBindApps'
  })
  currentModule.value.mySource = 1 // 0本地数据 1云端数据
  sessionStorage.setItem('currentModule', JSON.stringify(currentModule.value))
}
// app 应用数据 统一处理url img
const transAppData = (appObj: any) => {
  console.log('in transAppData')
  // url
  let urlArr: any = []
  appObj.extraConfig.url.forEach((item: any) => {
    if (item.children && item.children.length > 0) {
      urlArr = urlArr.concat(item.children)
    } else {
      urlArr.push(item)
    }
  })
  appObj.extraConfig.url = urlArr
  // icon
  let img: any = []
  appObj.extraConfig.img.forEach((item: any) => {
    if (item.code === 'mobile') {
      const arr = platTypeLevel
        .filter((o: any) => {
          return o.parentCode === 'mobile'
        })
        .map((o: any) => {
          const obj = {
            code: o.code,
            name: o.name,
            file: '',
            src: item.src
          }
          return obj
        })

      img = img.concat(arr)
    } else {
      img.push(item)
    }
  })
  appObj.extraConfig.img = img
  // platType
  const mobileStr = platTypeLevel
    .filter((o: any) => {
      return o.parentCode === 'mobile'
    })
    .map((o: any) => {
      return o.code
    })
    .join(',')
  appObj.platType = appObj.platType.replace('mobile', mobileStr)
  return appObj
}
onActivated(() => {
  getModuleList().then(() => {
    getCloudModuleList()
  })
})
</script>
