<script lang='ts' setup>
import { computed } from 'vue'
import { useSessionStorage } from '@vueuse/core'
import { useStore } from 'vuex'
import { key } from '@/store'
import defaultLogo from '@/assets/images/logo-management.png'

const store = useStore(key)
const { state } = store

const authPath = useSessionStorage('authPath', '')

const authPathTenantId = computed(() => {
  return authPath.value?.split('-')?.[1] || state.userInfo?.tenantId
})
</script>
<template lang='pug'>
.manage-logo
  span Touear Admin
  //- el-image(v-show="!isCollapse", :src="authPathTenantId ? state?.manageLogo : defaultLogo" fit="cover")
    template(#loading)
      el-skeleton(:rows="2" style="padding: 0 1rem;box-sizing:border-box")
    template(#error)
      el-image(:src='defaultLogo')
</template>
<style lang='scss' scoped>
.manage-logo {
  width: 230px;
  margin-right: 0.625rem;
  height: 100%;
  padding: 0.5rem;
  padding-left: var(--el-menu-base-level-padding);
  box-sizing: border-box;
  flex-shrink: 0;
  display: flex;
  align-items: center;

  .el-image {
    max-width: 150px;
    height: 100%;
  }

  span {
    font-size: 1.5rem;
    font-weight: 700;
    color: #ffffff;
    font-family: 'Times New Roman', Times, serif
  }
}
</style>
