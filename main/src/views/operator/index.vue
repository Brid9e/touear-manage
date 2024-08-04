<template lang="pug">
div
  HeadOperation
    el-input(:prefix-icon="Search" v-model='pageInfo.account', placeholder='通过用户名筛选' @keydown.enter="inquire")
    el-button(:icon="Search" type='primary' @click='inquire') 查询
    el-button(:icon="Refresh" @click="reset") 重置
    template(#right)
      el-button(type="primary" :icon="Plus"  @click="add('添加操作员')" :disabled='!state.funcButton.operators_add' :loading="!state.funcButton.operators_add") 添加操作员
    template(#fold)
      el-form(:label-width="80" :model="pageInfo" inline)
        el-row
          el-col(:xs="12", :sm="12", :md="8", :lg="6", :xl="4")
            el-form-item(label="姓名")
              el-input(v-model='pageInfo.name', placeholder='请输入姓名' @keydown.enter="inquire")
          el-col(:xs="12", :sm="12", :md="8", :lg="6", :xl="4")
            el-form-item(label="手机号")
              el-input(v-model='pageInfo.phone', placeholder='请输入手机号' @keydown.enter="inquire")
          el-col(:xs="12", :sm="12", :md="8", :lg="6", :xl="4")
            el-form-item(label="邮箱")
              el-input(v-model='pageInfo.email', placeholder='请输入邮箱' @keydown.enter="inquire")
  el-table(:data="tableData" v-loading="tableLoading")
    el-table-column(label="编号" prop="id" align="center" width="80")
    el-table-column(prop="avatar" label="头像" width="80" align="center")
      template(#default="scope")
        el-image.useavatar(shape="square" :size="30" fit="contain" :src="imageFor + scope.row.avatar")
          template(#error)
            el-image(:src='avatar')
    el-table-column(prop="account" label="用户名")
    el-table-column(prop="name" label="姓名")
    el-table-column( label="联系方式" show-overflow-tooltip)
      template(#default="scope")
        //- span {{scope.row.phone.replace(/^(.{3})(?:\d+)(.{2})$/, "$1*****$2") }}
        span {{scope.row?.phone?.replace(/^(.{3})(?:\d+)(.{2})$/, "$1*****$2") || ''}}
    el-table-column(prop="email" label="邮箱")
    //- el-table-column(prop="sex" label="性别")
    el-table-column(label="操作" width="200")
      template(#default="scope")
        div.link-group
          //- el-button(type="info", link)
          el-button(type="primary", link, @click="edit(scope.row, 1)" :disabled='!state.funcButton.operators_edit') 编辑
          el-button(type="danger", link, @click="handleRemove(scope.$index, scope.row)" :disabled='!state.funcButton.operators_delete') 删除
          el-button(type="primary", link, @click="toAuthorize(scope.row)" :disabled='!state.funcButton.operators_auth') 授权
          MoreHandle(v-if="state.funcButton.operators_changePwd")
            el-button(link, type='primary', @click='edit(scope.row, 3)' :disabled='!state.funcButton.operators_changePwd') 重置密码
  .flex-center
    el-pagination(
      @size-change='handleSizeChange'
      @current-change='handleCurrentChange'
      :current-page='pageInfo.current'
      :page-sizes='[10, 30, 50, 100]'
      :page-size='pageInfo.size'
      layout="total, sizes, prev, pager, next, jumper"
      background
      :total='total')
  //- 添加
  el-dialog(:title="dialogTit" v-model="showAdd" @closed="closed" width="800")
    div()
      el-scrollbar
        el-form(:model='addOperatorForm' :rules="formItemRules" ref="formRef" label-width="100px" label-position="right",autocomplete="off")
          el-form-item(v-if="isEdit === 0 || isEdit === 1" label="照片" prop='avatar')
            .upload-box
              .upload-hd
                el-upload.avatar-uploadered(ref='imgFileRef' v-model="imageFile", action="#", :show-file-list="false", :limit="1",:http-request="httpRequest", :before-upload="avatarBeforeUpload", :on-exceed="avatarHandleExceed",)
                  i.avatar-uploadered-icon(v-if="!addOperatorForm.avatar")
                    el-icon(:size="30")
                      Plus
                    span 点击上传
                  .images-box(v-else)
                    el-image(:src="addOperatorForm.avatar", style="width: 100px; height: 100px", :fit="fill")
                      template(#error="")
                        el-icon(:size="20")
                          Picture
              el-row.handle-bar(:gutter="0", v-if="addOperatorForm.avatar")
                el-col.text-danger.text-center( :span="24", @click="deleteImg(index)") 删除
            el-alert.avatar-alert(title="上传图片支持 JPG / JPEG / PNG  格式，大小不超过 1M，建议尺寸为 100*100", type="info", show-icon, :closable="false")
          el-form-item(v-if="isEdit === 0 || isEdit === 1" label="用户名" prop='account')
            el-input(:disabled="isEdit === 1 ? true : false" v-model="addOperatorForm.account", placeholder="请输入用户名")
          el-form-item(v-if="isEdit === 0 || isEdit === 1" label="姓名" prop='name')
            el-input(v-model="addOperatorForm.name", placeholder="请输入姓名")
          //- el-form-item(v-if="isEdit === 0" label="登录密码" prop='password')
            //- el-input( style="position: fixed;bottom: -9999px;" type="password")
            //- el-input(v-model="addOperatorForm.password", placeholder="请输入登录密码" type="password")
          el-form-item.is-required(v-if="isEdit === 0 || isEdit === 3" label='密码', prop='password')
            el-input.input-width(v-model='addOperatorForm.password', placeholder='请填写密码' type="password" show-password)
            PasswordStrengthChecker(:password="addOperatorForm.password" :options="options" @back-rules="getBackResult")
          el-form-item.is-required(v-if="isEdit === 0 || isEdit === 3" label='确认密码', prop='confirmPassword')
            el-input.input-width(v-model='addOperatorForm.confirmPassword', placeholder='请填写确认密码' type="password" show-password)
          el-form-item(v-if="isEdit === 0 || isEdit === 1" label="性别" prop='sex')
            el-radio-group(v-model="addOperatorForm.sex")
              el-radio-button(label="1" ) 男
              el-radio-button(label="2") 女
          el-form-item( v-if="isEdit === 0 || isEdit === 1" label="手机号" prop='phone')
            el-input(v-model="addOperatorForm.phone", placeholder="请输入手机号"  @change='handleChangephone')
          el-form-item(v-if="isEdit === 0 || isEdit === 1" label="邮箱" prop='email')
            el-input(v-model="addOperatorForm.email", placeholder="请输入邮箱")
          el-form-item(v-if="isEdit === 0 || isEdit === 1" label="设置角色" prop='roleIdData')
            el-select(v-model="roleIdData" multiple placeholder="请选择角色" style="width: 100%" popper-class="selectStyle")
              el-option(v-for="item in initSelect.roleSelect.data" :key="item.roleId" :label="item.roleName" :value="item.roleId")
    template(#footer)
      el-button( @click="cancelU") 取消
      el-button(type="primary" @click="addOperator") 保存
  //- 授权
  el-dialog(:title="authorizeTit" v-model="showAuthorize" @closed="closedAuthorize" width='800')
    el-tabs(v-model="activeName" @tab-click="handleClick" type="card")
      el-tab-pane(label='功能权限', name='second')
      el-tab-pane(label='数据权限', name='third')
    //- 功能菜单
    el-form(v-show="activeName == 'second'" v-loading='hasLoading')
      el-form-item(label='过期时间', label-width='90px')
        el-date-picker(v-model='expireTime', type='date', placeholder='设置有效期', value-format='YYYY-MM-DD')
      el-form-item(label='功能菜单', label-width='90px')
        MenuEditor(ref="menuEditorRef" :data='menuData' :checked="menuSData")
        //- el-table(border, :data='menuData', @select='handleSelection', @select-all="handleSelectionAll", @selection-change="handleSelectionChange" ref='limitRef', height='400', row-key='authorityId', default-expand-all, :tree-props='{ children: "children", hasChildren: "hasChildren" }')
          el-table-column(type='selection', :reserve-selection='true' align="center")
          el-table-column(prop='menuName', label='菜单')
          el-table-column(label='操作')
            template(#default='scope')
              el-checkbox-group(v-model='actSData')
                el-checkbox(:disabled='scope.row.status === 0', v-if='scope.row.actionList?.length > 0', v-for='item in scope.row.actionList', :label='item.authorityId.toString()', :key='item.authorityId.toString()') {{ item.actionName }}
    //- 数据权限
    DataLimit(v-show="activeName == 'third'", ref="DataLimit" :resourceId='authorizeOperatorId' type='operator')
    //- 功能按钮
    template(#footer, v-if='activeName == "second"')
      el-button(type='primary', @click='authorizeMenu') 确认
    template(#footer, v-if='activeName == "third"')
      el-button(type='primary', @click='saveDataLimit') 确认

</template>
<script lang="ts">
import {
  defineComponent,
  computed,
  onMounted,
  reactive,
  toRefs,
  ref,
  watch,
  toRef,
  nextTick,
} from 'vue'
import { useStore } from 'vuex'
import { key } from '@/store'
import { Role, Operator, authorizeSubarea, authorizeTenant, authorizeAgency } from '@/service/manage'
import { arrayToTree } from '@/assets/scripts/utils'
import { ElMessageBox, ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'
// import SubDialog from '@/components/subDialog.vue'
import { Plus, Refresh, Search, Picture } from '@element-plus/icons-vue'
import { log } from 'console'
import avatar from '@/assets/images/avatar.png'
import HeadOperation from '@/components/headOperation.vue'
import DataLimit from '@/components/dataLimit.vue'
import { isEmpty, map, pullAll, uniq, forEach } from 'lodash'
import PasswordStrengthChecker from '@/components/passwordStrengthChecker/index.vue'
import MoreHandle from '@/components/moreHandle.vue'
import MenuEditor from '@/components/menuEditor.vue'

export default defineComponent({
  components: {
    // accountUser,
    HeadOperation,
    Plus,
    Picture,
    DataLimit,
    PasswordStrengthChecker,
    MoreHandle,
    MenuEditor
    // SubDialog
  },
  data() {
    return {
      color: 'red',
      title: this.$route.meta.title,
      value: '',
    }
  },
  setup() {
    const limitRef_R = ref()
    const hasLoading: any = ref(false)
    const DataLimit = ref()
    const moreData: any = ref({})
    const showAddRole = ref(false)
    // const stepActive = ref(0)
    const router = useRouter()
    const limitRef = ref()
    const title = router.currentRoute.value.meta.title
    const store = useStore(key)
    const { state } = store
    const formRef = ref()
    const more = ref(false)
    const loadingCatch = ref(false)
    const imgFileRef: any = ref()
    // 渠道商列表
    const agencyList: any = ref([])
    // 区域列表
    const subareaList: any = ref([])
    // 租户列表
    const tenantList: any = ref([])
    const validatephone = (rule: any, value: any, callback: any) => {
      //console.log('手机号改变了-----')
      if (value === '') {
        callback(new Error('手机号不能为空'))
      } else {
        const regCN = /^1(3[0-9]|4[01456879]|5[0-35-9]|6[2567]|7[0-8]|8[0-9]|9[0-35-9])\d{8}$/
        if (!regCN.test(value)) {
          callback(new Error('手机号码格式不正确'))
        } else {
          callback()
        }
      }
    }
    const activeName = ref('second')
    const isUserHandle = ref(false)
    const menuEditorRef = ref()
    const table: any = reactive({
      userInfo: store.state.userInfo,
      showAdd: false,
      showAuthorize: false,
      pageInfo: {
        current: 1,
        size: 10,
        account: '',
        name: '',
        phone: '',
        email: ''
      },
      initSelect: {
        // 角色
        roleSelect: {
          isShow: true,
          data: [
            {
              roleId: '',
              roleName: '',
            },
          ],
        }
      },
      // 用户已分配的角色
      roleData: [{ roleId: '' }],
      roleIdData: [] as Array<string>,
      total: 0,
      imageFor: '',
      tableLoading: false,
      tableData: [],
      isEdit: 0, //0是非编辑状态（新建状态）
      dialogTit: '添加操作员',
      authorizeTit: '功能权限',
      expireTime: '', // 过期时间
      // avatarData: "",
      imageFile: '',
      addOperatorForm: {
        account: null,
        name: null,
        sex: 1,
        password: null,
        confirmPassword: null,
        email: null,
        phone: null,
        avatar: null
      },
      formItemRules: {
        account: [
          { required: true, message: '用户名不能为空', trigger: 'blur' },
          {
            type: 'string',
            max: 50,
            message: '用户名超出长度限制',
            trigger: 'blur'
          }
        ],
        password: [
          { required: true, message: '密码不能为空', trigger: 'blur' },
        ],
        confirmPassword: [
          { required: true, message: '确认密码不能为空', trigger: 'blur' },
          {
            validator: (rule: any, value: any, callback: any) => {
              if (value !== table.addOperatorForm.password) {
                callback(new Error('确认密码与密码不一致'));
              } else {
                callback();
              }
            }, trigger: 'blur'
          }
        ],
        name: [
          { required: true, message: '姓名不能为空', trigger: 'blur' },
          {
            type: 'string',
            max: 10,
            message: '姓名超出长度限制',
            trigger: 'blur',
          },
        ],
        sex: [{ required: true, message: '性别不能为空', trigger: 'blur' }],
        email: [
          {
            required: false,
            type: 'email',
            message: '邮箱格式不正确',
            trigger: 'blur',
          },
          {
            type: 'string',
            max: 100,
            message: '邮箱格式超出长度限制',
            trigger: 'blur',
          },
        ],
        phone: [
          /*  { required: true, message: '手机号不能为空', trigger: 'blur' }, */
          { required: true, validator: validatephone, trigger: 'blur' },
          // { pattern: /^1\d{10}$/, message: '手机号码格式不正确', trigger: 'change' }
        ],
      },
      authorizeOperatorId: '', // 授权的操作员id
      addRoleForm: {
        roleId: 0, // 角色id 编辑时用到
        roleCode: '', // 角色编码
        roleName: '', // 角色名称
        status: '1', // 启用1、禁用0
        roleDesc: '' // 描述
      },
      accountId: '',
      menuData: [] as any[],
      authorityMenu: [] as any[],
      actSData: [] as any[],
      menuSData: [] as any,
      menuSQData: [] as any[],
      menuAllData: [] as any[],
      reset: () => {
        // 重置
        // console.log("********");
        // console.log(pageInfoRef.value);
        // (pageInfoRef.value as any)?.resetFields()
        // table.pageInfo. = null;

        table.pageInfo.account = ''
        table.pageInfo.name = ''
        table.pageInfo.phone = ''
        table.pageInfo.email = ''
        table.pageInfo.current = 1
      },
      inquire: () => {
        // 查询
        getTableData()
      },
      cancelU: () => {
        // 取消
        table.showAdd = false
        formRef.value.resetFields()
      },
      edit: (data: any, type: number) => {
        table.isEdit = type
        table.dialogTit = (type === 1 ? '编辑操作员' : type === 3 ? '重置密码' : '添加操作员') + '-' + data.name
        table.accountId = data.id
        if (table.isEdit === 1) {
          table.addOperatorForm = Object.assign({}, table.addOperatorForm, data)
          if (table.addOperatorForm.avatar !== null) {
            table.addOperatorForm.avatar = table.imageFor + table.addOperatorForm.avatar
          }
          table.addOperatorForm.password = null
          table.addOperatorForm.confirmPassword = null
        }
        if (table.isEdit === 3) {
          for (let i in table.addOperatorForm) {
            ; (table as any).addOperatorForm[i] = null
          }
          table.addOperatorForm.id = data.id
          table.addOperatorForm.account = data.account
        }

        table.showAdd = true
        table.imageFile = ''
        //获取用户角色
        getRoles()
        // getGroups()
        // listGroupByAccountId() //获取用户群组信息
        // console.log('编辑dddddddddddddd-----', table.addOperatorForm, table.imageFile)
      },
      // 删除
      handleRemove: (index: number, data: any) => {
        ElMessageBox.confirm('确定要删除' + data.name + '操作员吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        })
          .then(async () => {
            const id = data.id
            const params = {
              id: id,
            }
            const { code, msg }: any = await Operator.operatorDelete(
              params,
              'messageBox'
            )
            if (code === 200) {
              ElMessage.success('删除成功')
              table.tableData.splice(index, 1)
              // getTableData()
            } else {
              ElMessage.error(msg)
            }
          })
          .catch(() => {
            return
          })
      },
      //确认保存
      addOperator: () => {
        // 添加
        if (table.isEdit === 0) {
          formRef.value.validate((valid: any) => {
            if (valid == true) {
              if (passWordResult.value.value) {
                if (
                  table.addOperatorForm.account &&
                  table.addOperatorForm.account.length > 0
                ) {
                  // listAccountData()
                }
                addOperatorData()
              } else {
                ElMessage.error('密码' + passWordResult.value.msg)
              }
            }
          })
        }
        // 编辑
        if (table.isEdit === 1) {
          formRef.value.validate((valid: any) => {
            if (valid) {
              console.log('------编辑操作员', table.addOperatorForm)
              upDateOperatorData()
            }
          })
        }
        // 重置密码
        if (table.isEdit === 3) {
          formRef.value.validate((valid: any) => {
            if (valid) {
              console.log('------编辑操作员', table.addOperatorForm)
              upDateOperatorData()
            }
          })
        }
      },
      add: () => {
        // 添加用户
        table.dialogTit = '添加操作员'
        table.showAdd = true
        // nextTick(() => {
        //     formRef.value.resetFields()
        //     table.addOperatorForm.account = ""
        //     table.addOperatorForm.password = ""
        // })
        for (let i in table.addOperatorForm) {
          ; (table as any).addOperatorForm[i] = null
        }
        table.addOperatorForm.account = null
        table.addOperatorForm.password = null
        table.addOperatorForm.confirmPassword = null
        table.addOperatorForm.sex = 1
        table.roleIdData = []
        table.imageFile = ''
        table.addOperatorForm.phone = null
        table.addOperatorForm.email = null
        table.isEdit = 0
      },
      saveDataLimit: () => {
        DataLimit.value
          .saveDataLimits()
          .then(({ msg }: any) => {
            ElMessage.success(msg)
            table.showAuthorize = false
          })
          .catch(({ msg }: any) => {
            ElMessage.error(msg)
          })
      },
      // 授权操作员菜单
      authorizeMenu: () => {
        grantAuthorityOperatorData()
      },
      handleClick: (tab: any) => {
        table.authorizeTit = tab.props.label
        if (tab.props.name === 'second') {
          if (loadingCatch.value) return
          hasLoading.value = true
          tabSecond()
        }
        if (tab.props.name === 'third') {
          // console.log('-----DataLimits', DataLimit.value)
          DataLimit.value.init()
        }
      },
    })
    const handleSizeChange = (val: number) => {
      table.pageInfo.size = val
      table.pageInfo.current = 1
      getTableData()
    }
    const handleCurrentChange = (val: number) => {
      table.pageInfo.current = val
      getTableData()
    }
    async function getTableData() {
      table.tableLoading = true
      // 过滤参数
      const params: any = {}
      for (let item in table.pageInfo) {
        if (table.pageInfo[item]) params[item] = (table.pageInfo[item])
      }
      const res = await Operator.getOperatorList(params)
      if (res && res.data && res.data.records) {
        table.tableLoading = false
        table.tableData = res.data.records
        table.total = res.data.total
        // console.log('表格', res.data.records, table.tableData)
      } else {
        table.tableLoading = false
        ElMessage({
          showClose: true,
          message: res.msg,
          type: 'warning',
        })
      }
    }
    async function listAccountData() {
      const params = {
        code: table.addOperatorForm.account,
      }
      const res = await Operator.checkByCode(params)
      if (res && res.data) {
        // console.log(res.data)
        if (res.data.length > 0) {
          table.addOperatorForm.account = ''
          ElMessage({
            showClose: true,
            message: '账号已经存在',
            type: 'warning',
          })
          return
        }
      }
    }
    async function addOperatorData() {
      // console.log('添加图片', table.imageFile, table.addOperatorForm)
      if (table.imageFile !== '') {
        await addAvatar()
      }
      // table.addOperatorForm.avatar = 'data'

      const {
        data: res,
        code,
        msg,
      }: any = await Operator.operatorAdd(table.addOperatorForm)
      if (code === 200) {
        table.showAdd = false
        ElMessage.success('添加成功')
        const roleIdStr = table.roleIdData.join(',')
        addOperatorRole(roleIdStr, res.id)
        getTableData()
      } else {
        ElMessage.warning(msg)
      }
    }
    // 设置角色
    async function addOperatorRole(roleIds: string, operatorId?: number | string) {
      const params = {
        userId: operatorId,
        roleIds: roleIds
      } as any
      const { code, msg }: any = await Role.addUserRoles(params)
      if (code === 200) {
        table.showAdd = false
      } else {
        // console.log(msg)
      }
    }
    // 编辑回显角色
    async function getRoles() {
      const params = {
        userId: table.accountId,
      }
      // console.log('----操作员角色查询', params)
      const res = await Role.getUserRoles(params)
      if (res && res.data) {
        if (res.data.length > 0) {
          table.roleData = res.data
          // table.roleData.map
          table.roleIdData = []
          for (const key in table.roleData) {
            if (Object.prototype.hasOwnProperty.call(table.roleData, key)) {
              const element = table.roleData[key]
              const roleId = element.roleId
              table.roleIdData.push(roleId)
            }
          }
          // console.log('获取用户角色', table.roleIdData)
        } else {
          table.roleIdData = []
        }
      }
    }
    async function upDateOperatorData() {
      // console.log('编辑用户图片----', table.imageFile)
      if (table.imageFile !== '') {
        await addAvatar()
      }
      // if (table.addUserForm.imageFile !== null) {
      //     await addAvatar()
      // }
      const params: any = {
        ...table.addOperatorForm,
      }
      const { code, msg, data: res }: any = await Operator.operatorEdit(params)
      if (code === 200) {
        table.showAdd = false
        ElMessage.success('编辑成功')
        const roleIdStr = table.roleIdData.join(',')
        // console.log('----------table.roleIdData------', roleIdStr, table.roleIdData)
        addOperatorRole(roleIdStr, params.id)
        getTableData()
      } else {
        console.log(msg)
      }
    }

    async function tabSecond() {
      if (!table.authorizeOperatorId) return
      const params: any = {
        userId: table.authorizeOperatorId
      }
      const res2 = await Operator.getAuthorityOperator(params)
      if (table.authorityMenu) {
        if (res2 && res2.data) {
          table.menuSData = []
          table.menuSQData = []
          table.actSData = []
          table.menuAllData = []
          res2.data.forEach((element: any) => {
            table.menuAllData = map(res2.data, 'authorityId')
            if (element.authority.indexOf('MENU_') !== -1 && !table.menuSData.includes(element.authorityId.toString())) {
              table.menuSData.push(element.authorityId)
            } else {
              // limitRef.value.toggleRowSelection(element, true)
            }
            if (element.authority.indexOf('ACTION_') !== -1 && !table.actSData.includes(element.authorityId.toString())) {
              table.menuSData.push(element.authorityId)
            }
          })
          // table.authorityMenu.forEach((element: any) => {
          //   if (table.menuSData.includes(element.authorityId.toString())) {
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
    //监听
    const handleChangeidNumber = (val: any) => {
      console.log('idNumber修改------', val)
    }
    const handleChangephone = (val: any) => {
      console.log('phone修改------', val)
    }
    //上传图片
    const httpRequest = (data: any) => {
      table.imageFile = data.file
      table.addOperatorForm.avatar = URL.createObjectURL(data.file)
    }
    const addAvatar = async () => {
      const formData = new FormData()
      // formData.append("id", "id")
      formData.append('bucketName', 'photo')
      formData.append('file', table.imageFile)
      console.log('-----上传照片参数', table.imageFile)
      const { data, msg, code }: any = await Role.updatePhotoByOperator(
        formData
      )
      if (code === 200) {
        // ElMessage.success("照片上传成功")
        //table.addOperatorForm.avatar = res + "?timestamp=" + new Date().getTime()
        table.addOperatorForm.avatar = data
      } else {
        ElMessage.error(msg)
      }
    }
    // 删除图片
    const deleteImg = () => {
      table.addOperatorForm.avatar = ''
    }
    //限制用户上传文件的格式和大小
    const avatarBeforeUpload = (file: any) => {
      const type = ['image/jpeg', 'image/jpg', 'image/png']
      if (type.indexOf(file.type) === -1) {
        ElMessage.error('上传的文件必须是JPG / JPEG / PNG格式!')
        return false
      } else if (file.size / 1024 / 1024 > 1) {
        ElMessage.error('图片大小不能超过1MB!')
        return false
      }
      return true
    }
    const avatarHandleExceed = (val: any) => {
      imgFileRef.value!.clearFiles()
      const file: any = val[0]
      imgFileRef.value!.handleStart(file)
      table.addOperatorForm.avatar = URL.createObjectURL(file)
      table.imageFile = file
      console.log('cauochu-------', val, file, imgFileRef.value)
    }
    // 去授权
    const toAuthorize = (val: any) => {
      activeName.value = 'second'
      table.showAuthorize = true
      table.authorizeOperatorId = val?.id
      hasLoading.value = true
      tabSecond()
    }
    // 保存菜单权限
    async function grantAuthorityOperatorData(type?: string) {
      // var temp = [] as any[]
      // table.menuSQData.forEach((el: any) => {
      //   temp.push(el.authorityId.toString())
      // })
      // table.actSData.forEach((item: any) => {
      //   temp.push(item.toString())
      // })
      // var strId = temp.join(',')
      // var date = new Date(table.expireTime.replace(/-/, '/'))
      const params: any = {
        authorityIds: menuEditorRef.value?.getCheckedKeys()?.join(','),
        expireTime: table.expireTime ? table.expireTime + ' 00:00:00' : '2100-01-01 00:00:00',
        userId: table.authorizeOperatorId
      }
      const { code, msg }: any = await Role.grantAuthorityUser(params, 'messageBox')
      if (code === 200) {
        table.showAuthorize = false
        ElMessage.success('权限分配成功')
        getTableData()
      }
    }
    /**
     * 初始化下拉框
     */
    async function initSelectData() {
      if (table.initSelect.roleSelect.isShow) {
        // table.tableLoading = true
        const params: any = {
          status: 1,
        }
        const res = await Role.getAllRoles(params)
        if (res && res.data) {
          // table.tableLoading = false
          const data = res.data
          table.initSelect.roleSelect.data = data
          // console.log('全部角色', table.initSelect.roleSelect.data)
        } else {
          // table.tableLoading = false
        }
      }
    }
    // const options: any = {
    //   remote: false // 接口校验
    // }
    let passWordResult: any = ref({})
    function getBackResult(res: any) {
      passWordResult.value = res
      // console.log('getBackResult*****密码', passWordResult.value)
    }
    onMounted(async () => {
      await getTableData()
      await initSelectData()
      //获取菜单列表
      const { data: res, code, msg } = await Role.getAuthorityMenu()
      if (code === 200) {
        table.authorityMenu = res
        table.menuData = arrayToTree(table.authorityMenu, 0)
        // console.log('------操作员功能菜单', table.menuData)
      }
      else ElMessage.error(msg)
    })

    // const moreDialog = (data: any) => {
    //   more.value = true
    //   moreData.value = data
    //   // console.log('更多按钮', state.funcButton)
    // }
    // 关闭添加、编辑窗口
    const closed = () => {
      table.addOperatorForm = {
        account: '',
        name: '',
        sex: 1,
        password: '',
        email: '',
        phone: '',
        avatar: ''
      }
    }
    // 关闭授权窗口
    const closedAuthorize = async () => {
      activeName.value = 'second'
      table.actSData = []
      table.menuSData = []
      table.menuSQData = []
      table.menuAllData = []
      table.expireTime = ''
      hasLoading.value = false
      loadingCatch.value = false
      DataLimit.value?.clear()
      await nextTick()
      limitRef.value ? limitRef.value.clearSelection() : null
      isUserHandle.value = false
    }

    const refTable = toRefs(table)
    return {
      state,
      token: computed(() => state.token),
      token_type: computed(() => state.token_type),
      ...refTable,
      formRef,
      limitRef,
      getTableData,
      handleSizeChange,
      more,
      moreData,
      hasLoading,
      // moreDialog,
      closed,
      handleChangeidNumber,
      handleChangephone,
      handleCurrentChange,
      Plus,
      Refresh,
      Search,
      avatar,
      httpRequest,
      addAvatar,
      deleteImg,
      imgFileRef,
      avatarBeforeUpload,
      avatarHandleExceed,
      toAuthorize,
      activeName,
      DataLimit,
      closedAuthorize,
      getBackResult,
      menuEditorRef
    }
  },
})
</script>
<style lang="scss" scoped>
.text {
  color: v-bind (color);
}

.el-table .warning-row {
  background: oldlace;
}

.el-table .success-row {
  background: #f0f9eb;
}

.el-avatar>img {
  display: block;
  height: 100%;
  width: 100%;
  vertical-align: middle;
}

.useavatar {
  display: block;
  width: 36px;
  height: 36px;

  img {
    display: block;
    height: 100%;
    width: 100%;
    vertical-align: middle;
  }
}

.childbox {
  .basedata {
    margin-bottom: 20px;

    p {
      line-height: 180%;
    }
  }

  h3 {
    margin-bottom: 13px;
  }
}

.butdrop {
  :deep(.el-dropdown) {
    font-size: 12px;
  }

  .el-dropdown-link {
    font-size: 12px;
  }
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

.isAdmin {
  :deep(.el-tabs__header) {
    display: none;
  }
}

.upload-box {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  width: 100px;
  height: 100px;
  line-height: 100px;
  background-color: #fff;

  .upload-hd {
    display: block;
    height: 100px;
  }

  .avatar-uploadered {
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
  }

  .avatar-uploadered-icon {
    display: block;
    // font-size: 28px;
    color: #8c939d;
    width: 100%;
    height: 100px;
    line-height: normal;
    text-align: center;

    .el-icon {
      margin-top: 22px;
    }

    span {
      display: inherit;
      font-style: normal;
      // font-size: 5px;
      line-height: normal;
    }
  }

  .handle-bar {
    height: 20px;
    z-index: 5;
    position: absolute;
    width: 100%;
    color: #000;
    background: #f4f4f5;
    bottom: 0;

    .text-center {
      display: block;
      height: 20px;
      line-height: 20px;
      font-size: 12px;
    }
  }

  .images-box {
    position: relative;
    display: block;
    min-height: 1px;
    border: 0;
    line-height: 0;
    background: var(--el-fill-color-light);
    overflow: hidden;

    :deep(.el-image__wrapper) {
      position: relative;
      line-height: 100px;
      text-align: center;
    }
  }
}

.avatar-alert {
  line-height: 100%;
  margin-top: 8px;

  :deep(.el-alert__title) {
    line-height: 100%;
    font-size: 12px;
  }
}
</style>