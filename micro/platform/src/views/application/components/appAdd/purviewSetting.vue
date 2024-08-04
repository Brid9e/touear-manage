<template lang="pug">
.content-purviewSetting.content-bg
  el-form.form(ref="form", label-width="100px", :rules="rules")
    .margin-bottom-2x
      .margin-top-x.margin-bottom-x.appConfig-tip(v-if="typeValue === 'base'") 您当前共选择了
        span.text-primary.num {{ applist.length }}
        | 个应用
        span(v-if="applistInstallList.length > 0") ，其中有
          span.text-primary.num {{ applistInstallList.length }}
          | 个应用需要填写安装配置
        | 。
      el-collapse(v-model="activeNames")
        el-collapse-item(name="1")
          template(#title)
            h3.font-size-16.title-line 设置位置
              span.font-size-14.font-size-14.text-warning.text-weight-normal （*非必填项，若不设置该项，应用将绑定所有应用类型组件。）
          .bg-content
            div(v-if="applist.length > 1")
              el-form-item.border-bottom(label="应用位置：", prop="name")
                .form-item-right
                  p.font-size-14.font-size-12.text-right.text-gray-6 （*左右滑动可展示更多组件）
                  el-scrollbar
                    el-checkbox-group(v-model="componentValue")
                      .scrollbar-flex-content
                        .scrollbar-demo-item(v-for="(item, i) in componentList", :key="i")
                          .title {{ item.name }}
                          el-checkbox.checkbox-custom-style(:label="item.comCode", border="", @change="changeComponent(item)")
                            .info(:style="{ color: 'red', 'background-image': 'url(' + item.icon + ')' }")
                          p.text-right.tool
                            span.float-left(v-if="item.appValue.length > 0") 已添加{{ item.appValue.length }}个
                            span.text-link(@click="toOpenSetApp(item)") {{ item.appValue.length > 0 ? '查看' : '分配应用' }}
            div(v-else)
              el-form-item.border-bottom(label="应用位置：", prop="name")
                .form-item-right
                  .text-right.font-size-12.text-gray-6 （*左右滑动可展示更多组件）
                  el-scrollbar
                    el-checkbox-group(v-model="componentValue")
                      .scrollbar-flex-content
                        .scrollbar-demo-item(v-for="(item, i) in componentList", :key="i")
                          .title {{ item.name }}
                          el-checkbox.checkbox-custom-style(:label="item.comCode", border="", @change="changeComponent(item)")
                            .info(:style="{ color: 'red', 'background-image': 'url(' + item.icon + ')' }")
        el-collapse-item(name="2")
          template(#title)
            h3.font-size-16.title-line 设置权限
              span.font-size-14.font-size-14.text-warning.text-weight-normal （*非必填项，若不设置该项，应用对所有人可见。）
          .bg-content
            div(v-if="applist.length > 1", style="padding-left: 20px")
              //- el-form-item.margin-bottom-0(label='', prop='info')
              div
                span.text-link(@click="toOpenSetGroup") 选择应用并设置权限
              div
                .bg-group-item(v-if="limitResultList.length > 0")
                  .a-box-item.text-gray-7(v-for="(itemApp, index) in limitResultList", :key="index")
                    //- img(:src="itemApp.appIconUrl")
                    .limit-app.float-left
                      el-image.img(:src="itemApp.masterImg")
                        template(#error)
                          el-image(:src="require('@/assets/images/example.svg')")
                      p {{ itemApp.appName }}
                    .limit-text.float-left.text-left
                      p 已选{{ itemApp.limit.type === 'group' ? '群组' : '人员名单' }}：
                      div
                        el-tag.margin-right-x(v-if="itemApp.limit.type === 'group'", v-for="(sg, index) in itemApp.limit.group", type="success", effect="dark") {{ sg.name }}
                        el-tag.margin-right-x.margin-bottom-x(v-else-if="itemApp.limit.type === 'sno'", v-for="(s, index) in itemApp.limit.sno", :key="index", type="success")
                          span.text-success {{ s.name }}
                          span.text-gray-6 ({{ s.sno }})
                    .limit-tool.float-left
                      span.text-link.margin-right-x.text-danger(@click="deleteGroupItem(itemApp)") 删除
                      span.text-link(@click="toOpenSetGroup(itemApp, true)") 编辑
            .limit-bg-white(v-else)
              set-limit(@changeLimit="changeLimitData")
        el-collapse-item(name="3", v-if="typeValue === 'base' && applistInstallList.length > 0")
          template(#title)
            h3.font-size-16.title-line 安装配置
              span.font-size-14.font-size-14.text-warning.text-weight-normal （*非必填项，若不设置该项，应用内部的部分功能将无法正常使用，可添加应用成功后，在应用详情中再次编辑。）
          .install-config
            //- h3.font-size-16 安装配置
            //-   span.text-gray-6.font-size-12.tip.text-danger  （*以下应用需填写安装配置才可正常使用，请谨慎填写。）
            el-tabs.install-applist.text-center.demo-tabs(v-model="currentInstallApp", @tab-click="handleClick")
              el-tab-pane(v-for="(appInstallItem, j) in applistInstallList", :key="j", :name="appInstallItem.appCode")
                .install-config-form.bg-content.text-left
                  formCreateByJson(:formDataArr="appInstallItem.extraConfig.installConfig", :ref="'formCreateByJson' + appInstallItem.appCode")
                template(#label)
                  p.text-center.tit {{ appInstallItem.appName }}
                  //- img(:src="appInstallItem.masterImg")
                  img(:src="appInstallItem.masterImg")
  sub-dialog(v-model="showDialogSetApp", :width="820", title="分配应用", @closed="closedCompentDialog")
    .app-checkbox-content(style="width: 100%")
      .tip-check-all
        el-checkbox(v-model="checkAllApp", @change="handleCheckAllApp") {{ checkAllApp ? '取消全选' : '选择全部' }}
      //- el-scrollbar
        .scrollbar-flex-content
      el-checkbox-group(v-model="appValue", @change="changeApp")
        .scrollbar-demo-item(v-for="(item, i) in applist", :key="i")
          el-checkbox.checkbox-custom-style(:label="item.appCode", border="")
            el-image.img(:src="item.masterImg")
              template(#error)
                el-image(:src="require('@/assets/images/example.svg')")
            .title {{ item.appName }}
    template(#footer="")
      span.dialog-footer
        el-button(@click="showDialogSetApp = false") 取 消
        el-button(type="primary", @click="confirmSetApp") 确 定
  sub-dialog(v-model="showDialogGroup", :width="820", title="设置权限")
    el-form(ref="form", label-width="115px")
      el-form-item.app-checkbox-content-form.limit-checkbox-content-form(:label="!isEditLimitDialog ? '请选择应用:' : '当前应用:'", prop="require")
        .app-checkbox-content(v-if="!isEditLimitDialog", style="width: 100%")
          //- el-scrollbar
            .scrollbar-flex-content
          el-checkbox-group(v-model="appValue", @change="changeApp")
            .scrollbar-demo-item(v-for="(item, i) in appLimitArr", :key="i")
              .title {{ item.appName }}
              el-checkbox.checkbox-custom-style(:label="item.appCode", border="", :disabled="item.limit ? true : false")
                el-image.img(:src="item.masterImg")
                  template(#error)
                    el-image(:src="require('@/assets/images/example.svg')")
              p.font-size-14.status.text-success.app-l-s(style="height: 20px")
                span(v-if="item.limit") 已设置
          .tip-check-all
            el-checkbox(v-model="checkAllApp", @change="handleCheckAllApp") {{ checkAllApp ? '取消全选' : '选择全部' }}
        div(v-else, style="padding-bottom: 10px")
          el-image.img(:src="currentLimitApp.masterImg")
            template(#error)
              el-image(:src="require('@/assets/images/example.svg')")
          p(style="line-height: 14px") {{ currentLimitApp.appName }}
      el-divider.divider-limit
      .dialog-set-limit
        set-limit(:value="defaultLimitValue", @changeLimit="changeLimitData")
    template(#footer="")
      span.dialog-footer
        el-button(@click="showDialogGroup = false") 取 消
        el-button(type="primary", @click="confirmLimit", :disabled="disabledLimitDialog") 确 定
</template>
<script lang="ts" setup>
import { defineComponent, reactive, toRefs, ref, computed, watch, inject, getCurrentInstance, defineProps } from "vue";
import { Cloud } from "@/service/cloud";
import { Role } from "@/service/manage";
// import formCreate from '@form-create/element-ui'
import { useStore } from "vuex";
import { key } from "@/store";
import { App, Module, Group } from "@/service/platform";
import SelectedBaseApp from "../selectImg.vue";
import SubDialog from "@/components/subDialog.vue";
import FormCreateByJson from "@/components/formCreateByJson/index.vue";
import setLimit from "../setLimit.vue";
import type { ElForm } from "element-plus";
import { getFileFromOnlineImg } from "@/assets/scripts/file";
import { msgbox, IMsgBoxOptions } from "@/hooks/subMessageBox";
type FormInstance = InstanceType<typeof ElForm>;
const store = useStore(key);
const { state } = store;
const props = defineProps(["typeValue"]);
const typeValue = ref(props.typeValue);
const activeNames = ref("1");
const instance: any = getCurrentInstance();
// 应用
const applist = computed(() => state.addApplist);
// 权限
const resetLimitValue = {
  openLimit: true,
  type: "",
  group: [],
  groupValue: [],
  sno: [],
  snoValue: []
};
interface ILimit {
  type: string;
  sno: [];
  group: string | number;
}
let limitValue = ref(resetLimitValue);
let defaultLimitValue = ref();
const changeLimitData = (val: any) => {
  limitValue.value = val;
  if (applist.value.length === 1) {
    applist.value[0].limit = limitValue.value;
    console.log("limitValue", limitValue.value);
  }
};
// 权限--多应用弹框
const limitResultList: any = ref([]);
// const limitResultListValid = ref([])
const showDialogGroup = ref(false);
const isEditLimitDialog = ref(false);
const currentLimitApp: any = ref({});
const toOpenSetGroup = (data: any, isEdit: boolean) => {
  isEditLimitDialog.value = isEdit ? true : false;
  showDialogGroup.value = true;
  currentLimitApp.value = data || {};
  appValue.value = [];
  if (!isEdit) {
    limitValue.value = resetLimitValue;
  } else {
    limitValue.value = data.limit;
    defaultLimitValue.value = data.limit;
  }
};
const appLimitArr = ref(applist.value); // 可选的
const confirmLimit = () => {
  if (!isEditLimitDialog.value) {
    applist.value.forEach((item: any) => {
      if (appValue.value.indexOf(item.appCode) > -1) {
        item.limit = limitValue.value;
        limitResultList.value.push(item);
      }
    });
  } else {
    currentLimitApp.value.limit = limitValue.value;
    limitResultList.value.forEach((element: any) => {
      if (element.appCode === currentLimitApp.value.appCode) {
        element.limit = limitValue.value;
      }
    });
  }
  showDialogGroup.value = false;
  console.log("applist.value----close", applist.value);
};
const deleteGroupItem = (data: any) => {
  const opt: IMsgBoxOptions = {
    title: "提示",
    type: "warning",
    message: "确定删除？",
    showCancelButton: true
  };
  msgbox.open(opt).then((r: any) => {
    if (r === "confirm") {
      limitResultList.value.splice(
        limitResultList.value.findIndex((item: any) => item.appCode === data.appCode),
        1
      );
      appLimitArr.value.forEach((item: any) => {
        if (item.appCode === data.appCode) {
          item.limit = "";
        }
      });
    } else {
      console.log("cancel");
    }
  });
};
const disabledLimitDialog = computed(() => {
  let flag = false;
  if (isEditLimitDialog.value) {
    // if (limitValue.value.sno.length === 0 && limitValue.value.group.length === 0) {
    //   flag = true
    // }
    if (limitValue.value.openLimit) {
      flag = true;
    }
  } else {
    // if ((limitValue.value.sno.length === 0 && limitValue.value.groupValue.length === 0) || appValue.value.length === 0) {
    //   flag = true
    // }
    if (limitValue.value.openLimit || appValue.value.length === 0) {
      flag = true;
    }
  }
  return flag;
});
// 组件分配应用弹框
const currentComponentCode: any = ref("");
const currentComponent: any = ref({});
const showDialogSetApp = ref(false);
const toOpenSetApp = (item: any) => {
  appValue.value = item.appValue ? item.appValue : [];
  componentValue.value.push(item.comCode);
  componentValue.value = [...new Set(componentValue.value)];
  showDialogSetApp.value = true;
  currentComponentCode.value = item.comCode;
  currentComponent.value = item;
};
const confirmSetApp = () => {
  componentList.value.forEach((item: any) => {
    if ((item as any).comCode === currentComponentCode.value) {
      (item as any).appValue = JSON.parse(JSON.stringify(appValue.value));
    }
  });
  if (appValue.value.length === 0) {
    const index: any = componentValue.value.indexOf(currentComponentCode.value);
    componentValue.value.splice(index, 1);
  }
  showDialogSetApp.value = false;
};
const closedCompentDialog = () => {
  if (currentComponent.value.appValue.length === 0) {
    const index: any = componentValue.value.indexOf(currentComponentCode.value);
    componentValue.value.splice(index, 1);
  }
};
// 组件
const showDialogComponent = ref(false);
let componentValue: any = ref([]);
if (applist.value.length === 1) {
  componentValue.value = applist.value[0].comCodeList || [];
} else if (applist.value.length > 1) {
  let arr: any = [];
  applist.value.forEach((item: any) => {
    arr = arr.concat(item.comCodeList);
  });
  arr = arr.concat(arr);
  arr = [...new Set(arr)];
  componentValue.value = arr;
}
const checkAllComponent = ref(false);
let componentList = ref([]);
const getComponent = async () => {
  const res = await Module.getZcomList({ comType: 1 });
  res.data.forEach((item: any) => {
    item.appValue = [];
    if (typeValue.value === "base") {
      applist.value.forEach((app: any) => {
        if (app.comCodeList.indexOf(item.comCode) !== -1) {
          item.appValue.push(app.appCode);
        }
      });
    }
  });
  componentList.value = res.data;
};
getComponent();
const changeComponent = (item: any) => {
  if (applist.value.length > 1) {
    toOpenSetApp(item);
  }
};
// 选择应用
let appValue: any = ref([]);
let checkAllApp = ref(false);
const handleCheckAllApp = () => {
  if (checkAllApp.value) {
    appValue.value = applist.value.map((item: any) => {
      return item.appCode;
    });
  } else {
    appValue.value = [];
  }
};
watch(
  () => appValue.value,
  (newData, oldData) => {
    if (newData.length === applist.value.length) {
      checkAllApp.value = true;
    } else {
      checkAllApp.value = false;
    }
  }
);
// 安装配置
const applistInstallList: any = ref([]);
const currentInstallApp = ref("");
if (typeValue.value === "base") {
  applistInstallList.value = applist.value.filter((item: any) => {
    if (item.extraConfig && item.extraConfig.installConfig) {
      return item.extraConfig.installConfig.length > 0;
    }
  });
  currentInstallApp.value = ref(applistInstallList.value.length ? applistInstallList.value[0].appCode : "");
}
// form rules
const rules = {
  require: [
    {
      required: true,
      message: "Please input Activity name",
      trigger: "blur"
    }
  ]
};
const submit = async (callback: any) => {
  console.log("submit--applist.value", applist.value);
  let resValid = true;
  for (let i = 0; i < applist.value.length; i++) {
    console.log("applist.value", i);
    const element = applist.value[i];
    // formCreateByJson
    if (typeValue.value === "base" && element.extraConfig && element.extraConfig.installConfig && element.extraConfig.installConfig.length > 0) {
      let node: any = instance.refs["formCreateByJson" + element.appCode];
      const data = node.submitForm();
      element.extraConfig.installConfigSubmit = data.installConfigSubmit;
      if (!data.validateRes) {
        resValid = false;
      }
    }
    // component
    if (applist.value.length > 1) {
      let arr: any = [];
      componentValue.value.forEach((item: any) => {
        const itemApps = (
          componentList.value.find((o: any) => {
            return o.comCode === item;
          }) as any
        ).appValue;
        const index = itemApps.indexOf(element.appCode);
        if (index > -1) {
          arr.push(item);
          arr = [...new Set(arr)];
        }
      });
      if (arr.length === 0) {
        const comlist = componentList.value.filter((c: any) => {
          if (typeValue.value === "base" && element.appUserType !== "common") {
            return element.platType.indexOf(c.platType) !== -1 && element.appUserType === c.userType;
          } else {
            return element.platType.indexOf(c.platType) !== -1;
          }
        });
        element.component = comlist
          .map((item: any) => {
            return item.comCode;
          })
          .join(",");
      } else {
        element.component = arr.join(",");
      }
    } else if (applist.value.length === 1) {
      if (componentValue.value.length === 0) {
        const comlist = componentList.value.filter((c: any) => {
          if (typeValue.value === "base" && element.appUserType !== "common") {
            return element.platType.indexOf(c.platType) !== -1 && element.appUserType === c.userType;
          } else {
            return element.platType.indexOf(c.platType) !== -1;
          }
        });
        element.component = comlist
          .map((item: any) => {
            return item.comCode;
          })
          .join(",");
      } else {
        element.component = componentValue.value.join(",");
      }
      console.log("element.component", element.component);
    }
    // icon
    if (typeValue.value === "base") {
      for (let j = 0; j < element.extraConfig.img.length; j++) {
        if (element.extraConfig.img[j].src) {
          const r = await getFileFromOnlineImg(element.extraConfig.img[j].src, element.appCode + ".png");
          applist.value[i].extraConfig.img[j].file = r;
        }
      }
    }
  }
  store.dispatch("AddApplistAction", applist.value);
  const obj = {
    applist: applist.value,
    valid: resValid
  };
  callback ? callback(obj) : null;
};
defineExpose({
  submit
});
</script>
<style lang="scss" scoped>
.content-purviewSetting {
  width: 80%;
  margin: 0 auto;
  .limit-bg-white .bg-white-form {
    background-color: #fff;
  }
  .limit-bg-white .filter-person,
  .limit-bg-white .el-table th,
  .limit-bg-white .el-table td {
    background-color: #fff;
  }
  .filter-person {
    background-color: #fff;
    padding: 30px 20px 0 20px;
    border-bottom: 2px dashed rgb(240, 240, 240);
  }
  .appConfig-tip {
    padding: 10px 15px;
    font-size: 14px;
    color: #666;
    background-color: rgba(64, 158, 255, 0.1);
    .num {
      font-size: 20px;
      padding: 0 3px;
    }
  }
  .install-config-form {
    min-height: 300px;
    background-color: var(--el-fill-color-light);
  }
  .tip {
    font-weight: 500;
  }
  .form {
    padding-top: 20px;
  }
  .el-form-item__content {
    width: calc(100% - 100px);
  }
  .bg-content {
    background-color: var(--el-fill-color-light);
    border-radius: 5px;
    padding: 10px;
  }
  .el-collapse-item__header,
  .el-collapse-item__wrap {
    border-bottom: 0;
  }
  .el-collapse-item__content {
    padding-bottom: 0;
  }
  .el-collapse {
    border-bottom: 0;
    border-top: 0;
  }
  .el-collapse-item__arrow {
    border: 1px solid #ccc;
    display: inline-block;
    width: 26px;
    height: 26px;
    border-radius: 100%;
    text-align: center;
    line-height: 26px;
    background-color: var(--el-fill-color-light);
    box-sizing: border-box;
  }
  .el-collapse-item {
    padding-bottom: 15px;
    border-bottom: 2px dashed rgb(243, 243, 243);
    &:last-child {
      border-bottom: 0;
    }
  }
  .margin-bottom-0 {
    margin-bottom: 0;
  }
  .install-applist {
    margin-top: 10px;
    padding-bottom: 0px;
    img {
      width: 50px;
      height: 50px;
    }
  }
  .el-tabs__item {
    height: 100px;
  }
  .el-tabs__header {
    margin-bottom: 0;
  }
  .el-tabs__item.is-active {
    border-radius: 10px 10px 0 0;
    color: var(--main-primary);
    background-color: whitesmoke;
    img {
      transform: scale(1.3);
    }
  }
  .el-tabs--top .el-tabs__item.is-top:nth-child(2) {
    padding-left: 20px;
  }
  .el-tabs--top .el-tabs__item.is-top:last-child {
    padding-right: 20px;
  }
  .el-tabs__nav-wrap::after,
  .el-tabs__active-bar {
    display: none;
  }
  .title-line {
    position: relative;
    padding-left: 10px;
    &:before {
      content: "";
      display: block;
      width: 3px;
      height: 16px;
      border-radius: 2px;
      background-color: var(--main-primary);
      position: absolute;
      top: 50%;
      left: 0;
      transform: translateY(-50%);
    }
  }
}
.divider-limit {
  margin-top: 0;
}
.scrollbar-flex-content {
  display: flex;
}

.scrollbar-demo-item {
  display: inline-block;
  flex-shrink: 0;
  width: 150px;
  height: 180px;
  margin: 10px;
  text-align: center;
  border-radius: 4px;
  // background: pink;
  .title {
    text-align: center;
    font-size: 12px;
    color: #666;
    line-height: 12px;
    margin-bottom: 5px;
  }
  .tool {
    font-size: 12px;
    height: 20px;
    line-height: 20px;
    transform: translateY(-8px);
  }
  .el-checkbox__label {
    padding: 0;
    .info {
      height: 120px;
      background-repeat: no-repeat;
      background-size: contain;
      background-position: center center;
    }
  }
}
.app-checkbox-content-form {
  margin-bottom: 0 !important;
}
.app-checkbox-content {
  position: relative;
  .tip-check-all {
    text-align: right;
    position: absolute;
    right: 0;
    top: -20px;
  }
  .scrollbar-demo-item {
    width: 77px;
    height: 84px;
    .status {
      margin-top: 0;
      line-height: 12px;
      font-size: 12px;
      transform: translateY(-5px);
    }
    .img {
      margin-top: 15px;
      margin-bottom: 8px;
      width: 40px;
      height: 40px;
      background-position: center center;
    }
  }
}
.bg-group-item {
  padding: 8px;
  padding-bottom: 0;
  border-radius: 4px;
  // background-color: rgb(243, 243, 243);
  margin-bottom: 8px;
  line-height: 18px;
  .a-box-item {
    border-radius: 4px;
    text-align: center;
    display: inline-block;
    min-height: 70px;
    overflow: hidden;
    width: 100%;
    border-bottom: 1px solid #dcdfe6;
    margin-bottom: 10px;
    position: relative;
    padding-left: 80px;
    .limit-app {
      position: absolute;
      top: 50%;
      left: 0;
      height: 71px;
      transform: translateY(calc(-50% + 1px));
      width: 80px;
      background-color: #fff;
      padding-top: 8px;
      border-radius: 4px 4px 0 0;
      border: 1px solid #dcdfe6;
      // border-bottom: 0;
      box-sizing: border-box;
      .img {
        width: 40px;
        height: 40px;
        margin-bottom: 3px;
      }
      p {
        font-size: 12px;
        line-height: 16px;
        transform: translateY(-5px);
      }
    }
    .limit-text {
      padding-left: 10px;
      width: calc(100% - 180px);
      padding-top: 5px;
      box-sizing: border-box;
      p {
        margin-bottom: 10px;
      }
    }
    .limit-tool {
      width: 100px;
      .text-danger {
        color: #ed511f;
      }
    }
  }
  .limit-text {
  }
}
.padding-bottom {
  padding-bottom: 15px;
}
.limit-checkbox-content-form .scrollbar-demo-item {
  padding-bottom: 30px;
  .app-l-s {
    position: absolute;
    bottom: 0;
    width: 77px;
  }
}
</style>
