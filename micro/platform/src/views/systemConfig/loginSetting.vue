<template lang="pug">
.login-set(v-if='listAll.length > 0')
  div(v-for='(itemGroup, index) in listAll', :key='index')
    FormBoxItem(v-if="itemGroup.descriptionArr && itemGroup.descriptionArr.length>0" :title='itemGroup.name', :sub='itemGroup.platType.length > 0 ? "*该项设置需针对不同平台进行设置" : "*该项设置对所有平台生效"', )
      template(#button)
        //- span {{ itemGroup.platType }}
        el-select.select-s(v-if='itemGroup.platType.length > 0', v-model='itemGroup.platTypeValue', placeholder='请先选择终端类型', @change='getFormDataArr(itemGroup.platTypeValue, itemGroup.description, index)', style='margin-right: 12px')
          el-option(v-for='item in itemGroup.platType', :key='item.code', :label='item.name', :value='item.code')
        ElButton(v-if='itemGroup.code === "login_type"', type='success', @click='showAdd = true', :disabled='!state.funcButton.loginThirdSetting') 统一身份认证
        ElButton(type='primary', @click='submitItem(itemGroup)', :disabled='!state.funcButton.loginSettingSave') 保存
      div
        //- p {{itemGroup.descriptionArr}}
        formCreateByJson(v-if='itemGroup.descriptionArr', :id='itemGroup.code', :formDataArr='itemGroup.descriptionArr', :ref='itemGroup.code')
  //- FormBoxItem(v-if="isInitLoginType" title='登录方式' sub="*该项设置需针对不同平台进行设置")
  //-   div.login-type-content.text-center
  //-     el-empty(description='未获取到登录方式相关配置，可点击下方按钮，进行同步数据' :image-size="100")
  //-     ElButton.margin-top-2x(type='primary', @click='toSyncLoginType(itemGroup)' :loading="syncLoginTypeLoading") 同步数据
toc
el-dialog(v-model='showAdd', :width='700', title='统一身份认证', custom-class='addLogin-dialog')
  div
    el-tabs.demo-tabs(v-model='activeName', type='card', @tab-click='handleClickTab')
      el-tab-pane(label='已安装', name='edit')
        el-table(v-if='thirdData && thirdData.descriptionArr', :data='thirdData.descriptionArr', :height='350', style='width: 100%; margin-bottom: 20px', row-key='index', border='', :default-expand-all='false')
          el-table-column(prop='label', label='名称')
          el-table-column(prop='value', label='value')
          el-table-column(prop='dataType', label='用途')
            template(#default='scope')
              span() {{scope.row.dataType === 4 ? '其他' : '登录认证' }}
              el-tooltip.box-item(v-if="scope.row.dataType === 4 " effect='dark' content='该认证方式用于其他对接，不用于登录方式，故登录方式项不包含此认证方式' placement='top-start')
                el-icon(style="transform:translateY(2px)", :size="14")
                  warning.text-primary
          el-table-column(label='操作', width='200')
            template(#default='scope')
              el-link.margin-right-2x(:href='null', type='primary', @click='editThird(scope.row, scope.$index)') 编辑
              el-link.margin-right-2x(:href='null', type='danger', @click='deleteThird(scope.row, scope.$index)') 删除
        el-empty(v-else, description='暂无数据')
      el-tab-pane(label='云端商店', name='add')
        el-steps.step(:active='currentStep', align-center='')
          el-step(v-for='(item, indexS) in stepList', :title='item.value', :key='item.indexS', :description='item.description')
        .bg-card
          template(v-if='currentStep === 1')
            div(style="max-height:280px;overflow-y:auto;" v-if="clouldThirdLogin.length > 0")
              el-radio-group.radio-style-line(v-model='addform.login'  )
                div(v-for='(item, index) in clouldThirdLogin', :key='index', style='width: 100%', :image-size="30")
                  el-radio(:label='item.id', :disabled='item.isExist')
                    span {{ item.label }}
                      span(style="color:#666;margin-left:3px;") ({{ item.value }})
                      el-tag.margin-left-5(v-if='item.isExist', type='success') 已安装
              el-pagination.flex-box.flex-center(small='' background='' layout='prev, pager, next',:page-size="clouldThirdPage.size", :current-page="clouldThirdPage.current",  :total='clouldThirdPage.total', @current-change="clouldThirdPage.changePage")
            el-empty.el-empty-thirdlogin(v-else description='未查询到相关数据')
          template(v-if='currentStep === 2')
            formCreateByJson(:formDataArr='currentThirdLogin.childForm', ref='addFromCreatRef')
          template(v-if='currentStep === 3')
            div.text-center
              el-icon.text-success(:size="70")
                SuccessFilled
              p.margin-top-x.font-size-20.margin-bottom-x 添加成功！
              el-divider(border-style='dashed' style="margin:12px 0;")
              div.text-left
                div.third-tip.margin-bottom-x(v-if="thirdFormUrl" style="color:#666;")
                  p {{loginUrl.tipText}}
                    el-button(type='primary', plain, :loading='checkLoading' ,style="margin-left:10px;", @click="toTestAddressConnect") 调试
                  p(v-if="thirdTextRes.getRes" :class="thirdTextRes.res ? 'text-success': 'text-danger'" style="transform:translateY(-5px)")
                    el-icon(:size="20" style="transform:translateY(3px)")
                      DocumentChecked(v-if="thirdTextRes.res")
                      DocumentDelete(v-else)
                    |{{thirdTextRes.res ? "调试通过" : "调试未通过,"+ thirdTextRes.errMsg}}
                div.third-tip
                  p.text-left(style="line-height:24px;color:#666;") {{ loginUrl.tip.replace('$oauth2Url$', loginUrl.oauth2Url).replace('$casCode$', currentThirdLogin.value) }}
                    span.text-primary(style="cursor:pointer;", @click="copyclip(loginUrl.oauth2Url.replace('$casCode$', currentThirdLogin.value))")
                      |点击复制地址
        .text-center.margin-top-3x(style='padding-bottom: 20px')
          el-button(@click='preStep', v-if='currentStep > 1 && currentStep < 3') 上一步
          el-button(type='primary', @click='nextStep', :disabled='stepList[currentStep - 1].disabled()')
            template(v-if="currentStep === 1")  下一步
            template(v-if="currentStep === 2")  确认添加
            template(v-if="currentStep === 3")  完成

  //- template(#footer)
  //-   el-button(@click='preStep',) 取消
el-dialog(v-model='showEdit', :width='600', :title='`编辑“${editItem?.label}(${editItem?.value})”`', custom-class='editLogin-dialog')
  el-steps.step(:active='editCurrentStep', align-center='')
    el-step(v-for='(item, indexS) in editStepList', :title='item.value', :key='item.indexS', :description='item.description')
  .bg-card
    template(v-if='editCurrentStep === 1')
      div(style="margin-top:30px;")
        formCreateByJson(v-if='showEdit', :formDataArr='editItem.childForm', ref='editFromCreatRef')
    template(v-if='editCurrentStep === 2')
      div.text-center
        el-icon.text-success(:size="70")
          SuccessFilled
        p.margin-top-x.font-size-20.margin-bottom-x 编辑成功！
        el-divider(border-style='dashed' style="margin:12px 0;")
        div.text-left
          div.third-tip.margin-bottom-x(v-if="thirdFormUrl" style="color:#666;")
            p {{loginUrl.tipText}}
              el-button(type='primary', plain, :loading='checkLoading' ,style="margin-left:10px;", @click="toTestAddressConnect") 调试
            p(v-if="thirdTextRes.getRes" :class="thirdTextRes.res ? 'text-success': 'text-danger'" style="transform:translateY(-5px)")
              el-icon(:size="20" style="transform:translateY(3px)")
                DocumentChecked(v-if="thirdTextRes.res")
                DocumentDelete(v-else)
              |{{thirdTextRes.res ? "调试通过" : "调试未通过,"+ thirdTextRes.errMsg}}
          div.third-tip
            p.text-left(style="line-height:24px;color:#666;") {{ loginUrl.tip.replace('$oauth2Url$', loginUrl.oauth2Url).replace('$casCode$', editItem.value) }}
              span.text-primary(style="cursor:pointer;", @click="copyclip(loginUrl.oauth2Url.replace('$casCode$', editItem.value))")
                |点击复制地址
  .text-center.margin-top-3x(style='padding-bottom: 20px')
    el-button(type='primary', @click='editNextStep', :disabled='editStepList[editCurrentStep - 1].disabled()')
      template(v-if="editCurrentStep === 1")  确认
      template(v-if="editCurrentStep === 2")  完成
  div
  //- template(#footer)
  //-   el-button(@click='showEdit = false',) 取消
  //-   el-button(type='primary', @click='editSubmit') 确定
</template>
<script lang="ts" setup>
import { defineComponent, reactive, ref, getCurrentInstance } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { SystemConfig } from '@/service/platform'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { key } from '@/store/index'
import FormCreateByJson from '@/components/formCreateByJson/index.vue'
import TableTitle from '@/components/tableTitle.vue'
import FormBox from './configComponents/formBox.vue'
// import toc from './configComponents/toc.vue'
import { FormBoxItem, toc } from './configComponents/index'
import { nextTick } from 'vue'
import { Cloud } from '@/service/cloud'
import SubDialog from '@/components/subDialog.vue'
import { Local } from '@/service/local'
import { isObject, join, uniq } from 'lodash'
import { system } from '@/service/manage/index'
import { SuccessFilled, CopyDocument, DocumentChecked, DocumentDelete, Warning} from '@element-plus/icons-vue'
import { copyclip } from '@/assets/scripts/utils'
const instance: any = getCurrentInstance()
const store = useStore(key)
const { state } = store
const config = JSON.parse(localStorage.getItem('configsManage') as string)
const platTypeList = store.state.platTypeLevel
const platType = platTypeList.map((o: any) => {
  return o.code
})
let loginUrl: any = ref()
const getThirdLoginUrl = async () => {
  const res = await Local.thirdLoginUrl()
  if (res.data) {
    loginUrl.value = res.data
    loginUrl.value.oauth2Url = loginUrl.value.oauth2Url.replace('$synjones_address$', config.base)
  }
}
// 上传图片
getThirdLoginUrl()
const uploadImg = (file: any, path: string) => {
  return new Promise((resolve, reject) => {
    const formData = new FormData()
    formData.append('bucketName', 'public')
    formData.append('file', file)
    formData.append('path', path)
    system.uploadFileByPath(formData).then((r: any) => {
      if (r.code === 200) {
        resolve(r.data)
      } else {
        reject()
      }
    })
  })
}
// 保存
const submitItem = async (item: any) => {
  let node = instance.refs[item.code]
  if (!node) return
  const nodeRef = await node[0].submitForm(item.code === 'login_type')
  if (!nodeRef.validateRes) {
    ElMessage({
      showClose: true,
      message: '请填写完整',
      type: 'error'
    })
    return
  }
  const form = nodeRef.installConfigSubmit
  const objForm = ['login_action']
  let data = objForm.includes(item.code) ? form : form[item.code]
  // 特殊处理code
  let paramThirdValue: any = thirdData.value && thirdData.value.value ? JSON.parse(thirdData.value.value) : {}
  let paramThirdDescription: any = thirdData.value ? thirdData.value.descriptionArr : []
  if (item.code === 'login_type') {
    if (form[item.code].length > 0) {
      const arrT: any = []
      for (let index in form[item.code]) {
        let lt = form[item.code][index]
        if (!lt['value']) {
          const loginType = listAll.value.find((o: any) => { return o.code === 'login_type' })
          const op = loginType.descriptionArr[0].options.find((o: any) => { return o.value === lt })
          lt = {
            value: { allInfo: op.allInfo }
          }
        } else if (lt['childForm'] && !lt['value'].isThird) {
          Object.keys(lt['childForm']).forEach((keyC: any) => {
            lt['value']['allInfo'][keyC] = lt['childForm'][keyC]
          })
        } else if (lt['value'].isThird) {
          const thirtItem = paramThirdValue[lt.value.value] ? JSON.parse(paramThirdValue[lt.value.value]) : {}
          lt['value']['allInfo'].id = lt.value.value
          lt['value']['allInfo'].key = 'sso'
          lt['value']['allInfo'].icon = thirtItem.icon
          lt['value']['allInfo'].isThird = true
          lt['value']['allInfo'].title = lt.value.label
          lt['value']['allInfo'].url = lt.value.allInfo.url ? lt.value.allInfo.url : loginUrl.value.casUrl.replace('$casCode$', lt.value.value) + loginUrl.value.params[item.platTypeValue]
        }
        arrT.push(lt['value']['allInfo'])
      }
      data = arrT
    }
  } else if (item.code === 'password_rule') {
    const str = form.composition.join('/')
    data = str + '/' + 'leng_' + form.minLength + '-' + form.mixLength
  } else if (item.code === 'login_limit') {
    console.log('login_limit')
    const obj = {}
    Object.keys(form).forEach((keyl: any) => {
      if (Object.prototype.toString.call(form[keyl]) === '[object Object]' && form[keyl].childForm) {
        data = Object.assign({}, form, form[keyl].childForm)
        data[keyl] = data[keyl]['value']['value']
      }
    })
  } else if (item.code === 'login_from_limit') {
    data = data?.join(',') || ''
  }
  const key: any = item.platTypeValue ? item.code + '.' + item.platTypeValue : item.code
  const params: any = {
    [key]: isObject(data) ? JSON.stringify(data) : data
  }
  if (!item.platTypeValue) {
    params[`${item.code}$#$description`] = JSON.stringify(nodeRef.installConfig)
  }
  // if (item.code === "login_type" && paramThirdValue && paramThirdDescription) {
  //   params[`third`] = JSON.stringify(paramThirdValue);
  //   params["third$#$description"] = JSON.stringify(paramThirdDescription);
  // }
  SystemConfig.editSysconfigsManage(params).then((res: any) => {
    if (res.code === 200) {
      if (item.code === 'login_type' && listAll.value[loginIndex.value].value) {
        const value = JSON.parse(listAll.value[loginIndex.value].value)
        value[item.platTypeValue] = JSON.stringify(data)
        listAll.value[loginIndex.value].value = JSON.stringify(value)
      }
      ElMessage({
        showClose: true,
        message: '提交成功',
        type: 'success'
      })
    } else {
      ElMessage({
        showClose: true,
        message: res.msg,
        type: 'error'
      })
    }
  })
}
const transJson = (key: string, data: any) => {
  const arr: any = []
  Object.keys(data).forEach((o: any) => {
    const obj = {
      type: 'input',
      field: o,
      title: o,
      value: data[o]
    }
    arr.push(obj)
  })
  const res = {
    allInfo: {
      key: key,
      name: key
    },
    childForm: arr,
    isThird: true,
    label: key,
    value: key
  }
  return res
}
// 终端类型切换
const getFormDataArr = async (value: string, listStr: string, index?: number) => {
  let list: any = JSON.parse(listStr)
  if (value) {
    list = list.filter((o: any) => {
      return o.platType.indexOf(value) > -1
    })
    if (index || index === 0) {
      // listAll.value[index].descriptionArr = null
      // await nextTick()
      listAll.value[index].descriptionArr = list
      if (listAll.value[index].code === 'login_type') {
        if (thirdData.value && thirdData.value.description) {
          listAll.value[index].descriptionArr[0].options = listAll.value[index].descriptionArr[0].options.concat(descriptionArrNoChild)
        }
      }
      listAll.value[index].descriptionArr = setHistoryValue(listAll.value[index])
    }
  }

  return list
}
// 获取登录配置list
let listAll: any = ref([])
let thirdData: any = ref(null) // 统一身份认证
let thirdCodes: any = ref([]) // 统一身份认证code
let loginIndex: any = ref()
let descriptionArrNoChild: any = []
const getList = async () => {
  listAll.value = []
  let { data } = await SystemConfig.getConfigByType('login')
  if (data.findIndex((o: any) => { return o.code === 'login_type' }) === -1) {
    toSyncLoginType()
    return
  }
  let arrData: any = []
  data.forEach((o: any) => {
    if (o.code === 'third') {
      thirdData.value = o
    } else {
      arrData.push(o)
    }
  })
  if (thirdData.value) {
    // 本地已安装的统一身份认证
    const value = JSON.parse(thirdData.value.value)
    const description = thirdData.value.description ? JSON.parse(thirdData.value.description) : []
    thirdCodes.value = Object.getOwnPropertyNames(JSON.parse(thirdData.value.value))
    thirdData.value.descriptionArr = []
    Object.keys(value).forEach((o: any) => {
      const item = description?.find((od: any) => {
        return od.value === o
      })
      if (item) {
        thirdData.value.descriptionArr.push(item) // 107安装的
      } else {
        thirdData.value.descriptionArr.push(transJson(o, JSON.parse(value[o]))) //升级数据，为不标准的json
      }
    })
    thirdData.value.description = JSON.stringify(thirdData.value.descriptionArr)
    console.log(222222222, 'thirdData.value.descriptionArr', thirdData.value.descriptionArr)
  }
  for (var i in arrData) {
    const element = arrData[i]
    const arr = element.description ? JSON.parse(element.description) : []
    element.platType = []
    arr.forEach((el: any) => {
      if (el.platType) {
        element.platType = element.platType.concat(
          platTypeList.filter((o: any) => {
            return el.platType.indexOf(o.code) > -1
          })
        )
      }
    })
    element.platType = uniq(element.platType) // 终端类型去重
    if (element.platType.length > 0) {
      element.platTypeValue = element.platType[0].code
      element.descriptionArr = await getFormDataArr(element.platTypeValue, element.description)
      if (element.code === 'login_type') {
        if (thirdData.value) {
          // push 统一身份认证option
          descriptionArrNoChild = JSON.parse(JSON.stringify(thirdData.value.descriptionArr))
          descriptionArrNoChild = descriptionArrNoChild.map((o: any) => {
            delete o.childForm
            return o
          })
          console.log(123, 'descriptionArrNoChild', descriptionArrNoChild)
          descriptionArrNoChild = descriptionArrNoChild.filter((o: any) => { return !o.dataType || o.dataType === 3 })
          if (thirdData.value.description) {
            element.descriptionArr[0].options = element.descriptionArr[0].options.concat(descriptionArrNoChild)
          }
        }
        loginIndex.value = Number(i)
      }
      element.descriptionArr = setHistoryValue(element)
    } else {
      element.descriptionArr = arr
    }
    listAll.value.push(element)
  }
  getThirdLogin()
}
getList()
// 本地统一身份认证登录方式
// const toGetConfigByCode = async () => {
//   let { data } = await SystemConfig.getConfigByCode({code:'login_type'})
// }
// toGetConfigByCode()
// 同步登录方式
const toSyncLoginType = async () => {
  ElMessageBox.confirm('未获取到登录方式相关配置，请点击确认进行同步数据。', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    showCancelButton: false,
    showClose: false,
    closeOnClickModal: false,
    closeOnPressEscape: false,
    type: 'error',
    beforeClose: async (action: string, instance: any, done: () => void) => {
      let res: any = await SystemConfig.syncLoginType()
      if (res.code === 200 && res.success) {
        ElMessage({
          showClose: true,
          message: '同步成功',
          type: 'success'
        })
        getList()
        done()
      } else {
        ElMessage({
          showClose: true,
          message: '同步失败',
          type: 'error'
        })
      }
    }
  })
}
// 获取云端统一身份认证
const clouldThirdPage = reactive({
  total: 0,
  size: 5,
  current: 1,
  changePage: (val: any) => {
    clouldThirdPage.current = val
    getThirdLogin()
  }
})
async function getThirdLogin() {
  const params = {
    page: clouldThirdPage.current - 1,
    size: clouldThirdPage.size,
    dataTypes: '3,4'  //数据类型 0：支付类型；1：厂商；3：统一身份认证（勾选）；4：统一身份认证（不可勾选）
  }
  const res = await Cloud.getPayListPage(params)
  if (res.data) {
    clouldThirdPage.total = res.data.totalSize
    clouldThirdLogin.value = res.data.data.map((o: any) => {
      o.value = o.value.split(':')[0]
      o.isExist = thirdCodes.value.includes(o.value)
      return o
    })
  } else {
    ElMessage({
      showClose: true,
      message: res.msg,
      type: 'warning'
    })
  }
}
// 统一身份认证----添加
const activeName = ref('edit')
const handleClickTab = (tab: any, event: Event) => {
  if (activeName.value === 'add') {
    currentStep.value = 1
    stepList.value[0].description = ''
  }
}
const currentStep = ref(1)
const showAdd = ref(false)
const addform = reactive({
  login: ''
})
let currentThirdLogin = ref()
const clouldThirdLogin: any = ref([])
const editCurrentStep = ref(1)
const stepList = ref([
  {
    step: 1,
    value: '选择统一身份',
    description: '',
    disabled: () => {
      let flag = true
      if (addform.login) {
        flag = false
      }
      return flag
    }
  },
  {
    step: 2,
    value: '填写配置',
    description: '',
    disabled: () => {
      return false
    }
  },
  {
    step: 3,
    value: '完成',
    description: '',
    disabled: () => {
      return false
    }
  }
])
const editStepList = ref([
  {
    step: 1,
    value: '填写配置',
    description: '',
    disabled: () => {
      return false
    }
  },
  {
    step: 2,
    value: '完成',
    description: '',
    disabled: () => {
      return false
    }
  }
])
const nameForm = { type: 'input', field: 'name', title: '名称', value: '', info: '', validate: { required: false } }
const nextStep = () => {
  if (currentStep.value === 1) {
    thirdTextRes.getRes = false
    currentStep.value++
    currentThirdLogin.value = clouldThirdLogin.value.find((o: any) => {
      return o.id === addform.login
    })
    // currentThirdLogin.value.childForm = currentThirdLogin.value.childForm.concat(others)
    const nameObj = currentThirdLogin.value.childForm.find((o: any) => { return o.field === 'name' })
    if (!nameObj) {
      nameForm.value = currentThirdLogin.value.label
      currentThirdLogin.value.childForm.push(nameForm)
    }
    stepList.value[0].description = currentThirdLogin.value.label + `(${currentThirdLogin.value.value})`
  } else if (currentStep.value === 2) {
    submitAdd()
  } else if (currentStep.value === 3) {
    currentStep.value = 1
    activeName.value = 'edit'
  }
}
const preStep = () => {
  currentStep.value--
}
const editNextStep = () => {
  if (editCurrentStep.value === 1) {
    thirdTextRes.getRes = false
    editSubmit()
  } else if (editCurrentStep.value === 2) {
    editCurrentStep.value = 1
    showEdit.value = false
  }
}
const addFromCreatRef: any = ref()
const checkLoading = ref(false)
let thirdFormUrl = ref()
const thirdTextRes: any = reactive({ getRes: false })
// 测试统一身份认证
const toTestAddressConnect = async () => {
  thirdTextRes.getRes = false
  const params = {
    address: thirdFormUrl.value
  }
  checkLoading.value = true
  const res = await SystemConfig.testAddressConnect(params).catch((e: any) => {
    checkLoading.value = false
    thirdTextRes.getRes = true
    thirdTextRes.res = false
    thirdTextRes.errMsg = e.data.msg
  })
  if (res?.code === 200) {
    checkLoading.value = false
    thirdTextRes.getRes = true
    thirdTextRes.res = true
  }
}
// 统一身份认证---添加
const submitAdd = async () => {
  const nodeRef = await addFromCreatRef.value.submitForm()
  const key = currentThirdLogin.value.value
  if (!nodeRef.validateRes) {
    ElMessage({
      showClose: true,
      message: '请填写完整',
      type: 'error'
    })
    return
  }
  thirdFormUrl.value = nodeRef.installConfigSubmit.url
  const installConfig = nodeRef.installConfig
  let thirdOption = {
    isThird: true,
    dataType: currentThirdLogin.value.dataType || 3,
    allInfo: {
      key: key,
      name: nodeRef.installConfigSubmit.name || currentThirdLogin.value.label
    },
    childForm: installConfig,
    label: nodeRef.installConfigSubmit.name || currentThirdLogin.value.label,
    value: key
  }
  thirdOption = JSON.parse(JSON.stringify(thirdOption))
  const description = JSON.parse(JSON.stringify((thirdData.value ? thirdData.value.descriptionArr : []).concat([thirdOption])))
  const params = {
    // 'third.ruijie': '',
    // 'third$#$description': ''
    [`third.${key}`]: JSON.stringify(nodeRef.installConfigSubmit),
    'third$#$description': JSON.stringify(description)
  }
  const res = await SystemConfig.editSysconfigsManage(params)
  if (res.code === 200) {
    getList()
    addform.login = ''
    stepList.value[0].description = nodeRef.installConfigSubmit.name || currentThirdLogin.value.label + `(${currentThirdLogin.value.value})`
    currentStep.value++
    ElMessage({
      showClose: true,
      message: '添加成功',
      type: 'success'
    })
  } else {
    ElMessage({
      showClose: true,
      message: res.msg,
      type: 'error'
    })
  }
}
// 统一身份认证---删除
const deleteThird = async (data: any, index: number) => {
  ElMessageBox.confirm(`确定删除“${data.label}(${data.value})”？`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    const valueData = JSON.parse(thirdData.value.value)
    delete valueData[data.value]
    let description = thirdData.value.descriptionArr
    description = description.filter((o: any) => {
      return o.value !== data.value
    })
    const params: any = {
      third: JSON.stringify(valueData),
      'third$#$description': JSON.stringify(description)
    }
    if (listAll.value[loginIndex.value].value && JSON.parse(listAll.value[loginIndex.value].value)[listAll.value[loginIndex.value].platTypeValue]) {
      let loginValue = JSON.parse(JSON.parse(listAll.value[loginIndex.value].value)[listAll.value[loginIndex.value].platTypeValue])
      loginValue = loginValue.filter((o: any) => {
        return o.id !== data.value
      })
      params[`login_type.${listAll.value[loginIndex.value].platTypeValue}`] = JSON.stringify(loginValue)
    }
    const res = await SystemConfig.editSysconfigsManage(params)
    if (res.code === 200) {
      getList()
      ElMessage({
        showClose: true,
        message: '删除成功',
        type: 'success'
      })
    } else {
      ElMessage({
        showClose: true,
        message: res.msg,
        type: 'error'
      })
    }
  }).catch(() => { })
}
// 统一身份认证---编辑
const showEdit = ref(false)
const editItem = ref()
const editFromCreatRef = ref()
const editThird = (data: any, index: number) => {
  editCurrentStep.value = 1
  showEdit.value = true
  editItem.value = data
  editItem.value.childForm.forEach((o: any, index: number) => {
    if (o.field === 'name') {
      editItem.value.childForm[index].value = editItem.value.label
    }
  })
}
const editSubmit = async () => {
  const nodeRef = await editFromCreatRef.value.submitForm()
  if (!nodeRef.validateRes) {
    ElMessage({
      showClose: true,
      message: '请填写完整',
      type: 'error'
    })
    return
  }
  const installConfig = nodeRef.installConfig
  // const installConfigIndex = installConfig.findIndex((o: any) => {
  //   return o.field === 'logo'
  // })
  // nodeRef.installConfigSubmit.icon = installConfig[installConfigIndex].value
  // if (installConfig[installConfigIndex].file) {
  //   const imgRes = await uploadImg(installConfig[installConfigIndex].file, `/login/logo-${editItem.value.value}.png`)
  //   installConfig[installConfigIndex].value = imgRes + '?=' + new Date().getTime()
  //   installConfig[installConfigIndex].file = ''
  //   nodeRef.installConfigSubmit.icon = installConfig[installConfigIndex].value
  // }
  let description = JSON.parse(thirdData.value.description)
  description = description.map((o: any) => {
    if (o.value === editItem.value.value) {
      o.childForm = installConfig
      o.label = nodeRef.installConfigSubmit.name || o.label
      o.allInfo.name = nodeRef.installConfigSubmit.name || o.label
    }
    return o
  })
  // checkOptions = checkOptions[listAll.value[loginIndex.value].platTypeValue] ? JSON.parse(checkOptions[listAll.value[loginIndex.value].platTypeValue]) : []
  // const isExistInCheck = checkOptions.findIndex((o: any) => {
  //   return o.id === editItem.value.value
  // })
  const params = {
    [`third.${editItem.value.value}`]: JSON.stringify(nodeRef.installConfigSubmit),
    'third$#$description': JSON.stringify(description)
  }
  // 修改login 的value值
  let checkOptions = listAll.value[loginIndex.value].value ? JSON.parse(listAll.value[loginIndex.value].value) : {}
  Object.keys(checkOptions).forEach((key: any) => {
    const item = checkOptions[key] ? JSON.parse(checkOptions[key]) : ''
    const index = item.findIndex((o: any) => { return o.id === editItem.value.value })
    if (index !== -1 && editItem.value) {
      item[index].name = nodeRef.installConfigSubmit.name
      item[index].title = nodeRef.installConfigSubmit.name
      params[listAll.value[loginIndex.value].code + '.' + key] = JSON.stringify(item)
    }
  })
  const res = await SystemConfig.editSysconfigsManage(params, 'messageBox')
  if (res.code === 200) {
    thirdFormUrl.value = nodeRef.installConfigSubmit.url
    getList()
    editCurrentStep.value = 2
    ElMessage({
      showClose: true,
      message: '编辑成功',
      type: 'success'
    })
  }
}

// 终端类型的回显
function setHistoryValue(element: any) {
  const value: any = JSON.parse(element.value)
  const item = element.descriptionArr
  let itemValue: any = null
  try {
    itemValue = element.platTypeValue ? JSON.parse(value[element.platTypeValue]) : value
  } catch (e) {
    itemValue = element.platTypeValue ? value[element.platTypeValue] : value
  }
  if (item[0].field === 'login_type') {
    item[0].options.forEach((o: any) => {
      if (o.childForm) {
        o.childForm.forEach((c: any) => {
          if (o.allInfo && o.allInfo[c.field] !== undefined) {
            c.value = o.allInfo[c.field]
          }
        })
      }
    })
    if (itemValue) {
      item[0].value = itemValue.map((o: any) => {
        return o.id
      })
      item[0].selectedNodes = []
      itemValue.forEach((o: any) => {
        item[0].options.forEach((of: any) => {
          if (of.value === o.id) {
            if (of.childForm) {
              if (!o.isThird) {
                of.childForm.forEach((cf: any) => {
                  // cf.value = o[cf.field]
                  if (o[cf.field] !== undefined) {
                    cf.value = o[cf.field]
                  } else if (of.allInfo[cf.field] !== undefined) {
                    cf.value = of.allInfo[cf.field]
                  }
                  of.allInfo[cf.field] = o[cf.field]
                })
              }
              item[0].hasGangedPanel = true
              item[0].selectedNodes.push({ data: of })
            } else if (o.isThird) {
              of.allInfo.url = o.url
            }
          }
        })
      })
      // item[0].itemTabValue = item[0].value[0]
      if (item[0].selectedNodes.length > 0) {
        item[0].itemTabValue = item[0].selectedNodes[0].data.value
      }
    }
  } else if (Object.prototype.toString.call(itemValue) === '[object Object]') {
    item.forEach((og: any) => {
      og.value = itemValue[og.field]
    })
  } else {
    item[0].value = itemValue
  }
  return item
}
</script>
<style lang="scss">
// .login-set-tab .el-tabs__header {
//   .el-tabs__item {
//     background-color: var(--el-fill-color-light);
//   }
//   .el-tabs__item.is-active {
//     background-color: #fff;
//   }
// }
.margin-left-5 {
  margin-left: 5px;
}

.addLogin-dialog {
  .bg-card {
    // background-color: rgb(247, 247, 247);
    // margin-top: 20px;
    // border-radius: 6px;
    // padding: 5px 20px;
    // max-height: 250px;
    // overflow-y: auto;
  }

  .el-steps {
    margin-bottom: 20px;
  }

  .el-step.is-center .el-step__description {
    color: #67c23a;
  }

  .el-step__title {
    font-size: 14px;
  }

  .radio-style-line {
    width: 95%;

    .el-radio {
      display: block;
      height: 35px;
      line-height: 35px;
      width: 100%;
      border: 1px solid rgb(225, 225, 225);
      margin-bottom: 8px;
    }

    .el-radio__input .el-radio__inner {
      // background-color: #fff;
      border-radius: 0;
    }

    .el-radio__inner::after {
      content: '\2713';
      color: #fff;
      font-size: 12px;
      text-align: center;
      line-height: 100%;
      background-color: transparent;
      width: 100%;
      box-sizing: border-box;
      height: 100%;
      border-radius: 0;
    }

    .el-radio__input {
      position: absolute;
      right: 10px;
      top: 50%;
      transform: translateY(-50%);
    }
  }

  .el-dialog__body {
    padding: 0 20px;
    padding-top: 10px;
  }
}

.select-s {
  width: 120px;
}

.upload-box .avatar-uploader .el-image .el-image__inner {
  vertical-align: super;
}

.el-empty-thirdlogin {
  padding-top: 0;
  padding-bottom: 0;
}

.third-tip {
  padding-left: 10px;
  position: relative;
}

.third-tip:before {
  content: '*';
  color: red;
  position: absolute;
  left: 0;
  top: 3px;

}

.login-type-content {
  .el-empty {
    padding: 0;
  }
}
</style>
