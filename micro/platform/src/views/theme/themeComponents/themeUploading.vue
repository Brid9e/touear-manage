<!--
 * @Author: 王栋桥
 * @Date: 2021-08-12 09:19:53
 * @LastEditTime: 2022-05-18 14:06:50
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /management/src/components/theme/themeUploading.vue
-->
<template lang="pug">
#themeUploading
  el-upload.upload-demo(
    ref='uploadThemeFile',
    :action='`${base}/berserker-base/theme/receiveLocalTheme?platType=${type}`',
    accept=".zip",
    :on-success='handleSuccess',
    :on-error="handleError"
    :on-remove='handleRemove',
    :on-change='addFileList',
    :on-progress="handleProgress"
    :headers='headersObj',
    multiple,
    :limit='1',
    :file-list='fileList',
    :auto-upload='false',
    drag
  )

</template>

<script lang="ts">
import { ElMessage } from 'element-plus'
import { defineComponent } from 'vue'
import { mapState } from 'vuex'
import { addSyncItem } from '@/assets/scripts/addSyncItem'

export default defineComponent({
  props: {
    type: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      fileList: [] as any[],
      headersObj: {
        'synjones-auth': (this.$store as any).state.token,
        synAccessSource: 'management',
      },
      uploading: false,
      base: JSON.parse(localStorage.configsManage).base,
    }
  },
  computed: {
    ...mapState(['token']),
  },
  watch: {
    fileList: {
      deep: true,
      handler(list: any) {
        if (list.length > 0) {
          this.$emit('fileList', true)
        } else {
          this.$emit('fileList', null)
        }
      },
    },
  },
  methods: {
    handleRemove() {
      this.fileList = []
      // const index = (this.form as any).fileList.indexOf(file)
      // console.log
    },
    handleProgress(e: any) {
      e.percent = 99
    },
    handleSuccess(data: any) {
      console.log(data)
      ElMessage.success('主题文件正在上传，请在右上角同步任务中查看进度')
      const themeId = data?.data?.themeInfo?.id
      // this.fileList = []
      //   ; (this as any).$refs.uploadThemeFile.clearFiles()
      // data.code === 200 ? ElMessage.success(data.msg) : ElMessage.error(data.msg)
      addSyncItem(
        {
          method: 'get',
          url: '/berserker-base/theme/receiveLocalThemeResult',
          params: {
            themeId,
          },
          key: 'result',
          name: '主题文件上传',
          errorKey: 'data.message',
          extra: {
            data: null,
            type: this.type,
            new: 1,
            store: false
          }
        }
      )
    },
    handleError(data: any) {
      let msg = ''
      try {
        msg = JSON.parse(data.message).message
      } catch {
        msg = 'error'
      }
      ElMessage.error(msg)
      this.uploading = false
      this.$emit('getTheme')
      this.$emit('handleError')
    },
    addFileList(file: any) {
      if (this.fileList?.length > 0) return
      this.fileList.push(file)
    },
    // /berserker-base/theme/receiveLocalTheme 主题上传 platType: pc
    async receiveLocalTheme() {
      if (this.fileList.length === 0) {
        ElMessage.warning('请添加主题文件')
        return
      }
      ; (this as any).$refs.uploadThemeFile.submit()
      this.uploading = true
      // let formData = new FormData()
      // formData.append('file', this.form.fileList[0] as any)
      // const params = {
      //   platType: this.form.platType
      // }
      // const { code, msg }: any = await service.request({
      //   method: 'post',
      //   url: '/berserker-base/theme/receiveLocalTheme?' + qs.stringify(params),
      //   data: formData
      // })
      // if (code === 200) {
      //   ElMessage.success(msg)
      // } else {
      //   ElMessage.error(msg)
      // }
    },
    clearFiles(status?: string) {
      this.fileList = []
      const _this: any = this
      _this.$refs.uploadThemeFile.clearFiles(status)
    },
    // /berserker-base/theme/delete 主题删除 themeId: string
  },
})
</script>

<style lang="scss">
#themeUploading {
  .title {
    margin: 10px 0;
  }

  .el-upload {
    display: block !important;
  }

  .el-upload-dragger {
    width: 100%;
    height: 100%;
    border: none;
    background-color: transparent;
    position: absolute;
    top: 0;
    left: 0;
  }

  .el-progress__text {
    span {
      margin-left: 50px;
    }
  }

  .flexCenter {
    display: flex;
    justify-content: flex-end;
    padding-top: 16px;
  }
}
</style>
