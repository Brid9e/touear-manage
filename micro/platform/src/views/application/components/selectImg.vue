<template lang="pug">
.content-selectImg
    el-checkbox-group.checkbox-group(v-if='selectType === "checkbox"', v-model='checkedCities',  @change='change')
      el-row(:gutter='10')
        el-col.margin-bottom-2x(:span='24 / rowNum', v-for='(item, index) in list', :key='index')
          el-checkbox.checkbox-custom-style.text-center(:label='index', border='', :max='1')
            img(:src='item')
    el-radio-group(v-else v-model='checkedCities', @change='change')
      el-row(:gutter='10')
        el-col.margin-bottom-2x(:span='24 / rowNum', v-for='(item, index) in list', :key='index')
          el-radio.radio-custom-style.text-center(:label='index', border='')
            img(:src='item')
</template>
<script lang="ts">
import { defineComponent, ref } from 'vue'
export interface imgItem {
  url: string
  name?: string
}
export default defineComponent({
  name: 'selectImg',
  props: {
    rowNum: {
      type: Number,
      required: true
    },
    selectType: {
      type: String,
      required: false
    },
    list: {
      type: Array,
      required: true
    }
  },
  setup(props, context) {
    console.log('图标库', props)
    const checkedCities = ref([])
    // const propdata = reactive(props)
    // const ImgObjRef = toRefs(propdata)
    const change = (r: any) => {
      if (props.selectType === "checkbox") {
        const arr = props.list.filter(((o:any, index:number)=> {return r.includes(index)}))
        context.emit('change-Img', arr)
      } else {
        context.emit('change-Img', props.list[r])
      }
    }
    return {
      ...props,
      checkedCities,
      change
    }
  }
})
</script>
<style lang="scss">
.content-selectImg {
  box-sizing: border-box;
  .el-radio-group {
    width: 100%;
    overflow: hidden;
  }
}
.checkbox-group {
  .el-checkbox.is-bordered{
    padding:0;
  }
}
</style>
