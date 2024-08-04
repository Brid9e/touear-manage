<template lang='pug'>
#ip-input
  //- .ip-box
    el-input.ip-item(v-model="ipItem[i]" :ref="val => inputRef(val, i)" v-for="(item, i) in 4" :key="i" @input="val => onInput(val, i)" :placeholder="props.modelValue?.ip?.split('.')?.[i]")
  IpBox(v-model="ipData.ip" :key="key")
  el-input.port(v-model.trim="ipData.port")
</template>
<script lang='ts' setup>
import { cloneDeep } from 'lodash'
import { watch, ref, computed, nextTick } from 'vue'
import IpBox from './ipBox.vue'

const props = defineProps(['modelValue', 'key'])
const emits = defineEmits<{ (e: 'update:modelValue', v: any): void }>()

const ipData: any = ref(props.modelValue)

// const getValue = (val: any) => {
//   ipData.value.ip = val
//   emits('update:modelValue', ipData.value)
// }

watch(ipData, (val: any) => {
  emits('update:modelValue', val)
}, {
  deep: true
})
</script>
<style lang='scss' scoped>
#ip-input {
  display: flex;
  width: 100%;

  .ip-box {
    display: flex;
    width: 100%;
  }

  .ip-item {
    width: auto;
    margin-right: 0.5rem;

    &::after {
      content: '.';
      margin-left: 0.5rem;
    }

    &:nth-child(1) {
      margin-left: 0;
    }

    &:nth-child(4) {
      margin-right: 0;

      &::after {
        content: ':';
      }
    }
  }

  .port {
    width: 30%;
    margin-left: 0.5rem;
  }

  .cut {
    margin: 0 0.5rem;
  }
}
</style>