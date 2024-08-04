<template lang='pug'>
#head-operation
  .fold
    el-collapse.fold-box(v-model='active')
      el-collapse-item(name='1')
        slot(name='fold')
  .operation-area
    .left
      el-tooltip(content='更多筛选', :show-after='1500')
        el-button(v-if='usingFold', :icon='Number(active) ? ArrowUpBold : ArrowDownBold', @click='openFold', style='margin-right: 12px')
      slot
    .right
      slot(name='right')
</template>

<script lang='ts' setup>
import { onMounted, useSlots, ref } from 'vue'
import { Operation, MoreFilled, ArrowUpBold, ArrowDownBold } from '@element-plus/icons-vue'

const slots = useSlots()
const usingFold = ref(false)
const active = ref('0')

const openFold = () => {
  active.value = active.value == '1' ? '0' : '1'
}

onMounted(() => {
  if (slots['fold']) usingFold.value = true
})
</script>
<style lang='scss' scoped>
#head-operation {
  display: flex;
  flex-direction: column;
  margin-bottom: 1rem;

  .operation-area {
    display: flex;
    justify-content: space-between;
  }

  .fold {
    transition: all 0.3s ease;
    overflow: hidden;
    background-color: red;

    :deep(.el-input), :deep(.el-select), :deep(.el-select-v2) {
      width: 160px;
      // max-width: 100%;
    }
  }
  .left {
    :deep(.el-input), :deep(.el-select), :deep(.el-select-v2) {
      margin-right: 12px !important;
    }
  }
  .left,
  .right {
    display: flex;
  }
}

:deep(.el-collapse.fold-box) {
  border: none;

  .el-collapse-item__header {
    display: none;
  }
}
:deep(.left) {
  .el-select, .el-select-v2 {
    width: 100%;
    margin-right: 12px;
  }
}
</style>