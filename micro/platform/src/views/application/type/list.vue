<template lang="pug">
div
  headOperation
    el-input(v-model='form.name', :prefix-icon='Search', placeholder='请输入类型名称', clearable, style='margin-right: 12px', @keydown.enter='toFilter')
    el-select(v-model='form.status', placeholder='请选择状态')
      el-option(v-for='item in options', :key='item.value', :label='item.label', :value='item.value')
    el-button(:icon='Search', type='primary', @click='toFilter') 查询
    el-button(:icon='Refresh', @click='toReset') 重置
    template(#right)
      el-button(:icon='Plus', type='primary', @click='add', :disabled='!state.funcButton.appTypeListAdd') 添加
  .table-content
    //- TableTitle(title="应用类型列表")
    //-   el-button(type="primary", :icon="Plus", @click="add") 添加
    el-table(:data='table.tableData', v-loading='tableLoading', size='medium')
      el-table-column.text-center(prop='bh', label='编号', width='80', align='center')
      el-table-column(prop='name', label='名称')
      el-table-column(prop='nameEn', label='英文名称')
      el-table-column(prop='icon', label='图标')
        template(#default='scope')
          el-image(v-if='scope.row.icon', :src='scope.row.icon', style='width: 30px; height: 30px')
            template(#error='')
              .image-slot(style='transform: translateY(5px)')
                el-icon(:size='20', color='#999')
                  icon-picture
      el-table-column(prop='status', label='状态' width="100" align="center")
        template(#default='scope')
          el-switch(v-model='scope.row.status', :disabled='!state.funcButton.appTypeListEdit', :active-value='1', :inactive-value='0', :before-change='changeStatus.bind(this, scope.row)')
      //- el-table-column(label='应用', width='80')
        template(#default='scope')
      el-table-column(label='操作', width='150')
        template(#default='scope')
          el-button(type='primary', v-if='scope.row.bh !== -1', link, @click='toBindApp(scope.row)') 查看
          el-button(v-if='scope.row.bh !== -1', link, type='primary', :disabled='!state.funcButton.appTypeListEdit', @click='editItem(scope.row, scope.$index)') 编辑
          el-button(v-if='scope.row.bh !== -1', link, type='danger', @click='deleteItem(scope.row.bh, scope.$index)', :disabled='!state.funcButton.appTypeListRemove') 删除
    el-pagination.flex-box.flex-center(background, @size-change='handleSizeChange', @current-change='handleCurrentChange', :current-page='table.currentPage', :page-sizes='[10, 20, 30, 40]', :page-size='table.pageSize', layout='total, sizes, prev, pager, next, jumper', :total='table.total')

    el-drawer(v-model='dialogBindApp' :title='currentRow.name', size='40%')
      el-descriptions(title="基本信息" :column="2")
        el-descriptions-item(label="ID") {{ currentRow.bh }}
        el-descriptions-item(label="英文名称") {{ currentRow.nameEn }}
        el-descriptions-item(label="描述") {{ currentRow.remark }}
        el-descriptions-item(label="创建时间") {{ currentRow.createTime }}
      el-descriptions(title="绑定应用列表" style="margin-top:20px")
      el-row(:gutter='20', v-if='tableApp.tableData.length > 0')
        el-col.margin-bottom-2x(:span='4', v-for='(item, index) in tableApp.tableData', :key='index')
          .text-center.app-item
            el-image(v-if='item.masterImg', :src='item.masterImg', style='width: 45px; height: 45px')
              template(#error='')
                el-image(:src='defaultAppIcon', style='width: 45px; height: 45px')
            el-image(v-else, :src='defaultAppIcon', style='width: 45px; height: 45px')
            //- el-image(:src='item.masterImg', :size='60')
            //-   template(#error)
            //- el-image(src='/src/assets/images/example.svg', style='width: 34px; height: 34px')
            //- el-avatar(src='/src/assets/images/example.svg', :size='60', v-else)
            p {{ item.appName }}
      el-empty(description='未绑定应用', v-if='tableApp.tableData.length === 0 && !tableApp.tableLoading')



el-dialog(v-model='dialogVisibleEdit', :width='500', :title='dialogType === "edit" ? "编辑类型" : "添加类型"')
  el-form(label-width='120px')
    el-form-item.is-required(label='名称')
      el-input(v-model='formEdit.name')
    el-form-item.is-required(label='英文名称')
      el-input(v-model='formEdit.nameEn')
    el-form-item.upload-form-item(label='图标：', prop='img')
      .upload-box
        .upload-item
          .text-center
            el-upload.avatar-uploader(v-model='imgForm.file', action='#', :http-request='imgForm.httpRequest', accept='image/gif,image/jpeg,image/jpg,image/png,image/svg')
              //- i.icon-upload.el-icon-camera-solid.avatar-uploader-icon()
              el-icon(v-if='!imgForm.src', :size='50', color='#999', style='margin-top: 23px')
                CameraFilled
              el-image.appImg(v-else, :src='imgForm.src')
                template(#error='')
                  .image-slot
                    el-icon(:size='40', color='#999')
                      icon-picture
          p.text-right.text-primary(style='background: #fff; cursor: pointer', @click='removeImg') 删除
        .tip.font-size-12 （建议上传120*120的，1M以内的jpg、png图片）
  template(#footer='')
    span.dialog-footer
      el-button(@click='dialogVisibleEdit = false') 取消
      el-button(type='primary', @click='onSubmitEdit', :disabled='!formEdit.name || !formEdit.nameEn') 确定
//- el-dialog(v-model='dialogBindApp', :width='800', :title='currentRow.name')
  div(style='min-height: 290px')
    el-row(:gutter='20', v-if='tableApp.tableData.length > 0')
      el-col.margin-bottom-2x(:span='4', v-for='(item, index) in tableApp.tableData', :key='index')
        .text-center.app-item
          el-image(v-if='item.masterImg', :src='item.masterImg', style='width: 45px; height: 45px')
            template(#error='')
              el-image(:src='defaultAppIcon', style='width: 45px; height: 45px')
          el-image(v-else, :src='defaultAppIcon', style='width: 45px; height: 45px')
          //- el-image(:src='item.masterImg', :size='60')
          //-   template(#error)
          //- el-image(src='/src/assets/images/example.svg', style='width: 34px; height: 34px')
          //- el-avatar(src='/src/assets/images/example.svg', :size='60', v-else)
          p {{ item.appName }}
    el-empty(description='未绑定应用', v-if='tableApp.tableData.length === 0 && !tableApp.tableLoading')
  //- template(#footer="")
  //-   span.dialog-footer
  //-     el-button(@click="dialogBindApp = false") 关闭
</template>
<script lang="ts" setup>
import { defineComponent, reactive, toRefs, ref } from 'vue'
import { App } from '@/service/platform'
import { ElMessage, ElMessageBox } from 'element-plus'
import FilterContent from '@/components/filterContent/index.vue'
import TableTitle from '@/components/tableTitle.vue'
import { useRouter } from 'vue-router'
import { ArrowDown, Check, Close, Search, Refresh, Plus, CameraFilled, Picture as IconPicture } from '@element-plus/icons-vue'
import HeadOperation from '@/components/headOperation.vue'
import { useStore } from 'vuex'
import { key } from '@/store/index'
const defaultAppIcon = new URL('../../../assets/images/example.svg', import.meta.url).href
const store = useStore(key)
const { state } = store
console.log('state.funcButton')
const router = useRouter()
const form = reactive({
  status: '',
  name: ''
})
const imgForm = reactive({
  src: '',
  file: '',
  httpRequest: (data: any) => {
    imgForm.src = URL.createObjectURL(data.file)
    imgForm.file = data.file
    console.log('imgForm', imgForm)
  }
})
const removeImg = () => {
  imgForm.src = ''
  imgForm.file = ''
}
const table: any = reactive({
  currentPage: 1,
  total: 0,
  pageSize: 10,
  tableData: [],
  tableLoading: true
})
const options = [
  {
    value: 1,
    label: '正常'
  },
  {
    value: 0,
    label: '无效'
  }
]
const toFilter = () => {
  table.currentPage = 1
  getTableData('messageBox')
}
const toReset = () => {
  form.status = ''
}

const changeStatus = (row: any) => {
  return new Promise((resolve, reject) => {
    ElMessageBox.confirm(`确定将“${row.name}”设为${row.status ? '无效' : '有效'}类型？`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
      .then(() => {
        const formData: any = new FormData()
        formData.append('name', row.name)
        formData.append('nameEn', row.nameEn)
        formData.append('status', row.status == 1 ? 0 : 1)
        formData.append('id', row.bh)
        App.editZappT(formData, 'messageBox').then((res: any) => {
          if (res.code === 200) {
            ElMessage({
              message: '修改成功',
              type: 'success'
            })
            resolve(true)
          } else {
            resolve(false)
          }
        })
      })
      .catch(() => {})
  })
}
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
// get list
async function getTableData(feedbackType?: string) {
  table.tableLoading = true
  table.tableData = []
  let params: any = {
    current: table.currentPage,
    size: table.pageSize
  }
  params = { ...params, ...form }
  const res = await App.getZappTList(params, feedbackType)
  if (res && res.data && res.data.records) {
    table.tableLoading = false
    const data = res.data.records
    data.forEach((ele: any) => {
      ele.status = Number(ele.status)
    })
    table.tableData = data
    table.total = res.data.total
  } else {
    table.tableLoading = false
  }
}
getTableData()
// delete
const deleteItem = (bh: number, index: number) => {
  ElMessageBox.confirm('确定删除？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(() => {
      App.removeZappT(bh, 'messageBox').then(() => {
        table.currentPage === 1
        getTableData()
        // table.tableData.splice(index, 1)
      })
    })
    .catch(() => {})
}
const dialogType = ref('')
// edit
const editIndex = ref()
const formEdit: any = reactive({
  name: '',
  nameEn: '',
  status: 1,
  bh: ''
})
const dialogVisibleEdit = ref(false)
const editItem = (data: any, index: number) => {
  console.log('edit', data)
  dialogType.value = 'edit'
  dialogVisibleEdit.value = true
  formEdit.name = data.name
  formEdit.nameEn = data.nameEn
  formEdit.bh = data.bh
  editIndex.value = index
  imgForm.src = data.icon
}
const onSubmitEdit = async () => {
  if (dialogType.value === 'edit') {
    const formData = new FormData()
    formData.append('name', formEdit.name)
    formData.append('nameEn', formEdit.nameEn)
    formData.append('status', formEdit.status)
    formData.append('id', formEdit.bh)
    if (imgForm.file) {
      formData.append('iconByFile', imgForm.file)
    }
    const data = await App.editZappT(formData, 'messageBox')
    if (data.code === 200) {
      dialogVisibleEdit.value = false
      table.tableData[editIndex.value] = data.data
    }
  } else {
    formEdit.bh = ''
    const formData = new FormData()
    Object.keys(formEdit).forEach((key) => {
      if (formEdit[key]) {
        formData.append(key, formEdit[key])
      }
    })
    if (imgForm.file) {
      formData.append('iconByFile', imgForm.file)
    }
    // formData.append('iconByFile', imgForm.file)
    const data = await App.addZappTFormData(formData, 'messageBox')
    if (data.code === 200) {
      dialogVisibleEdit.value = false
      table.currentPage = 1
      getTableData()
    }
  }
}
const refTable = toRefs(table)
const clickbtn = () => {
  // ElMessage({
  //
  //   message: '开发中， 敬请期待',
  //   type: 'warning'
  // })
}
const add = () => {
  dialogType.value = 'add'
  formEdit.name = ''
  formEdit.nameEn = ''
  dialogVisibleEdit.value = true
  removeImg()
  // router.push('/appTpyeAdd')
}
const dialogBindApp = ref(false)
const bh = ref('')
const currentRow = ref({})
const toBindApp = (item: any) => {
  dialogBindApp.value = true
  currentRow.value = item
  bh.value = item.bh
  getTableDataApp()
  // router.push({
  //   name: 'appTpyeBindApp',
  //   query: {
  //     type: item.bh,
  //     typeName: item.name
  //   }
  // })
}
const tableApp = reactive({
  currentPage: 1,
  total: 0,
  pageSize: 10,
  tableData: [],
  tableLoading: true
})

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
async function getTableDataApp() {
  tableApp.tableLoading = true
  tableApp.tableData = []
  const params: any = {
    current: tableApp.currentPage,
    size: tableApp.pageSize,
    appType: bh.value
  }
  const res = await App.getZappList(params, 'messageBox')
  if (res && res.data && res.data.records) {
    tableApp.tableLoading = false
    const data = res.data.records
    data.forEach((element: any) => {
      console.log(element.appName, element.icon)
      // element.iconArr = getIconArr(element.icon)
      // if (element.iconArr.length > 0) {
      //   element.masterImg = element.iconArr[0].src
      //   element.extraConfig = {
      //     img: element.iconArr
      //   }
      // }
      if (element.icon) {
        element.iconArr = element.icon ? JSON.parse(element.icon) : []
        console.log(element.iconArr)
        element.masterImg = null
        Object.keys(element.iconArr).forEach((key) => {
          if (element.iconArr[key]) {
            element.masterImg = element.iconArr[key]
          }
        })
      }
    })
    tableApp.tableData = data
    tableApp.total = res.data.total
  } else {
    tableApp.tableLoading = false
  }
}
// page change size
const handleSizeChangeApp = (val: number) => {
  table.pageSize = val
  table.currentPage = 1
  getTableDataApp()
}
// page change current
const handleCurrentChangeApp = (val: number) => {
  tableApp.currentPage = val
  getTableDataApp()
}
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
.bindPos-dialog .app-item {
  .el-avatar {
    background-color: transparent;
  }
  background-color: rgb(242, 242, 242);
  border-radius: 4px;
  height: 100px;
  padding-top: 15px;
  p {
    margin-top: 10px;
  }
}
.upload-box .avatar-uploader .el-image .el-image__inner {
  vertical-align: super;
}
</style>
