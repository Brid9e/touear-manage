<template lang="pug">
.app-detail-content.info-content
  .inner-b
    .title-line 基础信息
    .blcok-c.app-info.app-info-high
      el-row(:gutter='20')
        el-col(:span='24')
          .item
            .title 图标:
            .value
              .img-item.text-center(v-for='img in info.iconArr')
                el-image(:src='img.src', style='width: 50px; height: 50px')
                  template(#error='')
                    el-image(:src='defaultAppIcon', style='width: 50px; height: 50px')
                p.font-size-12.text-gray-6 {{ img.name }}
        el-col(:span='12')
          .item
            .title 名称:
            .value {{ info.appName || "暂无" }}
        el-col(:span='12')
          .item
            .title 英文名:
            .value {{ info.appNameEn || "暂无" }}
        el-col(:span='12')
          .item
            .title code:
            .value {{ info.appCode || "暂无" }}
        el-col(:span='12')
          .item
            .title 状态:
            .value {{ info.status === 1 ? "正常" : "未开启" }}
        el-col(:span='24')
          .item
            .title 简介:
            .value {{ info.appDesc || "暂无" }}
        el-col(:span='24')
          .item
            .title 终端类型:
            .value
              el-tag.margin-right-x(v-for='(item, index) in platType', :key='index') {{ item.name }}
        el-col(:span='24')
          .item
            .title 地址:
            .value
              p.margin-bottom-x.url-item(v-for='u in url', :key='u.name')
                p.font-size-14.url-n
                  span {{ u.name }}
                .url-m
                  template(v-if='(!u.children || u.children.length === 0) && (u.url || u.appId || u.route)')
                    p(v-if='u.url')
                      span.text-gray-6.font-size-12 地址：
                      | {{ u.url || "暂无" }}
                    p(v-if='u.appId')
                      span.text-gray-6.font-size-12 appId：
                      | {{ u.appId || "暂无" }}
                    p(v-if='u.route')
                      span.text-gray-6.font-size-12 route：
                      | {{ u.route || "暂无" }}
                  template(v-else)
                    p(v-for='o in u.children', :key='u.name')
                      template.padding-bottom-top(v-if='o.url || o.appId || o.route')
                        p.font-size-14.text-primary {{ o.name }}
                        p(v-if='o.url')
                          span.text-gray-6.font-size-12 地址：
                          | {{ o.url || "暂无" }}
                        p(v-if='o.appId')
                          span.text-gray-6.font-size-12 appId：
                          | {{ o.appId || "暂无" }}
                        p(v-if='o.route')
                          span.text-gray-6.font-size-12 route：
                          | {{ o.route || "暂无" }}

        el-col(:span='24')
          .item
            .title 自助终端认证方式:
            .value {{ authMethods }}
              //- span(v-if='info.authMethods', v-for='(i, key) in info.authMethods.split(',')', :key='i.key') {{ i }}
              //- span(v-else) 暂无
        el-col(:span='24')
          .item
            .title 秘钥(secretKey):
            .value {{ info.secretKey }}
        el-col(:span='24')
          .item
            .title 接口地址:
            .value {{ info.webApi || "暂无" }}
        el-col(:span='12')
          .item
            .title 自定义应用:
            .value {{ info.flagIsSelfApp === "1" ? "是" : "否" }}
        el-col(:span='12')
          .item
            .title 应用类型:
            .value {{ appType.name || "暂无" }}
        el-col(:span='12')
          .item
            .title 用户类型:
            .value {{ userType(info.userType) || "暂无" }}
        el-col(:span='12')
          .item
            .title 显示app头:
            .value {{ info.showTitle === 1 ? "是" : "否" }}
        el-col(:span='12')
          .item
            .title 设置广告:
            .value {{ info.flagIsAdSupport === "1" ? "是" : "否" }}
        el-col(:span='12')
          .item
            .title 在界面展示:
            .value {{ info.flagIsShow === "1" ? "是" : "否" }}
        el-col(:span='12')
          .item
            .title web端内嵌跳转:
            .value {{ info.flagIsEmbeddedRedirect === "1" ? "是" : "否" }}
        el-col(:span='12')
          .item
            .title 需要登录:
            .value {{ info.flagIsLoginRequired === "1" ? "是" : "否" }}
        el-col(:span='12')
          .item
            .title 是否限制一卡通服务时间:
            .value {{ info.flagIsLimitYktTime === "1" ? "是" : "否" }}
        el-col(:span='24')
          .item
            .title 是否有认证内容:
            .value {{ info.flagIsAuthContent === "1" ? "是" : "否" }}
              span.text-gray-6(style="text-indent:3rem;margin-left:5px;" v-if="info.flagIsAuthContent==='1'")
                span(style="margin-left:5px;") （认证协议代码：
                span(style="font-weight:700;color:#000;") {{info.appCode}}Auth
                el-icon.icon-close.text-primary(:size="16" style="transform:translate(4px,3px);margin-right:4px;cursor:pointer", @click.stop="copyclip(info.appCode + 'Auth')")
                  CopyDocument
                | ，*复制协议代码，根据该代码在"内容管理"->"协议"->"协议管理"中添加维护该协议）
        el-col(:span='24')
          .item
            .title 是否有帮助内容:
            .value {{ info.flagIsHelpContent === "1" ? "是" : "否" }}
              span.text-gray-6(style="text-indent:3rem;margin-left:5px;" v-if="info.flagIsHelpContent==='1'")
                span(style="margin-left:5px;") （认证协议代码：
                span(style="font-weight:700;color:#000;") {{info.appCode}}Help
                el-icon.icon-close.text-primary(:size="16" style="transform:translate(4px,3px);margin-right:4px;cursor:pointer", @click.stop="copyclip(info.appCode + 'Help')")
                  CopyDocument
                | ，*复制协议代码，根据该代码在"内容管理"->"协议"->"协议管理"中添加维护该协议）
  .inner-b
    .title-line 组件设置
    .blcok-c
      .item.item-component(v-if='infoComponentArr?.length > 0', v-for='(item, key) in infoComponentArr', :key='key')
        .name.text-center.text-gray-7 {{ item.name }}
        .img
          //- img(:src='item.icon')
          el-image(style='width: 130px; height: 130px', :src='item.icon', fit='contain')
      p.text-gray-6.text-center(v-else, style='padding: 10px 0') 暂未设置
  .inner-b
    .title-line 权限设置
    .blcok-c
      el-form.limit-form(label-width='100px')
        set-limit(:appBh='info.bh', :showResult='true')
  .inner-b(v-if='info?.flagIsSelfApp === "0" && JSON.parse(info?.installConfig || "[]")?.length > 0')
    .title-line 安装配置
    .blcok-c
      formCreateByJson(:formDataArr='JSON.parse(info?.installConfig)',  :backfillingPayData="installConfigDetail" ref='formCreateByJson', :disabled='true')
</template>
<script lang="ts" setup>
import { reactive, toRefs, defineProps, ref } from 'vue'
import { Aim } from '@element-plus/icons-vue'
import { userType } from '@/assets/scripts/state'
import FormCreateByJson from '@/components/formCreateByJson/index.vue'
import { App, Module } from '@/service/platform'
import setLimit from './setLimit.vue'
import { useStore } from 'vuex'
import { key } from '@/store/index'
import { CopyDocument } from '@element-plus/icons-vue'
import { copyclip } from '@/assets/scripts/utils'
const defaultAppIcon = new URL('../../../assets/images/example.svg', import.meta.url).href
const props = defineProps(['info', 'componentList', 'typeList'])
let info: any = ref(props.info)
console.log('info--------------', info.value)
const store: any = useStore(key)
const { state } = store
const authenticationList = state.frontConfig.authentication ? JSON.parse(state.frontConfig.authentication) : []
let authMethods = ''
if (info.value.authMethods) {
  authMethods = authenticationList
    .filter((o: any) => {
      return info.value.authMethods.includes(o.id)
    })
    .map((o: any) => {
      return o.name
    })
    .join('，')
}
const platTypeLevel = store.state.platTypeLevel
const platType = platTypeLevel.filter((o: any) => {
  return info.value.platType.includes(o.code)
})
// 组件;
let component: any = ref(props.componentList)
let infoComponent = info.value.component ? info.value.component.split(',') : []
infoComponent = infoComponent.map((o:any) => {return Number(o)})
const infoComponentArr: any = ref([])
const getComponent = async () => {
  if (!props.componentList) {
    const res = await Module.getZcomList({ comType: 1 })
    component.value = res.data
  }
  infoComponentArr.value = component.value.filter((o: any) => {
    return infoComponent.includes(o.bh)
  })
}
getComponent()
// url
const url = ref([])
url.value = info.value.url ? JSON.parse(info.value.url) : []
// 应用类型
let typeList: any = ref(props.typeList)
const appType = ref({})
async function getTypeList() {
  if (!props.typeList) {
    const res = await App.getZappTListAll()
    if (res && res.data) {
      typeList.value = res.data
    }
  }
  appType.value =
    typeList.value.find((item: any) => {
      return item.bh.toString() === info.value.appType.toString()
    }) || {}
  console.log('info.value.appType', typeList.value, appType.value)
}
if (info.value.appType) {
  getTypeList()
}
// 安装配置
const installConfigDetail = ref()
const installConfigForm = info.value?.installConfigForm ? JSON.parse(info.value?.installConfigForm) : {}
installConfigDetail.value = installConfigForm.data
</script>
<style lang="scss" scoped>
.inner-b {
  .value {
    color: #333;
  }
  .item-component {
    width: 150px;
    float: left;
    margin-right: 20px;
    .img {
      width: 130px;
      height: 130px;
      margin: 0 auto;
      // img {
      //   height: 100%;
      //   width: auto;
      // }
    }
  }
  .url-item {
    overflow: hidden;
    .url-n {
      float: left;
      width: 80px;
      margin-top:7px;
    }
    .padding-bottom-top {
      margin-bottom: 10px;
    }
    .url-m {
      float: left;
      width: calc(100% - 80px);
      padding: 5px 10px;
      box-sizing: border-box;
      border-radius: 5px;
      background-color: #fff;
      min-height: 34px;
      // .padding-bottom-top:first-child {
      //   padding-top: 0;
      // }
      .padding-bottom-top:last-child {
        margin-bottom: 0;
      }
    }
  }
}
.app-detail-content {
  position: relative;
}
.app-info-base {
  padding-left: 70px;
  .img {
    position: absolute;
    left: 0;
    width: 50px;
    height: auto;
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
.img-item {
  width: 100px;
  display: inline-block;
  text-align: left;
}
</style>
