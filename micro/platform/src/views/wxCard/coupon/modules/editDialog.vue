<template lang="pug">
el-dialog(title="编辑" :width="1000" @closed="onClose")
  el-tabs(v-model="activeTab" type="card")
    el-tab-pane(label="基本信息" name="edit")
      EditForm(ref="editRef" :color="color" :item="item")
    el-tab-pane(label="权限设置" name="limit")
      SetLimit(ref="setLimitRef" @changeLimit='changeLimitData', @lastDataLimit='getLastDataLimit', :id='id' :show="show")
  template(#footer)
    el-button(@click='emits("close", false)') 取消
    el-button(type='primary', @click='confirmEditApp' :loading="confirmLoading") 确认
</template>
<script lang="ts" setup>
import { ref, defineProps, defineEmits, onMounted, watch } from 'vue'
import { Group } from '@/service/platform'
import SetLimit from './setLimit.vue'
import EditForm from './editForm.vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { isEmpty } from 'lodash'

const props = defineProps({
  show: {
    type: Boolean,
    default: false,
  },
  id: {
    type: Number,
    default: null,
  },
  color: {
    type: Object,
    default: null,
  },
  item: {
    type: Object,
    default: null,
  },
})

const emits = defineEmits<{
  (e: 'close', v: boolean): void
  (e: 'updateTable'): void
}>()

const setLimitRef = ref()
const info: any = ref({})
const lastDataLimit = ref()
const activeTab = ref('edit')
const editRef = ref()
const confirmLoading = ref(false)

const changeLimitData = (val: any) => {
  info.value.limit = val
}

const getLastDataLimit = (val: any) => {
  lastDataLimit.value = val
}

// 提交编辑框
const confirmEditApp = async () => {
  confirmLoading.value = true
  // 设置权限
  if (activeTab.value === 'limit') {
    await setLimitRef?.value?.ruleFormRef?.confirm()
    await setLimitRef?.value?.ruleFormRef?.limitPageRef?.getExtendInfoList()
    await limitSumbit()
    // tableData.value[index] = data.yesList[0]
    confirmLoading.value = false
    ElMessage({
      showClose: true,
      message: '编辑成功！',
      type: 'success',
    })
  }
  // 编辑
  if (activeTab.value === 'edit') {
    if (!editRef.value.editFormRef) return
    await editRef.value.editFormRef.validate(async (valid: any) => {
      if (valid) {
        const { code } = await editRef.value.confirm().catch(() => {
          confirmLoading.value = false
        })
        confirmLoading.value = false
        if (code === 200) {
          ElMessage({
            showClose: true,
            message: '编辑成功！',
            type: 'success',
          })
          emits('close', false)
          emits('updateTable')
        }
      }
    })
  }
}

const limitSumbit = async () => {
  if (info.value.limit.openLimit) {
    if (!lastDataLimit.value.openLimit) {
      // 调用打开权限接口
      const params = {
        type: 'wechatCard',
        resourceId: props.id, // 应用id
        value: true,
      }
      await Group.extendInfoSwitch(params, 'messageBox')
    }
  } else {
    if (
      lastDataLimit.value.openLimit.sno !== info.value.limit.sno ||
      lastDataLimit.value.groupValue !== info.value.limit.groupValue
    ) {
      // 调用设置权限接口
      const group = info.value.limit.groupValue
        ? info.value.limit.groupValue
        : []
      const sno = info.value.limit.snoValue ? info.value.limit.snoValue : []
      const params = {
        type: 'wechatCard',
        removeResource: 'true', // 是否清理旧的数据
        resourceMap: {
          [props.id]: {
            group: !isEmpty(group) ? group : undefined,
            sno: !isEmpty(sno) ? sno : undefined,
          },
        },
      }
      await Group.saveExtendInfo(params, 'messageBox')
    }
  }
}

const onClose = () => {
  editRef.value.editFormRef?.resetFields()
}

onMounted(() => {
  // getListAfterConverted()
})
</script>
<style lang="scss" scoped></style>
