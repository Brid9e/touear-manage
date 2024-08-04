<template lang="pug">
#ThemeInfoDialog
  el-dialog(v-model='showDialog' :width='1000', @closed='closed' )
    .box
      .left.main-box-shadow
        .theme-log
          el-image(:src='`${configs.base}/minio/theme/${infoData.themeInfo.id}/preview/head.png`')
            template(#error)
              .head-icon
                el-icon(size="3.2rem")
                  Picture
        .theme-name {{ infoData.themeInfo.themeName }}
        .theme-rename {{ infoData.themeInfo.info }}
        .theme-plan
          el-progress(v-if='infoData.nowSchedule', type='circle', :percentage='100 - getDays(infoData.nowSchedule.startTime, infoData.nowSchedule.endTime).percent' :indeterminate="true" color="var(--main-primary)")
            span {{ getDays(infoData.nowSchedule.startTime, infoData.nowSchedule.endTime).msg }}
      .right
        .right-top
          el-carousel( :interval='4000', type='card', height='250px', indicator-position='none')
            el-carousel-item(v-for='(item, index) in infoData.imgList', :key='item', @click="showImageViewer(infoData.imgList, index)")
              el-image(:src='item')
        .right-bottom.main-box-shadow
          el-form(label-width='100px')
            //- el-form-item(label='主题类型')
              el-select(v-model="themeTypeCode" )
                el-option(v-for="item in themeTypeList" :key="item.code" :label="item.label" :value="item.code")
            el-form-item(v-if="themeTypeCode !== 1" label='时间期限')
              el-date-picker(:disabled="!state.funcButton?.themeSetting", :clearable='true', range-separator='至', v-model='addPlan.themeTime', type='datetimerange', start-placeholder='开始日期', end-placeholder='结束日期')
                //- el-button(type='text', @click='') 删除
            el-form-item(label='当前计划', v-if='infoData.defaultTheme == false && infoData?.themeScheduleInfoEntities?.length > 0')
              el-tag(size="large", v-for='items in infoData.themeScheduleInfoEntities', :key='items.themeId')
                .info
                  span {{ items.startTime }} —— {{ items.endTime }}
                  el-button(v-if="state.funcButton?.themeSetting", type="primary", size="small", style="margin-left:0.5rem;", @click="deleteThemeSetting(infoData, items)") 删除计划
            el-form-item(label='Minio编号')
              .copy-id-box(@click='copyClick(infoData.themeInfo.id)')
                .input-themeid
                  span {{ infoData.themeInfo.id }}
                  .copy-icon
                    el-icon.icon
                      CopyDocument
                    span.icon {{ !copied? '复制' : '已复制' }}
              //- i.el-icon-copy-document
              //- span {{getDays(items.startTime, items.endTime).percent}}
              //- .bar(:style='`width:${getDays(items.startTime, items.endTime).percent}%;`')
              //- pre {{ infoData }}
          el-button(v-if="themeTypeCode !== 1" type='primary', @click='addNewPlan(infoData)', style="position:absolute;bottom:20px;right:20px;" :disabled="!state.funcButton?.themeSetting") 保存
    //- template(#footer)
      el-button(type='primary', style='margin-left: 10px', @click='addNewPlan(infoData)') 保存
  el-image-viewer(v-if="showImage" :url-list="imageList" @close="showImage = false" :hide-on-click-modal="true" :initial-index="index")
</template>
<script lang="ts">
import { defineComponent, getCurrentInstance, ref, watch, reactive, onMounted, InjectionKey } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { dateFormat } from '@/assets/scripts/date'
import { Theme } from '@/service/platform/index'
import _ from 'lodash'
import { CopyDocument, Picture } from '@element-plus/icons-vue'
import { key } from '@/store'
import { useStore } from 'vuex'
import { useClipboard } from '@vueuse/core'


export default defineComponent({
  props: {
    modelValue: Boolean,
    infoData: {
      type: Object,
      default: null
    },
    data: Object,
    type: String
  },
  components: {
    CopyDocument,
    Picture
  },
  setup(prop, context) {
    //
    const store = useStore(key)
    const { state } = store
    const instance: any = getCurrentInstance()
    const configs = instance.appContext.config.globalProperties.$configs
    const showDialog = ref(false)
    const addPlan: any = reactive({})
    const imageList = ref([])
    const showImage = ref(false)
    const index = ref(0)
    const themeTypeCode: any = ref(2)
    const source: any = ref('')
    const { text, copy, copied, isSupported } = useClipboard({ source })

    const themeTypeList: any = reactive([
      {
        code: 1,
        label: '默认主题'
      },
      {
        code: 2,
        label: '普通主题'
      }
    ])
    const closed = () => {
      showDialog.value = false
      addPlan.themeTime = []
      context.emit('closed', false)
    }
    onMounted(() => {
      //
      addPlan.themeTime = []
    })
    watch(
      () => prop.modelValue,
      (newValue, oldValue) => {
        if (newValue) {
          showDialog.value = true
        }
      }
    )
    watch(
      () => prop.infoData,
      (r: any) => {
        if (r.defaultTheme === true) {
          themeTypeCode.value = 1
        } else {
          themeTypeCode.value = 2
        }
      }
    )

    const showImageViewer = (imgList: any, _index: number) => {
      showImage.value = true
      index.value = _index
      imageList.value = imgList
      //
    }
    const getDays = (strDateStart: any, strDateEnd: any) => {
      //
      const startTime = new Date(strDateStart.replace(/-/g, '/'))
      const endTime = new Date(strDateEnd.replace(/-/g, '/'))
      const now = dateFormat('YYYY-MM-DD HH-MM-SS', new Date())
      const nowTime = new Date(now.replace(/-/g, '/'))
      const dateDiff = endTime.getTime() - startTime.getTime()
      const gone = nowTime.getTime() - startTime.getTime()
      const going = dateDiff - gone
      const dayDiff = Math.floor(dateDiff / (24 * 3600 * 1000))
      const goneDay = Math.floor(gone / (24 * 3600 * 1000))
      const after = dayDiff - goneDay
      const percent = (goneDay / dayDiff) * 100
      const leave1 = dateDiff % (24 * 3600 * 1000)
      const hours = Math.floor(leave1 / (3600 * 1000))
      const leave2 = leave1 % (3600 * 1000)
      const minutes = Math.floor(leave2 * (60 * 1000))
      const leave3 = leave2 % (60 * 1000)
      const seconds = Math.round(leave3 / 1000)
      const obj = {
        day: dayDiff,
        percent: gone <= 0 ? 0 : percent,
        after: gone <= 0 ? dayDiff : after,
        msg: gone <= 0 ? '未开始' : `剩余${after}天`
      }
      return obj
    }
    const addNewPlan = async (item: any) => {
      if (themeTypeCode.value == 2 && (!addPlan.themeTime || addPlan.themeTime.length < 1)) {
        ElMessage.warning('时间期限不能为空')
        return
      }
      const params: any = {
        themeId: item.themeInfo.id,
        themePriority: themeTypeCode.value
      }
      if (themeTypeCode.value == 1) {
        params.startTime = '2001-01-01 00:00:00'
        params.endTime = '2100-01-01 00:00:00'
      }
      // 2100-04-30 00:00:00
      if (themeTypeCode.value == 2) {
        params.startTime = dateFormat('YYYY-MM-DD HH-MM-SS', addPlan.themeTime[0])
        params.endTime = dateFormat('YYYY-MM-DD HH-MM-SS', addPlan.themeTime[1])
      }
      const { data: res, code, msg }: any = await Theme.addNewPlan(params, 'messageBox')
      if (code === 200) {
        context.emit('updateThemeScheduleList', { data: prop.data, type: prop.type })
        // getThemeScheduleList()
        getCurrentTheme(prop.type)
        showDialog.value = false
        ElMessage.success(msg)
      }
    }
    const deleteThemeSetting = (item: any, schedule: any) => {
      // const index = item.themeScheduleInfoEntities.indexOf((r: any) => schedule.id === r.id)
      // msg('提示', '确认要删除该主题计划吗?', true, , schedule, )
      ElMessageBox.confirm('确认要删除该主题计划吗', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          const params = {
            // /berserker-base/theme/deleteSchedule
            platType: item.themeInfo.platType,
            scheduleId: schedule.id
          }
          const { code, msg } = await Theme.deleteThemeSetting(params, 'messageBox')
          if (code === 200) {
            await getCurrentTheme(item.themeInfo.platType)
            _.pullAllWith(item.themeScheduleInfoEntities, [schedule], _.isEqual)
            context.emit('updateThemeScheduleList', { type: item.themeInfo.platType })
            ElMessage.success(msg)
          }
        })
        .catch(() => {

        })

    }

    // 无需使用
    const getCurrentTheme = async (platType: any) => {
      const params = {
        platType: platType
      }
      await Theme.getCurrentTheme(params)
    }

    const copyClick = (id: { id: string | number }) => {
      source.value = id
      copy(source.value)
    }
    return {
      showDialog,
      closed,
      configs,
      addPlan,
      addNewPlan,
      getDays,
      deleteThemeSetting,
      copyClick,
      themeTypeCode,
      themeTypeList,
      imageList,
      showImage,
      showImageViewer,
      index,
      state,
      copied
    }
  }
})
</script>

