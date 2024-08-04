<template lang="pug">
//- div(style="height:500px;background:red")
.addtype
  el-form(ref='form', label-width='120px')
    el-form-item.is-required(label='分类名称')
      el-input(v-model='name')
    el-form-item.is-required(label='分类名称英文')
      el-input(v-model='nameEn')
    //- el-form-item(label='分类图标')
    //-   div.upload-box
    //-     div.upload-item
    //-       div.avatar-uploader.text-center
    //-         i.icon-upload.el-icon-camera-solid.avatar-uploader-icon(v-if="!imageUrl")
    //-         img.appImg(v-else :src="imageUrl")
    //-       el-row.handle-bar(:gutter='0')
    //-         el-col.text-link(:span='12' @click="clickbtn") 图标库
    //-         el-col.text-right.text-link(:span='12')
    //-           el-upload(action='#'  :http-request='httpRequestApp' accept="image/gif,image/jpeg,image/jpg,image/png,image/svg") 上传
    el-form-item
      el-button.btn-large(type='primary', @click='onSubmit', :disabled='!nameEn || !name') 提交
//- el-button(type='primary' @click='showDialog = true').btn-large 打开dialog
//- el-button(type='primary' @click='showDialog1 = true').btn-large showDialog1
sub-dialog(v-model='showDialog', :width='422', title='title', custom-class='aaa')
  //- template(#title)
  //-   p header
  div {{ showDialog }}
  template(#footer)
    span.dialog-footer
      el-button(@click='showDialog = false') Cancel
      el-button(type='primary', @click='showDialog = false') Confirm
</template>
<script lang="ts">
import { defineComponent, reactive, toRefs, ref } from 'vue'
import { App } from '@/service/platform'
import SubDialog from '@/components/subDialog.vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
export default defineComponent({
  name: 'login',
  components: {
    SubDialog
  },
  setup() {
    const router = useRouter()
    const form = reactive({
      name: '',
      nameEn: '',
      status: 1
    })
    const imageUrl = ref('')
    const onSubmit = async () => {
      const data = await App.addZappT(form)
      if (data.code === 200) {
        router.push({ name: 'appTpyeList' })
      }
      console.log(data)
    }
    function httpRequestApp(data: any) {
      imageUrl.value = URL.createObjectURL(data.file)
    }
    const refForm = toRefs(form)
    const showDialog = ref(false)
    const clickbtn = () => {
      // router.push('/appTpyeList')
      // ElMessage({
      //
      //   message: '开发中， 敬请期待',
      //   type: 'warning'
      // })
    }
    return {
      ...refForm,
      imageUrl,
      httpRequestApp,
      onSubmit,
      showDialog,
      showDialog1: ref(false),
      clickbtn
    }
  }
})
</script>
<style lang="scss">
.addtype {
  padding-top: 50px;
  max-width: 600px;
  width: 70%;
  margin: 0 auto;
  .btn-large {
    margin-top: 30px;
    padding: 10px 60px;
    font-size: 16px;
  }
}
.el-upload-list {
  display: none;
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
    background-color: #f4f5f5;
    border-radius: 6px;
    &:first-child {
      margin-right: 80px;
    }
    .handle-bar {
      background-color: #fff;
    }
  }
  .upload-img svg {
    width: 50px;
    height: 50px;
    color: #ccc;
    line-height: 100px;
  }
  .appImg {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
  .appImg {
    width: 80px;
    height: 80px;
  }
}
</style>
