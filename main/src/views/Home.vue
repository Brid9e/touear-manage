<!--
 * @Author: your name
 * @Date: 2021-09-16 17:32:14
 * @LastEditTime: 2022-10-13 18:09:18
 * @LastEditors: Joe
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: /management_micro/main/src/views/Home.vue
-->
<template lang="pug">
#Home
  el-config-provider(:locale="zhCn")
    Layout
</template>

<script lang="ts" setup>
import Layout from '@/layout/index.vue'
import zhCn from 'element-plus/dist/locale/zh-cn'
</script>

