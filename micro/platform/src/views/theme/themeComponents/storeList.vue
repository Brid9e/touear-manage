<template lang="pug">
el-row#StoreList(:gutter='20')
  el-col(:span="24")
    .tag-group
      el-radio-group(v-model="typeRadio" size="large")
        el-radio(v-for="item in state.platTypeList" :key="item.code" :label="item.code" border) {{ item.name }}
      //- el-tabs(tab-position="left")
        el-tab-pane(v-for="item in typeList" :key="item.code" :label="item.code") {{ item.name }}
  el-col(v-if="dataAll.length < 1" :xs='8', :sm='8', :md='8', :lg='8', :xl='8' v-for="item in 3" :key="item")
    el-skeleton(:rows="2" animated style="height: 270px;border: 1px solid var(--el-border-color-light);padding: 1rem;box-sizing: border-box; border-radius: 4px;")
  el-col(v-if="dataFilter?.length > 0" :xs='8', :sm='8', :md='8', :lg='8', :xl='8', v-for='(item, index) in dataFilter', :key='index + "theme"', element-loading-text='安装中...')
    //- el-image(:ref='"imgPreview" + index', :hide-on-click-modal='true', style='position: absolute; left: -999')
    el-card.card(shadow='hover')
      .themeBox
        .shade(@click='pushImagePreview(item)')
        el-image(v-for="(img, index) in item.imgList" :key="index" :src='img', alt='alt', :preview-src-list='item.imgList')
      .theme-info-box
        .logoBox
          img(:src='`${configs.cloudUrl}/cloud-api/theme/getThemeImage?themeName=${item.alias}&imageName=head.png`', alt='alt')
        .themeInfo
          .title {{ item.name }}
          .subtitle {{ item.info }}
      .button-group-store
        .g-left
          span {{ dayjs(item.createTime).format('YYYY年MM月DD日') }}
        .g-right
          el-button(@click='installTheme(item.alias, index, item.parentPlatType, item)' size="small" type="success", :loading="item.installing", :disabled="!platTypeHasChildren[item.parentPlatType] && item.installed" ) {{!platTypeHasChildren[item.parentPlatType] ? item.installed ? '已安装' : '安装' : '选择终端类型'}}
          //- el-button(v-if='item.installed === true' :disabled="true" size="small" type="success") 已安装
          el-button(@click='dowinload(item.alias)' size="small" type="primary") 下载
      .item-overlay(v-show="showParentTypeInstallList[item.alias]" @click="showParentTypeInstallList[item.alias] = false")
        el-row(:gutter="12")
          el-col(:span="12" v-for="(_item, i) in childrenList[item.alias]" :key="_item.code + item.alias" style="height: 40px;")
            el-button(style="height:100%" type="success" @click.stop='installTheme(item.alias, index, _item.code, {..._item, themeInfo: item}, true)' :loading="childrenInstalling[`${_item.code}_${item.alias}`]" :disabled="item?.childrenInstalled?.[_item.code]" :icon="item?.childrenInstalled?.[_item.code] ? Select : ''") {{ _item.name }}
        //-
  .flex-center
    el-pagination(@size-change='handleSizeChange', @current-change='handleCurrentChange', :current-page='currentPage', :page-sizes='[10, 30, 50, 100]', :page-size='pageSize', layout="total, sizes, prev, pager, next, jumper", background, :total='total')
  .is-empty(v-if="dataAll.length > 0 && dataFilter?.length == 0")
    el-empty(:image-size="200" description="暂无主题")
  el-image-viewer(v-if="showImageViewer" :url-list="imagePreviewList" @close="showImageViewer = false" :hide-on-click-modal="true")

</template>

<script lang="ts">
import { ElMessage } from 'element-plus'
import {
  defineComponent,
  getCurrentInstance,
  reactive,
  ref,
  onMounted,
  watch,
  computed,
} from 'vue'
import { Theme } from '@/service/platform/index'
import { imagePreview } from '@/hooks/subImagePreview'
import { dateFormat } from '@/assets/scripts/date'
import themeUploading from './themeUploading.vue'
import themeInfoDialog from './themeInfoDialog.vue'
import { useStore } from 'vuex'
import { key } from '@/store'
import { isEmpty, map } from 'lodash'
import { Select } from '@element-plus/icons-vue'
import dayjs from 'dayjs'
import { addSyncItem } from '@/assets/scripts/addSyncItem'

