<!-- 查删改 -->
<!--
 * @Author       : Joe
 * @Date         : 2022-08-25 13:58:27
 * @LastEditTime : 2022-08-30 09:33:30
 * @LastEditors  : Joe
 * @FilePath     : /management/src/apps/selfService/views/equipment/index.vue
-->
<template lang="pug">
.wx-card-user
  HeadOperation
    //- el-select(v-model="searchForm.cardId" placeholder="通过卡样查询" clearable multiple filterable)
      el-option(v-for="(item, index) in cardSelect" :key="index" :label="item.name" :value="item.id")
        span(style="float: left") {{ item.name }}
        .card-img(v-if="item.imageUrl")
          el-image(:src="item.imageUrl")
    //- el-select(v-model="searchForm.identityCode" placeholder="通过身份查询" clearable multiple filterable)
      el-option(v-for="(item, index) in identitySelect" :key="index" :label="item.name" :value="item.code")
    el-input(:prefix-icon='Search', v-model="searchForm['account.name']", placeholder='通过用户姓名查询', clearable, style='margin-right: 12px', @keydown.enter='getCouponList("messageBox")')
    el-input(:prefix-icon='Search', v-model="searchForm['account.sno']", placeholder='通过学工号查询', clearable, style='margin-right: 12px', @keydown.enter='getCouponList("messageBox")')
    el-button(:icon="Search" type="primary" @click="getWxCardUser('messageBox')") 查询
    el-button(:icon='Refresh', @click='toReset') 重置
    //- template(#right)
      el-button(:icon="Plus" type="primary" @click="showSetting = true;cardItemData = { isEdit: false }") 添加
  el-table(:data='wxCardUserList')
    el-table-column(label='编号', prop='id' width="100" align="center")
    el-table-column(label='用户姓名', prop='account.name')
    el-table-column(label='学工号', prop='account.sno')
    //- el-table-column(label='金额')
      template(#default="scope")
        span {{ scope.row.price?.toFixed(2) }}
    el-table-column(label='领卡日期', prop='createDatetime')
    el-table-column(label='状态', align="center", width="100")
      template(#default="scope")
        el-tag(:type="Number(scope.row.status) ? 'success' : 'danger'") {{ Number(scope.row.status) ? '正常' : '禁用' }}
    el-table-column(label='操作', width='60')
      template(#default='scope')
        //- el-button(type='primary', link, @click="showSetting = true;cardItemData = cloneDeep({...scope.row, isEdit: true})") 编辑
        el-button(type='danger', link, @click="removeWxCardUser(scope.row.id, scope.row, 'messageBox')") 删除

  .flex-center
    el-pagination(@size-change='pagination.handleSizeChange', @current-change='pagination.handleCurrentChange', :current-page='pagination.current', :page-size='pagination.size', layout="total, sizes, prev, pager, next, jumper", :total='pagination.total', background)

  el-dialog(v-model="showEditDialog")

</template>

<script lang="ts" setup>
import { Info } from '@/service/multiMedia'
import { WxCard } from '@/service/platform'
import HeadOperation from '@/components/headOperation.vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { reactive, ref, onMounted, onActivated } from 'vue'
import { isEmpty, mapValues } from 'lodash'
// import { ReplaceCard } from '@/service/self-service'
import { Refresh, Plus, Search } from '@element-plus/icons-vue'

const identitySelect = ref([])
const searchForm: any = ref({})
const editForm: any = ref({})
const wxCardUserList: any = ref([])

// 分页相关
const pagination = reactive({
  total: 0,
  current: 1,
  size: 10,
  handleSizeChange: (_size: any) => {
    pagination.size = _size
    getWxCardUser()
  },
  handleCurrentChange: (_current: any) => {
    pagination.current = _current
    getWxCardUser()
  },
})

// 获取微信领卡用户
const getWxCardUser = async (msgBox?: string) => {
  const params = {
    current: pagination.current,
    size: pagination.size,
    ...mapValues(searchForm.value, (v: any) => (isEmpty(v) ? undefined : v)),
  }
  const { data: res, msg, code }: any = await WxCard.getCardUser(params, msgBox)
  if (code === 200) {
    wxCardUserList.value = res.records
    pagination.total = res.total
    pagination.size = res.size
    pagination.current = res.current
  }
}

// 添加或编辑
const addOrEdit = async (ref: any, msgBox?: string, item?: any) => {
  // const submit = async () => {
  //   const params = {
  //     identityCodes: item.identityCode || undefined,
  //     price: item.price || undefined,
  //     // appIds: item.appId || undefined,
  //     remarks: item.remarks || undefined,
  //     cardIds: item.cardId ? [item.cardId] : undefined,
  //   }
  //   const editParams = {
  //     ids: [item.id],
  //     status: item.status,
  //     price: item.price?.toString() || undefined,
  //   }
  //   const {
  //     data: res,
  //     msg,
  //     code,
  //   }: any = await ReplaceCard[!item.isEdit ? 'addStock' : 'editStock'](
  //     !item.isEdit ? params : editParams,
  //     msgBox
  //   )
  //   !item.isStatus && ElMessage[code == 200 ? 'success' : 'error'](msg)
  //   if (code == 200) {
  //     getWxCardUser()
  //   }
  // }
  // // 如果只是切换状态
  // if (item.isStatus) submit()
  // // 下面正常走校验流程
  // if (!ref) return
  // await ref.validate(async (valid: any, fields: any) => {
  //   if (valid) submit()
  // })
}

// 获取身份列表
const getIdentityList = async () => {
  const { data: res, msg, code }: any = await Info.getIdentityList()
  if (code === 200) identitySelect.value = res
  else ElMessage.error(msg)
}

// 删除领卡用户信息
const removeWxCardUser = (
  id?: number | string,
  item?: any,
  msgBox?: string
) => {
  ElMessageBox.confirm(
    `你确定要删除${item.account.name}的领卡信息吗？`,
    '提示',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }
  )
    .then(async () => {
      let params: any = { id }
      const { msg, code }: any = await WxCard.removeCardUser(params, msgBox)
      if (code == 200) {
        getWxCardUser()
        ElMessage.success(msg)
      }
    })
    .catch(() => {})
}

// 重置
const toReset = () => {
  searchForm.value = {}
}

// 修改状态
const beforeChange = (item: any) => {
  return new Promise((resove, reject) => {
    ElMessageBox.confirm('确定要修改收费项状态吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    })
      .then(async () => {
        await addOrEdit(null, 'messageBox', {
          ...item,
          isEdit: true,
          isStatus: true,
          status: !item.status ? 1 : 0,
        })
        resove(true)
      })
      .catch(() => {
        reject(false)
      })
  })
}

// 初始化
// onMounted(async () => {

// })

onActivated(async () => {
  getWxCardUser()
})
</script>
<style lang="scss" scoped>
.wx-card-user {
  .cardimg-box {
    height: 80px;
    display: flex;
    justify-content: center;
  }

  // .cardimg-box .cardimg:first-child {
  //   z-index: 1;
  //   backface-visibility: hidden;
  // }

  // .cardimg-box:hover .cardimg {
  //   transform: rotateY(180deg);
  // }
}

.card-img {
  width: 100%;
  display: flex;
  justify-content: right;

  .el-image {
    width: auto;
    height: 30px;
    margin-right: 0.25rem;
  }

  // display: flex;
}
</style>
