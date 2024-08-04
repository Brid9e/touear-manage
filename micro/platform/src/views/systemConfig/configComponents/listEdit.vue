<!--
 * @Author: your name
 * @Date: 2021-08-24 14:58:04
 * @LastEditTime: 2022-03-22 10:07:19
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /management/src/components/systemConfig/configComponents/listEdit.vue
-->
<template lang="pug">
#listEdit
  .input-map-header
    input(placeholder="value" readonly)
    input(placeholder="操作" readonly)
  .map-list-box
    el-table(:data="listDataByKey" border type="index" max-height="auto" :show-header="false")
      el-table-column(prop="value" label="Map" align="center" :resizable="false")
        template(#default="scope")
          input(:ref="`inputSpace-${scope.$index}`" align="center" v-model="scope.row.value" :readonly="scope.row.edit")
      el-table-column(label="操作" align="center" :resizable="false")
        template(#default="scope")
          el-button(v-if="scope.row.edit === true" @click="editRow(scope.row, scope.$index)" type="text" size="small") 编辑
          el-button(v-if="scope.row.edit === false" @click="save(scope.row)" type="text" size="small") 保存
          el-button(v-if="scope.row.edit === true" @click="deleteRow(scope.$index, listDataByKey)" type="text" size="small") 删除
          el-button(v-if="scope.row.edit === false" @click="cancel(scope.row)" type="text" size="small") 取消
          el-popover(v-if="(JSON.parse(scope.row.value) instanceof Object)" placement="right" :width="400" trigger="click" v-model:visible="scope.row.showPop" )
            template(#reference)
              el-button(type="text" size="small" ) Map模式
            //- input(v-model='scope.row.value')
            map-pop(:rowData="scope.row.value" :rowOldData="scope.row.oldValue" @change-row="getChangeRow" :index="scope.$index")
  .input-map
    input(placeholder="新值"  v-model="newVal")
    div.flex-center
      el-button(type="text" size="small" @click="addNewVal") 添加
      //- el-popover(v-model:visible="showAddPopover" placement="right" :width="400" trigger="click")
        template(#reference)
          el-button(type="text" size="small") 添加
        //- add-pop
    
</template>

<script lang="ts">
import { ElMessage } from 'element-plus'
import { defineComponent } from 'vue'
import mapPop from './mapPop.vue'
import addPop from './addPop.vue'
export default defineComponent({
  components: {
    mapPop,
    addPop
  },
  props: ['listData'],
  data() {
    return {
      listDataList: JSON.parse(this.listData),
      listDataByKey: [],
      newVal: '',
      accObj: [],
      changed: false,
      newArr: [],
      mapEditList: [],
      showPop: false
    }
  },
  mounted() {
    JSON.parse(this.listData).forEach((element: any) => {
      const obj: any = {}
      obj.value = JSON.stringify(element)
      obj.oldValue = JSON.stringify(element)
      obj.edit = true
      obj.showPop = false
      ;(this.listDataByKey as any).push(obj)
    })
  },
  methods: {
    addNewVal() {
      if (this.newVal !== '') {
        const obj: any = {}
        obj.value = this.newVal
        obj.oldValue = this.newVal
        obj.edit = true
        obj.showPop = false
        ;(this.listDataByKey as any).unshift(obj)
        this.newVal = ''
        this.submit()
      } else {
        ElMessage.warning('新增List值不能为空')
      }
    },
    editRow(data: any, index: number) {
      data.edit = false
      const refEle = `inputSpace-${index}`
      ;(this as any).$refs[refEle].focus()
      this.accObj = []
    },
    cancel(data: any) {
      data.value = data.oldValue
      data.edit = true
    },
    save(data: any) {
      data.edit = true
      data.oldValue = data.value
      this.submit()
    },
    deleteRow(index: number, data: any) {
      data.splice(index, 1)
      this.submit()
    },
    getChangeRow(data: any, index: number, popStatus: boolean) {
      // console.log('rowVal', data, index, popStatus)
      ;(this.listDataByKey as any)[index] = data
      this.submit()
      // ;(this.listDataByKey as any)[val.index] = `${val.data}`
    },
    // 格式化一下修改后的结果 删掉之前加入的一些副属性
    returnData(Arr: any) {
      this.newArr = []
      // console.log(Arr)
      for (const i of Arr) {
        delete i.oldValue
        delete i.edit
        // this.newArr.push(Arr[i])
        // console.log('value', JSON.parse(i.value))
        // console.log(typeof JSON.parse(i.value))
        ;(this.newArr as any).push(typeof JSON.parse(i.value) == 'object' ? JSON.parse(i.value) : i.value)
      }
      this.accObj = this.newArr
    },

    submit() {
      const returnData_ = JSON.parse(JSON.stringify(this.listDataByKey))
      this.returnData(returnData_)
      const accObj = JSON.parse(JSON.stringify(this.accObj))
      if (this.listData !== JSON.stringify(this.accObj)) {
        this.changed = true
      } else {
        this.changed = false
      }
      // console.log(accObj)
      this.$emit('returnData', JSON.stringify(accObj), this.changed)
    }
  }
})
</script>

<style lang="scss" scope>
#listEdit {
  margin-top: 10px;
  // background-color: red !important;

  .map-list-box {
    max-height: 22vh;
    overflow: hidden;
    overflow-y: auto;
    ::v-deep .el-popover {
      background-color: red !important;
    }
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
      text-align: center;
      border: 1px solid #ebeef5;
      height: 32px;
      border-radius: 0;
      padding: 4px;
      box-sizing: border-box;
      font-size: 12px;
      color: #606266;
      background-color: #ebeef557;
    }
  }
  .input-map {
    display: flex;
    input,
    div {
      border-top: none;
      &:nth-child(1) {
        // border-right: none;
        border-radius: 0 0 3px 0;
      }
      &:nth-child(2) {
        border-radius: 0 0 3px 0;
      }
    }
  }
  .input-map-header {
    display: flex;
    input {
      border-bottom: none;
      &:nth-child(1) {
        border-right: none;
        border-radius: 3px 0 0 0;
      }
      &:nth-child(2) {
        border-radius: 0 3px 0 0;
      }
    }
  }
  .input-map-handle {
    display: flex;
  }

  .flex-center {
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
</style>
