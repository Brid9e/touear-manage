<template lang="pug">
.content-purviewSetting.content-bg
  h3.font-size-16.title-line.margin-top-3x.margin-bottom-3x 设置权限
    span.font-size-14.font-size-14.text-warning.text-weight-normal （*非必填项，若不设置该项，应用对所有人可见。）
  .bg-content(:style="{ 'max-height': mainHeight + 'px' }")
    el-form.form(ref="form", label-width="100px", :rules="rules")
      div(v-if="applist.length > 1", style="padding-left: 20px")
        div
          .bg-group-item(v-if="applist.length > 0")
            .a-box-item.text-gray-7(v-for="(itemApp, index) in applist", :key="index")
              //- img(:src="itemApp.appIconUrl")
              .limit-app
                el-image.img(:src="itemApp.masterImg")
                  template(#error)
                    el-image(:src="defaultAppIcon")
                p {{ itemApp.appName }}
              .limit-text.text-left
                p.text-gray-6.font-size-14(v-if="!itemApp.limit || (itemApp.limit && itemApp.limit.openLimit)") 权限未设置，默认对所有人可见。
                template(v-else)
                  p.font-size-14 {{ itemApp.limit.type === 'group' ? '可见群组' : '可见人员名单' }}：
                  div
                    el-tag.margin-right-x(v-if="itemApp.limit.type === 'group'", v-for="(sg, index) in itemApp.limit.group", type="success", effect="dark") {{ sg.name }}
                    el-tag.margin-right-x.margin-bottom-x(v-else-if="itemApp.limit.type === 'sno'", v-for="(s, index) in itemApp.limit.sno", :key="index", type="success")
                      span.text-success {{ s.name }}
                      span.text-gray-6 ({{ s.sno }})
              .limit-tool.font-size-14
                span.text-link(@click="toOpenSetGroup(itemApp, index)") 设置
      .limit-bg-white(v-else)
        set-limit(@changeLimit="changeLimitData")
  el-dialog(v-model="showDialogGroup", :width="820", title="设置权限")
    el-form(ref="form", label-width="115px")
      .dialog-set-limit
        set-limit(:value="defaultLimitValue", @changeLimit="changeLimitData")
    template(#footer="")
      span.dialog-footer
        el-button(@click="showDialogGroup = false") 取 消
        el-button(type="primary", @click="confirmLimit") 确 定
</template>
<script lang="ts" setup>
import { ref, computed, getCurrentInstance, defineProps } from "vue";
import { Cloud } from "@/service/cloud";
import { Role } from "@/service/manage";
import { useStore } from "vuex";
import { key } from "@/store";
import { App, Module, Group } from "@/service/platform";
import SelectedBaseApp from "../selectImg.vue";
// import SubDialog from '@/components/subDialog.vue'
import FormCreateByJson from "@/components/formCreateByJson/index.vue";
import setLimit from "../setLimit.vue";
import { getFileFromOnlineImg } from "@/assets/scripts/file";
// import { msgbox, IMsgBoxOptions } from '@/hooks/subMessageBox'
import type { ElForm } from "element-plus";
const defaultAppIcon = new URL('../../../../assets/images/example.svg', import.meta.url).href
type FormInstance = InstanceType<typeof ElForm>;
interface ILimit {
  type: string;
  sno: [];
  group: string | number;
}
const store = useStore(key);
const { state } = store;
const props = defineProps(["typeValue"]);
const typeValue = ref(props.typeValue);
const activeNames = ref("1");
const instance = getCurrentInstance();
// 高度计算
const winHeight = document.documentElement.clientHeight;
const mainHeight = winHeight - 320;
// 应用
const applist = computed(() => state.addApplist);
console.log(111111, "applist---", applist.value);

// 权限
const resetLimitValue = {
  openLimit: true,
  type: "",
  group: [],
  groupValue: [],
  sno: [],
  snoValue: []
};
let limitValue: any = null;
let defaultLimitValue = ref();
const changeLimitData = (val: any) => {
  limitValue = val;
};
// 权限
const showDialogGroup = ref(false);
const isEditLimitDialog = ref(false);
const currentLimitIndex: any = ref(0);
const toOpenSetGroup = (data: any, index: number, isEdit: boolean) => {
  isEditLimitDialog.value = isEdit ? true : false;
  showDialogGroup.value = true;
  currentLimitIndex.value = index;
  // limitValue = applist.value[index].limit || null
  // if (isEdit) {
  // }
  defaultLimitValue.value = applist.value[index].limit || resetLimitValue;
};
const confirmLimit = () => {
  applist.value[currentLimitIndex.value].limit = limitValue;
  showDialogGroup.value = false;
  store.dispatch("AddApplistAction", applist.value);
};
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

  .margin-bottom-0 {
    margin-bottom: 0;
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
    min-height: 70px;
    overflow: hidden;
    width: 100%;
    box-sizing: border-box;
    border-bottom: 1px solid #dcdfe6;
    margin-bottom: 10px;
    position: relative;
    display: flex;
    align-items: center;

    .limit-app {
      background-color: #fff;
      border-radius: 6px 6px 0 0;
      // border: 1px solid #dcdfe6;
      border-bottom: 0;
      height: 71px;
      width: 80px;
      padding-top: 8px;

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
      line-height: 70px;
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
</style>
