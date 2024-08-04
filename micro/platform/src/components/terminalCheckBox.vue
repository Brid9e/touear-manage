<template lang="pug">
#TerminalType
  //- p modelValue{{ modelValue }}
  el-form-item(label='' prop="platTypeArr" v-loading="loading" label-width='0')
    p.text-danger(v-if="errorText") {{errorText}}
    el-checkbox-group(v-else v-model="form.platTypeArr"  @change="onChange")
      p(v-for="(value, key) in tierList")
        //- el-checkbox(:key="key" :label="key") {{ key }}
        .form-item-label(:style="`width:${labelWidth || 100}px`") 
          | {{ key ? platTypeList.find(item => item.code === key)?.name : value[0].name }}
        el-checkbox(v-for="item in value" :key="item.code" :label="item.code" )  {{ item.name }}
    slot
</template>
<script lang="ts" setup>
import { reactive, computed, watch } from 'vue'
import _ from 'lodash'
import { useStore } from 'vuex'
import { key } from '@/store'
const { state } = useStore(key)
const props = defineProps({
  modelValue: {
    type: Array,
    default: () => []
  },
  data: {
    type: Array,
    default: () => []
  },
  loading: {
    type: Boolean,
    default: () => false
  },
  errorText: {
    type: String,
  },
  labelWidth: Number
})
const emit = defineEmits(['update:modelValue', 'change'])
const platTypeList = state.platTypeList
const platTypeLevel = state.platTypeLevel
const form = reactive({
  platTypeArr: []
})
watch(
  props.modelValue,
  (val: any) => {
    console.log('**** watch --- modelValue', val)
    form.platTypeArr = val

    // emits('update:modelValue', compact(val)?.join(''))
    // emits('change', compact(val)?.join(''))
  },
  {
    deep: true,
    immediate: true
  },
)
const onChange = (val: any) => {
  // console.log('onChange', val)
  emit('update:modelValue', val)
  emit('change', val)
}
const tierList = computed(() => {
  let arr: any = []
  let list: any = props.data?.length > 0 ? props.data : platTypeLevel
  // if (!props.data && !props.errorText) {
  //   // platTypeLevel
  //   arr = _.groupBy(platTypeLevel, 'parentCode')
  // } else {
  console.log('list  props.data', list, props.data)
  // arr = _.groupBy(list, 'parentCode')
  //
  arr = _.groupBy(list, 'parentCode')
  // }
  return arr
})


</script>

<style scoped lang="scss">
#TerminalType {
  .form-item-label {
    display: inline-block;
    // height: 32px;
    position: relative;
    top: -2px;
    padding-right: 12px;
    font-size: 14px;
    text-align: right;
  }
}
</style>
