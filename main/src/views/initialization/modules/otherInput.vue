<template lang='pug'>
el-select.width-100(v-if="type == 'select'" v-model="selectValue")
  el-option(v-for="(item, key, index) in dbMap" :key="index" :label="key" :value="item")
//- pre {{ selectValue }}
IpInput(v-if="type == 'ip'" v-model="ipInputValue" :key="key")
el-input(v-if="type == 'input'" v-model.trim="inputValue")
el-input(v-if="type == 'input_password'" v-model.trim="inputPwdValue" type="password" show-password)
el-radio-group(v-if="type == 'radio'" v-model="radioValue")
  el-radio(label="http://" size="large") HTTP
  //- el-radio(label="https://" size="large") HTTPS
</template>
<script lang='ts' setup>
import { watch, ref } from 'vue'
import IpInput from './ipInput.vue'

const props = defineProps(['type', 'modelValue', 'item', 'key'])
const emits = defineEmits<{ (e: 'update:modelValue', v: any): any }>()

const dbMap = {
  'Oracle': 'jdbc:oracle:thin:@',
  'MySQL': 'jdbc:mysql://',
}

const ipInputValue: any = ref({})
const selectValue = ref('')
const inputValue = ref('')
const inputPwdValue = ref('')
const radioValue = ref('')

// not use
// const dbPortMap: any = ref({
//   'jdbc:oracle:thin:@': 1521,
//   'jdbc:mysql://': 3364,
// })
// 1521-Oracle 3364-Mysql
watch(selectValue, (val: any) => {
  emits('update:modelValue', val)
})
// 
watch(inputValue, (val: any) => {
  emits('update:modelValue', val)
})

watch(inputPwdValue, (val: any) => {
  emits('update:modelValue', val)
})

watch(radioValue, (val: any) => {
  emits('update:modelValue', val)
})

watch(ipInputValue, (val: any) => {
  emits('update:modelValue', val)
})

watch(() => props.modelValue, (val: any) => {
  if (props.type == 'ip') ipInputValue.value = val
  if (props.type == 'select') selectValue.value = val
  if (props.type == 'input') inputValue.value = val
  if (props.type == 'input_password') inputPwdValue.value = val
  if (props.type == 'radio') radioValue.value = val
}, {
  immediate: true
})

// not use
// watch(selectValue, (val: any) => {
//   ipInputValue.value.port = dbPortMap.value[val]
//   console.log(ipInputValue.value)
// })

</script>
<style lang='scss' scoped>
.width-100 {
  width: 100%;
}
.input-group{
  // display: flex;
}
</style>