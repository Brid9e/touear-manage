<template lang="pug">
.content-purviewSetting.content-bg
  h3.font-size-16.title-line.margin-top-3x.margin-bottom-3x 设置位置
    span.font-size-14.font-size-14.text-warning.text-weight-normal （*非必填项，若不设置该项，应用将绑定所有应用类型组件。）
  .bg-content(:style='{ "max-height": mainHeight + "px" }')
    div(v-if='applist.length > 1')
      .form-item-right
        .scrollbar-flex-content
          .scrollbar-demo-item(v-for='(item, i) in componentList', :key='i')
            .title {{ item.name }}
              //- span.font-size-12 ({{ platTypeArray.find((o) => { return o.code === item.platType }).name }})
            .info.module-box(:style='{ color: "red", "background-image": "url(" + item.icon + ")" }')
            p.text-right.tool
              span.float-left.text-gray-7(v-if='item.appValue.length > 0') 已分配
                span.text-success.text-weight-bold.font-size-14 {{ item.appValue.length }}
                | 个
              span.text-link(@click='toOpenSetApp(item)') {{ item.appValue.length > 0 ? "查看" : "分配应用" }}
    div(v-else)
      el-checkbox-group(v-model='componentValue')
        .scrollbar-flex-content
          div(v-for='(item, i) in componentList', :key='i')
            .scrollbar-demo-item(v-if='isMatchingByPlatType(applist[0].platType, item.platType) && isMatchingByUserType(applist[0].appUserType, item.userType)')
              .title {{ item.name }}
                //- span.font-size-12 ({{ platTypeArray.find((o) => { return o.code === item.platType }).name }})
              el-checkbox.checkbox-custom-style(:label='item.bh', border='')
                .info(:style='{ color: "red", "background-image": "url(" + item.icon + ")" }')

  el-dialog(v-model='showDialogSetApp', :width='820', @closed='closedCompentDialog')
    template(#title='')
      div 分配应用
        span.font-size-14.text-warning.text-weight-normal
    .app-checkbox-content(style='width: 100%')
      .tip-check-all
        el-checkbox(v-model='checkAllApp', @change='handleCheckAllApp') {{ checkAllApp ? "取消全选" : "选择全部" }}
      //- el-scrollbar
        .scrollbar-flex-content
      el-checkbox-group(v-model='appValue', @change='changeApp')
        .scrollbar-demo-item(v-for='(item, i) in applist', :key='i')
          el-checkbox.checkbox-custom-style(:label='item.appCode', border='', :disabled='!isMatchingByPlatType(item.platType, currentComponent.platType) || !isMatchingByUserType(item.appUserType, currentComponent.userType)')
            el-image.img(:src='item.masterImg')
              template(#error)
                //- el-image(:src="require('@/assets/images/example.svg')")
                el-image(:src='defaultAppIcon')
            .title {{ item.appName }}
            .text-danger(v-if='!isMatchingByPlatType(item.platType, currentComponent.platType)') 终端类型不符
            .text-danger(v-if='!isMatchingByUserType(item.appUserType, currentComponent.userType)') 用户类型不符
    template(#footer='')
      span.dialog-footer
        el-button(@click='showDialogSetApp = false') 取 消
        el-button(type='primary', @click='confirmSetApp') 确 定
</template>
<script lang="ts" setup>
import { defineComponent, reactive, toRefs, ref, computed, watch, inject, getCurrentInstance, defineProps } from 'vue'
import { Cloud } from '@/service/cloud'
import { Role } from '@/service/manage'
// import formCreate from '@form-create/element-ui'
import { useStore } from 'vuex'
import { key } from '@/store'
import { App, Module, Group } from '@/service/platform'
import SelectedBaseApp from '../selectImg.vue'
import FormCreateByJson from '@/components/formCreateByJson/index.vue'
// import setLimit from '../setLimit.vue'
import type { ElForm } from 'element-plus'
import { getFileFromOnlineImg } from '@/assets/scripts/file'
// import { msgbox, IMsgBoxOptions } from '@/hooks/subMessageBox'
type FormInstance = InstanceType<typeof ElForm>
interface ILimit {
  type: string
  sno: []
  group: string | number
}
const defaultAppIcon = new URL('../../../../assets/images/example.svg', import.meta.url).href
const store = useStore(key)
const { state } = store
const props = defineProps(['typeValue'])
const typeValue = ref(props.typeValue)
const instance = getCurrentInstance()
// 高度计算
const winHeight = document.documentElement.clientHeight
const mainHeight = winHeight - 320
// 应用
const applist = computed(() => state.addApplist)
// 组件分配应用弹框
const currentComponentId = ref('')
const currentComponent: any = ref({})
const showDialogSetApp = ref(false)
const toOpenSetApp = (item: any) => {
  console.log('toOpenSetApp', item)
  currentComponentId.value = item.bh
  currentComponent.value = item
  appValue.value = item.appValue ? item.appValue : []
  // componentValue.value.push(item.comCode)
  // componentValue.value = [...new Set(componentValue.value)]
  showDialogSetApp.value = true
}
const confirmSetApp = () => {
  componentList.value.forEach((item: any) => {
    if ((item as any).bh === currentComponentId.value) {
      ;(item as any).appValue = JSON.parse(JSON.stringify(appValue.value))
    }
  })
  // if (appValue.value.length === 0) {
  //   const index: any = componentValue.value.indexOf(currentComponentCode.value)
  //   componentValue.value.splice(index, 1)
  // }
  showDialogSetApp.value = false
}
const closedCompentDialog = () => {
  // if (currentComponent.value.appValue.length === 0) {
  //   const index: any = componentValue.value.indexOf(currentComponentCode.value)
  //   componentValue.value.splice(index, 1)
  // }
}
// 应用的终端类型和组件类型是否匹配
const isMatchingByPlatType = (appPT: any, compPT: any) => {
  const appArr = new Set(appPT.split(','))
  const comArr = new Set(compPT.split(','))
  let res = new Set([...appArr].filter((x) => comArr.has(x)))
  return res.size > 0
}
// 应用的用户类型和组件用户类型是否匹配
const isMatchingByUserType = (appUT: any, compUT: any) => {
  let res: boolean = false
  if (appUT === 'common' || compUT === 'common' || appUT === compUT) {
    res = true
  }
  return res
}
// 组件
const showDialogComponent = ref(false)
let componentValue: any = ref([])
const checkAllComponent = ref(false)
let componentList = ref([])
// const platTypeArray = store.state.platTypeList
// 组件code转id
const comCodeListToID =  (componentList:any, codes:any) => {
  let res:any = []
  codes.forEach((o:any) => {
    const coms = componentList.filter((item:any) => {return item.comCode === o})
    res = res.concat(coms.map((item:any) => {return item.bh}))
  })
  console.log('res-----', res)
  res = [...new Set(res)]
  return res
}
const getComponent = async () => {
  const res = await Module.getZcomList({ comType: 1 })
  componentList.value = res.data
  if (applist.value.length === 1) {
    // componentValue.value = applist.value[0].comCodeList || []
     componentValue.value = comCodeListToID(componentList.value, applist.value[0].comCodeList || [])
  } else if (applist.value.length > 1) {
    res.data.forEach((item: any) => {
      item.appValue = []
      applist.value.forEach((app: any) => {
        if (app.comCodeList && app.comCodeList.indexOf(item.comCode) !== -1) {
          item.appValue.push(app.appCode)
        }
      })
    })
    // let arr: any = []
    // // applist.value.forEach((item: any) => {
    // //   arr = arr.concat(item.comCodeList)
    // // })
    // applist.value.forEach((item: any) => {
    //   arr = arr.concat(comCodeListToID(componentList.value, item.comCodeList || []))
    // })
    // arr = arr.concat(arr)
    // arr = [...new Set(arr)]
    // componentValue.value = arr
  }
}
getComponent()
const changeComponent = (item: any) => {
  if (applist.value.length > 1) {
    toOpenSetApp(item)
  }
}
// 选择应用
let appValue = ref([])
let checkAllApp = ref(false)
const handleCheckAllApp = () => {
  if (checkAllApp.value) {
    appValue.value = applist.value.map((item: any) => {
      if (item.platType.includes(currentComponent.value.platType)) {
        return item.appCode
      }
    })
  } else {
    appValue.value = []
  }
}
watch(
  () => appValue.value,
  (newData, oldData) => {
    if (newData.length === applist.value.length) {
      checkAllApp.value = true
    } else {
      checkAllApp.value = false
    }
  }
)
const submit = async (callback: any) => {
  console.log('submit--applist.value', applist.value)
  let resValid = true
  for (let i = 0; i < applist.value.length; i++) {
    console.log('applist.value', i)
    const element = applist.value[i]
    // component
    if (applist.value.length > 1) {
      let comId:any = []
      console.log('componentList.value', componentList.value)
      componentList.value.forEach((comItem:any) => {
        if ((comItem.appValue).includes(element.appCode)) {
          comId.push(comItem.bh)
        }
      })
      if(comId.length === 0) {
        const comlist = componentList.value.filter((c: any) => {
          return isMatchingByPlatType(element.platType, c.platType) && isMatchingByUserType(element.appUserType, c.userType)
        })
        element.component = comlist
          .map((item: any) => {
            return item.bh
          })
          .join(',')
      } else {
        element.component = comId
      }
      // let arr: any = []
      // componentValue.value.forEach((item: any) => {
      //   const itemApps = (
      //     componentList.value.find((o: any) => {
      //       return o.comCode === item
      //     }) as any
      //   ).appValue
      //   const index = itemApps.indexOf(element.appCode)
      //   if (index > -1) {
      //     arr.push(item)
      //     arr = [...new Set(arr)]
      //   }
      // })
      // if (arr.length === 0) {
      //   const comlist = componentList.value.filter((c: any) => {
      //     return isMatchingByPlatType(element.platType, c.platType) && isMatchingByUserType(element.appUserType, c.userType)
      //     // if (typeValue.value === 'base' && element.appUserType !== 'common') {
      //     //   return element.platType.indexOf(c.platType) !== -1 && element.appUserType === c.userType
      //     // } else {
      //     //   return element.platType.indexOf(c.platType) !== -1
      //     // }
      //   })
      //   element.component = comlist
      //     .map((item: any) => {
      //       return item.comCode
      //     })
      //     .join(',')
      // } else {
      //   element.component = arr.join(',')
      // }
    } else if (applist.value.length === 1) {
      if (componentValue.value.length === 0) {
        const comlist = componentList.value.filter((c: any) => {
          return isMatchingByPlatType(element.platType, c.platType) && isMatchingByUserType(element.appUserType, c.userType)
        })
        element.component = comlist
          .map((item: any) => {
            return item.bh
          })
          .join(',')
      } else {
        element.component = componentValue.value.join(',')
      }
      console.log(111111111111, 'element.component', element.component)
    }
  }
  console.log('applist.value', applist.value)
  store.dispatch('AddApplistAction', applist.value)
}
defineExpose({
  submit
})
</script>
<style lang="scss" scoped>
.module-box {
  padding: 0 15px 0 9px;
  border-radius: var(--el-border-radius-base);
  border: var(--el-border);
  box-sizing: border-box;
  height: 120px;
  background-repeat: no-repeat;
  background-size: contain;
  background-position: center center;
}
.content-purviewSetting {
  width: 80%;
  margin: 0 auto;

  .limit-bg-white .bg-white-form {
    background-color: #fff;
  }

  .limit-bg-white .filter-person,
  .limit-bg-white .el-table th,
  .limit-bg-white .el-table td {
    background-color: #fff;
  }

  .filter-person {
    background-color: #fff;
    padding: 30px 20px 0 20px;
    border-bottom: 2px dashed rgb(240, 240, 240);
  }

  .appConfig-tip {
    padding: 10px 15px;
    font-size: 14px;
    color: #666;
    background-color: rgba(64, 158, 255, 0.1);

    .num {
      font-size: 20px;
      padding: 0 3px;
    }
  }

  .install-config-form {
    min-height: 300px;
    background-color: var(--el-fill-color-light);
  }

  .tip {
    font-weight: 500;
  }

  .form {
    padding-top: 20px;
  }

  .el-form-item__content {
    width: calc(100% - 100px);
  }

  .bg-content {
    background-color: var(--el-fill-color-light);
    border-radius: 5px;
    padding: 10px;
    overflow-y: auto;
  }

  .el-collapse-item__header,
  .el-collapse-item__wrap {
    border-bottom: 0;
  }

  .el-collapse-item__content {
    padding-bottom: 0;
  }

  .el-collapse {
    border-bottom: 0;
    border-top: 0;
  }

  .el-collapse-item__arrow {
    border: 1px solid #ccc;
    display: inline-block;
    width: 26px;
    height: 26px;
    border-radius: 100%;
    text-align: center;
    line-height: 26px;
    background-color: var(--el-fill-color-light);
    box-sizing: border-box;
  }

  .el-collapse-item {
    padding-bottom: 15px;
    border-bottom: 2px dashed rgb(243, 243, 243);

    &:last-child {
      border-bottom: 0;
    }
  }

  .margin-bottom-0 {
    margin-bottom: 0;
  }

  .install-applist {
    margin-top: 10px;
    padding-bottom: 0px;

    img {
      width: 50px;
      height: 50px;
    }
  }

  .el-tabs__item {
    height: 100px;
  }

  .el-tabs__header {
    margin-bottom: 0;
  }

  .el-tabs__item.is-active {
    border-radius: 10px 10px 0 0;
    color: var(--main-primary);
    background-color: whitesmoke;

    img {
      transform: scale(1.3);
    }
  }

  .el-tabs--top .el-tabs__item.is-top:nth-child(2) {
    padding-left: 20px;
  }

  .el-tabs--top .el-tabs__item.is-top:last-child {
    padding-right: 20px;
  }

  .el-tabs__nav-wrap::after,
  .el-tabs__active-bar {
    display: none;
  }

  .title-line {
    position: relative;
    padding-left: 10px;

    &:before {
      content: '';
      display: block;
      width: 3px;
      height: 16px;
      border-radius: 2px;
      background-color: var(--main-primary);
      position: absolute;
      top: 50%;
      left: 0;
      transform: translateY(-50%);
    }
  }
}

.divider-limit {
  margin-top: 0;
}

.scrollbar-flex-content {
  display: flex;
  flex-wrap: wrap;
}

.scrollbar-demo-item {
  display: inline-block;
  flex-shrink: 0;
  width: 150px;
  height: 180px;
  margin: 10px;
  text-align: center;
  border-radius: 4px;

  // background: pink;
  .title {
    overflow: hidden; //溢出隐藏
    white-space: nowrap; //禁止换行
    text-overflow: ellipsis;
    text-align: center;
    font-size: 14px;
    color: #333;
    line-height: 12px;
    margin-bottom: 5px;
  }

  .tool {
    font-size: 12px;
    height: 20px;
    line-height: 20px;
    transform: translateY(2px);
  }

  .el-checkbox__label {
    padding: 0;

    .info {
      height: 120px;
      background-repeat: no-repeat;
      background-size: contain;
      background-position: center center;
    }
  }
}

.app-checkbox-content-form {
  margin-bottom: 0 !important;
}

.app-checkbox-content {
  position: relative;

  .tip-check-all {
    text-align: right;
    position: absolute;
    right: 0;
    top: -20px;
  }

  .scrollbar-demo-item {
    width: 77px;
    height: 84px;

    .status {
      margin-top: 0;
      line-height: 12px;
      font-size: 12px;
      transform: translateY(-5px);
    }

    .img {
      margin-top: 15px;
      margin-bottom: 8px;
      width: 40px;
      height: 40px;
      background-position: center center;
    }
  }
}

.padding-bottom {
  padding-bottom: 15px;
}

.limit-checkbox-content-form .scrollbar-demo-item {
  padding-bottom: 30px;

  .app-l-s {
    position: absolute;
    bottom: 0;
    width: 77px;
  }
}
.checkbox-custom-style.is-disabled {
  background-color: rgb(250, 250, 250);
  .title {
    color: #888;
  }
  .text-danger {
    position: absolute;
    bottom: -20px;
    left: 50%;
    font-size: 12px;
    transform: translateX(-50%);
  }
}
</style>
