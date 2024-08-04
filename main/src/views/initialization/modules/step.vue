<template lang='pug'>
#init-step  
  ul.step-box
    li.step-item(:class="{'selected': cardIndex[code] >= index}" v-for="(item, key, index) in children" :key="key" @click="toStep(index)")
      span.key-name {{ key }}
</template>
<script lang='ts' setup>
import { size } from 'lodash';

const props = defineProps(['children', 'code', 'cardIndex'])
const emits = defineEmits<{ (e: 'toStep', value: number): void }>()

const toStep = (index: number) => {
  // emits('toStep', index)
}
</script>
<style lang='scss' scoped>
#init-step {
  // width: 10%;
  position: absolute;
  bottom: 10rem;

  // 
  .step-box {
    width: 100%;
    display: flex;
    justify-content: space-between;

    .step-item {
      width: 1rem;
      height: 1rem;
      background-color: var(--el-color-primary-dark-2);
      border-radius: 50%;
      transition: transform .1s ease;
      display: flex;
      justify-content: center;
      margin-right: 5rem;
      &:last-child {
        margin-right: 0;
      }
      // cursor: pointer;

      .key-name {
        color: #fff;
        font-size: 12px;
        transform: translateY(2rem);
        text-transform: uppercase;
      }

      &:hover {
        // transform: scale(1.25);
      }
    }
  }

  .selected {
    background-color: var(--el-color-primary-light-3) !important;
  }
}
</style>