<template lang="pug">
el-row#themeList(:gutter='20')
  el-col(v-if="isLoading" :xs='24', :sm='12', :md='12', :lg='8', :xl='6' v-for="item in 6" :key="item")
    el-skeleton(:rows="2" animated style="height: 114px;border: 1px solid var(--el-border-color-light);padding: 1rem;box-sizing: border-box; border-radius: 4px;")
  el-col(v-else-if="data_local?.length <= 0")
    .is-empty
      el-empty(:image-size="200" description="暂无主题")
  el-col(v-else :xs='24', :sm='12', :md='12', :lg='8', :xl='6', v-for='(item, index) in data_local', :key='index + "theme"', v-loading='item.deleting', element-loading-text='删除中...')
    .local-card(@click='openItemDialog(item)', :class='{ isUsing: item.currentTheme ? true : false }')
      .theme-info-box-local
        .logoBox-local
          el-image(:src='`${configs.base}/minio/theme/${item.themeInfo.id}/preview/head.png`', alt='alt')
            template(#error)
              .head-icon
                el-icon
                  Picture
        .themeInfo-local
          .title-box
            .title
              span {{ item.themeInfo.themeName }}
              el-tag(v-if="item.currentTheme" effect="dark" size="small" style="margin-left: 0.5rem") 正在使用
              el-tag(v-if="item.isNew" effect="dark" type="danger" size="small" style="margin-left: 0.5rem" round) 新
            .themeStatus
              //- .showUseing(v-if='item.currentTheme == true') 用
              //- .showDefalut(v-if='item.defaultTheme == true') 默
          .subtitle(v-if='item.themeInfo.info') {{ item.themeInfo.info }}
        //- el-popover(trigger='hover', placement='bottom')
          template(#reference)
            el-icon(v-if='item.defaultTheme == false' style='margin-left: 10px; cursor: pointer')
              MoreFilled
          el-button(text, bg, @click='deleteTheme(index, item.themeInfo.id, item.themeInfo.themeName, item.themeInfo.platType, item)', style="width: 100%;") 删除
          v-if='state.funcButton?.themeRemove && item.defaultTheme == false'
        el-icon( @click.stop='deleteTheme(index, item.themeInfo.id, item.themeInfo.themeName, item.themeInfo.platType, item)'  style='cursor: pointer')
          Delete
      .time-plan-box(v-if='item.defaultTheme == false && item.nowSchedule' :class="{'unstart': getDays(item.nowSchedule.startTime, item.nowSchedule.endTime).unstart}")
        //- span.start-time {{ item.themeScheduleInfoEntities[0].startTime }}
        .time-load-bar
          .time-load(:style='`width:${100 - getDays(item.nowSchedule.startTime, item.nowSchedule.endTime).percent}%;float:left;`')
            //- .load-icon
              span {{ getDays(item.nowSchedule.startTime, item.nowSchedule.endTime).msg }}
              el-icon
                CaretBottom
        el-tooltip(content='Bottom center', placement='bottom', effect="light")
          template(#content)
            p 开始时间：{{ item.nowSchedule.startTime }}
            p 结束时间：{{ item.nowSchedule.endTime }}
            el-button(v-if="state.funcButton?.themeSetting", type="primary" style="width:100%" size="small" @click="deleteThemeSetting(item)") 删除计划
          .load-icon
            span {{ getDays(item.nowSchedule.startTime, item.nowSchedule.endTime).msg }}
            span {{ getDays(item.nowSchedule.startTime, item.nowSchedule.endTime).afterDay }}
            //- el-icon
              CaretBottom
          //- el-icon
            Clock
        //- span.end-time {{ item.themeScheduleInfoEntities[0].endTime }}
      .time-plan-box(v-else)
        span.start-time(v-if="item.defaultTheme == false") 未设置计划
        span.start-time(v-else) 默认主题无需设置计划
  themeInfoDialog(ref="themeInfoDialog", v-model="showDialog" @closed="closed" :infoData="themeInfoToDialog" :data='data', :type='type', @updateThemeScheduleList="updateThemeScheduleList")
</template>

<script lang="ts">
import { ElMessage, ElMessageBox } from 'element-plus'
import { defineComponent, getCurrentInstance, reactive, ref, unref, onMounted, watch } from 'vue'
import { Theme } from '@/service/platform/index'
import { imagePreview } from '@/hooks/subImagePreview'
import { dateFormat } from '@/assets/scripts/date'
import themeUploading from './themeUploading.vue'
import themeInfoDialog from './themeInfoDialog.vue'
import _ from 'lodash'
import { useStore } from 'vuex'
import { key } from '@/store'
import { CaretBottom, InfoFilled, Delete, Clock, Picture } from '@element-plus/icons-vue'

export default defineComponent({
  props: ['data', 'dataStore', 'type', 'isLoading'],
  emits: ['updateThemeScheduleList', 'getInstallStatus', 'updateTheme'],
  components: {
    themeUploading,
    themeInfoDialog,
    CaretBottom,
    InfoFilled,
    Delete,
    Clock,
    Picture
  },
  setup(prop, context) {
    // console.log('getCurrentInstance', getCurrentInstance())

    const store = useStore(key)
    const { state } = store
    const platTypeList: any = ref()
    const instance: any = getCurrentInstance()
    const configs = instance.appContext.config.globalProperties.$configs
    const showDialog = ref(false)
    const addPlan: any = reactive({})
    const themeInfoToDialog: any = ref({})
    const data_local: any = ref([])
    const themeInfoDialog = ref()


    const openItemDialog = (item: any) => {
      item.isNew = false
      themeInfoToDialog.value = item
      showDialog.value = true
    }

    onMounted(() => {
      if (state.platTypeLevel) {
        const platObj: any = {}
        for (let val of state?.platTypeLevel) {
          platObj[val.code] = val.name
        }
        platTypeList.value = platObj
      }
    })

    //监听prop
    watch(prop, (r: any) => {
      data_local.value = moveToFirst(r.data, 'defaultTheme', true)
    })

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
        msg: gone <= 0 ? `${Math.abs(goneDay)}天后开始` : `剩余${after}天`,
        unstart: !!(gone <= 0),
      }
      return obj
    }

    //删除本地主题
    const deleteTheme = (index: number, id: string, name: string, type: string, item: any) => {
      // msg('提示', `确认要删除【${name}】主题吗`, true, index, id, type, item)
      ElMessageBox.confirm(`确认要删除【${name}】主题吗`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        // TODO
        data_local.value[index].deleting = true
        const params = {
          themeId: id
        }
        const { code }: any = await Theme.deleteTheme(params, 'messageBox')
        if (code === 200) {
          ElMessage.success('删除成功')
          const arr = _.pullAllWith(data_local.value, [data_local.value[index], _.isEqual])
          updateThemeScheduleList({ data: prop.data, type: prop.type })
          data_local.value[index].deleting = false
          data_local.value = arr
          store.state.themeLoading.store = false
        }
      }).catch(() => {
        // TODO
      })
    }

    //关闭dialog
    const closed = () => {
      showDialog.value = false
    }
    const updateThemeScheduleList = async (data: any) => {
      context.emit('updateThemeScheduleList', data, false)
    }

    //将数组的某个元素置于数组的最前面
    const moveToFirst = (arr: any, key: string, value: any) => {
      const index = arr.findIndex((item: any) => item[key] === value)
      if (index !== -1) {
        const item = arr.splice(index, 1)
        arr.unshift(item[0])
      }
      return arr
    }

    // 删除计划
    const deleteThemeSetting = (item: any) => {
      themeInfoDialog.value.deleteThemeSetting(item, item.nowSchedule)
    }

    return {
      state,
      closed,
      prop,
      getDays,
      configs,
      addPlan,
      showDialog,
      openItemDialog,
      imagePreview,
      themeInfoToDialog,
      deleteTheme,
      platTypeList,
      data_local,
      updateThemeScheduleList,
      themeInfoDialog,
      deleteThemeSetting
    }
  }
})
</script>

