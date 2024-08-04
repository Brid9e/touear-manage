<template lang="pug">
el-input(v-model='url', :placeholder='placeholder', @input='changeInput')
  template(#prepend='')
    el-select(v-model='selectValue', placeholder='Select', style='width: 100px', @change='changeSelect')
      el-option(v-for='(item, i) in selectOption', :key='i', :label='item.name', :value='item.value')
</template>
<script lang="ts" setup>
import { defineComponent, ref, watch, onMounted } from 'vue'
import { useStore } from 'vuex'
import { key } from '@/store'
import { nextTick } from 'vue'
const store = useStore(key)
const { state, commit } = store
const emit = defineEmits(['update:modelValue'])
const props = defineProps({
  modelValue: String,
  placeholder: {
    type: String,
    required: false,
    default: '请输入地址'
  },
  defaultUrl: {
    type: String,
    required: false,
    default: ''
  }
})
// console.log('defaultUrl', props, props.defaultUrl)
const url = ref('')
const selectValue = ref('https://')
const selectOption = [
  {
    name: 'https://',
    value: 'https://'
  },
  {
    name: 'http://',
    value: 'http://'
  },
  {
    name: '自定义',
    value: ''
  }
]
const defaultUrl = ref(props.defaultUrl)
if (defaultUrl.value) {
  const index = selectOption.findIndex((item, key) => {
    if (item.value) {
      return defaultUrl.value.indexOf(item.value) !== -1
    }
  })
  console.log('defaultUrl---------', index, defaultUrl)
  if (index !== -1) {
    selectValue.value = selectOption[index].value
    url.value = defaultUrl.value.split(selectValue.value)[1]
  } else {
    selectValue.value = ''
    url.value = defaultUrl.value
  }
}
const changeInput = (val: any) => {
  emit('update:modelValue', selectValue.value + url.value)
}
const changeSelect = (val: any) => {
  console.log('changeSelect-----------', val)
  url.value = ''
  emit('update:modelValue', selectValue.value + url.value)
}
// watch(
//   () => props.defaultUrl,
//   (newValue, oldValue) => {
//     if (newValue) {
//       console.log('newValue--defaultUrl', newValue)
//     }
//   }
// )
</script>
<style lang="scss"></style>
