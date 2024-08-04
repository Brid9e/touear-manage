<template lang="pug">
#FormBoxItem
  TableTitle(:title="title")
  p.form-box-sub {{sub}}
    .button-group
      slot(name="button")
  .item-slot
    slot
</template>
<script lang="ts" setup>
import TableTitle from '@/components/tableTitle.vue'

defineProps({
  title: String,
  sub: String
})
</script>
<style lang="scss" scoped>
.item-slot {
  border-top: 1px solid #dcdfe6;
  padding-top: 2rem;
}
#FormBoxItem {
  padding-bottom: 2rem;
  max-width: 80%;
}
.form-box-sub {
  display: flex;
  font-size: 14px;
  justify-content: space-between;
  align-items: center;
  height: 16px;
}

p.form-box-sub {
  margin: 1rem 0;
  font-family: Arial, Helvetica, sans-serif;
  color: #606266;
}

h1,
h2,
h3,
h4,
h5,
h6 {
  font-family: Arial, Helvetica, sans-serif;
  color: #606266;
}

h1,
h2,
h3,
h4,
h5,
h6 {
  font-weight: 600;
}

h1 {
  margin-bottom: 2rem;
}

h2 {
  margin-top: 2.25rem;
  margin-bottom: 1.25rem;
}
</style>
