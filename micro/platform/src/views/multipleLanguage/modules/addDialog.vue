<template lang="pug">
el-dialog(v-model="show" :title="`添加 ${title} 多语言`" :width="600" @closed="onClose")
  //- 单个语言添加
  el-form(ref="ruleFormRef" :model="form" :rules="rules" label-width="100px")
    el-form-item(label="多语言Key" prop="key")
      el-input(v-model="form.key" placeholder="请输入语言包的Key")
    el-form-item(label="中文·简体")
      el-input(v-model="form.cn" placeholder="请输入中文·简体" type="textarea")
    el-form-item(label="中文·繁体")
      el-input(v-model="form.hk" placeholder="请输入中文·繁体" type="textarea")
    el-form-item(label="英文")
      el-input(v-model="form.en" placeholder="请输入英文" type="textarea")
  template(#footer)
    el-button(type="primary" link @click="emits('update:modelValue', false);selectUploadType = true" ) 批量添加
    el-button(@click="emits('update:modelValue', false)") 取消
    el-button(type="primary" @click="confirm('messageBox', ruleFormRef)" :loading="submitLoading") 确定

//- 语言包上传方式
el-dialog(v-model="selectUploadType", append-to-body, title="上传方式", :width="600")
  el-row(:gutter="20")
    el-col(:span="12")
      el-button.select-item(type="primary" text @click="openNewDialog('json')") Json数据添加
    el-col(:span="12")
      el-button.select-item(type="primary" text @click="openNewDialog('file')") 压缩包上传

//- Json数据批量添加
el-drawer(v-model="openJsonUpload" direction="rtl", :with-header="false" size="90%" @closed="onClose" :before-close="onBeforeClose")
  .box
    el-scrollbar.cn-box(:class="{'is-drag': drag.cn}" @dragover.prevent="onDragOver('cn')" @dragleave="onDragLeave('cn')" @drop="onDrop($event, 'cn')")
      el-input.lang(v-model="langInput.cn" placeholder="在此粘贴 中文·简体 的json数据或将json文件拖拽至此" @input="val => onInput(val, 'cn')")
      VueJsonPretty(:data="lang.cn" :height="500" :showLineNumber="true" showLength showIcon :showLine="false" @jsonChange="onJsonChange")
    el-scrollbar.hk-box(:class="{'is-drag': drag.hk}" @dragover.prevent="onDragOver('hk')" @dragleave="onDragLeave('hk')" @drop="onDrop($event, 'hk')")
      el-input.lang(v-model="langInput.hk" placeholder="在此粘贴 中文·繁体 的json数据或将json文件拖拽至此" @input="val => onInput(val, 'hk')")
      VueJsonPretty(:data="lang.hk" :height="500" :showLineNumber="true" showLength showIcon :showLine="false" @jsonChange="onJsonChange")
    el-scrollbar.en-box(:class="{'is-drag': drag.en}" @dragover.prevent="onDragOver('en')" @dragleave="onDragLeave('en')" @drop="onDrop($event, 'en')")
      el-input.lang(v-model="langInput.en" placeholder="在此粘贴 英文 的json数据或将json文件拖拽至此" @input="val => onInput(val, 'en')")
      VueJsonPretty(:data="lang.en" :height="500" :showLineNumber="true" showLength showIcon :showLine="false" @jsonChange="onJsonChange")
  template(#footer)
    el-button(@click="openNewDialog('prev')" link type="primary") 重新选择
    el-button(@click="onBeforeClose") 取消
    el-button(type="primary" @click="confirm('messageBox')" :loading="submitLoading") 确定

//- 文件上传
el-dialog(v-model="openFileUpload" append-to-body title="压缩包上传" :width="600" @closed="onClose" :before-close="onBeforeClose")
  el-upload(ref="uploadFileRef", v-model:file-list="fileList", action="#", drag, :show-file-list="false", :limit="1", :before-upload="onBeforeUpload", :on-change="onChange", :auto-upload="false", accept="application/zip")
    .unupload(v-if="isEmpty(fileList)")
      el-icon(style="margin-right: 0.25rem;")
        Upload
      span.upload-font 点击或将压缩包拖拽至此，只支持zip压缩包文件。
    .file-preview(v-else)
      el-icon(style="margin-right: 0.25rem;")
        FolderChecked
      span {{ file?.name }}
  template(#footer)
    el-button(@click="openNewDialog('prev')" link type="primary") 重新选择
    el-button(@click="onBeforeClose") 取消
    el-button(type="primary" @click="onConfirm" :loading="confirmLoading") 确定
</template>
<script lang="ts" setup>
import { ref, computed, reactive, watch, nextTick } from 'vue'
import mergeJSONData from './index'
import headerOperation from '@/components/headOperation.vue'
import VueJsonPretty from 'vue-json-pretty'
import 'vue-json-pretty/lib/styles.css'
import { Language } from '@/service/platform'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { FormRules } from 'element-plus'
import { isEmpty } from 'lodash'
import { Upload, FolderChecked } from '@element-plus/icons-vue'

const props = defineProps({
  title: {
    type: String,
    default: '',
  },
  platType: {
    type: String,
    default: '',
  },
  modelValue: {
    type: Boolean,
    default: false,
  },
})

const emits = defineEmits<{
  (e: 'cancel'): void
  (e: 'onSucceed'): void
  (e: 'update:modelValue', v: boolean): void
}>()

const lang: any = ref({ cn: {}, en: {}, hk: {} })
const ruleFormRef = ref()
const form: any = ref({})
const langInput: any = ref({})
const show = ref(false)
const openJsonUpload = ref(false)
const submitLoading = ref(false)
const selectUploadType = ref(false)
const openFileUpload = ref(false)
const confirmLoading = ref(false)
const uploadFileRef = ref()
const fileList = ref([])
const drag: any = ref({
  cn: false,
  hk: false,
  en: false,
})

const file: any = computed(() => fileList.value?.[0] || {})

// 文件上传

const rules = reactive<FormRules>({
  key: [
    {
      required: true,
      message: '多语言Key不能为空',
      trigger: 'change',
    },
  ],
})

const jsonDisabled = computed(
  () => !!(form.value.key || form.value.cn || form.value.en || form.value.hk)
)

const inputDisabled = computed(
  () =>
    !!(
      !isEmpty(langInput.value.cn) ||
      !isEmpty(langInput.value.en) ||
      !isEmpty(langInput.value.hk)
    )
)

// 输入json数据，解析
const onInput = (v: any, k: string) => {
  if (v?.[v.length - 1] === ',') v = v.slice(0, -1)

  const regex = /^\{.*\}$/
  const result = regex.test(v)
  if (!result) v = `{${v}}`

  let json = null
  let status = true
  try {
    json = JSON.parse(v)
  } catch (err: any) {
    status = false
    json = err.message
  }
  if (!v) status = true
  lang.value[k] = status ? (v ? json : {}) : { __ERROR__: json }
}

// 关闭
const onClose = () => {
  emits('update:modelValue', false)
  ruleFormRef.value.resetFields()
  form.value = {}
  langInput.value = {}
  lang.value = { cn: {}, en: {}, hk: {} }
  fileList.value = []
  show.value = false
}

// 提交
const confirm = async (msgBox?: string, ref?: any) => {
  const api = async (data: any) => {
    submitLoading.value = true
    const params = {
      data,
      platType: props.platType,
    }
    const { code }: any = await Language.addLanguage(params, msgBox).catch(
      () => {
        openJsonUpload.value = false
        submitLoading.value = false
      }
    )
    submitLoading.value = false
    openJsonUpload.value = false
    if (code === 200) {
      ElMessage.success('添加成功')
      emits('cancel')
      emits('onSucceed')
      //
    }
  }
  if (ref !== undefined) {
    if (!ref) return
    await ref.validate((valid: any, fields: any) => {
      const data: any = {}
      data[form.value.key] = {
        cn: form.value.cn,
        hk: form.value.hk,
        en: form.value.en,
      }
      if (valid) api(data)
    })
  } else {
    api(mergeJSONData(lang.value))
  }
}

// 打开窗口的统一处理逻辑
const openNewDialog = async (type: string) => {
  if (['json', 'file'].includes(type)) selectUploadType.value = false
  if (type === 'json') openJsonUpload.value = true
  if (type === 'file') openFileUpload.value = true
  if (type === 'prev') {
    if (confirmLoading.value || submitLoading.value) {
      ElMessageBox.alert('还未上传完毕，请稍候...', '提示', {
        showCancelButton: false,
        type: 'warning',
      })
      return
    }
    openJsonUpload.value = openFileUpload.value = false
    selectUploadType.value = true
    fileList.value = []
  }
}

const onJsonChange = (val: any, a: any, b: any) => {
  console.log(val, a, b)
}

const onConfirm = async () => {
  if (isEmpty(fileList.value)) {
    ElMessage.error('没有可上传的文件')
    return
  }
  confirmLoading.value = true
  const formData = new FormData()
  console.log(file.value)
  formData.append('file', file.value.raw)
  formData.append('platType', props.platType)
  const { code }: any = await Language.uploadLangZip(
    formData,
    'messageBox'
  ).catch(() => {
    confirmLoading.value = false
    openFileUpload.value = false
  })
  if (code === 200) {
    ElMessage.success('上传成功')
    confirmLoading.value = false
    openFileUpload.value = false
    emits('onSucceed')
  }
}

const onBeforeClose = (done = () => {}) => {
  if (confirmLoading.value || submitLoading.value) {
    ElMessageBox.alert('还未上传完毕，请稍候...', '提示', {
      showCancelButton: false,
      type: 'warning',
    })
  } else {
    openJsonUpload.value = false
    openFileUpload.value = false
    done()
  }
}

const onDragOver = (type: string) => {
  drag.value[type] = true
}

const onDragLeave = (type: string) => {
  drag.value[type] = false
}

const onDrop = (res: any, type: string) => {
  res.preventDefault()
  drag.value[type] = false
  const files = res.dataTransfer.files
  console.log(res, files)
  if (files?.length > 1) {
    ElMessage.error('仅支持单文件拖拽')
    return
  }

  const file = files[0]

  if (file.type !== 'application/json') {
    ElMessage.error('仅支持json文件')
    return
  }
  const reader = new FileReader()
  reader.onload = (e: any) => {
    langInput.value[type] = e.target.result
    lang.value[type] = JSON.parse(e.target.result)
  }
  reader.readAsText(file)
}

watch(
  () => props.modelValue,
  (val) => (show.value = val)
)
</script>
<style lang="scss" scoped>
.cn-box,
.hk-box,
.en-box {
  width: 100%;
  height: 100%;
  background-color: #161363;
  margin-right: 1rem;
  padding: 1rem 1rem 3rem 1rem;
  box-sizing: border-box;
  border-radius: var(--el-border-radius-base);
  color: #ffffff;

  &:last-child {
    margin: 0;
  }

  :deep(.el-textarea) {
    height: 80%;
  }
}

.cn-box::after {
  content: '简';
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  font-size: 12rem;
  font-weight: 800;
  color: #ffffff;
  z-index: 2;
  top: 0;
  left: 0;
  opacity: 0.1;
  pointer-events: none;
}

.en-box::after {
  content: '英';
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  font-size: 12rem;
  font-weight: 800;
  color: #ffffff;
  z-index: 2;
  top: 0;
  left: 0;
  opacity: 0.1;
  pointer-events: none;
}

.hk-box::after {
  content: '繁';
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  font-size: 12rem;
  font-weight: 800;
  color: #ffffff;
  z-index: 2;
  top: 0;
  left: 0;
  opacity: 0.1;
  pointer-events: none;
}

.box {
  height: 100%;
  display: flex;
  justify-content: space-between;
}

:deep(.vjs-tree-node) {
  &:hover {
    background-color: #3c39ab !important;
  }
}

:deep(.vjs-key),
:deep(.vjs-value),
:deep(.vjs-node-index) {
  white-space: nowrap;
}

:deep(.el-input.lang) {
  margin-top: 0.5rem;
  margin-bottom: 0.5rem;
  position: absolute;
  bottom: 0;
  left: 0;

  .el-input__wrapper {
    background-color: transparent;
    color: #ffffff;
    border: none;
    box-shadow: none;
    border-top: 1px solid #ffffff35;
    padding-top: 0.5rem;
    border-radius: 0;

    .el-input__inner {
      color: #ffffff;
    }
  }
}
.select-item {
  width: 100%;
  height: 200px;
  font-size: 1.25rem;
  border-radius: 14px;
  border: 1px dashed var(--el-color-primary);
}
.is-drag {
  transition: all 0.3s ease;
  opacity: 0.8;
}
</style>
