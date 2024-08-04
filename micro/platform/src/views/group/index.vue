<template lang="pug">
#group
  HeadOperation
    el-input(:prefix-icon="Search", v-model='groupName', placeholder='通过群组名称筛选', clearable, style="margin-right:12px;",  @keydown.enter='getGroupData')
    el-button(:icon='Search', type='primary', @click='getGroupData("messageBox")') 查询
    el-button(:icon='Refresh', @click='clear') 重置
    template(#right)
      el-button(:icon='Plus',type='primary',@click='show = true' :disabled="!state.funcButton.systemGroupAdd") 添加
    template(#fold)
      el-form(:label-width="80" inline)
        el-row
          el-col(:xs="12", :sm="12", :md="8", :lg="6", :xl="4")
            el-form-item(label='状态')
              el-select.display-block(placeholder='请输入内容',v-model='statusValue',width='100%',clearable)
                el-option(v-for='item in groupStatus', :label='item.label', :value='item.value', :key='item.value')
          el-col(:xs="12", :sm="12", :md="8", :lg="6", :xl="4")
            el-form-item(label='类型')
              el-select.display-block(
                placeholder='请输入内容',
                v-model='typeValue',
                clearable
              )
                el-option(
                  v-for='item in groupType',
                  :label='item.label',
                  :value='item.value',
                  :key='item.value + "type"'
                )
          //- el-col(:xs="12", :sm="12", :md="8", :lg="6", :xl="4")
            el-form-item(label='时间期限')
              el-date-picker(
                type='datetimerange',
                range-separator='至',
                v-model='datetimerange'
              )
          el-col(:xs="12", :sm="12", :md="8", :lg="6", :xl="4")
            el-form-item(label='姓名')
              el-input(placeholder='请输入内容', v-model='accountName', clearable)
          el-col(:xs="12", :sm="12", :md="8", :lg="6", :xl="4")
            el-form-item(label='学号')
              el-input(placeholder='请输入内容', v-model='accountSno', clearable)
          el-col(:xs="12", :sm="12", :md="8", :lg="6", :xl="4")
            el-form-item(label='部门')
              departSelector.display-block(
                placeholder='请输入内容',
                v-model='accountDepartmentCode',
                clearable,
                filterable
              )
                //- el-option(
                //-   v-for='item in departList',
                //-   :label='item.name',
                //-   :value='item.code',
                //-   :key='item.value + "default"')
          el-col(:xs="12", :sm="12", :md="8", :lg="6", :xl="4")
            el-form-item(label='身份')
              el-select.display-block(
                placeholder='请输入内容',
                v-model='accountIdentityCode',
                clearable,
                filterable

              )
                el-option(
                  v-for='item in identityList',
                  :label='item.name',
                  :value='item.code',
                  :key='item.value + "default"'
                )
  el-table(:data='groupData', v-loading='loading', size='medium')
    //- el-table-column(type="expand")
      template(#default="{ row }")
        el-descriptions(title="更多", :column="2" style="border-left: none;padding: 1rem 2rem")
          el-descriptions-item(label="ID") {{ row.id }}
          el-descriptions-item(label="创建时间") {{ row.createTime }}
    el-table-column(label="序号", type="index", width="80", align="center")
    el-table-column(prop='name', label='群组名称', :show-overflow-tooltip='true')
    el-table-column(label='人数', :show-overflow-tooltip='true' )
      template(#default="scope")
        span(v-if="scope.row.flag && scope.row.flag[0] == '1'" style="opacity: 0.5;color:rgb(150, 151, 153);") 默认群组不显示人数
        el-button(v-else-if="scope.row.total === undefined", link, type="primary",  @click="getUserNum(scope.row)" :disabled="!state.funcButton.systemGroupViewUser") 点击获取人数
        span(v-else) {{ scope.row.total }}
        //- span(v-else) 默认群组不显示人数
    el-table-column(prop='type', label='类型')
      template(#default='scope')
        span(v-if='scope.row.type == "user"') 用户
        span(v-else-if='scope.row.type == "mercacc"') 商户
        span(v-else) 游客
    el-table-column(prop='remark', label='描述', :show-overflow-tooltip='true')
    el-table-column(prop='status', label='状态', align='center', width='100')
      template(#default='scope')
        el-switch(
          :before-change="beforeChange"
          v-model='scope.row.status',
          :active-value=1,
          :inactive-value=0,
          @change='statusSwitch(scope.$index, scope.row)',
          :disabled='(scope.row.flag == "1000000000" ? true : false) || !state.funcButton.systemGroupEdit')
    el-table-column(label='操作', width='200')
      template(#default='scope')
        el-button(link, @click='moreDialog(scope.row)', type="primary") 查看
        el-button(link, @click='edit(scope.$index, scope.row)', type="primary", :disabled="!state.funcButton.systemGroupEdit") 编辑
        el-button(link, @click='removeGroup(scope.$index)', type='danger', :disabled='(scope.row.flag == 1000000000 ? true : false) || !state.funcButton.systemGroupRemove') 删除
        MoreHandle
          el-button(link, @click='setting(scope.$index, scope.row.id, scope.row.type)', type='primary', :disabled="!state.funcButton.systemGroupSettingScheme") 方案
          el-button(link, @click="limit(scope.$index, scope.row.id)", type='primary', :disabled="!state.funcButton.systemGroupViewUser || scope.row.flag && scope.row.flag[0] == '1'") 成员

  el-dialog(title='添加群组', v-model='show', :width='500')
    el-form(:model='addGroupForm', label-width='70px')
      el-form-item(label='群组类型')
        el-radio-group(v-model='addGroupForm.type')
          el-radio-button(label='user') 用户
          el-radio-button(label='mercacc') 商户
      el-form-item(label='名称')
        el-input(v-model='addGroupForm.name', placeholder='名称（必填）')
      el-form-item(label='描述')
        el-input(v-model='addGroupForm.remark', type='textarea', placeholder='描述')
    template(#footer)
      el-button(@click='show = false') 取消
      el-button(type='primary', @click='addGroup') 确认


  .flex-center
    el-pagination(
      @size-change='handleSizeChange',
      @current-change='handleCurrentChange',
      :current-page='currentPage',
      :page-sizes='[10, 20, 30, 40]',
      :page-size='10',
      layout="total, sizes, prev, pager, next, jumper",
      background,
      :total='total',
      :page-count='pageCount',
    )

  //- el-dialog(title="更多" v-model="more" :width="600")
  el-drawer(v-model='more' :title='moreData.name', size='40%')
    el-descriptions(title="基本信息" :column="2")
      el-descriptions-item(label="ID") {{ moreData.id }}
      el-descriptions-item(label="描述") {{ moreData.remark }}
      el-descriptions-item(label="创建时间") {{ moreData.createTime }}

  el-dialog(title='编辑群组', v-model='showEdit', :width='500')
    el-form(:model='editGroupForm', label-width='70px')
      el-form-item(label='群组类型')
        el-radio-group(v-model='editGroupForm.type', disabled)
          el-radio-button(label='user') 用户
          el-radio-button(label='mercacc') 商户
      el-form-item(label='名称')
        el-input(v-model='editGroupForm.name')
      el-form-item(label='描述')
        el-input(v-model='editGroupForm.remark', type='textarea')
    template(#footer)
      el-button(@click='showEdit = false') 取消
      el-button(type='primary', @click='submitEdit') 确认
</template>

<script lang="ts">
import FilterContent from '@/components/filterContent/index.vue'
import { defineComponent, ref, computed, onMounted, watch } from 'vue'
import { dateFormat } from '@/assets/scripts/date'
import { Group } from '@/service/platform/index'
import { ElMessage, ElMessageBox } from 'element-plus'
import { msgbox, IMsgBoxOptions } from '@/hooks/subMessageBox'
import { useStore } from 'vuex'
import { key } from '@/store'
import { Info } from '@/service/multiMedia'
import { Plus, Refresh, Search, Operation } from '@element-plus/icons-vue'
import TableTitle from '@/components/tableTitle.vue'
import HeadOperation from '@/components/headOperation.vue'
import MoreHandle from '@/components/moreHandle.vue'
import { useRoute } from 'vue-router'
import { reject } from 'lodash'
import departSelector from '@/components/departSelector.vue'


export default defineComponent({
  setup() {
    const more: any = ref(false)
    const store = useStore(key)
    const { state } = store
    const route = useRoute()
    const moreData: any = ref({})
    const departList: any = ref([])
    const identityList: any = ref([])
    const moreDialog = (data: any) => {
      more.value = true
      moreData.value = data
    }
    onMounted(() => {
      getIdentityList()
    })

    const getIdentityList = async () => {
      const { data: res, code, msg }: any = await Info.getIdentityList()
      if (code === 200) {
        identityList.value = res
      }
    }
    return {
      more,
      moreData,
      departList,
      identityList,
      moreDialog,
      Plus,
      Refresh,
      Search,
      Operation,
      state,
    }
  },
  components: {
    TableTitle,
    HeadOperation,
    FilterContent,
    departSelector,
    MoreHandle
  },
  data() {
    return {
      id: 0,
      form: {
        groupName: '',
        statusValue: null,
        typeValue: '',
        defaultValue: '',
      },
      groupData: [],
      show: false,
      showEdit: false,
      oGroupInfo: {},
      saveSwitch: false,
      activeName: 'first',
      activeName_: 'first',
      // 菜单属性
      propSetting: 'propSetting',
      limitWhite: 'limitWhite',
      // 时间数组，摘取开始时间和结束时间
      datetimerange: [],
      accountName: '',
      accountSno: '',
      accountDepartmentCode: null,
      accountIdentityCode: '',
      startCreateTime: '',
      endCreateTime: '',
      drawer_limit: false,
      drawer_setting: false,
      limitSwitch: false,
      value: false,
      total: 0,
      groupName: '',
      statusValue: null,
      typeValue: '',
      defaultValue: '',
      loading: false,
      editData: {},
      // 分页参数
      pageCount: 0,
      pageSize: 10,
      currentPage: 1,

      addGroupForm: {
        type: 'user',
        name: '',
        remark: '',
      },
      editGroupForm: {
        type: '',
        name: '',
        remark: '',
      },
      groupStatus: [
        {
          value: 1,
          label: '启用',
        },
        {
          value: 0,
          label: '禁用',
        },
      ],
      groupType: [
        {
          value: 'user',
          label: '用户',
        },
        {
          value: 'mercacc',
          label: '商户',
        },
      ],
      defaultType: [
        {
          value: '1',
          label: '是',
        },
        {
          value: '0',
          label: '否',
        },
      ],
      tabsName: '白名单',
      tabsNameSetting: 'app',
      userType: '',
    }
  },
  // watch(route, async (val: any) => {
  //     if (val.name === 'schemeAdd') {
  //       await getSchemeList()
  //     }
  //   })
  activated() {
    this.getGroupData()
  },
  watch: {
    // '$route': {
    //   async handler(val: any) {
    //     if (val.name === 'group') {
    //       await this.getGroupData()
    //     }
    //   }
    // },
    datetimerange(date) {
      if (date == null) {
        this.startCreateTime = ''
        this.endCreateTime = ''
        return
      }
      if (date.length > 0) {
        const startDay: string = dateFormat('YYYY-MM-DD HH-MM-SS', date[0])
        // const starttime: string = date[0].toLocaleTimeString('chinese', {
        //   hour12: false
        // })
        this.startCreateTime = startDay
        const endtDay: string = dateFormat('YYYY-MM-DD HH-MM-SS', date[1])
        // const endtime: string = date[1].toLocaleTimeString('chinese', {
        //   hour12: false
        // })
        this.endCreateTime = endtDay
      }
    },
  },
  created() {
    // this.groupData.value = false
  },
  mounted() {
    this.getGroupData()
  },

  methods: {
    async getUserNum(item: any) {
      const params = {
        type: 'group',
        resourceId: item.id,
      }
      const { data: res, code } = await Group.getAccountCount(
        params,
        'messageBox'
      )
      if (code === 200) {
        item.total = res
      }
    },
    beforeChange() {
      return new Promise((resove, reject) => {
        ElMessageBox.confirm('确定要切换该群组状态吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        })
          .then(() => {
            resove(true)
          })
          .catch(() => {
            reject(false)
          })
      })
    },
    // handleClick(tab: any) {
    //   this.tabsName = tab.props.label
    // },
    handleClickSetting(tab: any) {
      if (tab.props.label === 'App方案信息') {
        this.tabsNameSetting = 'app'
      }
      if (tab.props.label === 'Pc方案信息') {
        this.tabsNameSetting = 'pc'
      }
      if (tab.props.label === '微信小程序方案信息') {
        this.tabsNameSetting = 'wechatMini'
      }
      if (tab.props.label === 'H5方案信息') {
        this.tabsNameSetting = 'h5'
      }
    },
    handleCurrentChange(val: number) {
      this.currentPage = val
      this.getGroupData()
    },
    handleSizeChange(val: number) {
      console.log(val)
      this.pageSize = val
      this.getGroupData()
    },
    limit(index: number, id: number) {
      // this.$router.push({ name: 'limit', params: { id: id } })
      this.$router.push({ name: 'limitPage', params: { id: id } })
      // limitPage
      // this.drawer_limit = true
      // this.getExtendInfoSwitch()
    },
    limitPage(index: number, id: number) {
      this.$router.push({ name: 'limit', params: { id: id } })
      // this.$router.push({ name: 'limitPage', params: { id: id } })
      // limitPage
      // this.drawer_limit = true
      // this.getExtendInfoSwitch()
    },
    setting(index: number, id: number, type: string) {
      this.$router.push({
        name: 'setting',
        params: { id: id },
        query: { type: type },
      })
      // this.id = id
      // this.drawer_setting = true
      // if (type === 'visitor') {
      //   this.userType = 'user'
      //   return
      // }
      // this.userType = type
    },
    edit(index: number, data: any) {
      this.showEdit = true
      this.editGroupForm.type = data.type
      this.editGroupForm.name = data.name
      this.editGroupForm.remark = data.remark
      this.oGroupInfo = {
        type: data.type,
        name: data.name,
        remark: data.remark,
      }
      this.editData = data
    },
    submitEdit() {
      if (
        JSON.stringify(this.oGroupInfo) === JSON.stringify(this.editGroupForm)
      ) {
        ElMessage.warning('无更改')
        return
      }
      this.groupEdit(
        (this.editData as any).id,
        this.editGroupForm.name,
        (this.editData as any).status,
        (this.editData as any).type,
        this.editGroupForm.remark
      )
      // this.groupEdit(data.id, data.name, data.status, data.type, data.remark)
    },
    async statusSwitch(index: number, data: any) {
      if (data.flag === '1000000000') {
        return
      }
      // /berserker-base/group/edit
      this.groupEdit(data.id, data.name, data.status, data.type, data.remark)
    },
    async groupEdit(
      id: number,
      name: string,
      status: number,
      type: string,
      remark: string
    ) {
      const params: any = {
        id: id,
        name: name,
        status: status,
        type: type,
        remark: remark,
      }
      console.log(params)
      const { code, msg }: any = await Group.groupEdit(params, 'messageBox')
      if (code === 200) {
        this.showEdit = false
        this.getGroupData()
        ElMessage.success('编辑成功')
      }
    },
    // 查询群组信息
    async getGroupData(msgBox?: string) {
      this.loading = true
      const params: any = {
        current: this.currentPage,
        size: this.pageSize,
        descs: 'create_time',
        likeSelectName: true,
        accountSno: this.accountSno || undefined,
        accountName: this.accountName || undefined,
        accountDepartmentCode: this.accountDepartmentCode || undefined,
        accountIdentityCode: this.accountIdentityCode || undefined,
        name: this.groupName || undefined,
        status:
          Number(this.statusValue || -1) >= 0 ? this.statusValue : undefined,
        type: this.typeValue || undefined,
        startCreateTime: this.startCreateTime || undefined,
        endCreateTime: this.endCreateTime || undefined,
      }
      const { data: res, code }: any = await Group.getGroup(params, msgBox)
      if (code === 200) {
        this.groupData = res.records
        this.total = res.total
        this.loading = false
        this.pageCount = res.pages
      } else {
        this.loading = false
      }
    },
    async addGroup() {
      // /berserker-base/group/add
      const params: any = {
        name: this.addGroupForm.name,
        status: 1,
        type: this.addGroupForm.type,
        remark: this.addGroupForm.remark,
      }
      const {
        data: res,
        code,
        msg,
      }: any = await Group.addGroup(params, 'messageBox')
      if (code === 200) {
        this.show = false
        this.groupData.unshift(res as never)
        ElMessage.success('添加成功')
        // this.getGroupData()
      }
    },

    async removeGroup(index: number) {
      ElMessageBox.confirm('确定要删除该群组吗?', '提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(async () => {
          const groupId = (this.groupData[index] as any).id
          const params = {
            id: groupId,
          }
          const { code, msg }: any = await Group.removeGroup(
            params,
            'messageBox'
          )
          if (code === 200) {
            this.groupData.splice(index, 1)
            ElMessage.success('删除成功')
            // this.getGroupData()
          }
        })
        .catch(() => { })
    },

    async saveExtendInfoSwitch() {
      this.saveSwitch = true
      ElMessageBox.confirm('您确认要切换权限开关吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(async () => {
          const params = {
            resourceId: this.id,
            type: 'group',
            value: this.limitSwitch == true ? false : true,
          }
          const { code, msg }: any = await Group.extendInfoSwitch(
            params,
            'messageBox'
          )
          if (code === 200) {
            ElMessage.success(msg)
            this.saveSwitch = false
          }
        })
        .catch(() => {
          this.saveSwitch = false
        })
    },
    // /berserker-base/extendInfo/getExtendInfoSwitch
    // async getExtendInfoSwitch() {
    //   const params = {
    //     type: 'group',
    //     resourceId: this.id
    //   }
    //   const { data: res, code }: any = await Group.getExtendInfoSwitch(params)
    //   if (code === 200) {
    //     this.limitSwitch = res
    //   }
    // },
    clear() {
      this.startCreateTime = ''
      this.endCreateTime = ''
      this.datetimerange = []
      this.groupName = ''
      this.statusValue = null
      this.typeValue = ''
      this.defaultValue = ''
      this.accountIdentityCode = ''
      this.accountDepartmentCode = null
      this.accountSno = ''
      this.accountName = ''
    },
  },
})
</script>

<style lang="scss">
#group {
  overflow-x: hidden;

  // .el-pagination {
  //   margin: 0;
  // }
  .msg-warning {
    margin-bottom: 1rem;
    border-radius: 6px;
  }

  .group-input-box .el-button {
    // width: 100%;
  }

  .display-block {
    display: block;
  }

  .el-date-editor--datetimerange {
    width: 100% !important;
  }

  .switch {
    display: flex;
    align-items: center;
  }

  // .flexCenter {
  //   display: flex;
  //   justify-content: flex-end;
  //   padding-top: 16px;
  // }
  .pagination {
    justify-content: flex-start !important;
  }
}
</style>