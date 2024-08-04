<template lang="pug">
#offineCodeCheck()
  //- p {{platList}} 
  el-form(ref="ruleFormRef", label-width="140px" :rules="rules" :model="form")
    el-form-item(label="脱机码依赖平台", prop="offlineCodePlat")
      el-radio-group(v-model="form.offlineCodePlat")
        template(v-for="item in platList")
          el-radio(v-if="item.status" :label="item.value", name="type") {{ item.label }}
    el-form-item(label="卡账户", prop="account")
      el-input(v-model="form.account")
    el-form-item(label="卡账户密码", prop="pwd" )
      el-input(v-model="form.pwd" type="password")
  div(v-if="checkStatus === 1" v-loading="true" style="margin-top: 50px; height: 30px;" element-loading-text="检测中，请稍候...")  
  el-descriptions(v-else-if="checkStatus === 2" class="margin-top-3x" title="检测结果" border :column="2")
    template(#extra)
      SuccessFilled.text-success(v-if="result.retcode === '0'" style="width: 30px; height: 32px;")
      CircleCloseFilled.text-danger(v-else style="width: 32px; height: 32px;")
        //- CircleCloseFilled(style="width: 30px; height: 30px;")
      //- <el-button type="primary">Operation</el-button>
    //- template(#title)
    //-   span 检测结果

    el-descriptions-item(label="账号")
      div {{result.account}}
    el-descriptions-item(v-if="result.retcode" label="状态码")
      div {{result.retcode}}
    el-descriptions-item(label="信息")
      div {{result.errmsg}}

  //- p platList{{platList}}
  //- formCreateByJson(v-if="offlineCodeForm" ref="offlineCodeRef" id="offline_code" :showTitle="false" :isListen="true" 
    :formDataArr="offlineCodeForm" :backfillingPayData="offlineCodeValue" @change="getOffineCodeData")
  //- formCreateByJson(v-if="platTypeForm" ref="payTypeRef" :id="offineCodeData?.offlineCodePlat" :formDataArr="platTypeForm" :showTitle="false" :backfillingPayData="platTypeValue")

  //- toc
</template>

<script lang="ts" setup>
import { reactive, ref, toRefs, onMounted, onActivated, computed, watch } from 'vue'
// import formCreateByJson from '@/components/formCreateByJson/index.vue'
import { SystemConfig } from '@/service/platform'
import {
  CircleCloseFilled,
  SuccessFilled,
} from '@element-plus/icons-vue';
// import { ElMessage, ElMessageBox } from 'element-plus'
// import { useStore } from 'vuex'
// import { key } from '@/store'
// import { isEmpty } from 'lodash'
// import type { UploadProps, UploadUserFile } from 'element-plus'
const props = defineProps(['data'])
const emits = defineEmits(['change'])
const platList: any = ref(props?.data.platList)
const form: any = ref({})
const ruleFormRef: any = ref(null)
const rules = {
	offlineCodePlat: [{ required: true, message: '请选择脱机码依赖平台', trigger: 'blur' }],
	account: [{ required: true, message: '请输入卡账户', trigger: 'blur' }],
	pwd: [{ required: true, message: '请输入卡账户密码', trigger: 'blur' }],
}
const result = computed(()=> {
  return props?.data.reuslt
  // return {
  //   account: '3441',
  //   retcode: '0',
  //   errmsg: '操作成功'
  // }
})
const checkStatus = computed(()=> {
  return props?.data.checkStatus
})
onMounted(() => {
  // getThirdConfig()
  // getOfflienConfigData()
})
onActivated(() => {
  // getThirdConfig()
})
watch(() => checkStatus.value, (newVal, oldVal) => {
  if (newVal === 0) {
    form.value = {}
  }
})
watch(() => form.value, (newVal, oldVal) => {
  // if (Object.keys(newVal).length > 0) emits('change', newVal)
})
const submit = (callback: any) => {
  ruleFormRef.value.validate((valid: any) => {
    callback({valid, form: form.value})
  })
}

