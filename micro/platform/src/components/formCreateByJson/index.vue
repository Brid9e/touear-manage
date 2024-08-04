<template lang="pug">
.form-Create-style
  //- p -- {{formData.configData.length}}
  //- el-form.form(ref="formRef", :model="formData")
  el-form.form(:ref='id ? "btnValidate-" + id : "btnValidate1"', :model='formData' :label-width="labelWidth")
    div(v-for='(item, i) in formData.configData', :key='i')
      // 支付管理类型特殊处理
      template(v-if='item.type === "byPayGroup"')
        h3 {{ item.label }}
        div(v-for='(itemg, ig) in item.childrenCheckd', :key='ig')
          div(style='padding-left: 20px; margin: 10px 0')
            p {{ itemg.label }}
              span(style='font-size: 12px; font-weight: 500; color: #888') （{{ itemg.info }}）
            div(v-for='(itemgF, igf) in itemg.childForm', :key='igf')
              el-form-item(v-if='initDataItem(itemgF).display', :label='itemgF.title', :prop='"configData." + i + ".childrenCheckd." + ig + ".childForm." + igf + ".value"', :rules='item.validate')
                form-item(:item='initDataItem(itemgF)')
      // 通用类型(byGroup为map)
      template(v-else-if='item.type === "byGroup"')
        .form-item-group()
          span.form-item-label(v-if='showTitle') {{ item.title }}
          .form-item-right-group(:class='{ "form-item-bg": showBgColor }')
            el-form-item(v-for='(itemg, ig) in item.groupFormJson', :key='ig', :label='itemg.title', :prop='"configData." + i + ".groupFormJson." + ig + ".value"', :rules='itemg.validate')
              form-item(:item='itemg', :i='i')
          //- template(v-else)
          //-   div(v-for='(itemg, ig) in item.groupFormJson', :key='ig')
          //-     span.form-item-label {{ itemg.title }}
          //-     .form-item-right-group
          //-       el-form-item(v-for='(itemgg, igg) in itemg.groupFormJson', :key='igg', :label='itemgg.title', :prop='"configData." + i + ".groupFormJson." + ig + ".groupFormJson." + igg + ".value"', :rules='itemg.validate')
          //-         form-item(:item='itemgg')
      template(v-else-if='item.type === "span"')
        p.text-warning.margin-bottom-2x(style="padding-left:80px") {{item.title}} {{item.children[0]}}
      template(v-else-if='item.display')
        //- p(v-if="isListen") --- {{item}}
        el-form-item(:label='item.title', :class="{'form-span': item.type === 'span'}" :prop='"configData." + i + ".value"', :rules='item.validate')
          form-item(:item='handleItems(item)', :i='i')

    el-button(:id='id ? "btnValidate-" + id : "btnValidate1"', type='primary', @click='validate(formRef)', style='display: none')
    //- el-button(type='primary', @click='submitForm') 提交
</template>
<script lang="ts" setup>
import {
  ref,
  reactive,
  getCurrentInstance,
  onMounted,
  defineProps,
  provide,
  watchEffect,
  watch,
   computed
} from 'vue'
import type { FormInstance } from 'element-plus'
import qs from 'qs'
import service from '@/service'
import { useStore } from 'vuex'
import { key } from '@/store/index'
// import { nextTick } from 'vue'
import formItem from './modules/formItem.vue'
// import { ArrowLeftBold } from "@element-plus/icons";
import { cloneDeep, isArray, isObject, lte, remove } from 'lodash'
const store = useStore(key)
const { state } = store
const configs = localStorage.getItem('configsManage')
  ? JSON.parse(localStorage.getItem('configsManage') as string)
  : {}
const instance: any = getCurrentInstance()
const props = defineProps({
  formDataArr: Array, // 表单json数据
  disabled: Boolean, // 是否可编辑
  id: String, // 一个页面有多个该组件，需要传入id
  showTitle: {
    type: Boolean,
    default: true,
  },
  showBgColor: {
    type: Boolean,
    default: true,
  },
  backfillingPayData: Object,
  isListen: { // 监听表单值
    type: Boolean,
    default: false,
  },
  'labelWidth': {
    type: String
  }
})

