<template lang='pug'>
.ip-box
  el-input.ip-item(v-model="ipItem[i]" :ref="val => inputRef(val, i)" v-for="(item, i) in 4" :key="i" @input="val => onInput(val, i)" @keydown="onDelete($event, i)")
</template>
<script lang='ts' setup>
import { compact } from 'lodash'
import { watch, ref, onMounted } from 'vue'

const props = defineProps(['modelValue', 'key'])
const emits = defineEmits<{ (e: 'update:modelValue', v: any): void }>()

const ipItem: any = ref([])
const itemRefs: any = {}
const inputRef = (el: any, k: any) => {
  if (el) {
    itemRefs[k] = el
  }
}

const onInput = (val: any, k: any) => {
  ipItem.value[k] = val.replace(/[^\d]/g, '').slice(0, 3) // 只保留数字字符
  // ipItem.value[k] = val // 限制最多3位数字
  if (val?.at(-1) === '.' && ipItem.value[k]) {
    ipItem.value[k] = val.replace('.', '')
    itemRefs[k + 1]?.focus()
    return
  }
  if (ipItem.value[k]?.length >= 3 && k < 3) {
    itemRefs[k + 1]?.focus()
  }
}

const onDelete = (e: any, k: any) => {
  if (e.key === 'Backspace') {
    if (!ipItem.value[k]?.length && k > 0) {
      itemRefs[k - 1]?.focus()
    }
  }
}

watch(() => props.modelValue, (val: any) => {
  ipItem.value = val?.split('.')
}, {
  deep: true,
  immediate: true
})

watch(ipItem, (val: any) => {
  emits('update:modelValue', compact(val)?.join('.'))
}, {
  deep: true
})

</script>
<style lang='scss' scoped>
#ip-input {
  display: flex;
  width: 100%;

  .ip-box {
    display: flex;
    width: 100%;
  }

  .ip-item {
    width: auto;
    margin-right: 0.5rem;

    &::after {
      content: '.';
      margin-left: 0.5rem;
    }

    &:nth-child(1) {
      margin-left: 0;
    }

    &:nth-child(4) {
      margin-right: 0;

      &::after {
        content: ':';
      }
    }
  }

  .port {
    width: 30%;
    margin-left: 0.5rem;
  }

  .cut {
    margin: 0 0.5rem;
  }
}
</style>