// const RefGroup: any = reactive({
//   ykt_api_config: ref(),
//   ecard_type: ref(),
//   ecard_front_config: ref()
// })

// const { state } = useStore(key)
// const configData = ref([])
// const itemRefs: any = {}
// const setItemRef = (el: any, code: string) => {
//   if (el) itemRefs[code] = el
// }
// const offlineCodeRef: any = ref(null)
// const payTypeRef: any = ref(null)
// const loading: any = ref(false)
// const offlineCodeForm: any = ref()
// const offlineCodeValue: any = ref()
// // const offlineCodeForm: any = ref()
// // const offlineCodeValue: any = ref()
// // 编辑数据
// const offineCodeData: any = ref()
// const platTypeData: any = ref()

// const platTypeFormAll: any = ref()
// const platTypeValue: any = ref()
// const platTypeForm = computed(() => {
//   const form = platTypeFormAll.value?.[offineCodeData.value?.offlineCodePlat]
//   // platTypeFormAll.value?.[offlineCodeValue.value?.offlineCodePlat]
//   console.log('123', form)
//   if (form) {
//     form.forEach((element: any) => {
//       console.log('element', element)
//       if (element.type === 'upload') {
//         // platTypeValue.value[element.filed]
//         const value = platTypeValue.value[element.field]
//         if(value) {
//           const arr = []
//           const valueArr = value.split(',')
//           console.log('valueArr', valueArr)
//           valueArr.forEach((item: any) => {
//             const itemArr = item.split('/')
//             const obj = {
//               name: itemArr[itemArr.length - 1],
//               url: item
//             }
//             arr.push(obj)
//           })
//           element.fileList = arr
//         } else {
//           element.fileList = []
//         }
//         console.log('value', element.field, platTypeValue.value[element.field])
//       }
//     })
//   }
//   return form
// })
// watch(() => offineCodeData.value?.offlineCodePlat, (newVal, oldVal) => { 
//   // emit("change", newVal)
//   // payTypeRef.value = null
//   console.log('offineCodeData', newVal)
//   // }
// }, {
//   // immediate: true,
//   deep: true
// })
// const fileList: any = ref<UploadUserFile[]>([
//   {
//     name: 'element-plus-logo.svg',
//     url: 'https://element-plus.org/images/element-plus-logo.svg',
//   },
//   {
//     name: 'element-plus-logo2.svg',
//     url: 'https://element-plus.org/images/element-plus-logo.svg',
//   }
// ])
// const file: any = ref({
// 	httpRequest: (data: any) => {
// 		console.log("httpRequest", data)
// 		console.log("fileList", fileList.value)
// 		// imageFile.value.src = URL.createObjectURL(data.file)
// 		// imageFile.value.file = data.file
// 		// form.value.images = data.file
// 		// form.value.imagesSrc = imageFile.value.src
// 		// uploadFileBackground(data.file)
// 	}
// })
// const httpRequest: UploadProps['httpRequest'] = (options) => {

// }
// const handleRemove: UploadProps['onRemove'] = (file, uploadFiles) => {
//   console.log(file, uploadFiles)
// }

// const handlePreview: UploadProps['onPreview'] = (uploadFile) => {
//   console.log(uploadFile)
// }

// const handleExceed: UploadProps['onExceed'] = (files, uploadFiles) => {
//   ElMessage.warning(
//     `The limit is 3, you selected ${files.length} files this time, add up to ${
//       files.length + uploadFiles.length
//     } totally`
//   )
// }

// const beforeRemove: UploadProps['beforeRemove'] = (uploadFile, uploadFiles) => {
//   return ElMessageBox.confirm(
//     `Cancel the transfer of ${uploadFile.name} ?`
//   ).then(
//     () => true,
//     () => false
//   )
// }


