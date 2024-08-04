<template lang="pug">
div
  //- p {{ currentMenu }}
  TableTitle(:title="(currentMenu ? currentMenu.name : '') + '子菜单列表'")
    el-button(type='primary', @click='add(null)') 添加子菜单
  el-table(:data="tableData" style="width: 100%; margin-bottom: 20px" row-key="bh" border default-expand-all)
    //- default-expand-all
    el-table-column(prop="name" label="菜单名称" )
    el-table-column(prop="myIconList" label="图标" align="center" width="80")
      template(#default='scope')
        //- div {{scope.row.myIconList }}
        div(v-if="scope.row.myIconList && scope.row.myIconList[scope.row.platType]")
          span(v-for="(item, i) in scope.row.myIconList[scope.row.platType]" :key="i")
            //- | {{ item.src }}
            el-image(v-if="item.src" :src="item.src" style="width: 36px; height: 36px;")
          //- {{ scope.row.myIconList[scope.row.platType]}}
        //- img(v-if="scope.row.myIconObj && scope.row.myIconObj[scope.row.platType]" :src="scope.row.myIconObj[scope.row.platType]")
    el-table-column(prop="bh" label="编号")
    el-table-column(prop='indexCode', label='菜单代码')
    //- el-table-column(prop='platType', label='终端类型')
    //- el-table-column(prop='url', label='地址')
    el-table-column(label='添加子菜单', width='100' align='center')
      template(#default='scope')
        el-button(link type="primary" @click='add(scope.row)') 添加
    el-table-column(label='操作', width='160' align='center')
      template(#default='scope')
        el-button(link type="primary" @click='checkMenu(scope.row)') 查看
        el-button(link type="info" @click='editMenu(scope.row)') 编辑
        el-button(link type="danger" @click='deleteMenu(scope.row)') 删除
    el-table-column(label='排序', width='100' align='center')
      template(#default='scope')
        //- p {{scope.row.myIndex}}
        //- p {{scope.row.myLength}}
        el-button-group
          el-button(v-if="scope.row.myIndex !== 0" :icon="Top" circle @click="sort('up', scope.row)")
          el-button(v-if="scope.row.myIndex + 1 !== scope.row.myLength" :icon="Bottom" circle @click="sort('down', scope.row)")
        //- el-button(link type="primary" @click='add(scope.row)') 添加
        //- el-table-column(label='顺序', width='100' align='center')
  el-dialog(v-model='addDialog' :width='800',title="添加子菜单" destroy-on-close)
    AddSubmenu(ref="addSubmenuRef", @addType="getAddType", @appList="getAppList" :data="{boundAppList}" @subMenuForm="getSubMenuForm")
    template(#footer='')
      el-button(@click="addDialog = false") 取消
      el-button(type="primary" @click="confirm" :loading="addLoading" :disabled="addType === 0 ? selectionData.length === 0 : false") 确认添加
        span(v-if="addType === 0 && selectionData.length > 0") &nbsp;({{selectionData.length}})
  el-dialog(v-model='dialogFormVisible', :width='600', :title='(dialogStatus ? "编辑" : "查看") + "菜单：" + currentSubMenu?.name + " (" + currentSubMenu?.indexCode + ")"'
    @close="dialogStatus = null")
    //- template(v-if='!dialogStatus')
    MenuDetails(v-if='dialogStatus === 0' :data="{currentMenu: currentSubMenu, isCloud: 0, platType: 'pc'}")
    EditMenu(ref="editFormRef" v-else-if="dialogStatus === 1" :data="{currentMenu: currentSubMenu, rules, platType: 'pc', isStatus: false}"  @submit="submitForm")
    template(#footer, v-if='dialogStatus')
      el-button(@click='dialogFormVisible = false') 取消
      el-button(type='primary', @click='saveForm', :loading='saveLoading') 保存
</template>

<script lang="ts">
import { ref, defineComponent, reactive, toRefs, onMounted, getCurrentInstance, watch, nextTick, computed, onActivated} from 'vue'
import { App, Menu } from '@/service/platform'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { key } from '@/store/index'
import { Operation, Plus, ArrowUpBold, ArrowDownBold, Top, Bottom, Chicken} from '@element-plus/icons-vue'
import TableTitle from '@/components/tableTitle.vue'
import AddSubmenu from './addSubmenu.vue'
import MenuDetails from './components/details.vue'
import EditMenu from './components/edit.vue'
import { ElMessage, ElMessageBox } from "element-plus"
import { sortBy } from 'lodash'

export default defineComponent({
  components: { Operation,
    TableTitle,
    AddSubmenu,
    MenuDetails,
    EditMenu },
  props: [],
  data() {
    return {}
  },
  setup(props) {
    const { state } = useStore(key)
    const router = useRouter()
    const validateIndexCode = (rule: any, value: any, callback: any) => {
      // console.log('validateIndexCode', rule, value, /s/.test(value))
      if (/\s/.test(value)) {
        callback(new Error('不能包含空格'))
      } else {
        callback()
      }
    }

    const addSubmenuRef: any = ref(null)
    const editFormRef: any = ref(null)
    const data: any = reactive({
      // size: 0,
      // title: router.currentRoute.value.meta.title,
      currentMenu: null,
      // total: 0,
      tableData: [] as any[],
      // // list: [] as any[],
      // tableLoading: false,
      addDialog: false,
      selectionData: [] as any[],
      allDataLoading: false,
      addLoading: false,
      // allAppData: [] as any[],
      boundAppList: [] as any[], // 已绑定应用
      // test: [] as any[],
      userTypeList: state.userTypeList,
      platTypeList: state.platTypeList,
      iconModeList: state.iconModeList,
      search: '',
      // maxNumber: 0,
      addSubMenuObj: null, // 待添加子菜单的菜单信息
      addType: 0,
      dialogFormVisible: false,
      dialogStatus: null, // 0->查看  1->编辑
      currentSubMenu: null,
      saveLoading: false,
      rules: {
        // 表单规则
        name: [
          {
            required: true,
            message: '请填写菜单名称',
            trigger: 'blur'
          },
          {
            min: 1,
            max: 20,
            message: '内容长度必须小于20',
            trigger: 'change'
          }
        ],
        nameEn: [
          {
            required: true,
            message: '请填写菜单英文名称',
            trigger: 'blur'
          },
          {
            min: 1,
            max: 50,
            message: '内容长度必须小于50',
            trigger: 'change'
          }
        ],
        indexCode: [
          {
            required: true,
            message: '请填写菜单索引码',
            trigger: 'blur'
          },
          {
            min: 1,
            max: 50,
            message: '内容长度必须小于50',
            trigger: 'change'
          },
          {
            validator: validateIndexCode,
            trigger: 'change'
          }
        ],
        type: [
          {
            // required: true,
            message: '请选择用户类型',
            trigger: 'blur'
          }
        ]
      },
      add: (menu?: any) => {
        data.addDialog = true
        data.addSubMenuObj = menu || null
        // if (data.allAppData.length === 0) getAppAllList()
        console.log('menu', menu ? menu.children : null)
        console.log('tableData', data.tableData)
        if (menu) {
        data.boundAppList = menu.children ? menu.children.filter((item: any) => item.appId) : []
        data.boundAppList.push(menu)
        // console.log(menu.children.filter((item: any) => item.appId))
        } else {
          data.boundAppList = data.tableData.filter((item: any) => item.appId)
        }
        console.log('boundAppList', data.boundAppList)
      },
      deleteMenu: (item: any) => {
        // 删除
        console.log('删除菜单:', item.bh, item.name)
        ElMessageBox.confirm('确定删除菜单"' + (item.name || '')+ '"？', "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          // alert(item.bh)
          reomoveZindex(item.bh)
        }).catch(() => {
          console.log('cancel')
        })
      },
      // 查看
      checkMenu: (item: any) => {
        // data.currentMenu = item
        // data.dialogStatus = 0
        // data.addDialog = true
        // currentSubMenu
        data.currentSubMenu = item
        data.dialogStatus = 0
        data.dialogFormVisible = true
        console.log('查看菜单:', item.bh, item.name)
      },
      editMenu: (item: any) => {
        // 编辑
        console.log('编辑菜单:', item.bh, item.name)
        data.currentSubMenu = item
        data.dialogStatus = 1
        data.dialogFormVisible = true
        // data.currentMenu = item
        // data.dialogStatus = 1
        // data.addDialog = true
      },
      getRowKeys(row: any) {
        // console.log(row)
        return row.appCode // 返回唯一标记值，这里的 id 是唯一的
      },
      // handleSelect(selection: any, row: any) {
      //   data.selectionData = selection
      // },
      // handleSelectionChange(val: any) {
      //   console.log('handleSelectionChange', val)
      // },
      confirm: () => {
        if (data.addType === 0) {
          data.addLoading = true
          const menu = data.addSubMenuObj || data.currentMenu
          const formData = new FormData()
          data.selectionData.forEach((element: any, i: number) => {
            formData.append(`zAppIndex[${i}].ancestor`, menu.bh)
            formData.append(`zAppIndex[${i}].appId`, element.bh)
            formData.append(`zAppIndex[${i}].indexType`, '1')
          })
          addSubMenu(menu, formData)
        } else {
          addSubmenuRef.value.customFormSubmit()
        }
        // const list: any = []
        // data.selectionData.forEach((element: any) => {
        //   list.push({ appId: element.appId })
        // })
        // console.log('list', list)
      },
      getAddType: (type: any) => {
        console.log('getAddType', type)
        data.addType = type // 0 应用 1 自定义菜单
      },
      getAppList: (list: any) => {
        console.log('getAppList', list)
        data.selectionData = list
      },
      getSubMenuForm: (formData: any) => {
        data.addLoading = true
        const menu = data.addSubMenuObj || data.currentMenu
        formData.append(`zAppIndex[0].ancestor`, menu.bh)
          // formData.append(`zAppIndex[0].appId`, element.bh)
        formData.append(`zAppIndex[0].indexType`, '0')
        addSubMenu(menu, formData, () => {
          addSubmenuRef.value.customFormClear()
        })
      },
      sort: (type: string, row: any) => {
        console.log(type)
        console.log(row)
        let list: any = [] // 同级菜单
        const index = row.myIndex
        const nextIndex = type === 'down' ? index + 1 : index - 1
        console.log(index, nextIndex)
        if (row.ancestor === data.currentMenu.bh) {
          // console.log('1', data.tableData)
          list = data.tableData
        } else {
          list = searchTree(data.tableData, row.ancestor)?.children
          // console.log('list', list)
        }
        if (!list) {
          ElMessage.error('数据有误')
          return false
        }
        const arr:any = []
        list.forEach((element: any) => {
          arr.push (element.bh)
        })
        console.log('arr', arr, index, nextIndex)
        const obj: any = {}
        const t = arr[index]
        arr[index] = arr[nextIndex]
        arr[nextIndex] = t
        arr.forEach((element: any, i: number) => {
          obj[element] = i
        })
        console.log(arr, obj)
        subMenuSort(obj, () => {
          const m = list[index]
          list[index] = list[nextIndex]
          list[nextIndex] = m
          list[index].myIndex = index
          list[nextIndex].myIndex = nextIndex
          // console.log('subMenuSort', obj)
        })
      },
      saveForm: () => {
        console.log(editFormRef.value)
        editFormRef.value.confirm()
      },
      submitForm: (valid: boolean, isFormData: boolean, data: any) => {
        // alert(valid)
        // editZindex(params, '', true)
        // const isFormData = true
        // const data = null
        // const params = null
        if (!valid) {
          // ElMessage({
          //   showClose: true,
          //   message: '请正确填写菜单信息',
          //   type: 'error'
          // })
          ElMessage.error('请正确填写菜单信息')
          return false
        }
        if (isFormData) {
          // formData
          editZindexFormData(data)
        // } else {
        //   //字段
        //   editZindex(data)
        }
      },
      // changeStatus: (item: any) => {
      //   console.log('编辑状态', item)
      // },
    })
    const searchTree = (treeList: any, key: number) => {
      let result: any  = null
      if (!treeList) return // return; 中断执行
      for (let i in treeList) {
        if (result !== null) break
        let item = treeList[i]
        if (item.bh === key) {
            result = item;
            break;
        } else if ( item.children && item.children.length>0 ) {
            result = searchTree(item.children, key)
        }
      }
      return result
      }
    // 查询子菜单
    const getSubMenu = async () => {
      // let allApp = []
      const { data: list, code, msg }: any = await Menu.getChildIndex({ id: data.currentMenu.bh })
      if (code === 200) {
        console.log(list, code, msg, data.platTypeList)
        data.test = [1, 2, 3]
        data.tableData = list
        let arr :any = []
        const map: any  = {};
        // const val = [];
        console.log(data.iconModeList)
        list.forEach((item: any) => {
          map[item.bh] = item
          // 终端类型
          item.platType = 'pc'
          item.platTypeArr = ['pc']
          // 菜单图标
          const myIconList: any = {}
          if (item.icon) {
            const objs: any = JSON.parse(item.icon)
            for (const key in objs) {

              const platTypeCode: any = key.split('#')[0]
              const modelList = data.iconModeList[platTypeCode]
              const platType = data.platTypeList.find((item: any) => item.code === platTypeCode)

              if (platType) {
                const newObj = {
                  name: key,
                  src: objs[key],
                  // platType: element.name.split('#')[0],
                  platType: platType,
                  model: modelList.find((item: any) => item.code === (key.split('#')[1] || 'white'))
                }
                // console.log('newObj', newObj)
                if (!myIconList[platTypeCode]) {
                  myIconList[platTypeCode] = []
                }
                myIconList[platTypeCode].push(newObj)
                // if (myIconList[platTypeCode].length > modelLength) modelLength = modelList.length
              }
              item.myIconList = myIconList
            }
          }
        })
        console.log('list', map)
        // 2、遍历之后，形成树形结构
        list.forEach((item: any) => {
          const parent = map[item.ancestor];
          // console.log('list', map)
          if (parent) {
            console.log()
            // console.log('children', parent.children.length)
            if (!parent.children) {
              parent.children = []
            }
            // item.myIndex = parent.children.length
            parent.children.push(item)
            // (parent.children || (parent.children = [])).push(item)
            parent.children = sortBy(parent.children,  (subitem: any) => {
              // console.log(item)
              return subitem.sort
            })
            parent.children.forEach((element: any, i: number) => {
              element.myIndex = i
              element.myLength = parent.children.length
            })
            // console.log('children', parent.children.length)
          } else if (item.ancestor === data.currentMenu.bh){
            // console.log(item)
            // item.myIndex = arr.length
            arr.push(item)
            arr = sortBy(arr,  (subitem: any) => {
              // console.log(item)
              return subitem.sort
            })
            arr.forEach((element: any, i: number) => {
              element.myIndex = i
              element.myLength = arr.length
            })
            // console.log('arr', arr.length)
          }
        })
        data.tableData = arr
        // console.log('getSubMenu arr', arr)
        // initSortable()
      } else {
        ElMessage.error(msg)
      }
    }
    // 查询本地已安装应用
    // let allApp: any = []
    // const getAppAllList = async () => {
    //   // let allApp = []
    //   data.allDataLoading = true
    //   const { data: list, code, msg }: any = await App.getZappListAll({ platType: 'pc'})
    //   data.allDataLoading = false
    //   if (code === 200) {
    //     data.allAppData = list
    //     console.log(list, code, msg)
    //     // data.test = [1, 2, 3]
    //   } else {
    //     ElMessage({
    //       // showClose: true,
    //       message: msg,
    //       type: 'error'
    //     })
    //   }
    // }
    const addSubMenu = async (menu: any, formData: any, callback?: any) => {
      const { data:list, code, msg }: any = await Menu.addSubZindex(formData)
      if (callback) callback()
      data.addLoading = false
      if (code === 200) {
        ElMessage.success('添加成功')
        data.addDialog = false
        // data.selectionData = []
        getSubMenu()
      } else {
        ElMessage.error(msg)
      }
      // console.log('addSubMenu', list, code, msg)
    }
    // 删除菜单
    const reomoveZindex = async (bh: number) => {
      // console.log('删除组件', bh)
      data.loading = true
      const { data: res, code, msg }: any = await Menu.reomoveZindex(bh, 'messagebox')
      // data.loading = false
      if (code === 200) {
        ElMessage.success('删除成功')
        getSubMenu()
      } else {
        console.log(res)

        // ElMessage.error(msg)
      }
    }
    // 子菜单排序
    const subMenuSort = async (params: any, callback: any) => {
      const { data, code, msg }: any = await Menu.zindexSort(params, 'messagebox')
      console.log(params)
      if (code === 200) {
        callback()
        // getSubMenu()
      } else {
        // ElMessage.error(msg)
      }
    }
    // 编辑菜单formData
    const editZindexFormData = async (formData: any) => {
      console.log('编辑菜单', formData)
      // data.saveLoading = true
      const { data: res, code, msg }: any = await Menu.editZindexFormData(formData, 'messagebox')
      // data.saveLoading = false
      console.log(res, code, msg)
      if (code === 200) {
        getSubMenu()
        ElMessage.success('操作成功')
        // getZindexList()
        data.dialogFormVisible = false

      } else {
        console.log(msg)
        // ElMessage.error(msg)
      }
    }
    // 编辑菜单
    // const editZindex = async (params: any, is?: boolean) => {
    //   console.log('编辑菜单', params)
    //   // data.saveLoading = true
    //   const { data: res, code, msg }: any = await Menu.editZindex(params)
    //   // data.saveLoading = false
    //   if (code === 200) {
    //     ElMessage.success('操作成功')
    //     if (is) {
    //       // getZindexList()
    //       data.dialogFormVisible = false
    //     }
    //   } else {
    //     console.log(res)
    //     ElMessage.error(msg)
    //   }
    // }
    // const filterTableData = computed(() => data.allAppData.filter((item: any) => !data.search || item.appName.toLowerCase().includes(data.search.toLowerCase())))
    onMounted(() => {

    })
    onActivated (() => {
      // console.log('onActivated', data.currentModule)
      const currentMenu: any=  sessionStorage.getItem('currentMenu') || ''
      data.currentMenu = JSON.parse(currentMenu)
      getSubMenu()
    })
    const refData = toRefs(data)
    return {
      ...refData,
      // filterTableData,
      Plus,
      addSubmenuRef,
      ArrowUpBold,
      ArrowDownBold,
      Top,
      Bottom,
      editFormRef
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
