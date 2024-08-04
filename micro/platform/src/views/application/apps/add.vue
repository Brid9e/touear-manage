<template lang="pug">
div
  .content-wrap.padding-bottom
    el-steps.step(:active='stepList?.length - 1 === currentStep ? currentStep + 1 : currentStep', align-center='')
      template(v-for='(item, index) in stepList', :key='item.index' )
        el-step(:title='item.value', :description='item.description')
          template(#icon, v-if='index === stepList?.length - 1 && currentStep === stepList?.length - 1')
            span.small-icon-finished
              Select

    .step-content
      .step-content__item(v-for="(stepItem, index) in stepList" :key="index")
        Component.step-content__item-compoent(v-if="currentStep === index" :is="stepItem.component" ref="contentCompRef" v-bind="{addType, resultData, item: stepItem, typeValue: addType}", @typeEmit='getTypeEmit')

    .btn-content.text-center
      el-button(type='primary', plain, size='large', v-if='currentStep !== 0 && currentStep !== stepList.length - 1', @click='preStep') 上一步
      //- el-button(type='primary', size='large', v-if='currentStep < stepList.length - 1', @click='nextStep', :disabled='stepList[currentStep].disabled || !state.funcButton.appTypeListRemove')
      el-button(type='primary', size='large', v-if='currentStep < stepList.length - 1', @click='nextStep', :disabled='stepList[currentStep].disabled')
        template(v-if="currentStep === stepList.length - 2")
          | 确认添加
        template(v-else)
          | 下一步{{ stepList[currentStep].name === "setCommponent" || stepList[currentStep].name === "setLimit" ? "（跳过）" : "" }}
      el-button(type='success', plain, size='large', v-if='currentStep === stepList.length - 1', @click='toApplist') 应用列表
      el-button(type='primary', plain, size='large', v-if='currentStep === stepList.length - 1', @click='toAppAdd') 继续添加

  el-dialog(v-model='showLoading', :width='350', :close-on-click-modal='false', :show-close='false', :close-on-press-escape='false' @closed="percentage = 0")
    el-progress(:percentage='percentage' :stock-width="10")
</template>
<script lang="ts" setup>
import { computed, ref, onMounted, watch, onActivated } from 'vue'
import { useStore } from 'vuex'
import { key } from '@/store/index'
import { useRouter, useRoute } from 'vue-router'
import { Select } from '@element-plus/icons-vue'
import { App, Group } from '@/service/platform'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getFileFromOnlineImg } from '@/assets/scripts/file'
import AddAppType from '../components/appAdd/addAppType.vue'
import Module from '../components/appAdd/module.vue'
import Purview from '../components/appAdd/purview.vue'
import InstallConfig from '../components/appAdd/installConfig.vue'
import Finished from '../components/appAdd/finshed.vue'
import BaseOrCustomAppAdd from '../components/appAdd/baseOrCustomAppAdd.vue'

const router = useRouter()
const route = useRoute()
const title = router.currentRoute.value.meta.title
const store = useStore(key)
const { state } = store
const contentCompRef = ref()
const showLoading = ref(false)
const percentage = ref(0)
let currentStep = ref(0) //当前步骤
let addType = ref('base')
let hasInstallApp = ref(false)
let nextBtnDisabled = ref(false)
const resultData = ref({})
const limitError: any = ref([])
// SAAS版本
// const SAAS = ref(state.deploymentType)

const isSuperAdmin = computed(() => state.userInfo.account === 'admin' || false)
const contentRef = computed(() => contentCompRef.value?.[0])
const isSystem = computed(() => state.userInfo?.identityType === 'system')

// 自有应用
const baseAppStep = {
  name: 'baseApp',
  value: '选择应用',
  description: '',
  component: BaseOrCustomAppAdd,
  next: () => {
    // 存在安装配置应用
    hasInstallApp.value =
      checkAppList.value.findIndex((item: any) => {
        if (item.extraConfig && item.extraConfig.installConfig) {
          return item.extraConfig.installConfig.length > 0
        }
      }) !== -1
    // steplist是否存在"安装配置"
    const index = stepList.value.findIndex((o: any) => {
      return o.key === 'installConf'
    })
    if (hasInstallApp.value && index === -1) {
      stepList.value.splice(stepList.value.length - 1, 0, installConfigStep)
    } else if (!hasInstallApp.value && index !== -1) {
      stepList.value.splice(index, 1)
    }
    let arr: any = []
    checkAppList.value.forEach((ele: any) => {
      if (ele.cloneData) {
        arr = arr.concat(ele.cloneData)
      } else {
        arr.push(ele)
      }
    })
    store.dispatch('AddApplistAction', arr)
    currentStep.value++
  },
  disabled: computed(() => {
    return checkAppList.value.length === 0
  })
}

