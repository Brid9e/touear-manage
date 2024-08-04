<!--
 * @Author: your name
 * @Date: 2022-04-18 14:05:45
 * @LastEditTime: 2022-04-24 10:24:20
 * @LastEditors: your name
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: /management/src/apps/platform/views/scheme/details.vue
-->
<template lang="pug">
div
  //- el-page-header.margin-bottom-2x(:content="title" @back="back")
  //- el-divider
  //- el-tabs(type="card")
  //-   el-tab-pane(label="方案信息")
  el-descriptions.details-descriptions(border :column="1" size="large")
    el-descriptions-item(:width="30" label="编号") {{currentScheme.id}}
    el-descriptions-item(label="方案code")  {{currentScheme.schemeCode}}
    el-descriptions-item(label="方案名称")  {{currentScheme.scheduleName}}
    el-descriptions-item(label="用户类型")  {{userTypeList.find(item => item.label === currentScheme.scheduleUserType).name}}
    el-descriptions-item(label="终端类型")  {{currentScheme.scheduleServiceType}}
    el-descriptions-item(label="方案布局")
      el-button(plain, @click='toLayout' type="primary") 查看布局
    el-descriptions-item(label="更新时间")  {{currentScheme.updateTime}}
    el-descriptions-item(label="说明")  {{currentScheme.scheduleDesc}}
    //- el-tab-pane(label="布局设置")
  //-     | ppp
      //- bind-apps(:options="{currentModule, isEdit: false}")
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { key } from '@/store'
export default defineComponent({
  components: {},
  data() {
    return {}
  },
  setup() {
    const router = useRouter()
    const { state }: any = useStore(key)
    const currentScheme = sessionStorage.getItem('currentScheme') || ''
    const data = reactive({
      title: router.currentRoute.value.meta.title,
      currentScheme: JSON.parse(currentScheme),
      userTypeList: state.userTypeList,
      // size: 0,
      // tableData: [],
      // tableLoading: false
      // back: () => {
      //   router.back()
      //   sessionStorage.removeItem('currentScheme')
      //   // console.log(888)
      // }
      toLayout: () => {
        console.log(data.currentScheme)
        let index = state.devHost.scheme
        console.log(index)
        let url = `${index}/manage-scheme/?token_type=${state.token_type}&token=${state.token}&id=${data.currentScheme.id}&scheduleName=${data.currentScheme.scheduleName}&scheduleServiceType=${data.currentScheme.scheduleServiceType}&scheduleUserType=${data.currentScheme.scheduleUserType}&schemeCode=${data.currentScheme.schemeCode}&type=scheme`
        console.log(url)
        window.location.href = url
      }
    })
    // console.log(router.currentRoute.value.meta.title)
    const refData = toRefs(data)
    return {
      // token: computed(() => state.token),
      ...refData
    }
  }
})
</script>
