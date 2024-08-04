<template lang='pug'>
#select-terminal
  el-checkbox-group(v-model="checkList")
    el-checkbox.ter-item(v-for="(terminal, k, i) in terminals" :key="k" :label="k") 
      .icon
      span {{ terminal }}
  el-button(@click="toNext") 下一步
</template>
<script lang='ts' setup>
import { ref, watch } from 'vue'
import { cloneDeep, isEmpty, keys } from 'lodash'

const emits = defineEmits<{ (e: 'change', v: any[]): void, (e: 'next'): void }>()

// h5 app wechat-mina pc selfService
const terminals = ref({
  h5: 'H5',
  app: 'APP',
  'wechat-mina': '微信小程序',
  pc: 'PC电脑',
  selfService: '自助机'
})

const checkList = ref([])

const toNext = () => {
  emits('next')
}

watch(checkList, (r) => {
  emits('change', !isEmpty(cloneDeep(r)) ? r : keys(terminals.value))
}, {
  immediate: true
})

</script>
<style lang='scss' scoped>
#select-terminal {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.el-checkbox-group {
  display: flex;
  margin-bottom: 2rem;



  .el-checkbox.is-checked {
    span {
      color: #ffffff !important;
    }
    background-color: var(--el-color-primary);
    filter: brightness(1.25) saturate(1.25);
    border: none;
    transform: scale(1);
  }

  .ter-item {
    width: 12vw;
    height: 20vh;
    display: flex;
    justify-content: center;
    align-items: center;
    border-right: none;
    margin: 0;
    color: #ffffff;
    border-radius: 10px;
    border: 1px solid #ffffff1d;
    box-sizing: border-box;
    transform: scale(0.9);
    transition: all .3s ease;
    overflow: hidden;

    margin-right: 1rem;

    &:last-child {
      margin-right: 0;
    }

    span {
      font-size: 1.25rem;
    }

    :deep(.el-checkbox__input) {
      display: none !important;
    }
  }
}
</style>