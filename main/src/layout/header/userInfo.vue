<!--
 * @Author: Joe
 * @Date: 2022-10-13 11:35:54
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2023-01-03 16:03:02
 * @FilePath: /management_micro/main/src/layout/header/userInfo.vue
 * @Description:
 *
 * Copyright (c) 2022 by Brid9e wangdongqiao1997@163.com, All Rights Reserved.
-->
<template lang="pug">
#UserInfo(:style="`background-color:${!isCollapse && type == 'aside' ? 'var(--main-primary)' : 'transparent'};`")
  el-popover(popper-class="custom-popper-class" :width="260", trigger="click", :teleported="false" :show-arrow="false" placement="bottom-start")
    .pop-user-box
      el-avatar(:src="state.userInfo?.avatar || ''" fit="cover" :size="60" style="background-color:var(--main-primary)")
        el-icon(:size="30",color="#fff")
          UserFilled
      //- div {{getAuthorization}}
      .user-info
        .nickname(ref="nickname") {{ state.userInfo?.name }}
        el-tag.ident(v-show="!!identityTitle") {{ identityTitle }}
    .operation
      .operation-item(v-for="(item, i) in operationList" :key="i")
        el-popover(v-if="item?.link && item?.show" popper-class="custom-popper-class" :width="260", trigger="click", :teleported="false" :show-arrow="false" placement="left-start")
          //- ExTenant
          Component(:is="item.openComp")
          template(#reference)
            el-button(:icon="item.icon" text size="large")
              .btn-inner
                span {{item.label}}
                el-icon
                  ArrowRight
        el-button(v-if="!item.link && item.show" :icon="item.icon" text @click="item.func" size="large") {{item.label}}
    template(#reference)
      .user
        .left
          .avatar
            el-image(:src="state.userInfo?.avatar || ''" fit="cover")
              template(#error)
                el-icon(:size="22", color="var(--main-primary)")
                  UserFilled

        el-icon(v-if="type == 'aside'" :size="20", color="#fff", :style="`width:${!isCollapse? '16px' : '0'};opacity:${!isCollapse? '1' : '0'}`")
          ArrowRightBold
  //- .avatar
  //-   el-image(src="https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fci.xiaohongshu.com%2F3a253012-54cd-a598-497e-6b684527d345%3FimageView2%2F2%2Fw%2F1080%2Fformat%2Fjpg&refer=http%3A%2F%2Fci.xiaohongshu.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1668231772&t=84d0cb8e4c99154365ef69391d4ab7ed")
  //- .user-info
  //-   .nickname(ref="nickname") {{state.userInfo?.nickName}}
</template>
<script lang="ts" setup>
import { ref, watch, computed } from "vue";
import { SwitchButton, UserFilled, ArrowRightBold, StarFilled, Operation, Switch, ArrowRight, Discount, EditPen } from "@element-plus/icons-vue";
import { key } from "@/store";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import Cookie from "@/assets/scripts/cookie";
import { ElMessageBox } from "element-plus";
import ExTenant from '@/components/exTenant.vue';
// import { logoutApi, getUser } from '@/service/manage';

const props = defineProps({
  isCollapse: Boolean,
  type: String
})

const store = useStore(key);
const { state } = store;
const router = useRouter();
const userPopperStyle = ref({
  background: 'var(--main-menu-color-bg)',
  width: '200px',
  // background: 'transparent',
  border: 'none',
  backdropFilter: 'blur(5px)',
  borderRadius: 'var(--main-border-radius)',
})


/**
 * 基本设置
 */
const baseSettings = computed(() => {
  let baseObj = {}
  if (state.userInfo?.identityType === 'tenant') {
    baseObj = {
      label: '基本设置',
      link: false,
      openComp: null,
      icon: Operation,
      func: systemSetting,
      show: true
    }
  }
  return baseObj
})

/**
 * 我的授权
 */
const authorization = computed(() => {
  let res: any = ''
  if (state.userInfo?.flag === '3' || state.userInfo?.flag === '4') {
    res = {
      label: '我的授权',
      link: false,
      openComp: null,
      icon: Discount,
      func: toAuthorization,
      show: true
    }
  }
  return res
})

const operationList = computed(() => [{
  label: '切换租户',
  link: true,
  openComp: ExTenant,
  icon: Switch,
  func: null,
  show: state.userInfo?.identityType === 'system'
},
baseSettings.value,
authorization.value,
// {
//   label: '修改密码',
//   link: false,
//   openComp: null,
//   icon: EditPen,
//   func: changePwd,
//   show: true
// },
{
  label: '退出登录',
  link: false,
  openComp: null,
  icon: SwitchButton,
  func: toLogout,
  show: true
}])

const identityTitle = computed(() => {
  let title = ''
  switch (state.userInfo?.identityType) {
    case 'system':
      title = '管理员'
      break;
    case 'tenant':
      title = ''
      break;
    default:
      break;
  }
  return title
})


// 登出
const toLogout = () => {
  ElMessageBox.confirm("确定退出登录?", "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning"
  }).then(() => {
    // console.log(state.configs.base)
    store.dispatch("LogoutAction");
    // window.location.href = state.configs.base + '/berserker-base/redirect?type=logout&loginFrom=management&synjones-auth=' + state.token
    // state.token = state.token_type = ''
    // Cookie.remove("_uuid");
    // Cookie.remove("_type");
    // postLogout()
    // window.location.href = process.env.NODE_ENV === "development" ? "http://127.0.0.1:7100/manage/login" : window.location.origin + "/manage/login";
  });
};
// const postLogout = async () => {
//   console.log('postLogout', 1111)
//   const data = await logoutApi()
//   console.log('postLogout', data)
// }
//系统设置
const systemSetting = (index: number, data: any) => {
  // var dataRow = data;
  router.push({
    name: "systemSetting"
  });
};
//我的权限
const toAuthorization = (index: number, data: any) => {
  // var dataRow = data;
  router.push({
    // path: "/authorization/" + state.userInfo?.flag
    name: 'authorization',
    params: {
      id: state.userInfo?.flag
    }
  })
}

/**
 * 放到了computed中
 * @deprecated
 */
// function getAuthorization() {
//   let res: any = ''
//   if (state.userInfo?.flag === '3' || state.userInfo?.flag === '4') {
//     res = {
//       label: '我的授权',
//       link: false,
//       openComp: null,
//       icon: Discount,
//       func: toAuthorization,
//       show: true
//     }
//   }
//   return res
// }

/**
 * 点击修改密码
 */
function changePwd() {
  router.push({
    name: 'changePassword'
  })
}
</script>

<style lang="scss" scoped>
#UserInfo {
  margin-left: 1rem;
  display: flex;
  cursor: pointer;
  color: var(--main-color-font);
  // background-color: var(--main-primary);
  width: 100%;
  border-radius: var(--main-border-radius);
  // margin-bottom: 1rem;
  transition: all .3s ease-in-out;
  box-sizing: border-box;
  // &:hover {
  //   box-shadow: 0 8px 12px var(--main-button-active);
  // }
  // &:hover {
  //   color: var(--el-color-primary)!important;
  // }



  .pop-user-box {
    display: flex;
    align-items: center;
    flex-direction: column;
    margin-top: 0.5rem;

    .user-info {
      display: flex;
      align-items: flex-end;
      transition: all .3s ease;
      margin-top: 0.5rem;

      .ident {
        transform: scale(0.8);
        padding: 0 0.2rem;
      }

      .nickname {
        font-size: 1rem;
        font-weight: 600;
        font-family: Arial, Helvetica, sans-serif;
      }
    }
  }
}

:deep(.btn-r) {
  width: 100% !important;
  margin: 0 0 0.5rem 0 !important;
}

:deep(.user) {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;

  // padding: 0 1rem;
  .left {
    width: 100%;
    display: flex;

    .avatar {
      width: 40px;
      height: 40px;
      // background-color: var(--main-primary);
      background-color: var(--main-button-light);
      border-radius: 50%;
      overflow: hidden;

      .el-image {
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;

        .el-icon {
          margin: 0 !important;
        }
      }
    }
  }
}

:deep(.user-popover) {
  .el-button:last-child {
    margin: 0 !important;
  }
}

.operation {
  margin-top: 1rem;


  .el-button {
    width: 100%;
    justify-content: flex-start;
    padding-left: 0.5rem;
    margin-left: 0;

    .btn-inner {
      display: flex;
      width: 195px;
      justify-content: space-between;
    }

    :deep(.el-icon) {
      margin-left: 0 !important;
    }
  }
}
</style>
