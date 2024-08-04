<!--
 * @Author: your name
 * @Date: 2022-01-07 16:34:54
 * @LastEditTime: 2022-03-22 09:23:25
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: /management/src/apps/platform/views/systemConfig/configComponents/mapPop.vue
-->
<template lang="pug">
#mapPop
  .input-map-header
    input(placeholder="key" readonly)
    input(placeholder="value" readonly)
    input(placeholder="操作" readonly)
  .map-list-box
    el-table(:data="mapEditList" border type="index" max-height="auto" :show-header="false")
      el-table-column(prop="key" align="center" :resizable="false")
        template(#default="scope")
          input(align="center" v-model="scope.row.key")
      el-table-column(prop="value" :show-overflow-tooltip="true" align="center" :resizable="false")
        template(#default="scope")
          input(:ref="`inputSpace-${scope.$index}`" align="center" v-model="scope.row.value" :readonly="scope.row.edit")
      el-table-column(prop="操作" :show-overflow-tooltip="true" align="center" :resizable="false")
        template(#default="scope")
          el-button(textColor="red" type="text" size="small" @click="remove(scope.$index)") 删除
  .input-map
    input(placeholder="请输入新键" v-model="newMapValue.key")
    input(placeholder="请输入新值" v-model="newMapValue.value")
    div.flex-center
      el-button(@click='addKeyValue' type="text" size="small") 添加
  .float-right
    el-button(type="primary" size="mini" style="margin-top:1rem;" @click="recover" plain) 恢复
    el-button(type="primary" size="mini" style="margin-top:1rem;" @click="save") 保存
  //- pre {{mapEditList}}
  //- pre {{oldData}}
</template>
<script lang="ts">
import { ElMessage } from 'element-plus'
import { defineComponent, watch, ref } from 'vue'

export default defineComponent({
  props: {
    rowData: String,
    rowOldData: String,
    index: Number
  },
  setup(props: any, context: any) {
    const newMapValue: any = ref({
      key: null,
      value: null
    })
    const mapEditList: any = ref([])
    const oldData: any = ref([])
    const showPop: any = ref(false)
    // })

    const initMapData = (data: any) => {
      const obj = JSON.parse(data)
      const arr = Object.keys(obj).map((key) => {
        return { key: key, value: obj[key] }
      })
      return arr
    }
    mapEditList.value = initMapData(props.rowData)
    oldData.value = initMapData(props.rowOldData)

    const addKeyValue = () => {
      console.log(mapEditList.value)
      if (!newMapValue.value.key || !newMapValue.value.value) {
        ElMessage.warning('键值不能为空')
        return
      }
      const data = {
        key: newMapValue.value.key,
        value: newMapValue.value.value,
        edit: true,
        oldKey: newMapValue.value.key,
        oldVal: newMapValue.value.value
      }
      mapEditList.value.unshift(data)
      newMapValue.value.key = ''
      newMapValue.value.value = ''
    }

    const save = () => {
      console.log(mapEditList.value)
      const obj: any = {}
      for (let i of mapEditList.value) {
        obj[i.key] = i.value
      }
      const rowNewData = {
        value: JSON.stringify(obj),
        oldValue: JSON.stringify(props.rowOldData),
        edit: true,
        showPop: false
      }
      context.emit('change-row', rowNewData, props.index, false)
    }
    const recover = () => {
      mapEditList.value = JSON.parse(JSON.stringify(oldData.value))
    }

    const remove = (index: any) => {
      console.log(mapEditList.value, index)
      mapEditList.value.splice(index, 1)
      //
    }
    return {
      newMapValue,
      mapEditList,
      addKeyValue,
      recover,
      oldData,
      save,
      showPop,
      remove
    }
  }
})
</script>
<style lang="scss" scoped>
#mapPop {
  margin-top: 10px;
  .map-list-box {
    max-height: 40vh;
    overflow: hidden;
    overflow-y: auto;
    &::-webkit-scrollbar {
      display: none;
    }
    input {
      border: none;
      outline: none;
      background-color: transparent;
      text-align: center;
      color: #606266;
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
      width: 90%;
      line-height: 0;
    }
  }
  .input-map,
  .input-map-header,
  .input-map-handle {
    display: flex;
    input,
    div {
      width: 100%;
      outline: none;
      border: none;
      text-align: center;
      border: 1px solid #ebeef5;
      height: 32px;
      border-radius: 0;
      padding: 4px;
      box-sizing: border-box;
      font-size: 0.75rem;
      color: #606266;
      background-color: #ebeef557;
    }
  }
  .input-map {
    input,
    div {
      border-top: none;
      &:nth-child(1) {
        border-right: none;
        border-radius: 0 0 0 3px;
        width: 133px;
        flex-shrink: 0;
      }
      &:nth-child(2) {
        border-right: none;
      }
      &:nth-child(3) {
        border-radius: 0 0 3px 0;
      }
    }
  }
  .input-map-header {
    input {
      border-bottom: none;
      &:nth-child(1) {
        border-right: none;
        border-radius: 3px 0 0 0;
        width: 133px;
        flex-shrink: 0;
      }
      &:nth-child(2) {
        border-right: none;
      }
      &:nth-child(3) {
        border-radius: 0 3px 0 0;
      }
    }
  }

  .flex-center {
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
</style>
