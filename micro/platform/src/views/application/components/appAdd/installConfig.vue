<template lang="pug">
.content-purviewSetting.content-bg
  el-form.form(ref='form', label-width='100px', :rules='rules')
    .margin-bottom-2x
      .margin-top-x.margin-bottom-x.appConfig-tip 您当前共选择了
        span.text-primary.num {{ applist.length }}
        | 个应用
        span(v-if='applistInstallList.length > 0') ，其中有
          span.text-primary.num {{ applistInstallList.length }}
          | 个应用需要填写安装配置
        | 。
    template(#title)
      h3.font-size-16.title-line 安装配置
        span.font-size-14.font-size-14.text-warning.text-weight-normal （*非必填项，若不设置该项，应用内部的部分功能将无法正常使用，可添加应用成功后，在应用详情中再次编辑。）
    .install-config
      h3.font-size-16 安装配置
        span.text-gray-6.font-size-12.tip.text-danger （*以下应用需填写安装配置才可正常使用，请谨慎填写。）
      el-tabs.install-applist.text-center(v-model='currentInstallApp', @tab-click='handleClick')
        el-tab-pane(v-for='(appInstallItem, j) in applistInstallList', :key='j', :name='appInstallItem.appCode')
          //- div qqq---{{ appInstallItem.appCode }}
          .install-config-form.bg-content.text-left
            formCreateByJson(:formDataArr='appInstallItem.extraConfig.installConfig', :ref='"formCreateByJson" + appInstallItem.appCode')
          template(#label)
            p.text-center.tit(@click.stop='editInfo(appInstallItem)')
              span {{ appInstallItem.appName }}
              Edit.text-primary(style='width: 1rem; height: 1rem; transform: translate(2px, -2px)')
            //- img(:src='appInstallItem.masterImg')
  el-Dialog(v-model='editDialog', :width='800', title='自定义基本信息', custom-class='size-large-Dialog')
    CreateCustomApp.editAppform(v-if='editDialog', :info='currentEdit', :editClouldApp='true', ref='editAppInfoRef')
    template(#footer='')
      span.dialog-footer
        el-button(@click='editDialog = false') 取 消
        el-button(type='primary', @click='editConfirmLimit') 确 定
</template>
<script lang="ts" setup>
import { defineComponent, reactive, toRefs, ref, computed, watch, inject, getCurrentInstance, defineProps } from 'vue'
import { Cloud } from '@/service/cloud'
import { Role } from '@/service/manage'
// import formCreate from '@form-create/element-ui'
import { useStore } from 'vuex'
import { key } from '@/store'
import { App, Module, Group } from '@/service/platform'
import SelectedBaseApp from '../selectImg.vue'
// import SubDialog from '@/components/subDialog.vue'
import FormCreateByJson from '@/components/formCreateByJson/index.vue'
import setLimit from '../setLimit.vue'
import type { ElForm } from 'element-plus'
import { getFileFromOnlineImg } from '@/assets/scripts/file'
// import { msgbox, IMsgBoxOptions } from '@/hooks/subMessageBox'
import { Edit } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import CreateCustomApp from '../appAdd/createCustomApp.vue'

interface ILimit {
  type: string
  sno: []
  group: string | number
}

type FormInstance = InstanceType<typeof ElForm>
const store = useStore(key)
const { state } = store
const props = defineProps(['typeValue'])
const typeValue = ref(props.typeValue)
const instance: any = getCurrentInstance()
// 应用
const applist = computed(() => state.addApplist)
// 编辑应用名称
const editAppInfoRef = ref()
const editDialog = ref(false)
const currentEdit = ref()
const editInfo = (item: any) => {
  currentEdit.value = item
  editDialog.value = true
}
const editConfirmLimit = () => {
  console.log('editAppInfoRef.value', editAppInfoRef.value)
  editAppInfoRef.value.submit().then((res: any) => {
    if (res.valid) {
      const index = applist.value.findIndex((o: any) => {
        return o.appCode === currentEdit.value.appCode
      })
      applist.value[index].appName = res.data.appName
      applist.value[index].platType = res.data.platType
      applist.value[index].extraConfig.img = res.data.img
      const masterImgObj = applist.value[index].extraConfig.img.find((o: any) => {
        return o.src !== ''
      })
      applist.value[index].masterImg = masterImgObj ? masterImgObj.src : ''
      editDialog.value = false
      console.log('res', currentInstallApp.value, applist.value, index, res, res.data.appName)
    } else {
      {
        ElMessage({

          message: '请填写完整',
          type: 'error'
        })
      }
    }
  })
}
const handleClick = (val: any) => {
  console.log("val------", currentInstallApp.value);
  // // currentInstallApp.value = applistInstallList.value[0].appCode;
  // // console.log("currentInstallApp.value , ", currentInstallApp.value);
  currentApp.value = applistInstallList.value.find((o: any) => {
    return o.appCode === currentInstallApp.value
  })
  // currentApp.value = applistInstallList.value[0];
}
// 安装配置
const applistInstallList: any = ref([])
const currentInstallApp = ref('')
const currentApp = ref(null)
applistInstallList.value = applist.value.filter((item: any) => {
  if (item.extraConfig && item.extraConfig.installConfig) {
    return item.extraConfig.installConfig.length > 0
  }
})
const applistInstallListLength = applistInstallList.value.length
currentInstallApp.value = applistInstallList.value[0].appCode
console.log('currentInstallApp.value , ', currentInstallApp.value)
currentApp.value = applistInstallList.value[0]
// form rules
const rules = {
  require: [
    {
      required: true,
      message: 'Please input Activity name',
      trigger: 'blur'
    }
  ]
}
const submit = async (callback: any) => {
  console.log('submit--applist.value', applist.value)
  let resValid = true
  for (let i = 0; i < applist.value.length; i++) {
    console.log(55555)
    const element = applist.value[i]
    if (element.extraConfig && element.extraConfig.installConfig && element.extraConfig.installConfig.length > 0) {
      let node: any = instance.refs['formCreateByJson' + element.appCode]
      const data = await node[0].submitForm()
      element.extraConfig.installConfig = data.installConfigOriginal
      element.extraConfig.installConfigSubmit = data.installConfigSubmit
      if (!data.validateRes) {
        currentInstallApp.value = element.appCode
        resValid = false
      }
    }
  }
  store.dispatch('AddApplistAction', applist.value)
  const obj = {
    applist: applist.value,
    valid: resValid
  }
  callback ? callback(obj) : null
}
defineExpose({
  submit
})
</script>
<style lang="scss" scoped>
.content-purviewSetting {
  width: 80%;
  margin: 0 auto;
  .limit-bg-white .bg-white-form {
    background-color: #fff;
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
  .install-applist {
    .tit {
      span {
        display: inline-block;
        max-width: 100px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        height: 20px;
        line-height: 20px;
      }
    }
  }
  .install-config-form {
    min-height: 300px;
    background-color: var(--el-fill-color-light);
    .cascader-one {
      padding-left: 100px;
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
  // .el-tabs__item {
  //   height: 100px;
  // }
  // .el-tabs__header {
  //   margin-bottom: 0;
  // }
  // .el-tabs__item.is-active {
  //   border-radius: 10px 10px 0 0;
  //   color: var(--main-primary);
  //   background-color: whitesmoke;
  //   img {
  //     transform: scale(1.3);
  //   }
  // }
  // .el-tabs--top .el-tabs__item.is-top:nth-child(2) {
  //   padding-left: 20px;
  // }
  // .el-tabs--top .el-tabs__item.is-top:last-child {
  //   padding-right: 20px;
  // }
  // .el-tabs__nav-wrap::after,
  // .el-tabs__active-bar {
  //   display: none;
  // }
  // .title-line {
  //   position: relative;
  //   padding-left: 10px;
  //   &:before {
  //     content: "";
  //     display: block;
  //     width: 3px;
  //     height: 16px;
  //     border-radius: 2px;
  //     background-color: var(--main-primary);
  //     position: absolute;
  //     top: 50%;
  //     left: 0;
  //     transform: translateY(-50%);
  //   }
  // }
}
.divider-limit {
  margin-top: 0;
}
</style>