// console.log('isListen', props.isListen)
const emit = defineEmits(["change"])


watch(
  () => props.formDataArr,
  (newValue, oldValue) => {
    // console.log('watch formDataArr', newValue)
    if (JSON.stringify(newValue) !== JSON.stringify(oldValue)) {
      formData.configData = newValue
      initData(formData.configData)
      // emit("change")
      // console.log('watch formDataArr', formData.configData)
    }
  }
)
const isListen: any = props.isListen
const backfillingPayData: any = ref(props.backfillingPayData)
const formDataOriginal: any = JSON.parse(JSON.stringify(props.formDataArr))
const formRef = ref<FormInstance>()
const id = computed(() => {
  return props.id
})
watch(() => id.value, (newVal, oldVal) => {
  // console.log('id', newVal, oldVal)
  if (newVal) {
    const refsName = oldVal ? 'btnValidate-' + oldVal : 'btnValidate1'
    // setTimeout(() => {
    const formRef = instance.refs[refsName]
    // console.log('watch ---', newVal, formRef)
    formRef.clearValidate()
    // }, 100);
  }
//
})
const formData: any = reactive({
  configData: JSON.parse(JSON.stringify(props.formDataArr)),
})
const formInfo: any = computed(() => {
  const data: any = {}
  if (isListen) {
    formData.configData.forEach((element: any) => {
      data[element.field] = element.value
    });
    // emit("change", data)
  }
  return data
})
watch(() => formInfo.value, (newVal, oldVal) => {
  emit("change", newVal)
  // }
}, {
  // immediate: true,
  // deep: true
})
const validateRes = ref(false)
const validate = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.validate((valid: any) => {
    // console.log(11111, 'formEl', valid)
    validateRes.value = valid
  })
}

