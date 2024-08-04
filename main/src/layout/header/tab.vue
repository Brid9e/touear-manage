<template lang="pug">
#Tab
  //- el-icon.icon.home(:size="18")
    component(:is="ICON?.['Expand']")
  el-icon.icon.home(v-if="$route.path !== '/dashboard'" :size="18" @click="$router.push({path: '/'})" )
    component(:is="ICON?.['HomeFilled']")
  .header-tab
    //- swiper.my-swiper(ref="SwiperRef" :slidesPerView="6" :spaceBetween="3" :freeMode="true" :modules="modules")
      swiper-slide.swiper-item(v-for="item in state.shortcut" :key="item.index" :class="{'is-active': state.defaultActiveMeau === item.path}" @click="clickTab(item)") {{item.name}}
    el-tabs(v-if="state.shortcut?.length" v-model="editableTabsValue" @tab-click="onTabClick")
      el-tab-pane(v-for="item in state.shortcut" :key="item.index" :label="item.name" :name="item.path")
        template(#label)
          //- .tab-item-box(@click="clickTab(item)")
          .tab-item-box
            el-icon.icons
              component(:is="ICON?.[item.icon]")
            span.name(:style="{'margin-left': item.icon? '0.625rem' : '0'}") {{ item.name }}
            .tab-item-close(@click.stop="removeTab(item)")
              el-icon(size="16")
                component(:is="ICON?.['CloseBold']")
    h3(v-else style="color: var(--main-color-default)") 🎉 欢迎使用管理端
  el-popover(v-if="state.shortcut?.length" :width="50" popper-class="tab-popover")
    el-button(type="primary" @click="closeTab('all')") 关闭全部
    el-button(type="primary" @click="closeTab('butUsing')") 关闭除选中
    template(#reference)
      el-icon.icons.more(color="var(--main-color-default)")
        component(:is="ICON?.['DCaret']")
</template>

<script lang="ts" setup>
import { watch, ref, onMounted, computed } from 'vue'
import { FreeMode, Pagination } from 'swiper'
import { useStore } from 'vuex'
import { key } from '@/store'
import { useRoute, useRouter } from 'vue-router'
import * as ICON from '@element-plus/icons-vue'
import { routes } from '@/router'

const router = useRouter()
const route = useRoute()
const modules = [FreeMode]
const { state } = useStore(key)
// const SwiperRef = ref()
const editableTabsValue = computed({
  get() {
    return state.defaultActiveMeau
  },
  set(newValue) {
    state.defaultActiveMeau = newValue
  },
})

const onTabClick = (item: any) => {
  const data = state.shortcut[item.index]
  initShortcut()
  if (data.isThird) {
    router.push({ path: 'thirdPage', query: { url: data.index } })
  } else {
    router.push({ path: data.path })
  }
  data.isActive = true
  sessionStorage.shortcut = JSON.stringify(state?.shortcut)
}

const initShortcut = () => {
  for (let val of state?.shortcut) {
    val.isActive = false
  }
}

const removeTab = (item: any) => {
  // removeKeepAlive(item)
  const shortcutLength = state.shortcut?.length
  const index = state.shortcut?.findIndex((r: any) => r.index === item.index)
  const orgItem = state.shortcut.find((r: any) => r.isActive === true)
  if (shortcutLength === 1) {
    state?.shortcut.splice(index, 1)
    router.push({ path: '/' })
  } else {
    const _item = item.isActive
      ? index === shortcutLength - 1
        ? state.shortcut[shortcutLength - 2]
        : state.shortcut[shortcutLength - 1]
      : orgItem
    _item.isActive = true
    router.push({ path: _item.path || '/' })
    state?.shortcut.splice(index, 1)
  }
  sessionStorage.shortcut = JSON.stringify(state?.shortcut)
}

const closeTab = (type: string) => {
  if (type === 'all') {
    state.shortcut = []
    router.push({ path: '/' })
  }
  if (type === 'butUsing') {
    let arr: any = []
    state?.shortcut?.forEach((r: any) => {
      r.isActive && arr.push(r)
    })
    state.shortcut = arr
  }
  sessionStorage.shortcut = JSON.stringify(state.shortcut)
}

//改变KeepAlive状态，相当于删除缓存页
const removeKeepAlive = (item: any) => {
  route.meta.keepAlive = false
}
</script>
<style lang="scss" scoped>
#Tab {
  user-select: none;
  max-width: calc(100% - 11rem);
  display: flex;
  align-items: center;

  .header-tab {
    width: 100%;
  }

  :deep(.el-tabs) {
    // display: flex;
    // align-items: center;
    // margin-bottom: 10px;

    .el-tabs__header {
      margin-bottom: 0;
    }

    .el-tabs__item {
      height: 40px;
      // border: none !important;
      color: var(--main-color-default);
    }

    .el-tabs__nav-wrap {
      &::after {
        content: '';
        display: none;
      }
    }

    .el-tabs__active-bar {
      display: none;
    }
  }
}

.tab-item-box {
  display: flex;
  align-items: center;
  justify-content: center;
  width: auto;

  .el-icon.icons {
    width: auto;
  }

  &:hover .tab-item-close {
    margin-left: 0.375rem;
    max-width: 16px;
    opacity: 1;
  }
}

.icon.home {
  width: 24px;
  height: 24px;
  flex-shrink: 0;
  margin-right: 1rem;
  // color: white;
  // color: var(--el-color-primary);
  color: var(--main-color-default);
  border-radius: 8px;
  cursor: pointer;
  padding: 0.2rem;
  transition: all 0.3s ease;

  &:hover {
    background-color: var(--main-button-hover);
  }
}

.icons.more {
  height: 40px;
  display: flex;
  align-items: center;
  margin-left: 0.5rem;
  // background-color: red;
}

.tab-item-close {
  // margin-left: 0.375rem;
  transition: all 0.3s linear;
  max-width: 0;
  opacity: 0;
  display: flex;
  align-items: center;

  &:hover {
    color: var(--el-color-error);
  }
}

:deep(.el-tabs__item) {
  padding: 0 1rem !important;

  &.is-active {
    // background-color: var(--main-primary);
    background-color: var(--main-button-hover);
    // background-color: red;
    flex-shrink: 0;
    border-radius: calc(var(--main-border-radius) / 2);
  }
}

.tab-popover {
  .el-button {
    width: 100%;
    margin: 0 0 0.2rem 0;

    &:last-child {
      margin: 0 !important;
    }
  }
}
</style>
