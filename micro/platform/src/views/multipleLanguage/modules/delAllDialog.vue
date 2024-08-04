<template lang="pug">
el-dialog(@closed="onClose" :width="500" :title="`清空 ${platTypeMap[type]} 多语言`")
  .del-content
    p.c-text 该操作将会删除当前平台下的所有多语言，请谨慎操作。
    p.c-text 请在下方输入框输入“<span style="color:var(--el-color-danger)">清空{{platTypeMap[type]}}下所有语言包数据</span>”
    el-input.r-input(v-model="submitText" placeholder="请输入上面的红色字体")
  template(#footer)
    el-button(@click="emits('closed', false)") 取消
    el-button(type="primary" @click="onConfirm('messageBox')" :disabled="!isTextEqual") 确认
</template>
<script lang="ts" setup>
import { Language } from '@/service/platform'
import { ElMessage } from 'element-plus'
import { ref, computed } from 'vue'

const props = defineProps({
  type: {
    type: String,
    default: null,
  },
  platTypeMap: {
    type: Object,
    default: null,
  },
})

const emits = defineEmits<{
  (e: 'closed', v: false): void
  (e: 'onSucceed'): void
}>()

const submitText = ref('')
const isTextEqual = computed(
  () =>
    submitText.value ===
    `清空${props.platTypeMap[props.type]}下所有语言包数据`
)

// 全部删除
const onConfirm = async () => {
  if(!isTextEqual) return
  const { code } = await Language.removeAllLanguage(props.type)
  if (code === 200) {
    ElMessage.success('删除成功')
    emits('closed', false)
    emits('onSucceed')
  }
}

// 关闭时
const onClose = () => {
  submitText.value = ''
}
</script>
<style lang="scss" scoped>
.del-content {
  text-align: center;
  p {
    margin-bottom: 1rem;
    span {
      font-weight: 700;
    }
  }
  .c-text {
    font-size: 1rem;
  }
  .r-input {
    width: 80%;
    margin-top: 1rem;
  }
}
</style>
