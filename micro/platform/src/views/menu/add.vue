<template lang="pug">
div
  el-tabs(type='card')
    el-tab-pane(label='可选择菜单')
      HeadOperation
        el-input(:prefix-icon="Search", v-model='form.name', placeholder='通过菜单名称筛选', clearable, style="margin-right:12px;",  @keydown.enter='inquire')
        el-button(:icon="Search", type='primary', @click='inquire') 查询
        el-button(:icon="Refresh", @click='reset') 重置
        template(#right)
          el-button(:icon="Close", @click='clearSelection', :disabled='multipleSelection.length === 0') 取消选择
          el-button(:icon="Check", @click='addSelection', type='primary', :disabled='multipleSelection.length === 0 || !state.funcButton.menuAddInstall') 添加已选
            span(v-if='multipleSelection.length > 0') &nbsp;({{ multipleSelection.length }})
        template(#fold)
          //- filter-content
          el-form(label-width='100px' inline)
            el-row
              el-col(:xs="12", :sm="12", :md="8", :lg="6", :xl="4")
                el-form-item(label='用户类型：')
                  el-select.display-block(v-model='form.userType', placeholder='请选择', clearable)
                    el-option(v-for='(item, i) in userTypeList', :key='i', :label='item.name', :value='item.label')
              el-col(:xs="12", :sm="12", :md="8", :lg="6", :xl="4")
                el-form-item(label='终端类型：')
                  el-select.display-block(v-model='form.platType', placeholder='请选择', clearable)
                    el-option(v-for='(item, i) in platTypeLevel', :key='i', :label='item.name', :value='item.code')
              //- el-col(:xs="12", :sm="12", :md="8", :lg="6", :xl="4")
                el-button(:icon="Search", type='primary', @click='inquire') 查询
                el-button(:icon="Refresh", @click='reset') 重置
      .table-content
        //- | {{tableData}}
        //- TableTitle(title="菜单商店")
        el-table(ref='multipleTableRef', :data='tableData', v-loading='loading',  @selection-change='handleSelectionChange' :row-key="getRowKeys")
          el-table-column(type='selection', width='50', align='center', :selectable='selectable' :reserve-selection="true")
            //- el-image(v-if="scope.row.extraConfig.iconList" style="height: 30px" :src="scope.row.extraConfig.iconList[0].url")
          el-table-column(label='安装状态', width='80', prop='installFlag', align='center')
            template(#default='scope')
              el-tag(:type='scope.row.installFlag === 0 ? "" : "info"') {{ scope.row.installFlag ? "已安装" : "未安装" }}
          el-table-column(prop="icon" label="图标" align="center" width="80")
            template(#default="scope")
              div(v-if="scope.row.myIconList")
                template(v-for="(item, i) in scope.row.myIconList" :key="i")
                  div(v-if="scope.row.myModelLength > 1 || scope.row.myIconList.length > 1")
                    el-popover(placement='bottom-start', trigger='hover', :width='scope.row.myModelLength * 70')
                      div(v-for="(subitem, j) in scope.row.myIconList" :key="j")
                        //- //- p {{ subitem.length }} {{ type }}
                        p.table-icon-title(v-if="Object.keys(scope.row.myIconList).length > 1")
                          //- {{subitem}}
                          | {{ subitem.list[0].platType.name }}
                        .table-icon-list
                          .img-item.text-center(v-for="(image, m) in subitem.list" :key="m")
                            el-image(:src='image.src + "?v=" + scope.row.createTime', style='width: 36px; height: 36px')
                              template(#error='')
                                el-image(:src='defaultAppIcon', style='width: 34px; height: 34px')
                            p.font-size-12.text-gray-7(v-if="image.platType.parentCode === 'mobile'") {{ image.model.name }}
                      template(#reference)
                        div.refer-image()
                          el-image(v-if="i==0" :src='item.list[0].src + "?v=" + scope.row.createTime', style='width: 36px; height: 36px')
                            template(#error='')
                              el-image(:src='defaultAppIcon', style='width: 36px; height: 34px')
                          span.icon-arrowDown(v-if="i==0")
                            ArrowDown
                  div(v-else)
                    el-image.icon(:src="item.list[0].src + '?v=' + scope.row.createTime ")
              //- div(v-if="scope.row.myIconList")
                template(v-for="(value, key, i) in scope.row.myIconList" :key="i")
                  //- p {{value}} --- {{key}}
                  div(v-if="scope.row.myModelLength > 1 || Object.keys(scope.row.myIconList).length > 1")
                    //- p {{value.length}}
                    el-popover(placement='bottom-start', trigger='hover', :width='scope.row.myModelLength * 70')
                      div(v-for="(subitem, type , j) in scope.row.myIconList" :key="j")
                        p.table-icon-title(v-if="Object.keys(scope.row.myIconList).length > 1") {{subitem[0].platType.name}}
                        .table-icon-list
                          .img-item.text-center(v-for="(image, m) in subitem" :key="m")
                            el-image(:src='image.src', style='width: 36px; height: 36px')
                              template(#error='')
                                el-image(:src='defaultAppIcon', style='width: 34px; height: 34px')
                            p.font-size-12.text-gray-7(v-if="image.platType.code === 'mobile'") {{ image.model.name }}
                      template(#reference)
                        div.refer-image()
                          el-image(v-if="i==0" :src='value[0].src', style='width: 36px; height: 36px')
                            template(#error='')
                              el-image(:src='defaultAppIcon', style='width: 36px; height: 34px')
                          span.icon-arrowDown(v-if="i==0")
                            ArrowDown
                  div(v-else)
                    el-image.icon(:src="value[0].src")
          el-table-column(prop='name', label='菜单名称')
          el-table-column(prop='nameEn', label='英文名称')
          el-table-column(prop='code', label='菜单代码')
          el-table-column(prop='userType', label='用户类型', width='80')
            template(#default='scope')
              div(v-if="scope.row.userType")
                span(v-if="scope.row.userType === 'common'")
                  span.dot-list(v-for="(item, i) in userTypeList") {{ item.name }}
                    //- span(v-if="i + 1 < userTypeList.length") &nbsp;/&nbsp;
                span.dot-list(v-else) {{userTypeList.find(item => item.label === scope.row.userType)?.name}}
              //- |{{scope.row.userType}} {{userTypeList}}
              //- span(v-if='scope.row.userType') {{ userTypeList.find((item) => item.label === scope.row.userType).name }}
          el-table-column(prop='platType', label='终端类型')
            template(#default='scope')
              span.dot-list(v-for="(item, i) in scope.row.platType.split(',')" :key="i") {{ platTypeLevel.find(subItem  => subItem.code === item)?.name }}
              //- div(v-if='scope.row.platType')
                span(v-for='(ele, i) in scope.row.platTypeArr', :key='i')
                  el-tag.margin-right-x {{ platTypeList.find((e) => e.code === ele).name }}
                  //- span(v-if='i < scope.row.platTypeArr.length - 1') &nbsp;/&nbsp;
          el-table-column(label='操作', width='80')
            template(#default='scope')
              el-button(link type="primary" @click='checkMenu(scope.row)') 查看
        el-pagination.flex-box.flex-center(background @size-change='handleSizeChange', @current-change='handleCurrentChange', :current-page='currentPage', :page-sizes='[10, 20, 30, 40]', :page-size='pageSize', layout='total, sizes, prev, pager, next, jumper', :total='total')
      //- .margin-top-2x.text-right
        el-button(:icon="Close", @click='clearSelection', :disabled='multipleSelection.length === 0') 取消选择
        el-button(:icon="Check", @click='addSelection', type='primary', :disabled='multipleSelection.length === 0 || !state.funcButton.menuAddInstall') 添加已选
          span(v-if='multipleSelection.length > 0') &nbsp;({{ multipleSelection.length }})
    el-tab-pane(label='自定义菜单')
      CustomForm(ref="customFormRef" @addMenu="customFormAddMenu")
    el-drawer(v-model='dialogFormVisible', :width='600', :title='currentMenu.name')
      MenuDetails(v-if="dialogFormVisible" :data="{currentMenu, isCloud: 1}")
    el-dialog(v-model="isProgress" title="添加中" width="30%" align-center)
      el-progress(:percentage="percentage" :indeterminate="true")
      p.text-center {{progressText}}
</template>

<script lang="ts" setup>
import { ref, getCurrentInstance, reactive, onActivated } from 'vue'

import type { ElTable } from 'element-plus'
import { getFileFromOnlineImg } from '@/assets/scripts/file'
import { Cloud } from '@/service/cloud'
import { Menu } from '@/service/platform/index'
import { objDelete } from '@/assets/scripts/utils'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { key } from '@/store'
import SubDialog from '@/components/subDialog.vue'
import CustomForm from './components/customForm.vue'
import MenuDetails from './components/details.vue'
// import FilterContent from '@/components/filterContent/index.vue'
import inputUrl from '@/components/form/inputUrl.vue'
// import TableTitle from '@/components/tableTitle.vue'
import { ArrowDown, Search, Refresh, Check, Close } from '@element-plus/icons-vue'
// const { appContext }: any = getCurrentInstance()
import HeadOperation from '@/components/headOperation.vue'
import { ElMessage, ElMessageBox } from "element-plus"
const defaultAppIcon = new URL('../../assets/images/example.svg', import.meta.url).href
const router = useRouter()
const { state } = useStore(key)
const { moduleTypeList, userTypeList, platTypeList, platTypeLevel, installStatusList, iconModeList } = state
let form: any = ref({
  // 筛选表单
  name: null,
  userType: null,
  platType: null
})
const inquire = () => {
  currentPage.value = 1
  getCloudMenuList(1, 'messagebox')
}
const reset = () => {
  for (const key in form.value) {
    form.value[key] = null
  }
  getCloudMenuList(1)
}
const isProgress: any = ref(false)
const progressText: any = ref('')
const percentage: any = ref(0)

const multipleTableRef = ref<InstanceType<typeof ElTable>>()
const multipleSelection = ref([])
const addSelection = async () => {
  // // appContext.config.globalProperties.$message.success('添加成功')
  // console.log('multipleSelection.value', multipleSelection.value)

  isProgress.value = true
  percentage.value = 0
  const timer = setInterval(() => {
    // console.log(1)
    percentage.value += 8
    if (percentage.value >= 99) {
      percentage.value = 99
    }
    // console.log(percentage.value)
  }, 200)
  progressText.value = '正在添加...'
  const formData = new FormData()
  for (let i = 0; i < multipleSelection.value.length; i++) {
    const element: any = multipleSelection.value[i]
    //
    const obj: any = {
      name: element.name,
      nameEn: element.name,
      indexCode: element.code,
      platType: element.platType,
      type: element.userType,
      flagIsCloud: 1
      // extraConfig: null
    }
    if (element.extraConfig && element.extraConfig.url) {
      // const extraConfig = JSON.parse(JSON.stringify(element.extraConfig))
      // const str =
      // obj.extraConfig = JSON.stringify(objDelete(extraConfig, 'iconUrlMap'))
      obj.extraConfig = JSON.stringify(element.extraConfig.url)
    }
    let iconByFile: any = []
    // let index = 0 // 图标索引
    if (element.extraConfig && element.extraConfig.iconUrlMap) {
      for (const key in element.extraConfig.iconUrlMap) {
        // console.log(key)
        const platType = platTypeList.find((item: any) => item.code === key)
        if (platType.children && platType.children.length > 0) {
          // obj.children.forEach((subEle: any) => {
          for (let index = 0; index < platType.children.length; index++) {
            const subEle = platType.children[index];
            for (const m in element.extraConfig.iconUrlMap[key]) {
              if (element.extraConfig.iconUrlMap[key][m]) {
                let fileObj = {
                  file: null,
                  type: ''
                }
                fileObj.type = subEle.code + '#' + m
                fileObj.file = await getFileFromOnlineImg(element.extraConfig.iconUrlMap[key][m], element.code + '.png')
                iconByFile.push(fileObj)
              }
            }
          }
          // console.log('subEle', subEle)
          // })
        } else {
          for (const m in element.extraConfig.iconUrlMap[key]) {
            if (element.extraConfig.iconUrlMap[key][m]) {
              let fileObj = {
                file: null,
                type: ''
              }
              fileObj.type = key + '#' + m
              fileObj.file = await getFileFromOnlineImg(element.extraConfig.iconUrlMap[key][m], element.code + '.png')
              iconByFile.push(fileObj)
            }
          }
        }
        // const obj = platTypeList.findIndex((item: any) => item.code === key)
        // console.log(element.extraConfig.iconUrlMap[key])
        // if (obj.children && obj.children.length) {
        //   obj.children.forEach((subEle: any)  => {
        //     console.log('subEle', subEle)
        //   })
        // } else {

        // }
      }
    }
    obj.iconByFile = iconByFile
    console.log('---- iconByFile', obj.iconByFile, iconByFile.length)
    Object.keys(obj).forEach((key) => {
      if (key === 'iconByFile') {
        obj['iconByFile'].forEach((element: any, n: number) => {
          console.log('nn', n)
          formData.append(`zAppIndex[${i}].iconByFile[${n}].type`, element.type)
          formData.append(`zAppIndex[${i}].iconByFile[${n}].file`, element.file)
        })
      } else {
        if (obj[key]) formData.append(`zAppIndex[${i}].${key}`, obj[key])
      }
    })
  }
  addMenu(formData, () => {
    isProgress.value = false
    clearInterval(timer)
  })
}
// 自定义表单
const customFormRef: any = ref(null)
const customFormAddMenu = (formData: any) => {
  isProgress.value = true
  percentage.value = 0
  const timer = setInterval(() => {
    // console.log(1)
    percentage.value += 8
    if (percentage.value >= 99) {
      percentage.value = 99
    }
    // console.log(percentage.value)
  }, 200)
  progressText.value = '正在添加...'
  addMenu(formData, () => {
    percentage.value = 99
    isProgress.value = false
    clearInterval(timer)
    console.log(customFormRef.value)
    setTimeout(() => {
      customFormRef.value.resetForm()
    }, 1000)
  })
  // alert(8888)
}
const addMenu = async (formData: any, callback: any) => {
  const { data, code, msg }: any = await Menu.addZindex(formData, 'messageBox')
  callback()
  if (code === 200) {
    // data = [{ code: 'dongtai' }, { code: 'dating' }]
    let successData: any = multipleSelection.value
    if (!data || data.length === 0) {
      // alert(data)
      // successData = multipleSelection.value
      ElMessage.success('添加成功')
      // appContext.config.globalProperties.$message.success('菜单添加成功')
    } else {
      data.forEach((element: any) => {
        const m = multipleSelection.value.findIndex((item: any) => item.code === data.indexCode)
        successData.splice(m, 1)
      })
      console.log('添加失败数据', data)
    }
    // console.log('successData', successData)
    successData.forEach((element: any) => {
      const index = tableData.value.findIndex((item: any) => item.code === element.code)
      if (index > -1) {
        // 改安装状态
        tableData.value[index].installFlag = 1
      }
    })
    clearSelection()
  } else {
    // ElMessage.error(msg)
    // appContext.config.globalProperties.$message.error(msg)
  }
}
const clearSelection = () => {
  // 清除勾选
  multipleTableRef.value!.clearSelection()
}
const handleSelectionChange = (val: any) => {
  // 监听表单选项
  multipleSelection.value = val
}
const getRowKeys = (row: any) => {
  return row.code // 返回唯一标记值，这里的 id 是唯一的
}
let tableData: any = ref([])
let menuList: any = ref([])
let loading = ref(false)
let total = ref(0) // 总数
let currentPage = ref(1) // 页码
const pageSize = ref(10) // 页数
// 查询菜单列表
const getMenuList = async () => {
  const { data: res, code, msg }: any = await Menu.getZindexList()
  if (code === 200) {
    menuList.value = res
    // console.log('getModuleList=', res)
  } else {
    console.log(msg)
  }
}
//  支持终端类型
let platTypeArr: any = []
platTypeList.forEach((element: any) => {
  platTypeArr.push(element.code)
})
// 查询云端菜单列表
const getCloudMenuList = async (type?: number, feedbackType?: string) => {
  const params: any = {
    page: currentPage.value - 1,
    size: pageSize.value,
    // platType: platTypeArr.join(',')
  }
  if (type === 1) {
    //查询
    for (const key in form.value) {
      if (form.value[key]) {
        if (key === 'platType') {
          const obj = platTypeLevel.find((item: any) => item.code === form.value[key])
          // console.log(obj)
          console.log('----', obj.parentCode)
          if (obj.parentCode) {
            // form.value[key] = obj.parentCode
            // params[key] = obj.parentCode
            params[key] = obj.parentCode
          } else {
            params[key] = obj.code
          }
        } else {
          params[key] = form.value[key]
        }
      }
    }
  }
  console.log('params', params)
  loading.value = true
  // console.log('888', await Cloud.getModuleListPage(params))
  const { data: res, status, message }: any = await Cloud.getMenuListPage(params, feedbackType)
  loading.value = false
  if (status === 200) {
    console.log(res, status, message)
    res.data.forEach((element: any) => {
      // 终端类型转为小类
      const children = platTypeList.find((item: any) => item.code === element.platType)?.children || []
      if (children.length > 0) {
        console.log(element.platType, children)
        const arr: any = []
        children.forEach((subEle: any) => {
          arr.push(subEle.code)
        })
        element.platType = arr.join(',')
      }
      const index = menuList.value.findIndex((item: any) => item.indexCode === element.code)
      // console.log(index)
      if (index > -1) {
        // 判断本地是否安装
        element.installFlag = 1
      } else {
        element.installFlag = 0
      }
      // 终端类型
      if (element.platType) {
        const arr = element.platType.split(',')
        arr.forEach((type: any, k: number) => {
          const index = platTypeList.findIndex((item: any) => item.code === type)
          // console.log(type + ':index', index)
          if (index === -1) {
            arr.splice(k, 1)
          }
        })
        element.platTypeArr = arr
      }
      const order: any = []
      platTypeLevel.forEach((sub: any) => {
        order.push(sub.code)
      })
      // 菜单图标
      let myIconList: any = []
      let modelLength: any = 0
      if (element.extraConfig.iconUrlMap) {

        console.log('iconUrlMap', element.extraConfig.iconUrlMap)
        for (const key in element.extraConfig.iconUrlMap) {
          //     // console.log('----', key, element.extraConfig.iconUrlMap[key])
          const platType = platTypeList.find((item: any) => item.code === key)
          console.log(element.code, platType)
          const modelList = iconModeList[key]

          if (platType) {
            if (platType.children.length > 0) {
              platType.children.forEach((subEle: any) => {
                const obj = {
                  platType: '',
                  list: []
                }
                // console.log('---',  subEle.code)
                const srcList: any = []
                modelList.forEach((subModeEle: any) => {
                  if (element.extraConfig.iconUrlMap[platType.code][subModeEle.code]) {
                    const newObj = {
                      name: subEle.code + '#' + subModeEle.code,
                      src: element.extraConfig.iconUrlMap[platType.code][subModeEle.code],
                      platType: subEle,
                      model: subModeEle
                    }
                    srcList.push(newObj)
                    // console.log(newObj)
                  }
                })
                obj.platType = subEle.code
                obj.list = srcList
                if (srcList.length > 0) {
                  myIconList.push(obj)
                }

              })
            } else {
              const obj = {
                platType: '',
                list: []
              }
              const srcList: any = []
              modelList.forEach((subModeEle: any) => {
                // console
                if (element.extraConfig.iconUrlMap[platType.code][subModeEle.code]) {
                  const newObj = {
                    name: platType.code + '#' + subModeEle.code,
                    src: element.extraConfig.iconUrlMap[platType.code][subModeEle.code],
                    platType: platType,
                    model: subModeEle
                  }
                  srcList.push(newObj)
                }
              })
              obj.platType = platType.code
              obj.list = srcList
              console.log('else', obj)
              if (srcList.length > 0) {
                myIconList.push(obj)
              }
            }
            console.log('myIconList', myIconList)
            // myIconList = myIconList.sort((a: any, b: any) => {
            //   return order.indexOf(a.platType) - order.indexOf(b.platType)
            // })
            // myIconList.forEach((iconEle: any) => {
            //   // iconEle
            //   iconEle.list = iconEle.list.sort((a: any, b: any) => a.model.index - b.model.index)
            //   if (iconEle.list.length > modelLength) modelLength = iconEle.list.length
            // })
            // modelList.forEach((subEle: any) => {
            //   if (element.extraConfig.iconUrlMap[key][subEle.code]) {
            //     const newObj = {
            //       name: key + '#' + subEle.code,
            //       src: element.extraConfig.iconUrlMap[key][subEle.code],
            //       platType,
            //       model: subEle
            //     }
            //     console.log(newObj)
            //   }
            // })
          }
        }
      }
      if (myIconList.length > 0) {
        element.myIconList = myIconList
        element.myModelLength = modelLength
      }
    })
    tableData.value = res.data

    total.value = res.totalSize
    console.log('tableData.value', tableData.value)
  } else {
    console.log(message)
  }
}

const handleSizeChange = (val: number) => {
  console.log(`每页 ${val} 条`)
  pageSize.value = val
  getCloudMenuList(1)
}
const handleCurrentChange = (val: number) => {
  console.log(`当前页: ${val}`)
  currentPage.value = val
  getCloudMenuList(1)
}
const selectable = (row: any, index: number) => {
  // 是否可选
  // console.log(row, index)
  if (row.installFlag) {
    // row.disabled = true
    return false
  } else {
    return true
  }
}
const currentMenu: any = ref({})
const dialogFormVisible = ref(false)
const checkMenu = (item: any) => {
  currentMenu.value = item
  dialogFormVisible.value = true
  // router.push({
  //   name: 'menuDetails',
  //   query: {
  //     source: '1' // 云端
  //   }
  // })
  // sessionStorage.setItem('currentMenu', JSON.stringify(item))
}

const saveLoading = ref(false)
let selectedPlat: any = ref([]) // 已选终端类型
const imgFile: any = ref({})
const changePlatType = (val: any) => {
  selectedPlat.value = platTypeList.filter((item: any) => {
    return val.indexOf(item.code) !== -1
  })
  console.log('changePlatType', selectedPlat.value)
}
onActivated(() => {
  getMenuList().then(() => {
    getCloudMenuList()
  })

})
</script>
<style lang="scss" scoped>
.content-createCustomMenu {
  .el-image__inner {
    vertical-align: middle;
  }

  .url-type-item {
    background-color: #f4f5f5;
    padding: 15px;
    margin-bottom: 10px;
    border-radius: 6px;
  }

  .url-group-item {
    overflow: hidden;

    .input-item-right {
      float: left;
      width: calc(100% - 90px);
    }

    .input-item-left {
      float: left;
      width: 80px;
      margin-right: 10px;
      text-align: right;
    }

    .margin-top-xs {
      margin-top: 3px;
    }
  }

  .app-link-content {
    border-radius: 5px;
    overflow: hidden;

    .head {
      padding: 5px 12px;
      background: #f4f5f5;
      line-height: 28px;
    }

    .body {
      padding: 5px 12px;
    }
  }
}

.table-icon-title {
  margin-top: 6px;
  margin-bottom: 4px;
}

.table-icon-list .img-item {
  display: inline-block;
  line-height: 20px;
  margin-right: 20px;

  &:last-child {
    margin-right: 0;
  }
}

.table-content {
  .icon {
    width: 36px;
    height: auto;
    vertical-align: middle;
  }

  .icon-arrowDown {

    // cursor: pointer;
    svg {
      width: 14px;
      height: 14px;
      color: #999;
    }
  }
}
</style>