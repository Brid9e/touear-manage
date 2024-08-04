<template lang="pug">
#mapEdit
  .input-map-header
    input(placeholder="key" readonly)
    input(placeholder="value" readonly)
    input(placeholder="操作" readonly)
  .map-list-box
    el-table(:data="mapEditList" border type="index" max-height="auto" :show-header="false")
      el-table-column(prop="key" align="center" :resizable="false")
        template(#default="scope")
          input(align="center" v-model="scope.row.key" disabled )
      el-table-column(prop="value" :show-overflow-tooltip="true" align="center" :resizable="false")
        template(#default="scope")
          input(:ref="`inputSpace-${scope.$index}`" align="center" v-model="scope.row.value" :readonly="scope.row.edit")
      el-table-column(prop="操作" :show-overflow-tooltip="true" align="center" :resizable="false")
        template(#default="scope")
          el-button(v-if="scope.row.edit === true" @click="editRow(scope.row, scope.$index)" type="text" size="small") 编辑
          el-button(v-if="scope.row.edit === false" @click="save(scope.row)" type="text" size="small") 保存
          el-button(v-if="scope.row.edit === true" @click="deleteRow(scope.$index, mapEditList)" textColor="red" type="text" size="small") 删除
          el-button(v-if="scope.row.edit === false" @click="cancel(scope.row)" type="text" size="small") 取消
  .input-map
    input(placeholder="请输入新键" v-model="newMapValue.key")
    input(placeholder="请输入新值" v-model="newMapValue.value")
    div.flex-center
      el-button(@click='addKeyValue' type="text" size="small") 添加
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { ElMessage } from 'element-plus'

export default defineComponent({
  props: ['mapData'],
  data() {
    return {
      newMapValue: {
        key: '',
        value: ''
      },
      Arr: [],
      accObj: {},
      changed: false,
      mapEditList: Object.entries(JSON.parse(this.mapData)).map(([key, value]) => ({
        key,
        value,
        edit: true,
        oldKey: key,
        oldVal: value
      }))
    }
  },

  methods: {
    addKeyValue() {
      console.log(this.mapEditList)
      if (this.newMapValue.key === '' || this.newMapValue.value === '') {
        ElMessage.warning('键值不能为空')
        return
      }
      const data = {
        key: this.newMapValue.key,
        value: this.newMapValue.value,
        edit: true,
        oldKey: this.newMapValue.key,
        oldVal: this.newMapValue.value
      }
      this.mapEditList.unshift(data)
      this.newMapValue.key = ''
      this.newMapValue.value = ''
      this.submit()
    },
    editRow(data: any, index: number) {
      const refEle = `inputSpace-${index}`
      ;(this as any).$refs[refEle].focus()
      data.edit = false
      this.accObj = {}
    },
    // deleteRow(data: any) {},
    save(data: any) {
      data.oldKey = data.key
      data.oldVal = data.value
      data.edit = true
      this.submit()
    },
    cancel(data: any) {
      data.key = data.oldKey
      data.value = data.oldVal
      data.edit = true
    },
    deleteRow(index: number, data: any) {
      data.splice(index, 1)
      this.accObj = {}
      this.submit()
    },
    mapToJson(MAP: any, key: any, value: any) {
      return Object.keys(MAP).map(() => ({
        [key]: value
      }))[0]
    },
    // 格式化一下修改后的结果 删掉之前加入的一些副属性
    returnData(Arr: any) {
      for (const i of Arr) {
        delete i.oldVal
        delete i.oldKey
        delete i.edit
        const data_ = this.mapToJson(i, i.key, i.value)
        this.accObj = { ...this.accObj, ...data_ }
      }
    },
    submit() {
      const returnData_ = JSON.parse(JSON.stringify(this.mapEditList))
      this.returnData(returnData_)
      if (this.mapData !== JSON.stringify(this.accObj)) {
        this.changed = true
      } else {
        this.changed = false
      }
      this.$emit('returnData', JSON.stringify(this.accObj), this.changed)
    }

    // http://192.168.3.230:8787/berserker-base/config/edit 保存编辑
    // code: "test2"
    // description: "123"
    // id: -3
    // name: "测试2"
    // type: "2"
    // value: ...string...
  }
})
</script>

<style lang="scss" scope>
#mapEdit {
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
        width: 197px;
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
        width: 197px;
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
