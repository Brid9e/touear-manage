<template lang='pug'>
.small-item
  .top
    .logo 
      el-icon(:size="14" color="var(--main-color-default)")
        component(:is="icon") 
    .label {{ keys }}
  .middle
    //- .num {{ scale.toFixed(2) }}%
    .num {{ value }}  
    .label(style="font-size:12px;")  {{ scale.toFixed(2) }}% 
  .bar
    el-progress(:percentage="scale" :stroke-width="6" :show-text="false" :color="colorObj[keys]" :text-inside="true")
</template>
<script lang='ts' setup>
import { computed } from 'vue'
// import { } from '@element-plus/icons-vue'

const props: any = defineProps({
  keys: {
    type: String,
    default: ''
  },
  value: {
    type: Number,
    default: 0
  },
  icon: {
    type: Object,
    default: null
  },
  scale: {
    type: Number,
    default: 0
  }
})

const colorIconBg = computed(() => {
  return colorObj[props.keys] || 'var(--el-color-primary)'
})

const dataOrg = computed(() => {
  let arr = []
  arr = Object.keys(props.value).map((key: any) => {
    return { key: key, value: props.value[key] }
  })
  return arr
})

const colorObj: any = {
  男: 'var(--el-color-primary)',
  女: '#FF3CAC',
  未知: '#784BA0'
}
</script>
<style lang='scss' scoped>
.small-item {
  .middle{
    display: flex;
    align-items: flex-end;
    margin: 0.625rem 0;
  }
  .label {
    font-size: 0.875rem;
    color: var(--main-color-font-sub);
    font-weight: 500;
    margin-left: 0.5rem;
  }

  // height: 100%;
  .top {
    display: flex;
    align-items: center;


  }

  .num {
    font-weight: 800;
  }

  .logo {
    width: 1.625rem;
    height: 1.625rem;
    // background-color: var(--el-color-primary);
    background-color: v-bind(colorIconBg);
    border-radius: calc(var(--main-border-radius) - 6px);
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
</style>