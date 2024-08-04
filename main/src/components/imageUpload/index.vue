<template lang="pug">
.image-upload(:class="`box-${size}`")
  el-upload(
    ref="imgUploadRef"
    action="#"
    :show-file-list="false"
    :on-change="handleChange"
    :before-upload="beforeAvatarUpload"
    :auto-upload="false"
    :accept="accept"
    )

    .avatar-uploader(:class="{'is-round': isRound, 'size-default': size === 'default', 'size-small': size === 'small'}")
      el-image.image-preview(v-if="imageUrl" :src="imageUrl" fit="cover")
      el-icon(v-else class="avatar-uploader-icon")
        Plus

    .upload-right(v-if="size !== 'small'")
      el-button.upload-click(type="primary" text bg size="smalll" @click="handleStart") {{ btnText }}
      p {{info || defaultInfo}}

  slot(name="desc")
</template>

<script lang="ts" setup>
import { computed, ref, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import type { UploadProps } from 'element-plus'
import { isEmpty, map } from 'lodash'
import { File } from '@/service/public'

const props = defineProps({
  fileType: { // 默认['jpg', 'png', 'jpeg']，支持的文件格式
    type: Array,
    default: ['jpg', 'png', 'jpeg'],
  },
  fileMaxSize: { // 默认2MB，文件大小上限
    type: Number,
    default: 2,
  },
  sizeUnit: { // 默认单位为MB 可选：KB,MB,GB
    type: String,
    default: 'MB',
  },
  info: { // 自定义提示
    type: String,
    default: '',
  },
  round: {
    type: Boolean,
    default: false,
  },
  bucketName: {
    type: String,
    default: 'photo',
  },
  modelValue: {
    type: String,
    default: '',
  },
  size: {
    type: String,
    default: 'default', // 默认单位为default 可选：small
  },
  btnText: {
    type: String,
    default: '选择文件', // 默认单位为default 可选：small
  }
})

const emits = defineEmits<{ (e: 'change', v: any): void }>()

const imageUrl = ref('')
const catchImageUrl = ref('')
const fileList: any = ref([])
const imgUploadRef = ref()

/**
 * 是否圆形
 */
const isRound = computed(() => props.round)
/**
 * 默认提示
 */
const defaultInfo = computed(() => {
  const support = `支持${props.fileType.join('、')}格式`
  const maxSize = `大小不超过${props.fileMaxSize}${props.sizeUnit}`
  const res = [support, maxSize]
  return res.join('，')
})

/**
 * 支持的文件类型
 */
const accept = computed(() => {
  return map(props.fileType, (r: any) => 'image/' + r).join(',')
})

/**
 * 当文件列表变化时
 * @param response
 * @param uploadFile
 */
const handleChange: UploadProps['onChange'] = (uploadFile, uploadFiles) => {
  imgUploadRef.value.clearFiles()
  imageUrl.value = URL.createObjectURL(uploadFile.raw!)
  fileList.value = uploadFiles
  emits('change', uploadFiles)
}

const beforeAvatarUpload: UploadProps['beforeUpload'] = (rawFile) => {
  if (!props.fileType?.map(r => r = 'image/' + r).includes(rawFile.type)) {
    ElMessage.error(`文件格式必须是${props.fileType.join('、')}其中的一种`)
    return false
  }
  if (convertFileSize(rawFile.size, props.sizeUnit) > props.fileMaxSize) {
    ElMessage.error(`文件大小不能超过${convertFileSize(rawFile.size, props.sizeUnit)}${props.sizeUnit}！`)
    return false
  }
  return true
}


/**
 * 计算传入单位下的文件大小
 * @param bytes
 * @param unit
 */
function convertFileSize(bytes: number, unit: string) {
  // kb
  if (unit.toLowerCase() === 'kb') {
    return bytes / 1024;
  }
  // mb
  if (unit.toLowerCase() === 'mb') {
    return bytes / (1024 * 1024);
  }
  // gb
  if (unit.toLowerCase() === 'gb') {
    return bytes / (1024 * 1024 * 1024);
  }
  return 0
}

/**
 * 提交
 * @returns {Promise<any>} await File.uploadFiles(formData)
 */
async function submit() {
  if (isEmpty(fileList.value)) return { code: 200, data: [] }
  const formData = new FormData()
  formData.append('bucketName', props.bucketName)
  for (const fileItem of map(fileList.value, 'raw')) formData.append('files', fileItem)
  return await File.uploadFiles(formData)
}

/**
 * 清空
 */
function clear() {
  imgUploadRef.value.clearFiles()
  fileList.value = []
  imageUrl.value = ''
}

watch(() => props.modelValue, (val) => {
  if (val) {
    // 待优化
    imageUrl.value = catchImageUrl.value = val
  }
}, {
  deep: true,
  immediate: true
})


defineExpose({
  submit,
  clear
})

function handleStart() {
  imgUploadRef.value.submit()
}

</script>

<style lang="scss" scoped>
.box-default {
  width: 100%;
  padding: var(--el-dialog-padding-primary);
  border: 1px solid var(--el-border-color);
}

.image-upload {
  display: flex;
  border-radius: var(--el-input-border-radius, var(--el-border-radius-base));
  transition: var(--el-transition-duration-fast);
  flex-direction: column;

  &:hover {
    border-color: var(--el-border-color-hover);
  }

  .upload-right {
    margin-left: 2rem;
    display: flex;
    flex-direction: column;
    justify-content: center;

    .upload-click {
      margin-bottom: 1rem;
      width: fit-content;
    }

    p {
      color: var(--el-text-color-regular);
      font-size: 12px;
    }
  }
}

.size-default {
  width: 6.25rem;
  height: 6.25rem;
}

.size-small {
  width: 4.25rem;
  height: 4.25rem;
}

:deep(.avatar-uploader) {
  display: flex;
  border: 1px solid var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
  flex-shrink: 0;

  &:hover {
    border-style: dashed;
    border-color: var(--el-color-primary);
    background-color: var(--el-fill-color-light);
  }
}

.is-round {
  border-radius: 50% !important;
}

.el-icon.avatar-uploader-icon,
.image-preview {
  font-size: 1.75rem;
  color: var(--el-border-color);
  width: 100%;
  height: 100%;
  flex-shrink: 0;
  text-align: center;
}
</style>