// 自定义应用
const customAppStep = {
  name: 'customApp',
  value: '填写应用基本信息',
  description: '自定义应用',
  component: BaseOrCustomAppAdd,
  next: () => {
    contentCompRef.value?.[0]?.custom.submit().then((valid: any) => {
      if (valid) {
        currentStep.value++
      }
    })
  }
}

// 安装配置
const installConfigStep = {
  name: 'installConfig',
  value: '安装配置',
  key: 'installConf',
  description: '',
  component: InstallConfig,
  next: () => {
    contentCompRef.value?.[0]?.submit((data: any) => {
      console.log('添加应用---', data)
      if (data.valid) {
        showLoading.value = true
        increase()
        addSubmit()
      } else {
        ElMessage({
          message: '请填写完整',
          type: 'error'
        })
      }
    })
  }
}

/**
 * 选应用类型
 */
const selectType = {
  name: 'appType',
  value: '选择应用类型',
  description: '自有应用',
  component: AddAppType,
}

/**
 * 选择组件
 */
const selectComp = {
  name: 'setCommponent',
  value: '设置组件',
  description: '',
  component: Module,
  next: () => {
    if (hasInstallApp.value || currentStep.value + 1 !== stepList.value?.length - 1) {
      contentRef.value?.submit || contentRef.value[addType.value]?.submit()
      currentStep.value++
    } else {
      showLoading.value = true
      increase()
      addSubmit()
    }

  }
}

/**
 * 权限
 */
const setLimit = {
  name: 'setLimit',
  value: '设置权限',
  description: '',
  component: Purview,
  next: () => {
    if (hasInstallApp.value || currentStep.value + 1 !== stepList.value?.length - 1) {
      currentStep.value++
    } else {
      showLoading.value = true
      increase()
      addSubmit()
    }
  }
}

/**
 * 已完成
 */
const finished = {
  name: 'finish',
  value: '完成',
  description: '',
  component: Finished,
  status: ''
}

/**
 * 默认流程
 */
const baseStep = [selectType, baseAppStep, selectComp, setLimit, finished]

/**
 * 系统超管
 */
const superAdminStep = [selectType, baseAppStep, selectComp, finished]

/**
 * 区域超管，渠道商超管
 */
const adminStep = [customAppStep, selectComp, finished]

/**
 * 租户管理员，租户普通用户
 */
const normalStep = [customAppStep, selectComp, setLimit, finished]


/**
 * 不同身份用户流程处理逻辑
 */
const stepUse = computed(() => {
  let steps: any = []
  if (isSuperAdmin.value) steps = superAdminStep
  else if (isSystem.value) steps = adminStep
  else steps = normalStep
  return steps
})

/**
 * 安装步骤，默认baseStep
 */
let stepList: any = ref(stepUse.value)

/**
 * 进度条
 */
const increase = () => {
  const time1 = setInterval(() => {
    percentage.value += 2
    if (percentage.value > 96) {
      percentage.value = 96
      clearInterval(time1)
    }
  }, 300)
}

function onTest() {
  // console.log(customRef.value.custom.submit)
}

/**
 * 下一步
 */
const nextStep = () => {
  console.log('currentStep', currentStep.value, stepList.value[currentStep.value])
  if (!stepList.value[currentStep.value].next) {
    currentStep.value++
  } else {
    stepList.value[currentStep.value].next()
  }
}

/**
 * 上一步
 */
