<template lang="pug">
el-dialog(v-model='modelValue', :width='400', title='设置顺序' customClass='pay-sort')
  p.font-size-14.text-gray-6.tip.text-warning *上下拖拽可修改顺序
  el-table(v-if="modelValue" class="table-sort" :data='sortArr' :row-key="getRowKeys" ref="tableRef") 
    el-table-column(label='名称' align="center")
      template(#default='scope')
        el-tag {{ scope.row.value.label }}
  template(#footer='')
    span.dialog-footer
      el-button(@click='close') 取 消
      el-button(type='primary', @click='confirmSort') 确 定
</template>
<script lang="ts" setup>
import { ref, computed, reactive, onActivated, nextTick, onMounted, watch } from 'vue'
import Sortable from 'sortablejs'
import _ from 'lodash'
// const emits = defineEmits<{
//   (e: 'update:modelValue', v: boolean): void
// }>()
const emits = defineEmits(["update:modelValue", "getSort"])
const props = defineProps(['modelValue', 'data'])
const close = () => {
  emits('update:modelValue', false)
}
let sortArr = ref([])
const addedGetRowKeys = (row: any) => {
  return row.value.value
}
const tableRef = ref()
const initSortable = async () => {
  await nextTick()
  const tbody: any = document.querySelector('.table-sort .el-table__body-wrapper tbody')
  console.log(888, 'tbody', tbody)
  Sortable.create(tbody, {
    animation: 200,
    onEnd: (e: any) => {
      resARrr.splice(e.newIndex, 0, resARrr.splice(e.oldIndex, 1)[0])
    }
  })
}
const confirmSort = () => {
  emits('getSort', resARrr)
  emits('update:modelValue', false)
}
let resARrr: any = []
watch(() => props.modelValue, (newData, oldData) => {
  console.log('watch--modelValue', oldData, newData)
  if (newData) {
    sortArr.value = props.data
    resARrr = _.cloneDeep(sortArr.value)
    initSortable()
  }
})
</script>
<style lang="scss">
.pay-sort {
  .el-table__header-wrapper {
    display: none;
  }

  .el-table__cell {
    padding: 4px 0 !important;
    border-bottom: 0 !important;
  }

  .el-table__inner-wrapper::before {
    display: none;
  }

  .el-tag {
    padding: 10px 0 !important;
    width: 100% !important;
    height: 30px;
    cursor: pointer;
  }

  .el-dialog__body {
    padding-top: 10px;
  }

  .tip {
    margin-bottom: 0px;
  }
}
</style>