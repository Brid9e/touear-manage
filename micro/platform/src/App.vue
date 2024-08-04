<!--
 * @Author: Joe
 * @Date: 2022-10-09 16:02:14
 * @LastEditors: Joe
 * @LastEditTime: 2022-10-14 12:48:45
 * @FilePath: /management_micro/micro/platform/src/App.vue
 * @Description: 
 * 
 * Copyright (c) 2022 by Brid9e wangdongqiao1997@163.com, All Rights Reserved. 
-->
<template lang="pug">
el-config-provider(:locale="zhCn")
  RouterView(v-slot="{ Component }")
    KeepAlive
      component(:key="$route?.path" :is="Component" v-if="$route?.meta.keepAlive")
    component(:key="$route?.path" :is="Component" v-if="!$route?.meta.keepAlive")
</template>
<script lang="ts" setup>
// import zhCn from 'element-plus/dist/locale/zh-cn'
import zhCn from 'element-plus/dist/locale/zh-cn'

</script>