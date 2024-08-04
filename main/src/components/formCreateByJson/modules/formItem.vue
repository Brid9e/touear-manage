<template lang="pug">
template(v-if="item.type === 'input'")
  el-input.input-width(v-if="item.props.type==='money'" type="number" v-model="item.value", :formatter="formatterMoney"  placeholder="请输入金额", :disabled="item.props.disabled")
  el-input.input-width(v-else placeholder="请输入", v-model="item.value", :type="item.props.type", :disabled="item.props.disabled")

template(v-else-if="item.type === 'checkbox'")
  el-checkbox-group(v-model="item.value" :disabled="item.props.disabled")
    el-checkbox(:label="itemO.value", v-for="(itemO, j) in item.options", :key="j", @change="changeCheckbox(item)") {{ itemO.label }}

template(v-else-if="item.type === 'radio'" )
  el-radio-group(v-model="item.value", @change="changeRadio(item)" :disabled="item.props.disabled")
    el-radio(:label="itemO.value", v-for="(itemO, j) in item.options", :key="j") {{ itemO.label }}

template(v-else-if="item.type === 'select'")
  el-select.input-width(v-model="item.value", placeholder="请选择", :multiple="item.props.multiple", @change="changeSelect(item)", :disabled="item.props.disabled")
    el-option(v-for="(itemO, j) in item.options", :key="j", :label="itemO.label", :value="itemO.value")

template(v-else-if="item.type === 'cascader'")
  //- el-cascader.input-width(v-model='item.value', :options='item.props.options', :props='item.props.props')
  el-cascader(v-model="item.value", :ref="'cascader' + item.field", :options="item.props.options", :props="item.props.props", @change="changeCascader(item, 'cascader' + item.field)")

template(v-if="item.type === 'switch'")
  el-switch(v-model="item.value", :active-value="item.activeValue", :inactive-value="item.inactiveValue" :disabled="item.props.disabled")

template(v-if="item.type === 'timePickerRange'")
  el-time-picker(v-model="item.value" is-range value-format="HH:mm" format="HH:mm",)

template(v-if="item.type === 'timePicker'")
  el-time-picker(v-model="item.value" value-format="HH:mm:ss",)

