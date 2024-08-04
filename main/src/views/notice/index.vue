<template lang='pug'>
div
  el-table(:data='table.tableData', v-loading='table.tableLoading' @row-click='toDeatil')
    el-table-column(prop='id', label='编号'  width="80")
    el-table-column(prop='title', label='标题')
      template(#default='scope')
        el-link(type="primary" :underline="false" ) {{scope.row.title}}
    el-table-column(prop='publishDatetime' label='发布时间' width="200")
    el-table-column(prop='publishDepartmentCode' label='发布人' width="100")
    //- el-table-column(label='详情' width="110")
    //-   template(#default='scope')
    //-     el-button(type='primary', link, @click='edit(scope.$index, scope.row)') 详情
  .flex-center
    el-pagination(@size-change='handleSizeChange', @current-change='handleCurrentChange', :current-page='table.currentPage', :page-sizes='[10, 30, 50, 100]', :page-size='table.pageSize', layout="total, sizes, prev, pager, next, jumper", background, :total='table.total')
</template>
<script setup lang='ts'>
import { defineComponent, computed, onMounted, reactive, toRefs, ref, nextTick, onUnmounted } from 'vue'
// import { getUser } from '@/service/manage'
import { Search, Plus, Refresh } from '@element-plus/icons-vue'
import { Statistics } from '@/service/manage'
import { useRouter } from 'vue-router'
const router = useRouter()
const table = reactive({
  currentPage: 1,
  total: 0,
  pageSize: 10,
  tableData: [],
  tableLoading: true
})

onMounted(async () => {
  await getTableData()
})
async function getTableData(msgBox?: string) {
  table.tableLoading = true
  const params = {
    current: table.currentPage,
    size: table.pageSize,
    type: 1,
    isSearchOther: 1
  }
  const { data }: any = await Statistics.getBasenoticeNewPage(params, msgBox)
  console.log('-------res', data?.records)
  if (data?.records) {
    table.tableLoading = false
    const datas = data.records
    table.tableData = datas
    table.total = datas.total
  } else {
    table.tableLoading = false
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
const toDeatil = (e: any) => {
  router.push({
    name: 'noticeDetail',
    params: {
      id: e?.id
    }
  })

}
</script>