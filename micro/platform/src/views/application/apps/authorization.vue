<script lang='ts' setup>
import { defineEmits, onMounted, ref, watch } from 'vue'
import { App } from '@/service/platform'
import { ElMessage } from 'element-plus'
import PermissionSelector from '@/components/permissionSelector.vue'

const props = defineProps({
  info: {
    type: Object,
    default: () => ({})
  },
  show: {
    type: Boolean,
    default: false
  }
})

const emits = defineEmits<{ (e: 'onClosed'): void }>()

const permRef = ref()
const handleType = ref(1)
const echoData = ref()

/**
 * 提交
 */
async function onSubmit() {
  // 保存
  const resultData = permRef.value?.resultData()
  const params = {
    resource: resultData,
    appCode: props.info.appCode,
  }
  const { data: res, code, msg }: any = await App.updatePublicByAppCode(params)
  if (code === 200) {
    ElMessage.success(msg)
    onClosed()
  }
}

/**
 * 获取app授权回显
 */
async function getCallbackData() {
  const params = {
    appCode: props.info.appCode,
  }
  const { data: res, code, msg }: any = await App.getAppAuth(params)
  if (code === 200) {
    echoData.value = res
  }
}

function onClosed() {
  emits('onClosed')
}

watch(() => props.show, (val) => {
  if (val) getCallbackData()
}, {
  deep: true
})

</script>
<template lang='pug'>
el-dialog(title="上架" width="600")
  PermissionSelector(v-if="show" ref="permRef" :echoData="echoData")
  template(#footer)
    el-button(@click="onClosed") 取消
    el-button(type="primary" @click="onSubmit") 确定
</template>
<style lang='scss' scoped>
.row-shelves-box {
  display: flex;

  .permission-selector {
    width: 40%;
  }

  .el-form {
    margin-left: 3rem;
  }
}
</style>