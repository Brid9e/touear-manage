<template lang="pug">
div
  HeadOperation
    el-input(:prefix-icon="Search", v-model='roleName', placeholder='角色名称查询', clearable, @keydown.enter='inquire' style="margin-right:12px;")
    el-input(:prefix-icon="Search", v-model='roleCode', placeholder='角色编码查询', clearable, @keydown.enter='inquire')
    el-button(:icon='Search', type='primary', @click='inquire') 查询
    el-button(:icon='Refresh', @click='reset') 重置
    template(#right)
      el-button(type="primary" :icon="Plus"  @click="add('添加角色')" :disabled="!state.funcButton.systemRoleAdd") 添加角色
  el-table(:data='tableData', v-loading='tableLoading')
    el-table-column(label="编号" type="index" align="center" width="80")
    el-table-column(prop='roleName', label='角色名称')
    //- el-table-column(prop='roleCode', label='角色编码')
    //- el-table-column(prop="status" label="状态" width="300")
    el-table-column(prop='roleDesc', label='描述')
    //-  v-if="userInfo.account === 'admin'"
    el-table-column(prop='status', label='状态', width='100', align='center')
      template(#default='scope')
        el-switch(:before-change="beforeChange" :disabled="!state.funcButton.systemRoleEdit", v-model='scope.row.status', :active-value='1', :inactive-value='0', @change='(val) => changeStatus(val, scope.row)')
    //- v-if="userInfo.account === 'admin'"
    el-table-column(label='操作' width="110")
      template(#default='scope')
        //- el-button(type='primary', link, @click='moreDialog(scope.row)') 更多 :disabled="!state.funcButton.systemRoleEdit",
        el-button(:disabled="!state.funcButton.systemRoleEdit", type='primary', link, @click='edit(scope.$index, scope.row)') 编辑
        el-button(type='danger', link, @click='removeRole(scope.$index, scope.row)') 删除
  .flex-center
    el-pagination(@size-change='handleSizeChange', @current-change='handleCurrentChange', :current-page='currentPage', :page-sizes='[10, 30, 50, 100]', :page-size='pageSize', layout="total, sizes, prev, pager, next, jumper", background, :total='total')

  el-dialog(:title='dialogTit', v-model='showAdd', @closed='closed' :width="800")
    //- template(#header)
    el-tabs(v-model='activeName', @tab-click='handleClick', type="card")
      el-tab-pane(label='角色信息', name='first')
      el-tab-pane(v-if='isEdit == 1', label='功能权限', name='second')
      el-tab-pane(v-if='isEdit == 1 && addRoleForm.dataAuth', label='数据权限', name='third')
    // 角色信息
    el-form(v-show="activeName == 'first'" :model='addRoleForm', :rules='formItemRules', ref='formRef')
      //- el-col(:xs="24" :sm="12" :md="8" :lg="6" :xl="6")
      //- el-form-item(label='角色编码', label-width='90px', prop='roleCode')
        el-input(v-model='addRoleForm.roleCode', placeholder='请输入角色编码')
      el-form-item(label='角色名称', label-width='90px', prop='roleName')
        el-input(v-model='addRoleForm.roleName', placeholder='请输入角色名称')
      el-form-item(label='状态', label-width='90px', prop='status')
        el-radio-group(v-model='addRoleForm.status')
          el-radio-button(label='0') 禁用
          el-radio-button(label='1') 启用
      el-form-item(label='描述', label-width='90px')
        el-input(v-model='addRoleForm.roleDesc', placeholder='请输入角色描述', type='textarea', :row='6')
      el-form-item(width='100%', align='right')
    // 功能权限
    el-form(v-show="activeName == 'second'" v-loading='hasLoading')
      el-form-item(label='过期时间', label-width='90px')
        el-date-picker(v-model='expireTime', type='date', placeholder='设置有效期', value-format='YYYY-MM-DD')
      el-form-item(label='功能菜单', label-width='90px')
        MenuEditor(ref="menuEditorRef" :data="menuData" :checked="callbackMenuData")
        //- el-table(border, :data='menuData', @select='handleSelection', @select-all="handleSelectionAll", @selection-change="handleSelectionChange" ref='limitRef', height='400', row-key='authorityId', default-expand-all, :tree-props='{ children: "children", hasChildren: "hasChildren" }')
          el-table-column(type='selection', :reserve-selection='true' align="center")
          el-table-column(prop='menuName', label='菜单')
          el-table-column(label='操作')
            template(#default='scope')
              el-checkbox-group(v-model='actSData')
                el-checkbox(:disabled='scope.row.status === 0', v-if='scope.row.actionList?.length > 0', v-for='item in scope.row.actionList', :label='item.authorityId.toString()', :key='item.authorityId.toString()') {{ item.actionName }}
    // 数据权限
    DataLimit(v-if="addRoleForm.dataAuth" v-show="activeName == 'third'", ref="DataLimit" :resourceId='addRoleForm.roleId' type='role')

    // 功能按钮
    template(#footer, v-if='activeName == "first"')
      el-button(@click='cancelRole') 取消
      el-button(v-if='isEdit == 0', type='primary', @click='addRole') 确认
      el-button(v-if='isEdit == 1', type='primary', @click='saveRole') 保存
    template(#footer, v-if='activeName == "second"')
      el-button(type='primary', @click='authorize', v-if='isEdit == 1') 确认
    template(#footer, v-if='activeName == "third"')
      el-button(type='primary', @click='saveDataLimit', v-if='isEdit == 1') 确认

  el-dialog(title='更多', v-model='more')
    el-descriptions.margin-top(:column='2', border)
      el-descriptions-item
        template(#label)
          span ID
        span {{ moreData.roleId }}
      el-descriptions-item
        template(#label)
          span 描述
        span {{ moreData.roleDesc }}
      el-descriptions-item
        template(#label)
          span 创建时间
        span {{ moreData.createTime }}
      el-descriptions-item
        template(#label)
          span 更新时间
        span {{ moreData.updateTime }}

  el-dialog(title='添加角色', v-model='showAddRole' :width="800" @closed="closed")
    el-steps(:active="stepActive" align-center finish-status="success" style="margin-bottom: 2rem;")
      el-step(title="角色信息" description="填写角色基本信息")
      el-step(title="功能权限" description="设置角色的权限范围")
    el-form(v-show="stepActive == 0" :model='addRoleForm', :rules='formItemRules', ref='formRef')
      //- el-col(:xs="24" :sm="12" :md="8" :lg="6" :xl="6")
      //- el-form-item(label='角色编码', label-width='90px', prop='roleCode')
        el-input(v-model='addRoleForm.roleCode', placeholder='请输入角色编码')
      el-form-item(label='角色名称', label-width='90px', prop='roleName')
        el-input(v-model='addRoleForm.roleName', placeholder='请输入角色名称')
      el-form-item(label='状态', label-width='90px', prop='status')
        el-radio-group(v-model='addRoleForm.status')
          el-radio-button(label='0') 禁用
          el-radio-button(label='1') 启用
      el-form-item(label='描述', label-width='90px')
        el-input(v-model='addRoleForm.roleDesc', placeholder='请输入角色描述', type='textarea', :row='6')
      el-form-item(width='100%', align='right')

    el-form(v-show="stepActive == 1", v-loading='hasLoading')
      el-form-item(label='过期时间', label-width='90px')
        el-date-picker(v-model='expireTime', type='date', placeholder='设置有效期', value-format='YYYY-MM-DD')
      el-form-item(label='功能菜单', label-width='90px')
        MenuEditor(ref="menuEditorForAddRef" :data="menuData")
        //- el-table(border, :data='menuData', @select='handleSelection', @select-all="handleSelectionAll", @selection-change="handleSelectionChange" ref='limitRef_R', height='400', row-key='authorityId', default-expand-all, :tree-props='{ children: "children", hasChildren: "hasChildren" }')
          el-table-column(type='selection', :reserve-selection='true' align="center")
          el-table-column(prop='menuName', label='菜单')
          el-table-column(label='操作')
            template(#default='scope')
              el-checkbox-group(v-model='actSData')
                el-checkbox(:disabled='scope.row.status == 0', v-if='scope.row.actionList?.length > 0', v-for='item in scope.row.actionList', :label='item.authorityId.toString()', :key='item.authorityId.toString()') {{ item.actionName }}
    template(#footer)
      el-button(v-if='stepActive == 0', @click='cancelRole') 取消
      el-button(v-if='stepActive == 0', type='primary', @click='addRole("add")') 下一步
      el-button(v-if='stepActive == 1', @click='stepActive = 0') 上一步
      el-button(v-if='stepActive == 1', type='primary', @click='saveRoleAtStep') 保存
</template>
<script lang="ts">
import { defineComponent, computed, onMounted, reactive, toRefs, ref, nextTick, onUnmounted } from 'vue'
// import { getUser } from '@/service/manage'
import { Search, Plus, Refresh } from '@element-plus/icons-vue'
import { useStore } from 'vuex'
import { key } from '@/store'
import { Role } from '@/service/manage'
import { ElMessageBox, ElMessage } from 'element-plus'
import { arrayToTree } from '@/assets/scripts/utils'
import FilterContent from '@/components/filterContent/index.vue'
import TableTitle from '@/components/tableTitle.vue'
import HeadOperation from '@/components/headOperation.vue'
import SubDialog from '@/components/subDialog.vue'
import DataLimit from '@/components/dataLimit.vue'
import { isEmpty, map, pullAll, uniq } from 'lodash'
import MenuEditor from '@/components/menuEditor.vue'

export default defineComponent({
  components: {
    FilterContent,
    TableTitle,
    SubDialog,
    DataLimit,
    HeadOperation,
    MenuEditor
  },
  setup() {
    const store = useStore(key)
    const { state } = store
    const formRef = ref()
    const limitRef = ref()
    const limitRef_R = ref()
    const more: any = ref(false)
    const hasLoading: any = ref(false)
    const loadingCatch: any = ref(false)
    const activeName = ref('first')
    const DataLimit = ref()
    const moreData: any = ref({})
    const showAddRole = ref(false)
    const stepActive = ref(0)
    const isUserHandle = ref(false)
    const menuEditorRef: any = ref()
    const menuEditorForAddRef: any = ref()
    const table = reactive({
      userInfo: store.state.userInfo,
      currentPage: 1,
      roleName: '',
      roleCode: '',
      total: 0,
      pageSize: 10,
      tableData: [],
      expireTime: '', // 过期时间
      isExpired: true,
      authorityMenu: [] as any[],
      menuData: [] as any[],
      callbackMenuData: [] as any,
      menuSQData: [] as any[],
      actSData: [] as any[],
      menuAllData: [] as any[],
      showAdd: false,
      dialogTit: '添加角色',
      addRoleForm: {
        roleId: 0, // 角色id 编辑时用到
        roleCode: '', // 角色编码
        roleName: '', // 角色名称
        status: '1', // 启用1、禁用0
        roleDesc: '', // 描述
        dataAuth: false, // 是否显示数据权限
      },
      isEdit: 0, //0是非编辑状态（新建状态）

      formItemRules: {
        roleCode: [
          { required: true, message: '角色编码不能为空', trigger: 'blur' },
          {
            pattern: /^[_a-zA-Z0-9]+$/,
            message: '只允许字母、数字、下划线',
            trigger: 'change'
          },
          {
            max: 100,
            message: '角色编码长度不能超过100个字符',
            trigger: 'blur'
          }
        ],
        roleName: [
          { required: true, message: '角色名称不能为空', trigger: 'blur' },
          { max: 33, message: '角色名称长度不能超过33个字符', trigger: 'blur' }
        ],
        roleDesc: [
          {
            max: 333,
            message: '角色描述长度不能超过333个字符',
            trigger: 'blur'
          }
        ],
        expireTime: [
          {
            required: true,
            type: 'date',
            message: '授权日期不能为空',
            trigger: 'blur'
          }
        ],
        grantMenus: [{ required: true, trigger: 'blur' }]
      },

      reset: () => {
        // 重置
        table.roleName = ''
        table.roleCode = ''
      },
      inquire: () => {
        // 查询
        // console.log(table.roleName, table.roleCode)
        getTableData('messageBox')
      },
      add: () => {
        // table.showAdd = true
        showAddRole.value = true
        table.isEdit = 0
        table.dialogTit = '添加角色'
      },
      authorize: () => {
        //  console.log(table.isExpired)
        //  console.log(table.actSData)
        //  console.log(table.menuSQData)
        grantAuthorityRoleData()
      },
      saveDataLimit: () => {
        DataLimit.value
          .saveDataLimits()
          .then(({ data, code, msg }: any) => {
            ElMessage.success(msg)
            table.showAdd = false
          })
          .catch(({ msg }: any) => {
            ElMessage.error(msg)
          })
      },
      addRole: (type?: string) => {
        formRef.value.validate((valid: any) => {
          if (valid) {
            if (type === 'add') {
              stepActive.value = 1
              return
            }
            table.isEdit = 0

            addRoleData()
          }
        })
      },
      saveRole: () => {
        // 编辑-保存角色信息

        formRef.value.validate((valid: any) => {
          if (valid) {
            table.isEdit = 0
            saveRoleData()
          }
        })
      },
      cancelRole: () => {
        // 取消
        table.showAdd = false
        showAddRole.value = false
      },
      edit: (index: number, data: any) => {
        console.log(data)
        // 编辑角色
        table.isEdit = 1
        table.dialogTit = '编辑角色' + '-' + data.roleName
        table.showAdd = true
        table.addRoleForm.roleId = data.roleId
        table.addRoleForm.roleCode = data.roleCode
        table.addRoleForm.roleName = data.roleName
        table.addRoleForm.roleDesc = data.roleDesc
        table.addRoleForm.status = data.status
        table.addRoleForm.dataAuth = data.dataAuth
      },

      handleClick: async (tab: any) => {
        table.dialogTit = tab.props.label
        if (tab.props.name === 'second') {
          if (loadingCatch.value) return
          hasLoading.value = true
          tabSecond()
        }
        if (tab.props.name === 'third') {
          DataLimit.value.init()
        }
      },
      removeRole: (index: number, data: any) => {
        // 删除角色
        table.addRoleForm.roleId = data.roleId
        ElMessageBox.confirm('此操作将永久删除该角色, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(async () => {
            const roleId = data.roleId
            const params = {
              roleId: roleId
            }
            const { code, msg }: any = await Role.removeRole(params, 'messageBox')
            if (code === 200) {
              ElMessage.success('删除成功')
              getTableData()
            }
          })
          .catch(() => {
            return
          })
      },
      tableLoading: true
    })

    onMounted(async () => {
      await getTableData()
      const { data: res, code, msg } = await Role.getAuthorityMenu()
      if (code === 200) {
        table.authorityMenu = res
        table.menuData = arrayToTree(table.authorityMenu, 0)
      }
      else ElMessage.error(msg)
    })

    const saveRoleAtStep = async () => {
      const { data: res, code, msg }: any = await addRoleData('saveRoleAtStep')
      if (code === 200) {
        table.addRoleForm.roleId = res.roleId

        const { code, msg }: any = await grantAuthorityRoleData('saveRoleAtStep')
        if (code === 200) {
          showAddRole.value = false
          ElMessage.success('添加成功')
          getTableData()
        } else {
          ElMessage.success('权限添加失败')
        }
      } else {
        ElMessage.success('基本信息添加失败')
      }
    }

    const handleSizeChange = (val: number) => {
      table.pageSize = val
      table.currentPage = 1
      getTableData()
    }
    const handleCurrentChange = (val: number) => {
      table.currentPage = val
      getTableData()
    }

    async function getTableData(msgBox?: string) {
      table.tableLoading = true
      const params = {
        current: table.currentPage,
        size: table.pageSize,
        roleName: table.roleName || undefined,
        roleCode: table.roleCode || undefined
      }
      const res = await Role.getRoleList(params, msgBox)
      if (res?.data?.records) {
        table.tableLoading = false
        const data = res.data.records
        table.tableData = data
        table.total = res.data.total
      } else {
        table.tableLoading = false
      }
    }
    async function tabSecond() {
      if (!table.addRoleForm.roleId) return
      const params: any = {
        roleId: table.addRoleForm.roleId
      }

      const res2 = await Role.getAuthorityRole(params)
      if (table.authorityMenu) {
        if (res2 && res2.data) {
          table.callbackMenuData = []
          table.menuSQData = []
          table.actSData = []
          table.menuAllData = []
          res2.data.forEach((element: any) => {
            table.menuAllData = map(res2.data, 'authorityId')
            if (element.authority.indexOf('MENU_') !== -1 && !table.callbackMenuData.includes(element.authorityId.toString())) {
              table.callbackMenuData.push(element.authorityId.toString())
            } else {
              // limitRef.value.toggleRowSelection(element, true)
            }
            if (element.authority.indexOf('ACTION_') !== -1 && !table.actSData.includes(element.authorityId.toString())) {
              // table.actSData.push(element.authorityId.toString())
              table.callbackMenuData.push(element.authorityId.toString())
            }
          })
          // table.authorityMenu.forEach((element: any) => {
          //   if (table.callbackMenuData.includes(element.authorityId.toString())) {
          //     element.ischoice = 'choice'
          //   } else {
          //     element.ischoice = ''
          //   }
          // })
          // 选中的那些
        }

        table.menuData = arrayToTree(table.authorityMenu, 0)
        treeData(table.menuData)
        hasLoading.value = false
        loadingCatch.value = true
        // 时间
        if (res2.data.length > 0) {
          table.expireTime = res2.data[0].expireTime
          table.isExpired = res2.data[0].isExpired
        }
      }
    }

    async function treeData(item: any) {
      for (let index = 0; index < item.length; index++) {
        const element = item[index]
        if (element.ischoice === 'choice') {
          limitRef.value?.toggleRowSelection(element, true)
          limitRef_R.value?.toggleRowSelection(element, true)
        }
        if (element.children) {
          if (element.children.length > 0) {
            // console.log('digui')
            treeData(element.children)
          } else {
            //  console.log('chuchucuc')
            // return
          }
        }
      }
    }

    async function addRoleData(type?: string) {
      const params: any = {
        status: table.addRoleForm.status,
        roleDesc: table.addRoleForm.roleDesc,
        roleName: table.addRoleForm.roleName || undefined,
        // roleCode: table.addRoleForm.roleCode || undefined
      }
      // console.log(params)
      const { data: res, code, msg }: any = await Role.addRole(params, 'messageBox')
      if (type === 'saveRoleAtStep') {
        return new Promise((resolve, reject) => {
          if (code === 200) resolve({ data: res, code, msg })
          else reject({ data: res, code, msg })
        })
      }
      if (code === 200) {
        table.showAdd = false
        ElMessage.success('添加成功')
        getTableData()
      } else {
        ElMessage.error(msg)
      }

    }
    async function grantAuthorityRoleData(type?: string) {
      const isAdd = type === 'saveRoleAtStep'
      // var temp = [] as any[]
      // table.menuSQData.forEach((el: any) => {
      //   // table.menuSQData = []
      //   temp.push(el.authorityId.toString())
      // })
      // table.actSData.forEach((item: any) => {
      //   // table.actSData = []
      //   temp.push(item.toString())
      // })
      // temp = uniq(temp)
      // var strId = temp.join(',')

      // var date = new Date(table.expireTime.replace(/-/, '/'))
      const params: any = {
        authorityIds: (isAdd ? menuEditorForAddRef : menuEditorRef).value?.getCheckedKeys()?.join(','),
        expireTime: table.expireTime ? table.expireTime + ' 00:00:00' : '2100-01-01 00:00:00',
        roleId: table.addRoleForm.roleId
      }
      const { code, msg }: any = await Role.grantAuthorityRole(params, 'messageBox')
      if (isAdd) {
        return new Promise((resolve, reject) => {
          if (code === 200) resolve({ code, msg })
          else reject({ code, msg })
        })
      }
      if (code === 200) {
        table.showAdd = false
        ElMessage.success('权限分配成功')
        getTableData()
      }
    }

    const changeStatus = (val: any, data: any) => {
      table.addRoleForm = data
      saveRoleData(val, 'switch')
    }

    async function saveRoleData(status?: any, type?: string) {
      table.tableLoading = true
      const params: any = {
        status: table.addRoleForm.status,
        roleDesc: table.addRoleForm.roleDesc,
        roleName: table.addRoleForm.roleName || undefined,
        roleId: table.addRoleForm.roleId, // 角色id
        roleCode: table.addRoleForm.roleCode
      }
      if (status) {
        params.status = status
      }
      // console.log('params', params)
      const { code, msg }: any = await Role.saveRole(params, 'messageBox')
      if (type === 'saveRoleAtStep') {
        return new Promise((resolve, reject) => {
          if (code === 200) resolve({ code, msg })
          else reject({ code, msg })
        })
      }
      if (code === 200) {
        table.showAdd = false
        if (type !== 'switch') ElMessage.success('保存成功')
        table.tableLoading = false
        getTableData()
      } else {
        table.tableLoading = false
      }
    }
    const moreDialog = (data: any) => {
      more.value = true
      moreData.value = data
    }
    const closed = async () => {
      activeName.value = 'first'
      stepActive.value = 0
      table.addRoleForm = {
        roleId: 0, // 角色id 编辑时用到
        roleCode: '', // 角色编码
        roleName: '', // 角色名称
        status: '1', // 启用1、禁用0
        roleDesc: '', // 描述
        dataAuth: false,
      }
      table.actSData = []
      table.callbackMenuData = []
      table.menuSQData = []
      table.menuAllData = []
      table.expireTime = ''
      hasLoading.value = false
      loadingCatch.value = false
      DataLimit.value?.clear()
      await nextTick()
      limitRef.value ? limitRef.value.clearSelection() : null
      limitRef_R.value ? limitRef_R.value.clearSelection() : null
      isUserHandle.value = false
      // menuData: [] as any[],
      // callbackMenuData: [] as any[],
      // menuSQData: [] as any[],
      // actSData: [] as any[],
    }
    const beforeChange = () => {
      return new Promise((resove, reject) => {
        ElMessageBox.confirm("确定要切换该角色状态吗？", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          resove(true)
        }).catch(() => {
          reject(false)
        })
      })
    }
    const refTable = toRefs(table)
    return {
      state,
      ...refTable,
      formRef,
      limitRef,
      limitRef_R,
      more,
      moreData,
      closed,
      DataLimit,
      activeName,
      moreDialog,
      hasLoading,
      getTableData,
      handleSizeChange,
      changeStatus,
      handleCurrentChange,
      Search,
      Plus,
      Refresh,
      showAddRole,
      stepActive,
      saveRoleAtStep,
      beforeChange,
      menuEditorRef,
      menuEditorForAddRef
    }
  }
})
</script>

<style lang="scss" scoped>
.el-table .warning-row {
  background: oldlace;
}

.el-table .success-row {
  background: #f0f9eb;
}

.link-group .el-link {
  margin-right: 8px;
}

.link-group .el-link:last-child {
  margin-right: 0px;
}

:deep(.el-descriptions__cell) {
  border-left: none !important;
}
</style>