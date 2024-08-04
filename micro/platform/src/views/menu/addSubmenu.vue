<template lang="pug">
div
  //- | {{ userTypeList }}
  el-tabs(type='card' v-model="activeName"  @tab-change="handleChange")
    el-tab-pane(label='可选择菜单' :name="0")
      el-row.group-input-box(:gutter="10")
        el-col(:xs="8" :sm="8" :md="8" :lg="8" :xl="8")
          el-input.margin-bottom-2x(v-model="search" size="small" placeholder="请输入应用名称搜索")
      el-table(ref='multipleTableRef', height="460" :data="filterTableData" @selection-change="handleSelectionChange" v-loading="allDataLoading" scrollbar-always-on :row-key="getRowKeys" @select="handleSelect")
        el-table-column(type="selection" width="50" align="center" :reserve-selection="true")
        el-table-column(prop="appName" label="应用名称")
        el-table-column(prop="appCode" label="应用代码")
        el-table-column(prop="userType" label="用户类型")
          template(#default="scope")
            span(v-if="scope.row.userType") {{userTypeList.find(item => item.label === scope.row.userType)?.name}}
    el-tab-pane(label='自定义菜单' :name="1")
      CustomForm(v-if="activeName=== 1" ref="customFormRef" @addMenu="customFormAddMenu" :options="customFormOptions")
  //- el-button(@click="clearSelection") 取消8888

</template>

<script lang="ts" setup>
import { ref, onMounted, computed, defineEmits, onActivated, onUnmounted } from 'vue'
import { App, Menu } from '@/service/platform'
import { ElMessage, ElMessageBox } from "element-plus"
import type { TabsPaneContext } from 'element-plus'
import { useStore } from 'vuex'
import { key } from '@/store'
import type { ElTable } from 'element-plus'
import CustomForm from './components/customForm.vue'

// const emit = defineEmits(['addType', 'appList'])
const emit = defineEmits(['addType', 'appList', 'subMenuForm'])
const props = defineProps(['data'])
const { state } = useStore(key)
const { userTypeList } = state
const search: any = ref('')
const allAppData: any = ref([])
const allDataLoading: any = ref(false)
const selectionData: any = ref(false)
const dialogFormVisible: any = ref(false)
const activeName: any = ref(0)
const multipleTableRef = ref<InstanceType<typeof ElTable>>()
const customFormRef: any = ref(null)
const filterTableData = computed(() => allAppData.value.filter((item: any) => !search.value || item.appName.toLowerCase().includes(search.value.toLowerCase())))
// 查询本地已安装应用
const getAppAllList = async () => {
  // let allApp = []
  allDataLoading.value = true
  const { data: list, code, msg }: any = await App.getZappListAll({ platType: 'pc'})
  allDataLoading.value = false
  if (code === 200) {
    list.forEach((element: any) => {
      // console.log(element)
      const index = props.data.boundAppList.findIndex((item: any) => element.bh === item.appId)
      // console.log(index)
      if (index < 0) {
        allAppData.value.push(element)
      }
    })
    // console.log('' , props.data.boundAppList)
    // data.test = [1, 2, 3]
  } else {
    ElMessage({
      // showClose: true,
      message: msg,
      type: 'error'
    })
  }
}
const getRowKeys= (row: any) => {
  // console.log(row)
  return row.appCode // 返回唯一标记值，这里的 id 是唯一的
}
const handleSelect = (selection: any, row: any) =>{
  // selectionData.value = selection
}
const handleSelectionChange = (val: any) => {
  console.log('handleSelectionChange', val)
  selectionData.value = val
  emit('appList', val)
}
const handleChange = (tab: TabsPaneContext, event: Event) => {
  console.log(tab)
  emit('addType', activeName.value)
  // if () {

  // }
  // selectionData.value = []
  // emit('appList', selectionData.value)
}
const clearSelection = () => {
  // 清除勾选
  multipleTableRef.value!.clearSelection()
}
const customFormOptions = ref({
  isButton: false,
  platType: 'pc',
  layout: {
    lg: { span: 16, offset: 3 },
    xl: { span: 16, offset: 3 }
  }
})
const customFormAddMenu = (formData: any) => {
  // alert('customFormAddMenu')
  emit('subMenuForm', formData)
}
// 提交表单
const customFormSubmit = () => {
  customFormRef.value.submitForm()
}
const customFormClear = () => {
  customFormRef.value.resetForm()
}
onMounted(() => {
  // alert(1)
  if (allAppData.value.length === 0) getAppAllList()
  activeName.value = 0
})
onActivated (() => {
  // alert('onActivated')
})
onUnmounted (() => {
  // clearSelection()
  // alert('onUnmounted')
})
defineExpose({
  customFormSubmit,
  customFormClear
})
</script>
<style lang="scss" scoped>
</style>
