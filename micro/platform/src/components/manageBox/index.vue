<script lang='ts' setup>
import { computed, defineProps, useSlots } from 'vue'
import { ElRadioGroup, ElCheckboxGroup, ElRadio, ElCheckbox } from 'element-plus'

const _props = defineProps({
  data: {
    type: Array,
    default: () => []
  },
  type: {
    type: String,
    default: 'checkbox'
  },
  disabled: {
    type: Boolean,
    default: false
  },
  iconError: {
    type: String,
    default: ''
  },
  props: {
    type: Object,
    default: {
      label: 'label',
      title: 'title',
      subTitle: 'subTitle',
      disabled: '',
      icon: ''
    }
  },
  disabledText: {
    type: String,
    default: ''
  },
  colLay: {
    type: Object,
    default: {
      xs: 24,
      sm: 12,
      md: 12,
      lg: 8,
      xl: 6
    }
  },
  height: {
    type: Number,
    default: 150
  }
})

const emits = defineEmits<{ (e: 'changeItem', item: any, i: number): void }>()
const height = computed(() => `${_props.height}px`)

const slots = useSlots()

function changeItem(item: any, i: any) {
  emits('changeItem', item, i)
}

</script>
<template lang='pug'>
Component.m-box(:is="type === 'checkbox' ? ElCheckboxGroup : ElRadioGroup")

  el-row(:gutter='16')
    el-col.m-box__item(:xs='colLay.xs', :sm='colLay.sm', :md='colLay.md', :lg='colLay.lg', :xl='colLay.xl', v-for='(item, i) in data', :key='i')
      Component(:is="type === 'checkbox' ? ElCheckbox : ElRadio" border :label="item[props.label]" :disabled="item[props.disabled]" @change="changeItem(item, i)")

        .m-box__disabled-text(v-if="item[props.disabled]")
          el-text(type="primary") {{ disabledText }}

        .m-box__item-box
          .m-box__icon(v-if="props.icon" :class="{'is-icon-disabled': item[props.disabled]}")
            el-image(:src="item[props.icon]" fit="cover")
              template(#error)
                el-image(:src="iconError" fit="cover")

          .m-box__right
            .m-box__title-main
              .m-box__title
                slot(v-if="slots?.title" name="title" v-bind="{ row: item }")
                span(v-else) {{ item[props.title]  }}
              .m-box__title-sub
                slot(v-if="slots?.subTitle" name="subTitle" v-bind="{ row: item }")
                span(v-else) {{ item[props.subTitle]  }}

            .m-box__content
              slot(name="content" v-bind="{ row: item }")
</template>
<style lang='scss' scoped>
.m-box {
  display: block;
  :deep(.m-box__item) {
    width: 100%;
    height: v-bind(height);
    margin-bottom: 1rem;
    display: flex;

    .el-checkbox,
    .el-radio {
      width: 100%;
      height: 100%;
      display: flex;
      box-shadow: 0 8px 8px var(--el-fill-color-light);

      .el-checkbox__input,
      .el-radio__input {
        display: none;
      }

      .el-radio__label,
      .el-checkbox__label {
        width: 100%;
      }

      &.is-checked {
        background-color: var(--el-fill-color-light);
        border-style: dashed
      }

      &.is-disabled {
        // background-color: var(--el-bg-color-page);
        background-color: var(--el-fill-color-light);
        box-shadow: none;
      }
    }

    .m-box__disabled-text {
      position: absolute;
      right: 10px;
      top: 10px;
      font-weight: 600;
    }

    .m-box__item-box {
      display: flex;
      width: 100%;

      .m-box__right {
        width: 100%;
      }
    }

    .m-box__title-main {
      margin-bottom: 1rem
    }

    .m-box__title {
      font-size: 1rem;
      line-height: 1.125rem;
      font-weight: 600;
    }

    .m-box__title-sub {
      white-space: wrap;
      width: 100%;
      font-size: .75rem;
      line-height: 1rem;
      margin-top: 0.5rem;
      opacity: 0.5;
    }

    .m-box__icon {
      width: 50px;
      height: 50px;
      margin-right: 1rem;
      flex-shrink: 0;

      .el-image {
        width: 100%;
        height: 100%;
      }

    }

    .is-icon-disabled {
      opacity: 0.5;
    }
  }
}
</style>