// const handleInitData = (data: any, value: any) => {
//   let _description
//   let _value
//   let index = 0
//   try {
//     _description = JSON.parse(data)
//     _value = JSON.parse(value)
//   } catch {
//     _description = data
//     _value = value
//   }
//   const t = (v: any, _value: any) => {
//     try {
//       v.value = _value[index][v.field] || v.value
//     } catch {
//       v.value = _value[v.field] || v.value
//     }
//   }
//   // console.log(_description, _value)
//   if (!isEmpty(_description)) {
//     for (let val of _description) {
//       console.log('123', val)
//       val.value = _value[val.field]
//       // if (val.groupFormJson) {
//       //   for (let v of val.groupFormJson) t(v, _value)
//       //   if (typeof val.field === 'number') {
//       //     index++
//       //   } else {
//       //     handleInitData(val.groupFormJson, _value)
//       //   }
//       // }
//     }
//   }
//   console.log({ description: _description, value: _value })
//   return _description
// }
// // 获取脱机码参数配置
// const getOfflienConfigData = async () => {
//   loading.value = true
//   const { data: res, msg, code }: any = await SystemConfig.getOfflienConfig()
//   if (code === 200) {
//     console.log(res)
//     if (!res || Object.keys(res).length === 0) {
//       syncOfflienCodeConfigData()
//     } else {
//       loading.value = false
//       offlineCodeValue.value = res.offlineCodeValue
//       offlineCodeForm.value = JSON.parse(res.offlineCodeForm)
//       platTypeFormAll.value = JSON.parse(res.platTypeForm)
//       platTypeValue.value = res.platTypeValue
//       // platTypeValue.value = res.platTypeValue
//       // offlineCodeValue.value = {
//       //   openOfflienCode: res.openOfflienCode,
//       //   userOfflienSwitch: res.userOfflienSwitch,
//       //   offlineCodePlat: res.offlineCodePlat,
//       //   status: res.status
//       // }
//       // const platTypeValue = {
//       //   tsmUrl: res.tsmUrl,
//       //   paymentplatUrl: res.paymentplatUrl,
//       //   schoolcode: res.schoolcode,
//       //   mediumUrl: res.mediumUrl,
//       //   appId: res.appId,
//       //   tsmFiles: res.tsmFiles,
//       //   paymentFiles: res.paymentFiles,
//       // }
//       // if (res.offlineCodeForm) {
//       //   offlineCodeForm.value = handleInitData(JSON.parse(res.offlineCodeForm), offlineCodeValue.value)
//       // }
//     }
//   } else {
//     loading.value = false
//   }
// }
// // 初始化脱机码参数配置
// const syncOfflienCodeConfigData = async () => {
//   const { data: res, msg, code }: any = await SystemConfig.syncOfflienCodeConfig()
//   if (code === 200) {
//     getOfflienConfigData()
//     // for (let val of res) {
//     //   // let newData = handleInitData(val.description, val.value)
//     //   // val.description = newData.description
//     //   // val.value = newData.value
//     // }
//     // configData.value = res
//   } else {
//     //
//   }
// }
// // 编辑脱机码参数
// const editOfflienCodeData = async (params: any, callback) => {
  
