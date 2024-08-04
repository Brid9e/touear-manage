<template lang="pug">
#FormBox
  TableTitle(:title="title" size="large")
  p.form-box-sub {{sub}}
  .item-slot(:parent="title")
    slot
</template>

<script lang="ts" setup>
import { onMounted } from 'vue'
import TableTitle from '@/components/tableTitle.vue'
const props = defineProps({
  title: String,
  sub: String
})
</script>

<style lang="scss" scoped>
#FormBox {
  #TableTitle {
    margin-bottom: 1rem;
  }
}
</style>
