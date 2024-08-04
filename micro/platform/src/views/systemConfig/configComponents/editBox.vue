<template lang="pug">
#edit
  el-dialog(title="编辑系统参数" v-model="showDialog" @closed="cancle" :before-close="beforeClose" :width="800" )
    el-form(label-width="70px" )
      el-form-item(label="代码")
        el-input(v-model="editData.code" disabled)
      el-form-item(label="名称")
        el-input(v-model="editData.name")
      el-form-item.setting(label="参数值")
        el-input(v-if="!(['1','2','3'].includes(editData.type))" v-model="editData.value" :disabled="editData.type !== '0'")
        //- list-edit(v-if="editData.type === '1' && show === true" :listData="editData.value" @returnData="getNewData" )
        //- map-edit(v-else-if="editData.type === '2' && show === true" :mapData="editData.value" @returnData="getNewData")
        json-edit(v-if="['1', '2'].includes(editData.type)" :jsonData='editData.value' @returnData="getNewData" @canSubmit="canSubmit")
        SelectorEdit(v-if="editData.type === '3'" :jsonData='editData.value' @returnData="getNewData" @canSubmit="canSubmit")
      el-form-item(label="描述")
        el-input(type="textarea" v-model="editData.description")
    template(#footer)
      el-button(@click="beforeClose") 取消
      el-button(type="primary" @click="confirm") 确认
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import mapEdit from './mapEdit.vue'
import listEdit from './listEdit.vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import subDialog from '@/components/subDialog.vue'
import { SystemConfig } from '@/service/platform/index'
import { msgbox, IMsgBoxOptions } from '@/hooks/subMessageBox'
import JsonEdit from './jsonEdit.vue'
import SelectorEdit from './selectorEdit.vue'
import { isTupleExpression } from '@babel/types'

export default defineComponent({
  components: {
    mapEdit,
    listEdit,
    subDialog,
    JsonEdit,
    SelectorEdit
  },
  props: ['show', 'data', 'index'],

  data() {
    return {
      editData: [] as any,
      showDialog: false,
      changed: false,
      confirmData: '',
      cancelData: {},
      direction: false,
      isTrue: true
    }
  },
  watch: {
    show(boolean) {
      this.showDialog = boolean
      if (boolean === true) {
        const editData = JSON.stringify(this.data)
        this.editData = JSON.parse(editData)
      }
    },
    data(data) {
      console.log(data)
      // const editData = JSON.stringify(data)
      this.editData = data
    }
    // editData(data) {
    //   this.getData = data
    // }
  },
  // mounted() {
  //   const editData = JSON.stringify(this.data)
  //   this.editData = JSON.parse(editData)
  // },
  methods: {
    showDiawer(val: any) {
      this.direction = val
    },
    beforeClose() {
      if (this.changed === true) {
        ElMessageBox.confirm('检测到您的参数值有改动，还未保存, 是否退出?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.cancle()
          this.changed = false
          this.confirmData = ''
        })

      } else {
        this.cancle()
      }
    },
    cancle() {
      this.editData.type = 0
      this.$emit('update:show', false)
    },
    async confirm() {
      if (!this.isTrue) {
        ElMessage.error('同级Key值不能重复，请检查。')
        return
      }
      const params = {
        code: this.data.code,
        description: (this.editData as any).description,
        id: this.data.id,
        name: (this.editData as any).name,
        type: this.data.type,
        value: this.confirmData ? this.confirmData : (this.editData as any).value
      }
      const { code, msg }: any = await SystemConfig.edit(params)
      if (code === 200) {
        ElMessage.success(msg)
        this.changed = false
        this.cancle()
        this.$emit('update-list')
      } else {
        ElMessage.error(msg)
      }
    },
    getNewData(str: string, status: boolean) {
      this.changed = status
      this.confirmData = str
    },
    canSubmit(boolean: boolean) {
      this.isTrue = boolean
    }
    // /berserker-base/config/edit
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
#edit {
  .el-dialog__header {
    display: flex;
  }

  p {
    width: 100%;
    color: white;
  }

  .el-table__header tr,
  .el-table__header th {
    padding: 4px;
    height: 20px;
  }

  .el-table__body tr,
  .el-table__body td {
    padding: 4px;
    height: 20px;
  }

  .el-form-item--small.el-form-item {
    margin-bottom: 10px;
  }
}
</style>
