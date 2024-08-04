<template lang="pug">
.content-selectedBaseApp.content-bg
  .title-page 应用商店
    //- span.text-gray-6.font-size-12 （共{{ listObj.total }}个应用，已安装了 {{ hadInstallNum }}个应用，当前已选择
    //-   span.text-primary.font-size-20(style='padding: 0 3px') {{ appList.length }}
    //-   | 个应用）
    span.text-gray-6.font-size-12 （当前已选择
      span.text-primary.font-size-20(style='padding: 0 3px') {{ appTotalNumber }}
      | 个应用）
    //- span.float-right.filter-exist.text-link 只看未安装
    //- el-form-item.float-right(label='')
    //-   el-select(v-model='formUserType', placeholder='请选择终端类型')
    //-     el-option(label='用户', value='user', v-for='(item, key) in platTypeLevel', :key='key')
    el-input.float-right.filter-input(v-model='filterForm.appName', placeholder='请输入应用名称', prefix-icon='el-icon-search', @input='changeFilter')
  .apps-content(:gutter='15', v-loading='listObj.loading')
    //- el-button.btn-page.btn-pre(@click="listObj.clickPre" :disabled="listObj.current <= 1" size="mini")
    //-   ArrowLeft
    //- el-button.btn-page.btn-next(@click="listObj.clickNext" :disabled="listObj.current >= listObj.pages" size="mini")
    //-   ArrowRight
    ManageBox(v-model='checkBoxValue', :height="120" type="checkbox", @change='changeCheckBox', @changeItem='changeCheckBoxItem' :data="listObj.data" :iconError="defaultAppIcon" disabledText="已安装" :props="{label: 'appCode', disabled: 'exist', title: 'appName', icon: 'masterImg', subTitle: 'appDesc' }" )
      template(#title="{ row }")
        span {{ row.appName }}
        el-button(v-if='appList.find((o) => { return o.appCode === row.appCode; })' type="primary" @click.stop='editInfo(row, i)' :icon="Edit" link style="height: 1rem")
      template(#content="{ row }")
        el-button(type='primary', plain, @click='goDetail(row)' size="small") 查看详情
        el-button-group.margin-left-2x(v-if='row.extraConfig.isAllowClone && appList.find((o) => { return o.appCode === row.appCode; })')
          el-button.btn-mini-s(type='primary', plain, :icon='Minus', @click='cloneApp("reduce", row)')
          el-button.btn-mini-s.btn-middle-disabled(type='primary', plain) 添加({{ row.cloneData ? row.cloneData.length : 1 }})
          el-button.btn-mini-s(type='primary', plain, :icon='Plus', @click='cloneApp("plus", row)')
    //- el-checkbox-group(v-model='checkBoxValue', @change='changeCheckBox')
      el-row(:gutter='15')
        el-col.margin-bottom-2x(:xs='12', :sm='12', :md='8', :lg='8', :xl='6', v-for='(item, i) in listObj.data', :key='i')
          .item-app.checkbox-custom-style.margin-bottom-3x(:class='{ "item-app-exist": item.exist }')
            el-checkbox.checkbox-custom-style(:label='item.appCode', border='', :disabled='item.exist', @change='changeCheckBoxItem(item, i)')
              span.exist-sign(v-if='item.exist') 已安装
              .inner
                el-image.img(:src='item.masterImg')
                  template(#error)
                    el-image(:src='defaultAppIcon')
                .info
                  h3
                    span {{ item.appName }}
                    el-button.edit-icon-btn(v-if='appList.find((o) => { return o.appCode === item.appCode; })', @click='editInfo(item, i)')
                      Edit.text-primary(style='width: 1rem; height: 1rem; transform: translate(2px, 0)')
                  .btn-groups.margin-top-x
                    el-button.btn-mini-s(type='primary', plain, @click='goDetail(item)') 查看详情
                    el-button-group.margin-left-2x(v-if='item.extraConfig.isAllowClone && appList.find((o) => { return o.appCode === item.appCode; })')
                      el-button.btn-mini-s(type='primary', plain, :icon='Minus', @click='cloneApp("reduce", item)')
                      el-button.btn-mini-s.btn-middle-disabled(type='primary', plain) 添加({{ item.cloneData ? item.cloneData.length : 1 }})
                      el-button.btn-mini-s(type='primary', plain, :icon='Plus', @click='cloneApp("plus", item)')
  .flex-box.flex-right
    //- el-pagination(@size-change="handleSizeChange", @current-change="handleCurrentChange", :current-page="table.currentPage", :page-sizes="[10, 20, 30, 40]", :page-size="table.pageSize", layout="total, sizes, prev, pager, next, jumper", :total="table.total")
    el-pagination.text-right(background, layout='total,prev, pager, next', :page-size='listObj.pageSize', :total='listObj.total', :current-page='listObj.current', @current-change='changePage')
  el-dialog(v-model='showDetail', :width='600', title='应用详情')
    AppDetail(:info='currentApp', v-if='showDetail')
  el-dialog(v-model='editDialog', :width='800', title='自定义基本信息')
    template(v-if='!currentApp.cloneData || currentApp.cloneData.length === 0')
      CreateCustomApp.editAppform(v-if='editDialog', :info='currentApp', :editClouldApp='true', ref='editAppInfoRef')
    template(v-else)
      el-collapse(v-model='activeNames', @change='handleChange', accordion)
        el-collapse-item(:name='index', v-for='(itemC, index) in currentApp.cloneData')
          template(#title='')
            span.font-size-18 {{ itemC.appName }}
            el-icon.header-icon
              InfoFilled
          CreateCustomApp.editAppform(v-if='editDialog', :info='itemC', :editClouldApp='true', :hideModal='true', :id='"editAppInfoRef" + index', :ref='"editAppInfoRef" + index')
    template(#footer='')
      span.dialog-footer
        el-button(@click='editDialog = false') 取 消
        el-button(type='primary', @click='editConfirmLimit') 确 定
</template>
<script setup lang="ts">
import { ref, reactive, getCurrentInstance, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { key } from '@/store'
import { App, Theme } from '@/service/platform'
import { Cloud } from '@/service/cloud'
import { ElMessage } from 'element-plus'
import { ArrowLeft, ArrowRight, Search, Calendar, Edit, Plus, Minus, InfoFilled } from '@element-plus/icons-vue'
// import { EditPen } from '@element-plus/icons-vue'
import AppDetail from '../appDetail.vue'
import CreateCustomApp from '../appAdd/createCustomApp.vue'
import { forEach } from 'lodash'
import ManageBox from '@/components/manageBox/index.vue'


// import { ICacheOptions, cache } from '@/hooks/cacheCloudData'
const defaultAppIcon = new URL('../../../../assets/images/example.svg', import.meta.url).href
const instance: any = getCurrentInstance()
const router = useRouter()
const store = useStore(key)
const { state } = store
const editAppInfoRef = ref()
store.dispatch('AddApplistAction', [])
const filterForm = reactive({
  appName: ''
})
const appTotalNumber = ref(0)
// 克隆
const activeNames = ref(0)
const cloneApp = (type: string, data: any) => {
  const index = appList.value.findIndex((o: any) => {
    return o.appCode === data.appCode
  })
  const appTemp = JSON.parse(JSON.stringify(appList.value[index]))
  delete appTemp.cloneData
  if (type === 'plus') {
    appTemp.appName = appTemp.appName + '副本' + appList.value[index].cloneData.length
    appTemp.appCode = appTemp.appCode + '&' + appList.value[index].cloneData.length
    appList.value[index].cloneData.push(appTemp)
  } else if (type === 'reduce') {
    if (appList.value[index].cloneData.length > 1) {
      appList.value[index].cloneData.pop()
    } else if (appList.value[index].cloneData.length === 1) {
      appList.value.splice(index, 1)
    }
  }
  getAppNum()
}
// 编辑基本信息
const editDialog = ref(false)
const editInfo = (appObj: any, i: number) => {
  curerntAppIndex = i
  currentApp.value = appObj
  editDialog.value = true
}
const editConfirmLimit = async () => {
  console.log('currentApp.value-----', currentApp.value)
  if (!currentApp.value.cloneData) {
    // let node: any = instance.refs['editAppInfoRef' + 0]
    editAppInfoRef.value.submit().then((res: any) => {
      if (res.valid) {
        listObj.data[curerntAppIndex].appName = res.data.appName
        listObj.data[curerntAppIndex].platType = res.data.platType
        listObj.data[curerntAppIndex].extraConfig.img = res.data.img
        const masterImgObj = listObj.data[curerntAppIndex].extraConfig.img.find((o: any) => {
          return o.src !== ''
        })
        listObj.data[curerntAppIndex].masterImg = masterImgObj ? masterImgObj.src : ''
        editDialog.value = false
        console.log('res  ---edit', currentApp)
      } else {
        {
          ElMessage({

            message: '请填写完整',
            type: 'error'
          })
        }
      }
    })
  } else {
    let num = 0
    const cloneData = JSON.parse(JSON.stringify(currentApp.value.cloneData))
    for (var i = 0; i < currentApp.value.cloneData.length; i++) {
      let node: any = instance.refs['editAppInfoRef' + i]
      const res = await node[0].submit()
      // const data = node[0].submitForm();
      let data: any = ''
      if (res.valid) {
        num++
        cloneData[i].appName = res.data.appName
        cloneData[i].platType = res.data.platType
        cloneData[i].extraConfig.img = res.data.img
        if (num === cloneData.length) {
          currentApp.value.cloneData = cloneData
          editDialog.value = false
        }
      } else {
        ElMessage({

          message: '请填写完整',
          type: 'error'
        })
      }
    }
    // currentApp.value.cloneData.forEach((o: any, index: number) => {})
    // for(var i = 0; i<currentApp.value.cloneData.length; i++){
    // }
  }
}
const appList = computed({
  get: () => state.addApplist,
  set: (val) => {
    state.addApplist = val
  }
})
const checkBoxValue: any = ref([])
appList.value.forEach((element: any) => {
  checkBoxValue.value.push(element.appCode)
})
const showDetail = ref(false)
const currentApp = ref()
const goDetail = (item: any) => {
  showDetail.value = true
  currentApp.value = item
  // router.push({
  //   name: 'appDetail'
  // })
}
const checkAppArr: any = ref([])
const changeCheckBox = (val: any) => {
  checkAppArr.value = val
}
let curerntAppIndex: any = null
const platTypeLevel = store.state.platTypeLevel
const changeCheckBoxItem = (appObj: any, i: number) => {
  curerntAppIndex = i
  const index = checkAppArr.value.indexOf(appObj.appCode)
  if (index !== -1) {
    if (appObj.extraConfig.isAllowClone) {
      const appTemp = JSON.parse(JSON.stringify(appObj))
      delete appTemp.cloneData
      appObj.cloneData = appObj.cloneData || [appTemp]
      appObj.cloneData = appObj.cloneData.map((o: any) => {
        return transAppData(o)
      })
    }
    appObj = transAppData(appObj)
    appList.value.push(appObj)
  } else {
    const j = appList.value.findIndex((o: any) => {
      return o.appCode === appObj.appCode
    })
    appList.value.splice(j, 1)
  }
  currentApp.value = appObj
  store.dispatch('AddApplistAction', appList.value)
  getAppNum()
}
const transAppData = (appObj: any) => {
  // url
  let urlArr: any = []
  appObj.extraConfig.url.forEach((item: any) => {
    if (item.children && item.children.length > 0) {
      urlArr = urlArr.concat(item.children)
    } else {
      urlArr.push(item)
    }
  })
  appObj.extraConfig.url = urlArr
  // icon
  let img: any = []
  appObj.extraConfig.img.forEach((item: any) => {
    if (item.code === 'mobile') {
      const arr = platTypeLevel
        .filter((o: any) => {
          return o.parentCode === 'mobile'
        })
        .map((o: any) => {
          const obj = {
            code: o.code,
            name: o.name,
            file: '',
            src: item.src
          }
          return obj
        })

      img = img.concat(arr)
    } else {
      img.push(item)
    }
  })
  appObj.extraConfig.img = img
  // platType
  const mobileStr = platTypeLevel
    .filter((o: any) => {
      return o.parentCode === 'mobile'
    })
    .map((o: any) => {
      return o.code
    })
    .join(',')
  appObj.platType = appObj.platType.replace('mobile', mobileStr)
  return appObj
}
const listObj: any = reactive({
  current: 1,
  total: 0,
  pageSize: 12,
  pages: 0,
  data: [],
  loading: true,
  clickPre: () => {
    listObj.current--
    getTableData()
  },
  clickNext: () => {
    listObj.current++
    getTableData()
  },
  handleChange: (value: number) => {
    if (value > listObj.pages) {
      listObj.current = listObj.pages
    } else if (value < 1) {
      listObj.current = 1
    } else if (!value) {
      listObj.current = 0
    }
    getTableData()
  },
  handleInput: (value: string | number) => {
    if (!value) {
      listObj.current = 0
    } else {
      listObj.current = Number(value)
    }
  }
})
const getAppNum = () => {
  appTotalNumber.value = 0
  appList.value.forEach((o: any) => {
    if (o.extraConfig.isAllowClone) {
      appTotalNumber.value = appTotalNumber.value + o.cloneData.length
    } else {
      appTotalNumber.value++
    }
  })
}
const changeFilter = () => {
  listObj.current = 1
  getTableData()
}
let resAppCodeAll: any = []
App.getAppAll({ flagIsSelfApp: '0' }).then((r: any) => {
  resAppCodeAll = r
  getTableData()
})
const changePage = (val: number) => {
  listObj.current = val
  getTableData()
}
const hadInstallNum = ref(0)
const platTypeArray = store.state.platTypeList
const plstStr = platTypeArray.map((o: any) => {
  return o.code
})
async function getTableData() {
  listObj.loading = true
  let params = {
    page: listObj.current - 1,
    size: listObj.pageSize,
    status: 1
    // platType: plstStr.join(',')
  }
  params = { ...params, ...filterForm }
  const res = await Cloud.getAppList(params)
  const exists = resAppCodeAll.data
  hadInstallNum.value = exists.length
  if (res && res.data && res.data.data) {
    const data = res.data.data
    data.forEach((item: any, index: number) => {
      item.extraConfig.img = item.extraConfig.img || []
      item.exist = exists.indexOf(item.appCode) > -1 && !item.extraConfig.isAllowClone
      // item.exist = false
      const masterImgObj = item.extraConfig.img.find((o: any) => {
        return o.src !== ''
      })
      item.masterImg = masterImgObj ? masterImgObj.src : ''
      // 已修改数据更新
      const hasEdit = appList.value.find((o: any) => {
        return o.appCode === item.appCode
      })
      if (hasEdit) {
        data[index] = hasEdit
        console.log('hasEdit-----------', hasEdit, item.appName, appList.value)
      }
    })
    console.log('listObj--------', listObj)
    listObj.loading = false
    listObj.data = data
    listObj.total = res.data.totalSize
    listObj.pages = Math.ceil(res.data.totalSize / listObj.pageSize)
  } else {
    listObj.loading = false
  }
}
</script>
<style lang="scss" scoped>
// .content-selectedBaseApp .item-app .checkbox-custom-style {
//   padding: 0 !important;
// }
.content-selectedBaseApp {
  width: 85%;
  margin: 0 auto;
  padding-top: 50px;

  .title-page {}

  .apps-content {
    position: relative;
    overflow: hidden;
    min-height: 400px;

    .btn-middle-disabled {
      pointer-events: none;
      cursor: default;
    }

    .el-button-group .el-button--primary:not(:first-child):not(:last-child) {
      border-right-color: #d6e8fe;
      border-left-color: #d6e8fe;
    }

    .el-button-group .el-button--primary:last-child {
      border-left-color: #d6e8fe;
    }

    label {
      width: 100%;
      height: 85px;
      padding: 0;
    }

    .item-app {
      margin-bottom: 10px;
      min-width: 250px;
      padding: 0 !important;
    }

    .el-checkbox__label {
      padding: 0;
    }

    li {
      margin: 0 10px;
    }

    .inner {
      height: 85px;
      border-radius: 4px;
      padding: 15px 5px;
      box-sizing: border-box;
      position: relative;
      padding-left: 55px;

      .img {
        width: 45px;
        height: 45px;
        position: absolute;
        left: 5px;
        top: 50%;
        transform: translateY(-50%);
      }

      .info {
        padding-top: 5px;

        h3 {
          font-size: 16px;
          font-weight: 500;
          position: relative;
          // span {
          //   display: inline-block;
          //   width: calc(100% - 20px);
          //   overflow: hidden;
          //   white-space: nowrap;
          //   text-overflow: ellipsis;
          // }
        }
      }
    }
  }

  .radio-status-text {
    line-height: 20px;
    padding-right: 3px;
    color: #bbb;
  }

  .btn-mini-s {
    padding: 0px 4px;
    height: 24px;
    line-height: 23px;
    min-height: 24px;
    font-size: 0.7rem;
  }

  .el-pagination {
    margin-top: 0;
    text-align: right;
  }

  .el-input__inner {
    border-radius: 12px;
  }

  .checkbox-custom-style .is-disabled .el-checkbox__inner {
    display: none;
  }

  .item-app-exist {
    .exist-sign {
      position: absolute;
      right: 0px;
      top: 0px;
      background-color: #67c23a;
      z-index: 99;
      font-size: 12px;
      color: #fff;
      padding: 2px 8px;
      border-radius: 0 0 0 14px;
    }

    .inner {
      background-color: var(--el-fill-color-light);
    }
  }

  .filter-input {
    width: 250px;
    padding-bottom: 10px;
    transform: translateY(-5px);
  }

  .filter-exist {
    font-size: 14px;
    line-height: 30px;
    margin-left: 20px;
  }

  .edit-icon-btn {
    padding: 0;
    height: 1.2rem;
    line-height: 1rem;
    min-height: 1.2rem;
    background: transparent;
    border: 0;
  }
}

.size-large-Dialog {
  min-width: 800px;
  min-height: 500px;
}

.setInfo-Dialog {
  .content-createCustomApp {
    width: 100%;
  }

  .content-createCustomApp .upload-form-item {
    width: auto;
  }

  .el-collapse-item__header {
    background-color: var(--el-fill-color-light);
    padding: 0 20px;
  }

  .el-collapse {
    border-radius: 6px;
    overflow: hidden;
  }

  // .el-collapse-item:first-child .el-collapse-item__header {
  //   border-radius: 6px 6px 0 0;
  // }
  .el-collapse-item__content {
    padding-bottom: 0;
  }

  .el-collapse-item:last-child .el-collapse-item__wrap {
    border-radius: 0 0 6px 6px;
    border-bottom: 1px solid rgb(238, 238, 238);
    margin-bottom: 1px;
  }

  .el-collapse-item__wrap {
    padding-top: 20px;
    border-left: 1px solid rgb(238, 238, 238);
    border-right: 1px solid rgb(238, 238, 238);
  }

  .el-collapse {
    border-top: 0;
    border-bottom: 0;
  }
}

.editAppform {
  .form {
    padding-top: 0;
  }
}

.flex-right {
  justify-content: right;
}
</style>