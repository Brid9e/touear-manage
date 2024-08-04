<!-- 查删 -->
<!--
 * @Author       : Joe
 * @Date         : 2022-08-25 13:58:27
 * @LastEditTime : 2022-08-30 09:33:30
 * @LastEditors  : Joe
 * @FilePath     : /management/src/apps/selfService/views/equipment/index.vue
-->
<template lang="pug">
.wx-coupon-manage
  HeadOperation
    el-input(:prefix-icon='Search', v-model="searchForm.name", placeholder='通过卡名称查询', clearable, style='margin-right: 12px', @keydown.enter='getCouponList("messageBox")')
    el-button(:icon='Search', type='primary', @click='getCouponList("messageBox")') 查询
    el-button(:icon='Refresh', @click='toReset') 重置
  el-table(:data="couponList" v-loading="loading")
    el-table-column(type="expand")
      template(#default="{ row }")
        el-descriptions(title="更多", :column="2" style="border-left: none;padding: 1rem 2rem")
          //- el-descriptions-item(label="卡详情-特权说明")  {{ row.baseInfoBean.notice }}
          el-descriptions-item(label="卡详情-使用说明") {{ row.baseInfoBean.description }}
    el-table-column(label='编号', prop='id' width="80" align='center')
    el-table-column(label='卡名称', prop='name')
    el-table-column(label='卡券名', prop='baseInfoBean.title')
    el-table-column(label='商户名', prop='baseInfoBean.brandName')
    el-table-column(label='可领数量限制', prop='baseInfoBean.getLimit' width="120")
    el-table-column(label='LOGO', align="center", width="100")
      template(#default='scope')
        .card-logo-box(v-if="scope?.row?.baseInfoBean?.logoUrl")
          //- 1658707156289806337
          el-image.cardimg(:src="scope?.row?.baseInfoBean?.logoUrl"  :preview-src-list="[scope?.row?.baseInfoBean?.logoUrl]" preview-teleported hide-on-click-modal)
        .is-empty(v-else) 暂无
    el-table-column(label='背景图', align="center", width="150")
      template(#default='scope')
        .card-img-box(v-if="scope?.row?.backgroundPicUrl")
          //- 1658707156289806337
          el-image.cardimg(:src="scope?.row?.backgroundPicUrl"  :preview-src-list="[scope?.row?.backgroundPicUrl]" preview-teleported hide-on-click-modal)
        .is-empty(v-else) 暂无
    el-table-column(label='背景色', align="center" width="100px")
      template(#default='scope')
        .color-box
          .color(:style="`background-color:${colorMap[scope.row?.baseInfoBean?.color] || scope.row?.baseInfoBean?.color}`")
            code {{ colorMap[scope.row?.baseInfoBean?.color] || scope.row?.baseInfoBean?.color }}
    el-table-column(label='操作' width="120" align="center")
      template(#default="scope")
        el-button(type="primary" link @click="onEdit(scope.row, 'messageBox')") 编辑
        el-button(type="danger" link @click="onDelete(scope.row, 'messageBox')") 删除

  .flex-center
    el-pagination(@size-change='pagination.handleSizeChange', @current-change='pagination.handleCurrentChange', :current-page='pagination.current', :page-size='pagination.size', layout="total, sizes, prev, pager, next, jumper", :total='pagination.total', background)

  EditDialog(v-model="showEdit" v-bind="{ show: showEdit, id: currentItem?.id, color: colorMap, item: currentItem }" @close="showEdit = $event" @updateTable="getCouponList")
</template>

<script lang="ts" setup>
import { ref, onMounted, reactive, onActivated } from 'vue'
import HeadOperation from '@/components/headOperation.vue'
import EditDialog from './modules/editDialog.vue'
import {
  Refresh,
  Plus,
  Search,
  MagicStick,
  Download,
  Tools,
} from '@element-plus/icons-vue'
import { Equipment } from '@/service/self-service'
import { cloneDeep, isEmpty, mapValues } from 'lodash'
import { ElMessage, ElMessageBox } from 'element-plus'
import { WxCard } from '@/service/platform'
import { getFileFromOnlineImg } from '@/assets/scripts/file'

const departmentSelect = ref([])
const equipmentSelect = ref([])
const couponList = ref([])
const searchForm: any = ref({})
const colorMap = ref({})
const loading = ref(false)
const showEdit = ref(false)
const pages = ref(0)
const currentItem = ref()

// 状态选择
const statusSelect = [
  {
    label: '完成',
    value: '1',
  },
  {
    label: '失败',
    value: '4',
  },
]

// 分页相关
const pagination = reactive({
  total: 0,
  current: 1,
  size: 10,
  handleSizeChange: (_size: any) => {
    pagination.size = _size
    getCouponList()
  },
  handleCurrentChange: (_current: any) => {
    pagination.current = _current
    getCouponList()
  },
})

// 查询卡券列表
const getCouponList = async (msgBox?: string) => {
  loading.value = true
  const params = {
    current: pagination.current,
    size: pagination.size,
    ...mapValues(searchForm.value, (v: any) => (isEmpty(v) ? undefined : v)),
  }
  const { data: res, msg, code }: any = await WxCard.getCard(params, msgBox)
  loading.value = false
  if (code === 200) {
    couponList.value = res.records
    pages.value = res.pages
    pagination.total = res.total
  }
}

// 获取微信规范颜色
const getColor = async () => {
  const { data } = await WxCard.getBgColor()
  colorMap.value = data
}

// 打开编辑窗口
const onEdit = (item: any) => {
  showEdit.value = true
  currentItem.value = item
}

// 删除
const onDelete = (item: any, msgBox: string) => {
  ElMessageBox.confirm(`确定删除名称为${item.name}的卡券吗？`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(() => {
      removeCards(item, msgBox)
    })
    .catch(() => {})
}

const removeCards = async ({ id }: any, msgBox: string) => {
  const { data, code }: any = await WxCard.removeCard({ id }, msgBox)
  loading.value = false
  if (code === 200) {
    getCouponList()
    pages.value = data.pages
    pagination.total = data.total
  }
}

// 处理状态名
const handleStatus = (status: number) => {
  let statusName = {}
  let nameCb = (label: string, status: string) => {
    return {
      label,
      status,
    }
  }
  switch (status) {
    case 1:
      statusName = nameCb('完成', 'success')
      break
    case 2:
      statusName = nameCb('取消', 'warning')
      break
    case 4:
      statusName = nameCb('失败', 'danger')
      break
    default:
      statusName = nameCb('未知', 'info')
      break
  }
  return statusName
}

// 重置
const toReset = () => {
  searchForm.value = {}
}

onMounted(() => {
  getColor()
  getCouponList()
})

onActivated(async () => {})
</script>
<style lang="scss" scoped>
.wx-coupon-manage {
  .card-img-box,
  .card-logo-box {
    height: 50px;
    display: flex;
    justify-content: center;
  }

  .color-box {
    width: 100%;
    display: flex;
    justify-content: center;
    // border-radius: 8px;
    overflow: hidden;

    .color {
      font-size: 0.875rem;
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0.3125rem;
      color: #ffffff;
    }
  }
  .is-empty {
    opacity: 0.5;
  }
}
</style>
