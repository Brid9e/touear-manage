<!--
 * @Author: Joe
 * @Date: 2022-10-11 18:08:53
 * @LastEditors: Joe
 * @LastEditTime: 2022-10-13 10:43:54
 * @FilePath: /management_micro/main/src/layout/index.vue
 * @Description:
 *
 * Copyright (c) 2022 by Brid9e wangdongqiao1997@163.com, All Rights Reserved.
-->
<script lang='ts' setup>
import Aside from './aside/index.vue'
import Main from './main/index.vue'
import Header from './header/index.vue'
</script>

<template lang='pug'>
#Layout
  el-container
    el-header
      Header
    el-container
      el-aside(width="auto")
        Aside
      el-main
        Main
</template>
<style lang='scss' scoped>
#Layout {
  .el-aside {
    height: calc(100vh - 3.75rem);
    // padding: .625rem 0 .625rem .625rem;
    overflow: initial;
  }

  .el-header {
    padding: 0;
  }
}

.el-main {
  padding: .625rem 0 0 .625rem;
}
</style>