// const getFormItem = (item: any) => {
//   console.log('---getFormItem', item)
// }
// 提交---返回： validate（表单校验）， data（原数据结构）
const submitFormList = (callback: any) => {
  // (document.getElementById("btnValidate1") as any).click();
  // return {
  //   validate: validateRes.value,
  //   data: getOriginalKey(formData.configData)
  // };
  return new Promise((resolve: any, reject: any) => {
    const objRes = {
      validate: validateRes.value,
      data: getOriginalKey(formData.configData),
    }
    const refName = id.value ? 'btnValidate-' + id.value : 'btnValidate1'
    const formJsonRef: any = instance.refs[refName]
    formJsonRef.validate((valid: any) => {
      objRes.validate = valid
      resolve(objRes)
    })
  })
}
// 提交---返回： validateRes（表单校验）， installConfig（原数据结构）， installConfigSubmit（封装后的提交数据）
const submitForm = (optionAll?: boolean) => {
  // if (id.value) {
  //   (document.getElementById("btnValidate-" + id.value) as any).click();
  // } else {
  //   (document.getElementById("btnValidate1") as any).click();
  // }
  return new Promise((resolve: any, reject: any) => {
    const refName = id.value ? 'btnValidate-' + id.value : 'btnValidate1'
    const formJsonRef: any = instance.refs[refName]
    formJsonRef.validate((valid: any, invalidFields: any) => {
      if (!valid) {
        const keys = Object.keys(invalidFields)
        console.log('invalidFields', invalidFields)
        const field = keys[0].split('.')
        if (field.includes('selectedNodes') && field.includes('childForm')) {
          formData.configData[Number(field[1])].itemTabValue =
            formData.configData[Number(field[1])].selectedNodes[
              Number(field[3])
            ].data.value
        }
      }
      validateRes.value = valid
      let installForm: any = {}
      formData.configData.forEach((item: any) => {
        // console.log('itemitemitem', item)
        if (item.type === 'byGroup') {
          installForm[item.field] = {}
          item.groupFormJson.forEach((itemG: any) => {
            toolItem(installForm[item.field], itemG)
          })
        } else if (item.type !== 'el-button') {
          toolItem(installForm, item, optionAll)
        }
      })
      console.log('提交结果', {
        validateRes: validateRes.value,
        installConfig: formData.configData,
        installConfigSubmit: installForm,
      })
      const objRes = {
        validateRes: validateRes.value,
        installConfig: formData.configData,
        installConfigSubmit: installForm,
        installConfigOriginal: formDataOriginal,
      }
      resolve(objRes)
      // if (callback) {
      //   callback(objRes)
      // } else {
      //   return objRes
      // }
    })
  })
  function toolItem(installForm: any, item: any, optionAll?: boolean) {
    installForm = installForm || {}
    if (item.type === 'input') {
      installForm[item.field] = item.value
    } else if (
      item.type === 'checkbox' ||
      item.type === 'select' ||
      item.type === 'radio'
    ) {
      if (item.selectedNodes && item.selectedNodes.length > 0) {
        // 选项有childform的
        let arr: any = []
        let value = JSON.parse(JSON.stringify(item.value))
        if (!Array.isArray(value)) value = [value]
        value.forEach((itemO: any, i: number) => {
          const isInSelectedNodes = item.selectedNodes.find((o: any) => {
            return o.data.value === itemO
          })
          const option = item.options.find((o: any) => {
            return o.value === itemO
          })
          if (option) {
            const optionInfo = JSON.parse(JSON.stringify(option))
            delete optionInfo.childForm
            let obj: any = {
              value: optionInfo,
            }
            if (isInSelectedNodes && isInSelectedNodes.data.childForm) {
              obj.childForm = {}
              isInSelectedNodes.data.childForm.forEach((itemO: any) => {
                obj.childForm[itemO.field] = itemO.value
              })
            }
            arr.push(obj)
          }
        })
        if (
          item.type === 'checkbox' ||
          (item.type === 'select' && item.props.multiple)
        ) {
          installForm[item.field] = arr
        } else {
          installForm[item.field] = arr[0]
        }
      } else {
        if (optionAll) {
          const arr = item.value.map((o: any) => {
            const option = item.options.find((p: any) => {
              return p.value === o
            })
            return { value: option }
          })
          installForm[item.field] = arr
        } else {
          installForm[item.field] = item.value
        }
      }
    } else if (item.type === 'cascader') {
      let arr: any = []
      item.selectedNodes.forEach((element: any, i: number) => {
        let obj: any = {
          value: [],
        }
        if (element.data.childForm && element.data.childForm.length > 0) {
          obj.childForm = {}
          element.data.childForm.forEach((itemO: any) => {
            obj.childForm[itemO.field] = itemO.value
          })
        }
        toolCascader(element, [], obj)
        arr.push(obj)
      })
      installForm[item.field] = item.props.props.multiple ? arr : arr[0]
    } else if (item.type === 'switch') {
      installForm[item.field] = item.value
    } else if (item.type === 'timePickerRange') {
      installForm[item.field] = JSON.stringify(item.value)
    } else if (item.type === 'uploadImg') {
      installForm[item.field] = cloneDeep(item.files)
    } else if (item.type === 'upload') {
      // console.log('***field-----', item, item.field)
      installForm[item.field] = cloneDeep(item.fileList)
    }
  }
  function toolCascader(element: any, arrValue: any, obj: any) {
    const objClone = JSON.parse(JSON.stringify(element.data))
    delete objClone.childForm
    delete objClone.children
    arrValue.unshift(objClone)
    if (element.parent) {
      toolCascader(element.parent, arrValue, obj)
    } else {
      obj.value = arrValue
    }
  }
}
const getOriginalKey = (data: any) => {
  return formDataOriginal.map((o: any, index: number) => {
    o.value = data[index].value
    return o
  })
}
// 动态接口
const request = (fetch: any): Promise<any> => {
  return service.request({
    url: fetch.action
      .replace('$manage$', configs.base)
      .replace('$cloudUrl$', configs.cloudUrl),
    method: fetch.method,
    params: fetch.data,
  })
}
// 初始化数据
const initBase = (item: any) => {
  const disabledDefault = props.disabled
    ? true
    : item.props?.disabled !== undefined
      ? item.props.disabled
      : false
  const readOnlyDefault = false
  const inputTypeDefault = 'text'
  const multipleDefault = false
  const requiredDefault = true
  const displayDefault = true
  switch (item.type) {
    case 'input': {
      const type =
        item.props && item.props.type !== undefined
          ? item.props.type
          : inputTypeDefault
      const readonly =
        item.props && item.props.readonly !== undefined
          ? item.props.readonly
          : readOnlyDefault
      item.props = {
        type: type,
        readonly: readonly,
        disabled: disabledDefault,
      }
      break
    }
    case 'switch': {
      const readonly =
        item.props && item.props.readonly !== undefined
          ? item.props.readonly
          : readOnlyDefault
      item.props = {
        readonly: readonly,
        disabled: disabledDefault,
      }
      break
    }
    case 'select': {
      const multiple =
        item.props && item.props.multiple !== undefined
          ? item.props.multiple
          : multipleDefault
      item.props = {
        multiple: multiple,
        disabled: disabledDefault,
      }
      break
    }
    case 'checkbox': {
      item.props = {
        disabled: disabledDefault,
      }
      break
    }
    case 'radio': {
      item.props = {
        disabled: disabledDefault,
      }
      break
    }
    case 'cascader': {
      const multiple =
        item.props.props && item.props.props.multiple !== undefined
          ? item.props.props.multiple
          : multipleDefault
      item.props.props = {
        multiple: multiple,
        disabled: disabledDefault,
      }
      break
    }
    case 'uploadImg': {
      item.httpRequest = (data: any) => {
        item.value = URL.createObjectURL(data.file)
        item.file = data.file
      }
      item.delete = (data: any) => {
        item.value = ''
        item.file = ''
      }
      break
    }
    case 'upload': {
      item.httpRequest = (data: any) => {
        item.value += URL.createObjectURL(data.file) + ','
      }
      // item.handleExceed = (files: any) => {
      //   // console.log(files, '超出限制数量')
      // }
      break
    }
    case 'timePickerRange': {
      try {
        item.value = JSON.parse(item?.value || '[]')
      } catch {
        item.value = []
      }
      break
    }
    case 'span': {
      item.validate = { required: false }
    }
    default:
      break
  }
  // 初始化display 值
  const display = item.display !== undefined ? item.display : displayDefault
  item.display = display
  // 初始化validate
  const required =
    item.validate && item.validate.required !== undefined
      ? item.validate.required
      : requiredDefault
  const message =
    item.validate && item.validate.message !== undefined
      ? item.validate.message
      : '必填项'
  item.validate = {
    required: required,
    message: message,
  }
  return item
}
const initDataItem = (itemData: any) => {
  // console.log(2222,'initDataItem----', item)
  let item = initBase(itemData)
  // 初始化value 值
  if (item.value === undefined || item.value === '') {
    if (
      item.type === 'checkbox' ||
      (item.type === 'cascader' && item.props.props.multiple) ||
      (item.type === 'select' && item.props.multiple)
    ) {
      item.value = ref([])
    } else if (item.type === 'switch') {
      item.value = ref(false)
    } else {
      item.value = ref('')
    }
  }
  // // 回填数据backfillingPayData
  let hasChild = false //是否有child数据
  if (backfillingPayData.value && backfillingPayData.value[item.field] !== undefined) {
    if (
      item.type === 'checkbox' ||
      (item.type === 'select' && item.props.multiple)
    ) {
      // option选项为静态数据value值为对象数组
      if (
        (!item.effect || !item.effect.fetch) &&
        typeof backfillingPayData.value[item.field][0] === 'object'
      ) {
        item.selectedNodes = []
        item.value = backfillingPayData.value[item.field].map((o: any) => {
          return o.value.value
        })
        item.options.forEach((op: any, index: number) => {
          const obj = backfillingPayData.value[item.field].find((h: any) => {
            return h.value.value === op.value
          })
          if (obj) {
            if (item.options[index].childForm) {
              item.options[index].childForm.forEach((cf: any) => {
                cf = initBase(cf)
                cf.value = obj.childForm[cf.field]
              })
              item.hasGangedPanel = true
            }
            item.selectedNodes.push({ data: item.options[index] })
          }
        })
        item.itemTabValue = item.selectedNodes[0].data.value
      } else if (typeof backfillingPayData.value[item.field][0] !== 'object') {
        item.value = backfillingPayData.value[item.field]
      }
    } else if (
      item.type === 'select' &&
      (!item.props || !item.props.multiple)
    ) {
      // option选项为静态数据，且value值为对象
      if (
        (!item.effect || !item.effect.fetch) &&
        typeof backfillingPayData.value[item.field] === 'object'
      ) {
        let index: any = null
        if (item.field === 'pay' || item.field === 'itemimpl') {
          index = item.options.findIndex((o: any) => {
            return (
              o.value.split(':')[0] ===
              backfillingPayData.value[item.field].value.value.split(':')[0]
            )
          })
        } else {
          index = item.options.findIndex((o: any) => {
            return o.value === backfillingPayData.value[item.field].value.value
          })
        }
        item.value = item.options[index]?.value
        item.selectedNodes = []
        if (item.options[index].childForm) {
          item.options[index].childForm.forEach((cf: any) => {
            cf = initBase(cf)
            cf.value = backfillingPayData.value[item.field].childForm[cf.field]
          })
          item.hasGangedPanel = true
        }
        item.selectedNodes.push({ data: item.options[index] })
      } else if (typeof backfillingPayData.value[item.field] !== 'object') {
        item.value = backfillingPayData.value[item.field]
      }
    } else if (
      (item.type === 'input' ||
        item.type === 'switch' ||
        item.type === 'radio') &&
      item.type !== 'el-button'
    ) {
      item.value = backfillingPayData.value[item.field]
    }
  }
  // 初始化option接口的数据
  if (item.type !== 'el-button' && item.effect && item.effect.fetch) {
    const _state: any = store.state
    if (
      _state[item.effect.fetch.store] &&
      item.effect.fetch.store === 'platTypeLevel'
    ) {
      let arr = store.state.platTypeLevel
      arr = arr.map((o: any) => {
        return {
          value: o.code,
          label: o.name,
        }
      })
      item.optionsByApi = true
      item.type === 'cascader'
        ? (item.props.options = arr)
        : (item.options = arr)
    } else {
      request(item.effect.fetch).then((res) => {
        const data = eval('(' + item.effect.fetch['_parse'] + ')(res)')

        // 登陆限制不需要显示mobile
        if (item.field === 'login_from_limit') {
          remove(data, (o: any) => {
            return o.value === 'mobile'
          })
        }

        item.optionsByApi = true
        item.type === 'cascader'
          ? (item.props.options = data)
          : (item.options = data)
        // 动态数据,切值为数组对象或对象 ---处理回显面板数据
        if (backfillingPayData.value && backfillingPayData.value[item.field]) {
          // 单选
          if (
            item.type === 'select' &&
            (!item.props || !item.props.multiple) &&
            typeof backfillingPayData.value[item.field] === 'object'
          ) {
            if (typeof backfillingPayData.value[item.field] === 'object') {
              let index: any = null
              if (item.field === 'pay' || item.field === 'itemimpl') {
                index = data.findIndex((o: any) => {
                  return (
                    o.value.split(':')[0] ===
                    backfillingPayData.value[item.field].value.value.split(
                      ':'
                    )[0]
                  )
                })
              } else {
                index = data.findIndex((o: any) => {
                  return (
                    o.value === backfillingPayData.value[item.field].value.value
                  )
                })
              }
              item.value = data[index]?.value
              item.selectedNodes = []
              if (item.options[index].childForm) {
                item.options[index].childForm.forEach((cf: any) => {
                  cf = initBase(cf)
                  cf.value =
                    backfillingPayData.value[item.field].childForm[cf.field]
                })
                item.hasGangedPanel = true
              }
              item.selectedNodes.push({ data: item.options[index] })
            }
          }
          // 多选
          if (
            (item.type === 'select' && item.props && item.props.multiple) ||
            (item.type === 'checkbox' &&
              typeof backfillingPayData.value[item.field][0] === 'object')
          ) {
            item.selectedNodes = []
            item.value = backfillingPayData.value[item.field].map((o: any) => {
              return o.value.value
            })
            item.options.forEach((op: any, index: number) => {
              const obj = backfillingPayData.value[item.field].find(
                (h: any) => {
                  return h.value.value === op.value
                }
              )
              if (obj) {
                if (item.options[index].childForm) {
                  item.options[index].childForm.forEach((cf: any) => {
                    cf = initBase(cf)
                    cf.value = obj.childForm[cf.field]
                  })
                  item.hasGangedPanel = true
                }
                item.selectedNodes.push({ data: item.options[index] })
              }
            })
            item.itemTabValue = item.selectedNodes[0].data.value
          }
        }
      })
    }
  }
  return item
}
const initData = (data: any) => {
  // console.log(data)
  data.forEach((item: any, index: number) => {
    if (item.groupFormJson) {
      initData(item.groupFormJson)
    } else {
      data[index] = initDataItem(item)
      if (data[index].selectedNodes && data[index].selectedNodes.length > 0) {
        data[index].selectedNodes.forEach((o: any, i: any) => {
          if (data[index].selectedNodes[i].data.childForm) {
            data[index].selectedNodes[i].data.childForm = o.data.childForm.map(
              (m: any) => {
                return (m = initDataItem(m))
              }
            )
          }
        })
      }
    }
  })
  return data
}

