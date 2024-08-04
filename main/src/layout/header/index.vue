<!--
 * @Author: Joe
 * @Date: 2022-10-11 18:09:20
 * @LastEditors: Joe
 * @LastEditTime: 2022-10-13 15:10:48
 * @FilePath: /management_micro/main/src/layout/header/index.vue
 * @Description:
 *
 * Copyright (c) 2022 by Brid9e wangdongqiao1997@163.com, All Rights Reserved.
-->
<template lang='pug'>
#Header.main-box-shadow
  .mid-box
    Logo
    //- .h-icon(@click="collapse")
      el-icon(:size="24")
        Fold(v-if="!isCollapse")
        Expand(v-else)
    .h-icon(@click="back")
      el-icon(:size="24")
        Back
    Tab
  Tools
  //- .right-box
    UserInfo(type="top")
    //- Tools
</template>
<script lang='ts' setup>
import { ref } from 'vue'
import { Back, Operation, MoreFilled, Fold, Expand } from "@element-plus/icons-vue"
import UserInfo from './userInfo.vue';
import Tools from './tools.vue';
import Breadcrumb from './breadcrumb.vue';
import { useRouter } from 'vue-router';
import Tab from './tab.vue';
import Logo from './logo.vue';
import { useStorage } from '@vueuse/core';

const iconColor = ref('var(--main-primary)')
const isCollapse = useStorage('isCollapse', true)

const router = useRouter()

const back = () => {
  window.history.go(-1)
}

function collapse() {
  isCollapse.value = !isCollapse.value
}

</script>

<style lang='scss' scoped>
#Header {
  height: 100%;
  // background-color: var(--main-color-default);
  background-color: var(--el-color-primary);
  // border-radius: 0 0 0 var(--main-border-radius);
  padding: .5rem 1.25rem .5rem 0;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: space-between;

  .h-icon {
    width: 30px;
    height: 30px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 1rem;
    flex-shrink: 0;
  }

  .mid-box {
    width: calc(100% - 30rem);
  }

  .right-box {
    // width: 10%;
    flex-shrink: 0;
  }

  .left-box,
  .right-box,
  .mid-box {
    display: flex;
    align-items: center;
  }

  .h-icon {
    color: var(--main-color-default);
    transition: all 0.3s ease;
    border-radius: 8px;

    &:hover {
      background-color: var(--main-button-hover);
    }
  }
}
</style>