<style lang="scss" scoped>
#ThemeInfoDialog {

  // var(--main-color-bg)
  :deep(.el-dialog) {
    background-color: var(--main-color-bg) !important;
  }
}

.icon {
  cursor: pointer;


}

.copy-id-box {
  width: 100%;
  display: flex;
  align-items: center;
  user-select: none;
}

.input-themeid {
  display: flex;
  border: none;
  outline: none;
  align-items: center;

  .copy-icon {
    display: flex;
    align-items: center;
    opacity: 0.7;

    &:hover {
      opacity: 1;
    }
  }

  .el-icon {
    margin-left: 0.5rem;
  }
}

.box {
  width: 100%;
  height: 60vh;
  display: flex;

  .left {
    width: 30%;
    height: 100%;
    border-radius: 10px;
    display: flex;
    align-items: center;
    flex-shrink: 0;
    // box-shadow: 0 0 4px rgba(0, 0, 0, 0.1);
    // box-shadow: 0 2px 4px #dddce636;
    flex-direction: column;
    background-color: white;

    .theme-name {
      margin-top: 20px;
      font-size: 16px;
      width: 200px;
      text-align: center;
    }

    .theme-plan {
      margin-top: 60px;
    }

    .theme-rename {
      margin-top: 15px;
      opacity: 0.5;
      font-size: 13px;
      width: 200px;
      text-align: center;
      line-height: 20px;
    }

    .theme-log {
      margin-top: 40px;
      width: 90px;
      height: 90px;
      background-color: white;
      border-radius: 10px;
      overflow: hidden;
      border: 1px solid var(--el-border-color-light);
      // box-shadow: 0 0 2px #00000017;
      box-sizing: border-box;

      .el-image {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }
  }

  .right {
    width: 100%;
    height: 100%;
    margin-left: 10px;

    .el-carousel {
      height: 250px;

      .el-carousel__item {
        display: flex;
        justify-content: center;
      }
    }

    .right-top {
      min-height: 250px;
      border-radius: 10px;
    }

    .right-bottom {
      height: auto;
      background-color: white;
      // background-color: black;
      border-radius: 10px;
      margin-top: 10px;
      box-sizing: border-box;
      padding: 20px;
      position: relative;
    }
  }
}

.main-box-shadow {
  box-shadow: 0 2px 4px #dddce636;
}

.head-icon {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0.3;
}
</style>
