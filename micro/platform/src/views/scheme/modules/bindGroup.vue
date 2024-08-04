<template lang="pug">
el-dialog(title="绑定群组" width="1200px")
  el-descriptions(title="当前方案信息" :column="3" border)
    el-descriptions-item(label="ID")
      el-tag {{schemeInfo.id}}
    el-descriptions-item(label="方案名称")
      el-tag {{schemeInfo.scheduleName}}
    el-descriptions-item(label="终端类型")
      el-tag.margin-right-x(v-for="(item, index) in schemeInfo.scheduleServiceType.split(',')" :key="index")
        | {{ platTypeLevel.find((subItem) => subItem.code === item).name }}
  //- el-form(label-width="80px")
    el-form-item(label="ID")
      el-tag {{schemeInfo.id}}
    el-form-item(label="方案名称")
      el-tag {{schemeInfo.scheduleName}}
    el-form-item(label="终端类型")
      el-tag.margin-right-x(v-for="(item, index) in schemeInfo.scheduleServiceType.split(',')" :key="index") {{ item }}
  .table-content.margin-top-2x
    el-table(:data="tableData" border  v-loading="loading" size="medium")
      el-table-column(prop="groupId" label="编号" align="center" width="80")
      el-table-column(prop="groupName" label="群组名称")
      el-table-column(prop="groupType" label="群组类型")
        template(#default='scope')
          span(v-if='scope.row.groupType') {{ groupTypeList?.find((item) => item.value === scope.row.groupType).label }}
      el-table-column(prop="groupStatus" label="状态")
        template(#default='scope')
          //- span {{ typeof scope.row.groupStatus }}
          span(v-if='scope.row.groupStatus') {{ statusList?.find((item) => item.value === scope.row.groupStatus).label }}
      template(v-for="(item, index) in schemeInfo?.scheduleServiceType.split(',')" :key="index")
        el-table-column(prop="schedule", :label="platTypeLevel.find((subItem) => subItem.code === item).name + '方案'" align='center')
          template(#default="scope")
            div(v-if="scope.row.schedule.find(schedule => schedule.groupDetailType === item)")
              //- p {{ scope.row.schedule.find(schedule => schedule.groupDetailType === item).scheduleName }}
              el-tag(type="success" size="large" v-if="schemeInfo?.id === scope.row.schedule.find(schedule => schedule.groupDetailType === item).scheduleId") 当前方案
              template(v-else)
                el-tag.margin-right-x(type="warning" size="large" ) {{ scope.row.schedule.find(schedule => schedule.groupDetailType === item).scheduleName }}
                el-button(:icon='Setting', type='primary' size="mini" link @click="bindGroup(item, scope.row, '1')") 设置当前方案
            div(v-else)
              el-button(:icon='Plus', type='primary' size="mini" link @click="bindGroup(item, scope.row, '0')") 添加当前方案

      //- el-table-column(prop="schedule", :label="schemeInfo?.scheduleServiceType + ' 方案'")
        template(#default="scope")
          div(v-if="scope.row.schedule.length > 0")
            //- el-tag.margin-right-x(v-if="schemeInfo?.id === scope.row.schedule[0].scheduleId") 当前方案
            //- el-tag.margin-right-x(v-else type="warning") 方案ID: {{scope.row.schedule[0].scheduleId}}
            //- el-tag(v-if="schemeInfo?.id === scope.row.schedule[0].scheduleId") {{scope.row.schedule[0].scheduleName}}
            //- el-tag(v-else type="warning") {{scope.row.schedule[0].scheduleName}}
      //- el-table-column(prop="scheduleUserType" label="用户类型")
      //-   template(#default="scope")
      //-     span {{userTypeList.find(item => item.value === scope.row.scheduleUserType).label}}
      //- el-table-column(prop="scheduleServiceType" label="服务类型")
      //-   template(#default="scope")
      //-     span {{platList.find(item => item.value === scope.row.scheduleServiceType).label}}
      //- el-table-column(prop="" label="操作" width="160" center)
        template(#default="scope")
          //- span {{schemeInfo.id}}
          el-button(link v-if="scope.row.schedule.length === 0 " type="primary" @click="bindGroup(scope.row, '0')") 添加为当前方案
          el-button(link v-else-if="schemeInfo?.id !== scope.row.schedule[0].scheduleId " type="warning"  @click="bindGroup(scope.row, '1')")
            span.margin-right-x 设置为当前方案
            //- el-tag {{schemeInfo.scheduleName}}
          //- el-button(v-if="schemeInfo.id !== scope.row.schedule[0].id" size="mini" type="primary" plain @click="bindGroup(scope.row)") {{scope.row.schedule.length > 0 ? '修改方案' : '添加方案'}}
    .flex-center
      el-pagination(@size-change='handleSizeChange', @current-change='handleCurrentChange', :current-page='currentPage', :page-sizes='[10, 20, 30, 40]', :page-size='pageSize', layout='total, sizes, prev, pager, next, jumper', :total='total' background)
</template>

<script lang="ts">
import { defineComponent, computed, onUnmounted, reactive, toRefs, getCurrentInstance, watch } from 'vue'
import { Group } from '@/service/platform'
import { Scheme } from '@/service/platform/index'
import { useRouter } from 'vue-router'
import { ElMessageBox } from 'element-plus'
import { useStore } from 'vuex'
import { key } from '@/store/index'
import { Setting, Plus } from '@element-plus/icons-vue'
export default defineComponent({
  components: {},
  data() {
    return {}
  },
  props: ['schemeInfo', 'showBindGroup'],
  setup(props) {
    const { state } = useStore(key)
    const router = useRouter()
    const { appContext }: any = getCurrentInstance()
    // 弹窗
    interface DataProps {
      tableData: any[]
      currentPage: number
      pageSize: number
      total: number
      loading: boolean
      platTypeLevel: []
    }
    const data: DataProps = reactive({
      tableData: [],
      currentPage: 1,
      pageSize: 10,
      total: 0,
      loading: false,
      platTypeLevel: state.platTypeLevel,
      back: () => {
        router.back()
        // console.log(888)
      },
      bindGroup: async (platType: string, item: any, flag: string) => {
        // console.log('bindGroup', item)
        // console.log('bindGroup', platType, item, props.schemeInfo, flag)
        // item.schedule.find(schedule => schedule.groupDetailType === platType).scheduleName
        const params = {
          groupId: item.groupId,
          type: platType,
          valueList: [props.schemeInfo.id]
        }
        if (flag === '0') { // 添加
          await saveGroupDetail(params)
          getPageGroupDetailWithSchedule()
        } else { // 设置
          const text = '确认将' + item.groupName + '的 “' + item.schedule.find((schedule: any ) => schedule.groupDetailType === platType).scheduleName + '” 修改为 “' + props.schemeInfo.scheduleName + '” ？'
          console.log(text)
          ElMessageBox.confirm(text, '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消'
          })
            .then(async () => {
              await saveGroupDetail(params)
              getPageGroupDetailWithSchedule()
            })
            .catch(() => {
              return
            })
        }
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
        platType: props.schemeInfo.scheduleServiceType,
        userType: props.schemeInfo.scheduleUserType
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
    //  关联群组
    const saveGroupDetail = async (params: any) => {
      console.log(params)
      const { code, msg }: any = await Group.saveGroupDetail(params)
      if (code === 200) {
        appContext.config.globalProperties.$message({
          message: msg,
          center: true,
          type: 'success'
        })
        // APP_SCHEDULE_ID.value = Number(list[0])
        // getListGroupDetailWithSchedule()
        // ElMessage.success(msg)
      } else {
        appContext.config.globalProperties.$message({
          message: msg,
          center: true,
          type: 'danger'
        })
        // ElMessage.error(msg)
      }
    }

    watch(() => props.showBindGroup, (val) => {
      val && getPageGroupDetailWithSchedule()
    })
    // onMounted(() => {

    // })
    onUnmounted(() => {
      // sessionStorage.removeItem('schemeInfo')
    })
    const refData = toRefs(data)
    return {
      // token: computed(() => state.token),
      groupTypeList: computed(() => state.groupTypeList),
      statusList: computed(() => state.statusList),
      Setting,
      Plus,
      ...refData
    }
  }
})
</script>
