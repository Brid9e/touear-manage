<script lang='ts' setup>
import { ref, onMounted, watch, reactive } from 'vue';
import { App } from '@/service/platform';
import { SuccessFilled } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus';

const props = defineProps({
  info: {
    type: Object,
    default: () => ({})
  },
  show: {
    type: Boolean,
    default: false
  },
  type: {
    type: String,
    default: '0'
  }
})

const loading = ref(false)
const tableData = ref()

// 分页
const pagination = reactive({
  current: 1,
  size: 10,
  total: 0,
  handleSizeChange: (size: number) => {
    pagination.size = size
    getListTenant()
  },
  handleCurrentChange: (current: number) => {
    pagination.current = current
    getListTenant()
  },
})


/**
 * 获取租户列表
 */
async function getListTenant() {
  loading.value = true
  const params = {
    appCode: props.info.appCode,
    current: pagination.current,
    size: pagination.size,
    basePublic: props.type
  }
  const { data: res, msg, code }: any = await App.pageTenantByCode(params, 'messageBox').catch(() => {
    loading.value = false
  })
  if (code === 200) {
    pagination.total = res.total
    tableData.value = res.records
  }
  loading.value = false
}

async function onUpdate(row: any) {
  row.loading = true
  const params = {
    appCode: props.info.appCode,
    resource: {
      subarea: [],
      agency: [],
      tenant: [row.tenantId]
    },
    status: row.status === 1 ? 0 : 1
  }
  const { data: res, msg, code }: any = await App.updateBaseByAppCode(params).catch(() => {
    row.loading = false
  })
  if (code === 200) {
    row.status = row.status === 1 ? 0 : 1
    // getListTenant()
  } else {
    ElMessage.error(msg)
  }
  row.loading = false
}

function onClosed() {
  tableData.value = []
}

watch(() => props.show, async (val) => {
  if (val) {
    await getListTenant()
  }
}, {
  deep: true,
})

onMounted(() => {
  // console.log('testet')
})
</script>
<template lang='pug'>
el-dialog(title="租户列表" width="800" @closed="onClosed" )
  el-table(:data="tableData" v-loading="loading")
    el-table-column(prop="tenantId" label="租户编号")
    el-table-column(prop="tenantName" label="租户名称")
    el-table-column(v-if="type === '0'" label="操作" width="80" align="center")
      template(#default="{ row }")
        el-button(:type="row.status === 1 ? 'primary' : 'danger'" link @click="onUpdate(row)" :loading="row.loading") {{row.status === 1 ? '上架' : '下架'}}
  el-pagination.flex-box.flex-center(background, @size-change='pagination.handleSizeChange', @current-change='pagination.handleCurrentChange', :current-page='pagination.current', :page-sizes='[10, 20, 30, 40]', :page-size='pagination.size', layout='total, sizes, prev, pager, next, jumper', :total='pagination.total')
</template>
<style lang='scss' scoped></style>