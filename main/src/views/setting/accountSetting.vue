<!--
 * @Author: your name
 * @Date: 2022-02-17 13:16:47
 * @LastEditTime: 2022-03-15 10:29:56
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: /management/src/apps/manage/views/setting/accountSetting.vue
-->
<template lang="pug">
.card-account
  //- div.avatar-shadow
  el-avatar.avatar(:size="120" :src="userInfo.avatar ? userInfo.avatar : require('@/assets/images/avatar.png')")
  el-row.border-bottom(align="middle")
    el-col(:span="12").label 登陆名
    el-col(:span="12").text-right.value
      p.font-size-14 {{ userInfo.account }}
      p.text-gray-6.font-size-12 当前登录名
  el-row.border-bottom(align="middle")
    el-col(:span="12").label 姓名
    el-col(:span="12").text-right.value
      p.font-size-14 {{ userInfo.name }}
      p.text-gray-6.font-size-12  姓名
  el-row.border-bottom(align="middle")
    el-col(:span="12").label 当前角色
    el-col(:span="12").text-right.value
      p.font-size-14
        span(v-for="(item, index) in userInfo.roles" :key="index") {{ item.roleName }}
          span(v-if="index !== userInfo.roles.length - 1") ，
      p.text-gray-6.font-size-12  当前角色
  el-row.border-bottom(align="middle")
    el-col(:span="12").label 绑定手机
    el-col(:span="12").text-right.value
      p.font-size-14 {{ userInfo.mobile }}
      p.text-gray-6.font-size-12  {{ userInfo.mobile ? '已绑定手机' : '尚未绑定手机' }}
  el-row(align="middle")
    el-col(:span="12").label 绑定邮箱
    el-col(:span="12").text-right.value
      p.font-size-14 {{ userInfo.email }}
      p.text-gray-6.font-size-12  {{ userInfo.email ? '已绑定邮箱' : '尚未绑定邮箱' }}
</template>
<script lang="ts">
import { defineComponent, computed } from 'vue'
import { useStore } from 'vuex'
import { key } from '@/store'
export default defineComponent({
  name: 'embedded',
  components: {},
  setup() {
    const store = useStore(key)
    const { state } = store
    return {
      userInfo: computed(() => state.userInfo)
    }
  }
})
</script>
<style lang="scss" scoped>
.card-account {
  width: 50%;
  margin: 0 auto;
  min-width: 650px;
  margin: 0 auto;
  margin-top: 90px;
  position: relative;
  overflow: visible;
  padding-top: 70px;
  padding-bottom: 50px;
  .avatar-shadow {
    position: absolute;
    top: 0;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: -1;
    width: 120px;
    height: 120px;
    border-radius: 100%;
    box-shadow: 0 9px 36px 0 rgba(0, 0, 0, 0.15);
  }
  .avatar {
    position: absolute;
    top: 0;
    left: 50%;
    transform: translate(-50%, -50%);
  }
  .el-row {
    padding: 10px;
  }
  .label {
    height: 50px;
    line-height: 50px;
  }
  .value {
    line-height: 25px;
  }
}
</style>
