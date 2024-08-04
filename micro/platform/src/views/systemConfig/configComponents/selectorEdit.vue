<template lang='pug'>
#selector-edit
  el-checkbox-group(v-model="selcted")
    el-row(:gutter="20")
      el-col(:span="4" v-for="(item, key, i) in selectAll" :key="item.key")
        el-checkbox(:label="key") {{ item }}
</template>
<script lang='ts' setup>
import { onMounted, ref, watch } from 'vue'

const props: any = defineProps({
  jsonData: {
    default: null
  }
})

const emits = defineEmits<{ (e: 'returnData', v: any): void }>()

const selectAll: any = ref({})

const selcted = ref([])


onMounted(() => {
  try {
    const jsonData = JSON.parse(props.jsonData)
    selectAll.value = JSON.parse(jsonData.template)
    selcted.value = JSON.parse(jsonData.choosed)
  } catch {
    // selectAll.value = props.data
    throw new Error('json数据有误')
  }
})

watch(selcted, (val: any) => {
  const json = {
    template: JSON.stringify(selectAll.value),
    choosed: JSON.stringify(val)
  }
  emits('returnData', JSON.stringify(json))
})
</script>
<style lang='scss' scoped>
#selector-edit {
  width: 100%;
  max-height: 35vh;
  // margin-top: 18px;
  border: 1px solid var(--el-border-color-light);
  border-radius: var(--el-border-radius-base);
  padding: 10px;
  box-sizing: border-box;
}
</style>