export default defineComponent({
  props: ['data', 'dataStore', 'type', 'funList', 'show'],
  emits: ['updateThemeScheduleList', 'getInstallStatus', 'updateTheme'],
  components: {
    themeUploading,
    themeInfoDialog,
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
    const imagePreviewList = ref([])
    const showImageViewer = ref(false)
    const dataAll: any = ref(prop.dataStore)
    const dataFilter: any = ref([])
    const typeList = ref(prop.funList.initPlatType(state.platTypeList))
    const loading: any = ref(true)
    const typeRadio: any = ref(state.platTypeList[0].code)
    const openItemDialog = (item: any) => {
      themeInfoToDialog.value = item
      showDialog.value = true
    }
    const childrenList: any = ref({})
    const showParentTypeInstallList: any = ref({})
    const childrenInstalling: any = ref({})

    const platTypeHasChildren = computed(() => {
      const obj: any = {}
      for (let v of state.platTypeList) {
        obj[v.code] = !isEmpty(v.children)
      }
      return obj
    })

    onMounted(() => {
      if (state.platTypeLevel) {
        const platObj: any = {}
        for (let val of state?.platTypeLevel) {
          platObj[val.code] = val.name
        }
        platTypeList.value = platObj
      }
    })

    watch(prop, (r: any) => {
      dataAll.value = r.dataStore
      if (prop.show) {
        for (let k in showParentTypeInstallList.value)
          showParentTypeInstallList.value[k] = false
        typeRadio.value = state.platTypeList[0].code
      }
      // typeRadio.value = r.type
      // typeRadio.value = state.platTypeList[0].code
    })

    watch(
      dataAll,
      (r: any) => {
        // if (r) dataFilter.value = dataAll.value.filter((r: any) => r.platType === typeRadio.value)
        if (r)
          dataFilter.value = dataAll.value.filter(
            (r: any) => r.parentPlatType === typeRadio.value
          )
      },
      {
        immediate: true,
      }
    )
    watch(
      typeRadio,
      (e: any) => {
        for (let k in showParentTypeInstallList.value)
          showParentTypeInstallList.value[k] = false
        typeRadio.value = e
        // dataFilter.value = dataAll.value.filter((r: any) => r.platType === e)
        dataFilter.value = dataAll.value.filter(
          (r: any) => r.parentPlatType === e
        )
      },
      {
        immediate: true,
      }
    )

    const updateThemeScheduleList = (val: any) => {
      context.emit('updateThemeScheduleList', {
        data: val.data,
        type: val.type,
      })
    }

    const pushImagePreview = (item: any) => {
      console.log(item.imgList)
      showImageViewer.value = true

      imagePreviewList.value = item.imgList
      // return imagePreview({ urlList: [...item.imgList] })
    }
    // /berserker-base/theme/addSchedule 设置主题计划
    const addNewPlan = async (item: any) => {
      if (!addPlan.themeTime) {
        ElMessage.warning('时间期限不能为空')
      }
      const params = {
        themeId: item.themeInfo.id,
        themePriority: 2,
        startTime: dateFormat('YYYY-MM-DD HH-MM-SS', addPlan.themeTime[0]),
        endTime: dateFormat('YYYY-MM-DD HH-MM-SS', addPlan.themeTime[1]),
      }
      const {
        data: res,
        code,
        msg,
      }: any = await Theme.addNewPlan(params, 'messageBox')
      if (code === 200) {
        context.emit('updateThemeScheduleList', {
          data: prop.data,
          type: prop.type,
        })
        // getThemeScheduleList()
        item.showItem = false
        ElMessage.success(msg)
      }
    }
    const installTheme = async (
      themeName: string,
      index: number,
      type: string,
      item: any,
      childInstall: boolean
    ) => {
      console.log(item)
      // for(let k in showParentTypeInstallList.value) showParentTypeInstallList.value[k] = false
      if (!childInstall) {
        const _item = state.platTypeList?.find(
          (r: any) => r.code === item.parentPlatType
        )
        if (!isEmpty(_item?.children)) {
          showParentTypeInstallList.value[themeName] = true
          if (!childrenList.value[themeName]) {
            _item.children.forEach((r: any) => {
              r.installed = r.installing = false
              childrenInstalling.value[`${type}_${themeName}`] = false
            })
            childrenList.value[themeName] = _item.children
          }
          return
        }
      }
      // dataFilter.value[index].installing = true
      // 安装状态
      item.installing = true
      if (childInstall) childrenInstalling.value[`${type}_${themeName}`] = true
      const params = {
        themeName: themeName,
        local: false,
        platType: type,
      }
      const {
        data: res,
        code,
        msg,
      }: any = await Theme.installTheme(params, 'messageBox').catch((err) => {
        ElMessage.error(err.message)
        dataFilter.value[index].installing = false
        item.installing = false
        if (childInstall)
          childrenInstalling.value[`${type}_${themeName}`] = false
      })
      if (childInstall) childrenInstalling.value[`${type}_${themeName}`] = false
      item.installing = false
      store.state.themeLoading[type] = false
      if (code === 200) {
        const themeId = res?.themeInfo?.id
        addSyncItem(
          {
            method: 'get',
            url: '/berserker-base/theme/receiveLocalThemeResult',
            params: {
              themeId,
            },
            key: 'result',
            name: `主题安装：${item?.themeInfo ? item?.themeInfo?.name : item?.name}(${type})`,
            errorKey: 'data.message',
            extra: {
              data: null,
              type: type,
              new: 1,
              store: true
            }
          },
          // (res: any) => {
          //   if (res.success) {
          //     context.emit('updateThemeScheduleList', {
          //       data: null,
          //       type: type,
          //       new: 1,
          //     })
          //   }
          // }
        )
        ElMessage.success('主题已经开始安装，请在右上角同步任务中查看进度')
        // dataFilter.value[index].installing = false
        // dataFilter.value[index].installed = true

        // this.$emit('getInstallStatus')
        // ElMessage.success(msg)
      } else {
      }
    }

    const dowinload = (id: string) => {
      const configs = JSON.parse(localStorage.configsManage)
      window.location.href = `${configs.cloudUrl}/cloud-api/theme/download?themeName=${id}&local=true`
    }

    const closed = () => {
      showDialog.value = false
    }
    return {
      closed,
      prop,
      state,
      configs,
      addPlan,
      typeList,
      showDialog,
      addNewPlan,
      openItemDialog,
      imagePreview,
      typeRadio,
      themeInfoToDialog,
      updateThemeScheduleList,
      dataFilter,
      dowinload,
      installTheme,
      pushImagePreview,
      imagePreviewList,
      showImageViewer,
      platTypeList,
      dataAll,
      childrenList,
      showParentTypeInstallList,
      Select,
      childrenInstalling,
      dayjs,
      platTypeHasChildren,
    }
  },
})
</script>

