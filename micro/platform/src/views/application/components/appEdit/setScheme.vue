<template lang="pug">
.text-right.margin-bottom-2x
  el-button(type='success', :icon='Tickets', @click='toShowLocalScheme') 方案管理
  el-button(type='primary', :icon='Plus', @click='showClouldSchemeDialog = true') 添加方案
el-table(:data='platTypeListScheme', style='width: 100%; margin-bottom: 20px', row-key='code', border='', default-expand-all)
  el-table-column(prop='name', label='终端类型', width='250')
  el-table-column(prop='clould', label='当前方案', width='250')
    template(#default='scope')
      el-tag(v-if='scope.row.scheme', closable, @close='deletBindScheme(scope.row)') {{ scope.row.scheme.scheduleName }}
        //- el-icon(:size="16", style="transform: translateY(4px); margin-left: 6px")
        //-   Download.text-primary
  el-table-column(prop='local', label='操作')
    template(#default='scope')
      el-button(type='primary', link, v-if='!scope.row.children || scope.row.children.length === 0', @click='showBindScheme(scope.row)') 绑定
el-dialog.dialog-body-padding-s(v-model='showSchemeDialog', :title='"已安装方案列表-" + info.appName', :width='720', append-to-body)
  .text-right.margin-bottom-x
    el-button(type='primary', :icon='Plus', @click='(showSchemeDialog = false), (showClouldSchemeDialog = true)') 添加方案
  el-table(:data='localThemeList', border='', style='width: 100%; margin-bottom: 20px')
    el-table-column(prop='scheduleName', label='方案名称', width='180')
      template(#default='scope')
        span {{ scope.row.scheduleName }}
    el-table-column(prop='scheduleServiceType', label='终端类型', width='180')
      template(#default='scope')
        span {{ scope.row.scheduleServiceType.split(",").map((o) => { return platTypeLevel.find((pl) => { return pl.code === o })?.name }).join("，") }}
    el-table-column(prop='scheduleUserType', label='用户类型', width='100')
      template(#default='scope')
        span {{ userType(scope.row.scheduleUserType) }}
    el-table-column(prop='tool', label='操作')
      template(#default='scope')
        el-button(type='primary', link, @click='toEditLayout(scope.row)') 布局设置
        el-button(type='primary', link, @click='toEditInfo(scope.row)') 编辑
        el-button(type='danger', link, @click='deleteScheme(scope.row)') 删除
el-dialog.dialog-body-padding-s(v-model='showClouldSchemeDialog', :title='`云端商店-` + info.appName', :width='720', append-to-body)
  el-table(:data='clouldThemeList', border='', @selection-change='handleSelectionChange', style='width: 100%; margin-bottom: 20px', row-key='id', default-expand-all)
    el-table-column(type='status', label='安装状态', width='100')
      template(#default='scope')
        el-tag(v-if='scope.row.isExist', type='info') 已安装
        el-tag(v-else, type='primary') 未安装
    el-table-column(prop='name', label='方案名称', width='180')
    el-table-column(prop='platType', label='终端类型', width='180')
      template(#default='scope')
        span {{ scope.row.platType.split(",").map((o) => { return platTypeLevelCloud.find((pl) => { return pl.code === o })?.name }).join("，") }}
    el-table-column(prop='userType', label='用户类型', width='100')
      template(#default='scope')
        span {{ userType(scope.row.userType) }}
    //- el-table-column(prop="description", label="描述", width="180")
    el-table-column(prop='tool', label='操作')
      template(#default='scope')
        //- el-button(type='success', link, @click='checkScheme(scope.row)') 预览
        el-button(type='primary', link, v-if='!scope.row.isExist', @click='addScheme(scope.row)') 安装
  //- .flex-box.flex-center
  //-   el-pagination(size="mini", small, @size-change="pagination.handleSizeChange", @current-change="pagination.handleCurrentChange", :current-page="pagination.currentPage", :page-sizes="[10, 20, 30, 40]", :page-size="pagination.pageSize", layout="total, sizes, prev, pager, next, jumper", :total="pagination.total")
el-dialog.dialog-style(v-model='showBindSchemeDialog', title='绑定方案', :width='700', append-to-body)
  el-form(label-width='100px', inline, v-if='bindSchemeList.length > 0')
    el-form-item(label='方案列表：')
      el-select(v-model='bindSchemeCode', placeholder='请选择')
        el-option(v-for='item in bindSchemeList', :key='item.id', :label='item.scheduleName', :value='item.id')
  el-empty(v-else, description='暂无支持该终端类型的方案，快去安装一个吧', :image-size='100')
    el-button(type='primary', :icon='Plus', @click='(showBindSchemeDialog = false), (showClouldSchemeDialog = true)') 添加方案
  template(#footer)
    .text-center(v-if='bindSchemeList.length > 0')
      el-button(type='primary', @click='toBindScheme', :disabled='!bindSchemeCode') 确定
el-dialog.dialog-style(v-model='showEditSchemeDialog', :title='`编辑${currentTheme.scheduleName}(${currentTheme.schemeCode})`', :width='700', append-to-body)
  el-form(label-width='100px')
    el-form-item.is-required(label='方案名称', prop='scheduleName')
      el-input(v-model='editForm.scheduleName')
    el-form-item(label='描述')
      el-input(v-model='editForm.scheduleDesc' type="textarea")
    el-form-item(label='终端类型')
      el-checkbox-group(v-model='scheduleServiceType')
        el-checkbox(:label='item.code' v-for="(item, i) in platTypeArr") {{ item.name }}
  template(#footer)
    .text-center()
      el-button(type='primary', @click='editSchemeSubmit',:disabled="!editForm.scheduleName") 确定
</template>
<script lang="ts" setup>
import { ref, computed, reactive } from 'vue'
import { useStore } from 'vuex'
import { key } from '@/store/index'
import { App, Group, Scheme } from '@/service/platform'
import { Cloud } from '@/service/cloud'
import { useRouter } from 'vue-router'
import TableTitle from '@/components/tableTitle.vue'
import { Delete, Edit, Download, Plus, Tickets } from '@element-plus/icons-vue'
import HandleScheme from '@/assets/scripts/installScheme'
import { userType } from '@/assets/scripts/state'
import { ElMessage, ElMessageBox } from 'element-plus'
const router = useRouter()
const store: any = useStore(key)
const { state } = store
const props = defineProps(['info'])
const info = ref(props.info)
const platTypeLevelCloud:any = store.state.platTypeLevelCloud
// 方案
const showSchemeDialog = ref(false)
const activeScheme = ref('clould')
// 查询云端方案
const clouldThemeList = ref([])
const showClouldSchemeDialog = ref(false)
const getClouldTheme = async () => {
  return new Promise((resolve: any, reject) => {
    Cloud.getAppSchedule({ bindCode: info.value.appCode, bindType: 'app' }).then((r: any) => {
      if (r.status === 200 && r.data && r.data.length > 0) {
        clouldThemeList.value = r.data.map((o: any) => {
          return o.scheduleVO
        })
        resolve()
      } else if (info.value.appCode.includes('-')) {
        const codeIndex = info.value.appCode.lastIndexOf("-")
        Cloud.getAppSchedule({ bindCode: info.value.appCode.slice(0, codeIndex), bindType: 'app' }).then((r: any) => {
          if (r.status === 200 && r.data && r.data.length > 0) {
            clouldThemeList.value = r.data.map((o: any) => {
              return o.scheduleVO
            })
            resolve()
          }
        })
      }
    })
  })
}
// 查看云端方案布局
const checkScheme = (item: any) => {
  let toSchemeEditViewUrl_readonly = `${state.configs.cloudUrl}/cloud-scheme?token=${state.token}&name=${item.name}&platType=${item.platType}&userType=${item.userType}&code=${item.code}&readonly=1`
  window.open(toSchemeEditViewUrl_readonly, '_blank')
}
const closeClouldScheme = () => {
  getLocalTheme()
}
const pagination = reactive({
  currentPage: 1,
  pageSize: 10,
  total: 0,
  handleSizeChange: (val: number) => {
    pagination.pageSize = val
    pagination.currentPage = 1
    // getTableData();
  },
  handleCurrentChange: (val: number) => {
    pagination.currentPage = val
    // getTableData();
  }
})
// 查询已安装方案
const localThemeList = ref([])
const toShowLocalScheme = () => {
  showSchemeDialog.value = true
  getLocalTheme()
}
const getLocalTheme = () => {
  return new Promise((resolve: any, reject) => {
    const params: any = {
      bindId: info.value.bh,
      flagScheduleType: 1
    }
    Scheme.getAppScheduleList(params).then((r) => {
      if (r.code === 200 && r.data) {
        localThemeList.value = r.data
        resolve(r)
      }
    })
  })
}
const isExistScheme = () => {
  clouldThemeList.value.forEach((item: any, index: number) => {
    const isExist = localThemeList.value.findIndex((o: any) => {
      return o.schemeCode === item.code
    })
    item.isExist = isExist !== -1
  })
}
// 布局设置
const toEditLayout = (item: any) => {
  showSchemeDialog.value = false
  let index = ''
  if (process.env.NODE_ENV === 'development') index = state.devHost.layoutEditor + '/layout-editor'
  else index = state.configs.base + '/layout-editor'
  if (item) {
    let url = ''
    url = `${index}/?token=${state.token}&type=scheme&id=${item.id}&scheduleName=${item.scheduleName}&scheduleServiceType=${item.scheduleServiceType}&scheduleUserType=${item.scheduleUserType}&schemeCode=${item.schemeCode}&schemeType=${Number(item.flagScheduleType || 0) ? 'app' : 'common'}`
    router.push({ name: 'layoutEditor', query: { url: encodeURI(url) } })
  } else {
    ElMessage.error('缺少参数')
  }
}
// 添加方案
const addScheme = async (data: any) => {
  await new HandleScheme().install(
    [data],
    {
      tableData: clouldThemeList.value,
      statusChange: {
        success: {
          isExist: true
        },
        fail: {
          isExist: false
        }
      }
    },
    { bindId: info.value.bh }
  )
  // await getLocalTheme();
  // isExistScheme();
}
// 删除方案
const deleteScheme = async (data: any) => {
  ElMessageBox.confirm('确定删除方案"' + data.scheduleName + '"吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(() => {
      deleteAppSchedule(data.id)
    })
    .catch(() => {
      // TODO
    })
}
const deleteAppSchedule = async (id: number) => {
  const { data: res, code, msg }: any = await Scheme.deleteAppSchedule({ id: id }, 'messageBox')
  if (code === 200) {
    ElMessage({

      message: '删除成功',
      type: 'success'
    })
    await getLocalTheme()
    isExistScheme()
    getCurrentBind()
  } else {
  }
}
// 编辑方案
const showEditSchemeDialog = ref(false)
const currentTheme:any = ref({})
const editForm:any = ref({})
const platTypeArr = ref([])
const scheduleServiceType = ref([])
const toEditInfo = (data:any) => {
  showEditSchemeDialog.value = true
  currentTheme.value = data
  editForm.value.id = currentTheme.value.id
  editForm.value.scheduleName = currentTheme.value.scheduleName
  editForm.value.scheduleDesc = currentTheme.value.scheduleDesc
  scheduleServiceType.value = currentTheme.value.scheduleServiceType.split(',')
  const clouldThemePlatType:any = clouldThemeList.value.find((o:any) => {return o.code === currentTheme.value.schemeCode})
  platTypeArr.value = platTypeLevelCloud.filter((o:any) => {
    return clouldThemePlatType?.platType.includes(o.code)
  })
  console.log('currentTheme', platTypeLevelCloud, clouldThemePlatType)
}
const editSchemeSubmit = async() => {
  editForm.value.scheduleServiceType = scheduleServiceType.value.join(',')
  const { data: res, code, msg }: any = await Scheme.updateAppScheduleWithDetail(editForm.value)
  showEditSchemeDialog.value = false
  getLocalTheme()
}
// 绑定方案
const showBindSchemeDialog = ref(false)
const bindSchemeCode = ref('')
const bindSchemeList = ref([])
const platTypeLevellist:any = store.state.platTypeLevel
const platTypeListScheme = platTypeLevellist.filter((o:any) => {
  return info.value.platType.includes(o.code)
})
// 查询当前绑定关系
const getCurrentBind = async () => {
  const params: any = { bindId: info.value.bh, bindType: 'app' }
  const { code, data } = await Scheme.getAppBindScheme(params)
  if (code === 200 && data) {
    platTypeListScheme.forEach((item: any) => {
      item.scheme = getScheme(item.code)
    })
    console.log(999, 'platTypeListScheme', platTypeListScheme)
  }
  function getScheme(code: any) {
    const res = data.find((o: any) => {
      return o.platType === code
    })
    return res ? res.appSchedule : ''
  }
}
let currentSp = ''
// 应用绑定方案 -- dialog
const showBindScheme = async (item: any) => {
  currentSp = item.code
  showBindSchemeDialog.value = true
  bindSchemeCode.value = item.scheme ? item.scheme.id : ''
  const params: any = { bindId: info.value.bh, flagScheduleType: 1, scheduleServiceType: item.code }
  const { code, data } = await Scheme.getAppScheduleList(params)
  if (code === 200) {
    bindSchemeList.value = data
  }
}
const toBindScheme = async () => {
  const params = {
    platType: currentSp,
    bindId: info.value.bh,
    scheduleId: bindSchemeCode.value,
    status: 1,
    bindType: 'app'
  }
  const { code, data } = await Scheme.saveAppBindScheme(params, 'messageBox')
  if (code === 200) {
    showBindSchemeDialog.value = false
    await getLocalTheme()
    getCurrentBind()
  }
}
// 应用解绑方案
const deletBindScheme = async (data: any) => {
  ElMessageBox.confirm('确定解除当前绑定关系吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(() => {
      const params: any = {
        platType: data.code,
        bindId: info.value.bh,
        scheduleId: data.scheme.id,
        bindType: 'app'
      }
      Scheme.removeAppBindScheme(params, 'messageBox').then((r: any) => {
        if (r.code === 200) {
          getCurrentBind()
        }
      })
    })
    .catch(() => {
      // TODO
    })
}
// 方案初始加载
const initScheme = async () => {
  await getLocalTheme()
  await getClouldTheme()
  isExistScheme()
  getCurrentBind()
}
if (Number(info.value.supportSchedule) === 1) {
  initScheme()
}
// 方案
const platTypeLevel = store.state.platTypeLevel
// const infoP = info.value.platType.split(",");
// const toSetTheme = () => {
//   const pArr: any = [];
//   platTypeLevel.forEach((o: any) => {
//     if (infoP.includes(o.code) || infoP.includes(o.parentCode)) pArr.push(o.code);
//   });
//   let index = state.devHost.scheme;
// };
</script>
<style lang="scss">
.content-editApp .limit-form .el-form-item {
  width: 100%;
}
.content-createCustomApp .form-item-inline-2 {
  width: 46%;
}
.content-editApp .form {
  padding-top: 0px;
}
.disabled-form-label .el-form-item__label {
  color: #999;
}
.content-editApp .checkbox-custom-style .info {
  width: 100%;
  height: 100px;
  box-sizing: border-box;
  background-repeat: no-repeat;
  background-size: contain;
  background-position: center center;
}
.content-editApp .checkbox-custom-style .title {
  text-align: center;
  font-size: 12px;
  color: #666;
  line-height: 12px;
  margin-bottom: 5px;
}
.content-editApp .el-checkbox__label {
  // padding-bottom: 8px;
}
.dialog-body-padding-s {
  .el-dialog__body {
    padding-top: 5px;
  }
}
.dialog-style .el-empty {
  padding: 0;
}
.el-table--fit {
  margin-bottom: 0;
}
</style>
