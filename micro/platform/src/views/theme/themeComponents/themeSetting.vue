<!--
 * @Author: 王栋桥
 * @Date: 2021-08-13 09:12:42
 * @LastEditTime: 2022-04-08 09:23:01
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /management/src/components/theme/themeSetting.vue
-->
<template lang="pug">
#themeSetting
  el-card(shadow='never')
    span 最近主题计划：
    el-tag(v-if='scheduleList == null')
      span.title 快去添加新的主题计划吧！
    el-tag(closable, @close='deleteThemeSetting', v-if='scheduleList != null')
      span.title {{ themeName }}
      el-divider.cutline(direction='vertical')
      span.time {{ scheduleList.startTime }} ~ {{ scheduleList.endTime }}
    .btn-primary
      el-button.btn(
        icon='el-icon-setting',
        type='primary',
        @click='showDialog = true'
      ) 设置新的主题计划
      el-button(
        icon='el-icon-upload2',
        type='primary',
        @click='showDialogUpload = true'
      ) 上传主题

  el-dialog(v-model='showDialog', title='设置主题计划', :width='600')
    el-form(:model='addPlan', v-loading='loading')
      el-form-item(label='选择主题')
        el-select.block(
          v-model='addPlan.themeId',
          placeholder='请选择主题',
          clearable
        ) 
          el-option(
            v-for='(item, index) in data',
            :key='item.themeInfo.id',
            :value='item.themeInfo.id',
            :label='item.themeInfo.themeName'
          )
      el-form-item(label='时间期限')
        el-date-picker.block(
          :clearable='false',
          range-separator='至',
          v-model='addPlan.themeTime',
          type='datetimerange',
          start-placeholder='开始日期',
          end-placeholder='结束日期'
        )
    template(#footer)
      el-button(@click='showDialog = false') 取消
      el-button(type='primary', @click='judgePlan') 确定
  el-dialog(v-model='showDialogUpload', title='上传主题', :width='600')
    theme-uploading(:type='type', @getTheme='updataTheme')
</template>

<script lang="ts">
import { ElMessage, ElMessageBox } from 'element-plus'
import { defineComponent } from 'vue'
import themeUploading from './themeUploading.vue'
import { dateFormat } from '@/assets/scripts/date'
import { Theme } from '@/service/platform/index'
import { msgbox, IMsgBoxOptions } from '@/hooks/subMessageBox'

export default defineComponent({
  props: {
    data: {
      type: Array,
      default: null
    },
    type: {
      type: String,
      default: ''
    },
    scheduleApp: {
      type: Object,
      default: null
    },
    schedulePc: {
      type: Object,
      default: null
    },
    themeNameApp: {
      type: String,
      default: ''
    },
    themeNamePc: {
      type: String,
      default: ''
    }
  },
  components: {
    themeUploading,
  },
  data() {
    return {
      showDialog: false,
      loading: false,
      showDialogUpload: false,
      scheduleList: {
        id: null
      },
      addPlan: {
        themeId: '',
        themeTime: []
      },
      themeName: ''
    }
  },
  // mounted() {
  //   this.scheduleList = this.scheduleApp
  // },
  watch: {
    scheduleApp(val) {
      this.scheduleList = val
    },
    schedulePc(val) {
      this.scheduleList = val
    },
    themeNameApp(val) {
      this.themeName = val
    },
    themeNamePc(val) {
      this.themeName = val
    },
    addPlan(val) {
      // console.log(val)
    }
  },
  methods: {
    updataTheme() {
      this.$emit('getTheme')
    },
    msg(title: any, message: any, showButton: any, type: any) {
      const opt = {
        title: title,
        message: message,
        showCancelButton: showButton ? showButton : true
      }
      msgbox
        .open(opt)
        .then(async (r) => {
          if (r === 'confirm') {
            if (type === 'judge') {
              this.addNewPlan()
            }
            if (type === 'plan') {
              const params: any = {
                // /berserker-base/theme/deleteSchedule
                platType: this.type,
                scheduleId: this.scheduleList.id
              }
              const { code, msg } = await Theme.deleteThemeSetting(params, 'messageBox')
              if (code === 200) {
                this.$emit('updateThemeScheduleList')
                ElMessage.success(msg)
                let _this: any = this
                _this.scheduleList = null
              }
            }
            //
          }
        })
        .catch(() => {
          return
        })
    },
    judgePlan() {
      if (this.addPlan.themeId !== '' && this.addPlan.themeTime.length > 1) {
        if (this.scheduleList) {
          this.msg('提示', '保存该计划会删除掉已存在的计划, 是否保存?', true, 'judge')
          // ElMessageBox.confirm(
          //   '保存该计划会删除掉已存在的计划, 是否保存?',
          //   '提示',
          //   {
          //     confirmButtonText: '确定',
          //     cancelButtonText: '取消',
          //     type: 'warning'
          //   }
          // )
          //   .then(() => {
          //     this.addNewPlan()
          //   })
          //   .catch(() => {
          //     return
          //   })
        } else {
          this.addNewPlan()
        }
      } else {
        ElMessage.warning('请填写完整')
      }
    },

    // /berserker-base/theme/addSchedule 设置主题计划
    async addNewPlan() {
      this.loading = true
      const params = {
        themeId: this.addPlan.themeId,
        themePriority: 2,
        startTime: dateFormat('YYYY-MM-DD HH-MM-SS', this.addPlan.themeTime[0]),
        endTime: dateFormat('YYYY-MM-DD HH-MM-SS', this.addPlan.themeTime[1])
      }
      const { code, msg } = await Theme.addNewPlan(params, 'messageBox')
      if (code === 200) {
        this.$emit('updateThemeScheduleList')
        this.loading = false
        this.showDialog = false
        ElMessage.success(msg)
      }
    },

    // /berserker-base/theme/normalThemeScheduleList

    deleteThemeSetting() {
      this.msg('提示', '确认要删除该主题计划吗?', true, 'plan')
      // ElMessageBox.confirm(`确认要删除该主题计划吗`, '提示', {
      //   confirmButtonText: '确定',
      //   cancelButtonText: '取消',
      //   type: 'warning'
      // })
      //   .then(async () => {})
      //   // eslint-disable-next-line @typescript-eslint/no-empty-function
      //   .catch(() => {})
    }
  }
})
</script>

<style lang="scss" scope>
#themeSetting {
  .block {
    width: 100%;
  }
  .el-card {
    margin-bottom: 10px;
    border-radius: 6px;
    // background-color: red !important;
    .btn-primary {
      position: absolute;
      right: 20px;
    }
    span {
      font-size: 0.875rem;
      // opacity: 0.8;
    }
    .el-card__body {
      padding: 20px;
      display: flex;
      align-items: center;
    }
    // .cutline {
    //   // height: 2rem;
    // }
    .title,
    .time {
      font-weight: 400;
    }
  }
  .flexCenter {
    display: flex;
    justify-content: flex-end;
    padding-top: 16px;
  }
}
</style>
