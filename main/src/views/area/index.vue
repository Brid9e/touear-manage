<template lang="pug">
div
  HeadOperation
    el-input(:prefix-icon="Search" v-model='pageInfo.name', placeholder='通过名称筛选' @keydown.enter="inquire")
    el-button(:icon="Search" type='primary' @click='inquire') 查询
    el-button(:icon="Refresh" @click="reset") 重置
    template(#right)
      el-button(type="primary" :icon="Plus"  @click="add('添加区域')" :disabled='!funcButton.subarea_add' :loading="!funcButton.subarea_add") 添加
    template(#fold)
      el-form(:label-width="80" :model="pageInfo" inline)
        el-row
          el-col(:xs="12", :sm="12", :md="8", :lg="6", :xl="4")
            el-form-item(label="联系人姓名" label-width='120')
              el-input(v-model='pageInfo.operatorName', placeholder='请输入关键字' @keydown.enter="inquire")
          //- el-col(:xs="12", :sm="12", :md="8", :lg="6", :xl="4")
          //-   el-form-item(label="联系人账号" label-width='120')
          //-     el-input(v-model='pageInfo.operatorAccount', placeholder='请输入关键字' @keydown.enter="inquire")
          el-col(:xs="12", :sm="12", :md="8", :lg="6", :xl="4")
            el-form-item(label="联系人电话" label-width='120')
              el-input(v-model='pageInfo.phone', placeholder='请输入关键字' @keydown.enter="inquire")
  el-table(:data="tableData" style="width: 100%;" v-loading="tableLoading")
    el-table-column(label="编号" prop="id" align="center" width="80")
    el-table-column(prop="name" label="名称")
    //- el-table-column(prop="operatorAccount" label="联系人账号")
    el-table-column(prop="operatorName" label="联系人姓名")
    el-table-column( label="联系人电话" show-overflow-tooltip)
      template(#default="scope")
        //- span {{scope.row.phone.replace(/^(.{3})(?:\d+)(.{2})$/, "$1*****$2") }}
        span {{scope.row?.phone?.replace(/^(.{3})(?:\d+)(.{2})$/, "$1*****$2") || ''}}
    el-table-column(prop="agencyNum" label="渠道商数量")
      template(#default="scope")
        el-link.num(type="primary" :underline="false" @click='lookList(scope.row, "agency")' ) {{scope.row?.agencyNum}}
        //- el-link(type="primary" :underline="false" v-if='scope.row?.agencyNum > 0') 查看
        //- el-icon(:size="20", color="#999" style='color: blue;' type="primary")
        //-   Search
    el-table-column(prop="tenantNum" label="租户数量")
      template(#default="scope")
        el-link.num(type="primary" :underline="false" @click='lookList(scope.row, "tenant")' ) {{scope.row?.tenantNum}}
        //- el-link(type="primary" :underline="false" @click='lookList(scope.row, "tenant")' v-if='scope.row?.tenantNum > 0') 查看
    el-table-column(label='状态', prop='status' width='100' align='center')
      template(#default='scope')
        el-switch(v-model='scope.row.status', :active-value='1', :inactive-value='0' :before-change='beforeChange.bind(this, scope.row)')
    el-table-column(label="操作" width="150")
      template(#default="scope")
        //- el-button(type="info", link)
        el-button(type="primary", link, :href="null", @click="edit(scope.row, 1)" :disabled='!funcButton.subarea_edit') 编辑
        el-button(type="danger", link, :href="null", @click="handleRemove(scope.$index, scope.row)" :disabled='!funcButton.subarea_delete') 删除
        MoreHandle(v-if="funcButton.subarea_changePwd")
          el-button(link, type='primary', @click='edit(scope.row, 3)' :disabled='!funcButton.subarea_changePwd') 重置密码

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
  el-dialog(:title="dialogTit" v-model="showAdd" @closed="closed" width='800')
    div()
      el-form(:model='addAreaForm' :rules="formItemRules" ref="formRef" label-width="120px" label-position="right",autocomplete="off")
        el-form-item(v-if="isEdit === 0 || isEdit === 1" label="区域名称" prop='name')
          el-input(v-model="addAreaForm.name", placeholder="请输入区域名称")
        //- el-form-item(label="联系人账号" prop='operatorAccount')
        //-   el-input(v-model="addAreaForm.operatorAccount", placeholder="请输入联系人账号")
        el-form-item(v-if="isEdit === 0 || isEdit === 1" label="联系人姓名" prop='operatorName')
          el-input(v-model="addAreaForm.operatorName", placeholder="请输入联系人姓名")
        el-form-item.is-required(v-if="isEdit === 0 || isEdit === 3" label='密码', prop='password')
          el-input.input-width(v-model='addAreaForm.password', placeholder='请填写密码' type="password" show-password)
          PasswordStrengthChecker(:password="addAreaForm.password" :options="options" @back-rules="getBackResult")
        el-form-item.is-required(v-if="isEdit === 0 || isEdit === 3" label='确认密码', prop='confirmPassword')
          el-input.input-width(v-model='addAreaForm.confirmPassword', placeholder='请填写确认密码' type="password" show-password)
        el-form-item(v-if="isEdit === 0 || isEdit === 1" label="联系人手机号" prop='phone')
          el-input(v-model="addAreaForm.phone", placeholder="请输入手机号")
        el-form-item(v-if="isEdit === 0 || isEdit === 1" label="联系人邮箱" prop='email')
          el-input(v-model="addAreaForm.email", placeholder="请输入联系人邮箱")
        el-form-item(v-if="isEdit === 0 || isEdit === 1" label='区域状态')
          el-switch(v-model='addAreaForm.status', :active-value='1', :inactive-value='0')
    template(#footer)
      el-button(@click="cancelU") 取消
      el-button(type="primary" @click="addArea") 保存
  //- 区域下渠道商、租户列表
  el-dialog(:title="dialogAgency" v-model="showDataList")
    div(style="width: 100%; height: 60vh; overflow-y: auto")
      el-scrollbar
        el-table(:data="tableAgencyOrTenantData" style="" border v-loading="listLoading")
          template(v-if='currentType === "agency"')
            el-table-column(prop="name" label="渠道商名称" )
            //- el-table-column(prop="operatorAccount" label="负责人账号" )
            el-table-column(prop="operatorName" label="负责人姓名" )
            el-table-column(prop="phone" label="负责人电话" )
          template(v-if='currentType === "tenant"')
            el-table-column(prop="tenantName" label="租户名称" )
            el-table-column(prop="province" label="所在省份" )
            el-table-column(prop="city" label="所在城市" )
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
import { Area, Role, getAgencyList, getTenantList } from '@/service/manage'
import { arrayToTree } from '@/assets/scripts/utils'
import { ElMessageBox, ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'
// import SubDialog from '@/components/subDialog.vue'
import { Plus, Refresh, Search, View } from '@element-plus/icons-vue'
import { log } from 'console'
import { forEach, pullAll } from 'lodash'
import HeadOperation from '@/components/headOperation.vue'
import PasswordStrengthChecker from '@/components/passwordStrengthChecker/index.vue'
import MoreHandle from '@/components/moreHandle.vue'

export default defineComponent({
  components: {
    HeadOperation,
    Plus,
    View,
    Search,
    PasswordStrengthChecker,
    MoreHandle
  },
  data() {
    return {
      color: 'red',
      title: this.$route.meta.title,
      value: '',
    }
  },
  setup() {
    const router = useRouter()
    const title = router.currentRoute.value.meta.title
    const store = useStore(key)
    const { state } = store
    const tableHeight = computed(() => {
      return state.tableHeight
    })
    const funcButton = computed(() => state.funcButton)
    const currentType = ref('')
    const formRef = ref()
    const more = ref(false)
    const isChanged = ref({ phone: false, idNum: false })
    const loadingCatch = ref(false)
    const hasLoading = ref(false)
    const moreData: any = ref({})
    const validatephone = (rule: any, value: any, callback: any) => {
      if (value === '') {
        callback(new Error('手机号不能为空'))
      } else {
        const regCN = /^1(3[0-9]|4[01456879]|5[0-35-9]|6[2567]|7[0-8]|8[0-9]|9[0-35-9])\d{8}$/
        if (!regCN.test(value)) {
          callback(new Error('请输入正确的手机号码'))
        } else {
          callback()
        }
      }

    }
    // 验证邮箱的规则
    const validateEmail = (rule: any, value: any, callback: any) => {
      const reg1 = /^([a-zA-Z0-9]+[-_.]?)+@[a-zA-Z0-9]+.[a-z]+.[a-z]+$/
      if (value == '' || value == undefined || value == null) {
        callback()
      } else {
        if (!reg1.test(value)) {
          callback(new Error('请输入合法的邮箱'))
        } else {
          callback()
        }
      }
    }
    // 校验名称只能是汉字 字母 数字
    const validateName = (rule: any, value: any, callback: any) => {
      if (value === '') {
        callback(new Error('内容不能为空'))
      } else {
        const regCN = /^[A-Za-z0-9\u4e00-\u9fa5]+$/
        if (!regCN.test(value)) {
          callback(new Error('请输入正确的内容(不能包含特殊字符)'))
        } else {
          callback()
        }
      }

    }
    const table: any = reactive({
      userInfo: store.state.userInfo,
      showAdd: false,
      showDataList: false,
      pageInfo: {
        current: 1,
        size: 10,
        // operatorAccount: '', //联系人账号
        name: '', // 区域名称
        phone: '', // 联系电话
        operatorName: '', // 联系人姓名
        status: '' // 1:开启 0:关闭
      },
      total: 0,
      tableAgencyOrTenantData: [],
      tableLoading: false,
      listLoading: false,
      tableData: [],
      isEdit: 0, //0是非编辑状态（新建状态）
      dialogTit: '添加区域',
      dialogAgency: '',
      addAreaForm: {
        id: '',
        name: '',
        // operatorAccount: '',
        password: '',
        confirmPassword: '',
        operatorName: '',
        phone: '',
        email: '',
        status: 1
      },
      formItemRules: {
        name: [
          // { required: true, message: '区域名称不能为空', trigger: 'blur' },
          { required: true, validator: validateName, trigger: 'blur' },
          {
            type: 'string',
            max: 20,
            message: '区域名称超出长度限制',
            trigger: 'blur',
          },
        ],
        password: [
          { required: true, message: '密码不能为空', trigger: 'blur' },
        ],
        confirmPassword: [
          { required: true, message: '确认密码不能为空', trigger: 'blur' },
          {
            validator: (rule: any, value: any, callback: any) => {
              console.log('区人民---', table.addAreaForm.password)
              if (value !== table.addAreaForm.password) {
                callback(new Error('确认密码与密码不一致'));
              } else {
                callback();
              }
            }, trigger: 'blur'
          }
        ],
        // operatorAccount: [
        //   { required: true, validator: validateName, trigger: 'blur' },
        //   {
        //     type: 'string',
        //     max: 10,
        //     message: '联系人账号超出长度限制',
        //     trigger: 'blur',
        //   },
        // ],
        operatorName: [
          { required: true, validator: validateName, trigger: 'blur' },
          {
            type: 'string',
            max: 10,
            message: '联系人姓名超出长度限制',
            trigger: 'blur',
          },
        ],
        phone: [
          /*  { required: true, message: '手机号不能为空', trigger: 'blur' }, */
          { required: true, validator: validatephone, trigger: 'blur' },
          // { pattern: /^1\d{10}$/, message: '手机号码格式不正确', trigger: 'change' }
        ],
        email: [
          { required: true, message: '请输入联系人邮箱', trigger: 'blur' },
          { validator: validateEmail, message: '请输入正确的邮箱地址', trigger: 'blur' }
        ]
      },
      reset: () => {
        // 重置
        // console.log("********");
        // console.log(pageInfoRef.value);
        // (pageInfoRef.value as any)?.resetFields()
        // table.pageInfo. = null;
        table.pageInfo.name = ''
        table.pageInfo.phone = ''
        // table.pageInfo.operatorAccount = ''
        table.pageInfo.operatorName = ''
        table.pageInfo.current = 1
      },
      inquire: () => {
        // 查询
        getTableData()
      },
      cancelU: () => {
        // 取消
        table.showAdd = false
        isChanged.value.idNum = false
        isChanged.value.phone = false
        formRef.value.resetFields()
      },
      edit: (data: any, type: number) => {
        table.isEdit = type
        table.dialogTit = (type === 1 ? '编辑区域' : type === 3 ? '重置密码' : '添加区域') + '-' + data.name
        table.addAreaForm.id = data.id
        if (table.isEdit === 1) {
          table.addAreaForm = Object.assign({}, table.addAreaForm, data)
          table.addAreaForm.password = null
          table.addAreaForm.confirmPassword = null
        }
        if (table.isEdit === 3) {
          for (let i in table.addAreaForm) {
            ; (table as any).addAreaForm[i] = null
          }
          table.addAreaForm.id = data.id
          table.addAreaForm.account = data.account
        }
        // if (table.isEdit === 1) {
        //   table.addAreaForm.name = data.name
        //   table.addAreaForm.operatorName = data.operatorName
        //   table.addAreaForm.phone = data.phone
        //   table.addAreaForm.email = data.email
        //   table.addAreaForm.status = data.status
        // }
        table.showAdd = true
        console.log('编辑-----', table.addAreaForm)
      },
      // 删除
      handleRemove: (index: number, data: any) => {
        ElMessageBox.confirm('确定要删除' + data.name + '区域吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        })
          .then(async () => {
            const id = data.id
            const params = {
              id: id,
            }
            const { code, msg }: any = await Area.areaDelete(
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
      addArea: () => {
        // 添加
        if (table.isEdit === 0) {
          formRef.value.validate((valid: any) => {
            addAreaData()
          })
        }
        // 编辑
        if (table.isEdit === 1) {
          formRef.value.validate((valid: any) => {
            if (valid) {
              upDateAreaData()
            }
          })
        }
        // 重置密码
        if (table.isEdit === 3) {
          formRef.value.validate((valid: any) => {
            if (valid) {
              upDateAreaData()
            }
          })
        }

      },
      add: () => {
        // 添加用户
        table.isEdit = 0
        table.dialogTit = '添加区域'
        table.showAdd = true
        for (let i in table.addAreaForm) {
          ; (table as any).addAreaForm[i] = null
        }
        table.addAreaForm.status = 1
        // table.addAreaForm.phone = ''
        console.log(
          '添加区域*****',
          table.addAreaForm
        )
      }
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
    // 查看渠道商、租户列表
    const lookList = (val: any, type: string) => {
      currentType.value = type
      table.showDataList = true
      table.tableAgencyOrTenantData = []
      if (val && val.id && val.name) {
        table.dialogAgency = `${val.name}的${type === 'agency' ? '渠道商' : '租户'}列表`
        if (type === 'agency') {
          getAgencyData(val?.id)
        }
        if (type === 'tenant') {
          getTenantData(val?.id)
        }
      } else {
        ElMessage({
          showClose: true,
          message: '未找到数据',
          type: 'warning',
        })
      }
    }
    // 查看渠道商列表
    async function getAgencyData(itemId: string) {
      table.listLoading = true
      const params = {
        subareaId: itemId
      }
      const { data: res, code, msg } = await getAgencyList(params)
      if (code === 200) {
        table.listLoading = false
        table.tableAgencyOrTenantData = res
      } else {
        table.listLoading = false
        ElMessage({
          showClose: true,
          message: msg,
          type: 'warning',
        })
      }
    }
    // 查看租户列表
    async function getTenantData(itemId: string) {
      table.listLoading = true
      const params = {
        subareaId: itemId
      }
      const res = await getTenantList(params)
      if (res?.code === 200) {
        table.listLoading = false
        table.tableAgencyOrTenantData = res.data
      } else {
        table.listLoading = false
        ElMessage({
          showClose: true,
          message: res.msg,
          type: 'warning'
        })
      }
    }
    // 获取区域列表
    async function getTableData() {
      table.tableLoading = true
      // 过滤掉值为空的参数
      const params: any = {}
      for (let item in table.pageInfo) {
        if (table.pageInfo[item]) params[item] = (table.pageInfo[item])
      }
      const res = await Area.getAreaList(params)
      if (res && res.data && res.data.records) {
        table.tableLoading = false
        table.total = res.data.total
        table.tableData = res.data.records
      } else {
        table.tableLoading = false
        ElMessage({
          showClose: true,
          message: res.msg,
          type: 'warning',
        })
      }
    }
    // 添加区域
    async function addAreaData() {
      const {
        data: res,
        code,
        msg,
      }: any = await Area.areaAdd(table.addAreaForm)
      if (code === 200) {
        // console.log("添加成功", res)
        table.showAdd = false
        ElMessage.success('添加成功')
        getTableData()
      } else {
        ElMessage.warning(msg)
      }
    }
    // 编辑区域
    async function upDateAreaData() {
      const {
        data: res,
        code,
        msg,
      }: any = await Area.areaEdit(table.addAreaForm)
      if (code === 200) {
        table.showAdd = false
        ElMessage.success('编辑成功')
        getTableData()
      } else {
        ElMessage.warning(msg)
      }
    }
    // 切换状态
    const beforeChange = (item: any) => {
      return new Promise((resolve) => {
        console.log('beforeChange', item, item.status);
        ElMessageBox.confirm(
          `确定${item.status ? '关闭' : '开启'}“${item.name}”状态吗？`,
          '提示',
          {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
          }
        )
          .then(async () => {
            const params = {
              id: item.id,
              status: item.status ? 0 : 1
            }
            const {
              data: res,
              code,
              msg,
            }: any = await Area.areaEdit(params)
            if (code === 200) {
              ElMessage({
                message: msg,
                type: 'success'
              })
            } else {
              ElMessage({
                message: msg,
                type: 'error'
              })
              resolve(false)
            }
            getTableData()
          })
          .catch(() => {
            console.log('cancel')
          })
      })
    }
    let passWordResult: any = ref({})
    function getBackResult(res: any) {
      passWordResult.value = res
      // console.log('getBackResult*****密码', passWordResult.value)
    }
    onMounted(async () => {
      await getTableData()
    })

    const closed = () => {
    }
    const refTable = toRefs(table)
    return {
      state,
      token: computed(() => state.token),
      token_type: computed(() => state.token_type),
      ...refTable,
      formRef,
      getTableData,
      handleSizeChange,
      closed,
      handleCurrentChange,
      Plus,
      Refresh,
      Search,
      beforeChange,
      lookList,
      currentType,
      avatar: () => import('@/assets/images/avatar.png'),
      tableHeight: computed(() => {
        return state.tableHeight
      }),
      getBackResult,
      funcButton
    }
  }
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

.num {
  width: 30px;
}
</style>