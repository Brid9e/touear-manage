<template lang="pug">
#Toc(v-if="tocList?.length > 0")
  h1.ti 目录
  .toc-bar(:style="`top:${barTop}px`")
  .toc-item(:class="{'is-child': item.parent ? true : false}" v-for="item in tocList", :key="item.name", @click="val => jump(val, item.name)") {{ item.name }}
    //- .toc-item-children(v-if="item.children" v-for="_item in item.children" :key="_item.name" @click="jump(_item.name)") {{_item.name}}
</template>

<script lang="ts" setup>
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'
import { useStore } from 'vuex';
import { key } from '@/store/index'
// import { debounce } from 'lodash'

const { state } = useStore(key)
let tocList: any = ref([])
let barTop: any = ref(0)
let nowTop: any = ref(0)
let timer: any = ref()

// 跳转事件
const jump = (e: any, name: string) => {
  // 获取id，原生方法跳转
  const clickEle = document.querySelector(`#${name}`)
  clickEle?.scrollIntoView({
    // 可选属性为auto和smooth，auto为直接跳转，smooth为顺滑跳转
    behavior: 'auto'
  })
  // 计算目录指向标指向当前到达的标题位置
  const index = tocList.value?.findIndex((r: any) => r.name === name)
  barTop.value = index * 28
}

// 获取当前页面的标题流，初始化一些数据，name为标题名，用于跳转，parent为父级标题（若存在），top为标题当前的高度，用于计算滚动到当前标题高度时，高亮标题。
const initToc = () => {
  let toc: any = []
  const FormBoxItemArr: any = document.querySelectorAll('#FormBoxItem')
  for (let val of FormBoxItemArr) {
    if (val.parentNode.getAttribute('parent') && !toc?.find((r: any) => r.name === val.parentNode.getAttribute('parent'))) toc.push({ name: val.parentNode.getAttribute('parent'), top: val.offsetTop })
    if (val.parentNode.getAttribute('parent')) toc.push({ name: val.querySelector('.toc-title').innerText, top: val.offsetTop, parent: val.parentNode.getAttribute('parent') })
    else toc.push({ name: val.querySelector('.toc-title').innerText, top: val.offsetTop })
  }
  return toc
}


watch(() => state.scrollTop, (scrollTop: number) => {
  // const scrollTop = document.documentElement.scrollTop || document.body.scrollTop
  const scrollHeight = document.documentElement.scrollHeight || document.body.scrollHeight
  const clientHeight = document.documentElement.clientHeight || document.body.clientHeight
  const index = tocList.value?.findIndex((r: any) => r.top >= scrollTop)
  if (scrollTop + clientHeight === scrollHeight) {
    barTop.value = (tocList.value?.length - 1) * 28
    return
  }
  barTop.value = index * 28
})
// 页面滚动时，动态获取当前页面的高度
// const getScrollTop = (e: any) => {
//   const scrollTop = document.documentElement.scrollTop || document.body.scrollTop
//   const scrollHeight = document.documentElement.scrollHeight || document.body.scrollHeight
//   const clientHeight = document.documentElement.clientHeight || document.body.clientHeight
//   const index = tocList.value?.findIndex((r: any) => r.top >= scrollTop)
//   if (scrollTop + clientHeight === scrollHeight) {
//     barTop.value = (tocList.value?.length - 1) * 28
//     return
//   }
//   barTop.value = index * 28
// }

onMounted(() => {
  // 这里的处理是为了解决刚进页面的时候，偶然性的无法获取到页面标题到dom，则循环尝试，直到获取到为止，当超过200次尝试则停止尝试获取
  let index = 0
  timer.value = setInterval(() => {
    if (index > 200) return
    if (tocList.value?.length > 0) return
    tocList.value = initToc()
    index++
  })

  //监听点击标题事件
  document.addEventListener('click', (e: any) => {
    if (e.target.className === 'toc-title') {
      e.target.scrollIntoView({
        behavior: 'smooth'
      })
    }
  })
  // 监听滚动条的高度变化
  // document.addEventListener('scroll', getScrollTop)
})
// 在页面销毁前，销毁存在的监听事件和计时器
onBeforeUnmount(() => {
  // document.removeEventListener('scroll', getScrollTop, false)
  clearInterval(timer.value)
})
</script>
<style lang="scss" scoped>
#Toc {
  min-width: 180px;
  position: fixed;
  top: 10rem;
  right: 2rem;
  color: #909399;
  font-size: 14px;
  .ti{
    position: absolute;
    top: -2rem;
  }
  .toc-item {
    cursor: pointer;
    border-radius: 4px;

    &:hover {
      color: var(--el-color-primary);
    }
  }

  .toc-item-children {
    margin-left: 15px !important;
  }

  .toc-item-children {
    padding: 5px 10px;
  }

  .toc-item {
    padding: 0 10px;
    height: 28px;
    display: flex;
    align-items: center;
  }

  .is-child {
    margin-left: 1rem;
  }

  .toc-bar {
    width: 5px;
    height: 18px;
    background-color: var(--el-color-primary);
    position: absolute;
    margin-top: 5px;
    border-radius: var(--el-border-radius-base);
    top: 0;
    transition: all 0.3s ease;
  }
}
</style>