<style lang="scss" scope>
#StoreList {
  .el-col {
    margin-bottom: 0.625rem;
    display: inline-block;
  }

  .el-card.card {
    flex-shrink: 0;
    position: sticky;
    padding-bottom: 1.25rem;
    overflow: hidden;
    padding: 0;

    .button-group-store {
      display: flex;
      align-items: center;
      justify-content: space-between !important;

      .g-left {
        font-size: 0.8125rem;
        opacity: 0.6;
      }

      .plat-type {
        position: absolute;
        left: 10px;
        padding: 3px 5px;
        color: #8a8a8a;
      }

      .el-button {
        min-height: 20px !important;
        padding: 5px 10px;
      }

      margin-top: 10px;
      padding: 8px 10px;
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

  .themeBox {
    height: 160px;
    overflow: hidden;
    display: flex;
    box-sizing: border-box;
    transition: 0.3s ease;
    position: relative;

    img {
      object-fit: cover;
    }

    .el-image {
      width: 100%;
      height: 100%;

      &::after {
        content: '';
        pointer-events: none;
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        z-index: inherit;
      }
    }
  }

  .logoBox {
    margin-top: 20px;
    border: 1px solid var(--el-border-color-light);
    flex-shrink: 0;
  }

  .logoBox {
    width: 44px;
    height: 44px;
    border-radius: 6px;
    overflow: hidden;
    transition: 0.3s ease 0.1s;
    box-sizing: border-box;
    flex-shrink: 0;

    img {
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

  .themeInfo {
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
        background-color: var(--main-primary);
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
  }

  .shade {
    width: 100%;
    height: 100%;
    position: absolute;
    z-index: 1;
    cursor: pointer;
  }

  .tag-group {
    .el-radio {
      margin-right: 10px;
    }
  }

  .is-empty {
    width: 100%;
  }

  .el-collapse-item__header {
    display: none;
  }

  .el-collapse-item__content {
    padding: 8px 10px;
  }
}

.item-overlay {
  width: 100%;
  height: 100%;
  position: absolute;
  background-color: var(--el-overlay-color-lighter);
  top: 0;
  left: 0;
  z-index: 999;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  padding: 1rem;
  box-sizing: border-box;

  .el-button {
    width: 100%;
  }
}
</style>
