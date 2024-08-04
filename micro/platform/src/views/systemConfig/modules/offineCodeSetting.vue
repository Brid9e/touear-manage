<template lang="pug">
#OffineCodeSetting(v-loading="loading")
  formCreateByJson(v-if="offlineCodeForm" ref="offlineCodeRef" id="offline_code" :showTitle="false" :isListen="true" 
    :formDataArr="offlineCodeForm" :backfillingPayData="offlineCodeValue" @change="getOffineCodeData")
  formCreateByJson(v-if="platTypeForm" ref="payTypeRef" :id="offineCodeData?.offlineCodePlat" :formDataArr="platTypeForm" :showTitle="false" :backfillingPayData="platTypeValue")
  el-dialog(v-model='dialogFormVisible', :width='600', title='检测脱机码参数' @close="onCancel")
    div()
      //- p --{{platList}}
      offineCodeCheck(ref="offineCodeCheckRef" :data="{platList, checkStatus, reuslt}" @change="getCheckData")
        //- MenuDetails(v-if='dialogStatus === 0' :data="{currentMenu, isCloud: 0}")
        //- EditMenu(ref="editFormRef" v-else-if="dialogStatus === 1" :data="{currentMenu, rules}"  @submit="submitForm")
    template(#footer)
      el-button(@click='onCancel') 取消
      el-button(v-if="checkStatus === 0" type="primary" @click='submitCheck' :loading="checkStatus === 1") 提交检测
      el-button(v-if="checkStatus === 2" type="success" @click='checkStatus = 0') 重新检测
      //- el-button(@click='dialogFormVisible = false') 关闭
        //- el-button(type='primary', @click='saveForm', :loading='saveLoading') 保存
</template>

<script lang="ts" setup>
import { reactive, ref, toRefs, onMounted, onActivated, computed, watch } from 'vue'
import formCreateByJson from '@/components/formCreateByJson/index.vue'
import offineCodeCheck from './offineCodeCheck.vue'
import { SystemConfig } from '@/service/platform'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useStore } from 'vuex'
import { key } from '@/store'
import { isEmpty } from 'lodash'
import type { UploadProps, UploadUserFile } from 'element-plus'
// import { fa } from 'element-plus/es/locale'
onMounted(() => {
  // getThirdConfig()
  getOfflienConfigData()
})
onActivated(() => {
  // getThirdConfig()
})

const { state } = useStore(key)
const dialogFormVisible: any = ref(false)

const offlineCodeRef: any = ref(null)
const offineCodeCheckRef: any = ref(null)
const payTypeRef: any = ref(null)
const loading: any = ref(false)
const offlineCodeForm: any = ref()
const offlineCodeValue: any = ref()
// 编辑数据
const offineCodeData: any = ref()
const platTypeData: any = ref()

const platTypeFormAll: any = ref()
const platTypeValue: any = ref()
const platTypeForm = computed(() => {
  const form = platTypeFormAll.value?.[offineCodeData.value?.offlineCodePlat]
  // platTypeFormAll.value?.[offlineCodeValue.value?.offlineCodePlat]
  console.log('123', form)
  if (form) {
    form.forEach((element: any) => {
      console.log('element', element)
      if (element.type === 'upload') {
        // platTypeValue.value[element.filed]
        const value = platTypeValue.value[element.field]
        if(value) {
          const arr: any = []
          const valueArr = value.split(',')
          console.log('valueArr', valueArr)
          valueArr.forEach((item: any) => {
            const itemArr = item.split('/')
            const obj = {
              name: itemArr[itemArr.length - 1],
              url: item
            }
            arr.push(obj)
          })
          element.fileList = arr
        } else {
          element.fileList = []
          element.value = ''
        }
        console.log('value', element.field, platTypeValue.value[element.field])
      }
    })
  }
  return form
})

