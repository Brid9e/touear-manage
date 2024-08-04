<template lang="pug">
.app-detail-content.content-main
  .app-info.app-info-base.border-bottom
    img(src='http://192.168.3.230/minio/theme/4b1b994d2feda57a94cfd49fc7f5b89b/images/plat/white/appView/card-recharge.png')
    .info
      h2 卡片充值
      p 可使用微信，支付宝，银行卡等多种方式进行校园卡充值，简单快的速完成充值操作。
    .edit 编辑
      el-icon
        aim
    //- .switch
      //- span {{value ? '已启用' : '已停用'}}
      //- el-switch(v-model='value' active-color='#13ce66' inactive-color='#ccc')
  .app-info.app-info-high.border-bottom
    .item
      .title 应用图标
      .value 用户群组
    .item
      .title 简介
      .value {{  }}
    //-   .title 应用主页
    //-   .value https://www.baidu.com/?tn=62095104_43_oem_dg
</template>
<script lang="ts">
import { defineComponent, reactive, toRefs } from 'vue'
import { Aim } from '@element-plus/icons-vue'
const arrtextaaa: number[] = [0, 1, 2, 3, 4]
export default defineComponent({
  name: 'add',
  components: {
    Aim
  },
  setup() {
    const step = reactive({
      value: true,
      arrtext: arrtextaaa
    })
    console.log(step.arrtext[0])
    const refStep = toRefs(step)
    return {
      ...refStep
    }
  }
})
</script>
<style lang="scss" scoped>
.app-detail-content {
  position: relative;
  padding-top: 50px;
}
.app-info {
  padding-bottom: 20px;
  padding-top: 20px;
}
.app-info-base {
  padding-left: 70px;
  img {
    position: absolute;
    left: 0;
    width: 50px;
    height: auto;
  }
  .info {
    p {
      margin-top: 10px;
      color: #666;
      font-size: 14px;
    }
  }
  .edit {
    font-size: 14px;
    color: var(--color-primary);
    margin-right: 8px;
    position: absolute;
    right: 0;
    top: 50px;
  }
  // .switch {
  //   span {
  //     font-size: 14px;
  //     color: #999;
  //     margin-right: 8px;
  //   }
  //   position: absolute;
  //   right: 0;
  //   top: 50px;
  // }
}
.app-info-high {
  .item {
    font-size: 14px;
    height: 30px;
    line-height: 30px;
    .title {
      color: #999;
      display: inline-block;
      width: 80px;
    }
    .value {
      color: #333;
      display: inline-block;
    }
  }
}
</style>
