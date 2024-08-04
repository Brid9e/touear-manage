<!--
 * @LastEditTime: 2024-03-21 10:04:57
-->
<template lang="pug">
#channelMerchant
  HeadOperation
    el-input(:prefix-icon='Search', v-model="searchForm.name", placeholder='通过校区名称查询', clearable, @keydown.enter='getTableData("messageBox")')
    el-input(:prefix-icon='Search', v-model="searchForm.code", placeholder='通过校区代码查询', clearable, @keydown.enter='getTableData("messageBox")')
    el-button(:icon='Search', type='primary', @click='getTableData("messageBox")') 查询
    el-button(:icon='Refresh', @click='toReset') 重置
    template(#right)
      el-button(:loading="synchLoading" :icon="Refresh" type='primary', @click="onSynch" :disabled="!state.funcButton.campus_syn") 数据同步
  el-table(:data="table.tableData" v-loading="table.tableLoading" row-key='index')
    el-table-column(label='校区代码', prop="code" )
    el-table-column(label='校区名称', prop="name")
    //- el-table-column(label='租户字段', prop="tenantId")
    //- el-table-column(label='操作' width="80")
    //- 	template(#default="scope")
    //- 		el-button(type="primary" link @click="view(scope.row)") 查看
  .flex-center
    el-pagination(@size-change='pagination.handleSizeChange', @current-change='pagination.handleCurrentChange', :current-page='pagination.current', :page-size='pagination.size', layout="total, sizes, prev, pager, next, jumper", :total='pagination.total', background)

</template>

<script lang="ts" setup>
import { computed, ref, reactive, onMounted, nextTick } from 'vue'
import HeadOperation from '@/components/headOperation.vue'
import { Refresh, Plus, Search } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Campus } from '@/service/manage'
import { key } from '@/store'
import { useStore } from 'vuex'
import { addSyncItem } from '@/assets/scripts/addSyncItem'

const store = useStore(key)
const { state } = store

const table = reactive({
  tableLoading: false,
  tableData: [],
})
const searchForm: any = ref({})
const synchLoading = ref(false)

// 分页相关
const pagination = reactive({
  total: 0,
  current: 1,
  size: 10,
  handleSizeChange: (_size: any) => {
    pagination.size = _size
    getTableData()
  },
  handleCurrentChange: (_current: any) => {
    pagination.current = _current
    getTableData()
  },
})

// 重置
const toReset = () => {
  searchForm.value = {}
  getTableData()
}

// 获取数据
const getTableData = async (msgBox?: string) => {
  table.tableLoading = true
  let params: any = {
    size: pagination.size,
    current: pagination.current,
  }
  for (const key in searchForm.value) {
    const element = searchForm.value[key]
    params[key] = element
  }
  // console.log(params, searchForm.value)
  const {
    data: res,
    msg,
    code,
  }: any = await Campus.getBaseCampusPage(params, msgBox)
  table.tableLoading = false
  if (code === 200) {
    table.tableData = res.records || []
    pagination.total = res.total
  } else {
    ElMessage({
      showClose: true,
      message: msg,
      type: 'warning',
    })
  }
}

//数据同步
const onSynch = () => {
  ElMessageBox.confirm('确定进行校区数据同步', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(async () => {
      let params: any = {
        size: pagination.size,
        current: pagination.current,
        ...searchForm.value,
      }
      const {
        data: mesid,
        code,
        msg,
      }: any = await Campus.getBaseCampusRefres(params, 'messageBox')
      if (code === 200) {
        addSyncItem({
          method: 'post',
          url: '/berserker-ykt-sync/progress/getProgress',
          params: {
            mesid,
          },
          name: '校区同步',
        })
        // ElMessage.success('同步成功')
        // getTableData()
      } else {
        ElMessage.error(msg)
      }
    })
    .catch(() => {
      return
    })
}

onMounted(() => {
  getTableData()
})
</script>
