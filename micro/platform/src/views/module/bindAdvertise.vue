<template lang="pug">
div
  el-form(label-width='140px')
    el-row.group-input-box(:gutter='10')
      el-col(:xs='16', :sm='16', :md='16', :lg='18', :xl='18')
        el-form-item(label='显示广告最大数量')
          el-input-number(v-model='maxNumber', :min='1', :max='15', @change='numberOnChange')
      el-col.text-right(:xs='8', :sm='8', :md='8', :lg='6', :xl='6')
        el-button(:icon='Plus', type='primary', @click='add') 添加
    //- | {{tableData}}
  //- el-alert.margin-bottom-2x(v-if="!currentModule.mySource" title="" type="warning" :closable="false")
    template(#title)
      | {{currentModule?.name}}组件在用户端最多显示{{maxNumber}}个，点击&nbsp;
      //- el-icon.font-size-20.text-gray-7(name="s-operation")
      el-icon.font-size-16.text-gray-7(style="position: relative; top:2px")
        Operation
      |  拖拽可调整应用显示顺序
  TableTitle(:title='currentModule?.name + "广告列表"')
  el-table(:data='tableData', style='width: 100%', border, v-loading='tableLoading', size='medium', row-key='id', :row-class-name='tableRowClassName', @selection-change='handleSelectionChange')
    el-table-column(prop='id', label='编号', align='center', width='100')
    el-table-column(prop='status', label='用户端显示状态')
      template(#default='scope')
        .dot-box
          el-badge.mark(is-dot, :type='scope.$index < maxNumber ? "primary" : "info"')
          span.text {{ scope.$index < maxNumber ? "显示" : "不显示" }}
    el-table-column(prop='title', label='广告名称')
    el-table-column(prop='imageUrl', label='广告图片', width='175')
      template(#default='scope')
        el-image.picture(:src='scope.row.imageUrl')
    el-table-column(prop='platType', label='终端类型')
      template(#default='scope')
        div(v-if='scope.row.platType')
          el-tag(v-for='(ele, i) in scope.row.platType.split(",")', :key='i')
            span {{ platTypeLevel.find((e) => e.code === ele)?.name }}
            //- span(v-if='i < scope.row.platType.split(",").length - 1') &nbsp;/&nbsp;
    el-table-column(prop='publishDatetime', label='开始时间')
    el-table-column(prop='endPublishDatetime', label='结束时间')
    el-table-column(label='操作', width='200', align='center')
      template(#default='scope')
        //- el-button(size="mini" plain type="primary" @click="checkApp(scope.row)") 查看
        el-button(size='mini', plain, type='danger', @click='remove(scope.row, scope.$index)') 移除
    el-table-column(label='拖拽排序', width='90', align='center')
      template(#default='scope')
        .pointer(style='padding: 4px')
          el-icon.font-size-20.text-gray-7
            Operation
  //- el-dialog(v-model='appDetailsVisible' :width='820', title="查看应用" @closed="appDetailsVisible = false")
    div(style="width:100%")
      //- | {{currentApp}}
      app-detail(:info="currentApp")
  el-dialog(v-model='dialogFormVisible', :width='800', title='添加绑定广告')
    el-row.group-input-box(:gutter='10')
      el-col(:xs='8', :sm='8', :md='8', :lg='8', :xl='8')
        el-input.margin-bottom-2x(v-model='search', size='small', placeholder='请输入广告名称搜索')
    el-table(v-if='dialogFormVisible', height='460', :data='filterTableData', @selection-change='handleSelectionChange', v-loading='allDataLoading', scrollbar-always-on, :row-key='getRowKeys', @select='handleSelect')
      el-table-column(type='selection', width='50', align='center', :reserve-selection='true')
      el-table-column(prop='id', label='编号', align='center', width='100')
      el-table-column(prop='title', label='广告名称')
      el-table-column(prop='imageUrl', label='广告图片', width='175')
        template(#default='scope')
          el-image.picture(:src='scope.row.imageUrl')
      el-table-column(prop='platType', label='终端类型')
        template(#default='scope')
          div(v-if='scope.row.platType')
            el-tag(v-for='(ele, i) in scope.row.platType.split(",")', :key='i')
              span {{ platTypeLevel.find((e) => e.code === ele)?.name }}
              //- span(v-if='i < scope.row.platType.split(",").length - 1') &nbsp;/&nbsp;
    template(#footer='')
      el-button(@click='cancelTable') 取消
      el-button(type='primary', @click='confirm', :loading='saveLoading', :disabled='selectionData.length === 0') 确认添加
        span(v-if='selectionData.length > 0') &nbsp;({{ selectionData.length }})
</template>

  <script lang="ts">
import { defineComponent, reactive, toRefs, ref, onMounted, getCurrentInstance, watch, nextTick, computed, onActivated } from 'vue'
import { App, Module } from '@/service/platform'
import { Cloud } from '@/service/cloud'
// import { msgbox, IMsgBoxOptions } from '@/hooks/subMessageBox'
// import SubDialog from '@/components/subDialog.vue'
import { useRouter } from 'vue-router'
import Sortable from 'sortablejs'
import { useStore } from 'vuex'
import { key } from '@/store/index'
import { Operation, Plus } from '@element-plus/icons-vue'
import TableTitle from '@/components/tableTitle.vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { ElTable } from 'element-plus'
// operation
// import AppDetail from '../application/components/appDetailAll.vue'
export default defineComponent({
  components: { Operation, TableTitle },
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
      allAdvData: [] as any[],
      test: [] as any[],
      userTypeList: state.userTypeList,
      platTypeList: state.platTypeList,
      platTypeLevel: state.platTypeLevel,
      frontConfig: state.frontConfig,
      // platTypeLevel: state.platTypeLevel,
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
        getAdvAllList()
        // console.log('add')
      },
      remove: (item: any, index: number) => {
        ElMessageBox.confirm('确定移除广告"' + item.title + '"？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            console.log('confirm')
            const list: any = []
            data.tableData.forEach((element: any) => {
              if (element.id !== item.id) list.push(item.id)
            })
            const params = {
              componentId: data.currentModule.bh,
              advertisingIdList: list
            }
            data.tableLoading = true
            // 组件删除应用
            Module.setComBindAdvertising(params, 'messageBox')
              .then((r: any) => {
                data.tableLoading = false
                // data.dialogFormVisible = false
                if (r.code === 200) {
                  ElMessage({
                    showClose: true,
                    message: '移除成功',
                    type: 'success'
                  })
                  data.tableData.splice(index, 1)
                }
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
          list.push(element.id)
        })
        data.tableData.forEach((element) => {
          list.push(element.id)
        })
        const params = {
          componentId: data.currentModule.bh,
          advertisingIdList: list
        }
        // 组件添加应用
        Module.setComBindAdvertising(params, 'messageBox')
          .then((r) => {
            data.dialogFormVisible = false
            data.saveLoading = false
            ElMessage.success('添加成功')
            getComBindAd()
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
        Module.editZcom(params)
        // console.log('numberOnChange', currentValue, oldValue)
      }
    })
    data.maxNumber = data.currentModule?.maxNumber || data.currentModule?.extraConfig?.maxNumber || 0
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
    // 本地获取组件绑定广告
    const getComBindAd = async () => {
      data.tableLoading = true
      const params: any = {
        componentId: data.currentModule.bh
      }
      const { data: res, code, msg }: any = await Module.getComBindAdvertising(params, 'messageBox')
      data.tableLoading = false
      if (code === 200) {
        data.tableData = res
        // data.bindableList = res.noComAppList
        console.log('getComBindAd', res, code, msg)
      }
    }
    // // 云端获取组件绑定应用
    // const getCloudBindApp = async () => {
    //   data.tableLoading = true
    //   const params: any = {
    //     comCode: data.currentModule.comCode
    //   }
    //   const { data: res, status, message }: any = await Cloud.getModuleBindApp(params)
    //   data.tableLoading = false
    //   if (status === 200) {
    //     data.tableData = res
    //     data.test = [1, 2, 3]
    //     // console.log('getModuleBindApp', res, status, message)
    //     getAppAllList()
    //   } else {
    //     ElMessage.error(message)
    //   }
    // }
    // 设置组件绑定广告 -- 排序
    const setComBindAd = async (advertisingIdList: any) => {
      const params = {
        componentId: data.currentModule.bh,
        advertisingIdList
      }
      // console.log('setComBindApp', params)
      // setComBindApp
      const { data: res, code, msg }: any = await Module.setComBindAdvertising(params, 'messageBox')
      if (code === 200) {
        // data.tableData = res
        console.log('setComBindAd', res, code, msg)
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
              list.push(element.id)
            })
            // console.log(list)
            setComBindAd(list)
          })
        }
      })
      // console.log(data.Sortable.toArray())
    }
    // 查询广告
    // let allApp: any = []
    const getAdvAllList = async () => {
      const params: any = {
        // current: data.current,
        // size: data.size,
        type: 5,
        platType: data.currentModule.platType
        // isPublish: table.formData.isPublish,
        // platTypeList: table.formData.platTypeValue,
        // componentList: table.formData.componentValue,
        // tellGroupList: table.formData.groupValue,
        // title: table.formData.title || '',
        // current: table.currentPage,
        // size: table.pageSize
      }
      // let allApp = []
      const { data: list, code, msg }: any = await Module.getAdvertList(params)
      if (code === 200) {
        // list.filter((item: any) => data.tableData.findIndex(subitem => subitem.id === item.id) === -1)
        // list.forEach((element: any, i: number) => {
        //   const index = data.tableData.findIndex((item: any) => item.id === element.id)
        //   if (index > -1) {
        //     console.log(index)
        //     // element.installFlag = 1
        //     // list.splice(0, i)
        //   }
        // })
        data.allAdvData = list.filter((item: any) => data.tableData.findIndex((subitem) => subitem.id === item.id) === -1)
        console.log(list, code, msg)
        // data.test = [1, 2, 3]
      } else {
        ElMessage.error(msg)
      }
    }

    // const multipleTableRef = ref<InstanceType<typeof ElTable>>()
    const cancelTable = () => {
      //   console.log(multipleTableRef)
      //   // multipleTableRef.value!.clearSelection()
      data.dialogFormVisible = false
    }

    watch(data.tableData, (r) => {
      console.log('watch', r)
    })
    const filterTableData = computed(() => data.allAdvData.filter((item: any) => !data.search || item.title.toLowerCase().includes(data.search.toLowerCase())))
    onMounted(() => {
      // alert(data.currentModule?.name)
      // getData()
      // if (data.currentModule.mySource) {
      //   // 云端数据
      //   getCloudBindApp()
      //   // console.log('---', data.allAdvData, data.tableData)
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
      data.maxNumber = data.currentModule.maxNumber || 0
      getComBindAd()
      initSortable()
      // if (data.currentModule.mySource) {
      //   // 云端数据
      //   // getCloudBindApp()
      //   // console.log('---', data.allAdvData, data.tableData)
      // } else {
      //   // 本地数据
      //   // getLocalComBindApp()
      // }
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
      cancelTable
    }
  }
})
</script>
  <style scope lang="scss">
.el-table .warning-row {
  background: #fafafa;
  /* --el-table-tr-bg-color: var(--el-color-warning-light-9); */
}
.el-table .success-row {
  /* --el-table-tr-bg-color: var(--el-color-success-light-9); */
}
.picture {
  display: block;
  width: 150px;
  img {
    max-width: auto;
  }
}
</style>
