<template lang="pug">
.filter-content(:style='`height:${isShowAll ? "auto" : "100px"};padding-bottom:${newLine ? "50px" : 0}`')
  slot.body
  .button-group.text-right
    slot(name='buttonGroup')
p.btn-more.text-center
  span.font-size-14.text-primary(@click='showMore', v-if='showIsShowAllBtn')
    el-icon.small-icon(:class='{ showMoreIcon: isShowAll }')
      ArrowDown
    | {{ isShowAll ? "收起" : "展开更多" }}
</template>
<script lang="ts" setup>
import { defineComponent, ref, watch, onMounted } from 'vue'
import { ArrowDown } from '@element-plus/icons-vue'
import { useStore } from 'vuex'
import { key } from '@/store'
import { nextTick } from 'vue'
const store = useStore(key)
const { state, commit } = store
const formItemWidth = ref('20%')
const isShowAll = ref(false)
const newLine = ref(false)
const showIsShowAllBtn = ref(false)
const buttonsWidth = ref(0)
const dom: any = ref()
const showMore = () => {
  isShowAll.value = !isShowAll.value
  newLine.value = false
  getLastNumber()
}
window.addEventListener('resize', function () {
  getFormItemWidth(document.documentElement.clientWidth)
  getLastNumber()
})
const getFormItemWidth = (windowWidth: number) => {
  let width = ''
  if (windowWidth >= 1800) {
    width = '20%'
  } else if (windowWidth >= 1200 && windowWidth < 1800) {
    width = '25%'
  } else if (windowWidth >= 992 && windowWidth < 1200) {
    width = '33.33%'
  } else if (windowWidth < 992) {
    width = '50%'
  }
  formItemWidth.value = width
}
const getLastNumber = () => {
  const itemWidth = Number(formItemWidth.value.replace('%', ''))
  let max = Math.floor(200 / itemWidth)
  const rowNum = Math.floor(100 / itemWidth)
  const rowTotal = Math.ceil(dom.value.length / rowNum)
  let btnCol = Math.ceil(buttonsWidth.value / dom.value[0].offsetWidth)
  showIsShowAllBtn.value = max - btnCol < dom.value.length
  if (showIsShowAllBtn.value) {
    if (isShowAll.value) {
      max = Math.floor((100 * rowTotal) / itemWidth)
      const sy = rowTotal - (dom.value.length % rowNum)
      if (sy < btnCol || dom.value.length % rowNum === 0) {
        newLine.value = true
      } else {
        newLine.value = false
      }
    }
  }
  for (var i = 0; i < dom.value.length; i++) {
    if (i > max - 1 - btnCol) {
      dom.value[i].style.display = isShowAll.value ? 'inline-flex' : 'none'
    } else {
      dom.value[i].style.display = 'inline-flex'
    }
  }
}
getFormItemWidth(document.documentElement.clientWidth)
onMounted(() => {
  nextTick(() => {
    dom.value = document.querySelectorAll<HTMLElement>('.filter-content .el-form-item')
    const btndom = document.querySelectorAll<HTMLElement>('.filter-content .button-group')
    buttonsWidth.value = btndom?.[0].offsetWidth || 100
    getLastNumber()
  })
})
const winHeight = document.documentElement.clientHeight
commit('setTableHeight', winHeight - 220)
</script>
<style lang="scss">
.filter-content {
  position: relative;
  overflow: hidden;
  .el-form-item {
    width: v-bind(formItemWidth);
    margin-right: 0;
    // float: left;
  }
  .button-group {
    position: absolute;
    bottom: 18px;
    right: 0;
    // width: v-bind(formItemWidth);
  }
}
.btn-more {
  height: 14px;
  line-height: 14px;
  padding-bottom: 5px;
  span {
    font-size: 12px;
    cursor: pointer;
    transform: translateY(-9px);
    display: block;
  }
  .small-icon {
    width: 16px;
    height: 16px;
    border: 1px solid var(--main-primary);
    margin-right: 3px;
    display: inline-block;
    border-radius: 100%;
    line-height: 16px;
  }
  .small-icon svg {
    width: 12px;
    height: 12px;
    transform: translateY(1px);
  }
  .showMoreIcon {
    transform: rotate(180deg);
  }
}
</style>
