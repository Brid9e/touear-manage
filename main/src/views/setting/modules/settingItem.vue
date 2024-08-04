<template lang='pug'>
.setting-item
  .setting-title
    //- h1(v-if="title") {{ title }}
    TableTitle(v-if="title" :title="title")
    span(v-if="subTitle") {{ subTitle }}
  .setting-slot
    slot
</template>
<script lang='ts' setup>
import TableTitle from '@/components/tableTitle.vue'

defineProps({
  title: String,
  subTitle: String
})
</script>
<style lang='scss' scoped>
.setting-item {
  margin-bottom: 3rem;
  max-width: 60%;
  min-width: 600px;
  overflow: hidden;

  .setting-slot {
    //
    // padding: 1.5rem;
    // border: 1px solid var(--el-border-color);
    // border-radius: 8px;
  }

  .setting-title {
    margin-bottom: 1rem;
    font-size: 20px;
    h1 {
      margin-bottom: 0.3rem;
    }
    span {
      font-size: 14px;
      opacity: 0.8;
    }
  }

}
</style>