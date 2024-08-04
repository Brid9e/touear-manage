<template lang='pug'>
#manage-setting
  SettingItem(title="平台图标" subTitle="修改各平台的首页图标")
    el-tabs(v-model="activeName" type="border-card")
      el-tab-pane(v-for="item in platType" :key="item.code" :label="item.label" :name="item.code")
        ImageUploadPanel(:src="logoMap[item.code]" :item="item" @upateSuccess="onUpdateSuccess" type="logo")
  //- SettingItem(title="背景图片" subTitle="修改管理端背景图片")
    .border-box
      ImageUploadPanel(:src="bgMap['management']" :item="manageBgItem" @upateSuccess="onUpdateSuccess" type="bg")
</template>
<script lang='ts' setup>
import { computed, ref } from 'vue'
import { key } from '@/store';
import { useStore } from 'vuex';
import { ImageUploadPanel, SettingItem } from './modules'
import { map } from 'lodash'
import { useBase64, useStorage } from '@vueuse/core';

const store = useStore(key)
const { state } = store

const manageLogo: any = useStorage('manageLogo', {})

const activeName = ref('management')
const logoMap: any = ref({
  management: state.frontConfig?.publicResource + `public/login/${'logo-management-' + state.userInfo?.tenantId}.png` + "?timestamp=" + new Date().getTime(),
  pc: state.frontConfig?.publicResource + "public/logo/logo-web.png" + "?timestamp=" + new Date().getTime(),
  mobile: state.frontConfig?.publicResource + `public/logo/${'logo-mobile-' + state.userInfo?.tenantId}.png` + "?timestamp=" + new Date().getTime(),
  selfService: state.frontConfig?.publicResource + "public/logo/logo-selfService.png" + "?timestamp=" + new Date().getTime()
})
const bgMap: any = ref({
  management: state.frontConfig?.publicResource + "public/login/background-management.png" + "?timestamp=" + new Date().getTime()
})

const manageBgItem = computed(() => {
  return {
    label: '管理端',
    code: 'management',
    path: 'login',
    fileName: 'background-management.png'
  }
})
const platType = computed(() => {
  return [{ label: '管理端', code: 'management', path: 'login', fileName: `${'logo-management-' + state.userInfo?.tenantId}.png` }, ...map(state.platTypeList, (r: any) => (r = { label: r.name, code: r.code, path: 'logo', fileName: `logo-${r.code === 'pc' ? 'web' : r.code}-${state.userInfo?.tenantId}.png` }))]
})

const onUpdateSuccess = (obj: any) => {
  if (obj.type === 'logo') {
    logoMap.value[obj.code] = obj.src
    if(obj.code === 'management') {
      manageLogo.value[state.userInfo?.tenantId] = state.frontConfig?.publicResource + `public/login/${'logo-management-' + state.userInfo?.tenantId}.png` + "?timestamp=" + new Date().getTime()
    }
  }
  else bgMap.value[obj.code] = obj.src
}
</script>
<style lang='scss' scoped>
#manage-setting {
  .s-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 1rem;

    span.label {
      font-size: 14px;
    }
  }

  .el-tabs--border-card {
    border-radius: 8px;
    overflow: hidden;

    :deep(.el-tabs__header) {
      background-color: transparent !important;
    }
  }

  .border-box {
    background: var(--el-bg-color-overlay);
    border: 1px solid var(--el-border-color);
    border-radius: 8px;
    overflow: hidden;
    padding: 2rem 15px;
  }
}
</style>
