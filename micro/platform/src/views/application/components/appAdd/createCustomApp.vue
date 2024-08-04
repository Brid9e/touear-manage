<template lang="pug">
.content-bg.create-custom-app-form(:class="{'is-custom': typeValue === 'custom'}")
  el-form.form(ref='ruleFormRef', label-width='180px',  :rules='rules', :model='form')
    el-form-item(label='名称', prop='appName')
      el-input(v-model='form.appName', placeholder='请输入')
    el-form-item(v-if='!editClouldApp', label='介绍', prop='info')
      el-input(v-model='form.appDesc', type='textarea', :rows='4', placeholder='请输入')
    TerminalCheckBox.form-Create-style(v-model="form.platTypeArr" 
      :loading="false"
      :label-width="180"
      @change="changeForm")
    //- el-form-item(label='终端类型', prop='platTypeArr')
    //-   el-checkbox-group(v-model='form.platTypeArr' @change="changeForm")
    //-     el-checkbox(:label='item.code', v-for='(item, key) in platTypeLevel', :key='key', @change='changePlatItem') {{ item.name }}
    el-form-item.upload-form-item(label='应用图标', prop='img', v-if='form.platTypeArr.length > 0')
      .upload-box
        template(v-for='(item, index) in img', :key='item.code')
          .upload-item(v-if="form.platTypeArr.includes(item.code)")
            p.text-center.title.font-size-14 {{ item.name }}
            .text-center
              el-upload.avatar-uploader(v-model='item.file', action='#', :http-request='item.httpRequest', accept='image/gif,image/jpeg,image/jpg,image/png,image/svg')
                //- i.icon-upload.el-icon-camera-solid.avatar-uploader-icon(v-if="!item.src")
                el-icon(v-if='!item.src', :size='50', color='#999', style='margin-top: 23px')
                  CameraFilled
                el-image.appImg(v-else, :src='item.src', style='width: 80px; height: 80px')
                  template(#error)
                    span.icon-picture-size
                      Picture
            el-row.handle-bar(:gutter='0')
              el-col.text-link(:span='12', @click='openIconLibrary(item.code)') 图标库
              el-col.text-danger.text-right(v-if='item.src', :span='12', @click='deleteIcon(item.code, index)') 删除
        .tip.font-size-12 （建议上传120*120的，1M以内的jpg、png图片）
    template(v-for='(item, key) in url', :key='key')
      el-form-item.form-item-l(v-if='form.platTypeArr.includes(item.code) && url.length > 0 && !editClouldApp', :label='item.name + "地址"', )
        inputUrl(v-if='item.code !== "wechat-mina" && typeValue !== "base"', v-model='item.url', :defaultUrl='item.url')
        el-input(v-else, v-model='item.url', placeholder='请输入页面地址')
        el-input.margin-top-xs(v-if='item.appIdRequired === 1', v-model='item.appId', placeholder='请输入Appid')
        el-input.margin-top-xs(v-if='item.routingParameters === 1 && typeValue === "base"', v-model='item.route', placeholder='请输入路由（route）')
    el-form-item(label='自助终端认证方式', prop='authMethods', v-if='showAuth && authMethodList?.length > 0 && form.platTypeArr.indexOf("selfService") > -1')
      el-checkbox-group(v-model='form.authMethods')
        el-checkbox(:label='item.id', v-for='(item, key) in authMethodList', :key='key') {{ item.name }}
    el-form-item(v-if='!editClouldApp', label='用户类型', prop='userType')
      el-checkbox-group(v-model='form.userType')
        el-checkbox(label='user') 用户
        el-checkbox(label='mercacc') 商户
      //- el-radio-group(v-model="form.userType")
      //-   el-radio(label="user") 用户
      //-   el-radio(label="mercacc") 商户
      //-   el-radio(label="common") 通用
    el-form-item(v-if='!editClouldApp', label='应用类型')
      el-select(v-model='form.appType', placeholder='请选择')
        el-option(v-for='item in typeList', :key='item.bh', :label='item.name', :value='item.bh')
    //- el-button#btnValidate(type='primary', style='display: none', @click='validate(ruleFormRef)')
    //- el-button(type='primary', @click='submit') 提交
  el-dialog(v-model='dialogVisible', :width='600', title='应用图标库')
    el-scrollbar(style='width: 100%; height: 60vh; overflow-y: auto')
      SelectedBaseApp(v-if='dialogVisible', rowNum='6', selectType='radio', :list='list', @change-Img='changelibraryImg')
    template(#footer='')
      span.dialog-footer
        el-button(@click='dialogVisible = false') 取 消
        el-button(type='primary', @click='confirmIcon') 确 定
</template>
<script lang="ts" setup>
import { defineComponent, reactive, toRefs, ref, computed, defineProps, onMounted, pushScopeId, defineEmits } from 'vue'
import { useStore } from 'vuex'
import { key } from '@/store'
import { SystemConfig } from '@/service/platform'
import { PictureRounded } from '@element-plus/icons-vue'
import SelectedBaseApp from '../selectImg.vue'
import SubDialog from '@/components/subDialog.vue'
import inputUrl from '@/components/form/inputUrl.vue'
import { Edit, Picture, CameraFilled } from '@element-plus/icons-vue'
import TerminalCheckBox from '@/components/terminalCheckBox.vue'
import type { ElForm } from 'element-plus'
import { App } from '@/service/platform'
import { getFileFromOnlineImg } from '@/assets/scripts/file'
import { Cloud } from '@/service/cloud'
import { getRequest } from '@/assets/scripts/utils'

const props = defineProps(['info', 'showAuth', 'typeValue', 'editClouldApp', 'hideModal', 'isEdit', 'url', 'img'])
const emit = defineEmits(['changePlatType'])
const editClouldApp = ref(props.editClouldApp)
// const _typeValue = ref(props.typeValue)
type FormInstance = InstanceType<typeof ElForm>
const store: any = useStore(key)
const { state } = store
onMounted(() => {
  // document.getElementById('btnValidate').click()
})
const dialogtext = ref(false)
// 应用类型
getTypeList()
const typeList = ref([])
async function getTypeList() {
  const res = await App.getZappTListAll({ status: 1 })
  if (res && res.data) {
    typeList.value = res.data
  }
}
const changeForm = () => {
  emit('changePlatType',form.platTypeArr)
}
// platType
let platTypeUrl = ref([])
const platTypeArray = store.state.platTypeList
const platTypeLevel = store.state.platTypeLevel
let url: any = ref([])
let img: any = ref([])
const changePlatItem = (value: any, data: any) => {
  // const current = data.target._value
  // const item = platTypeLevel.find((o: any) => {
  //   return o.code === current
  // })
  // console.log('value--------', value,current,img.value)
  // if (value) {
  //   // url
  //   url.value.push(item)
  //   // icon
  //   const obj: any = reactive({
  //     code: item.code,
  //     name: item.name,
  //     src: null,
  //     file: null,
  //     httpRequest: (data: any) => {
  //       obj.src = URL.createObjectURL(data.file)
  //       obj.file = data.file
  //     }
  //   })
  //   img.value.push(obj)
  // } else {
  //   // url
  //   const index = url.value.findIndex((o: any) => {
  //     return o.code === item.code
  //   })
  //   if (index !== -1) {
  //     url.value.splice(index, 1)
  //   }
  //   // icon
  //   const indexIcon = img.value.findIndex((o: any) => {
  //     return o.code === item.code
  //   })
  //   if (indexIcon !== -1){
  //     img.value.splice(indexIcon, 1)
  //   }
  // }
}
// authService
console.log('authMethodList', store.state.frontConfig)
const authMethodList = store.state.frontConfig?.authentication ? JSON.parse(store.state.frontConfig.authentication) : []
// form obj
const form: any = reactive({
  appName: '',
  appDesc: '',
  platType: '',
  platTypeArr: ref([]),
  extraConfig: {
    img: [],
    url: []
  },
  authMethods: [],
  authMethodsStr: '',
  userType: [],
  appType: ''
})
// 升级数据，空值升级为云端数据 url icon installConfig
// const initByClould = async () => {
//   let params = {
//     page: 0,
//     size: 10,
//     appCode: history.value.appCode
//   }
//   const res = await Cloud.getAppList(params)
//   if (res && res.data && res.data.data) {
//     const appClould = res.data.data[0]
//     // url---若有空值，更新为云端的值; ${feeitemid}更新为真实feeitemid
//     let urlCloud:any = []
//     appClould.extraConfig.url.forEach((u:any) => {
//       if (u.children && u.children.length > 0){
//         urlCloud = urlCloud.concat(u.children)
//       } else {
//         urlCloud.push(u)
//       }
//     })
//     urlCloud.forEach((u:any) => {
//       const index = url.value.findIndex((o:any) => {return o.code === u.code})
//       if (index !== -1) {
//         if (!url.value[index].url) {
//           url.value[index].url = u.url
//         }
//       } else {
//         url.value.push(u)
//       }
//     })
//     let feeitemid:any = ''
//     const feeitemidObj =  url.value.find((o:any) => {return o.url ? getRequest(o.url).feeitemid ? feeitemid = getRequest(o.url).feeitemid : false  : false })
//     if (feeitemidObj) {
//       url.value.map((o:any) => {
//         o.url = o.url.replace('${feeitemid}', feeitemid)
//         return o
//       })
//     }
//     // icon---若有空值，更新为云端的值
//     appClould.extraConfig.img.forEach((o:any, index:number) => {
//       const p = platTypeLevel.filter((op:any) => {
//         return op.parentCode === o.code
//       })
//       if (p.length > 0) {
//         appClould.extraConfig.img[index].code = p.map((o:any) => {return o.code})
//       }
//     })
//     img.value.forEach((o:any, index:number) => {
//       console.log('img', o)
//       if(!o.src) {
//         const imgC = appClould.extraConfig.img.find((co:any) => {return co.code.includes(o.code)})
//         if (imgC) {
//           getFileFromOnlineImg(imgC.src, new Date().getTime() + '.png').then((r:any) => {
//             img.value[index].file = r
//             img.value[index].src = imgC.src
//             console.log('imgC-----', img.value[index])
//           })
//         }
//       }
//     })
//     // 当为缴费类型应用，且安装配置不存在，从云顿同步安装配置， 且获取回显值
//     if (feeitemid && !history.value.installConfig) {

//     }
//   }
// }
// history initial value
const history = ref(props.info)
if (history.value && !editClouldApp.value) {
  console.log('history.value---------', props)
  form.appName = history.value.appName
  form.appDesc = history.value.appDesc
  form.appType = history.value.appType ? Number(history.value.appType) : ''
  form.platType = history.value.platType
  form.platTypeArr = history.value.platType ? history.value.platType.split(',') : []
  form.userType = history.value.userType === 'common' ? ['user', 'mercacc'] : [history.value.userType]
  // _typeValue.value = history.value.flagIsSelfApp === '0' ? 'base' : 'custom'
  const platTypeList = platTypeArray.filter((item: any) => {
    return form.platTypeArr.indexOf(item.code) !== -1
  })
  img.value = props.img
  url.value = props.url
  // const historyUrl = history.value.url ? JSON.parse(history.value.url) : []
  // const objIcon: any = history.value.icon ? JSON.parse(history.value.icon) : {}
  // img.value = []
  // platTypeLevel.forEach((item:any) => {
  //   const historyUrlObj = historyUrl.find((o:any) => { return o.code === item.code})
  //   if (historyUrlObj) {
  //     url.value.push(historyUrlObj)
  //   } else {
  //     url.value.push(item)
  //   }
  //   const obj: any = {
  //     code: item.code,
  //     name: item.name,
  //     src: objIcon[item.code] ? objIcon[item.code] : '',
  //     file : null
  //   }
  //   img.value.push(obj)
  // })
  // console.log('url--------', url.value)
  // img.value.map((o: any) => {
  //   o.httpRequest = (data: any) => {
  //     o.src = URL.createObjectURL(data.file)
  //     o.file = data.file
  //   }
  //   return o
  // })
  console.log('history.value.authMethods', history.value.authMethods)
  form.authMethods = history.value.authMethods ? history.value.authMethods.split(',') : []
} else if (editClouldApp.value) {
  // editClouldApp 云端应用编辑
  form.appName = history.value.appName
  form.platType = history.value.platType
  form.platTypeArr = history.value.platType ? history.value.platType.split(',') : []
  console.log('111111--------history.value----------', history.value)
  // const icon: any = {}
  // history.value.extraConfig.img.forEach((o: any) => {
  //   icon[o.code] = o.src
  // })
  img.value = history.value.extraConfig.img
  // console.log(icon)
  // const platTypeList = platTypeArray.filter((item: any) => {
  //   return form.platTypeArr.indexOf(item.code) !== -1
  // })
  // initImg(platTypeList, JSON.stringify(icon))
} else {
  platTypeLevel.forEach((item:any) => {
    url.value.push(item)
    const obj: any = {
      code: item.code,
      name: item.name,
      src:  '',
      file : null
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
}
// deleteIcon
const deleteIcon = (code: string, index: number) => {
  img.value[index].file = ''
  img.value[index].src = ''
}
// rules
const rules = {
  appName: [
    {
      required: true,
      message: '请填写应用名称',
      trigger: 'blur'
    }
  ],
  platTypeArr: [
    {
      type: 'array',
      required: true,
      message: '请选择终端类型',
      trigger: 'change'
    }
  ],
  userType: [
    {
      type: 'array',
      required: true,
      message: '请选择用户类型',
      trigger: 'change'
    }
  ]
}
// validate
const ruleFormRef = ref()
const validateCustomForm = ref(false)
if (history.value) {
  validateCustomForm.value = true
}
const validate = (formEl: FormInstance | undefined) => {
  console.log('formEl-------', formEl)
  if (!formEl) return
  formEl.validate((valid) => {
    console.log('formEl-------valid', valid)
    validateCustomForm.value = valid
  })
}
// 图标库
let dialogVisible = ref(false)
let list = ref<any>(null)
let iconType = ''
const openIconLibrary = async (platType: string) => {
  iconType = platType
  const { data } = await App.getIconLibrary({ platType: platType === 'mobile' ? 'app' : platType, path: '/images/plat/white/appView', fileName: '' })
  list.value = data
  dialogVisible.value = true
}
const currentIcon = ref('')
const changelibraryImg = (data: any) => {
  currentIcon.value = data
}
const confirmIcon = async () => {
  const index = img.value.findIndex((o: any) => {
    return o.code === iconType
  })
  img.value[index].src = currentIcon.value
  img.value[index].file = await getFileFromOnlineImg(currentIcon.value, new Date().getTime() + '.png')
  dialogVisible.value = false
}
const submit = async (callback: any) => {
  // const _document: any = document;
  // _document.getElementById("btnValidate").click();
  return new Promise((resolve: any, reject: any) => {
    ruleFormRef.value.validate((valid: any) => {
      validateCustomForm.value = valid
      if (!editClouldApp.value) {
        if (form.platTypeArr.indexOf('selfService') === -1) {
          form.authMethods = []
        }
        form.platType = form.platTypeArr.join(',')
        form.extraConfig.img = img.value
        form.extraConfig.url = url.value
        form.authMethodsStr = form.authMethods.join(',')
        form.appUserType = form.userType.length > 1 ? 'common' : form.userType[0]
        store.dispatch('AddApplistAction', [form])
        // callback ? callback(validateCustomForm.value) : null
        resolve(validateCustomForm.value)
      } else {
        const obj = {
          valid: validateCustomForm.value,
          data: {
            appName: form.appName,
            platType: form.platTypeArr.join(','),
            img: img.value
          }
        }
        resolve(obj)
        // console.log(1111111, obj)
        // callback ? callback(obj) : null
      }
    })
  })
}
defineExpose({
  submit,
  validateCustomForm
})
</script>
<style lang="scss" scoped>
.content-createCustomApp {
  .margin-top-xs {
    margin-top: 3px;
  }
  .el-form-item__content .el-input-group {
    height: 33px;
  }
  .icons-size-m {
    width: 1.2rem;
    height: 1.2rem;
    transform: translateY(3px);
  }
  .form {
    // padding-top: 60px;
  }
  .el-form-item {
    width: 600px;
  }
  .form-item-l {
    width: 670px;
  }
  .upload-form-item {
    width: 700px;
    .el-form-item__content {
      display: block;
    }
  }
  .el-radio__label {
    font-size: 14px;
  }
  .app-link-content {
    border-radius: 5px;
    overflow: hidden;
    .head {
      padding: 5px 12px;
      background: #f4f5f5;
      line-height: 28px;
    }
    .body {
      padding: 5px 12px;
    }
  }
}
.el-upload-list {
  display: none;
}
.upload-box {
  position: relative;
  .avatar-uploader {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    width: 100px;
    height: 100px;
    line-height: 100px;
    background-color: #fff;
    .avatar-uploader-icon {
      font-size: 28px;
      color: #8c939d;
      width: 100px;
      height: 100px;
      line-height: 100px;
      text-align: center;
    }
    .icon-upload {
      font-size: 50px;
    }
    .el-image .el-image__inner {
      vertical-align: super;
    }
  }
  .upload-item {
    width: 102px;
    display: inline-block;
    background-color: #f4f5f5;
    border-radius: 6px;
    margin-right: 40px;
    .handle-bar {
      background-color: #fff;
    }
  }
  .upload-img svg {
    width: 50px;
    height: 50px;
    color: #ccc;
    line-height: 100px;
  }
  .appImg,
  .pcImg {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
  .appImg {
    width: 80px;
    height: 80px;
  }
  .pcImg {
    width: 80px;
    height: auto;
    max-height: 80px;
  }
  .icon-picture-size {
    svg {
      width: 30px;
      height: 30px;
      transform: translateY(-15px);
      color: #ccc;
    }
  }
}
</style>
