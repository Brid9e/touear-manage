<!--
 * @Author       : your name
 * @Date         : 2021-10-11 16:02:53
 * @LastEditTime : 2022-08-30 17:46:51
 * @LastEditors  : Joe
 * @FilePath     : /management/src/apps/platform/views/theme/themeComponents/themeStore.vue
-->
<template lang="pug">
#ThemeStore
  store-list(:dataStore="JSON.parse(JSON.stringify(data))", :options="options" :type="type" @getInstallStatus="getPcTheme" @updateThemeScheduleList="update" :funList="funList" :show="show")
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import storeList from './storeList.vue'
import { ElMessage } from 'element-plus'
import { Theme } from '@/service/platform/index'
import { Cloud } from '@/service/cloud'
import { cloneDeep, isEmpty } from 'lodash'

export default defineComponent({
  props: {
    type: { type: String, default: '' },
    funList: {
      type: Object,
      default: null
    },
    show: {
      type: Boolean,
      default: false
    }
  },
  name: 'themeStore',
  components: {
    storeList
  },
  data() {
    return {
      // installing: false
      data: [],
      themeAllList: [],
      options: {
        type: 'store'
      }
    }
  },
  mounted() {
    // this.getPcTheme()
  },
  watch: {
    // data() {
    // }
  },
  methods: {
    async getPcTheme() {
      await this.getAllTheme()
      // /berserker-base/theme/info
      const params = {
        type: 'parentPlatTypeIsNotBlank'
      }
      const { data, status }: any = await Cloud.getStoreTheme(params)
      // const { data, status }: any = await Theme.getPcStoreTheme()
      if (status === 200) {
        ; (this as any).$store.state.themeLoading.store = true
        const themeAllList: any = cloneDeep(this.themeAllList)
        for (const item of data) { // 处理安装状态
          item.installed = false
          item.installing = false
          const imgList = []
          const configs = JSON.parse(localStorage.configsManage)
          for (let i = 1; i < 4; i++) {
            // https://ecampus.xzxpay.com.cn/cloud-api/theme/getThemeImage?themeName=${item.alias}&imageName=${i}.png
            imgList.push(`${configs.cloudUrl}/cloud-api/theme/getThemeImage?themeName=${item.alias}&imageName=${i}.png`)
          }
          item.imgList = imgList
          for (const _item of themeAllList) {
            const a = (this as any).$store.state.platTypeLevel
            const obj: any = {}
            for (let v of a) {
              obj[v.code] = v.parentCode
            }
            const trues = (_item.themeInfo.id.includes('_') && (_item.themeInfo.id.split('_')[0] === item.alias))
            if (trues && obj[_item.themeInfo.id.split('_')[1]]) {
              const pt = _item.themeInfo.id.split('_')[1]
              if (isEmpty(item?.childrenInstalled)) item.childrenInstalled = {}
              pt && (item.childrenInstalled[pt] = true)
            }
            if (trues && !obj[_item.themeInfo.id.split('_')[1]]) {
              // item.alias = _item.themeInfo.id.split('_')[0]
              // console.log(_item, item)
              _item.themeInfo.id = item.alias
            }
            if (_item.themeInfo.id.split('_')[0] === item.alias) item.installed = true
          }
        }
        this.data = data
      }

      // this.data = data
    },
    async getAllTheme() {
      const { data: res, code, msg }: any = await Theme.getTheme()
      if (code === 200) {
        this.themeAllList = res
      } else {
        // return false
        ElMessage.error(msg)
      }
    },
    update(val: any) {
      this.getPcTheme()
      this.updateThemeScheduleList(val)
    }
  },
  setup(props, context) {
    // this.getPcTheme()
    const updateThemeScheduleList = (val: any) => {
      console.log('成功了，theme-store层')
      context.emit('updateThemeScheduleList', val)
    }
    return {
      updateThemeScheduleList
    }
  }
})
</script>

<style lang="scss" scoped>
</style>