const preStep = () => {
  if (currentStep.value !== 0) {
    ElMessageBox.confirm('返回“上一步”将导致当前页面内容丢失,确定返回？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
      .then(() => {
        currentStep.value--
      })
      .catch(() => {
        // TODO
      })
  }
}

const addSubmit = async () => {
  const formData = new FormData()
  for (let index = 0; index < checkAppList.value.length; index++) {
    const element = checkAppList.value[index]
    // installConfig
    let submitInstallApi = null
    let installConfigForm = ''
    if (addType.value === 'base' && element.extraConfig.installConfig?.length > 0) {
      const obj =
        element.extraConfig.installConfig.find((item: any) => {
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
      appId: element.bh,
      appCode: addType.value === 'base' ? element.appCode : '', // 必填， 第三方没有的， 后端自己生成
      appName: element.appName, // 必填
      appDesc: element.appDesc, // app描述；非必填
      status: 1, // 状态； 前端传1 (0 无效，1有效)
      appNameEn: element.appNameEn || '', // 非必填 ！！！！！
      flagIsSelfApp: addType.value === 'custom' ? 1 : 0, //是否是自定义应用 1-是, 0-不是；  必填
      // appUserType: element.appUserType, // 应用所属用户类型；非必填，默认值：通用
      userType: element.appUserType || 'common', // 应用所属用户类型；非必填，默认值：通用
      showTitle: addType.value === 'base' ? (element.extraConfig ? (element.extraConfig.showTitle || element.extraConfig.showTitle === 0 ? element.extraConfig.showTitle : 1) : 1) : 1, // 是否显示头【0:否 1:是】；默认值：是
      // icon: element.extraConfig.img, // 应用图标
      url: JSON.stringify(element.extraConfig.url), // 应用地址
      component: element.component || undefined, // 应用绑定的组件code逗号连接
      purviewSetting: '', // 权限，暂时不用解析，
      installConfig: addType.value === 'base' ? JSON.stringify(element.extraConfig.installConfig) : '', // 安装配置
      installConfigForm: installConfigForm,
      webApi: element.webApi || '', // 应用接口；非必填
      route: '', // 前端页面路由名;非必填
      platType: element.platType,
      appType: 4, // 应用类型； 非必填
      isPersist: 0, // 保留数据0-否 1-是 不允许删除；非必填
      flagIsTopApp: 0, // 是否置顶(默认应用)
      flagIsAdSupport: 0, // 是否能设置广告：0否1是； 默认值：否
      flagIsShow: 1, // 是否在界面显示 ；默认值：是
      flagIsCloud: 1,
      flagIsEmbeddedRedirect: 0, // 是否内嵌跳转；默认值：否
      developerId: '', // 用户ID:默认为0；非必填
      authMethods: addType.value === 'base' ? element.authMethods : '', // 认证方式
      flagIsLoginRequired: element.loginRequired === 1 ? '1' : '0', // 是否需要登录
      supportSchedule: addType.value === 'base' ? (element.supportSchedule === undefined ? 0 : element.supportSchedule) : 0, // 是否支持方案
      isAllowCloning: addType.value === 'base' && element.extraConfig?.isAllowClone ? true : false, //是否允许克隆
      flagIsAuthContent: '0', // 是否有认证内容
      flagIsHelpContent: '0', // 是否有帮助内容
      flagIsLimitYktTime: '0', //是否限制一卡通服务时间
      flagIsConfiguration: '0', //是否是需要配置 1-是, 0-不是；  必填
      // flagIsAdSupport: element.flagIsAdSupport, // 是否能设置广告：0否1是； 默认值：否
      flagIsSystem: '0', //是否是基础应用
      // operateTime: element.operateTime === null ? '' : element.operateTime,
      repeatInstall: '0',
      basePublic: '1',
      installed: '0'

      // serviceAppWebsite: '', // 链接地址(服务应用端)； 非必填
      // website: h5UrlObj ? h5UrlObj.url : null, // 链接地址(移动端)；非必填，向下兼容
      // webAppWebsite: pcUrlObj ? pcUrlObj.url : null, // 链接地址(PC端； 非必填， 向下兼容
      // flagIsMobileApp: 1, // 是否是手机应用
      // flagIsWebApp: 1, // 是否是网页应用
      // flagIsH5App: 1, // 是否是H5应用
      // flagIsWeChatMiniApp: 1, // 是否是微信应用
      // appIcon: '', // 非必填
      // appIconPrefix: '', // 废弃，非必填
      // flagIsServiceApp: 0, // 是否是服务应用
      // newIconUrl: null, // 更新图标的源文件地址；非必填
      // flagIsPublicIcon: 0 // 是否使用公共图标；默认值：否
    }
    console.log('app--form--------------', element)
    Object.keys(obj).forEach((key) => {
      obj[key] !== undefined && formData.append(`zApp[${index}].${key}`, obj[key])
    })
    let j = 0
    // icon
    if (addType.value === 'base') {
      for (let j = 0; j < element.extraConfig.img.length; j++) {
        if (element.extraConfig.img[j].src) {
          const r = await getFileFromOnlineImg(element.extraConfig.img[j].src, element.appCode + '.png')
          element.extraConfig.img[j].file = r
        }
      }
    }
    element.extraConfig.img.forEach((imgO: any, i: number) => {
      if (imgO.file) {
        formData.append(`zApp[${index}].iconByFile[${j}].file`, imgO.file)
        formData.append(`zApp[${index}].iconByFile[${j}].type`, imgO.code)
        j = j + 1
      }
    })
  }
  const resApp = await App.addApp(formData)
  resultData.value = resApp.data
  percentage.value = 100
  showLoading.value = false
  hasInstallApp.value = false
  if (resApp.code === 200 && resApp.data) {
    const bhArr: any = []
    currentStep.value++
    let resourceMap: any = {}
    resApp.data.yesList.forEach((o: any) => {
      let resObj: any = {}
      if (addType.value === 'base') {
        resObj = checkAppList.value[o.sort]
        // resObj = checkAppList.value.find((app: any) => {
        //   return app.appCode === o.appCode
        // })
      } else {
        resObj = checkAppList.value[0]
      }
      console.log('resObj------', resObj)
      if (resObj.limit && !resObj.limit.openLimit) {
        const obj = {
          [o.bh]: { group: resObj.limit.groupValue ? resObj.limit.groupValue : [], sno: resObj.limit.snoValue ? resObj.limit.snoValue : [] }
        }
        resourceMap = { ...resourceMap, ...obj }
        bhArr.push(resObj.appCode)
      }
    })
    if (Object.keys(resourceMap).length > 0) {
      const params = {
        type: 'app',
        removeResource: 'true', // 是否清理旧的数据
        resourceMap: resourceMap
      }
      const limitRes = await Group.saveExtendInfo(params)
      if (limitRes.code === 200 && limitRes.success) {
        console.log('权限设置成功')
        limitError.value = bhArr
      } else {
        contentRef.value.getLimitErr(bhArr)
        console.log('权限设置失败')
      }
    }
  }
}

const checkAppList = computed(() => {
  return state.addApplist
})

const nextButtonDisabled = computed(() => {
  let flag = false
  // if (addType.value === 'base' && currentStep.value === 1 && checkAppList.value.length === 0) {
  //   flag = true
  // }
  return flag
})

const getTypeEmit = (r: any) => {
  addType.value = r.type
  if (addType.value === 'base') {
    stepList.value[0].description = '自有应用'
    stepList.value[1] = baseAppStep
  } else {
    stepList.value[0].description = '自定义应用'
    stepList.value[1] = customAppStep
  }
}

// watchEffect(() => {
//   // console.log('侦听器：', addType)
// })

const toApplist = () => {
  router.push({ name: 'appList' })
}
const toAppAdd = () => {
  currentStep.value = 0
  nextBtnDisabled.value = false
}

/**
 * 通过身份处理流程的逻辑
 */
function handleStepByUserIdentity() {

}

onActivated(() => {
  if (route.query.keepAlive === '0' || currentStep.value === stepList.value?.length - 1) {
    currentStep.value = 0 //当前步骤
    addType.value = !isSuperAdmin.value ? 'custom' : 'base'
    hasInstallApp.value = false
  }
  handleStepByUserIdentity()
})

onMounted(() => {
  addType.value = !isSuperAdmin.value ? 'custom' : 'base'
})

</script>
<style lang="scss" scoped>
.el-radio__label {
  font-size: 16px;
}

.btn-content {
  margin-top: 50px;

  .el-button {
    padding: 15px 60px;
  }
}

.padding-bottom {
  padding-bottom: 30px;
}

.step {
  height: 80px;
  padding: .625rem 6.25rem 0 6.25rem;

  .el-step__icon {
    width: 30px;
    height: 30px;
    border-color: #ccc;
  }

  .el-step__line {
    top: 13px;
  }

  .el-step__head.is-finish {
    color: #fff;

    .el-step__line {
      background-color: #67c23a;
      background-image: url('/assets/images/bg/bg-line.png');
    }

    .el-step__icon {
      width: 30px;
      height: 30px;
      border-color: #67c23a;
      background-color: #67c23a;
      border-radius: 100%;
    }
  }

  .is-process {
    .el-step__icon {
      width: 40px;
      height: 40px;
      transform: translateY(-7px);
      border-color: #333;
      font-size: 20px;
    }
  }

  .el-step__title.is-finish,
  .el-step__description.is-finish {
    color: #67c23a;
  }
}

.el-is-center .el-step__description.is-finish {
  font-size: 18px;
}

.el-step__title.is-finish {
  font-size: 14px;
}

.step-content {
  min-height: 500px;
  box-sizing: border-box;

  .content-bg {}

  :deep(.create-custom-app-form.is-custom) {
    padding: 5rem 20% 0 20% !important;
  }

}






.small-icon-finished svg {
  width: 22px;
  height: 22px;
  transform: translateY(2px);
}
</style>