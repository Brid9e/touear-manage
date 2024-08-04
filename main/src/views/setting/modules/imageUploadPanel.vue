<template lang="pug">
.image-upload-panel
  .image-box
    el-image(:src="src" fit="cover", :preview-src-list="[src]")
      template(#error)
        .empty-image 🤔还没有上传过
  .upload-right
    //- el-upload
    el-button(type="primary" text bg @click="onShow") {{type === 'logo'  ? '更新图标' : '更新背景图'}}
    p.prompt {{type === 'logo' ? '图片必须是jpg、jpeg或png格式，且大小不超过 1M，建议尺寸为 250*150。' : '图片必须是jpg、jpeg或png格式，建议尺寸为 1920*1080。'}}
  el-dialog(v-model="showImageDialog" :title="currentPlatItem?.label + (type === 'logo' ? '图标修改' : '登录页背景图修改')" width="30rem" @closed="onClosed" :before-close="onBeforeClose")
    el-upload(ref="uploadFileRef", :file-list="fileList", action="#", drag, :show-file-list="false", :limit="1", :before-upload="onBeforeUpload", :on-change="onChange", :auto-upload="false", accept="image/jpg,image/jpeg,image/png")
      .unupload(v-if="!showUpImage" v-loading="loadingFile")
        el-icon
          Upload
        span.upload-font 点击或将图片文件拖拽至此。
      .upload(v-else)
        el-image(:src="showUpImage" fit="cover")
    template(#footer)
      el-button(@click="onCancel") 取消
      el-button(type="primary" @click="onConfirm" :loading="loadingUpload") 确定
        //- el-image(:src="currentPlatItem?.src")
        //- pre {{ currentPlatItem }}
</template>
<script lang="ts" setup>
import { ref, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { system } from '@/service/manage'
import { Upload } from '@element-plus/icons-vue'
import { useStore } from 'vuex'
import { key } from '@/store'

const props = defineProps({
  src: {
    type: String,
    default: '',
  },
  item: {
    type: Object,
    default: '',
  },
  prompt: {
    type: String,
    default: '',
  },
  type: String,
})

const emits = defineEmits<{ (e: 'upateSuccess', src: any): void }>()

const store = useStore(key)
const { state } = store
const logoImage: any = ref()
const showImageDialog = ref(false)
const uploadFileRef = ref()
const fileList = ref()
const showUpImage = ref()
const readyUpImage: any = ref()
const loadingFile = ref(false)
const loadingUpload = ref(false)
const currentPlatItem: any = computed(() => {
  return {
    ...props.item,
    src: props.src,
  }
})

// 上传图标
const logoSubmit = async (path: string, fileName: string, msgBox: string) => {
  loadingUpload.value = true
  const formData = new FormData()
  formData.append('bucketName', 'public')
  formData.append('file', readyUpImage.value)
  formData.append('path', `/${path}/${fileName}`)
  formData.append('tenantId', state.userInfo?.tenantId)
  const {
    data: res,
    msg,
    code,
  }: any = await system.uploadFileByPath(formData, msgBox).catch(() => {
    loadingUpload.value = false
  })
  loadingUpload.value = false
  if (code === 200) {
    if (props.type === 'logo' && currentPlatItem.value.code === 'management') {
      state.manageLogo = showUpImage.value
    }
    emits('upateSuccess', {
      code: currentPlatItem.value.code,
      src: showUpImage.value,
      type: props.type,
    })
    ElMessage.success(`${currentPlatItem.value.label}图标更新成功`)
    showImageDialog.value = false
  } else {
    ElMessage.error(msg)
  }
}

const onShow = () => {
  showImageDialog.value = true
}
const onClosed = async () => {
  await uploadFileRef?.value.clearFiles()
  fileList.value = []
  showUpImage.value = readyUpImage.value = null
}
const onConfirm = () => {
  logoSubmit(
    currentPlatItem.value.path,
    currentPlatItem.value.fileName,
    'messageBox'
  )
}
const onCancel = () => {
  if (loadingUpload.value) {
    ElMessage.warning('请等待图标上传完毕')
    return
  }
  showImageDialog.value = false
}
const onChange = (data: any) => {
  loadingFile.value = true
  fileList.value = []
  showUpImage.value = null
  readyUpImage.value = data.raw
  let reader = new FileReader()
  reader.readAsDataURL(data.raw)
  reader.onload = (e: any) => {
    showUpImage.value = e.target.result
    loadingFile.value = false
  }
}

const onBeforeClose = (data: any) => {
  if (loadingUpload.value) {
    ElMessage.warning('请等待图标上传完毕')
    return
  }
  return data()
}
</script>
<style lang="scss" scoped>
.image-upload-panel {
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
  // padding: 1.5rem;
  // border: 1px solid var(--el-border-color);
  // border-radius: 8px;

  &:last-child {
    margin: 0;
  }

  .image-box {
    width: 12rem;
    max-height: 25rem;
    height: 5rem;
    border: 1px solid #dcdfe687;
    border-radius: 8px;
    display: flex;
    align-items: center;
    margin-right: 1.5rem;
    overflow: hidden;
    background-color: #f0f0f0;
    flex-shrink: 0;
    // padding: 1rem;
    // box-sizing: border-box;

    .el-image {
      width: 100%;
      height: auto;
      min-height: 5rem;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    :deep(.empty-image) {
      height: 100%;
      color: var(--el-text-color-regular) !important;
      font-size: var(--el-font-size-base) !important;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }

  p.prompt {
    font-size: 14px;
    margin-top: 1rem;
    opacity: 0.7;
  }

  :deep(.el-upload) {
    width: 100%;

    .el-upload-dragger {
      .unupload {
        display: flex;
        flex-direction: column;
        align-items: center;
      }

      width: 100%;

      .el-icon {
        margin-bottom: 0.5rem;
      }
    }
  }
}
</style>
