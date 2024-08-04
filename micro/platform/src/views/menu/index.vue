<template lang="pug">
div
  HeadOperation
    el-input(:prefix-icon="Search", v-model='filterData.name', placeholder='通过菜单名称筛选', clearable, style="margin-right:12px;",  @keydown.enter='inquire')
    el-button(:icon='Search', type='primary', @click='inquire') 查询
    el-button(:icon='Refresh', @click='reset') 重置
    template(#right)
      el-button(:icon='Plus',type='primary',@click='add' :disabled="!funcButton.menuListAdd") 添加
    template(#fold)
      //- filter-content
      el-form(label-width='100px' inline)
        el-row
          el-col(:xs="12", :sm="12", :md="8", :lg="6", :xl="4")
            el-form-item(label='菜单名称：')
              el-input(v-model='filterData.name', placeholder='请输入关键字', clearable)
          el-col(:xs="12", :sm="12", :md="8", :lg="6", :xl="4")
            el-form-item(label='状态：')
              el-select(v-model='filterData.status', placeholder='请选择', clearable)
                el-option(v-for='(item, i) in statusList', :key='i', :label='item.label', :value='item.value')
          el-col(:xs="12", :sm="12", :md="8", :lg="6", :xl="4")
            el-form-item(label='用户类型：')
              el-select(v-model='filterData.type', placeholder='请选择', clearable)
                el-option(v-for='(item, i) in userTypeList', :key='i', :label='item.name', :value='item.label')
          el-col(:xs="12", :sm="12", :md="8", :lg="6", :xl="4")
            el-form-item(label='终端类型：')
              el-select(v-model='filterData.platType', placeholder='请选择', clearable)
                el-option(v-for='(item, i) in platTypeLevel', :key='i', :label='item.name', :value='item.code')
          //- el-col(:xs="12", :sm="12", :md="8", :lg="6", :xl="4")
            el-button(:icon="Search", type='primary', @click='inquire') 查询
            el-button(:icon="Refresh", @click='reset') 重置
  .table-content
    //- | --{{funcButton}}
    //- TableTitle(title="菜单列表")
      el-button(type='primary', @click='add') 添加菜单
    el-table(:data='tableData', v-loading='loading', size='medium')
      el-table-column(prop='bh', label='编号', align='center', width='80')
      el-table-column(prop="" label="图标" align="center" width="80")
        template(#default="scope")
          div(v-if="scope.row.myIconList")
            template(v-for="(item, i) in scope.row.myIconList" :key="i")
              div(v-if="scope.row.myModelLength > 1 || scope.row.myIconList.length > 1")
                el-popover(placement='bottom-start', trigger='hover', :width='scope.row.myModelLength * 70')
                  div(v-for="(subitem, j) in scope.row.myIconList" :key="j")
                    //- //- p {{ subitem.length }} {{ type }}
                    p.table-icon-title(v-if="Object.keys(scope.row.myIconList).length > 1")
                      //- {{subitem}}
                      | {{ subitem.list[0].platType.name }}
                    .table-icon-list
                      .img-item.text-center(v-for="(image, m) in subitem.list" :key="m")
                        el-image(:src='image.src + "?v=" + scope.row.updateTime', style='width: 36px; height: 36px')
                          template(#error='')
                            el-image(:src='defaultAppIcon', style='width: 34px; height: 34px')
                        p.font-size-12.text-gray-7(v-if="image.platType.parentCode === 'mobile'") {{ image.model.name }}
                  template(#reference)
                    div.refer-image()
                      el-image(v-if="i==0" :src='item.list[0].src + "?v=" + scope.row.updateTime', style='width: 36px; height: 36px')
                        template(#error='')
                          el-image(:src='defaultAppIcon', style='width: 36px; height: 34px')
                      span.icon-arrowDown(v-if="i==0")
                        ArrowDown
              div(v-else)
                el-image.icon(:src="item.list[0].src + '?v=' + scope.row.updateTime ")
      el-table-column(prop='name', label='菜单名称')
      //- el-table-column(prop="nameEn" label="英文名称")
      el-table-column(prop='indexCode', label='菜单代码')

      el-table-column(prop='type', label='用户类型')
        template(#default="scope")
          div(v-if="scope.row.type")
            span(v-if="scope.row.type === 'common'")
              span.dot-list(v-for="(item, i) in userTypeList") {{ item.name }}
                //- span(v-if="i + 1 < userTypeList.length") &nbsp;/&nbsp;
            span.dot-list(v-else) {{userTypeList.find(item => item.label === scope.row.type)?.name}}
      //- el-table-column(prop='platType', label='终端类型')
        template(#default='scope')
          el-tag.margin-right-x(v-for="(item, i) in scope.row.platType.split(',')" :key="i")
            | {{ platTypeLevel.find(subItem  => subItem.code === item).name }}
      //- el-table-column(label='添加子菜单', width='100' align='center')
        template(#default='scope')
          el-button(v-if="scope.row.platType === 'pc'" link type="primary" @click='toSubMenu(scope.row)' :disabled="!funcButton.menuListAddChildren") 添加
      el-table-column(prop='status', label='状态', width='80' align='center')
        template(#default='scope')
          //- span {{scope.row.status}}
          el-switch(:disabled="!funcButton.menuListEdit" v-model='scope.row.status', :active-value='1', :inactive-value='0', :loading='scope.row.switchLoading', @change='changeStatus(scope.row)' :before-change="beforeChange.bind(this, scope.row)")
      el-table-column(label='操作', width='200')
        template(#default='scope')
          el-button(link type="primary" @click='drawerPanel(scope.row)') 查看
          el-button(link type="primary" @click='editMenu(scope.row)' :disabled="!funcButton.menuListEdit") 编辑
          el-button(link type="danger" @click='deleteMenu(scope.row)' :disabled="!funcButton.menuListRemove") 删除
          MoreHandle
            el-button(v-if="scope.row.platType === 'pc'" link type="primary" @click='toSubMenu(scope.row)' :disabled="!funcButton.menuListAddChildren") 添加子菜单

    el-pagination.flex-box.flex-center(background @size-change='handleSizeChange', @current-change='handleCurrentChange', :current-page='currentPage', :page-sizes='[10, 20, 30, 40]', :page-size='pageSize', layout='total, sizes, prev, pager, next, jumper', :total='total')

    el-drawer(v-model='showDrawer' :title='currentMenu.name', size='40%' @closed="dialogStatus = null")
      MenuDetails(v-if="dialogStatus === 0" :data="{currentMenu, isCloud: 0}")

    el-dialog(v-model='dialogFormVisible', :width='600', :title='(dialogStatus ? "编辑" : "查看") + "菜单：" + currentMenu.name + " (" + currentMenu.indexCode + ")"'
      @close="dialogStatus = null")
      //- template(v-if='!dialogStatus')
      div(style="height: 60vh")
        el-scrollbar
          EditMenu(ref="editFormRef" v-if="dialogStatus === 1" :data="{currentMenu, rules}"  @submit="submitForm")
      template(#footer, v-if='dialogStatus')
        el-button(@click='dialogFormVisible = false') 取消
        el-button(type='primary', @click='saveForm', :loading='saveLoading') 保存
</template>
<script lang="ts">
import { defineComponent, computed, reactive, toRefs, onActivated, getCurrentInstance, ref } from 'vue'
// import { getZindexList } from '@/service/platform'
// import { msgbox, IMsgBoxOptions } from '@/hooks/subMessageBox'
// import SubDialog from '@/components/subDialog.vue'
import { Menu } from '@/service/platform/index'
import { key } from '@/store/index'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
// import FilterContent from '@/components/filterContent/index.vue'
// import TableTitle from '@/components/tableTitle.vue'
import MenuDetails from './components/details.vue'
import EditMenu from './components/edit.vue'
import { ArrowDown } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from "element-plus"
import { Search, Refresh, Plus } from "@element-plus/icons-vue"
import HeadOperation from '@/components/headOperation.vue'
import MoreHandle from '@/components/moreHandle.vue'

export default defineComponent({
  name: 'menuList',
  components: {
    // SubDialog,
    // FilterContent,
    // TableTitle,
    MenuDetails,
    EditMenu,
    ArrowDown,
    HeadOperation,
    MoreHandle
  },
  setup() {
    const defaultAppIcon = new URL('../../assets/images/example.svg', import.meta.url).href
    const validateIndexCode = (rule: any, value: any, callback: any) => {
      // console.log('validateIndexCode', rule, value, /s/.test(value))
      if (/\s/.test(value)) {
        callback(new Error('不能包含空格'))
      } else {
        callback()
      }
    }
    const router = useRouter()
    const editFormRef: any = ref(null)
    const formValid = ref(false)
    const showDrawer = ref(false)
    const { state } = useStore(key)
    interface DataProps {
      // name: string
      // type: string
      // status: any
      // platType: string
      filterData: any
      userTypeList: any[]
      platTypeList: any[]
      platTypeLevel: any[]
      statusList: any[]
      iconModeList: any[]
      // platList: any[]
      tableData: any[]
      currentPage: number
      pageSize: number
      total: number
      loading: boolean
      dialogFormVisible: boolean
      dialogStatus: any
      // formType: number
      // formEdit: any
      currentMenu: any
      saveLoading: boolean
    }
    const data: DataProps = reactive({
      filterData: {
        name: null,
        status: null,
        platType: null,
        type: null
      },
      platTypeList: state.platTypeList,
      platTypeLevel: state.platTypeLevel,
      statusList: state.statusList,
      userTypeList: state.userTypeList,
      iconModeList: state.iconModeList,
      // funcButton: state.funcButton,
      tableData: [],
      currentPage: 1,
      pageSize: 10,
      total: 0,
      loading: false,
      dialogFormVisible: false,
      dialogStatus: null, // 0->查看  1->编辑
      // formType: 0, // 0添加 1编辑
      // formEdit: {
      //   name: '',
      //   nameEn: '',
      //   indexCode: '',
      //   flagIsAdSupport: '',
      //   status: 0,
      //   type: '',
      //   websize: '',
      //   platType: [],
      //   webAppWebsite: ''
      // }, // 表单项
      saveLoading: false,
      currentMenu: {}, // 当前选中菜单
      rules: {
        // 表单规则
        name: [
          {
            required: true,
            message: '请填写菜单名称',
            trigger: 'blur'
          },
        ],
        nameEn: [
          {
            required: true,
            message: '请填写菜单英文名称',
            trigger: 'blur'
          },
        ],
        typeArr: [
          {
            required: true,
            message: "请选择用户类型",
            trigger: "blur"
          }
        ],
        platTypeArr: [
          {
            required: true,
            message: "请选择平台类类型",
            trigger: "blur"
          }
        ]
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
        getZindexList('messageBox')
      },
      add: () => {
        // 添加菜单
        router.push({
          name: 'menuAdd'
        })
      },
      handleSizeChange: (val: number) => {
        console.log(`每页 ${val} 条`)
        data.pageSize = val
        getZindexList()
      },
      handleCurrentChange: (val: number) => {
        console.log(`当前页: ${val}`)
        data.currentPage = val
        getZindexList()
      },
      deleteMenu: (item: any) => {
        // 删除
        console.log('删除菜单:', item.bh, item.name)
        ElMessageBox.confirm('确定删除菜单"' + item.name + '"？', "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          reomoveZindex(item.bh)
        }).catch(() => {
          console.log('cancel')
        })
      },
      // 查看
      checkMenu: (item: any) => {
        data.currentMenu = item
        data.dialogStatus = 0
        data.dialogFormVisible = true
      },
      drawerPanel: (item: any) => {
        data.currentMenu = item
        data.dialogStatus = 0
        showDrawer.value = true
      },
      editMenu: (item: any) => {
        // 编辑
        console.log('编辑菜单:', item.bh, item.name)
        data.currentMenu = item
        data.dialogStatus = 1
        data.dialogFormVisible = true
      },
      toSubMenu: (item: any) => {
        if (item) data.currentMenu = item
        router.push({
          name: 'subMenu'
        })
        sessionStorage.setItem('currentMenu', JSON.stringify(data.currentMenu))
      },
      // onChange: (value: any) => {
      //   console.log('onChange', value)
      // },
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
        } else {
          //字段
          editZindex(data)
        }
      },
      changeStatus: (item: any) => {
        console.log('编辑状态', item)
      },
      beforeChange(item: any) {
        console.log('beforeChange', item)
        // item.switchLoading = true
        const params = {
          bh: item.bh,
          status: item.status === 0 ? 1 : 0
        }
        ElMessageBox.confirm(`确定将“${item.name}”设为${item.status ? '无效' : '有效'}菜单？`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          editZindex(params, '修改成功')
          // removeZcom(item.bh)
        }).catch(() => {
          console.log('cancel')
        })
        // return new Promise((resolve, reject) => {
        //   // setTimeout(() => {
        //   Menu.editZindex(params)
        //     .then((r) => {
        //       item.switchLoading = false
        //       if (r.code === 200) {
        //         return resolve(true)
        //       } else {
        //         // console.log(r.msg)
        //         // alert(r.msg)
        //         // ElMessage({
        //         //   showClose: true,
        //         //   message: r.msg,
        //         //   type: 'error'
        //         // })
        //         ElMessage.error(r.msg)
        //         return reject(false)
        //       }
        //     })
        //     .catch(() => {
        //       item.switchLoading = false
        //       return reject(false)
        //     })
        // })
      }
    })
    // 查询菜单列表
    const getZindexList = async (feedbackType?: string) => {
      const params: any = {
        current: data.currentPage,
        size: data.pageSize,
        ancestor: 0
      }
      for (const key in data.filterData) {
        // console.log(key, )
        if (data.filterData[key] !== null && data.filterData[key] !== '') params[key] = data.filterData[key]
      }
      // console.log('----', data.filterData.name != '', '---', typeof data.filterData.name)
      // if (data.filterData.userType) params.type = data.filterData.userType
      data.loading = true
      const { data: res, code, message }: any = await Menu.getZindexListPage(params, feedbackType)
      data.loading = false
      if (code === 200) {
        // console.log(res)
        data.total = res.total
        data.tableData = res.records
        data.tableData.forEach((element) => {
          let myIconList: any = []
          element.switchLoading = false
          // 终端类型
          if (element.platType) {
            const arr = element.platType.split(',')
            arr.forEach((type: any, k: number) => {
              const index = data.platTypeLevel.findIndex((item: any) => item.code === type)
              // console.log(type + ':index', index)
              if (index === -1) {
                arr.splice(k, 1)
              }
            })
            element.platTypeArr = arr
          }
          const order: any = []
          data.platTypeLevel.forEach((sub: any) => {
            order.push(sub.code)
          })
          // 菜单图标
          if (element.icon) {
            const objs: any = JSON.parse(element.icon)
            // console.log('objs', objs)
            let modelLength: any = 0
            for (const key in objs) {
              const platTypeCode: any = key.split('#')[0]
              const platType = data.platTypeLevel.find((item: any) => item.code === platTypeCode)
              const modelList = data.iconModeList[platType.parentCode || platTypeCode]
              // console.log('-icon-------platTypeCode----', platTypeCode, platType)
              // console.log(platTypeCode, platType, modelList, objs)
              // console.log('--key--', key, objs[key])
              // let objs = {}
              if (platType) {
                const typeObj = myIconList.find((item: any) => item.platType === platTypeCode)
                // console.log('3333' , typeObj)
                const subObj = {
                  name: key,
                  src: objs[key],
                  platType: platType,
                  model: modelList.find((item: any) => item.code === key.split('#')[1])
                }
                if (!typeObj) {
                  const newObj: any = {
                    platType: platTypeCode,
                    list: []
                  }
                  newObj.list.push(subObj)
                  myIconList.push(newObj)
                } else {
                  typeObj.list.push(subObj)
                }
                // console.log('---modelLength--', typeObj?.list)
              }

              myIconList = myIconList.sort((a : any, b: any) => {
                return order.indexOf(a.platType) - order.indexOf(b.platType)
              })
              myIconList.forEach((iconEle: any) => {
                // iconEle
                iconEle.list = iconEle.list.sort((a: any, b: any) => a.model.index - b.model.index)
                if (iconEle.list.length > modelLength) modelLength = iconEle.list.length
              })

              if (myIconList.length > 0) {
                element.myIconList = myIconList
                // alert(modelLength)
                element.myModelLength = modelLength
              }
            }
            // console.log('myIconList', myIconList)
          }
        })
        console.log(data.tableData)
      } else {
        console.log(message)
      }
    }
    // 删除菜单
    const reomoveZindex = async (bh: number) => {
      // console.log('删除组件', bh)
      data.loading = true
      const { data: res, code, msg }: any = await Menu.reomoveZindex(bh, 'messageBox')
      // data.loading = false
      if (code === 200) {
        // ElMessage({
        //   showClose: true,
        //   message: '删除成功',
        //   type: 'success'
        // })
        ElMessage.success('删除成功')
        getZindexList()
      } else {
        console.log(res)
        // ElMessage.error(msg)
        // ElMessage({
        //   showClose: true,
        //   message: msg,
        //   type: 'error'
        // })
      }
    }
    // 编辑菜单
    const editZindex = async (params: any, message?: string) => {
      console.log('编辑菜单', params)
      // data.saveLoading = true
      const { data: res, code, msg }: any = await Menu.editZindex(params, 'messageBox')
      // data.saveLoading = false
      console.log(res, code, msg)
      if (code === 200) {
        ElMessage.success(message || '保存成功')
        // 编辑成功修改列表对应组件数据
        let editedMenu= data.tableData?.find((item) => item.bh === params.bh)
        for (const key in params) {
          if (key !== 'bh') {
            editedMenu[key] = params[key]
          }
        }
        // if (is) {
        //   getZindexList()
        //   data.dialogFormVisible = false
        // }
      } else {
        console.log(res)
        // ElMessage.error(msg)
      }
    }
    // 编辑菜单formData
    const editZindexFormData = async (formData: any) => {
      console.log('添加菜单', formData)
      // data.saveLoading = true
      const { data: res, code, msg }: any = await Menu.editZindexFormData(formData, 'messageBox')
      // data.saveLoading = false
      console.log(res, code, msg)
      if (code === 200) {
        ElMessage.success('操作成功')
        getZindexList()
        data.dialogFormVisible = false
      } else {
        console.log(msg)
        // ElMessage.error(msg)
      }
    }

    onActivated(() => {
      // onkeydown()
      // console.log('onMounted')
      getZindexList()
    })
    const refData = toRefs(data)
    return {
      token: computed(() => state.token),
      funcButton: computed(() => state.funcButton),
      ...refData,
      editFormRef,
      Search,
      Refresh,
      Plus,
      defaultAppIcon,
      showDrawer
      // forms
    }
  },
  methods: {
  }
})
</script>
<style lang="scss" scoped>
.table-icon-title {
  margin-top: 6px;
  margin-bottom: 4px;
}
.table-icon-list .img-item {
  display: inline-block;
  line-height: 20px;
  margin-right: 20px;

  &:last-child {
    margin-right: 0;
  }
}
.refer-image {
  cursor: pointer;
}
.el-select {
  display: block;
}
.table-content {
  .icon {
    width: 36px;
    height: auto;
    vertical-align: middle;
  }

  .icon-arrowDown {
    // cursor: pointer;
    svg {
      width: 14px;
      height: 14px;
      color: #999;
    }
  }
}
</style>
