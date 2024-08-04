<template lang="pug">
div
  #ThirdParty
    FormBoxItem(:title="item.name", :sub="subObj?.[item.code]" v-for="item in configData" :key="item.code")
      template(#button)
        ElButton(type="primary" @click="save(item.code, item.name)" :disabled="!state.funcButton.thirdPartySave") 保存
      .div(v-for="_item in JSON.parse(item.description)" :key="_item.field")
        formCreateByJson(:id="item.code" :showTitle="_item.groupFormJson?.length > 1", :showBgColor="_item.groupFormJson?.length > 1" :ref="el => setItemRef(el, item.code)" :formDataArr='_item.groupFormJson')
  toc
</template>

<script lang="ts" setup>
import { reactive, ref, onMounted, onActivated } from 'vue'
import { FormBox, FormBoxItem, toc } from './configComponents/index'
import FormCreateByJson from '@/components/formCreateByJson/index.vue'
import { SystemConfig } from '@/service/platform'
import { ElMessage } from 'element-plus'
import { useStore } from 'vuex'
import { key } from '@/store'
import { isEmpty } from 'lodash'

onMounted(() => {
  getThirdConfig()
})

onActivated(() => {
  getThirdConfig()
})

const RefGroup: any = reactive({
  alipay_life: ref(),
  wechat_work: ref(),
  wechat_mina: ref(),
  wechat_mp: ref(),
  alipay_app: ref()
})

const { state } = useStore(key)
const configData: any = ref([])
const itemRefs: any = {}
const setItemRef = (el: any, code: string) => {
  if (el) itemRefs[code] = el
}
const subObj = {
  'alipay-life': '支付宝生活号相关配置',
  'wechat-mina': '微信小程序相关配置',
  'wechat-work': '企业微信相关配置',
  'wechat-mp': '微信公众号相关配置',
  'alipay-app': '支付宝第三方APP相关配置'
}
// const { alipay_life, wechat_work, wechat_mina, wechat_mp, alipay_app } = toRefs(RefGroup)

/**
 *
 * @date 2022-11-08 09:44:27
 * @author Joe
 * @description 格式化数据，并校验表单，保存
 *
 */
const save = async (code: string, name: string) => {
  // 针对名称不一致，重命名
  // itemRefs[code].submitForm((nodeRef: any) => {
  const nodeRef = await itemRefs[code].submitForm()
  if (!nodeRef.validateRes) return
  let params: any = {}
  let submitData
  const keys = Object.keys(nodeRef.installConfigSubmit)
  // keys 非连续数字 则按对象处理
  submitData = keys.some((v: any, i: any) => v !== i.toString()) ?
    nodeRef.installConfigSubmit :
    Array.from({ ...nodeRef.installConfigSubmit, length: Object.keys(nodeRef.installConfigSubmit)?.length })
  console.log(submitData)
  params[code] = JSON.stringify(submitData)
  const _description = [
    {
      type: 'byGroup',
      field: code,
      title: name,
      groupFormJson: [...nodeRef.installConfig]
    }
  ]
  params[`${code}$#$description`] = JSON.stringify(_description)
  saveEdit(params)
  // })
}

/**
 *
 * @date 2022-11-08 09:44:40
 * @author Joe
 * @description 获取第三方表单数据
 *
 */
const getThirdConfig = async () => {
  const { data: res, msg, code }: any = await SystemConfig.getConfigByType('third')
  if (code === 200) {
    for (let val of res) {
      let newData = handleInitData(val.description, val.value)
      val.description = newData.description
      val.value = newData.value
    }
    configData.value = res
  } else {
    //
  }
}

/**
 *
 * @date 2022-11-08 09:43:42
 * @author Joe
 * @description 接口保存数据
 *
 */
const saveEdit = async (params: any) => {
  const { code, msg } = await SystemConfig.editSysconfigsManage(params)
  if (code === 200) {
    ElMessage({
      showClose: true,
      message: '保存成功',
      type: 'success'
    })
  } else {
    ElMessage({
      showClose: true,
      message: msg,
      type: 'error'
    })
  }
}

const handleInitData = (data: any, value: any) => {
  let _description
  let _value
  let index = 0
  try {
    _description = JSON.parse(data)
    _value = JSON.parse(value)
  } catch {
    _description = data
    _value = value
  }
  const t = (v: any, _value: any) => {
    try {
      v.value = _value[index][v.field] || v.value
    } catch {
      v.value = _value[v.field] || v.value
    }
  }
  // console.log(_description, _value)
  if (!isEmpty(_description)) {
    for (let val of _description) {
      if (val.groupFormJson) {
        for (let v of val.groupFormJson) t(v, _value)
        if (typeof val.field === 'number') {
          index++
        } else {
          handleInitData(val.groupFormJson, _value)
        }
      }
    }
  }
  return { description: JSON.stringify(_description), value: JSON.stringify(_value) }
}
</script>