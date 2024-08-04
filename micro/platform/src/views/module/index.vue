<template lang="pug">
div
  HeadOperation
    el-input(:prefix-icon='Search', v-model='filterData.name', placeholder='通过组件名称筛选', clearable, style='margin-right: 12px', @keydown.enter='inquire')
    el-button(:icon='Search', type='primary', @click='inquire') 查询
    el-button(:icon='Refresh', @click='reset') 重置
    template(#right)
      el-button(:icon='Plus', type='primary', @click='add', :disabled='!funcButton.moduleListAdd') 添加
    template(#fold)
      //- filter-content
      el-form(label-width='100px', inline)
        el-row
          el-col(:xs='12', :sm='12', :md='8', :lg='6', :xl='4')
            el-form-item(label='组件类型：')
              el-select(v-model='filterData.comType', placeholder='请选择', clearable)
                el-option(v-for='(item, i) in moduleTypeList', :key='i', :label='item.name', :value='item.id')
          el-col(:xs='12', :sm='12', :md='8', :lg='6', :xl='4')
            el-form-item(label='状态：')
              el-select(v-model='filterData.status', placeholder='请选择', clearable)
                el-option(v-for='(item, i) in statusList', :key='i', :label='item.label', :value='item.value')
          el-col(:xs='12', :sm='12', :md='8', :lg='6', :xl='4')
            el-form-item(label='用户类型：')
              el-select(v-model='filterData.userType', placeholder='请选择', clearable)
                el-option(v-for='(item, i) in userTypeList', :key='i', :label='item.name', :value='item.label')
          el-col(:xs='12', :sm='12', :md='8', :lg='6', :xl='4')
            el-form-item(label='终端类型：')
              el-select(v-model='filterData.platType', placeholder='请选择', clearable)
                el-option(v-for='(item, i) in platTypeLevel', :key='i', :label='item.name', :value='item.code')
  .table-content
    //- | --{{funcButton}}
    //- TableTitle(title='组件列表')
      el-button(type='primary', @click='add') 添加组件
    el-table(:data='tableData', v-loading='loading', size='medium')
      el-table-column(prop='bh', label='编号', align='center', width='80')
      el-table-column(prop='file', label='组件图示', align='center', width='200')
        template(#default='scope')
          el-image(style='height: 30px', :src='scope.row.icon')
      el-table-column(prop='name', label='组件名称')
      el-table-column(prop='nameEn', label='英文名称')
      el-table-column(prop='comCode', label='组件代码')
      el-table-column(prop='userType', label='用户类型')
        template(#default='scope')
          div(v-if='scope.row.userType')
            span(v-if='scope.row.userType === "common"')
              span.dot-list(v-for='(item, i) in userTypeList') {{ item.name }}
                //- span(v-if="i + 1 < userTypeList.length") &nbsp;/&nbsp;
            span.dot-list(v-else) {{ userTypeList.find((item) => item.label === scope.row.userType)?.name }}
      el-table-column(prop='platType', label='终端类型', width='210')
        template(#default='scope')
          //- div(v-if="scope.row.platType")
          span.dot-list(v-for='(item, i) in scope.row.platType?.split(",")', :key='i')
            span(v-if="platTypeLevel.find((subItem) => subItem.code === item)") {{ platTypeLevel.find((subItem) => subItem.code === item)?.name }}
            //- p {{ scope.row.platType }}
            //- el-tag(v-if='scope.row.platType') {{ platTypeList?.find((item) => item.code === scope.row.platType).name }}
      el-table-column(prop='comType', label='组件类型', width='90', align='center')
        template(#default='scope')
          span(v-if='scope.row.comType') {{ moduleTypeList?.find((item) => item.id === scope.row.comType).name }}
      el-table-column(prop='status', label='状态' width="100" align="center")
        template(#default='scope')
          el-switch(:disabled='!funcButton.moduleListEdit', v-model='scope.row.status', :active-value='1', :inactive-value='0', :loading='scope.row.loading', @change='onChange', :before-change='beforeChange.bind(this, scope.row)')
      //- el-table-column(prop='', label='绑定', width='100', align='center')
        template(#default='scope')

      el-table-column(label='操作', width='150')
        template(#default='scope')
          el-button(link, type='primary', @click='drawerPanel(scope.row)') 查看
          el-button(link, type='primary', @click='editModule(scope.row)', :disabled='!funcButton.moduleListEdit') 编辑
          el-button(link, type='danger', @click='deleteModule(scope.row)', :disabled='!funcButton.moduleListRemove') 删除
          //- MoreHandle
            el-button(v-if='scope.row.comType === 1', link, type='primary', @click='toBindApps(scope.row)', :disabled='!funcButton.moduleListBindApp') 绑定应用
            el-button(v-if='scope.row.comType === 2', link, type='primary', @click='toBindAdvertise(scope.row)', :disabled='!funcButton.moduleListBindApp') 绑定广告
    el-pagination.flex-box.flex-center(background, @size-change='handleSizeChange', @current-change='handleCurrentChange', :current-page='currentPage', :page-sizes='[10, 20, 30, 40]', :page-size='pageSize', layout='total, sizes, prev, pager, next, jumper', :total='total')
    //- el-dialog(title="修改" v-model="dialogFormVisible")

    el-drawer(v-model='showDrawer' :title='currentModule.name', size='40%')
      el-descriptions(title='基本信息', :column='2')
        el-descriptions-item(label='组件名称') {{ currentModule.name }}
        el-descriptions-item(label='英文名称') {{ currentModule.nameEn }}
        el-descriptions-item(label='组件代码') {{ currentModule.comCode }}
        el-descriptions-item(label='组件类型') {{ moduleTypeList?.find((item) => item.id === currentModule.comType).name }}
        el-descriptions-item(label='用户类型')
          span(v-if='currentModule.userType === "common"')
            span.dot-list(v-for='(item, i) in userTypeList') {{ item.name }}
          span(v-else) {{ userTypeList.find((item) => item.label === currentModule.userType)?.name }}
        el-descriptions-item(label='终端类型', v-if='currentModule.platType')
          span(v-for='(item, i) in currentModule.platType?.split(",")', :key='i')
            span(v-if="platTypeLevel.find((subItem) => subItem.code === item)")
              span(v-if='i > 0') 、
              | {{ platTypeLevel.find((subItem) => subItem.code === item)?.name }}
        el-descriptions-item(v-if='currentModule.comType === 1', label='显示应用最大数量')
          el-button(type="primary" link @click="toBindApps(currentModule)") {{ currentModule?.maxNumber || 10 }} 查看
        el-descriptions-item(label='图标目录' v-if="currentModule.comType === 1") {{ currentModule.appIconStyle }}
        el-descriptions-item(label='描述') {{ currentModule.description }}
          span(v-if='!currentModule.description') 暂无描述
        el-descriptions-item(label='添加时间') {{ currentModule.createTime }}
        el-descriptions-item(label='更新时间') {{ currentModule.updateTime }}
      el-descriptions(title='组件图示', :column='2' style="margin-top: 20px")
        el-descriptions-item
          el-image(:src='currentModule.icon')

    el-dialog(v-model='dialogFormVisible', :width='600', :title='(dialogStatus ? "编辑" : "查看") + "组件：" + currentModule.name + " (" + currentModule.comCode + ")"')
      //- template(v-if='!dialogStatus')
      //-   el-descriptions.details-descriptions(title='', border, :column='1', size='large')
      //-     el-descriptions-item(label='组件名称') {{ currentModule.name }}
      //-     el-descriptions-item(label='英文名称') {{ currentModule.nameEn }}
      //-     el-descriptions-item(label='组件代码') {{ currentModule.comCode }}
      //-     el-descriptions-item(label='组件类型') {{ moduleTypeList?.find((item) => item.id === currentModule.comType).name }}
      //-     el-descriptions-item(label='用户类型')
      //-       span(v-if='currentModule.userType === "common"')
      //-         span(v-for='(item, i) in userTypeList')
      //-           | {{ item.name }}
      //-           span(v-if='i + 1 < userTypeList.length') &nbsp;/&nbsp;
      //-       span(v-else)
      //-         | {{ userTypeList.find((item) => item.label === currentModule.userType)?.name }}
      //-     el-descriptions-item(label='终端类型', v-if='currentModule.platType')
      //-       span(v-for='(item, i) in currentModule.platType?.split(",")', :key='i')
      //-         span(v-if="platTypeLevel.find((subItem) => subItem.code === item)")
      //-           span(v-if='i > 0') &nbsp;/&nbsp;
      //-           | {{ platTypeLevel.find((subItem) => subItem.code === item)?.name }}
      //-     el-descriptions-item(v-if='currentModule.comType === 1', label='显示应用最大数量')
      //-       | {{ currentModule?.maxNumber || 10 }}
      //-       el-button.float-right(type='primary', plain, @click='toBindApps(null)', size='mini') 查看绑定应用
      //-     el-descriptions-item(label='组件图示')
      //-       el-popover(placement='right-end', width='auto', trigger='hover', content='')
      //-         el-image(:src='currentModule.icon')
      //-         template(#reference)
      //-           el-image(style='height: 40px; cursor: pointer', :src='currentModule.icon')
      //-     el-descriptions-item(label='图标目录' v-if="currentModule.comType === 1") {{ currentModule.appIconStyle }}
      //-     el-descriptions-item(label='描述') {{ currentModule.description }}
      //-       span.text-gray-6(v-if='!currentModule.description') 暂无描述
      //-     el-descriptions-item(label='添加时间') {{ currentModule.createTime }}
      //-     el-descriptions-item(label='更新时间') {{ currentModule.updateTime }}
      el-form(ref='forms', label-width='130px', :rules='rules', :model='formEdit')
        el-form-item.is-required(label='组件名称', prop='name')
          el-input(v-model='formEdit.name')
        el-form-item.is-required(label='组件英文名称', prop='nameEn')
          el-input(v-model='formEdit.nameEn')
        el-form-item.is-required(label='终端类型' prop="platTypeArr")
          el-checkbox-group(v-model="formEdit.platTypeArr")
            el-checkbox(v-for="(item, i) in filterPlatType", :key="i", :label="item.code") {{ item.name }}
        el-form-item(label='状态')
          el-switch(v-model='formEdit.status', :active-value='1', :inactive-value='0', :active-text='statusList?.find((item) => item.value === formEdit.status).label')
        el-form-item(v-if='currentModule.comType === 1', label='显示应用最大数量')
          el-input-number(v-model='formEdit.maxNumber', :min='1', :max='15')
        el-form-item(label='图标目录' v-if="currentModule.comType === 1")
          //- el-input(v-model='formEdit.description', type='textarea', placeholder='请输入描述信息')
          el-input(v-model="formEdit.appIconStyle" :disabled="readonly")
            template(#append)
              el-button(:icon="Edit" @click="editAppIconStyle")
        el-form-item(label='是否显示全部应用' v-if="currentModule.comType === 1")
          el-switch(v-model='formEdit.isAllApps', :active-value='true', :inactive-value='false' :disabled="readonly")
          //- el-input(v-model='formEdit.description', type='textarea', placeholder='请输入描述信息')
          //- el-input(v-model="formEdit.isAllApps" :disabled="readonly")
            template(#append)
              el-button(:icon="Edit" @click="editAppIconStyle")

        el-form-item(label='描述')
          el-input(v-model='formEdit.description', type='textarea', placeholder='请输入描述信息')
          //- //.resetFields()
      template(#footer='', v-if='dialogStatus')
        el-button(@click='cancel') 取消
        el-button(type='primary', @click='saveForm', :loading='saveLoading') 保存
</template>
<script lang="ts">
import { defineComponent, computed, reactive, toRefs, onMounted, onActivated, getCurrentInstance, ref } from 'vue'
// import { msgbox, IMsgBoxOptions } from '@/hooks/subMessageBox'
// import SubDialog from '@/components/subDialog.vue'
// import { getZcomList } from '@/service/platform'
import { Module } from '@/service/platform/index'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { key } from '@/store/index'
// import FilterContent from '@/components/filterContent/index.vue'
// import TableTitle from '@/components/tableTitle.vue'
import { Search, Refresh, Plus, Edit } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import HeadOperation from '@/components/headOperation.vue'
import MoreHandle from '@/components/moreHandle.vue'

export default defineComponent({
  name: 'module',
  components: {
    // SubDialog,
    // FilterContent,
    // TableTitle,
    HeadOperation,
    MoreHandle
  },
  setup() {
    const { state } = useStore(key)
    const router = useRouter()
    // const { appContext }: any = getCurrentInstance()
    // 弹窗
    // const openMesage = (message: string, callback: any) => {
    //   const opt: IMsgBoxOptions = {
    //     title: '提醒',
    //     message: message,
    //     showCancelButton: true
    //   }
    //   msgbox.open(opt).then((r) => {
    //     callback(r)
    //   })
    // }
    // console.log(appContext.config.globalProperties.$isDev)
    const forms: any = ref(null)
    const showDrawer = ref(false)
    interface DataProps {
      // name: string
      // type: string
      // status: any
      // platType: string
      // moduleType: any
      platTypeLevel: any[]
      filterData: any
      tableData: any[]
      currentPage: number
      pageSize: number
      total: number
      loading: boolean
      dialogFormVisible: boolean
      dialogStatus: any
      formEdit: any
      currentModule: any
      saveLoading: boolean
      readonly: boolean
    }
    const data: DataProps = reactive({
      filterData: {
        name: null,
        status: null,
        platType: null,
        userType: null,
        comType: null
      },
      readonly: true,
      userTypeList: state.userTypeList,
      statusList: state.statusList,
      platTypeList: state.platTypeList,
      platTypeLevel: state.platTypeLevel,
      moduleTypeList: state.moduleTypeList,
      // funcButton: state.funcButton,
      tableData: [],
      currentPage: 1,
      pageSize: 10,
      total: 0,
      loading: false,
      dialogFormVisible: false,
      dialogStatus: 0, // 0->查看  1->编辑
      formEdit: {
        name: '',
        nameEn: ''
      }, // 表单项
      currentModule: {}, // 当前选中组件
      saveLoading: false,
      rules: {
        // 表单规则
        name: [
          {
            required: true,
            message: '请填写组件名称',
            trigger: 'blur'
          },
          {
            min: 1,
            max: 20,
            message: '内容长度必须小于20',
            trigger: 'blur'
          }
        ],
        nameEn: [
          {
            required: true,
            message: '请填写组件英文名称',
            trigger: 'blur'
          },
          {
            min: 1,
            max: 50,
            message: '内容长度必须小于50',
            trigger: 'blur'
          }
        ],
        platTypeArr: [{ required: true, message: '终端类型不能为空', trigger: 'blur' }]
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
        getZcomList('messageBox')
      },
      add: () => {
        // 添加组件
        router.push({
          name: 'moduleAdd'
        })
      },
      handleSizeChange: (val: number) => {
        console.log(`每页 ${val} 条`)
        data.pageSize = val
        getZcomList()
      },
      handleCurrentChange: (val: number) => {
        console.log(`当前页: ${val}`)
        data.currentPage = val
        getZcomList()
      },
      // 查看
      checkModule: (item: any) => {
        showDrawer.value = true
        data.currentModule = item
        data.dialogStatus = 0
        data.dialogFormVisible = true
      },
      drawerPanel: (item: any) => {
        showDrawer.value = true
        data.currentModule = item
      },
      // 绑定应用
      toBindApps(item: any) {
        if (item) data.currentModule = item
        // data.dialogFormVisible = false
        router.push({
          name: 'moduleBindApps'
        })
        data.currentModule.mySource = 0 // 0本地数据 1云端数据
        sessionStorage.setItem('currentModule', JSON.stringify(data.currentModule))
      },
      // 绑定广告
      toBindAdvertise(item: any) {
        if (item) data.currentModule = item
        // data.dialogFormVisible = false
        router.push({
          name: 'moduleBindAdvertise'
        })
        sessionStorage.setItem('currentModule', JSON.stringify(data.currentModule))
      },
      // 删除
      deleteModule: (item: any) => {
        console.log('删除组件:', item.bh, item.name)
        ElMessageBox.confirm('确定删除组件"' + item.name + '"？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            removeZcom(item.bh)
          })
          .catch(() => {
            console.log('cancel')
          })
        // openMesage('确定删除组件"' + item.name + '"？', (r: any) => {
        //   if (r === 'confirm') {
        //     console.log('confirm')
        //     removeZcom(item.bh)
        //   } else {
        //     console.log('cancel')
        //   }
        // })
      },
      // 编辑
      editModule: (item: any) => {
        // flagIsTop;
        // flagIsAdSupport;
        // flagIsServiceApp;
        // flagIsMobileApp;
        // flagIsWebApp;
        // defaultTheme;
        // isAllApps;
        console.log('编辑组件:', item.bh, item.name)
        data.currentModule = item
        data.dialogStatus = 1
        data.dialogFormVisible = true
        data.formEdit.name = item.name
        data.formEdit.nameEn = item.nameEn
        data.formEdit.appIconStyle = item.appIconStyle
        data.formEdit.isAllApps = item.isAllApps
        data.formEdit.flagIsTop = item.flagIsTop
        data.formEdit.flagIsAdSupport = item.flagIsAdSupport
        data.formEdit.flagIsServiceApp = item.flagIsServiceApp
        data.formEdit.flagIsMobileApp = item.flagIsMobileApp
        data.formEdit.flagIsWebApp = item.flagIsWebApp
        data.formEdit.defaultTheme = item.defaultTheme


        // // data.formEdit.flagIsAdSupport = item.flagIsAdSupport
        data.formEdit.status = item.status
        if (data.currentModule.comType === 1) {
          data.formEdit.maxNumber = item.maxNumber
        }
        // data.formEdit.type = item.type
        data.formEdit.platTypeArr = item.platType?.split(',')
        // data.formEdit.platTypeArr = item.scheduleServiceType.split(',')
        data.formEdit.description = item.description
        // appContext.config.globalProperties.$message.warning('正在开发中')
      },
      editAppIconStyle: () => {
        data.readonly = false
      },
      // 保存
      saveForm: () => {
        forms.value.validate((valid: any) => {
          // console.log(valid)
          if (valid) {
            let params: any = {
              bh: data.currentModule.bh
            }
            params = Object.assign(params, data.formEdit)
            editZcom(params)
          }
        })
      },
      cancel: () => {
        data.dialogFormVisible = false
        forms.value.resetFields()
      },
      bindApps: (item: any) => {
        console.log('绑定应用:', item.bh, item.name)
        router.push({
          name: 'moduleBindApps'
        })
        sessionStorage.setItem('currentModule', JSON.stringify(item))
      },
      beforeChange(item: any) {
        console.log('beforeChange', item)
        // item.loading = true
        const params = {
          bh: item.bh,
          status: item.status === 0 ? 1 : 0
        }
        ElMessageBox.confirm(`确定将“${item.name}”设为${item.status ? '无效' : '有效'}组件？`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          editZcom(params, '修改成功')
          // removeZcom(item.bh)
        })
          .catch(() => {
            console.log('cancel')
          })
        // return new Promise((resolve, reject) => {})
        //  Module.editZcom(params)
        // return new Promise((resolve, reject) => {
        //   // setTimeout(() => {
        //   Module.editZcom(params)
        //     .then((r) => {
        //       item.loading = false
        //       if (r.code === 200) {
        //         return resolve(true)
        //       } else {
        //         // ElMessage({
        //         //   showClose: true,
        //         //   message: r.msg,
        //         //   type: "error"
        //         // })
        //         ElMessage.error(r.msg)
        //         return reject(false)
        //       }
        //     })
        //     .catch(() => {
        //       item.loading = false
        //       return reject(false)
        //     })
        // })
      },
      onChange(val: any) {
        console.log('onChange', val)
      }
    })
    // 查询组件列表
    const getZcomList = async (feedbackType?: string) => {
      const params: any = {
        current: data.currentPage,
        size: data.pageSize
      }
      for (const key in data.filterData) {
        if (data.filterData[key] !== null && data.filterData[key] !== '') params[key] = data.filterData[key]
      }
      data.loading = true
      const { data: res, code, message }: any = await Module.getZcomListPage(params, feedbackType)
      data.loading = false
      if (code === 200) {
        data.total = res.total
        data.tableData = res.records
        data.tableData.forEach((element) => {
          element.loading = false // 状态切换
        })
        // console.log('8', data.tableData)
      }
    }
    // 删除组件
    const removeZcom = async (bh: number) => {
      // console.log('删除组件', bh)
      data.loading = true
      const { data: res, code, msg }: any = await Module.removeZcom(bh, 'messageBox')
      data.loading = false
      if (code === 200) {
        // ElMessage({
        //   showClose: true,
        //   message: '删除成功',
        //   type: "success"
        // })
        ElMessage.success('删除成功')
        getZcomList()
      }
    }
    // 编辑组件
    const editZcom = async (params: any, message?: string) => {
      console.log('编辑组件', params)
      data.saveLoading = true
      const { data: res, code, msg }: any = await Module.editZcom(params, 'messageBox')
      data.saveLoading = false
      if (code === 200) {
        // ElMessage({
        //   showClose: true,
        //   message: '保存成功',
        //   type: "success"
        // })
        ElMessage.success(message || '保存成功')
        // getZcomList()
        // 编辑成功修改列表对应组件数据
        let editedModule = data.tableData?.find((item) => item.bh === params.bh)
        for (const key in params) {
          if (key !== 'bh') {
            editedModule[key] = params[key]
          }
        }
        data.dialogFormVisible = false
      }
    }

    onMounted(() => {
      // onkeydown()
      // console.log('onMounted')
      // getZcomList()
      // console.log('onMounted', formEdit)
    })
    onActivated(() => {
      getZcomList()
    })
    const refData = toRefs(data)
    return {
      token: computed(() => state.token),
      filterPlatType: computed(() => {
        // let arr = data.platTypeLevel
        let arr = []
        let parentCode = ''
        let code = ''
        const platTypeArr = data.currentModule.platType?.split(',')
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
      ...refData,
      forms,
      Search,
      Refresh,
      Plus,
      Edit,
      showDrawer
      // switchPlatType
    }
  },
  methods: {}
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