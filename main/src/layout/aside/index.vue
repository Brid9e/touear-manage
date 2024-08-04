<!--
 * @Author: Joe
 * @Date: 2022-10-11 18:09:08
 * @LastEditors: Joe
 * @LastEditTime: 2022-11-26 19:28:57
 * @FilePath: /management-micro/main/src/layout/aside/index.vue
 * @Description:
 *
 * Copyright (c) 2022 by Brid9e wangdongqiao1997@163.com, All Rights Reserved.
-->
<template lang='pug'>
#Aside
  //- .logo-box(@click="$router.push({ path: '/' })")
    .logo-img(style="--animate-duration: 0.45s")
      el-image(:class="logoClass?.animate + logoClass?.maxClass", v-show="!isCollapse", :src="authPathTenantId ? state?.manageLogo : defaultLogo")
        template(#loading)
          el-skeleton(:rows="2" style="padding: 0 1rem;box-sizing:border-box")
        template(#error)
          el-image(:src='defaultLogo')
      el-image(:class="logoClass?.animate + logoClass?.minClass", v-show="isCollapse", :src="authPathTenantId ? state?.manageLogo : defaultLogo")
        template(#loading)
          el-skeleton(:rows="2" style="padding: 0 1rem;box-sizing:border-box")
        template(#error)
          el-image(:src='defaultLogo')
    //- .collapse-bg
      .collapse(@click.stop="onClickCollapse")
        el-icon(:size="12", :color="isLight ? iconColor : '#ffffff'" :class="{'icon-is-left': isCollapse }")
          ArrowLeftBold
          //- ArrowRightBold(v-else)
  .menu
    el-menu.el-menu-vertical(unique-opened, :text-color="menuFontColor" :default-active="defaultIndex", :collapse="isCollapse", style="overflow: hidden", :collapse-transition="true")
      SubMenu(:menuDataList="menuList" :isCollapse="isCollapse")
    //- el-skeleton(v-if="!menuList?.length" :rows="16")
    el-skeleton(v-if="!menuList?.length" :rows="8" style="padding: 0 1rem;box-sizing:border-box")
    //- el-color-picker(v-model="asideColor" @change="changeColorPicker")
    //- .user-box
      userInfo(:isCollapse="isCollapse", type="aside")
  .menu-expand(@click="isCollapse = !isCollapse")
    el-icon(:size="24")
      Fold(v-if="!isCollapse")
      Expand(v-else)
</template>
<script lang='ts' setup>
import { ref, watch, onMounted, computed, reactive, nextTick } from "vue";
import { CaretLeft, CaretRight, ArrowRightBold, ArrowLeftBold, Fold, Expand } from "@element-plus/icons-vue";
import { useStore } from "vuex";
import { key } from "@/store";
import { useRouter } from "vue-router";
import { MenuEdits } from "@/service/manage";
import { toTreeData } from "@/assets/scripts/utils";
import SubMenu from "./subMenu.vue";
import ExColor from '@/assets/scripts/color'
import userInfo from '../header/userInfo.vue'
import defaultLogo from '@/assets/images/logo-management.png'
import { useSessionStorage, useStorage } from '@vueuse/core'
import { menuData } from './menu'

const router = useRouter();
const { state } = useStore(key);
const logoObj = {
  max: "http://192.168.3.229/config/image/logo-max.png",
  min: "http://192.168.3.229/config/image/logo-min.png"
};
const current = ref("");
const menuList: any = ref([]);
// const isCollapse = ref(localStorage.isCollapse === 'true');
const iconColor = ref("var(--main-color-font)");
const logoUrl = ref(logoObj["max"]);
const logoClass = reactive({
  animate: "animate__animated ",
  maxClass: "",
  minClass: ""
});
const menuRef = ref()

const isCollapse = useStorage('isCollapse', true)
const manageLogo: any = useStorage('manageLogo', {})
const authPath = useSessionStorage('authPath', '')

const authPathTenantId = computed(() => {
  return authPath.value?.split('-')?.[1] || state.userInfo?.tenantId
})

const isLight = computed(() => {
  const _root: any = document.querySelector(':root')
  const rootValue = getComputedStyle(_root).getPropertyValue('--main-menu-color-bg')
  const bgColor: any = ExColor.colorToRgb(rootValue)
  return ExColor.isLight(bgColor[0], bgColor[1], bgColor[2])
})

const menuFontColor = computed(() => {
  return isLight.value ? '#000000e0' : '#ffffffe0'
})

const onClickCollapse = () => {
  isCollapse.value = !isCollapse.value
}

const defaultIndex = computed(() => {
  const path = state.defaultActiveMeau?.slice(1)
  const item = (JSON.parse(sessionStorage.menuData || '{}')?.orgData || state.orgMenuData)?.find((r: any) => {
    if (['http://', 'https://']?.includes(r.scheme) && path?.split('thirdPage?url=')[1] === `${r.scheme}${r.path}`) return r
    if (path === r.path) return r
  })
  state.defaultActiveMeauItem = item
  return item?.scheme + item?.path !== '/' ? item?.scheme + item?.path : menuList.value[0]?.index
})

const goto = (path?: any) => router.push({ path: path });

const toRouter = () => {
  state.isMicroApp = false
  router.push({ path: "/about" })
}

/**
 *
 * @date 2022-10-12 13:42:11
 * @author Joe
 * @description 获取菜单
 *
 */
const getMenuAll = () => {
  state.funcButton = initFuncButton(menuData) || {}
  state.orgMenuData = menuData
  const _menuList = toTreeData(menuData, 0)
  state.menuData = menuList.value = _menuList
  sessionStorage.menuData = JSON.stringify({ data: _menuList, isChange: false, orgData: menuData })

}

const initFuncButton = (menuData: any[]) => {
  let arr: any = []
  let obj: any = {}
  for (let val of menuData) {
    val.actionList && arr.push(...val?.actionList)
  }
  for (let j = 0; j < arr?.length; j++) {
    obj[arr?.[j]?.actionCode] = arr?.[j]?.status
  }
  return obj
}

const changeColorPicker = (val: any) => {
  localStorage.menuColor = val
}

onMounted(() => {
  state.manageLogo = manageLogo.value[authPathTenantId.value] = manageLogo.value[authPathTenantId.value] || `${state.frontConfig?.publicResource}public/login/${'logo-management-' + (authPathTenantId.value)}.png?timestamp=${new Date().getTime()}`
  if (sessionStorage.menuData) menuList.value = JSON.parse(sessionStorage.menuData).data
  getMenuAll()
})

watch(
  () => state.menuData,
  (val: any) => {
    menuList.value = val
  },
  {
    deep: true
  }
)

watch(isCollapse, (val: boolean) => {
  if (val) logoClass.minClass = "animate__fadeInRight"
  else logoClass.maxClass = "animate__fadeInLeft"
})

watch(() => state.frontConfig, (val) => {
  if (val?.publicResource) state.manageLogo = manageLogo.value[authPathTenantId.value] = manageLogo.value[authPathTenantId.value] || `${val.publicResource}public/login/${'logo-management-' + authPathTenantId.value}.png?timestamp=${new Date().getTime()}`
}, {
  deep: true
})

</script>

<style lang='scss' scoped>
#Aside {
  background-color: var(--main-color-default);
  height: 100%;
  user-select: none;
  position: relative;
}

.user-box {
  padding: 1rem 1rem 0 1rem;
  box-sizing: border-box;
}

// :deep(.el-image), :deep(.collapse-bg), :deep(.collapse) {
//   filter: invert(100%);
// }

:deep(.el-menu) {
  border-right: none;
  background-color: transparent !important;
  // margin-left: 1rem;
}

.menu {
  // -webkit-mask-image: -webkit-linear-gradient(bottom, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 1) 10%);
  height: 100%;
  overflow-y: auto;

  &::-webkit-scrollbar {
    display: none;
  }

  padding-bottom: 3rem;
  box-sizing: border-box;
}

.el-menu-vertical:not(.el-menu--collapse) {
  width: 230px;
  // min-height: 400px;
}

:deep(.el-menu--collapse) .el-sub-menu__title span {
  display: none;
}

:deep(.el-menu--collapse) .el-sub-menu__title .el-sub-menu__icon-arrow {
  display: none;
}

.logo-img {
  width: auto;
  max-height: 100%;
  position: absolute;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 0.5rem;
  box-sizing: border-box;

  :deep(.el-image__wrapper) {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;

  }

  :deep(.el-image) {
    width: 100%;

    img {
      height: auto;
    }
  }
}

.logo-box {
  max-width: 230px;
  height: 100px;
  // margin-top: 20px;
  // border-radius: var(--main-border-radius) var(--main-border-radius) 0 0;
  // background-color: var(--main-color-default);
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  // padding: 0 0.5rem;
  box-sizing: border-box;
  cursor: pointer;

  .collapse-bg {
    width: 30px;
    height: 30px;
    border-radius: 50%;
    top: 10px;
    right: -16px;
    cursor: pointer;
    position: absolute;
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: var(--main-color-bg);
    transition: all 0.3s ease;
    z-index: 999;

    &:hover {
      transform: scale(1.2);

      .collapse {
        box-shadow: 0 2px 4px #dddce636;
      }
    }

    // background-color: red;

    .collapse {
      width: 22px;
      height: 22px;
      border-radius: 50%;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      background-color: var(--main-menu-color-bg);

      .el-icon {
        transition: transform .3s ease;
        transition-delay: .3s;
      }

      // box-shadow: 0 2px 6px #dddce636;
    }
  }
}

:deep(.el-menu-item:hover),
:deep(.el-sub-menu__title:hover) {
  // filter: brightness(0.5);
  background: var(--el-fill-color);
  //

}

:deep(.el-sub-menu__title) {
  // background-color: var(--main-menu-sub-color-bg);
  border-radius: 4px;
  font-weight: 600 !important;
  transition: none !important;
}

:deep(.el-menu-item) {
  border-radius: 4px;
  transition: none !important;

  &.is-active {
    color: var(--main-primary) !important;
    // color: var(--el-color-black) !important;
    // background-color: var(--main-menu-sub-color-bg);
    // background: linear-gradient(90deg, var(--main-menu-sub-color-bg) 50%, var(--main-primary) 100%);
    background: hsla(var(--main-primary-hsla), 0.1);
    position: relative;

    &:after {
      content: "";
      position: absolute;
      right: 0;
      width: 3px;
      height: 100%;
      background-color: var(--main-primary);
    }
  }

}

.icon-is-left {
  transform: rotate(180deg);
}

.el-skeleton {
  opacity: 0.5;
}

.menu-expand {
  position: absolute;
  bottom: 0;
  width: 100%;
  display: flex;
  justify-content: center;
  padding: 0.5rem 0;
  cursor: pointer;
  color: #000000E0;
  background-color: var(--main-color-default);

  &:hover {
    background-color: var(--el-fill-color-light);
  }
}
</style>
