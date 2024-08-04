<!--
 * @LastEditTime: 2023-02-13 11:13:52

-->
<template lang="pug">
#systemSetting
//-   el-form(:model="sysImgForm", label-width="120px")
    el-form-item(label="LOGO", prop="logoImg")
      el-upload.avatar-uploader.logo(ref="logoImgRef", action="#", :show-file-list="false", :limit="1", :disabled="logoUploadBoolean", :before-upload="logoBeforeUpload", :on-exceed="logoHandleExceed", :on-change="logoChange", :http-request="logoHttpRequest")
        el-image.avatar(v-if="logoImage.imgSrc", :src="logoImage.imgSrc" fit="cover")
          template(#error)
            .image-slot
              el-icon(:size="20")
                Picture
          template(#placeholder)
            .image-slot Loading...
        el-icon.avatar-uploader-icon(v-else="", @click="addLogo()")
          Plus
          span 点击上传
        //- // 页面新增删除和预览
        span.el-upload-list__item-actions(v-if="logoImage.imgSrc")
          span.upload-icon
            span.el-uploads-span(style="margin-right: 10px")
              el-button(size="mini", plain, circle, :icon="Search", @click="logoPreview()")
            span.el-uploads-span(style="margin-right: 10px")
              el-button(size="mini", plain, circle, :icon="Edit", type="primary", @click="addLogo()")
            //- span.el-upload-span()
            //-   el-button(size='mini',plain,circle,icon="el-icon-delete",type='danger' @click='removeLogo()')
      //- .el-upload__tip Logo图片要求：上传的图片必须是JPG、JPEG、PNG,格式! 图片大小不能超过500k!
      el-alert(title="上传图片支持 JPG / JPEG / PNG / SVG 格式，且图片大小不超过 1M，建议图片尺寸为 250*150", type="info", show-icon, :closable="false")
    el-form-item(label="背景图片", prop="bgImg")
      el-upload.avatar-uploader.backg(ref="bgImgRef", action="#", :show-file-list="false", :limit="1", :disabled="bgUploadBoolean", :before-upload="bgBeforeUpload", :on-exceed="bgHandleExceed", :on-change="bgChange", :http-request="bgHttpRequest")
        el-image.avatar(v-if="bgImage.imgSrc", :src="bgImage.imgSrc")
          template(#error)
            .image-slot
              el-icon(:size="20")
                Picture
          template(#placeholder)
            .image-slot Loading...
        el-icon.avatar-uploader-icon(v-else="", @click="addBg()")
          Plus
          span 点击上传
        //- // 页面新增删除和预览
        span.el-upload-list__item-actions(v-if="bgImage.imgSrc")
          span.upload-icon
            span.el-uploads-span(style="margin-right: 10px")
              el-button(size="mini", plain, circle,  :icon="Search", @click="bgPreview()")
            span.el-uploads-span(style="margin-right: 10px")
              el-button(size="mini", plain, circle,  :icon="Edit", type="primary", @click="addBg()")
            //- span.el-upload-span()
            //-   el-button(size='mini',plain,circle,icon="el-icon-delete",type='danger' @click='removeBg()')
      el-alert(title="上传图片支持 JPG / JPEG / PNG  / SVG / GIF 格式，且图片大小不超过 2M，建议图片尺寸为 1920*900", type="info", show-icon, :closable="false")
    el-form-item
      el-button(type="primary", @click="onSubmit") 确定
  el-dialog(title="图片预览",v-model="dialogVisible", :width="800")
    img(w-full="", :src="dialogImageUrl", alt="Preview Image")
</template>
<script lang="ts">
import { defineComponent, ref, onMounted, reactive, toRaw, toRefs, getCurrentInstance } from "vue"
// import { useRouter } from 'vue-router'
import { system } from "@/service/manage/index"
import { ElMessage, ElMessageBox } from "element-plus"
import { Search, Edit, Picture, Plus } from "@element-plus/icons-vue"
// import { IMsgBoxOptions, msgbox } from '@/hooks/subMessageBox'
import { useStore } from "vuex"
import { key } from "@/store"
// import subDialog from "@/components/subDialog.vue";

export default defineComponent({
    components: {
        Picture,
        Plus,
    },
    setup() {
        onMounted(() => {
            getImgUrl()
        })

        const store = useStore(key)
        const { state } = store
        // const router = useRouter()
        const instance = getCurrentInstance() as any
        const frontConfig = store.state.frontConfig
        // const minoUrl = instance.appContext.config.globalProperties.$configs.base + '/minio'
        const loading = ref(false)
        const logoImgRef = ref()
        const bgImgRef = ref()
        const logoUploadBoolean = ref(true)
        const bgUploadBoolean = ref(true)
        const dialogVisible = ref(false)
        const dialogImageUrl: any = ref("")
        const logoType: any = ref()
        const bgType: any = ref()
        const imageName: any = ref("")
        const logoImage: any = reactive({
            imgSrc: null,
            file: "",
            change: "",
        })
        const bgImage: any = reactive({
            imgSrc: null,
            file: "",
            change: "",
        })

        //获取背景图片
        const getImgUrl = () => {
            logoImage.imgSrc = frontConfig.publicResource + "public/login/logo-management.png" + "?timestamp=" + new Date().getTime()
            bgImage.imgSrc = frontConfig.publicResource + "public/login/background-management.png" + "?timestamp=" + new Date().getTime()
            console.log("背景", bgImage.imgSrc, "图标", logoImage.imgSrc)
        }
        //限制用户上传文件的格式和大小
        const logoBeforeUpload = (file: any) => {
            const type = ["image/jpeg", "image/jpg", "image/png", "image/svg"]
            if (type.indexOf(file.type) === -1) {
                ElMessage.error("上传的文件必须是JPG / JPEG / PNG / SVG 格式!")
                return false
            } else if (file.size / 1024 / 1024 > 1) {
                ElMessage.error("图片大小不能超过1MB!")
                return false
            }
            return true
        }
        const bgBeforeUpload = (file: any) => {
            const type = ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/svg"]
            if (type.indexOf(file.type) === -1) {
                ElMessage.error("上传的文件必须是JPG / JPEG / PNG / SVG / GIF格式!")
                return false
            } else if (file.size / 1024 / 1024 > 2) {
                ElMessage.error("图片大小不能超过2MB!")
                return false
            }
            return true
        }

        const logoPreview = () => {
            dialogVisible.value = true
            imageName.value = "logoImg"
            logoUploadBoolean.value = true
            handlePicturePreview()
        }
        const bgPreview = () => {
            dialogVisible.value = true
            imageName.value = "bgImg"
            bgUploadBoolean.value = true
            handlePicturePreview()
        }
        // 图片放大
        const handlePicturePreview = () => {
            // console.log('放大------')
            dialogVisible.value = true
            setTimeout(() => {
                if (imageName.value === "logoImg") {
                    dialogImageUrl.value = logoImage.imgSrc
                }
                if (imageName.value === "bgImg") {
                    dialogImageUrl.value = bgImage.imgSrc
                }
            }, 20)
        }

        // logo处理
        const addLogo = () => {
            logoUploadBoolean.value = false
        }
        const logoHttpRequest = (val: any) => {
            logoImage.imgSrc = window.URL.createObjectURL(new Blob([val.file]))
            logoImage.file = val.file
            // console.log('logoHttpRequest', val.file)
        }
        const logoHandleExceed = (val: any) => {
            logoImgRef.value!.clearFiles()
            const file: any = val[0]
            // file.uid = genFileId()
            logoImgRef.value!.handleStart(file)
            logoImage.imgSrc = window.URL.createObjectURL(new Blob([file]))
            logoImage.file = file
            // console.log('cauochu-------', val, file, logoImgRef.value)
        }
        const logoChange = () => {
            logoImage.change = "true"
            // console.log('shangcl -----', logoImage.change)
        }
        const logoSubmit = async () => {
            const formData = new FormData()
            formData.append("bucketName", "public")
            formData.append("file", logoImage.file)
            formData.append("path", `/login/logo-management.png`)
            const { data: res, msg, code }: any = await system.uploadFileByPath(formData)
            if (code === 200) {
                ElMessage.success("logo图片上传成功")
                logoImage.imgSrc = res + "?timestamp=" + new Date().getTime()
                console.log("logo添加成功--", res)
            } else {
                ElMessage.error(msg)
            }
        }
        // 背景图处理
        const addBg = () => {
            bgUploadBoolean.value = false
        }
        const bgHttpRequest = (val: any) => {
            bgImage.imgSrc = window.URL.createObjectURL(new Blob([val.file]))
            bgImage.file = val.file
            // console.log('logoHttpRequest', val.file)
        }
        const bgHandleExceed = (val: any) => {
            bgImgRef.value!.clearFiles()
            const file: any = val[0]
            // file.uid = genFileId()
            bgImgRef.value!.handleStart(file)
            bgImage.imgSrc = window.URL.createObjectURL(new Blob([file]))
            bgImage.file = file
            // console.log('cauochu-------', val, file, bgImgRef.value)
        }
        const bgChange = () => {
            bgImage.change = "true"
        }
        const bgSubmit = async () => {
            const formData = new FormData()
            formData.append("bucketName", "public")
            formData.append("file", bgImage.file)
            formData.append("path", `/login/background-management.png`)
            const { data: res, msg, code }: any = await system.uploadFileByPath(formData)
            if (code === 200) {
                ElMessage.success("背景图片上传成功")
                bgImage.imgSrc = res + "?timestamp=" + new Date().getTime()
                console.log("背景添加成功--", res)
            } else {
                ElMessage.error(msg)
            }
        }

        //提交表单
        const onSubmit = () => {
            if (logoImage.change === "true") {
                logoSubmit()
            }
            if (bgImage.change === "true") {
                bgSubmit()
            }
            // console.log('提交----', logoImgRef.value, bgImgRef.value)
        }

        return {
            loading,
            logoImgRef,
            bgImgRef,
            logoUploadBoolean,
            logoBeforeUpload,
            logoHandleExceed,
            logoPreview,
            logoHttpRequest,
            addLogo,
            bgUploadBoolean,
            bgHandleExceed,
            bgBeforeUpload,
            bgHttpRequest,
            addBg,
            handlePicturePreview,
            dialogVisible,
            dialogImageUrl,
            onSubmit,
            imageName,
            bgPreview,
            logoImage,
            bgImage,
            logoSubmit,
            bgSubmit,
            logoChange,
            bgChange,
            Picture,
            Search,
            Edit,
        }
    },
    methods: {
        //
    },
})
</script>
<style lang="scss" scoped>
#systemSetting {
    position: relative;
    .el-upload-action {
        position: absolute;
        top: 0;
        left: 0;
        display: block;
        width: 100%;
        height: 100%;
        font-size: 0;
        color: #fff;
        text-align: center;
        line-height: 120px;
        .el-button--mini.is-circle {
            padding: 8px;
        }
    }
    .el-upload-action:hover {
        font-size: 0;
        background-color: #000;
        background-color: rgba(0, 0, 0, 0.3);
    }
    // :v-deep .el-dialog .hide .el-upload--picture-card {
    //   //因为是dialog里的upload
    //   display: none;
    // }
    .avatar-uploader .el-upload {
        border: 1px dashed #d9d9d9;
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
        display: block;
    }
    .el-upload-list__item-actions:hover span {
        display: inline-block;
    }
    .el-icon-zoom-in:before {
        content: "\E626";
    }
    .el-icon-delete:before {
        content: "\E612";
    }
    .el-upload-list__item-actions:hover {
        opacity: 1;
    }
    .upload-icon {
        .el-button:hover {
            transform: scale(1.3);
        }
    }
    .el-upload-list__item-actions {
        position: absolute;
        width: 100%;
        height: 100%;
        left: 0;
        top: 0;
        cursor: default;
        text-align: center;
        color: #fff;
        opacity: 0;
        font-size: 20px;
        background-color: rgba(0, 0, 0, 0.5);
        transition: opacity 0.3s;
    }
    .avatar-uploader .el-upload:hover {
        border-color: var(--main-primary);
    }
    // .avatar-uploader-icon {
    //   display: block;
    //   font-size: 28px;
    //   color: #8c939d;
    //   width: 150px;
    //   height: 150px;
    //   line-height: 150px;
    //   text-align: center;
    //   border: 1px dashed #dfe2e8;
    //   border-radius: 4px;
    //   span {
    //     font-size: 14px;
    //     display: block;
    //     line-height: 0;
    //     margin-top: -40px;
    //   }
    // }
    .avatar-uploader-icon {
        font-size: 28px;
        color: #8c939d;
        width: auto;
        height: 150px;
        line-height: 150px;
        text-align: center;
        display: block;

        span {
            font-size: 14px;
            display: block;
            line-height: 0;
            margin-top: -40px;
            font-style: normal;
            font-weight: 500;
        }
    }
    :deep(.el-upload--text) {
        display: block;
    }
    .avatar {
        width: 150px;
        /*height: 150px;*/
        display: block;
        margin: auto;
        border-radius: 4px;
    }
    .upload-icon {
        position: absolute;
        top: 50%;
        margin-left: -53px;
        margin-top: -18px;
        .el-button--mini.is-circle {
            padding: 8px;
        }
    }
    .dialogBox .el-dialog {
        top: 30% !important;
        width: 30%;
    }
    .image-slot {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
        height: 100px;
        background: #f5f7fa;
        color: var(--el-text-color-secondary);
        font-size: 14px;
        .el-icon-picture {
            font-size: 30px;
            color: #c4c7cd;
        }
    }
    // .el-alert--info.is-light {
    //   background-color: #ecf5ff;
    //   border-color: #c6e2ff;
    //   margin-bottom: 18px;
    //   :deep(.el-alert__icon) {
    //     color: var(--main-primary);
    //   }
    // }
    // .el-upload__tip {
    //   color: #f56c6c;
    // }
    .el-alert--info.is-light {
        margin-top: 10px;
        line-height: 100%;
    }
    .logo {
        width: 200px;
        height: 80px;
        .avatar {
            width: 200px;
            height: 80px;
            :deep(.el-image__inner) {
                width: auto !important;
                display: block;
                text-align: left;
            }
            .image-slot {
                height: 80px;
            }
        }
        .el-upload-list__item-actions {
            width: 200px;
            height: 80px;
        }
        .avatar-uploader-icon {
            width: 200px;
            height: 80px;
            line-height: 60px;
            span {
                margin-top: 0px;
            }
        }
    }
    .backg {
        width: 350px;
        height: 200px;
        .avatar {
            width: 350px;
            height: 200px;
            .image-slot {
                height: 200px;
            }
        }
        .el-upload-list__item-actions {
            width: 350px;
            height: 200px;
        }
        .avatar-uploader-icon {
            width: 350px;
            height: 200px;
            line-height: 180px;
            span {
                margin-top: -50px;
            }
        }
    }
}
</style>
