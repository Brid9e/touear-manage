<template lang='pug'>
div 
  el-row.group-input-box.content-createCustomComponent
    el-col(:xs="24", :sm="{ span: 16, offset: 3 }", :md="{ span: 16, offset: 3 }", :lg="{ span: lg?.span || 12, offset: lg?.offset || 5 }", :xl="{ span: lg?.span || 12, offset: lg?.offset || 5 }")
      el-form(ref="formRef" label-width="140px", :rules="rules", :model="formAdd")
        el-form-item(label="组件Code", prop="comCode")
          el-input(v-model="formAdd.comCode")
        el-form-item.is-required(label="名称", prop="name")
          el-input(v-model="formAdd.name")  
        el-form-item.is-required(label="英文名称", prop="nameEn")
          el-input(v-model="formAdd.nameEn")  
        el-form-item(label="组件类型", prop="comType")
          el-radio-group(v-model="formAdd.comType")
            el-radio(v-for="(item, i) in moduleTypeList", :label="item.id", name="type") {{ item.name }}
        el-form-item(label="用户类型", prop="userTypeArr")
          el-checkbox-group(v-model="formAdd.userTypeArr")
            el-checkbox(v-for="(item, i) in userTypeList", :label="item.label", name="type") {{ item.name }}
        el-form-item(label="平台类型", prop="platType")
          el-radio-group(v-model="formAdd.platType")
            el-radio(v-for="(item, i) in platTypeList", :label="item.code", name="type") {{ item.name }}
        el-form-item(label="应用图标目录", prop="appIconStyle" v-if="formAdd.comType === 1")
          el-input(v-model="formAdd.appIconStyle")  
        //- el-radio-group(v-model="formAdd.appIconStyle")
        //-   el-radio(v-for="(item, i) in iconModeList[formAdd.platType]", :label="item.code", name="type") {{ item.name }}            
        el-form-item(label='使用默认主题图标',prop="defaultTheme" v-if="formAdd.comType === 1")
          el-switch(v-model='formAdd.defaultTheme', :active-value='true', :inactive-value='false', active-text='优先使用默认主题图标', inactive-text='优先使用自定义主题图标' inline-prompt)
        el-form-item(:label="formAdd.comType === 1?'显示应用最大数量':'显示广告最大数量'" v-if="formAdd.comType === 1||formAdd.comType === 2")
          el-slider(v-model="formAdd.maxNumber" size="small" :min="1" :max="20" :show-tooltip="true" :show-input="true")
        el-form-item(label='显示全部应用', prop="isAllApps" v-if="formAdd.comType === 1")
          el-switch(v-model='formAdd.isAllApps', :active-value='true', :inactive-value='false', active-text='显示', inactive-text='不显示' inline-prompt)

        el-form-item.is-required(label="组件图标")
          el-upload.avatar-uploader(action="#" :show-file-list="false" , :auto-upload="false", :on-change="handleChange")
            img.avatar(v-if="imageUrl" , :src="imageUrl")
            el-icon(v-else).avatar-uploader-icon
              Plus 


        el-form-item(label="说明", prop="description" )
          el-input(v-model="formAdd.description" type='textarea' :rows="2")
        el-form-item
          el-button(@click="resetForm") 清空
          el-button(type="primary", @click="submitForm", :loading="saveLoading") 保存
</template>
<script lang="ts" setup>
import { Plus, UploadFilled } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import type { UploadProps } from 'element-plus'
import { ref, reactive, onActivated, onMounted } from "vue";
import { useStore } from "vuex";
import { key } from "@/store";
import { useRoute, useRouter } from 'vue-router';
import { App, Module } from '@/service/platform/index'
const { state } = useStore(key);
const { moduleTypeList, userTypeList, platTypeList, platTypeLevel, installStatusList, iconModeList } = state;
const props = defineProps(["options"]);
const router = useRouter()

const formRef = ref();
const imageUrl = ref('')
const imgFile = ref()
interface IExtraConfig {
  isAllApps: Boolean,
  maxNumber: Number
}
interface IFormAdd {
  [key: string]: any,
  appIconStyle: String | null,
  comCode: String,
  comIcon: String | null,
  name: String,
  comType: Number | null,
  defaultTheme: Boolean,
  description: String,
  // extraConfig?: IExtraConfig,
  nameEn: String,
  platType: String | null
  userTypeArr: Array<String>,
  isAllApps: Boolean,
  maxNumber: Number
}
// 表单内容
const formAdd: IFormAdd = reactive({
  appIconStyle: null,
  comCode: '',
  comIcon: null,
  name: '',
  comType: null,
  defaultTheme: false,
  description: '',
  // extraConfig: {
  isAllApps: false,
  maxNumber: 3,
  // },
  nameEn: '',
  platType: null,
  userTypeArr: []
});
const rules: any = ref({
  comCode: [
    {
      required: true,
      message: "请填写组件Code",
      trigger: "blur"
    },
    { min: 1, max: 20, message: '组件Code 不能超过20个字符长度', trigger: 'blur' }
  ],
  name: [
    {
      required: true,
      message: "请填写应用名称",
      trigger: "blur"
    }
  ],
  nameEn: [
    {
      required: true,
      message: "请填写应用英文名称",
      trigger: "blur"
    }
  ]
});

const lg = ref();
const xl = ref();

//表单清理
const resetForm = () => {
  formRef.value.resetFields();
};

const handleChange: UploadProps['onChange'] = (uploadFile) => {
  imageUrl.value = URL.createObjectURL(uploadFile.raw!)
  imgFile.value = uploadFile
  console.log(uploadFile)
  console.log(imageUrl.value)
}

const saveLoading = ref(false);
//表单提交
const submitForm = () => {
  console.log(imgFile.value)
  formRef.value.validate((valid: any) => {
    if (valid) {
      const formData = new FormData()
      Object.keys(formAdd).forEach((key) => {
        console.log(`zCom[0].${key}`, formAdd[key])
        if (formAdd[key] !== null) formData.append(`zCom[0].${key}`, formAdd[key])
      })
      if (formAdd.comType !== 1 && formAdd.comType !== 2) {
        formData.delete('zCom[0].isAllApps')
        formData.delete('zCom[0].maxNumber')
      }
      if (imgFile) {
        formData.append('zCom[0].iconImage', imgFile.value.raw!)
      }
      Module.addZcom(formData, 'messageBox').then(res => {
        router.push({
          name: 'module'
        })
      }).catch((error => {
        console.log('addZcom异常：')
        console.log(error)
      })).finally(() => {
      })
    } else {
      console.log("error submit!");
      return false;
    }
  });
}
onMounted(() => {
  console.log(state)
  if (props.options) {
    if (props.options.layout) {
      lg.value = props.options.layout.lg;
      xl.value = props.options.layout.xl;
    }
  }
})

defineExpose({
  formAdd,
  handleChange,
  resetForm,
  submitForm
});
</script>
<style lang='scss'>
.content-createCustomComponent {
  .avatar-uploader .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }

  .avatar-uploader .el-upload {
    border: 1px dashed gray;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    transition: pink;
  }

  .avatar-uploader .el-upload:hover {
    border-color: #3451b2;
  }

  .el-icon.avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    text-align: center;
  }
}
</style>