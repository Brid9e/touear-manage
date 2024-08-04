<!--
 * @Author: 王栋桥
 * @Date: 2021-08-12 09:33:18
 * @LastEditTime: 2022-06-17 11:58:50
 * @LastEditors: error: git config user.name && git config user.email & please set dead value or install git
 * @Description: In User Settings Edit
 * @FilePath: /management/src/components/theme/index.vue
-->
<template lang="pug">
#Theme
  el-tabs.child-tab(v-model="activeLocal" @tab-click="getLocalType" type="card")
    el-tab-pane(v-for="item in initPlatType(state.platTypeList)" :label="item.name" :name="item.code" :key="item.code")
      local(:ref="selfLocalRefs" :type="item.code")
    //- el-tab-pane(label="主题商店" name="third")
    //-   theme-store(ref="paneStore" :type="type")
  el-tooltip(v-if="state.funcButton?.themeInstall" class="item" effect="dark" content="安装主题" placement="top-start")
    .install-theme-button(@click="openInstallWindow")
      el-icon
        Plus
  el-dialog(v-model="showDialog" :width="1000" title="安装主题" @closed="closed" :before-close="onBeforeClose" @close="close")
    el-tabs(v-model="activeNameTheme" @tab-click="getThemeInstallType" type="card")
      el-tab-pane(label="本地上传" name="themeFirst" )
        el-form(:model="form" ref="ruleFormRef" :rules="rules")
          el-form-item(label="终端类型" prop="themePlatType")
            el-select(v-model="form.themePlatType" clearable)
              el-option(v-for="item in initPlatType(state.platTypeList)" :key="item.code" :label="item.name" :value="item.code")
          el-form-item(label="上传主题" prop="fileList")
            el-card.upload-card(shadow="never")
              el-icon
                Upload
              span.upload-font 点击或将主题文件拖拽至此，压缩包必须为zip格式
              themeUploading(ref="themeUploadingRef" :type='form.themePlatType' @fileList="getFileStatus" @closeDialog="closeDialog"  @updateThemeScheduleList="updateThemeScheduleList" @handleSuccess="handleSuccess" @handleError="handleError")
      el-tab-pane(label="主题商店" name="themeSecond" )
        themeStore(ref="paneStore" :type="type" @updateThemeScheduleList="updateThemeScheduleList" :funList="{ initPlatType: initPlatType }" :show="showDialog")
    template(#footer v-if="activeNameTheme == 'themeFirst'")
      el-button(@click="onBeforeClose(()=>{});closed()") 取消
      el-button(type="primary" @click="upload(ruleFormRef)" :loading="uploadLoading") 上传
    //- .install-choose
    //-   .upload
    //-     span 本地上传
    //-   .theme-store
    //-     span 主题商店
</template>

<script lang="ts">
import { key } from '@/store'
import { defineComponent, ref, onMounted, reactive } from 'vue'
import { useStore } from 'vuex'
import local from './themeComponents/local.vue'
import themeStore from './themeComponents/themeStore.vue'
import themeUploading from './themeComponents/themeUploading.vue'
import { Plus, Upload } from '@element-plus/icons-vue'
import AddSubmenu from '../menu/addSubmenu.vue'
import { listenerSyncItem } from '@/assets/scripts/addSyncItem'

export default defineComponent({
  components: {
    local,
    themeStore,
    themeUploading,
    Plus,
    Upload
  },

  setup() {
    const store = useStore(key)
    const { state } = store

    const uploadLoading = ref(false)
    const itemRefs: any = ref([])
    const selfLocalRefs: any = (el: any) => {
      if (el) {
        itemRefs.value.push(el)
      }
    }
    const paneStore: any = ref(null)
    const activeName: any = ref('first')
    const activeNameTheme: any = ref('themeFirst')
    const ruleFormRef: any = ref()
    const showDialog: any = ref(false)
    const themeUploadingRef: any = ref()
    const rules: any = reactive({
      themePlatType: [
        {
          message: '请选择终端类型',
          trigger: 'change',
          required: true
        }
      ],
      fileList: [
        {
          message: '请先上传主题文件',
          trigger: 'change',
          required: true
        }
      ]
    })
    interface Form {
      themePlatType: string | unknown
      fileList: boolean | unknown
    }
    let form: Form = reactive({
      themePlatType: null,
      fileList: null
    })

    const getFileStatus = (val: boolean) => {
      form.fileList = val
    }
    const getLocalType = async (tab: any) => {
      console.log(tab.paneName)
      type.value = tab.paneName
    }

    const getThemeInstallType = (tab: any) => {
      //
      switch (tab.props.label) {
        case '本地上传':
          break
        case '主题商店':
          if (store.state.themeLoading.store === false) paneStore.value.getPcTheme()
          break
      }
    }

    const closeDialog = (boolean: boolean) => {
      uploadLoading.value = false
      showDialog.value = boolean
      form.themePlatType = null
    }

    const close = () => themeUploadingRef?.value.clearFiles()

    const closed = () => {
      ruleFormRef.value?.resetFields()
      store.state.themeLoading.store = false
      showDialog.value = false
      activeNameTheme.value = 'themeFirst'
    }

    const onBeforeClose = (done: any) => {
      themeUploadingRef?.value.clearFiles('success')
      done()
    }

    const openInstallWindow = () => {
      showDialog.value = true
    }

    const upload = async (ruleForm: any) => {
      if (!ruleForm) {
        return
      }
      await ruleForm.validate((valid: any, fields: any) => {
        if (valid) {
          uploadLoading.value = true
          themeUploadingRef.value.receiveLocalTheme()
        } else {
          console.log('error submit!', fields)
        }
      })
      //
    }
    const updateThemeScheduleList = (val: any) => {
      activeLocal.value = val.type
      itemRefs.value.find((r: any) => r.type === val.type).getThemes(val.type)
    }

    const initPlatType = (platTypeList: any) => {
      let arr: any = []
      for (let val of platTypeList) {
        if (val.children?.length > 0) arr = [...arr, ...val.children]
        else arr = [...arr, val]
      }
      // const arr = platTypeList.filter((r: any) => r.children?.length > 0)
      return arr
    }

    const handleSuccess = () => {
      uploadLoading.value = false
    }
    const handleError = () => {
      uploadLoading.value = false
    }

    const type: any = ref(initPlatType(state.platTypeList)[0].code)
    const localType = ref(initPlatType(state.platTypeList)[0].code)
    const activeLocal: any = ref(initPlatType(state.platTypeList)[0].code)

    onMounted(() => {
      listenerSyncItem((data: any) => {
        if (data.type === 'syncOver') {
          if (data.success) {
            if (data?.extra?.store) {
              paneStore.value.update(data?.extra)
            } else {
              itemRefs.value.find((r: any) => r.type === data?.extra?.type).getThemes(data?.extra?.type)
            }
          }
        }
      })
    })
    return {
      state,
      paneStore,
      type,
      activeName,
      activeLocal,
      getLocalType,
      initPlatType,
      selfLocalRefs,
      localType,
      openInstallWindow,
      showDialog,
      getThemeInstallType,
      activeNameTheme,
      form,
      close,
      closed,
      upload,
      rules,
      ruleFormRef,
      closeDialog,
      getFileStatus,
      themeUploadingRef,
      updateThemeScheduleList,
      uploadLoading,
      handleSuccess,
      handleError,
      onBeforeClose
    }
  }
})
</script>
<style lang="scss">
#Theme {

  // height: 100%;
  .child-tab {
    .el-tabs__header {
      margin-bottom: 0;
    }
  }

  .child-tab {
    .el-tabs__nav-wrap {

      // margin-bottom: 10px !important;
      &::after {
        content: '';
        background-color: transparent;
        z-index: var(--el-index-normal);
      }
    }

    .el-tabs__header {
      // border: 1px solid var(--el-border-color-light);
      // border-top: transparent;
      // border-radius: 0 0 4px 4px;
    }
  }

  .el-tabs__item {
    padding: 0 20px;
  }


  .el-card.upload-card {
    width: 100%;

    .el-card__body {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100px !important;
      flex-direction: column;
    }
  }

  .install-theme-button {
    width: 70px;
    height: 70px;
    border-radius: 50%;
    background-color: var(--main-primary);
    position: absolute;
    bottom: 50px;
    right: 30px;
    box-shadow: 0 8px 12px rgba(0, 0, 0, 0.233);
    color: white;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 36px;
    cursor: pointer;
    transition: all 0.3s ease;

    &:active {
      transform: scale(0.95);
      filter: brightness(0.875) !important;
    }

    &:hover {
      filter: brightness(1.125);
    }
  }

  .install-choose {
    display: flex;
    justify-content: center;
    width: 100%;
    height: 200px;

    .upload {
      width: 300px;
      border: 1px solid black;
      border-right: none;
    }

    .theme-store {
      width: 300px;
      border: 1px solid black;
    }
  }
}
</style>