// 处理特殊回显数据
function handleItems(data: any) {
  // checkbox回显可能是逗号隔开的字符串，若非数组则处理成数组，用于el-checkbox的v-model回显
  if (data.type === 'checkbox') {
    data.value = isObject(data.value) ? data.value : data.value?.split(',')
  }
  return data
}

initData(formData.configData)
const getName = (str: any) => {
  console.log('parentName------', str)
}
provide('formCreateObj', {
  initData,
  getName,
})
defineExpose({
  submitForm,
  submitFormList,
})
</script>
<style lang="scss">
.form-Create-style {
  .form-span {
    .el-form-item__label {
      // padding-right:0;
      color: #f5a623;
    }
  }

  .el-form-item__error {
    position: static;
  }

  .el-form-item__content {
    height: auto;
  }

  .el-tabs__content {
    padding-top: 20px;
  }

  .el-tabs__nav-wrap::after,
  .el-tabs__active-bar {
    display: block !important;
  }

  .el-tabs__item.is-active {
    background-color: transparent !important;
  }

  .form-info {
    font-size: 13px;
    color: #888;
    // padding-left: 120px !important;
    line-height: 18px;
  }

  .tab-style {
    margin-top: 10px;
  }

  .el-tabs__item.is-active {
    // background-color: var(--main-primary);
    // color: #fff;
    // padding: 0 10px !important;
    // padding-left: 10px !important;
  }

  .el-tabs__nav-wrap::after {
    // background-color: var(--main-primary);
  }

  .el-tabs--top .el-tabs__item.is-top:nth-child(2) {
    padding-left: 0 !important;
  }

  .el-tabs--top .el-tabs__item.is-top:last-child {
    padding-right: 0 !important;
  }

  .el-form-item__label {
    width: 150px;
    text-align: right;
    // line-height: 18px;
  }

  .cascader-tab-style {
    .cascader-tab {
      border-radius: 8px;
      padding: 20px 20px 10px 20px;
      background-color: rgb(247, 247, 247);
    }

    .cascader-one {
      transform: translateX(-120px);
    }

    // margin-left: 150px;
    // width: calc(100% - 250px);
    .form-info {
      padding-left: 20px;
    }

    .el-form-item__label {
      width: 120px;
    }

    // overflow: hidden;
    .el-tabs__header {
      // background-color: rgba(64, 158, 255, 0.05);
    }

    .el-tabs__item {
      height: 40px;
    }
  }

  .el-select .el-input__inner {
    width: 300px;
  }

  .form-item-label {
    width: 150px;
    text-align: right;
    font-size: 14px;
    display: inline-block;
    padding-right: 12px;
    box-sizing: border-box;
    line-height: 32px;
  }

  .form-item-group {
    overflow: hidden;
    margin-bottom: 20px;

    .form-item-label {
      float: left;
    }
  }

  .form-item-right-group {
    border-radius: 5px;
    padding: 15px;
    float: left;
  }

  .form-item-bg {
    background-color: rgb(247, 247, 247);
  }
}
</style>
