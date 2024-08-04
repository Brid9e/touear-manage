<script lang='ts' setup>
import { defineEmits, ref, watch } from 'vue'
import InstallConfig from '../components/appAdd/installConfig.vue'
import FormCreateByJson from '@/components/formCreateByJson/index.vue'
import { cloneDeep } from 'lodash'

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

const emits = defineEmits<{ (e: 'onClosed'): void, (e: 'configsResult', v: any, t: boolean): void }>()

const formCreateByJsonRef = ref()

async function onSubmit() {
  // TODO
  const resultData = await formCreateByJsonRef.value.submitForm()

  if (resultData.validateRes) {
    const appInfo = cloneDeep(props.info)
    appInfo.extraConfig = resultData
    emits('configsResult', appInfo, true)
  }
}

function onClosed() {
  emits('onClosed')
}

</script>
<template lang='pug'>
el-dialog(title="安装配置" width="800")
  FormCreateByJson(ref='formCreateByJsonRef' v-if="info.installConfig" :backfillingPayData="[]" :formDataArr='JSON.parse(info.installConfig)')
  template(#footer)
    el-button(@click="onClosed") 取消
    el-button(type="primary" @click="onSubmit") 确定
</template>
<style lang='scss' scoped>
//</style>