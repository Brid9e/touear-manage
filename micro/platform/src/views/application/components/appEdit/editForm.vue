<template lang="pug">
.content-createCustomApp.content-bg.content-editApp(v-if='info')
  el-tabs.demo-tabs(v-model='activeName', type='card', @tab-change='handleClick')
    el-tab-pane(label='基础信息', name='baseInfo')
      CreateCustomApp(:info='info', :showAuth='true', :isEdit="true" ref='createCustomApp', :url="url", :img="img", @changePlatType='changePlatType')
      el-form.form(v-if='info', label-width='180px', :inline='true')
        el-row(:gutter='20')
          el-col(:span='12')
            el-form-item(label='英文名称')
              el-input(v-model='info.appNameEn', placeholder='请输入')
          el-col(:span='24')
            el-form-item(label='api地址')
              el-input(v-model='info.webApi', placeholder='请输入')
          el-col(:span='24' v-if='platTypeArr.includes("selfService")')
            el-form-item(label='操作时间', )
              el-input(v-model='info.operateTime', placeholder='请输入', type='number')
                template(#suffix)
                  span 秒
          el-col(:span='8')
            el-form-item(label='状态')
              el-switch(v-model='info.status', :active-value='1', :inactive-value='0')
          el-col(:span='8')
            el-form-item(label='在界面展示')
              el-switch(v-model='info.flagIsShow', active-value='1', inactive-value='0')
          el-col(:span='8')
            el-form-item(label='显示app头')
              el-switch(v-model='info.showTitle', :active-value='1', :inactive-value='0')
          el-col(:span='8')
            el-form-item(label='在组件置顶')
              el-switch(v-model='info.flagIsTopApp', active-value='1', inactive-value='0')
          el-col(:span='8')
            el-form-item(label='设置广告')
              el-switch(v-model='info.flagIsAdSupport', active-value='1', inactive-value='0')
          el-col(:span='8')
            el-form-item(label='web端内嵌跳转')
              el-switch(v-model='info.flagIsEmbeddedRedirect', active-value='1', inactive-value='0')
          el-col(:span='8')
            el-form-item(label='需要登录')
              el-switch(v-model='info.flagIsLoginRequired', active-value='1', inactive-value='0')
          el-col(:span='8')
            el-form-item(label='是否限制一卡通服务时间')
              el-switch(v-model='info.flagIsLimitYktTime', active-value='1', inactive-value='0')
          el-col(:span='24'  v-if='platTypeArr.includes("selfService")')
            el-form-item(label='是否有认证内容')
              el-switch.switch-left(v-model='info.flagIsAuthContent', active-value='1', inactive-value='0')
              span.text-gray-6(style="text-indent:3rem;margin-left:5px;" v-if="info.flagIsAuthContent==='1'")
                span(style="margin-left:5px;color:#222") 认证协议代码
                span(style="font-weight:700;color:#000;") {{info.appCode}}Auth
                el-icon.icon-close.text-primary(:size="16" style="transform:translate(4px,3px);margin-right:4px;cursor:pointer", @click.stop="copyclip(info.appCode + 'Auth')")
                  CopyDocument
                |（*复制协议代码，根据该代码在"内容管理"->"协议"->"协议管理"中添加维护该协议）
          el-col(:span='24'  v-if='platTypeArr.includes("selfService")')
            el-form-item(label='是否有帮助内容')
              el-switch.switch-left(v-model='info.flagIsHelpContent', active-value='1', inactive-value='0')
              span.text-gray-6(style="text-indent:3rem;margin-left:5px;" v-if="info.flagIsHelpContent==='1'")
                span(style="margin-left:5px;color:#222") 帮助协议代码
                span(style="font-weight:700;color:#000;") {{info.appCode}}Help
                el-icon.icon-close.text-primary(:size="16" style="transform:translate(4px,3px);margin-right:4px;cursor:pointer", @click.stop="copyclip(info.appCode + 'Help')")
                  CopyDocument
                |（*复制协议代码，根据该代码在"内容管理"->"协议"->"协议管理"中添加维护该协议）
    el-tab-pane(label='组件设置', name='componentSet')
      el-checkbox-group(v-model='componentValue')
        el-row(:gutter='0')
          el-col.scrollbar-demo-item.margin-bottom-2x.component-item(v-for='(item, i) in componentList', :key='i', :span='6', style='padding: 0 10px')
            el-checkbox.checkbox-custom-style(:label='item.bh', border='', @change='changeComponent')
              .info(:style='{ color: "red", "background-image": "url(" + item.icon + ")" }')
              .title.margin-top-x {{ item.name }}
    el-tab-pane(label='权限设置', name='limitSet')
      el-form.limit-form(label-width='100px')
        set-limit(ref="setLimitRef" @changeLimit='changeLimitData', @lastDataLimit='getLastDataLimit', :appBh='info.bh')
    el-tab-pane(label='安装设置', v-if='info.flagIsSelfApp === "0" && info.installConfig && JSON.parse(info.installConfig).length > 0', name='installSet')
      //- div {{ installConfigDetail }}
      //- div {{ info.installConfig }}
      //- h4 {{JSON.parse(info.installConfig)}}
      //- h4 {{installConfigDetail}}
      formCreateByJson(v-if="installConfigRes" :formDataArr='JSON.parse(info.installConfig)', :backfillingPayData="installConfigDetail" ref='formCreateByJson')
    el-tab-pane(label='支付方式', name='pay', v-if='info.flagIsSelfApp === "0" && feeitemIdApp && isExistPayTab')
      pay(:platTypeArr="platTypeArr" :payArr="pays" :platPayInfo="platPayInfo" ref="setPayWay")

</template>
<script lang="ts" setup>
import { ref, computed, reactive } from 'vue'
import { useStore } from 'vuex'
import { key } from '@/store/index'
import { App, Group, Scheme } from '@/service/platform'
import CreateCustomApp from '../appAdd/createCustomApp.vue'
import FormCreateByJson from '@/components/formCreateByJson/index.vue'
import setLimit from '../setLimit.vue'
import { useRouter } from 'vue-router'
import TableTitle from '@/components/tableTitle.vue'
import { Delete, Edit, Download, Plus, Tickets, CopyDocument, Close } from '@element-plus/icons-vue'
import { userType } from '@/assets/scripts/state'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Cloud } from '@/service/cloud'
import { getFileFromOnlineImg } from '@/assets/scripts/file'
import { getRequest, copyclip } from '@/assets/scripts/utils'
import pay from './pay.vue'
import { Info } from '@/service/multiMedia'
const router = useRouter()
const store: any = useStore(key)
const { state } = store
const props = defineProps(['info', 'typeList', 'tabValue', 'componentList'])
const info = ref(props.info)
const setLimitRef = ref()

