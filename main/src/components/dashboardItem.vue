<template lang='pug'>
el-col(:span="span || 6")
  .db-item.main-box-shadow(:style="`height:${ height || 100 }px`")
    .title {{ title || '' }}
    slot
</template>
<script lang='ts' setup>
defineProps({
  span: {
    type: Number,
    default: 6
  },
  height: {
    type: Number,
    default: 100
  },
  title: String
})
</script>
<style lang='scss' scoped>
.db-item {
  background-color: var(--main-color-default);
  border-radius: var(--main-border-radius);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}
</style>