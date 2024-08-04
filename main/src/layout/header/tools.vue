<!--
 * @Author: Joe
 * @Date: 2022-10-13 15:01:44
 * @LastEditors: Joe
 * @LastEditTime: 2022-10-13 15:14:22
 * @FilePath: /management_micro/main/src/layout/header/tools.vue
 * @Description: # Tools
 *
 * Copyright (c) 2022 by Brid9e wangdongqiao1997@163.com, All Rights Reserved.
-->
<template lang="pug">
#header-tools
  //- el-popover(v-if="state.userInfo?.identityType === 'system'" popper-class="tools-pop" placement="top-start" trigger="click" :width="230" title="切换租户")
    ExTenant
    template(#reference)
      el-icon.h-tools(:size="18" color="var(--main-color-font)")
        Switch
  el-popover(popper-class="tools-pop custom-popper-class" placement="top-start" trigger="click" :width="350" title="进度任务" :show-arrow="false")
    SyncList(@getStatus="getSyncStatus")
    template(#reference)
      el-badge(@click="hidden = true" :type="badgeNum?.syncingNum || badgeNum?.failedNum ? 'danger' : 'success'" :value="badgeNum?.failedNum ?  `有${badgeNum?.failedNum}个失败` : badgeNum?.finishedNum && !badgeNum.syncingNum ? '完成' :  `${badgeNum.syncingNum}`" :hidden="hidden || (!badgeNum.syncingNum && !badgeNum.finishedNum)" :show-zero="false")
        el-icon.h-tools(:size="18" color="var(--main-color-default)" )
          Files
          .progress-mini(v-show="fullProgress")
            .progress-line(:style="`width:${fullProgress}%`")
  //- el-icon(:size="18" color="var(--main-color-font)" @click="toSetting")
    Setting
  UserInfo
</template>
<script lang="ts" setup>
import { ref } from 'vue'
import {
  Message,
  SwitchButton,
  Setting,
  Switch,
  Files,
} from '@element-plus/icons-vue'
import { ElMessageBox } from 'element-plus'
import { key } from '@/store'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import SyncList from '@/components/syncList.vue'
import UserInfo from './userInfo.vue'

const store = useStore(key)
const { state } = store
const router = useRouter()
const badgeNum = ref({})
const hidden = ref(true)
const fullProgress = ref(0)

function toSetting() {
  router.push('/systemSetting')
}

function getSyncStatus(res: any) {
  fullProgress.value = res?.totalProgress || 0
  if (res.syncingNum) {
    hidden.value = false
  }
  badgeNum.value = res
}
</script>

<style lang="scss">
#header-tools {
  display: flex;
  align-items: center;
  flex-shrink: 0;

  .el-icon.h-tools {
    margin-left: 10px;
    padding: 4px;
    border-radius: 4px;
    display: flex;
    justify-content: flex-end;
    cursor: pointer;
    position: relative;

    &:hover {
      background-color: var(--main-button-hover);
    }
  }
}

.tools-pop {
  padding: var(--el-popover-padding) 0 !important;

  .el-popover__title {
    padding-left: var(--el-popover-padding);
  }
}

.progress-mini {
  background-color: var(--el-border-color-lighter);
  width: 100%;
  height: 2px;
  position: absolute;
  bottom: 0;
  left: 0;
  overflow: hidden;

  .progress-line {
    width: 0%;
    height: 100%;
    background-color: var(--main-button-hover);
    transition: all 0.3s ease;
  }
}
</style>
