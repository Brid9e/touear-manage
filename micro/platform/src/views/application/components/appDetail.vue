<template lang="pug">
.app-detail-content
  .app-info.border-bottom
    .app-info-base
      el-image.img(:src='info.masterImg')
        template(#error)
          el-image(:src='defaultAppIcon')
      .info
        h2 {{ info.appName }}
          span.font-size-14.text-warning （{{ userType(info.userType || info.appUserType) }}）
          template(v-for='item in platType')
            el-tag.ml-2.margin-left-x.icon-p-top {{ item.name }}
          //- el-tag.ml-2.margin-left-x.icon-p-top(:type='(info.userType || info.appUserType) === "user" ? "warning" : info.userType === "mercacc" ? "" : "info"') {{ userType(info.userType || info.appUserType) }}
        //- p 终端类型：
        p {{ info.appDesc ? info.appDesc : "暂无简介" }}
  //- div.app-info.app-info-high.border-bottom
  //-   .item
  //-     .title 应用图标:
  //-     .value 用户群组
  //-   .item
  //-     .title 简介:
  //-     .value {{info.appDesc || '暂无'}}
  div
    h3.margin-bottom-2x.margin-top-2x 应用介绍：
    div(v-if='info.richText', v-html='info.richText')
    div(v-else, style='padding: 150px 0; font-size: 30px; text-align: center; color: #ccc') 暂无介绍~~~
</template>
<script lang="ts" setup>
import { reactive, ref, toRefs, defineProps } from 'vue'
import { Aim } from '@element-plus/icons-vue'
import { userType } from '@/assets/scripts/state'
import { useStore } from 'vuex'
import { key } from '@/store'
const defaultAppIcon = new URL('../../../assets/images/example.svg', import.meta.url).href
const store = useStore(key)
const props = defineProps(['info'])
const platTypeLevelCloud = store.state.platTypeLevelCloud
let platType = ref([])
platType.value = platTypeLevelCloud.filter((o: any) => {
  return props.info.platType.includes(o.code) || (o.parentCode && props.info.platType.includes(o.parentCode))
})
</script>
<style lang="scss" scoped>
.app-detail-content {
  position: relative;
}
.app-info {
  padding: 10px 0;
}
.app-info-base {
  padding-left: 70px;
  .img {
    position: absolute;
    left: 0;
    width: 50px;
    height: 50px;
  }
  .info {
    h2 {
      padding-left: 0;
      margin-bottom: 0;
    }
    p {
      margin-top: 10px;
      color: #666;
      font-size: 14px;
    }
  }
  .edit {
    font-size: 14px;
    color: var(--main-primary);
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
