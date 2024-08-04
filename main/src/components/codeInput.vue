<template lang="pug">
.code-input
  //- el-progress(:duration="1.2" :percentage="80" indeterminate :show-text="false" :stroke-width="2")
  .code-input__box(ref="codeInputRef")
    el-input.code-item(v-model="codeItem[i]" :ref="val => inputRef(val, i)" v-for="(item, i) in digit" :key="i" @input="val => onInput(val, i)" @keydown="onDelete($event, i)" :size="size" :readonly="i!==0 && !codeItem[i - 1]" :maxLength="1")
  .loading(v-show="loading")
    el-icon(class="is-loading" size="16")
      Loading
</template>
<script lang="ts" setup>
import { compact } from 'lodash'
import { watch, ref, onMounted } from 'vue'
import { Loading } from '@element-plus/icons-vue'

const props = defineProps({
  modelValue: {
    type: String,
    default: '',
  },
  digit: {
    type: Number,
    default: 4,
  },
  size: {
    type: String,
    default: 'large',
  },
  loading: {
    type: Boolean,
    default: false,
  },
})
const emits = defineEmits<{
  (e: 'update:modelValue', v: any): void
  (e: 'finish', v: any): void
  (e: 'change', v: any): void
}>()

const codeItem: any = ref([])
const codeInputRef = ref()
const itemRefs: any = {}
const inputRef = (el: any, k: any) => {
  if (el) {
    itemRefs[k] = el
  }
}


const onInput = (val: any, k: any) => {
  codeItem.value[k] = val.replace(/[^\d]/g, '').slice(0, 1) // 只保留数字字符
  // codeItem.value[k] = val // 限制最多3位数字
  if (codeItem.value[k]) {
    codeItem.value[k] = val.replace('', '')
    itemRefs[k + 1]?.focus()
    if (codeItem.value?.length === props.digit) {
      emits('finish', codeItem.value?.join(''))
      itemRefs[k]?.blur()
    }
    return
  }
  if (codeItem.value[k]?.length >= 1 && k < 2) {
    itemRefs[k + 1]?.focus()
  }
}

const onDelete = (e: any, k: any) => {
  if (e.key === 'Tab') {
    e.preventDefault()
  }
  if (e.key === 'Backspace') {
    if (!codeItem.value[k]?.length && k > 0) {
      itemRefs[k - 1]?.focus()
    }
  }
}

watch(
  () => props.modelValue,
  (val: any) => {
    codeItem.value = val?.split('')
  },
  {
    deep: true,
    immediate: true,
  },
)

watch(
  codeItem,
  (val: any) => {
    emits('update:modelValue', compact(val)?.join(''))
    emits('change', compact(val)?.join(''))
  },
  {
    deep: true,
  },
)


onMounted(() => {
  codeInputRef.value.addEventListener('paste', (val: any) => {
    let pasteValue = val.clipboardData.getData('text')
    if (typeof pasteValue === 'string') {
      pasteValue = pasteValue.slice(0, 6)
      for (let i = 0; i < pasteValue.length; i++) {
        onInput(pasteValue[i], i)
      }
    }
  })
})
</script>
<style lang="scss" scoped>
.code-input {}

.code-input__box {
  display: flex;
  width: 100%;
}

.code-item {
  width: auto;
  margin-right: 0.5rem;

  :deep(input) {
    text-align: center !important;
    font-size: 1.25rem;
  }

  &:last-child {
    margin: 0;
  }
}

.port {
  width: 30%;
  margin-left: 0.5rem;
}

.cut {
  margin: 0 0.5rem;
}

.loading {
  position: absolute;
  background-color: #ffffff97;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--main-primary);
}
</style>