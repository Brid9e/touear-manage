<template lang="pug">
div
  //- el-button.margin-bottom-2x(:icon='ArrowLeft', link, type='primary', style='') 返回
  //- el-button.margin-bottom-2x(:icon='ArrowLeft', style='' link) 返回
  //- el-page-header.margin-bottom-2x(:content="title" @back="back")
  //- | {{options.isCloud}} maxNumber {{maxNumber}}
  //- 云端数据
  template(v-if='!currentModule.mySource')
    el-form(label-width='140px')
      el-row.group-input-box(:gutter='10')
        el-col(:xs='16', :sm='16', :md='16', :lg='18', :xl='18')
          el-form-item(label='显示应用最大数量')
            el-input-number(v-model='maxNumber', :min='1', :max='99', @change='numberOnChange')
        el-col.text-right(:xs='8', :sm='8', :md='8', :lg='6', :xl='6')
          el-button(:icon='Plus', type='primary', @click='add') 添加
    //- | {{tableData}}
  el-alert.margin-bottom-2x(v-if='!currentModule.mySource', title='', type='warning', :closable='false')
    template(#title)
      | {{ currentModule.name }}组件在用户端最多显示{{ maxNumber }}个，点击&nbsp;
      //- el-icon.font-size-20.text-gray-7(name="s-operation")
      el-icon.font-size-16.text-gray-7(style='position: relative; top: 2px')
        Operation
      | 拖拽可调整应用显示顺序
  TableTitle(:title='(currentModule.name || currentModule.comName) + "应用列表(数量：" + tableData.length + ")"')
  el-table(:data='tableData', style='width: 100%', border, v-loading='tableLoading', row-key='bh', :row-class-name='tableRowClassName', @selection-change='handleSelectionChange')
    el-table-column(v-if='!currentModule.mySource', prop='bh', label='编号', align='center', width='100')
    //- el-table-column(v-if="!currentModule.mySource" prop="appId" label="id" align="center" width="100")
    //- el-table-column(prop="appIconWhole" label="应用图标" align="center" width="100")
      template(#default="scope")
        el-image(style="height: 30px" :src="scope.row.extraConfig.img[0].src")
    el-table-column(v-if='!currentModule.mySource', prop='status', label='用户端显示状态')
      template(#default='scope')
        .dot-box
          el-badge.mark(is-dot, :type='scope.$index < maxNumber ? "primary" : "info"')
          span.text {{ scope.$index < maxNumber ? "显示" : "不显示" }}
    el-table-column(v-else, prop='installFlag', label='安装状态', align='center', width='90')
      template(#default='scope')
        el-tag(:type='allAppData.findIndex((item) => item === scope.row.appCode) > -1 ? "success" : ""') {{ allAppData.findIndex((item) => item === scope.row.appCode) > -1 ? "已安装" : "未安装" }}
    el-table-column(prop='appName', label='应用名称')
    //- el-table-column(prop="appNameEn" label="英文名称")
    el-table-column(prop='appCode', label='应用代码')
    el-table-column(prop='appUserType', label='用户类型')
      template(#default='scope')
        div(v-if='scope.row.appUserType')
          span(v-if='scope.row.appUserType === "common"')
            el-tag.margin-right-x(v-for='(item, i) in userTypeList')
              | {{ item.name }}
              //- span(v-if='i + 1 < userTypeList.length') &nbsp;/&nbsp;
          el-tag.margin-right-x(v-else)
            | {{ userTypeList.find((item) => item.label === scope.row.appUserType)?.name }}
    el-table-column(prop='appPlatType', label='终端类型' width='400')
      template(#default='scope')
        div(v-if='scope.row.appPlatType')
          span(v-for='(ele, i) in scope.row.appPlatType.split(",")', :key='i')
            el-tag.margin-right-x {{ platTypeLevel.find((e) => e.code === ele).name }}
            //- span(v-if='i < scope.row.appPlatType.split(",").length - 1') &nbsp;/&nbsp;
        div(v-else-if='scope.row.platType')
          span(v-for='(ele, i) in scope.row.platType.split(",")', :key='i')
            el-tag.margin-right-x {{ platTypeLevel.find((e) => e.code === ele).name }}
            //- span(v-if='i < scope.row.platType.split(",").length - 1') &nbsp;/&nbsp;
    el-table-column(v-if='!currentModule.mySource', label='操作', width='90', align='center')
      template(#default='scope')
        //- el-button(size="mini" plain type="primary" @click="checkApp(scope.row)") 查看
        //- el-button(size='small', plain, type='danger', @click='remove(scope.row, scope.$index)') 移除
        el-button(link, type='danger', @click='remove(scope.row, scope.$index)') 移除
    el-table-column(v-if='!currentModule.mySource', label='拖拽排序', width='90', align='center')
      template(#default='scope')
        .pointer(style='padding: 4px')
          el-icon.font-size-20.text-gray-7
            Operation
  //- el-dialog(v-model='appDetailsVisible' :width='820', title="查看应用" @closed="appDetailsVisible = false")
    div(style="width:100%")
      //- | {{currentApp}}
      app-detail(v-if="appDetailsVisible" :info="currentApp")
  el-dialog(v-model='dialogFormVisible', :width='800', title='添加绑定应用')
    //- p {{allAppData}}
    //- div()
      //- el-scrollbar
    //- | {{filterTableData}}
    el-row.group-input-box(:gutter='10')
      el-col(:xs='8', :sm='8', :md='8', :lg='8', :xl='8')
        el-input.margin-bottom-2x(v-model='search', size='small', placeholder='请输入应用名称搜索')
    el-table(v-if='dialogFormVisible', height='460', :data='filterTableData', @selection-change='handleSelectionChange', v-loading='allDataLoading', scrollbar-always-on, :row-key='getRowKeys', @select='handleSelect')
      el-table-column(type='selection', width='50', align='center', :reserve-selection='true')
      el-table-column(prop='appName', label='应用名称')
      el-table-column(prop='appCode', label='应用代码')
      el-table-column(prop='appUserType', label='用户类型')
        template(#default='scope')
          div(v-if='scope.row.appUserType')
            span(v-if='scope.row.appUserType === "common"')
              span(v-for='(item, i) in userTypeList')
                | {{ item.name }}
                span(v-if='i + 1 < userTypeList.length') &nbsp;/&nbsp;
            span(v-else)
              | {{ userTypeList.find((item) => item.label === scope.row.appUserType)?.name }}
        //- template(#header)
          el-input(v-model="search" size="small" placeholder="搜索应用名称")
        //- template(#default="scope")
          //- span(v-if="scope.row.appUserType") {{userTypeList.find(item => item.label === scope.row.appUserType).name}}
    template(#footer='')
      el-button(@click='dialogFormVisible = false') 取消
      el-button(type='primary', @click='confirm', :loading='saveLoading', :disabled='selectionData.length === 0') 确认添加
        span(v-if='selectionData.length > 0') &nbsp;({{ selectionData.length }})
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs, onMounted, getCurrentInstance, watch, nextTick, computed, onActivated } from 'vue'
import { App, Module } from '@/service/platform'
import { Cloud } from '@/service/cloud'
// import { msgbox, IMsgBoxOptions } from '@/hooks/subMessageBox'
// import SubDialog from '@/components/subDialog.vue'
import { useRouter } from 'vue-router'
import Sortable from 'sortablejs'
import { useStore } from 'vuex'
import { key } from '@/store/index'
import { Operation, Plus, ArrowLeft } from '@element-plus/icons-vue'
import TableTitle from '@/components/tableTitle.vue'
import { ElMessage, ElMessageBox } from 'element-plus'
// operation
// import AppDetail from '../application/components/appDetailAll.vue'
export default defineComponent({
  components: { Operation, TableTitle, ArrowLeft },
  props: [],
  data() {
    return {}
  },
  setup(props) {
    const { state } = useStore(key)
    const router = useRouter()
    const currentModule: any = sessionStorage.getItem('currentModule') || ''
    const data = reactive({
      // size: 0,
      title: router.currentRoute.value.meta.title,
      currentModule: JSON.parse(currentModule),
      total: 0,
      tableData: [] as any[],
      // list: [] as any[],
      tableLoading: false,
      dialogFormVisible: false,
      selectionData: [] as any[],
      allDataLoading: false,
      saveLoading: false,
      allAppData: [] as any[],
      test: [] as any[],
      userTypeList: state.userTypeList,
      platTypeList: state.platTypeList,
      platTypeLevel: state.platTypeLevel,
      currentApp: {},
      appDetailsVisible: false,
      bindableList: [], // 可绑定应用
      search: '',
      maxNumber: 0,
      // allApp: [],
      back: () => {
        router.back()
        // sessionStorage.removeItem('currentModule')
        // console.log(888)
      },
      add: () => {
        data.dialogFormVisible = true
        // getAllApp()
        // console.log('add')
      },
      remove: (item: any, index: number) => {
        ElMessageBox.confirm('确定移除应用"' + item.appName + '(' + item.appCode + ')"？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            console.log('confirm')
            const list: any = []
            data.tableData.forEach((element: any) => {
              if (element.appCode !== item.appCode) list.push({ appId: element.appId })
            })
            const params = {
              comId: data.currentModule.bh,
              acaList: list
            }
            data.tableLoading = true
            // 组件删除应用
            Module.setComBindApp(params, 'messageBox')
              .then((r: any) => {
                data.tableLoading = false
                // data.dialogFormVisible = false
                if (r.code === 200) {
                  ElMessage({
                    showClose: true,
                    message: '删除成功',
                    type: 'success'
                  })
                  data.tableData.splice(index, 1)
                }
                getLocalComBindApp()
              })
              .catch((err: any) => {
                data.tableLoading = false
                // console.log(err)
              })
          })
          .catch(() => {
            console.log('cancel')
          })
      },
      getRowKeys(row: any) {
        // console.log(row)
        return row.appCode // 返回唯一标记值，这里的 id 是唯一的
      },
      handleSelect(selection: any, row: any) {
        data.selectionData = selection
      },
      handleSelectionChange(val: any) {
        console.log('handleSelectionChange', val)
        data.selectionData = val
      },
      confirm: () => {
        data.saveLoading = true
        const list: any = []
        data.selectionData.forEach((element) => {
          list.push({ appId: element.appId })
        })
        data.tableData.forEach((element) => {
          list.push({ appId: element.appId })
        })
        const params = {
          comId: data.currentModule.bh,
          acaList: list
        }
        // 组件添加应用
        Module.setComBindApp(params, 'messageBox')
          .then((r) => {
            data.dialogFormVisible = false
            data.saveLoading = false
            data.selectionData = []
            ElMessage.success('添加成功')
            getLocalComBindApp()
          })
          .catch((err: any) => {})
      },
      checkApp: (item: any) => {
        data.currentApp = item
        data.appDetailsVisible = true
      },
      numberOnChange: async (currentValue: number, oldValue: number) => {
        const params = {
          bh: data.currentModule.bh,
          maxNumber: currentValue
        }
        Module.editZcom(params, 'messageBox')
        // console.log('numberOnChange', currentValue, oldValue)
      }
    })
    data.maxNumber = data.currentModule.maxNumber || data.currentModule.extraConfig.maxNumber
    // const maxNumber: any = reactive({ maxNumber: data.currentModule.maxNumber || data.currentModule.extraConfig.maxNumber })
    console.log(data.maxNumber)
    const tableRowClassName = ({
      // row,
      rowIndex
    }: {
      // row: User
      rowIndex: number
    }) => {
      if (rowIndex >= data.maxNumber) {
        return 'warning-row'
      }
      return ''
    }
    // 本地获取组件绑定应用
    const getLocalComBindApp = async () => {
      data.tableLoading = true
      const params: any = {
        comId: data.currentModule.bh
      }
      const { data: res, code, msg }: any = await Module.getComBindApp(params, 'messageBox')
      data.tableLoading = false
      if (code === 200) {
        data.tableData = res.yesComAppList
        data.bindableList = res.noComAppList
        console.log('getModuleBindApp', data, code, msg)
      } else {
        ElMessage.error(msg)
      }
    }
    // 云端获取组件绑定应用
    const getCloudBindApp = async () => {
      data.tableLoading = true
      const params: any = {
        comCode: data.currentModule.comCode
      }
      const { data: res, status, message }: any = await Cloud.getModuleBindApp(params, 'messageBox')
      data.tableLoading = false
      if (status === 200) {
        data.tableData = res
        data.test = [1, 2, 3]
        // console.log('getModuleBindApp', res, status, message)
        getAppAllList()
      } else {
        ElMessage.error(message)
      }
    }
    // 设置组件绑定应用 -- 排序
    const setLocalComBindApp = async (acaList: any) => {
      const params = {
        comId: data.currentModule.bh,
        acaList
      }
      console.log('setComBindApp', params)
      // setComBindApp
      const { data: res, code, msg }: any = await Module.setComBindApp(params, 'messageBox')
      if (code === 200) {
        // data.tableData = res
        console.log('setLocalComBindApp', res, code, msg)
      }
    }

    const initSortable = () => {
      const tbody: any = document.querySelector('.el-table__body-wrapper tbody')
      Sortable.create(tbody, {
        animation: 200,
        onEnd: (e: any) => {
          console.log(e, e.oldIndex, e.newIndex)
          let arr = data.tableData // 获取表数据
          arr.splice(e.newIndex, 0, arr.splice(e.oldIndex, 1)[0]) // 数据处理
          nextTick(() => {
            data.tableData = arr
            console.log('setLocalComBindApp', arr)
            const list: any = []
            arr.forEach((element) => {
              list.push({ appId: element.appId })
            })
            setLocalComBindApp(list)
          })
        }
      })
      // console.log(data.Sortable.toArray())
    }
    // 查询本地已安装应用
    // let allApp: any = []
    const getAppAllList = async () => {
      // let allApp = []
      const { data: list, code, msg }: any = await App.getAppAll({ flagIsSelfApp: 0 })
      if (code === 200) {
        data.allAppData = list
        // console.log(list, code, msg)
        // data.test = [1, 2, 3]
      } else {
        ElMessage.error(msg)
      }
    }

    watch(data.tableData, (r) => {
      console.log('watch', r)
    })
    const filterTableData = computed(() => data.bindableList.filter((item: any) => !data.search || item.appName.toLowerCase().includes(data.search.toLowerCase())))
    onMounted(() => {
      // alert(data.currentModule.name)
      // getData()
      // if (data.currentModule.mySource) {
      //   // 云端数据
      //   getCloudBindApp()
      //   // console.log('---', data.allAppData, data.tableData)
      // } else {
      //   // 本地数据
      //   getLocalComBindApp()
      //   initSortable()
      // }
      // if (!props.options.isCloud) initSortable()
    })
    onActivated(() => {
      // alert('onActivated')
      // console.log('onActivated', data.currentModule)
      const currentModule: any = sessionStorage.getItem('currentModule') || ''
      data.currentModule = JSON.parse(currentModule)
      data.maxNumber = data.currentModule?.maxNumber || data.currentModule?.extraConfig?.maxNumber
      if (data.currentModule.mySource) {
        // 云端数据
        getCloudBindApp()
        // console.log('---', data.allAppData, data.tableData)
      } else {
        // 本地数据
        getLocalComBindApp()
        initSortable()
      }
    })
    const refData = toRefs(data)
    // const refMaxNumber = toRefs(data.maxNumber)
    return {
      // token: computed(() => state.token),
      ...refData,
      // ...refMaxNumber,
      tableRowClassName,
      filterTableData,
      Plus,
      ArrowLeft
    }
  }
})
</script>
<style>
.el-table .warning-row {
  background: #fafafa;
  /* --el-table-tr-bg-color: var(--el-color-warning-light-9); */
}
.el-table .success-row {
  /* --el-table-tr-bg-color: var(--el-color-success-light-9); */
}
</style>