template(v-if="item.type === 'uploadImg'")
  .upload-box
    .upload-item
      .text-center
        el-upload.avatar-uploader(v-model="item.value", action="#", :http-request="item.httpRequest", accept="image/gif,image/jpeg,image/jpg,image/png,image/svg")
          i.icon-upload.el-icon-camera-solid.avatar-uploader-icon(v-if="!item.value")
          el-image.appImg(v-else, :src="item.value", style="width: 50px; height: 50px")
            template(#error="")
              .icon-picture-size
                Picture
      el-row.handle-bar(:gutter="0")
        el-col.text-danger.text-right(style="cursor: pointer", :span="24", @click="item.delete(item)") 删除

template(v-if="item.type === 'upload'")
  el-upload(:ref="'uploadFile' + item.field" v-model:file-list="item.fileList"
    action="#"
    multiple
    :on-preview="handlePreview"
    :on-remove="handleRemove"
    :before-remove="beforeRemove"
    :limit="item.props.limit || 9"
    :accept="item.props.accept || '*'"
    :http-request="item.httpRequest"
    :on-exceed="handleExceed")
    el-button(type="primary" :disabled="item.fileList?.length >= (item.props.limit || 9)" @click="onClick(item)") 添加文件
    template(#tip) 
      //- .el-upload__tip {{ item.props.info }}
      //- .el-upload__tip.text-danger {{ item.myErrorMsg }}
      .text-gray-7.font-size-12 {{ item.props.info }}
      .text-danger.font-size-12(style="line-height: 12px") {{ item.myErrorMsg }}

p.form-info(style="padding-left: 0", v-if="item.info") {{ item.info }}
.margin-top-x.cascader-tab-style(v-if="item.selectedNodes && item.hasGangedPanel")
  .cascader-tab(v-if="(item.type === 'cascader' && item.props.props.multiple) || item.type === 'checkbox' || (item.type === 'select' && item.props.multiple)")
    el-tabs(v-model="item.itemTabValue")
      el-tab-pane(v-for="(node, key) in item.selectedNodes", :key="key", :label="item.type === 'cascader' ? node.text : node.data.label", :name="item.type === 'cascader' ? node.pathValues.join('-') : node.data.value")
        .form-info(v-if="node.data.info") *{{ node.data.info }}
        .childForm
          .text-danger(v-if="node.data.isThird", style="margin-top: -25px") *以下设置将对所有平台生效
          div(v-for="(childFormItem, index) in node.data.childForm", :key="index")
            el-form-item.margin-bottom-x(v-if="childFormItem.display", :label="childFormItem.title", :prop="'configData.' + i + '.selectedNodes.' + key + '.data.childForm.' + index + '.value'", :rules="childFormItem.validate")
              form-item(:item="childFormItem")
  .cascader-one(v-else)
    .form-info(v-if="item.selectedNodes[0].data.info") *{{ item.selectedNodes[0].data.info }}
    .childForm
      div(v-for="(childFormItem, index) in item.selectedNodes[0].data.childForm", :key="index")
        el-form-item.margin-bottom-x(v-if="childFormItem.display", :label="childFormItem.title", :prop="'configData.' + i + '.selectedNodes.' + 0 + '.data.childForm.' + index + '.value'", :rules="childFormItem.validate")
          form-item(:item="childFormItem")
</template>
<script lang="ts" setup>
import { cloneDeep, set } from "lodash"
import { ref, onMounted, defineEmits, defineProps, defineExpose, getCurrentInstance, inject, watch } from "vue"
import { Picture } from '@element-plus/icons-vue'
import type { UploadProps, UploadUserFile, UploadRawFile } from 'element-plus'
import { genFileId } from 'element-plus'
import { ElMessage, ElMessageBox } from 'element-plus'
const instance = getCurrentInstance()
const props = defineProps({
  item: Object,
  i: Number,
})
// const emit = defineEmits(["change"])
// console.log('formItem--', props.item)
// watch(()=>props.item,(newVal) => {
//   console.log("formItem--newVal3:",newVal)
// })
watch(() => props.item, (newVal) => {
  // console.log("formItem--item:", newVal)
})
const formatterMoney = (value: any) => {
  var re = /([0-9]+\.[0-9]{2})[0-9]*/
  value = value ? Number(value.toString().replace(re, "$1")) : ''
  return value
}
const parentObj: any = inject("formCreateObj")
const changeRadio = (data: any) => {
  // parentObj.getName('tom')
  data.hasGangedPanel = false
  data.selectedNodes = []
  data.options.forEach((o: any) => {
    if (o.value === data.value && ((o.childForm && o.childForm.length > 0) || o.info)) {
      data.hasGangedPanel = true
      data.selectedNodes = [{ data: o }]
      if (o.childForm && o.childForm.length > 0) {
        parentObj.initData(o.childForm)
      }
    }
  })
}

const changeCheckbox = (data: any) => {
  data.hasGangedPanel = false
  data.selectedNodes = []
  data.options.forEach((o: any) => {
    if (data.value.indexOf(o.value) > -1 && o.childForm && o.childForm.length > 0) {
      if ((o.childForm && o.childForm.length > 0) || o.info) {
        data.hasGangedPanel = true
      }
      if (o.childForm && o.childForm.length > 0) {
        parentObj.initData(o.childForm)
      }
      data.selectedNodes.push({ data: o })
    }
  })
  data.itemTabValue = ""
  if (data.value.length > 0 && data.selectedNodes.length > 0) {
    data.itemTabValue = data.selectedNodes[0].data.value
  }
}
const changeSelect = (data: any) => {
  data.hasGangedPanel = false
  data.selectedNodes = []
  data.options.forEach((o: any) => {
    if ((data.props.multiple && data.value.indexOf(o.value) > -1) || (!data.props.multiple && data.value === o.value)) {
      if ((o.childForm && o.childForm.length > 0) || o.info) {
        if (o.childForm && o.childForm.length > 0) {
          parentObj.initData(o.childForm)
        }
        data.hasGangedPanel = true
      }
      data.selectedNodes.push({ data: o })
    }
  })
  data.itemTabValue = ""
  if (data.value.length > 0 && data.selectedNodes.length > 0) {
    data.itemTabValue = data.selectedNodes[0].data.value
  }
}
// 级联选择器change
const changeCascader = (item: any, refName: string) => {
  let nodes = ((instance as any).refs[refName] as any).getCheckedNodes()
  item.hasGangedPanel = false
  nodes = nodes.filter((o: any) => {
    if (o.children.length === 0 && (o.data.info || (o.data.childForm && o.data.childForm.length > 0))) {
      item.hasGangedPanel = true
      if (o.data.childForm && o.data.childForm.length > 0) {
        parentObj.initData(o.data.childForm)
      }
    }
    return o.children.length === 0
  })
  item.selectedNodes = nodes
  if (item.hasGangedPanel && item.props.props.multiple) {
    item.itemTabValue = ""
    if (item.value.length > 0) {
      item.itemTabValue = item.selectedNodes[0].pathValues.join("-")
    }
  }
}

// 文件上传change
const changeUpload = (item: any, files: any) => {
  item.files = cloneDeep(files)
}
const handleRemove: UploadProps['onRemove'] = (file, uploadFiles) => {
  console.log(file, uploadFiles)
}

const handlePreview: UploadProps['onPreview'] = (uploadFile) => {
  console.log(uploadFile)
}
const fieldInput: any = ref()
const onClick = (item: any) => {
  console.log('onClick', item)
  fieldInput.value = item
  fieldInput.value.myErrorMsg = null
}
const handleExceed: UploadProps['onExceed'] = (files, uploadFiles) => {
  console.log(files, uploadFiles, fieldInput.value?.field)
  fieldInput.value.myErrorMsg = '文件超出最大数量限制，已覆盖原文件'
  let nodes = ((instance as any).refs['uploadFile' + fieldInput.value?.field] as any)
  console.log(nodes)
  nodes!.clearFiles()
  files.forEach(element => {
    const file = element as UploadRawFile
    file.uid = genFileId()
    nodes!.handleStart(file)
  });
}

const beforeRemove: UploadProps['beforeRemove'] = (uploadFile, uploadFiles) => {
  return ElMessageBox.confirm(
    `确认取消文件${uploadFile.name} ?`
  ).then(
    () => true,
    () => false
  )
}
// 上传图片
// const uploaHhttpRequest = (data: any) => {
//   console.log('uploaHhttpRequest', data)
//   // obj.src = URL.createObjectURL(data.file)
//   // obj.file = data.file
// }
</script>
<style scoped lang="scss">
.form-info {
  width: 100%;
  font-size: 12px;
  color: #888;
  padding-top: 3px;
}

.input-width {
  width: 300px;
}

.upload-box {
  position: relative;

  .avatar-uploader {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    width: 100px;
    height: 100px;
    line-height: 100px;
    background-color: #fff;

    .avatar-uploader-icon {
      font-size: 28px;
      color: #8c939d;
      width: 100px;
      height: 100px;
      line-height: 100px;
      text-align: center;
    }

    .icon-upload {
      font-size: 50px;
    }
  }

  .upload-item {
    width: 102px;
    display: inline-block;
    // background-color: #f4f5f5;
    background-color: transparent;
    border-radius: 6px;
    margin-right: 40px;

    .handle-bar {
      background-color: transparent;
    }
  }

  .upload-img svg {
    width: 50px;
    height: 50px;
    color: #ccc;
    line-height: 100px;
  }

  .appImg,
  .pcImg {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }

  .appImg {
    width: 80px;
    height: 80px;
    border-radius: 100%;
  }

  .pcImg {
    width: 80px;
    height: auto;
    max-height: 80px;
  }

  .icon-picture-size {
    svg {
      width: 30px;
      height: 30px;
      transform: translateY(-15px);
      color: #ccc;
    }
  }
}

.cascader-tab-style {
  width: 100%;

  .el-form-item {
    margin-bottom: 18px;
  }
}
</style>
