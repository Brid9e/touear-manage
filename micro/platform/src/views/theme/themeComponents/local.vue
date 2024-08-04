<!--
 * @Author: your name
 * @Date: 2022-04-21 18:33:15
 * @LastEditTime: 2022-05-10 14:23:26
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: /management/src/apps/platform/views/theme/themeComponents/local.vue
-->
<template lang="pug">
#local
  theme-list(:data='cloneDeep(datas)', :type='type', @getList='getThemes', @updateThemeScheduleList='update' :isLoading="loading")
</template>
<script lang="ts">
import { defineComponent } from 'vue'
import themeList from './themeList.vue'
import { cloneDeep, isEmpty, differenceWith } from 'lodash'
// import themeSetting from './themeSetting.vue'
import { Theme } from '@/service/platform/index'

export default defineComponent({
  props: {
    type: { type: String, default: '' }
  },
  name: 'local',
  components: {
    themeList
    // themeSetting
  },
  data() {
    return {
      drawer: false,
      direction: 'rtl',
      datas: [],
      schedule: {},
      scheduleThemeName: '',
      loading: false,
      base: JSON.parse(localStorage.configsManage).base,
      isLoading: true
      // settingData: {
      //   id: 501,
      //   themeId: '4b1b994d2feda57a94cfd49fc7f5b89b',
      //   startTime: '2021-08-11 00:00:00',
      //   endTime: '2026-09-30 00:00:00',
      //   themePriority: 2,
      //   themeColorConfig: null,
      //   backgroundImageUrl: null,
      //   updateTime: null,
      //   themeCode: null
      // },
    }
  },
  watch: {
    datas(val, oVal) {
      if (!isEmpty(oVal) && val?.length > oVal?.length) {
        let newUpTheme: any = differenceWith(val, oVal, (a: any, b: any) => a.themeInfo.id === b.themeInfo.id)
        for (let n of newUpTheme) n.isNew = true
      }
    }
  },
  mounted() {
    this.getThemes(this.type, true)
  },
  // watch: {
  //   type(val: any) {
  //     console.log(val)
  //     if (val === 'mobile') {
  //       this.getThemes('app')
  //     } else if (val === 'pc') {
  //       this.getThemes('pc')
  //     } else {
  //       this.getThemes('selfService')
  //     }
  //   }
  // },
  methods: {
    cloneDeep,
    // async updateTheme(type: any) {
    //   console.log('12321')
    //   await this.getThemes(type)
    // },
    async getThemes(type: any, _load: boolean) {
      console.log(type)
      if (_load) {
        this.loading = true
      }
      // /berserker-base/theme/info
      const params: any = { platType: type }
      const { data, code }: any = await Theme.getTheme(params)
      if (code === 200) {
        const data_ = data
        // const data_: any = []
        for (let data of data_) {
          data.deleting = false
          data.showItem = false
          const imgList = []
          for (let i = 1; i < 4; i++) {
            imgList.push(`${this.base}/minio/theme/${data.themeInfo.id}/preview/${i}.png`)
          }
          data.imgList = imgList
        }
        await this.getThemeScheduleList(data_, type)
      }
      this.loading = false
    },

    async getThemeScheduleList(data: any, type?: string) {
      const params = {
        platType: type
      }
      const { data: res, code }: any = await Theme.getThemeScheduleList(params)
      if (code === 200) {
        if (res) {
          for (let val of data) {
            if (val.themeInfo.id === res.themeId) {
              val.nowSchedule = res
            }
          }
        }
        this.datas = data
        // data.nowSchedule = res
        // this.data = data
        // console.log(this.data)
        // if (res && res != null) {
        //   const data = this.data.filter((r: any) => {
        //     // console.log(res)
        //     if (r.themeInfo.id === res.themeId) {
        //       return r
        //     }
        //   })
        //   console.log(this.schedule)
        //   // this.scheduleThemeName = (data[0] as any).themeInfo.themeName
        // }
      }
    },
    update(val: any, type: boolean) {
      this.getThemes(val.type, type)
    }
  }
})
</script>
<style lang="scss" scoped>
#local {
  margin-top: 10px;
}
</style>
