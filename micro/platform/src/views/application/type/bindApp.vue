<template lang="pug">
div
  .margin-bottom-2x
    span.font-size-24 {{ typeName }}
    el-button.float-right(icon='el-icon-plus', type='primary', @click='add') 添加
  el-table(:data='table.tableData', style='width: 100%', border, v-loading='tableLoading', size='medium')
    el-table-column.text-center(prop='bh', label='Id', width='180', align='center')
    el-table-column.text-center(prop='status', label='状态', width='180', align='center')
    el-table-column(prop='iconWhole', label='图标')
      template(#default='scope')
        div(style='height: 36px')
          div(v-if='scope.row.iconArr.length > 1')
            el-popover(placement='bottom-start', trigger='hover', :width='scope.row.iconArr.length * 40')
              .table-icon-list
                .img-item.text-center(v-for='o in scope.row.iconArr', :key='o.code')
                  el-avatar(:src='o.src', :size='36')
                  p.font-size-12.text-gray-6 {{ o.name }}
              template(#reference)
                div
                  el-avatar(:src='scope.row.iconArr[0].src', :size='36')
                    template(#error)
                      el-avatar(:size='36', :src='defaultAppIcon')
                  el-svg-icon.icon-arrowDown
                    ArrowDown
          div(v-else)
            el-avatar(v-if='scope.row.iconArr.length > 0', :src='scope.row.iconArr[0].src', :size='36')
              template(#error)
                el-avatar(:size='36', :src='defaultAppIcon')
            el-avatar(v-else, :size='36', :src='defaultAppIcon')
    el-table-column(prop='appName', label='应用名称')
    el-table-column(prop='appCode', label='应用Code')
    el-table-column(prop='appCode', label='用户类型')
    el-table-column(label='操作')
      template(#default='scope')
        el-button(type='primary', plain, @click='editItem(scope.row)') 查看
        el-button(type='danger', plain, @click='deleteItem(scope.row.bh)') 移除
  el-pagination(@size-change='handleSizeChange', @current-change='handleCurrentChange', :current-page='currentPage', :page-sizes='[10, 20, 30, 40]', :page-size='pageSize', layout='total, sizes, prev, pager, next, jumper', :total='total')
  sub-dialog(v-model='dialogVisibleEdit', :width='500', :title='dialogType === "edit" ? "编辑类型" : "添加类型"', custom-class='bindPos-dialog')
    el-table(:data='table.tableData', style='width: 100%', border, v-loading='tableLoading', size='medium')
      el-table-column(type='selection', width='55')
      el-table-column.text-center(prop='bh', label='Id', width='180', align='center')
      el-table-column(prop='iconWhole', label='图标')
        template(#default='scope')
          div(style='height: 36px')
            div(v-if='scope.row.iconArr.length > 1')
              el-popover(placement='bottom-start', trigger='hover', :width='scope.row.iconArr.length * 40')
                .table-icon-list
                  .img-item.text-center(v-for='o in scope.row.iconArr', :key='o.code')
                    el-avatar(:src='o.src', :size='36')
                    p.font-size-12.text-gray-6 {{ o.name }}
                template(#reference)
                  div
                    el-avatar(:src='scope.row.iconArr[0].src', :size='36')
                      template(#error)
                        el-avatar(:size='36', :src='defaultAppIcon')
                    el-svg-icon.icon-arrowDown
                      ArrowDown
            div(v-else)
              el-avatar(v-if='scope.row.iconArr.length > 0', :src='scope.row.iconArr[0].src', :size='36')
                template(#error)
                  el-avatar(:size='36', :src='defaultAppIcon')
              el-avatar(v-else, :size='36', :src='defaultAppIcon')
      el-table-column(prop='appName', label='应用名称')
    el-pagination(@size-change='handleSizeChange', @current-change='handleCurrentChange', :current-page='currentPage', :page-sizes='[10, 20, 30, 40]', :page-size='pageSize', layout='total, sizes, prev, pager, next, jumper', :total='total')
    template(#footer='')
      span.dialog-footer
        el-button(@click='dialogVisibleEdit = false') 取消
        el-button(type='primary', @click='onSubmitEdit', :disabled='!formEdit.name || !formEdit.nameEn') 确定
</template>
<script lang="ts" setup>
import { defineComponent, reactive, toRefs, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { App } from '@/service/platform'
import { msgbox, IMsgBoxOptions } from '@/hooks/subMessageBox'
import SubDialog from '@/components/subDialog.vue'
import FilterContent from '@/components/filterContent/index.vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { key } from '@/store/index'
const defaultAppIcon = new URL('../../../assets/images/example.svg', import.meta.url).href
const store = useStore(key)
const router = useRouter()
const typeName = ref(router.currentRoute.value.query.typeName)
const table = reactive({
  currentPage: 1,
  total: 0,
  pageSize: 10,
  tableData: [],
  tableLoading: true
})
// page change size
const handleSizeChange = (val: number) => {
  table.pageSize = val
  table.currentPage = 1
  getTableData()
}
// page change current
const handleCurrentChange = (val: number) => {
  table.currentPage = val
  getTableData()
}
// 图标init
const platTypeArray = store.state.platTypeList
const getIconArr = (iconStr: string) => {
  const objIcon: any = iconStr ? JSON.parse(iconStr) : []
  const arr: any = []
  Object.keys(objIcon).forEach((key) => {
    const cP = platTypeArray.find((o: any) => {
      return o.code === key
    })
    if (cP) {
      const obj: any = {
        code: key,
        name: cP.name,
        src: objIcon[key]
      }
      arr.push(obj)
    }
  })
  return arr
}
console.log('router.currentRoute.value------', router.currentRoute.value)
// get list
async function getTableData() {
  table.tableLoading = true
  table.tableData = []
  const params: any = {
    current: table.currentPage,
    size: table.pageSize,
    appType: router.currentRoute.value.query.type
  }
  const res = await App.getZappList(params)
  if (res && res.data && res.data.records) {
    table.tableLoading = false
    const data = res.data.records
    data.forEach((element: any) => {
      element.iconArr = getIconArr(element.icon)
      if (element.iconArr.length > 0) {
        element.masterImg = element.iconArr[0].src
        element.extraConfig = {
          img: element.iconArr
        }
      }
    })
    table.tableData = data
    table.total = res.data.total
  } else {
    table.tableLoading = false
  }
}
getTableData()
</script>
<style lang="scss">
// .text {
//   color: v-bind(color);
// }
.child-dialog {
  margin: 0;
  margin-top: 0 !important;
}
.el-upload-list {
  display: none;
}
.upload-box {
  position: relative;
  .avatar-uploader {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    width: 100px;
    height: 100px;
    line-height: 100px;
    background-color: #fff;
    .avatar-uploader-icon {
      font-size: 28px;
      color: #8c939d;
      width: 100px;
      height: 100px;
      line-height: 100px;
      text-align: center;
    }
    .icon-upload {
      font-size: 50px;
    }
  }
  .upload-item {
    width: 102px;
    display: inline-block;
    background-color: #f4f5f5;
    border-radius: 6px;
    &:first-child {
      margin-right: 80px;
    }
    .handle-bar {
      background-color: #fff;
    }
  }
  .upload-img svg {
    width: 50px;
    height: 50px;
    color: #ccc;
    line-height: 100px;
  }
  .appImg {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
  .appImg {
    width: 80px;
    height: 80px;
  }
}
</style>
