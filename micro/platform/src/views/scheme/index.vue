<template lang="pug">
div
  HeadOperation
    el-input(:prefix-icon="Search", v-model='filterData.scheduleName', placeholder='通过方案名称筛选', clearable, @keydown.enter='inquire')
    el-button(:icon='Search', type='primary', @click='inquire') 查询
    el-button(:icon='Refresh', @click='reset') 重置
    template(#right)
      el-button(:icon="Plus", type='primary', @click='add', :disabled="!funcButton.schemeListAdd") 添加方案
    template(#fold)
      el-form(label-width='100px' inline)
        el-row
          el-col(:xs="12", :sm="12", :md="8", :lg="6", :xl="4")
            el-form-item(label='方案名称')
              el-input(v-model='filterData.scheduleName', placeholder='请输入关键字' clearable)
          el-col(:xs="12", :sm="12", :md="8", :lg="6", :xl="4")
            el-form-item(label="状态")
              el-select(v-model='filterData.status', placeholder='请选择', clearable)
                el-option(v-for='(item, i) in statusList', :key='i', :label='item.label', :value='item.value')
          el-col(:xs="12", :sm="12", :md="8", :lg="6", :xl="4")
            el-form-item(label="用户类型")
              el-select.display-block(v-model="filterData.scheduleUserType" placeholder="请选择" clearable)
                el-option(v-for="(item, i) in userTypeList", :key="i", :label="item.name", :value="item.label")
          el-col(:xs="12", :sm="12", :md="8", :lg="6", :xl="4")
            el-form-item(label="终端类型")
              el-select.display-block(v-model="filterData.scheduleServiceType" placeholder="请选择" clearable)
                el-option(v-for="(item, i) in platTypeLevel", :key="i", :label="item.name", :value="item.code")
          //- el-col(:xs="12", :sm="12", :md="8", :lg="6", :xl="4")
            el-form-item
              el-button(:icon='Search', type='primary', @click='inquire') 查询
              el-button(:icon='Refresh', @click='reset') 重置
  //- filter-content
    el-form(label-width='100px' inline)
      el-form-item(label='方案名称：')
        el-input(v-model='filterData.scheduleName', placeholder='请输入关键字' clearable)
      el-form-item(label="状态：")
        el-select(v-model='filterData.status', placeholder='请选择', clearable)
          el-option(v-for='(item, i) in statusList', :key='i', :label='item.label', :value='item.value')
      el-form-item(label="用户类型：")
        el-select.display-block(v-model="filterData.scheduleUserType" placeholder="请选择" clearable)
          el-option(v-for="(item, i) in userTypeList", :key="i", :label="item.name", :value="item.label")
      el-form-item(label="终端类型：")
        el-select.display-block(v-model="filterData.scheduleServiceType" placeholder="请选择" clearable)
          el-option(v-for="(item, i) in platTypeLevel", :key="i", :label="item.name", :value="item.code")
    template(#buttonGroup='')
      el-button(:icon='Search', type='primary', @click='inquire') 查询
      //- el-button(icon='el-icon-plus', type='primary', @click='add') 添加
      el-button(:icon='Refresh', @click='reset') 重置
  //- | tableData:{{tableData}}
  .table-content
    //- TableTitle(title="方案列表")
      el-button(:icon="Plus", type='primary', @click='add') 添加方案
    el-table(:data='tableData', v-loading='loading')
      //- el-table-column(type="expand", width="56")
        template(#default="{ row }")

      el-table-column(prop='id', label='编号', align='center', width='80')
      el-table-column(prop='scheduleName', label='方案名称')
      el-table-column(prop='schemeCode', label='方案代码')
      el-table-column(prop='scheduleUserType', label='用户类型', width='130')
        template(#default='scope')
          span.dot-list(v-for="(item, i) in userType(scope.row.scheduleUserType)" :key="i") {{ item }}
      el-table-column(prop='scheduleServiceType', label='终端类型')
        template(#default='scope')
          div(v-if='scope.row.scheduleServiceType')
            span.dot-list(v-for='(ele, i) in scope.row.scheduleServiceType.split(",")', :key='i') {{ platTypeLevel?.find((e) => e.code === ele)?.name }}
      el-table-column(prop='status', label='状态', width='80', align="center")
        template(#default='scope')
          //- span {{scope.row.status}}
          el-switch(:disabled="!funcButton.schemeListEdit", v-model='scope.row.status', :active-value='1', :inactive-value='0', :loading='scope.row.switchLoading', :before-change="beforeChange.bind(this, scope.row)")
      //- el-table-column(label='方案布局' width="140" align='center')
        template(#default='scope')
          div.link-group
            el-button(link type="primary" :href="null" @click='toLayout(scope.row)', :disabled="!funcButton.schemeListLayoutEdit",) 布局设置

      //- el-table-column(label='设置' width="100" align='center')
        template(#default='scope')
          div.link-group
            //- el-button(link type="primary" :href="null" @click='checkScheme(scope.row)') 查看
            //- el-button(link type="primary" @click='/* bindGroup(scope.row);  */schemeInfo = scope.row ;showBindGroup = true') 绑定群组
            el-button(link type="primary" :href="null" @click='toLayout(scope.row)', :disabled="!funcButton.schemeListLayoutEdit") 布局设置
      //- el-table-column(label='绑定群组' width="100" align='center')
        template(#default='scope')
          div.link-group
            //- el-button(link type="primary" @click='bindGroup(scope.row)', :disabled="!funcButton.schemeBindGroup") 设置
            el-button(link type="primary" @click='bindGroup(scope.row)') 设置
      el-table-column(label='操作' width="200")
        template(#default='scope')
          div.link-group
            //- el-button(link type="primary" :href="null" @click='checkScheme(scope.row)') 查看
            //- el-button(link type="primary" @click='/* bindGroup(scope.row);  */schemeInfo = scope.row ;showBindGroup = true') 绑定群组
            //- el-button(link type="primary" :href="null" @click='toLayout(scope.row)', :disabled="!funcButton.schemeListLayoutEdit") 布局设置
            el-button(link type="primary" @click='drawerPanel(scope.row)') 查看
            el-button(link type="primary" @click='editScheme(scope.row)', :disabled="!funcButton.schemeListEdit") 编辑
            el-button(link type='danger' @click='deleteScheme(scope.row)', :disabled="!funcButton.schemeListRemove") 删除
            MoreHandle
              el-button(link type="primary" @click='bindGroup(scope.row)') 绑定群组
              el-button(link type="primary" :href="null" @click='toLayout(scope.row)', :disabled="!funcButton.schemeListLayoutEdit") 设计布局

          //- el-button(size='mini', plain, @click='checkScheme(scope.row)' type="primary") 查看
          //- //- el-button(size='mini', plain, @click='toLayout(scope.row)' type="warning") 布局设置
          //- el-button(size='mini', plain, @click='editScheme(scope.row)') 编辑
          //- el-button(
          //-   size='mini',
          //-   type='danger',
          //-   plain,
          //-   @click='deleteScheme(scope.row)'
          //- ) 删除
    .flex-box.flex-center
      el-pagination(
        @size-change='handleSizeChange',
        @current-change='handleCurrentChange',
        :current-page='currentPage',
        background
        :page-sizes='[10, 20, 30, 40]',
        :page-size='pageSize',
        layout='total, sizes, prev, pager, next, jumper',
        :total='total')
    el-dialog(
      v-model='dialogFormVisible',
      :width='600',
      :title="(dialogStatus ? '编辑' : '查看')+ '方案：' + currentScheme.scheduleName + ' (' + currentScheme.schemeCode + ')'",
      custom-class='bindPos-dialog'
    )
      template(v-if="!dialogStatus")
      //- p {{formEdit}}
      el-form(v-else
        ref='forms',
        label-width='100px',
        :rules='rules',
        :model='formEdit'
      )
        //- | {{formEdit}}
        el-form-item.is-required(label='方案名称', prop='scheduleName')
          el-input(v-model='formEdit.scheduleName')
        el-form-item.is-required(label='终端类型' prop="platTypeArr")
          el-checkbox-group(v-model="formEdit.platTypeArr")
            el-checkbox(v-for="(item, i) in filterPlatType", :key="i", :label="item.code") {{ item.name }}
        el-form-item(label='描述')
          el-input(v-model='formEdit.scheduleDesc' type="scheduleDesc")
          //- span {{ platTypeList?.find((item) => item.value === formEdit.scheduleServiceType).label }}
          //- el-checkbox-group(v-model="formEdit.scheduleUserType" v-if="")
            el-checkbox(v-for="(item, i) in platTypeLevel" :label="item.value" name="type") {{item.name}}
      template(#footer)
        el-button(@click='cancel') 取消
        el-button(type='primary', @click='saveForm', :loading='saveLoading') 保存

  el-drawer(v-model="showDrawer" :title="currentScheme.scheduleName" size="40%")
    el-descriptions(title="基本信息", :column="2")
      el-descriptions-item(label="方案名称")  {{ currentScheme.scheduleName }}
      el-descriptions-item(label="编号")  {{ currentScheme.id }}
      el-descriptions-item(label="方案代码")  {{ currentScheme.schemeCode }}
      el-descriptions-item(label="用户类型")
        span.dot-list( v-for="(item, i) in userType(currentScheme.scheduleUserType)" :key="i") {{ item }}
      el-descriptions-item(label="终端类型" v-if="currentScheme.scheduleServiceType")
        span.dot-list(v-for='(ele, i) in currentScheme.scheduleServiceType.split(",")', :key='i') {{ platTypeLevel?.find((e) => e.code === ele)?.name }}
      el-descriptions-item(label="描述")  {{ currentScheme.scheduleDesc }}
      el-descriptions-item(label="更新时间")  {{ currentScheme.updateTime }}
  BindGroup(v-model="showBindGroup" :showBindGroup="showBindGroup" :schemeInfo="schemeInfo")
</template>
<script lang="ts">
import { defineComponent, computed, reactive, toRefs, onMounted, getCurrentInstance, ref, onActivated } from 'vue'
// import { getAppScheduleList } from '@/service/platform'
import { Menu, Scheme } from '@/service/platform/index'
import { useStore } from 'vuex'
import { key } from '@/store/index'
import { useRouter, useRoute } from 'vue-router'
import FilterContent from '@/components/filterContent/index.vue'
import TableTitle from '@/components/tableTitle.vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Search, Refresh, Plus } from '@element-plus/icons-vue'
import HeadOperation from '@/components/headOperation.vue'
import MoreHandle from '@/components/moreHandle.vue'
import BindGroup from './modules/bindGroup.vue'
import { map } from 'lodash'

export default defineComponent({
  name: 'scheme',
  components: {
    FilterContent,
    TableTitle,
    HeadOperation,
    BindGroup,
    MoreHandle
  },
  setup() {
    const { appContext }: any = getCurrentInstance()
    const forms: any = ref(null)
    const { state }: any = useStore(key)
    const router = useRouter()
    const route = useRoute()
    const showDrawer = ref(false)
    interface DataProps {
      // name: string
      // type: string
      // status: any
      // platType: string
      filterData: any
      platTypeList: any[]
      userTypeList: any[]
      statusList: any[]
      platTypeLevel: any[]
      tableData: any[]
      currentPage: number
      pageSize: number
      total: number
      loading: boolean
      dialogFormVisible: boolean
      showBindGroup: boolean
      dialogStatus: any
      // dialogFormType: string
      formEdit: any
      currentScheme: any
      saveLoading: boolean
      schemeInfo: any
    }
    const data: DataProps = reactive({
      // name: '',
      // type: '',
      // status: null,
      // platType: '',
      filterData: {
        scheduleName: null,
        status: null,
        scheduleUserType: null,
        scheduleServiceType: null
      },
      platTypeList: state.platTypeList,
      userTypeList: state.userTypeList,
      platTypeLevel: state.platTypeLevel,
      statusList: state.statusList,
      tableData: [],
      currentPage: 1,
      pageSize: 10,
      total: 0,
      loading: false,
      dialogFormVisible: false,
      showBindGroup: false,
      dialogStatus: 0, // 0->查看  1->编辑
      // dialogFormType: '', // add 添加  edit 编辑
      formEdit: {},
      currentScheme: {}, // 当前选中方案
      saveLoading: false,
      schemeInfo: {},
      rules: {
        // 表单规则
        scheduleName: [
          {
            required: true,
            message: '请填写方案名称',
            trigger: 'blur'
          },
          {
            min: 1,
            max: 20,
            message: '内容长度必须小于20',
            trigger: 'blur'
          }
        ],
        // platTypeArr: {
        //   required: true,
        //   message: '终端类型不能为空',
        //   trigger: 'blur'
        // }
        platTypeArr: [{ required: true, message: '终端类型不能为空', trigger: 'blur' }],
      },
      reset: () => {
        // 重置
        for (const key in data.filterData) {
          data.filterData[key] = null
        }
      },
      inquire: () => {
        // 查询
        data.currentPage = 1
        // console.log(data.name, data.type, data.status)
        getAppScheduleList('messageBox')
      },
      add: () => {
        // 添加方案
        // appContext.config.globalProperties.$message('添加方案')
        router.push({
          name: 'schemeAdd'
        })
      },
      handleSizeChange: (val: number) => {
        console.log(`每页 ${val} 条`)
        data.pageSize = val
        getAppScheduleList()
      },
      handleCurrentChange: (val: number) => {
        console.log(`当前页: ${val}`)
        data.currentPage = val
        getAppScheduleList()
      },
      // 布局设置
      toLayout: (item: any) => {
        // history.pushState(null, '', `/layoutEditor?id=${item.id}&scheduleName=${item.scheduleName}&scheduleServiceType=${item.scheduleServiceType}&scheduleUserType=${item.scheduleUserType}&schemeCode=${item.schemeCode}&type=scheme`)
        // if (item) {
        let index = ''
        if (process.env.NODE_ENV === 'development') index = state.devHost.layoutEditor + '/layout-editor'
        else index = state.configs.base + '/layout-editor'
        if (item) {
          let url = ''
          url = `${index}/?token=${state.token}&type=scheme&id=${item.id}&scheduleName=${item.scheduleName}&scheduleServiceType=${item.scheduleServiceType}&scheduleUserType=${item.scheduleUserType}&schemeCode=${item.schemeCode}&schemeType=${Number(item.flagScheduleType || 0) ? 'app' : 'common'}`
          router.push({ name: 'layoutEditor', query: { url: encodeURI(url) } })
        } else {
          ElMessage.error('缺少参数')
        }

        // }
        // let index = state.devHost.scheme
        // let url = `${index}/manage-scheme/?token_type=${state.token_type}&token=${state.token}&id=${item.id}&scheduleName=${item.scheduleName}&scheduleServiceType=${item.scheduleServiceType}&scheduleUserType=${item.scheduleUserType}&schemeCode=${item.schemeCode}&type=scheme`
        // console.log(url)
        // window.location.href = url
        // router.push({
        //   path: '/layoutEditor',
        //   query: {
        //     ...item,
        //     type: 'scheme'
        //   }
        // })
      },
      // 绑定群组
      bindGroup: (item: any) => {
        // console.log(item)
        data.schemeInfo = item
        data.showBindGroup = true
        // sessionStorage.setItem('schemeInfo', JSON.stringify(item))
        // router.push({
        //   name: 'schemeBindGroup'
        // })
      },
      // 删除
      deleteScheme: (item: any) => {
        ElMessageBox.confirm('确定删除方案"' + item.scheduleName + '"吗？', "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            deleteAppSchedule(item.id)
          })
          .catch(() => {
            // TODO
          });
      },
      checkScheme: (item: any) => {
        data.currentScheme = item
        data.dialogStatus = 0
        data.dialogFormVisible = true
        console.log('checkScheme', item)
        // router.push({
        //   name: 'schemeDetails'
        // })
        // sessionStorage.setItem('currentScheme', JSON.stringify(item))
      },
      // 编辑
      editScheme: (item: any) => {
        console.log(item)
        // data.dialogFormType = 'edit'
        data.dialogStatus = 1
        data.currentScheme = item
        data.dialogFormVisible = true
        console.log('editScheme', item)
        data.formEdit.scheduleName = item.scheduleName
        data.formEdit.schemeCode = item.schemeCode
        data.formEdit.scheduleDesc = item.scheduleDesc
        // data.formEdit.scheduleUserType = item.scheduleUserType
        data.formEdit.scheduleServiceType = item.scheduleServiceType
        data.formEdit.platTypeArr = item.scheduleServiceType?.split(',')
      },
      drawerPanel: (item: any) => {
        data.currentScheme = item
        showDrawer.value = true
      },
      saveForm: () => {
        forms.value.validate((valid: any) => {
          if (valid) {
            let params: any = {
              // appSchedule: {
              id: data.currentScheme.id,
              scheduleName: data.formEdit.scheduleName,
              schemeCode: data.formEdit.schemeCode,
              scheduleDesc: data.formEdit.scheduleDesc
              // }
            }
            params.scheduleServiceType = data.formEdit.platTypeArr.join(',')
            console.log(params)
            updateAppScheduleWithDetail(params)
          }
        })
      },
      cancel: () => {
        data.dialogFormVisible = false
        forms.value.resetFields()
      },
      beforeChange(item: any) {
        console.log('beforeChange', item)
        item.switchLoading = true
        const params = {
          id: item.id,
          status: item.status === 0 ? 1 : 0
        }
        updateAppScheduleWithDetail(params, 'switch')

      }
    })

    // watch(route, (val: any) => val.name === 'schemeList' && getAppScheduleList())
    onActivated(() => {
      getAppScheduleList()
    })

    // 查询方案列表
    const getAppScheduleList = async (msgBox?: string) => {
      console.log('scheme', window.top == window)
      const params: any = {
        current: data.currentPage,
        size: data.pageSize,
        flagScheduleType: '0'
      }
      for (const key in data.filterData) {
        if (data.filterData[key] !== null && data.filterData[key] !== '') params[key] = data.filterData[key]
      }
      // if (data.id) params.id = data.id
      // if (data.filterData.name) params.scheduleName = data.filterData.name
      // if (data.nameEn) params.nameEn = data.nameEn
      // if (data.filterData.userType) params.scheduleUserType = data.filterData.userType
      // if (data.status !== null) params.status = data.status
      // if (data.platType) params[data.platType] = '1'
      data.loading = true
      const { data: res, code, message, msg }: any = await Scheme.getAppScheduleListPage(params, msgBox)
      data.loading = false
      if (code === 200) {
        console.log(msg)
        data.total = res.total
        data.tableData = res.records
        data.tableData.forEach((element) => {
          element.switchLoading = false
        })
      } else {
        appContext.config.globalProperties.$message({
          message: message,
          center: true,
          type: 'danger'
        })
      }
    }
    // 删除方案
    const deleteAppSchedule = async (id: number) => {
      // console.log('删除组件', bh)
      data.loading = true
      const { data: res, code, msg }: any = await Scheme.deleteAppSchedule({ id: id })
      // data.loading = false
      if (code === 200) {
        appContext.config.globalProperties.$message.success('删除成功')
        getAppScheduleList()
      } else {
        console.log(res)
        appContext.config.globalProperties.$message.error(msg)
      }
    }
    // 编辑方案
    const updateAppScheduleWithDetail = async (params: any, type?: any) => {
      data.saveLoading = true
      const { data: res, code, msg }: any = await Scheme.updateAppScheduleWithDetail(params)
      data.saveLoading = false
      if (code === 200) {
        if (type !== 'switch') appContext.config.globalProperties.$message.success('保存成功')
        getAppScheduleList()
        data.dialogFormVisible = false
      } else {
        console.log(res)
        appContext.config.globalProperties.$message.error(msg)
      }
    }
    //  监听回车
    // const onkeydown = () => {
    //   document.onkeydown = (e) => {
    //     console.log(e)
    //     // if (e.key === 'Enter') {
    //     //   getAppScheduleList()
    //     // }
    //   }
    // }
    const userType = (type: string) => {
      let userTypeArr = []

      if (type !== 'common') userTypeArr = data.userTypeList?.filter((item) => item.label === type)
      else userTypeArr = data.userTypeList

      return map(userTypeArr, 'name')
    }
    // console.log(this)
    onMounted(() => {
      // onkeydown()
      // console.log('onMounted')
      // getAppScheduleList()
    })
    const refData = toRefs(data)
    return {
      token: computed(() => state.token),
      filterPlatType: computed(() => {
        // let arr = data.platTypeLevel
        let arr = []
        let parentCode = ''
        let code = ''
        const platTypeArr = data.currentScheme.scheduleServiceType?.split(',')
        console.log(data.formEdit.platTypeArr)
        platTypeArr.forEach((element: any) => {
          const obj = data.platTypeLevel.find(item => item.code === element)
          if (obj.parentCode) {
            parentCode = obj.parentCode
          } else {
            code = obj.code
          }

        });
        console.log('parentCode', parentCode)
        if (parentCode) {
          arr = data.platTypeLevel.filter(item => item.parentCode === parentCode)
        } else if (code) {
          arr = data.platTypeLevel.filter(item => item.code === code)
        }
        return arr
      }),
      funcButton: computed(() => state.funcButton),
      forms,
      Search,
      Refresh,
      Plus,
      state,
      userType,
      ...refData,
      showDrawer
    }
  }
})
</script>
<style scoped>
.el-select {
  display: block;
}

/* .el-table .warning-row {
  background: oldlace;
}

.el-table .success-row {
  background: #f0f9eb;
} */
</style>