console.log('编辑---------', props)
const activeName = ref(props.tabValue ? props.tabValue : 'baseInfo')
info.value.appType = Number(info.value.appType) || ''
const platTypeArr = ref([])
platTypeArr.value = info.value.platType.split(',')
const changePlatType = (val: any) => {
  platTypeArr.value = val
}
// 应用类型
const typeList = ref(props.typeList)
// 组件
// 应用的终端类型和组件类型是否匹配
const isMatchingByPlatType = (appPT: any, compPT: any) => {
  const appArr = new Set(appPT.split(','))
  const comArr = new Set(compPT.split(','))
  let res = new Set([...appArr].filter((x) => comArr.has(x)))
  return res.size > 0
}
let componentValue: any = ref([])
let componentList = ref(props.componentList)
componentList = componentList.value.filter((o: any) => {
  return isMatchingByPlatType(info.value.platType, o.platType)
})
componentValue.value = props.info.component ? props.info.component.split(',') : []
componentValue.value = componentValue.value.map((o: any) => {
  return Number(o)
})
const changeComponent = () => {
  info.value.component = componentValue.value.join(',')
}
// 权限
info.value.limit = null
const lastDataLimit: any = ref({})
const changeLimitData = (val: any) => {
  info.value.limit = val
}
const getLastDataLimit = (val: any) => {
  lastDataLimit.value = val
}
const limitSumbit = async () => {
  if (info.value.limit.openLimit) {
    if (!lastDataLimit.value.openLimit) {
      // 调用打开权限接口
      const params = {
        type: 'app',
        resourceId: info.value.bh, // 应用id
        value: true
      }
      const limitStatusrRes = await Group.extendInfoSwitch(params)
    }
  } else {
    if (lastDataLimit.value.openLimit.sno !== info.value.limit.sno || lastDataLimit.value.groupValue !== info.value.limit.groupValue) {
      // 调用设置权限接口
      const params = {
        type: 'app',
        removeResource: 'true', // 是否清理旧的数据
        resourceMap: {
          [info.value.bh]: {
            group: info.value.limit.groupValue ? info.value.limit.groupValue : [],
            sno: info.value.limit.snoValue ? info.value.limit.snoValue : []
          }
        }
      }
      const groupRes = await Group.saveExtendInfo(params)
    }
  }
}
// submit
const createCustomApp = ref()
// const disabled = ref(false)
const buttonDisabled = computed(() => {
  let flag = false
  if (createCustomApp.value) {
    flag = !createCustomApp.value.validateCustomForm
  } else {
    flag = false
  }
  return flag
})
const formCreateByJson = ref()
const setPayWay = ref()
const appList = computed(() => state.addApplist)
const submit = async (callback: any) => {
  let resValid = true
  const valid = await createCustomApp.value.submit()
  resValid = valid
  console.log('valid----', valid)
  if (!resValid) {
    activeName.value = 'baseInfo'
    ElMessage({

      message: '请填写完整',
      type: 'error'
    })
    return
  }
  const creatrInfo = appList.value[0]
  const formData = new FormData()
  const element = info.value
  // installConfig
  let formCreateData: any = {
    installConfig: [],
    installConfigSubmit: {},
    installConfigOriginal: []
  }
  let installConfigFormStr = ''
  if (info.value.flagIsSelfApp === '0' && element.installConfig && JSON.parse(element.installConfig).length > 0) {
    formCreateData = await formCreateByJson.value.submitForm()
    resValid = formCreateData.validateRes
    if (!resValid) {
      activeName.value = 'installSet'
      ElMessage({
        message: '请填写完整',
        type: 'error'
      })
      return
    }
    // 支付方式
    let setPayWayData:any =''
    if (feeitemIdApp &&  pays.value.length > 0) {
      setPayWayData = await setPayWay.value.submit()
      if (!setPayWayData.valid) {
      activeName.value = 'pay'
      ElMessage({
        showClose: true,
        message: '请填写完整',
        type: 'error'
      })
      return
    }
    }

    if (resValid && JSON.stringify(formCreateData.installConfig) !== element.installConfig) {
      const obj =
        JSON.parse(element.installConfig).find((item: any) => {
          return item.type === 'el-button' && item.children[0] === 'submit-edit'
        }) || {}
      const a = obj.effect ? obj.effect.fetch : null
      const o = {
        addInstallConfigApiResult: info.value.installConfigResult ? JSON.parse(info.value.installConfigResult) : ''
      }
      if (feeitemIdApp && pays.value.length > 0) {
        formCreateData.installConfigSubmit.platInfo = setPayWayData?.platInfo
      }
      installConfigFormStr = JSON.stringify({
        action: a?.action,
        data: o.addInstallConfigApiResult ? { ...formCreateData.installConfigSubmit, ...o } : formCreateData.installConfigSubmit,
        method: a?.method
      })
    }
  }
  // 应用obj
  const obj: any = {
    appId: element.bh,
    // icon: element.icon ? element.icon : '',
    appCode: element.appCode, // 必填， 自定义没有的， 后端自己生成
    appName: creatrInfo.appName, // 必填
    appDesc: creatrInfo.appDesc, // app描述；非必填
    platType: creatrInfo.platType, // 终端类型
    url: JSON.stringify(creatrInfo.extraConfig.url), // 应用地址
    status: element.status, // 状态； 前端传1 (0 无效，1有效)
    appNameEn: element.appNameEn || '', // 非必填 ！！！！！
    flagIsSelfApp: element.flagIsSelfApp, //是否是自定义应用 1-是, 0-不是；  必填
    // appUserType: element.appUserType, // 应用所属用户类型；非必填，默认值:通用
    userType: creatrInfo.appUserType, // 应用所属用户类型；非必填，默认值：通用
    showTitle: element.showTitle, // 是否显示头【0:否 1:是】；默认值：是
    component: componentValue.value.join(','), // 应用绑定的组件bh逗号连接
    purviewSetting: '', // 权限，暂时不用解析，
    installConfig: (info.value.flagIsSelfApp === '0' && element.installConfig && JSON.parse(element.installConfig).length > 0) ? JSON.stringify(formCreateData.installConfigOriginal) : '[]', // 安装配置
    installConfigForm: installConfigFormStr,
    // installConfig: '[]', // 安装配置
    // installConfigForm: '',
    // installConfigResult: element.installConfigResult,
    webApi: element.webApi || '', // 应用接口；非必填
    route: element.route === null ? '' : element.route, // 前端页面路由名;非必填
    appType: creatrInfo.appType, // 应用类型； 非必填
    flagIsTopApp: element.flagIsTopApp, // 是否置顶(默认应用)
    flagIsAdSupport: element.flagIsAdSupport, // 是否能设置广告：0否1是； 默认值：否
    flagIsShow: element.flagIsShow, // 是否在界面显示 ；默认值：是
    flagIsEmbeddedRedirect: element.flagIsEmbeddedRedirect, // 是否内嵌跳转；默认值：否
    isPersist: element.isPersist, // 保留数据0-否 1-是 不允许删除；非必填
    developerId: '', // 用户ID:默认为0；非必填
    authMethods: creatrInfo.authMethodsStr,
    flagIsLoginRequired: element.flagIsLoginRequired, // 是否需要登录；默认值：否
    operateTime: element.operateTime === null ? '' : element.operateTime,
    flagIsAuthContent: element.flagIsAuthContent, // 是否有认证内容
    flagIsHelpContent: element.flagIsHelpContent, // 是否有帮助内容
    flagIsLimitYktTime: element.flagIsLimitYktTime, //是否限制一卡通服务时间
    supportSchedule: element.supportSchedule,
    flagIsConfiguration: element.flagIsConfiguration, //是否是需要配置 1-是, 0-不是；  必填
    flagIsCloud: element.flagIsCloud,
    isAllowCloning: element.extraConfig?.isAllowClone ? true : false, //是否允许克隆
    flagIsSystem: element.flagIsSystem, //是否限制一卡通服务时间
    basePublic: element.basePublic,
    installed: element.installed,
    // serviceAppWebsite: '', // 链接地址(服务应用端)； 非必填
    // website: null, // 链接地址(移动端)；非必填，向下兼容
    // webAppWebsite: null, // 链接地址(PC端； 非必填， 向下兼容
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

  console.log(obj)

  Object.keys(obj).forEach((key) => {
    if (obj[key] === null || obj[key] === undefined) {
      obj[key] = ''
    }
    formData.append(`zApp[0].${key}`, obj[key])
  })
  let j = 0
  const iconObj = element.icon ? JSON.parse(element.icon) : ''
  creatrInfo.extraConfig.img.forEach((imgO: any, i: number) => {
    if (imgO.file) {
      formData.append(`zApp[0].iconByFile[${j}].file`, imgO.file)
      formData.append(`zApp[0].iconByFile[${j}].type`, imgO.code)
      j++
    } else {
      if (iconObj && !imgO.src) {
        delete iconObj[imgO.code]
      }
    }
  })
  formData.append(`zApp[0].icon`, element.icon ? JSON.stringify(iconObj) : '')
  if (!resValid) return
  const { code, data, msg } = await App.editApp(formData, 'messageBox')
  if (code === 200) {
    if (info.value.limit) {
      limitSumbit()
    }
    callback ? callback(data) : null
  }
}
// 升级数据，url icon installConfig 为空值时升级为云端数据
let feeitemIdApp = ref()
const clouldRes = ref(false)
const installConfigRes = ref(false) // 是否获取了回显数据
const installConfigDetail: any = ref(null) // 回显数据
const url: any = ref([])
const img: any = ref([])
const platPayInfo= ref()
const getFeedItemData = async () => {
  const installConfig = info.value.installConfig ? JSON.parse(info.value.installConfig) : []
  if (installConfig.length === 0) return
  const feeitemidPay = info.value.installConfigResult ? JSON.parse(info.value.installConfigResult).feeitemid : ''
  if (!feeitemidPay) {
    console.log(11)
    const res = info.value.installConfigForm ? JSON.parse(info.value.installConfigForm) : ''
    installConfigDetail.value = res.data
    installConfigRes.value = true
  } else {
    console.log(222)
    feeitemIdApp.value = feeitemidPay
    const res: any = await App.byItemidGetinfo({ feeitemid: feeitemidPay }).catch((err: any) => {
      installConfigRes.value = true
    })
    if(res?.data && res?.code === 200) {
      installConfigDetail.value = res.data
      platPayInfo.value = res.data.platInfo
      installConfigRes.value = true
    } else {
      installConfigRes.value = true
    }
  }
}
getFeedItemData()
const initByClould = async () => {
  // img url
  const historyUrl = info.value.url ? JSON.parse(info.value.url) : []
  const objIcon: any = info.value.icon ? JSON.parse(info.value.icon) : {}
  const platTypeLevel = store.state.platTypeLevel
  platTypeLevel.forEach((item: any) => {
    const historyUrlObj = historyUrl.find((o: any) => { return o.code === item.code })
    if (historyUrlObj) {
      url.value.push(historyUrlObj)
    } else {
      url.value.push(item)
    }
    const obj: any = {
      code: item.code,
      name: item.name,
      src: objIcon[item.code] ? objIcon[item.code] + '?timeStamp=' + new Date().getTime() : '',
      file: null
    }
    img.value.push(obj)
  })
  img.value.map((o: any) => {
    o.httpRequest = (data: any) => {
      o.src = URL.createObjectURL(data.file)
      o.file = data.file
    }
    return o
  })
  let feeitemid: any = ''
  const feeitemidObj = url.value.find((o: any) => { return o.url ? getRequest(o.url).feeitemid ? feeitemid = getRequest(o.url).feeitemid : false : false })
  const deletionImg = img.value.find((o: any) => { return !o.src }) // 是否缺失图片
  const deletionUrl = url.value.find((o: any) => {  // 是否缺失url
    return !o.url || (feeitemid && !o.url.includes(feeitemid))
  })
  const deletionInstallConfig = feeitemid && (!info.value.installConfig || (info.value.installConfig && JSON.parse(info.value.installConfig).length === 0)) // 是否缺失installconfig
  if (feeitemid) {
    feeitemIdApp.value = feeitemid
  }
  console.log('是否调用云端---', deletionImg, deletionUrl, deletionInstallConfig)
  if (!deletionImg && !deletionUrl && !deletionInstallConfig) return
  let params = {
    page: 0,
    size: 10,
    appCode: info.value.appCode
  }
  const res = await Cloud.getAppList(params)
  if (res && res.data && res.data.data) {
    const appClould = res.data.data[0]
    if (!appClould) return
    // url---若有空值，更新为云端的值; ${feeitemid}更新为真实feeitemid
    let urlCloud: any = []
    appClould.extraConfig.url.forEach((u: any) => {
      if (u.children && u.children.length > 0) {
        urlCloud = urlCloud.concat(u.children)
      } else {
        urlCloud.push(u)
      }
    })
    urlCloud.forEach((u: any) => {
      const index = url.value.findIndex((o: any) => { return o.code === u.code })
      if (index !== -1) {
        if (!url.value[index].url) {
          url.value[index].url = u.url
        }
      } else {
        url.value.push(u)
      }
    })
    if (feeitemidObj) {
      url.value.map((o: any) => {
        o.url = o.url?.replace('${feeitemid}', feeitemid)
        return o
      })
    }
    // icon---若有空值，更新为云端的值
    appClould.extraConfig.img.forEach((o: any, index: number) => {
      const p = platTypeLevel.filter((op: any) => {
        return op.parentCode === o.code
      })
      if (p.length > 0) {
        appClould.extraConfig.img[index].code = p.map((o: any) => { return o.code })
      }
    })
    for (var index in img.value) {
      const o = img.value[index]
      if (!o.src) {
        const imgC = appClould.extraConfig.img.find((co: any) => { return co.code.includes(o.code) })
        if (imgC) {
          const r = await getFileFromOnlineImg(imgC.src, new Date().getTime() + '.png')
          img.value[index].file = r
          img.value[index].src = imgC.src
        }
      }
    }
    clouldRes.value = true
    // 当为缴费类型应用，且安装配置不存在，从云端同步安装配置， 且获取回显值
    if (deletionInstallConfig) {
      info.value.installConfig = JSON.stringify(appClould.extraConfig.installConfig)
      const { data } = await App.byItemidGetinfo({ feeitemid: feeitemid })
      installConfigDetail.value = data
      installConfigRes.value = true
      info.value.installConfigResult = JSON.stringify({
        "msg": "success",
        "code": 200,
        "feeitemid": feeitemid
      })
    }
  }
}
initByClould()
const formCreateRes = ref()
const pays = ref([])
async function handleClick (val:string) {
  if (val === 'pay') {
    formCreateRes.value = await formCreateByJson.value.submitForm()
    pays.value = formCreateRes.value?.installConfigSubmit?.pay
    console.log(125, pays.value)
  }
}
// 是否有支付方式项
const isExistPayTab = ref(false)
console.log('info', info.value)
if (info.value.installConfig) {
  const arr = JSON.parse(info.value.installConfig)
  isExistPayTab.value = arr.find((o:any) => {
    return o.field === 'pay'
  })
  console.log('info-ARR', isExistPayTab, arr)
}

// 方案
// const platTypeLevel = store.state.platTypeLevel;
// const infoP = info.value.platType.split(",");
// const toSetTheme = () => {
//   const pArr: any = [];
//   platTypeLevel.forEach((o: any) => {
//     if (infoP.includes(o.code) || infoP.includes(o.parentCode)) pArr.push(o.code);
//   });
//   let index = state.devHost.scheme;
//   // let url = `${index}/manage-scheme/?token_type=${state.token_type}&token=${state.token}&id=${item.id}&scheduleName=${item.scheduleName}&scheduleServiceType=${item.scheduleServiceType}&scheduleUserType=${item.scheduleUserType}&schemeCode=${item.schemeCode}&type=scheme`
//   // console.log(url)
//   // window.location.href = url
// };
defineExpose({
  submit,
  buttonDisabled,
  setLimitRef
})
</script>
<style lang="scss">
.content-editApp .limit-form .el-form-item {
  width: 100%;
}

.content-createCustomApp .el-form-item {
  width: 100%;
}

.content-createCustomApp .form-item-inline-2 {
  width: 250px;
}

.content-editApp .form {
  padding-top: 0px;
}

.disabled-form-label .el-form-item__label {
  color: #999;
}

.content-editApp .checkbox-custom-style .info {
  width: 100%;
  height: 100px;
  box-sizing: border-box;
  background-repeat: no-repeat;
  background-size: contain;
  background-position: center center;
}

.content-editApp .checkbox-custom-style .title {
  text-align: center;
  font-size: 12px;
  color: #666;
  line-height: 12px;
  margin-bottom: 5px;
}

.content-editApp .el-checkbox__label {
  // padding-bottom: 8px;
}

.dialog-body-padding-s {
  .el-dialog__body {
    padding-top: 5px;
  }
}

.dialog-style .el-empty {
  padding: 0;
}

.el-table--fit {
  margin-bottom: 0;
}

.component-item {
  .el-checkbox {
    padding: 0;
  }
}

.switch-left {
  position: absolute;
  left: 0;
  top: 0;
}
</style>