//   try {
//     const { code, msg } = await SystemConfig.editOfflienCode(params)
//     // loading.value = false
//     if (code === 200) {
//       ElMessage({
//         showClose: true,
//         message: '保存成功',
//         type: 'success'
//       })
//       // if (params.offlineCodeValue.status === '2') getOfflienConfigData()
//     } else {
//       ElMessage({
//         showClose: true,
//         message: msg,
//         type: 'error'
//       })
//     }
//     callback()
//   } catch (error) {
//     callback()
//     // loading.value = false
//   }
// }
// // 检测脱机码参数
// const checkOfflienApiData = async (params: any) => {
//   const { data: res, msg, code } = await SystemConfig.checkOfflienApi(params)
//   if (code === 200) {
//     // ElMessage({
//     //   showClose: true,
//     //   message: '保存成功',
//     //   type: 'success'
//     // })
//   } else {
//     // ElMessage({
//     //   showClose: true,
//     //   message: msg,
//     //   type: 'error'
//     // })
//   }
// }
// const submitForm = async (codeRef: any, typeRef: any, callback: any, status?: any) => {
//   // alert('submit!')
//   let offlineCodeValue: any = {}
//   let platTypeValue: any = {}
//   for(let key in codeRef.installConfigSubmit) {
//     offlineCodeValue[key] = codeRef.installConfigSubmit[key]
//   }
//   for (let i = 0; i < typeRef.installConfig.length; i++) {
//     const element = typeRef.installConfig[i];
//       if (element.type === 'upload') {
//       // const value = ''
//       const arr = []
//       // element.fileList.forEach((item: any) => {
//       for (let j = 0; j < element.fileList.length; j++) {
//         const item: any =  element.fileList[j];
//         if (item.url) {
//           arr.push(item.url)
//         } else {
//           // console.log('uploadFile', params.offlineCodePlat, item)
//           // uploadFile(params.offlineCodePlat, item)
//           // 异步上传文件
//           try {
//             const fileUrl = await uploadFile(offlineCodeValue.offlineCodePlat, item.raw)
//             if (fileUrl) arr.push(fileUrl)
//             console.log('fileUrl', fileUrl)
//           } catch (error) {
//             return false
//           }
//         }
//       }
//       platTypeValue[element.field] = arr.join(',')
//       console.log('params', element.field, arr)
//     } else {
//       platTypeValue[element.field] = element.value
//     }
//   }
//   offlineCodeValue.status = status || '2'
//   console.log('save ---', {offlineCodeValue, platTypeValue})
//   editOfflienCodeData({offlineCodeValue, platTypeValue}, callback)
// }
// const currentPlat: any = ref()
// const getOffineCodeData = (data: any) => {
//   // const nodeRef = await offlineCodeRef.value.submitForm()
//   // if (!nodeRef.validateRes) return
//   console.log('submit nodeRef', data)
//   offineCodeData.value = data
//   const platList: any = offlineCodeForm.value.find((item: any) => item.field === 'offlineCodePlat')?.options
//   // data.
//   console.log('platList', platList)
//   currentPlat.value = platList?.find((item: any) => item.value === data.offlineCodePlat) || {}
//   // if ()
// }
// const uploadFile = async (type: any, file: any) => {
//   const formData = new FormData()
//   formData.append('type', type)
//   formData.append('file', file)
//   const { data: res, msg, code } = await SystemConfig.uploadSecretKeyFile(formData)
//   console.log(res)
//   return res
// }

// const checkApi = () => {
//   alert('checkApi!')
// }
// const save = async (callback: any) => {
//   // loading.value = true
//   // console.log('submit', offlineCodeRef.value)
//   const codeRef = await offlineCodeRef.value?.submitForm()
//   if (!codeRef.validateRes) return
//   const typeRef = await payTypeRef.value?.submitForm()
//    if (!typeRef.validateRes) return
//   // console.log('submit nodeRef', codeRef, typeRef)
//   submitForm(codeRef, typeRef, callback)
// }
// const immedUse = async (callbackStart:any, callback: any) => {
//   // loading.value = true
//   // alert('immedUse!')
//   // ElMessageBox.confirm(
//   //   `确定使用脱机码平台${uploadFile.name} ?`
//   // ).then(
//   //   () => true,
//   //   () => false
//   // )
//   const codeRef = await offlineCodeRef.value?.submitForm()
//   if (!codeRef.validateRes) return
//   const typeRef = await payTypeRef.value?.submitForm()
//    if (!typeRef.validateRes) return
//   ElMessageBox.confirm('确定使用"' + (currentPlat.value?.label || '') + '"脱机码？', '提示', {
//     confirmButtonText: '确定',
//     cancelButtonText: '取消',
//     type: 'warning',
//   })
//     .then(() => {
//       callbackStart()
//       submitForm(codeRef, typeRef, callback, '1')
//       // removeActivity(item.id);
//     })
//     .catch(() => {
//       // console.log('cancel');
//     });
  
// }
defineExpose({
  submit,
  // checkApi,
  // immedUse
})
</script>

<style lang="scss">
//
</style>