const platList = computed(() => {
  const list = offlineCodeForm.value.find((item: any) => item.field === 'offlineCodePlat')?.options
  list.forEach((element: any) => {
    element.status = 0
    const formArr = platTypeFormAll.value[element.value]
    console.log('platList formArr', platTypeFormAll.value, element.value, formArr)
    if (formArr) {
      formArr.forEach((item: any) => {
        console.log(item.field, platTypeValue.value[item.field],  !platTypeValue.value[item.field])
        if (!platTypeValue.value[item.field]){
          element.status = 0
          return false
        } else {
          element.status = 1
        }
      })
    }
  });
  return list
})
const checkStatus = ref(0) // 检测表单状态 0 初始  1 检测中 2 检测完成
const reuslt = ref(null) // 检测结果
watch(() => offineCodeData.value?.offlineCodePlat, (newVal, oldVal) => { 
  console.log('offineCodeData', newVal)
  // }
  
}, {
  // immediate: true,
  deep: true
})
// 获取脱机码参数配置
const getOfflienConfigData = async () => {
  loading.value = true
  const { data: res, msg, code }: any = await SystemConfig.getOfflienConfig()
  if (code === 200) {
    console.log(res)
    if (!res || Object.keys(res).length === 0) {
      syncOfflienCodeConfigData()
    } else {
      loading.value = false
      offlineCodeValue.value = res.offlineCodeValue
      offlineCodeForm.value = JSON.parse(res.offlineCodeForm)
      platTypeFormAll.value = JSON.parse(res.platTypeForm)
      platTypeValue.value = res.platTypeValue
      
    }
  } else {
    loading.value = false
  }
}
// 初始化脱机码参数配置
const syncOfflienCodeConfigData = async () => {
  const { data: res, msg, code }: any = await SystemConfig.syncOfflienCodeConfig()
  if (code === 200) {
    getOfflienConfigData()
  } else {
    //
  }
}
// 编辑脱机码参数
const editOfflienCodeData = async (params: any, callback: any) => {
  
  try {
    const { code, msg } = await SystemConfig.editOfflienCode(params)
    // loading.value = false
    if (code === 200) {
      ElMessage({
        showClose: true,
        message: '保存成功',
        type: 'success'
      })
      // if (params.offlineCodeValue.status === '2') getOfflienConfigData()
    } else {
      ElMessage({
        showClose: true,
        message: msg,
        type: 'error'
      })
    }
    callback()
  } catch (error) {
    callback()
    // loading.value = false
  }
}
// 检测脱机码参数
const checkOfflienApiData = async (params: any) => {
  checkStatus.value = 1
  const { data: res, msg, code } = await SystemConfig.checkOfflienApi(params)
  if (code === 200) {
    reuslt.value = res
    checkStatus.value = 2
    // ElMessage({
    //   showClose: true,
    //   message: '保存成功',
    //   type: 'success'
    // })
  } else {
    ElMessage({
      showClose: true,
      message: msg,
      type: 'error'
    })
  }
}
const submitForm = async (codeRef: any, typeRef: any, callback: any, status?: any) => {
  // alert('submit!')
  let offlineCodeValue: any = {}
  let platTypeValue: any = {}
  for(let key in codeRef.installConfigSubmit) {
    offlineCodeValue[key] = codeRef.installConfigSubmit[key]
  }
  for (let i = 0; i < typeRef.installConfig.length; i++) {
    const element = typeRef.installConfig[i];
      if (element.type === 'upload') {
      // const value = ''
      const arr = []
      // element.fileList.forEach((item: any) => {
      for (let j = 0; j < element.fileList.length; j++) {
        const item: any =  element.fileList[j];
        if (item.url) {
          arr.push(item.url)
        } else {
          // console.log('uploadFile', params.offlineCodePlat, item)
          // 异步上传文件
          try {
            const fileUrl = await uploadFile(offlineCodeValue.offlineCodePlat, item.raw)
            if (fileUrl) arr.push(fileUrl)
            console.log('fileUrl', fileUrl)
          } catch (error) {
            return false
          }
        }
      }
      platTypeValue[element.field] = arr.join(',')
      console.log('params', element.field, arr)
    } else {
      platTypeValue[element.field] = element.value
    }
  }
  offlineCodeValue.status = status || '2'
  console.log('save ---', {offlineCodeValue, platTypeValue})
  editOfflienCodeData({offlineCodeValue, platTypeValue}, callback)
}
const currentPlat: any = ref()
const getOffineCodeData = (data: any) => {
  // const nodeRef = await offlineCodeRef.value.submitForm()
  // if (!nodeRef.validateRes) return
  console.log('submit nodeRef', data)
  offineCodeData.value = data
  
  // data.
  // console.log('platList', platList)
  currentPlat.value = platList.value?.find((item: any) => item.value === data.offlineCodePlat) || {}
  // if ()
}
const uploadFile = async (type: any, file: any) => {
  const formData = new FormData()
  formData.append('type', type)
  formData.append('file', file)
  const { data: res, msg, code } = await SystemConfig.uploadSecretKeyFile(formData)
  console.log(res)
  return res
}

const checkApi = () => {
  dialogFormVisible.value = true
  // alert('checkApi!')
}
const save = async (callback: any) => {
  // loading.value = true
  // console.log('submit', offlineCodeRef.value)
  const codeRef = await offlineCodeRef.value?.submitForm()
  if (!codeRef.validateRes) {
    callback()
    return false
  }
  const typeRef = await payTypeRef.value?.submitForm()
   if (!typeRef.validateRes) {
    callback()
    return false
  }
  // console.log('submit nodeRef', codeRef, typeRef)
  submitForm(codeRef, typeRef, callback)
}
const immedUse = async (callbackStart:any, callback: any) => {
  const codeRef = await offlineCodeRef.value?.submitForm()
  if (!codeRef.validateRes) return
  const typeRef = await payTypeRef.value?.submitForm()
   if (!typeRef.validateRes) return
  ElMessageBox.confirm('确定使用"' + (currentPlat.value?.label || '') + '"脱机码？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(() => {
      callbackStart()
      submitForm(codeRef, typeRef, callback, '1')
      // removeActivity(item.id);
    })
    .catch(() => {
      // console.log('cancel');
    });
  
}

const submitCheck = async (callback: any) => {
  // checkOfflienApiData()
   offineCodeCheckRef.value?.submit((data: any) => {
    if (data.valid) {
      const parmas = Object.assign(platTypeValue.value, data.form)
      checkOfflienApiData(parmas)
    }
   })
}
const getCheckData = (data: any) => {
  console.log('getCheckData', data)
}
const onCancel = () => {
  dialogFormVisible.value = false
  checkStatus.value = 0
}
defineExpose({
  save,
  checkApi,
  immedUse
})
</script>

<style lang="scss">
//
</style>
