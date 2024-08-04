<!--
 * @Author: your name
 * @Date: 2021-10-20 09:05:45
 * @LastEditTime: 2022-05-18 18:37:44
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /management/src/apps/platform/views/group/groupComponents/limitPage.vue
-->
<template lang="pug">
.wx-card-limit-list
  el-table(:data="extendInfoList" @selection-change="handleSelectionChange" size='medium', v-loading="loading")
    el-table-column(label="学号" prop="accountSno")
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
      layout="total, prev, pager, next"
      :total="white.total"
      :page-count="white.pageCount"
      background)
</template>

<script lang="ts" setup>
import { ref, onMounted, reactive, watch } from 'vue'
import { Group, identityInfo } from '@/service/platform/index'
import { ElMessageBox, ElMessage } from 'element-plus'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { key } from '@/store'
import { Info } from '@/service/multiMedia'
import { Search, Plus, Delete, Refresh, Memo } from '@element-plus/icons-vue'
import { String } from 'lodash'

const props = defineProps({
  id: {
    type: Number,
    default: null,
  },
  show: {
    type: Boolean,
    default: false,
  },
})

const store = useStore(key)
const { state } = store
const route: any = useRoute()
const router: any = useRouter()
let type = route.query.type
let tabsName = ref('白名单')
let saveSwitch: any = ref(false)
let limitSwitch: any = ref(false)
const showSnoList: any = ref(false)
const identityCode: any = ref()
const departCode: any = ref()
const loading: any = ref(false)
const extendInfoList: any = ref([])
const snoList: any = ref([])
const accountSno: any = ref('')
const accountName: any = ref('')
const limitType = ref('2')

let white = reactive({
  currentPage: 1,
  total: 0,
  pageCount: 0,
  pageSize: 5,
})

const selectNum = ref(0)

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
        resourceId: props.id,
        type: 'group',
        value: limitSwitch.value == true ? false : true,
      }
      const { code, msg }: any = await Group.extendInfoSwitch(params)
      if (code === 200) {
        // getExtendInfoSwitch()
        ElMessage.success(msg)
        saveSwitch.value = false
      }
    })
    .catch(() => {
      saveSwitch.value = false
      // getExtendInfoSwitch()
    })
}

const removeExtendInfoList = async () => {
  loading.value = true
  const params = {
    type: 'group',
    resourceId: props.id,
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

const openSnoDialog = () => {
  showSnoList.value = true
}

const getExtendInfoList = async (msgBox?: string) => {
  loading.value = true
  const params: any = {
    type: 'wechatCard',
    resourceId: props.id,
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

watch(
  () => props.show,
  (val) => {
    console.log(val)
    if (val) {
      // getExtendInfoSwitch()
      getExtendInfoList()
    }
  }
)

onMounted(() => {
  // getExtendInfoSwitch()
  getExtendInfoList()
})

defineExpose({
  getExtendInfoList
})
</script>

<style lang="scss" scope>
.wx-card-limit-list {
  width: 100%;
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
