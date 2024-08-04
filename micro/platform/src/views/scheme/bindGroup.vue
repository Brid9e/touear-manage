<template lang="pug">
div
  el-page-header(:icon="ArrowLeft" :content="'绑定群组'" @back="back")
  //- | {{schemeInfo}}
  el-divider
  el-descriptions(title="方案信息" border size="default" :column="3")
    el-descriptions-item(label="方案名称") {{JSON.parse(schemeInfo).scheduleName}}
    el-descriptions-item(label="id") {{JSON.parse(schemeInfo).id}}
    el-descriptions-item(label="终端类型") {{JSON.parse(schemeInfo).scheduleServiceType}}
  .table-content.margin-top-2x()
    el-table(:data="tableData" style="width: 100%; min-height:535px" border  v-loading="loading" size="medium")
      el-table-column(prop="groupId" label="编号" align="center" width="80")
      el-table-column(prop="groupName" label="群组名称")
      el-table-column(prop="groupType" label="群组类型")
      el-table-column(prop="groupStatus" label="状态")
      el-table-column(prop="schedule" :label="JSON.parse(schemeInfo).scheduleServiceType + '方案'")
        template(#default="scope" )
          div(v-if="scope.row.schedule.length > 0")
            el-tag() 方案ID: {{scope.row.schedule[0].scheduleId}}
            span() {{scope.row.schedule[0].scheduleName}}
      //- el-table-column(prop="scheduleUserType" label="用户类型")
      //-   template(#default="scope")
      //-     span {{userTypeList.find(item => item.value === scope.row.scheduleUserType).label}}
      //- el-table-column(prop="scheduleServiceType" label="服务类型")
      //-   template(#default="scope")
      //-     span {{platList.find(item => item.value === scope.row.scheduleServiceType).label}}
      el-table-column(prop="" label="操作" width="200")
        template(#default="scope")
          el-button(size="mini" type="primary" plain @click="bindGroup(scope.row)") {{scope.row.schedule.length > 0 ? '修改方案' : '添加方案'}}
    el-pagination(@size-change='handleSizeChange', @current-change='handleCurrentChange', :current-page='currentPage', :page-sizes='[10, 20, 30, 40]', :page-size='pageSize', layout='total, sizes, prev, pager, next, jumper', :total='total')
</template>

<script lang="ts">
import { defineComponent, onMounted, onUnmounted, reactive, toRefs, getCurrentInstance } from 'vue'
import { Scheme } from '@/service/platform/index'
import { useRouter } from 'vue-router'
export default defineComponent({
  components: {},
  data() {
    return {}
  },
  setup() {
    const router = useRouter()
    const { appContext }: any = getCurrentInstance()
    interface DataProps {
      schemeInfo: any
      tableData: any[]
      currentPage: number
      pageSize: number
      total: number
      loading: boolean
    }
    const data: DataProps = reactive({
      schemeInfo: sessionStorage.getItem('schemeInfo'),
      tableData: [],
      currentPage: 1,
      pageSize: 10,
      total: 0,
      loading: false,
      back: () => {
        router.back()
        // console.log(888)
      },
      bindGroup: (item: any) => {
        console.log('bindGroup', item)
      },
      handleSizeChange: (val: number) => {
        console.log(`每页 ${val} 条`)
        data.pageSize = val
        getPageGroupDetailWithSchedule()
      },
      handleCurrentChange: (val: number) => {
        console.log(`当前页: ${val}`)
        data.currentPage = val
        getPageGroupDetailWithSchedule()
      }
    })
    const getPageGroupDetailWithSchedule = async () => {
      const params: any = {
        current: data.currentPage,
        size: data.pageSize,
        platType: JSON.parse(data.schemeInfo).scheduleServiceType
      }
      data.loading = true
      const { data: res, code, message }: any = await Scheme.getPageGroupDetailWithSchedule(params)
      data.loading = false
      if (code === 200) {
        data.total = res.total
        data.tableData = res.records
        console.log(res)
      } else {
        appContext.config.globalProperties.$message({
          message: message,
          center: true,
          type: 'danger'
        })
      }
    }
    onMounted(() => {
      getPageGroupDetailWithSchedule()
    })
    onUnmounted(() => {
      sessionStorage.removeItem('schemeInfo')
    })
    const refData = toRefs(data)
    return {
      // token: computed(() => state.token),
      ...refData
    }
  }
})
</script>