<style lang="scss" scope>
#themeList {
  .loading-light {
    animation: loading 5s linear infinite;
    background: linear-gradient(50deg, #f0eff0, #f0eff0 52%, #f0eff0cb 55%, #f0eff0 58%, #f0eff0);
    background-size: 400% 100%;
  }

  @keyframes loading {
    0% {
      background-position: 400% 50%;
    }

    to {
      background-position: 0% 50%;
    }
  }

  .isUsing {
    border: 1px solid var(--el-color-primary) !important;
    background-color: var(--el-fill-color-light);
    // background: rgba($color: #000000, $alpha: 1.0);
  }

  .el-col {
    margin-bottom: 0.625rem;
    display: inline-block;
    position: relative;
  }

  .local-card,
  .local-card-add {
    border: 1px solid var(--el-border-color-light);
    padding: 1rem;
    border-radius: 4px;
    position: relative;
    transition: 0.3s ease;
    cursor: pointer;
    height: 78px;
    overflow: hidden;

    i {
      width: 16px;
      height: 16px;

      // color: var(--el-color-primary);
      &:hover {
        color: var(--el-color-primary);
      }
    }

    &:hover {
      border: 1px solid var(--el-text-color-placeholder);
    }
  }

  .el-card.card {
    flex-shrink: 0;
    border-radius: 6px !important;
    position: sticky;
    padding-bottom: 1.25rem;
    overflow: hidden;
    // background-color: black;
    padding: 0;

    .button-group {
      display: flex;
      align-items: center;

      .plat-type {
        position: absolute;
        left: 10px;
        padding: 3px 5px;
        color: #8a8a8a;
      }

      margin-top: 10px;
      padding: 10px 10px;
      display: flex;
      justify-content: right;
      background-color: #f7f7f7;
    }

    .el-card__body {
      padding: 0 !important;
    }
  }

  .theme-info-box {
    display: flex;
    padding: 0 20px;
  }

  .theme-info-box-local {
    display: flex;
    position: relative;
  }

  .themeBox {
    height: 160px;
    overflow: hidden;
    display: flex;
    box-sizing: border-box;
    transition: 0.3s ease;
    position: relative;
  }

  .logoBox {
    margin-top: 20px;
    border: 1px solid var(--el-border-color-light);
    flex-shrink: 0;
  }

  .logoBox-local {
    border: 1px solid #ebeef5;
  }

  .logoBox,
  .logoBox-local {
    width: 44px;
    height: 44px;
    border-radius: 6px;
    overflow: hidden;
    transition: 0.3s ease 0.1s;
    box-sizing: border-box;
    flex-shrink: 0;

    .el-image {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  .themeInfo {
    .title {
      width: 50%;
      padding: 20px 0 0 0;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      transition: 0.3s ease-in-out;



      &:hover {
        width: 100%;
        white-space: wrap;
        z-index: 9999;
      }
    }
  }

  .themeInfo-local {
    color: black;
  }

  .themeInfo,
  .themeInfo-local {
    display: flex;
    flex-direction: column;
    margin-left: 10px;
    width: 100%;

    .title {
      font-size: 1rem;
      font-weight: 400;
      width: 100%;
      // background-color: red;
      position: relative;
      display: flex;
      align-items: center;

      .plat-type {
        position: absolute;
        right: 0;
        background-color: var(--el-color-primary);
        padding: 2px 5px;
        border-radius: 4px;
        font-size: 12px;
        display: flex;
        justify-content: center;
        align-items: center;
        user-select: none;
      }
    }

    .subtitle {
      width: 200px;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 1;
      overflow: hidden;
    }

    .subtitle,
    .subtime {
      font-size: 0.75rem;
      filter: opacity(0.4);
      margin-top: 10px;
    }

    .subtime {
      margin-top: 6px;
    }
  }

  .title-box {
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: relative;
  }

  .themeStatus {
    display: flex;
    position: absolute;
    justify-content: flex-end;
    flex-direction: column;
    top: 0;
    right: 0;
    color: white;
  }

  .time-plan-box {
    display: flex;
    align-items: center;
    margin-top: 1rem;

    .start-time,
    .end-time {
      font-size: 12px;
      text-align: center;
      flex-shrink: 0;
      // color: black;
      filter: opacity(0.7);
    }

    .time-load-bar {
      width: 100%;
      height: 5px;
      background-color: #ebeef5;
      margin-right: 10px;
      border-radius: 6px;

      // overflow: hidden;
      .time-load {
        width: 0;
        height: 100%;
        border-radius: 6px;
        background-color: var(--el-color-primary);
        position: relative;
        cursor: pointer;
      }
    }
  }
}

.unstart {
  filter: grayscale(100%);
  -webkit-filter: grayscale(100%);
  opacity: 0.5;
}

.load-icon {
  // position: absolute;
  // // background-color: red;
  // left: -8px;
  // bottom: 2px;
  color: var(--el-color-primary);

  span {
    width: 150px;
    font-size: 13px;
    flex-shrink: 0;
    white-space: nowrap;
    vertical-align: top;
  }

  &:hover {
    color: var(--main-primary-light-1);
  }
}

.image-local {
  .el-image {
    width: 100%;
    height: 100%;
  }
}

.schedule-list {
  width: 400px;
  height: 32px;
  // background-color: red;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  overflow: hidden;

  .el-button {
    color: #f56c6c !important;
    font-weight: 600;
    z-index: 2;
  }

  .el-card__body {
    width: 100%;
    display: flex;
    justify-content: space-between;
  }

  .info {
    z-index: 1;
    display: inline-block;
  }
}

.head-icon {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0.3;
}
</style>
