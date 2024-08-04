<template lang="pug">
div
  el-descriptions.details-descriptions(title='', border, :column='1', size='large')
    el-descriptions-item(label='组件名称') {{ currentModule.name }}
    el-descriptions-item(label='英文名称') {{ currentModule.nameEn }}
    el-descriptions-item(label='组件代码') {{ currentModule.comCode }}
    el-descriptions-item(label='组件类型') {{ moduleTypeList?.find((item) => item.id === currentModule.comType).name }}
    el-descriptions-item(label='用户类型') {{ userTypeList?.find((item) => item.label === currentModule.userType).name }}
    el-descriptions-item(label='终端类型', v-if='currentModule.platType') {{ platTypeList?.find((item) => item.code === currentModule.platType).name }}
    el-descriptions-item(v-if='currentModule.comType === 1', label='显示应用最大数量')
      | {{ currentModule.maxNumber }}
      el-button.float-right(type='primary', plain, @click='toBindApps(null)', size='mini') 查看绑定应用
    el-descriptions-item(label='组件图示')
      el-popover(placement='right-end', width='auto', trigger='hover', content='')
        el-image(:src='currentModule.icon')
        template(#reference)
          el-image(style='height: 40px; cursor: pointer', :src='currentModule.icon')
    el-descriptions-item(label='描述') {{ currentModule.description }}
      span.text-gray-6(v-if='!currentModule.description') 暂无描述
    el-descriptions-item(label='添加时间') {{ currentModule.createTime }}
    el-descriptions-item(label='更新时间') {{ currentModule.updateTime }}
</template>

<script lang="ts">
// import bindApps from './modules/bindApps.vue'
import { defineComponent, reactive, toRefs } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { key } from '@/store/index'
export default defineComponent({
  components: {
    // bindApps
  },
  data() {
    return {}
  },
  setup() {
    const route: any = useRoute()
    const router = useRouter()
    const { state } = useStore(key)
    const currentModule = sessionStorage.getItem('currentModule') || ''
    const data = reactive({
      title: router.currentRoute.value.meta.title,
      source: route.query.source === '1', // true->云数据 false ->本地数据
      currentModule: JSON.parse(currentModule),
      userTypeList: state.userTypeList,
      platTypeList: state.platTypeList,
      moduleTypeList: state.moduleTypeList,
      // size: 0,
      // tableData: [],
      // tableLoading: false
      back: () => {
        router.back()
        // console.log(888)
      }
    })
    console.log(route.query.source === '1')
    const refData = toRefs(data)
    return {
      // token: computed(() => state.token),
      ...refData
    }
  }
})
</script>
