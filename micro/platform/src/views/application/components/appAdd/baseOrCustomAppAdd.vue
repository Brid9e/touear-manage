<script lang='ts' setup>
import { computed, onMounted, ref, watch } from 'vue'
import SelectedBaseApp from './selectedBaseApp.vue'
import CreateCustomApp from './createCustomApp.vue'

defineProps({
  addType: {
    type: String,
    default: ''
  },
  item: {
    type: Object,
    default: () => ({})
  }
})

const base = ref()
const custom = ref()

defineExpose({
  base,
  custom
})
</script>
<template lang='pug'>
.base-custom-app-add
  SelectedBaseApp(v-if='item.name === "baseApp"', ref="base")
  CreateCustomApp(v-if='item.name  === "customApp"', :typeValue='addType', ref='custom')
</template>
<style lang='scss' scoped></style>