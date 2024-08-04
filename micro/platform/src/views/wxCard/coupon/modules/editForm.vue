<template lang="pug">
.edit-form
  el-form(ref="editFormRef", label-width="150px", :rules="rules" :model="form")
    el-form-item.bgc-item(prop="baseInfoBean.logoUrl" label="Logo图片")
      .bgc-box.logo-box
        el-upload(action='#', :http-request='uploadFile', accept='image/gif,image/jpeg,image/jpg,image/png,image/svg', :show-file-list="false")
          el-image.bgc-img(v-if='form.baseInfoBean.logoUrl', :src='form.baseInfoBean.logoUrl', :onerror='defaultPicture')
          p.tip(v-else) 请上传LOGO
          el-icon.margin-left-x.cursor.text-primary.del-icon(v-if="form.baseInfoBean.logoUrl" @click.stop="form.baseInfoBean.logoUrl = '';form.baseInfoBean.logoFile = ''")
            Delete
        p.font-size-12.text-gray-6 *建议像素为300*300。
    el-form-item(prop="name" label="卡名称")
      el-input(v-model="form.name")
    el-form-item(prop="baseInfoBean.color" label="卡券背景色")
      .choose-bg-color
        el-radio-group(v-model='form.baseInfoBean.color')
          el-radio(:label='key' v-for="(item, key) in color" :key="key")
            div.color-block(:style="`background-color:${item}`") {{item}}
    el-form-item(label="可领数量")
      el-input(v-model="form.baseInfoBean.getLimit" placeholder="请输入可领数量" type="number")
    el-form-item(prop="baseInfoBean.description" label="卡详情-使用说明")
      el-input(v-model="form.baseInfoBean.description" placeholder="请输入卡使用说明" type="textarea",  show-word-limit,  :maxlength="1024")
    //- el-form-item(prop="baseInfoBean.notice" label="卡券提醒" describe="测试")
      el-input(v-model="form.baseInfoBean.notice" placeholder="请输入卡券提醒")
</template>
<script lang="ts" setup>
import { ref, reactive, watch, toRefs } from 'vue'
import { Delete } from '@element-plus/icons-vue'
import { cloneDeep } from 'lodash'
import { WxCard } from '@/service/platform'

const props: any = defineProps({
  color: {
    type: Object,
    default: null,
  },
  item: {
    type: Object,
    default: null,
  },
})

const editFormRef = ref()

let form: any = ref()

// 表单规则
const rules = reactive({
  name: [{ required: true, message: '卡名称不能为空', trigger: 'blur' }],
  'baseInfoBean.logoUrl': [
    { required: true, message: 'LOGO图片不能为空', trigger: 'change' },
  ],
  'baseInfoBean.description': [
    { required: true, message: '卡券说明不能为空', trigger: 'change' },
  ],
  'baseInfoBean.notice': [
    { required: true, message: '卡券提醒不能为空', trigger: 'change' },
  ],
  'baseInfoBean.color': [
    { required: true, message: '卡券提醒不能为空', trigger: 'change' },
  ],
})

// 保存图片到form
const uploadFile = async (data: any) => {
  form.baseInfoBean.logoFile = data.file
  form.baseInfoBean.logoUrl = URL.createObjectURL(data.file)
}

// 提交编辑
const confirm = async () => {
  const formData = new FormData()
  form.value.id && formData.append('id', form.value.id)
  form.value.name && formData.append('name', form.value.name)
  form.value.baseInfoBean.color &&
    formData.append('baseInfoBean.color', form.value.baseInfoBean.color)
  form.value.baseInfoBean.getLimit &&
    formData.append('baseInfoBean.getLimit', form.value.baseInfoBean.getLimit)
  form.value.baseInfoBean.description &&
    formData.append(
      'baseInfoBean.description',
      form.value.baseInfoBean.description
    )
  form.value.baseInfoBean.notice &&
    formData.append('baseInfoBean.notice', form.value.baseInfoBean.notice)
  form.value.baseInfoBean.logoFile &&
    formData.append('baseInfoBean.logoFile', form.value.baseInfoBean.logoFile)
  return await WxCard.wxCardEdit(formData, 'messageBox')
}

watch(
  () => props.item,
  (res) => {
    form.value = cloneDeep(res)
  },
  {
    immediate: true,
  }
)

defineExpose({
  editFormRef,
  confirm,
})
</script>
<style lang="scss" scoped>
.edit-form {
  .choose-bg-color {
    .el-radio {
      margin-bottom: 5px;
      margin-right: 10px;
    }
    .color-block {
      width: 58px;
      text-align: center;
      font-size: 12px;
      color: #fff;
    }
  }
  .bgc-item {
    .bgc-box {
      .bgc-img {
        width: 330px;
        height: calc(330px * 600 / 1000);
        border-radius: 10px;
      }
      .tip {
        width: 330px;
        height: calc(330px * 600 / 1000);
        border-radius: 10px;
        background-color: rgb(247, 247, 247);
        font-size: 30px;
        text-align: center;
        line-height: calc(330px * 600 / 1000);
        color: rgb(209, 209, 209);
        transform: translateY(0);
      }
    }
    .logo-box {
      .bgc-img {
        width: 90px;
        height: 90px;
      }
      .tip {
        width: 90px;
        height: 90px;
        font-size: 12px;
        line-height: 90px;
      }
    }
    .el-upload-list {
      display: none;
    }
    .el-dialog__body {
      padding-top: 15px;
    }
    .el-upload {
      align-items: flex-end;
    }
    .del-icon {
      height: 90px;
      display: flex;
      align-items: flex-end;
    }
  }
}
</style>
