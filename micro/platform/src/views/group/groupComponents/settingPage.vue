<!--
 * @Author: your name
 * @Date: 2021-10-20 09:05:45
 * @LastEditTime: 2022-06-08 16:36:02
 * @LastEditors: error: git config user.name && git config user.email & please set dead value or install git
 * @Description: In User Settings Edit
 * @FilePath: /management/src/apps/platform/views/group/groupComponents/limitPage.vue
-->
<template lang="pug">
#SettingPage
  //- el-row(:gutter='10')
    el-col(:xs='24', :sm='12', :md='8', :lg='6', :xl='6', v-for='(item, index) in data', :key='Number(index)')
      schemeBox(:name='item.label', :userType='ite.userType', :type='item.type', :rType='item.rType', :id='item.id')
  el-table(v-if='platTypeData?.length > 0', :data='platTypeData', row-key='code', border, :expand-row-keys='["mobile", "pc"]', :default-expand-all='expand', :tree-props='{ children: "children" }')
    el-table-column(label='终端类型')
      template(#default='scope')
        span {{ scope.row.name }}
    el-table-column(label='当前方案')
      template(#default='scope')
        el-tag(v-if='(!(scope.row.parentCode == 0) || scope.row.children?.length < 1) && scope.row.scheme' closable @close="closeTag(scope.row)")
          span {{ scope.row.scheme ? scope.row.scheme["APP_SCHEDULE_NAME"] : null }}
    el-table-column(label='操作', width='100' align="center")
      template(#default='scope')
        el-button(v-if='!scope.row.children || scope.row.children?.length < 1', type='primary', link, @click='bindScheme(scope.row, "bind")') 绑定方案

  el-dialog(v-model='showDialog', :width='600', title='绑定方案', @closed='closed')
    el-form(label-width='80')
      el-form-item(label='方案列表')
        el-select(v-model='schemeVal', placeholder='请选择方案', no-data-text='无方案')
          el-option(v-for='item in schemeList', :key='item.id', :label='item.scheduleName', :value='String(item.id)', @click='bindScheme(item, "choose")')
    template(#footer)
      el-button(@click='showDialog = false') 取消
      el-button(type='primary', @click='saveGroupDetail') 确定
    //- pre {{ activeItem }}

</template>

<script lang="ts">
import schemeBox from './schemeBox.vue'
import { useRoute, useRouter } from 'vue-router'
import { defineComponent, reactive, ref, onMounted } from 'vue'
import { useStore } from 'vuex'
import { key } from '@/store'
import subDialog from '@/components/subDialog.vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Group } from '@/service/platform'

export default defineComponent({
  name: 'SettingPage',
  components: {
    schemeBox,
    subDialog
  },

  setup() {
    const store = useStore(key)
    const { state } = store
    const showDialog: any = ref(false)
    const route: any = useRoute()
    const router: any = useRouter()
    const platArr: any = ref([])
    const platTypeData: any = ref([])
    const nowRow: any = ref()
    const nowScheme: any = ref()

    let id = route.params.id
    let userType = route.query.type
    let tabsNameSetting = ref('app')

    const expand: any = ref(true)
    const activeItem: any = ref({})
    const schemeList: any = ref([])

    const schemeForm: any = reactive({
      groupId: route.params.id,
      type: '',
      valueList: []
    })
    const schemeVal = ref('')
    const getListGroupDetailWithSchedules = async (item: any) => {
      if (!item) {
        return
      }
      const params = {
        groupId: route.params.id,
        type: item.code
      }
      // return await Group.getListGroupDetailWithSchedule(params)
      return await Group.getListGroupDetailWithSchedule(params)
    }
    const toTreeData = (data: any, pid: any) => {
      const tree = (id: any) => {
        const arr: any = []
        data
          .filter((item: any) => {
            return item.parentCode === id
          })
          .forEach((item: any) => {
            arr.push({
              ...item,
              children: tree(item.code)
            })
          })
        return arr
      }
      return tree(pid) // 第一级节点的父id，是null或者0，视情况传入
    }

    const treeToArr = (data: any, pid: number, res: any) => {
      data.forEach((item: any) => {
        res.push({ ...item })
        if (item.children && item.children.length !== 0) {
          treeToArr(item.children, item.code, res)
        }
      })
      return res
    }

    const getScheme = async () => {
      const platType = treeToArr(state.platTypeList, 0, [])
      for (let val of platType) {
        console.log(val)
        if (!val.parentCode) {
          val.parentCode = 0
        }
        if (!(val.parentCode === 0) || val?.children?.length < 1) {
          await getListGroupDetailWithSchedules(val).then((r: any) => {
            val.scheme = r.data[0] ? r.data[0] : null
          })
        }
      }
      platTypeData.value = await toTreeData(platType, 0)
      console.log('platTypeData.value', platTypeData.value)
    }

    let activeName: any = ref('App方案信息')

    const back = () => {
      router.back()
    }

    const bindScheme = (item: any, type: any) => {
      console.log(item)
      if (type === 'bind') {
        showDialog.value = true
        activeItem.value = item
        nowRow.value = item
        getAppScheduleList(route.query.type, item.code)
      } else {
        nowScheme.value = item
      }
    }
    const getAppScheduleList = async (userType: string, type: string) => {
      const params = {
        scheduleUserType: userType == 'visitor' ? 'user' : userType,
        scheduleServiceType: type,
        flagScheduleType: 0

      }
      const { data: res, code, msg }: any = await Group.getAppScheduleList(params)
      if (code === 200) {
        res.filter((r: any) => {
          r.status = false
        })
        schemeList.value = res
        // for (let data of transferData_) {
        //   data.label = data.scheduleName
        //   data.key = String(data.id)
        // }
        // console.log(res)
      } else {
        ElMessage.error(msg)
      }
    }
    const saveGroupDetail = async () => {
      //
      if (!schemeVal.value) {
        ElMessage.warning('请先选择方案')
        return
      }
      // schemeForm.type = data.find((r: any) => {
      //   return r.type === activeItem.value.code
      // }).rType
      schemeForm.type = activeItem.value.code
      schemeForm.valueList = [String(schemeVal.value)]
      const { data: res, code, msg }: any = await Group.saveGroupDetail(schemeForm, 'messageBox')
      if (code === 200) {
        getScheme()
        showDialog.value = false
        ElMessage.success(msg)
      }
    }
    const closed = () => {
      schemeVal.value = ''
    }

    const closeTag = async (data: any) => {
      ElMessageBox.confirm(
        '确定要删除当前平台下的绑定方案吗?',
        '提示',
        {
          confirmButtonText: '确认',
          cancelButtonText: '取消',
          type: 'warning',
        }
      )
        .then(async () => {
          const params = {
            id: data.scheme.GROUP_DETAIL_ID
          }
          const { msg, code }: any = await Group.removeSchedule(params, 'messageBox')
          if (code === 200) {
            ElMessage.success(msg)
            getScheme()
          }
        })
        .catch(() => { })
    }
    onMounted(() => {
      getScheme()
    })
    return {
      activeName,
      id,
      userType,
      tabsNameSetting,
      back,
      // data,
      state,
      platArr,
      showDialog,
      bindScheme,
      activeItem,
      platTypeData,
      expand,
      schemeList,
      saveGroupDetail,
      schemeVal,
      closed,
      closeTag,
      getListGroupDetailWithSchedules
    }
  }
})
</script>
<style lang="scss">
#SettingPage {
  overflow: hidden !important;

  .el-page-header {
    margin-bottom: 10px;
  }
}
</style>
