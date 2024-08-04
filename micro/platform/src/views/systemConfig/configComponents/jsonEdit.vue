<!--
 * @Author: your name
 * @Date: 2022-04-24 16:32:01
 * @LastEditTime: 2022-06-17 14:17:54
 * @LastEditors: error: git config user.name && git config user.email & please set dead value or install git
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: /management/src/apps/platform/views/systemConfig/configComponents/jsonEdit.vue
-->
<template lang="pug">
el-scrollbar.json-edit(ref='JsonEdit')
  el-tree(:data="data_" :default-expand-all="false" :highlight-current="false")
    template(#default="{ node, data }")
      el-input(v-model="data.label" @click="val => val.stopPropagation()"  @focusin="val => saveInput(node, val)"  @focusout="clearInput" v-if="!(data.parentType === 'array') && data?.label !== undefined" @blur="pushData(data_)" @input="val => getChangeVal(node, val, 'label')")
      span(style="margin: 0 10px;color:#c0c4cc;" v-if="!(data.parentType === 'array') && data?.label !== undefined") :
      //- el-input(:class="{'is-number-value': data.dataType === 'number'}" v-model="data.value" @click="val => val.stopPropagation()" :disabled="data?.children?.length > 0"  @blur="pushData(data_)" @input="val => getChangeVal(node, val, 'value')")
      el-color-picker(v-if="data.dataType === 'color'" v-model="data.value" @blur="pushData(data_)" @click="val => val.stopPropagation()" @change="val => getChangeVal(node, val, 'value')" show-alpha)
      el-input(v-else :class="{'is-number-value': data.dataType === 'number'}" v-model="data.value" @click="val => val.stopPropagation()" :disabled="data?.children?.length > 0"  @blur="pushData(data_)" @input="val => getChangeVal(node, val, 'value')")
      span(style="margin: 0 5px;color:#c0c4cc;") ·
      el-select(v-model="data.dataType" @blur="pushData(data_)")
        el-option(v-for="item in dataTypeList" :key="item.code" :label="item.label" :value="item.code")
      el-button(style="margin-left: 5px;" @click="val => addChildren(val, data, node)" :disabled="data?.dataType == 'string'" type="primary" link) 添加
      el-popconfirm(:title="`${childNum > 0 ? `该条参数共有${childNum}条子级，` : ''}你确定要删除这条数据吗？`" :hide-icon="true"  @confirm="val => deleteChildren(val, data, node)" )
        template(#reference)
          el-button(style="margin-left: 5px;" @click="getChildNum(node)" link type="danger") 删除
  .box-right
    el-button(type="text" @click="addData(data_)" style="margin-right: 5px;") 添加一条新参数
</template>
<script lang="ts">
import { defineComponent, ref, reactive, toRefs, onMounted, watch, nextTick } from 'vue'
import { ElMessage } from 'element-plus'
import _ from 'lodash'
export default defineComponent({
  components: {},
  props: ['jsonData'],
  setup(prop, context) {
    interface Catch {
      [key: string]: any
    }
    const data_: any = ref([])
    const dataType = ref('')
    const data = ref()
    const oldData = ref('')
    const changed = ref(false)
    const isTrue = ref<any>({})
    const isTrueArr = ref<any>([])
    const oData = ref<Array<string>>([])
    const childNum = ref(0)
    const status = ref(false)
    const catchObj: Catch = reactive({})
    const JsonEdit: any = ref()
    const inputDom = ref()
    const dataTypeList = reactive([
      {
        label: '字符串',
        code: 'string'
      },
      {
        label: '对象',
        code: 'object'
      },
      {
        label: '数组',
        code: 'array'
      },
      {
        label: '数字',
        code: 'number'
      },
      {
        label: '颜色',
        code: 'color'
      },
    ])

    // 监听isTrueArr的不变化 将状态返回至上一层组件
    watch(isTrueArr, (r: any) => {
      const isValue = ref(false)
      if (r.length > 0 && r.includes(false)) {
        isValue.value = false
      } else {
        isValue.value = true
      }
      if (JSON.stringify(r) !== '{}') {
        context.emit('canSubmit', isValue.value)
      }
    })

    //添加子级
    const addChildren = (e: any, data: any, node: any) => {
      e.stopPropagation()
      node.expanded = true
      // node.data?.dataType
      if (catchObj[node.id]) {
        let obj = { label: node.childNodes.length, value: '', children: [], parentType: 'array', dataType: node.data.children[0].dataType }
        Object.keys(catchObj[node.id].keyValue).map((key: any) => {
          let obj_ = { label: '', value: '' }
          obj_['label'] = key
          obj_['value'] = ''
          obj.children.push(obj_ as never)
        })
        obj.value = JSON.stringify(treeDataToTransform(obj.children))
        data.children.push(obj)
        return
      }
      if (!data.dataType) {
        ElMessage.warning('请先选择数据类型')
        return
      }
      if (data.children == null) {
        data.children = []
      }
      let dataType: any = {}
      if (node.data?.dataType === 'array') {
        let objNum: any = {}
        for (let val of node.childNodes) {
          if (val.data.dataType === 'object') {
            if (!dataType[val.data.dataType]) dataType[val.data.dataType] = 1
            else dataType[val.data.dataType] = dataType[val.data.dataType] + 1
            let obj = {}
            try {
              obj = JSON.parse(val.data.value)
            } catch {
              obj = val.data.value
            }
            Object.keys(obj).map((key: any) => {
              if (!objNum[key]) {
                objNum[key] = 1
              } else {
                objNum[key]++
              }
            })
          }
        }
        if (objNum) {
          const a = Object.keys(objNum).map((key: any) => {
            return objNum[key] === node.childNodes.length && node.childNodes.length >= 2
          })
          for (let val of a) {
            if (val !== true) status.value = false
            else status.value = true
          }
        }
        if (status.value) {
          let obj = { label: node.childNodes.length, value: '', children: [], parentType: 'array', dataType: node.data.children[0].dataType }
          Object.keys(objNum).map((key: any) => {
            let obj_ = { label: '', value: '' }
            obj_['label'] = key
            obj_['value'] = ''
            obj.children.push(obj_ as never)
          })
          obj.value = JSON.stringify(treeDataToTransform(obj.children))
          catchObj[node.id] = { keyValue: objNum, dataType: node.data.children[0].dataType }
          data.children.push(obj)
          return
        }
        // obj.value = JSON.stringify(treeDataToTransform(obj.children))
        data.children.push({ label: node.childNodes.length, value: '', parentType: 'array' })
        return
      }
      data.children.push({ label: '' })
    }

    // 获取子级数量，用于删除时的谨慎提醒
    const getChildNum = (node: any) => {
      childNum.value = node?.childNodes?.length
    }

    //输入框获取到焦点的时候，拿到输入框的dom实例，并且将输入框的唯一id作为key值存入isTrue对象中，用于提交时判断是否存在相同的key值
    const saveInput = (node: any, e: any) => {
      let labelArr = []
      try {
        labelArr = node.parent.data.map((item: any) => {
          if (item.$treeNodeId !== node.id) return _.toLower(item.label)
        })
      } catch {
        labelArr = node.parent.data.children.map((item: any) => {
          if (item.$treeNodeId !== node.id) return _.toLower(item.label)
        })
      }
      oData.value = labelArr
      // _.pull(oData.value, node.data.label)
      inputDom.value = e.target
    }

    // 失去焦点的一些操作
    const clearInput = () => {
      inputDom.value = null
    }

    //删除项
    const deleteChildren = (e: any, data: any, node: any) => {
      delete isTrue.value[node.id]
      if (node.level === 1) {
        _.remove(node.parent.data, function(r: any) {
          return r.$treeNodeId == node.id
        })
      } else {
        _.remove(node.parent.data.children, function(r: any) {
          return r.$treeNodeId == node.id
        })
      }
      pushData(data_.value)
      // node.parent.data.children.splice(0, 1)
    }

    //添加项，该添加方法对应最外层"添加一条新参数"的按钮
    const addData = async (data: any) => {
      if (dataType.value === 'array') {
        let obj = { label: data.length, value: '', parentType: 'array' }
        data.push(obj)
      } else {
        data.push({ label: '' })
      }
      await nextTick()
      JsonEdit.value.scrollTop = JsonEdit.value.scrollHeight
    }

    // 获取更改的值，用于子级修改内容后，实时更新父级输入框内容
    const getChangeVal = (node: any, val: any, type: string) => {
      // if语句是用于处理输入的值已经存在的情况
      if (type === 'label') {
        if (val && oData.value.includes(_.toLower(val))) {
          inputDom.value.parentNode.classList.add('is-error-r')
          isTrue.value[node.id] = false
        } else {
          inputDom.value.parentNode.classList.remove('is-error-r')
          isTrue.value[node.id] = true
        }
      }
      node.parent.data.value = JSON.stringify(treeDataToTransform(node.parent.data.children, node.parent.data.dataType))
    }

    // el-tree结构解析为原始json数据结构
    const treeDataToTransform = (data: any, dataType?: string) => {
      let objData: any = {}
      let isArray = false
      if (dataType === 'array') isArray = true
      if (Object.prototype.toString.call(data) === '[object Array]') {
        let obj: any = {}
        let i = 0
        for (let val of data) {
          if (!val.children || val.children.length < 1) {
            try {
              obj[val.label || i] = val.dataType !== 'string' ? JSON.parse(val.value) : String(val.value)
            } catch (error) {
              obj[val.label || i] = val.value
            }
          } else {
            obj[val.label || i] = treeDataToTransform(val.children, val.dataType)
          }
          // if (isArray) {
          //   objData = [...arr, ...objData]
          // } else {
          objData = { ...obj, ...objData }
          // }
          i++
        }
      }
      if (isArray) {
        let arr: unknown[] = []
        Object.keys(objData).map((key: any) => {
          arr.push(objData[key])
        })
        objData = arr
      }
      console.log(objData)
      return objData
    }

    // 原始json数据结构解析为el-tree结构
    const transformToTreeData = (obj: any, parentType?: string): Array<string | number | unknown> => {
      // 返回数组,数组的每个项必须是一个对象，对象必须有一个label属性和children属性
      const treeArr = []
      if (typeof obj === 'object') {
        const _type = (data: any) => {
          let isObject: any = false
          let isArray: any = false
          let isNumber: any = false
          let isColor: any = false
          if (typeof data === 'string') {
            try {
              if (isColorString(data)) isColor = true
              if (typeof JSON.parse(data) === 'object') isObject = true
              if (Array.isArray(JSON.parse(data))) isArray = true
            } catch {
              isObject = false
              isArray = false
            }
          } else {
            if (typeof data === 'number') isNumber = true
            if (typeof data === 'object') isObject = true
            if (Array.isArray(data)) isArray = true
          }
          return isObject ? isArray ? 'array' : 'object' : isNumber ? 'number' : isColor ? 'color' : 'string'
        }
        for (const _key in obj) {
          if (Object.prototype.hasOwnProperty.call(obj, _key)) {
            if (Object.prototype.toString.call(obj[_key]) === '[object Array]') {
              const arr = obj[_key]
              const children = []
              for (let i = 0; i < arr.length; i++) {
                const arrItem = arr[i]
                children.push({
                  dataType: _type(arrItem),
                  value: _type(arrItem) !== 'string' ? JSON.stringify(arrItem) : arrItem,
                  parentType: parentType || null,
                  children: _type(arrItem) !== 'string' ? transformToTreeData(arrItem, _type(arrItem)) : undefined
                })
              }

              let item = {
                label: _key,
                dataType: 'array',
                value: JSON.stringify(obj[_key]),
                parentType: parentType || null,
                children
              }
              treeArr.push(item)
            } else if (Object.prototype.toString.call(obj[_key]) === '[object Object]') {
              const item: any = {
                label: _key,
                value: JSON.stringify(obj[_key]),
                dataType: 'object',
                parentType: parentType || null,
                children: transformToTreeData(obj[_key], 'object')
              }
              treeArr.push(item)
            } else {
              let isObject: any = false
              let isArray: any = false
              if (typeof obj[_key] === 'string') {
                try {
                  if (typeof JSON.parse(obj[_key]) === 'object') isObject = true
                  if (Array.isArray(JSON.parse(obj[_key]))) isArray = true
                } catch {
                  isObject = false
                  isArray = false
                }
              } else {
                if (typeof obj[_key] === 'object') isObject = true
                if (Array.isArray(obj[_key])) isArray = true
              }
              let _obj = { label: _key, value: obj[_key], children: isObject ? transformToTreeData(JSON.parse(obj[_key]), _type(obj[_key])) : undefined, dataType: _type(obj[_key]), parentType: parentType || null }
              treeArr.push(_obj)
            }
          }
        }
      } else {
        treeArr.push({
          label: obj
        })
      }
      return treeArr
    }

    //处理数据，将最终数据从组件发送出去
    const pushData = (data: any) => {
      isTrueArr.value = Object.keys(isTrue.value).map((key: any) => {
        return isTrue.value[key]
      })
      let ArrayData
      if (dataType.value === 'array') {
        let finaArr = []
        let count = Number(Object.getOwnPropertyNames(treeDataToTransform(data))[Object.getOwnPropertyNames(treeDataToTransform(data)).length - 1]) + 1
        for (let i = 0; i < count; i++) {
          finaArr.push(treeDataToTransform(data)[i])
        }
        ArrayData = finaArr
      } else {
        let finaArr = treeDataToTransform(data)
        for (let i in finaArr) {
          if (!['string', 'number']?.includes(typeof finaArr[i])) {
            finaArr[i] = JSON.stringify(finaArr[i])
          }
        }
        ArrayData = finaArr
      }
      if (JSON.stringify(ArrayData) === oldData.value) changed.value = false
      else changed.value = true
      context.emit('returnData', JSON.stringify(ArrayData), changed.value)
    }


    /**
     * 是否是色值
     * @param str
     */
    function isColorString(str: string) {
      // 定义正则表达式
      const colorRegex = /^#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6})$|^rgba?\(\s*(\d{1,3}\s*,\s*){2}\d{1,3}\s*(,\s*(0|1|0?\.\d+)\s*)?\)$|^hsla?\(\s*\d{1,3}\s*,\s*\d{1,3}%\s*,\s*\d{1,3}%\s*(,\s*(0|1|0?\.\d+)\s*)?\)$/;
      // 测试字符串是否匹配正则表达式
      return colorRegex.test(str);
    }


    // 初始化，湖区jsonData并进行初步获取数据类型
    onMounted(() => {
      oldData.value = prop.jsonData
      try {
        Array.isArray(JSON.parse(prop.jsonData)) ? (dataType.value = 'array') : (dataType.value = 'object')
        data_.value = transformToTreeData(JSON.parse(prop.jsonData), dataType.value)
      } catch {
        dataType.value = 'string'
        data_.value = transformToTreeData(prop.jsonData, dataType.value)
        // Array.isArray(prop.jsonData) ? (dataType.value = 'array') : (dataType.value = 'object')
      }
    })

    return {
      dataType,
      data,
      data_,
      addData,
      addChildren,
      dataTypeList,
      deleteChildren,
      pushData,
      JsonEdit,
      childNum,
      getChildNum,
      getChangeVal,
      saveInput,
      clearInput
    }
  }
})
</script>

<style lang="scss" scoped>
.json-edit {
  .el-input {
    width: auto;
  }

  // color: white;
  width: 100%;
  max-height: 35vh;
  // margin-top: 18px;
  border: 1px solid var(--el-border-color-light);
  border-radius: var(--el-border-radius-base);
  padding: 10px;
  box-sizing: border-box;

  .box-right {
    z-index: 99;
    flex-direction: column;
    text-align: right !important;
    // margin-left: 22px;
  }

  &::-webkit-scrollbar {
    display: none;
  }

  // border: 1px solid #ccc;
  // border-radius: 4px;
  // &::-webkit-scrollbar {
  //   display: none;
  // }
  :deep(.el-tree-node__content) {
    margin-bottom: 2px !important;
    height: 40px;
  }
}

.json-row {
  display: flex !important;
}

.el-tree {
  // margin-top: 35px;
}

:deep(.el-tree-node) {
  .el-tree-node__content {
    border-radius: var(--el-border-radius-base);
    padding: 0 5px;
  }

  .el-tree-node__content>.el-tree-node__expand-icon {
    padding: 0;
    margin-right: 10px;
  }
}

.el-select {
  width: 90px !important;
  flex-shrink: 0;
}

:deep(.is-error-r) {
  box-shadow: 0 0 0 1px var(--el-color-danger) inset !important;

  .el-input__inner {
    color: var(--el-color-danger) !important;
  }
}

.el-input {
  width: 100% !important;
}

.is-number-value {
  :deep(.el-input__inner) {
    color: var(--el-color-primary) !important;
  }
}

:deep(.el-color-picker) {
  width: 100%;

  .el-color-picker__trigger {
    width: 100% !important;
    padding: 0;
  }
}
</style>