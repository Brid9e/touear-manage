<template lang="pug">
#developerTools
  //- p {{ subObj }}
  FormBoxItem(:title="item.name", :sub="subObj?.[item.code]" v-for="item in configData" :key="item.code")
    template(#button)
      //- template(v-if="item.code === 'offline_code'")
        //- ElButton(type="success" @click="checkApi" :disabled="!state.funcButton.ecardSettingSave" ) 检测脱机码参数
        //- ElButton(@click="immedUse" :disabled="!state.funcButton.ecardSettingSave || loadingSave " :loading="loadingUse") 立即使用
        //- ElButton(type="primary" @click="save(item.code)" :disabled="!state.funcButton.ecardSettingSave || loadingUse" :loading="loadingSave") 保存
      ElButton(type="primary" @click="save(item.code)" :disabled="!state.funcButton.vconsoleSave" :loading="loadingSave") 保存
    //- h4 {{ platTypeList }}
    //- p {{ form }}
    el-form(ref="ruleFormRef", label-width="150px" :model="form" :inline="true")
      el-form-item(v-for="(type, i) in mobilePlatType" :label="type.name", :prop="type.code")
        el-switch(v-model="form[type.code]" :active-value="1" :inactive-value="0")
      //-   //- el-radio-group(v-model="form.offlineCodePlat")
      //-     template(v-for="item in platList")
      //-       el-radio(v-if="item.status" :label="item.value", name="type") {{ item.label }}
      //- el-form-item(label="卡账户", prop="account")
      //-   //- el-input(v-model="form.account")
      //- el-form-item(label="卡账户密码", prop="pwd" )
        //- el-input(v-model="form.pwd" type="password")
    //- offineCodeSetting(v-if="item.code === 'offline_code'" ref="offlineCodeRef")
    //- formCreateByJson(v-else :id="item.code" :showTitle="false", :showBgColor="false", :ref="el => setItemRef(el, item.code)" :formDataArr='JSON.parse(item.description)')
  toc
</template>

<script lang="ts" setup>
import { reactive, ref, toRefs, onMounted, onActivated, computed } from 'vue'
import { FormBox, FormBoxItem, toc } from './configComponents/index'
// import { ecardType, ecardFrontConfig, yktApiConfig } from './test'
// import formCreateByJson from '@/components/formCreateByJson/index.vue'
// import offineCodeSetting from './modules/offineCodeSetting.vue'
// import offineCodeSetting from './modules/offineCodeSetting.vue'

import { SystemConfig } from '@/service/platform'
import { ElMessage } from 'element-plus'
import { useStore } from 'vuex'
import { key } from '@/store'
// import { isEmpty } from 'lodash'

const store = useStore(key)
// const {state } = store
const platTypeList = store.state.platTypeLevel
const form: any = ref({})
const currentData: any = ref(null)
const mobilePlatType = computed(() => {
  // parentCode
  return platTypeList.filter((item: any) => item.parentCode === 'mobile')
})
// const loadingSave: any = ref(false)
onMounted(() => {
  // getConfigData()
})
onActivated(() => {
  getConfigData()
})

const RefGroup: any = reactive({
  // ykt_api_config: ref(),
  // ecard_type: ref(),
  vconsole: ref()
})

const { state } = useStore(key)
const configData = ref([{ // 
  code: 'vconsole',
  name: "终端调试",
  loading: true,
  value: '',
  description: ''
}])
const itemRefs: any = {}
const setItemRef = (el: any, code: string) => {
  if (el) itemRefs[code] = el
}
const offlineCodeRef: any = ref(null)
const subObj = {
  vconsole: '设置用户端调试工具',
}
const loadingSave: any = ref(false)
// const loadingUse: any = ref(false)
// const { ykt_api_config, ecard_type, ecard_front_config } = toRefs(RefGroup)
const save = (code: any) => {
  // if (code === 'offline_code') {
  //   saveOfflineCode()
  // } else {
  //   saveEcard(code)
  // }
  
  const params: any = {
    code: currentData.value?.code || 'vconsole',
    id: currentData.value?.id,
    name: currentData.value?.name || '终端调试',
    type: currentData.value?.type,
    value: JSON.stringify(form.value)
  }
  saveVconsole(params)
}
const saveVconsole = async (params: any) => {
  loadingSave.value = true
  const { code, msg }: any = await SystemConfig.edit(params)
  if (code === 200) {
    loadingSave.value = false
    ElMessage.success(msg)
    // this.changed = false
    // this.cancle()
    // this.$emit('update-list')
  } else {
    ElMessage.error(msg)
  }
}
const getConfigData = async (msgBox ?: string) => {
  // this.loading = true
  const params: any = {
    code: 'vconsole'
  }
  const { data, code }: any = await SystemConfig.getConfigData(params, msgBox)
  if (code === 200) {
    console.log('getConfigData', data)
    currentData.value = data.records[0]
    if (currentData.value?.value) {
      form.value = JSON.parse(currentData.value?.value)
    }
  }
    // let configDataArr = data.records
    // for (const i of configDataArr) {
    //   i.show = false
    // }
    // this.configData = configDataArr
    // this.total = data.total
    // this.pageCount = data.pages
    // this.loading = false
  // }
}
// const saveEcard = async (name: string) => {
//   // itemRefs[name].submitForm(async (nodeRef: any) => {
//   // itemRefs[code].submitForm()
//   const nodeRef = await itemRefs[name].submitForm()
//   if (!nodeRef.validateRes) return
//   console.log(nodeRef)
//   let params: any = {}
//   const submitData = nodeRef.installConfigSubmit[name]
//   for (let key in submitData) {
//     params[`${name}.${key}`] = submitData[key]
//   }
//   params[`${name}$#$description`] = JSON.stringify(nodeRef.installConfig)
//   saveEdit(params)
// }

// const getThirdConfig = async () => {
//   const { data: res, msg, code }: any = await SystemConfig.getConfigByType('ecard')
//   if (code === 200) {
//     for (let val of res) {
//       let newData = handleInitData(val.description, val.value)
//       val.description = newData.description
//       val.value = newData.value
//     }
//     const obj = { // 增加脱机码设置
//       code: 'offline_code',
//       name: "一卡通脱机码信息",
//       loading: true,
//       value: '',
//       description: ''
//     }
//     configData.value = res.concat(obj)
//   } else {
//     //
//   }
// }

/**
 *
 * @date 2022-11-08 09:43:42
 * @author Joe
 * @description 接口保存数据
 *
 */
// const saveEdit = async (params: any) => {
//   const { code, msg } = await SystemConfig.editSysconfigsManage(params)
//   if (code === 200) {
//     ElMessage({
//       showClose: true,
//       message: '保存成功',
//       type: 'success'
//     })
//   } else {
//     ElMessage({
//       showClose: true,
//       message: msg,
//       type: 'error'
//     })
//   }
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
//       if (val.groupFormJson) {
//         for (let v of val.groupFormJson) t(v, _value)
//         if (typeof val.field === 'number') {
//           index++
//         } else {
//           handleInitData(val.groupFormJson, _value)
//         }
//       }
//     }
//   }
//   console.log({ description: _description, value: _value })
//   return { description: JSON.stringify(_description), value: JSON.stringify(_value) }
// }

// const saveOfflineCode = () => {
//   // console.log(offlineCodeRef.value[0])
//   loadingSave.value = true
//   offlineCodeRef.value[0].save(() => {
//     loadingSave.value = false
//   })
// }
// const checkApi = () => {
//   offlineCodeRef.value[0].checkApi()
// }
// const immedUse = () => {
//   offlineCodeRef.value[0].immedUse(() => {
//     loadingUse.value = true
//   } ,() => {
//     loadingUse.value = false
//   })
// }
// console.log(offlineCodeRef.value[0])
</script>

<style lang="scss">
//
</style>
