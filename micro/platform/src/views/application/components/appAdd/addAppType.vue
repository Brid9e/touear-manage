<template lang="pug">
.content-addAppType.content-bg
  ManageBox(v-model="addAppType" type="radio" :data="chooseList" :colLay="{xs: 24, sm: 24, md: 24, lg: 24, xl: 12}" )
    template(#title="{ row }")
      el-icon.icon-p.margin-right-x(:size='30')
        Shop(v-if="row.label === 'base'")
        FolderAdd(v-else)
      span {{ row.title }}
  //- el-row(:gutter='60')
    el-col.text-center(:span='12')
      .grid-content.app-base.text-left
        el-radio.radio-custom-style(v-model='addAppType', label='base')
          h3.text-white
            el-icon.icon-p.margin-right-x(:size='30', color='#fff')
              Shop
            | 应用商店
          p.font-size-16 自建应用为应用商店中的应用， 用户可根据需求进行选择性使用， 可对其进行编辑和相关设置。
    el-col.text-center(:span='12')
      .grid-content.app-custom.text-left
        el-radio.radio-custom-style(v-model='addAppType', label='custom')
          h3.text-white
            el-icon.icon-p.margin-right-x(:size='30', color='#fff')
              FolderAdd
            | 自定义应用
          p.font-size-16 自建应用为用户接入的自定义应用，用户可进行相关配置， 快速简单添加一个新的应用。
</template>
<script lang="ts" setup>
import { computed, ref, watch, defineProps, defineEmits } from 'vue'
import { useStore } from 'vuex'
import { key } from '@/store/index'
import { Shop, FolderAdd } from '@element-plus/icons-vue'
import ManageBox from '@/components/manageBox/index.vue'

export interface emitData {
  type: string
}

const props = defineProps({
  typeValue: {
    type: String,
    required: true
  }
})

const emits = defineEmits<{ (e: 'typeEmit', v: any): void }>()

const store = useStore(key)
const { state } = store
let appList = ref([])

const chooseList = [{
  label: 'base',
  title: '应用商店',
  subTitle: '自建应用为应用商店中的应用， 用户可根据需求进行选择性使用， 可对其进行编辑和相关设置。'
}, {
  label: 'custom',
  title: '自定义应用',
  subTitle: '自建应用为用户接入的自定义应用，用户可进行相关配置， 快速简单添加一个新的应用。'
}]

const token = computed(() => state.token)

store.dispatch('AddApplistAction', appList.value)
const addAppType = ref(props.typeValue)

watch(addAppType, (val) => {
  if (val) {
    const data: emitData = { type: val }
    emits('typeEmit', data)
  }
}, {
  immediate: true
})

</script>
<style lang="scss" scoped>
.content-addAppType {
  width: 50%;
  min-width: 700px;
  margin: 0 auto;
  padding: 30px 0;
  padding-top: 100px;

  .grid-content {
    p {
      color: #f2f3f3;
      white-space: normal;
      word-break: break-all;
      word-wrap: break-word;
      line-height: 26px;
      padding: 0 15px;
    }

    h3 {
      position: relative;
      margin-bottom: 20px;
      // padding: 0 15px;
      // padding-left: 30px;
      margin-top: -5px;
      font-size: 20px;
    }

    h3 .small-icon {
      position: absolute;
      top: 50%;
      left: 0;
      transform: translateY(-45%);
    }
  }

  .radio-custom-style {
    height: 200px !important;
    border-radius: 6px;
    overflow: hidden;

    .el-radio__inner {
      border-width: 0 60px 60px 0;
    }

    .el-radio__inner::after {
      height: 16px !important;
      width: 6px !important;
      border-bottom: 3px solid transparent !important;
      border-right: 3px solid transparent !important;
      top: 6px !important;
      left: 36px !important;
    }

    .el-radio__input.is-checked .el-radio__inner::after {
      border-bottom: 3px solid #fff !important;
      border-right: 3px solid #fff !important;
    }
  }

  .app-base .radio-custom-style {
    background: rgba($color: #2e8d34, $alpha: 0.5);
  }

  .app-base .radio-custom-style.is-checked {
    // background-color: #365d8c;
    background-color: #2e8d34;
  }

  .app-custom .radio-custom-style {
    background: rgba($color: #3180b3, $alpha: 0.5);
  }

  .app-custom .radio-custom-style.is-checked {
    background-color: #3180b3;
  }

  .icon-p {
    transform: translateY(8px);
  }
}
</style>