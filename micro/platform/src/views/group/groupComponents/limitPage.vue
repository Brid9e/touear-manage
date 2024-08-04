<!--
 * @Author: your name
 * @Date: 2021-10-20 09:05:45
 * @LastEditTime: 2022-05-18 18:37:44
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /management/src/apps/platform/views/group/groupComponents/limitPage.vue
-->
<template lang="pug">
#limit-page
  el-tabs(type="card" v-model="limitType" @tab-change="onChange")
    el-tab-pane(label="学号" name="1")
    el-tab-pane(label="规则" name="2")
  AddWhite(v-if="limitType == '1'" v-model:showWhite="showSnoList" :identityList="identityList" :id="id" @updateWhiteList="getExtendInfoList")
  AddRule(v-else v-model="showRule" v-bind="{id, identityList, departList, campusList, schcodeList}" @updateWhiteList="getExtendInfoList" @closed="showRule = false")
  HeadOperation
    el-input(:prefix-icon="Search" v-model="accountSno" placeholder="通过学号筛选" @keydown.enter="getExtendInfoList('messageBox')")
    el-button(:icon="Search", type="primary" @click="getExtendInfoList('messageBox')") 查询
    el-button(:icon="Refresh", @click="clear") 重置
    template(#right)
      el-button(v-if="limitType == '2'" :icon="Memo", type="primary" @click="showRule = true" :disabled="!state.funcButton.systemGroupRemoveUser") 规则
      el-button(v-if="limitType == '1'" :icon="Plus", type="primary" @click="openSnoDialog" :disabled="!state.funcButton.systemGroupRemoveUser") 添加
    template(#fold)
      el-form(label-width='60px', inline)
        el-row
          el-col(:xs="12", :sm="12", :md="8", :lg="6", :xl="4")
            el-form-item(label="学号")
              el-input(v-model="accountSno" placeholder="请输入内容")
          el-col(:xs="12", :sm="12", :md="8", :lg="6", :xl="4")
            el-form-item(label="姓名")
              el-input(v-model="accountName" placeholder="请输入内容")
          el-col(:xs="12", :sm="12", :md="8", :lg="6", :xl="4")
            el-form-item(label="部门")
              departSelector.display-block(placeholder='请输入内容', v-model='departCode', clearable)
          el-col(:xs="12", :sm="12", :md="8", :lg="6", :xl="4")
            el-form-item(label="身份")
              el-select.display-block(
                placeholder='请输入内容',
                v-model='identityCode',
                clearable
              )
                el-option(
                  v-for='item in identityList',
                  :label='item.name',
                  :value='item.code',
                  :key='item + "type"'
                )
          //- el-col(:xs="12", :sm="12", :md="8", :lg="6", :xl="4")
            el-form-item
              el-button(:icon="Search", type="primary" @click="getExtendInfoList") 查询
  el-table(:data="extendInfoList" @selection-change="handleSelectionChange" size='medium', v-loading="loading")
    el-table-column(v-if="limitType == '1'" type="selection" align="center")
    el-table-column(label="编号" prop="ROW_ID" width="80" align="center")
    el-table-column(label="登录名" prop="accountAccount")
    el-table-column(label="学工号" prop="accountSno")
    el-table-column(label="姓名" prop="accountName")
    el-table-column(label="校区" prop="campusName")
    el-table-column(label="部门" prop="departmentName")
    el-table-column(label="身份" prop="identityName")
    //- el-table-column(label="操作")
      template(#default='scope')
        el-button(type="danger" plain) 删除
  .flexCenter
    .button-box(v-show="limitType == '1'")
      el-button(:icon="Delete" type='danger' @click="toRemove" :disabled="snoList.length == 0 || !state.funcButton.systemGroupRemoveUser") 删除(已选{{  snoList.length  }})
      el-button(:icon="Delete" type='danger' @click="toRemove('all')" :disabled="!extendInfoList?.length") 全部删除
    el-pagination( @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="white.currentPage"
      :page-sizes="[10, 20, 30, 40]"
      :page-size="white.pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="white.total"
      :page-count="white.pageCount"
      background)
</template>

<script lang="ts" setup>
import { Group, identityInfo } from '@/service/platform/index'
import { ElMessageBox, ElMessage } from 'element-plus'
import { useRoute, useRouter } from 'vue-router'
import { defineComponent, ref, onMounted, computed, reactive } from 'vue'
import AddWhite from './addWhite.vue'
import AddRule from './addRule.vue'
import { useStore } from 'vuex'
import { key } from '@/store'
import { Info } from '@/service/multiMedia'
import { Search, Plus, Delete, Refresh, Memo } from '@element-plus/icons-vue'
import HeadOperation from '@/components/headOperation.vue'
import { String } from 'lodash'
import departSelector from '@/components/departSelector.vue'

onMounted(() => {
  getExtendInfoSwitch()
  getExtendInfoList()
  getIdentityList()
  getCampusList()
  // getSchcodeList()
})
const store = useStore(key)
const { state } = store
const route: any = useRoute()
const router: any = useRouter()
let id = route.params.id
let type = route.query.type
let tabsName = ref('白名单')
let password = ref(null)
let saveSwitch: any = ref(false)
let limitSwitch: any = ref(false)
const showRule: any = ref(false)
const showSnoList: any = ref(false)
const identityList: any = ref([])
const campusList: any = ref([])
const schcodeList: any = ref([])
const identityCode: any = ref()
const departCode: any = ref()
const loading: any = ref(false)
const extendInfoList: any = ref([])
const something: any = ref('')
const snoList: any = ref([])
const accountSno: any = ref('')
const accountName: any = ref('')
const limitType = ref('1')

let white = reactive({
  currentPage: 1,
  total: 0,
  pageCount: 0,
  pageSize: 10,
})

const selectNum = ref(0)

const getExtendInfoSwitch = async () => {
  loading.value = true
  const params = {
    type: 'group',
    resourceId: id,
  }
  const { data: res, code, msg }: any = await Group.getExtendInfoSwitch(params)
  if (code === 200) {
    limitSwitch.value = res
    loading.value = false
  } else {
    ElMessage.error(msg)
    loading.value = false
  }
}

const handleCurrentChange = (val: number) => {
  white.currentPage = val
  getExtendInfoList()
}

const handleSizeChange = (val: number) => {
  white.pageSize = val
  getExtendInfoList()
}

const saveExtendInfoSwitch = () => {
  saveSwitch = true
  ElMessageBox.confirm('您确认要切换权限开关吗？', '提示', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(async () => {
      const params = {
        resourceId: id,
        type: 'group',
        value: limitSwitch.value == true ? false : true,
      }
      const { code, msg }: any = await Group.extendInfoSwitch(params)
      if (code === 200) {
        getExtendInfoSwitch()
        ElMessage.success(msg)
        saveSwitch.value = false
      }
    })
    .catch(() => {
      saveSwitch.value = false
      getExtendInfoSwitch()
    })
}

const removeExtendInfoList = async () => {
  loading.value = true
  const params = {
    type: 'group',
    resourceId: id,
    resourceMap: {
      sno: snoList.value,
    },
    // json: JSON.stringify(this.limitForm)
  }
  // {"selectLike":true,"accountAccount":null,"accountName":null,"accountSno":null,"identityCode":null,"campusCode":null,"accountMobile":null,"accountEmail":null}
  const {
    data: res,
    msg,
    code,
  }: any = await Group.removeExtendList(params, 'messageBox')
  if (code === 200) {
    getExtendInfoList()
    // white.total = res.total
    // white.pageSize = res.size
    // white.currentPage = res.current
    // white.pageCount = res.pages == 0 ? 1 : res.pages
    loading.value = false
    ElMessage.success('删除成功')
  }
}
const toRemove = async (type?: string) => {
  ElMessageBox.confirm(
    type == 'all'
      ? '您确定要删除所有群组人员吗?'
      : '您确定要从群组中删除这些人员吗?',
    '提示',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }
  )
    .then(() => {
      removeExtendInfoList()
    })
    .catch(() => {})
}

const handleClick = (tab: any) => {
  tabsName.value = tab.props.label
}

const back = () => {
  router.back(-1)
}

const getIdentityList = async () => {
  const { data: res, code, msg }: any = await Info.getIdentityList()
  if (code === 200) {
    identityList.value = res
  } else {
    console.log(msg)
  }
}

const getCampusList = async () => {
  const { data: res, code, msg }: any = await Group.getCampusList()
  if (code === 200) {
    campusList.value = res
  }
}

const getSchcodeList = async () => {
  const { data: res, code, msg }: any = await identityInfo.getSchcodeList()
  if (code === 200) {
    schcodeList.value = res
  }
}

const openSnoDialog = () => {
  showSnoList.value = true
}

const getExtendInfoList = async (msgBox?: string) => {
  loading.value = true
  const params: any = {
    type: 'group',
    resourceId: id,
    current: white.currentPage,
    size: white.pageSize,
  }
  params.json = JSON.stringify({
    accountSno: accountSno.value || undefined,
    accountName: accountName.value || undefined,
    accountIdentityCode: identityCode.value || undefined,
    accountDepartmentCode: departCode.value || undefined,
    selectLike: true,
    type: limitType.value,
  })
  // {"selectLike":true,"accountAccount":null,"accountName":null,"accountSno":null,"identityCode":null,"campusCode":null,"accountMobile":null,"accountEmail":null}
  const { data: res, code }: any = await Group.getExtendInfoList(params, msgBox)
  if (code === 200) {
    extendInfoList.value = res.records
    white.total = res.total
    white.pageSize = res.size
    white.currentPage = res.current
    white.pageCount = res.pages == 0 ? 1 : res.pages
    loading.value = false
  }
}
const handleSelectionChange = (val: any) => {
  snoList.value = val.map((r: any) => r.accountSno)
}

const onChange = () => {
  getExtendInfoList()
}

const clear = () => {
  accountSno.value = ''
  accountName.value = ''
  departCode.value = ''
  identityCode.value = ''
}
</script>

<style lang="scss" scope>
#limit-page {
  .flexCenter {
    display: flex;
    justify-content: space-between;

    .button-box {
      margin-top: 24px;
    }
  }

  .switch {
    display: flex;
    align-items: center;
  }

  .back {
    color: var(--main-primary);
    cursor: pointer;

    &:hover {
      color: #52a6fa;
    }
  }

  .locked-box {
    margin-top: -2rem;
    width: 100%;
    height: 90vh;
    background-color: #ffffffda;
    z-index: +900;
    position: absolute;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;

    .input-box {
      display: flex;
      justify-content: center;
      flex-direction: column;
      align-items: center;
      width: 300px;

      .icon {
        width: 5rem;
        height: 5rem;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 36px;
        color: #ff4949;
      }

      .msg {
        font-size: 0.85rem;
        margin-bottom: 1rem;
        color: #606266;
      }

      .unlock {
        width: 20px;
        height: 20px;
        border-radius: 50%;
        display: flex;
        justify-content: center;
        align-items: center;
        border: solid 1px #dcdfe6;
        transition: all 0.2s ease;
        margin-top: 5px;
        margin-right: 2px;

        &:hover {
          color: var(--main-primary);
          border: solid 1px var(--main-primary);
        }
      }

      .el-input__inner {
        border-radius: 20px;
      }
    }
  }
}
</style>
