<script lang='ts' setup>
</script>
<template lang='pug'>
el-popover(:width="100" trigger="click" placement="left")
  template(#reference)
    el-button(link) 更多
  .btn-list
    slot
</template>
<style lang='scss' scoped>
.btn-list {
  :deep(.el-button) {
    width: 100%;
    margin: 5px 0;
    display: block;
  }

}
</style>