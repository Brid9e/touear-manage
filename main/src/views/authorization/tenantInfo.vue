<template lang="pug">
div
  //- | {{tabsValue}}
  el-empty(v-if="!tenantId || (!loading && !tenantAuth)" description='暂无授权内容')
  template(v-else)
    .tab-box
      el-tabs(v-model='tabsValue' type='card')
        el-tab-pane(label='平台权限' name='authorization')
          div(v-loading="loading")
            div.marign-t-b.font-size-14
              TableTitle(title='日期权限')
              .bg
                span.title 有效期：
                span {{tenantAuth?.expireTime}}
            div.marign-t-b.font-size-14
              TableTitle(title='终端权限')
              //- p {{tenantAuth?.myPlatType}}
              .bg
                span.title 终端类型：
                template(v-if="tenantAuth?.myPlatType" v-for="(o, i) in tenantAuth.myPlatType", :key="i")
                  el-tag.marign-r-2(v-if="terminalTypeList.find(p => {return p.code === o})") {{terminalTypeList.find(p => {return p.code === o})?.name}}
            div.marign-t-b.font-size-14
              TableTitle(title='平台权限')
              .bg
                el-row
                  .flex()
                    span.title.title-table 平台类型：
                    el-table.table-s(:data="tenantAuth?.myPlatTypeOp" )
                      el-table-column(label='平台名称', prop="code" )
                        template(#default='scope')
                          span {{serviceTypeList.find(p => {return p.code === scope.row.code})?.name}}
                      el-table-column(label='有效期', prop="expirationTime")  
                      //- el-table-column(label='数量', prop="number")      
            div.marign-t-b.font-size-14(v-if="messageList.length > 0" )
              TableTitle(title='消息通道')
              .bg
                el-row
                  .flex()
                    span.title.title-table 消息通道：
                    el-table(v-if="messageList.length > 0"  :span-method='objectSpanMethod' :data='messageList'  border='' )
                      el-table-column(prop='typeName' label='类型' )
                      el-table-column(prop='messageName' label='名称')
        el-tab-pane(label='基础应用权限' name='baseApp') 
          .bg(v-loading="loading || appLoading" style="min-height: 200px")
            baseApp(v-if="baseAppList" ref="baseAppRef" :data="{currentTenant: tenantAuth, serviceTypeList, terminalTypeList, isEdit: 2, baseAppList}")
        el-tab-pane(label='增值服务应用权限' name='appAuth')
          .bg(v-loading="loading || appLoading" style="min-height: 200px")
            appAuth(v-if="valueAddedAppList" ref="appAuthRef" :data="{currentTenant: tenantAuth, serviceTypeList, terminalTypeList, isEdit: 2, valueAddedAppList}")
        el-tab-pane(v-if="tenantAuth?.myPlatType.includes('selfService')" label='自助终端权限' name='deviceAuth')  
          .bg(v-loading="loading" style="min-height: 200px")
            licenceAuth(v-if="licenceAuthList" ref="deviceAuthRef" :data="{currentTenant: tenantAuth, licenceAuthList, isEdit: 2}")
      .tabs-button-box
        el-button(v-if="tabsValue === 'deviceAuth'" type="primary" @click="downloadFun" :disabled="downNumber === 0" :loading="downLoading") 批量下载
          span(v-if="downNumber") ({{ downNumber }})

</template>
<script lang="ts" setup>
import { ref, reactive, onMounted, computed, watch } from 'vue'
// import TableTitle from '@/components/tableTitle.vue'
import { Config, Agency, Tenant } from '@/service/manage'
import { ElMessage } from 'element-plus'
import baseApp from '../tenant/components/baseApp.vue'
import appAuth from '../tenant/components/appAuth.vue'
import licenceAuth from '../tenant/components/licenceAuth.vue'

import { key } from "@/store";
import { useStore } from "vuex";
const store = useStore(key);
const { state } = store;
const tabsValue: any = ref('authorization')
let tenantAuth: any = ref()
let terminalTypeList: any = ref([])
let serviceTypeList: any = ref([])

const tenantId = computed(() => {
  return state.userInfo.tenantId
})
// const downDiasbled = computed(() => {
//   return deviceAuthRef.value.downNumber 
// })
const downNumber = computed(() => {
  return deviceAuthRef.value.downNumber
})
const downLoading = computed(() => {
  return deviceAuthRef.value.downLoading
})
const licenceAuthList = computed(() => {
  tenantAuth.value?.licenceFileList.forEach((element: any, index: any) => {
    element.myIndex = index + 1
  });
  return tenantAuth.value?.licenceFileList
})
let messageList: any = ref([])
const loading: any = ref(false)
const appLoading: any = ref(false)
const baseAppList: any = ref(null)
const valueAddedAppList: any = ref(null)
const deviceAuthRef: any = ref(null)
const objectSpanMethod = ({ row, column, rowIndex, columnIndex }: any) => {
  if (columnIndex === 0) {
    if (row.index === 0) {
      return {
        rowspan: row.num,
        colspan: 1,
      }
    } else {
      return {
        rowspan: 0,
        colspan: 0,
      }
    }
  }
}
const getTenantDetail = async (params: any, callback: any) => {
  loading.value = true
  try {
    const { data: res, msg, code }: any = await Tenant.getTenantDetail(params)
    console.log('getTenantDetail', msg, code, res)
    loading.value = false
    if (code === 200) {
      if (res.platTypeOp) {
        const arr: any = []
        res.platTypeOp.forEach((element: any) => {
          let obj: any = {}
          obj.code = Object.keys(element)[0]
          obj.expirationTime = element[Object.keys(element)[0]] ? JSON.parse(element[Object.keys(element)[0]]).expirationTime : ''
          // obj[element.code] = element.expirationTime
          arr.push(obj)
          // obj[element.code] = element.expirationTime
          // arr.push(obj)
        });
        res.myPlatTypeOp = arr
      }
      if (res.authList) {
        // let i: any = 0
        res.authList.forEach((element: any) => {
          element.channels.forEach((sub: any, i: any) => {
            const obj = {
              index: i,
              num: element.channels.length,
              type: element.code,
              typeName: element.name,
              message: sub.code,
              messageName: sub.name
            }
            messageList.value.push(obj)
          })
        })
      }
      if (res.platType?.length > 0) {
        const platTypeCodeArr: any = []
        res.platType.forEach((element: any) => {
          let code: any = typeof element === 'object' ? Object.keys(element)[0] : element
          platTypeCodeArr.push(code)
        });
        res.myPlatType = platTypeCodeArr
        // params.platTypeSet = platTypeCodeArr.join(',')
      }
      tenantAuth.value = res
    } else {
      ElMessage(msg)
    }
    callback()
  } catch (error) {
    loading.value = false
  }
}
const getTypeList = async() => {
  const params = {
    terminalForm: 1
  }
  // alert(editType.value)
  let { data: res, code, msg }: any = await Config.getTypeByAuth(params)
  console.log('getTypeList', res)
	if (code === 200) {
		terminalTypeList.value = res?.terminalType || []
		serviceTypeList.value = res?.platformType || []
	} else {
    console.log(msg)
  }
}
const getAppByPlatList = async() => {
  const platType: any = tenantAuth.value?.myPlatType || []  // 终端类型
  const platTypeOp: any = tenantAuth.value?.platTypeOp || [] // 平台类型
  const platformTypeSet = platTypeOp.map((obj: any) => Object.keys(obj)[0]).join(',')
  // console.log('sss', platformArr)

  const params: any = {
    // platformTypeSet: platformArr.join(','),
    // platTypeSet: platType.join(',')
  }
  if (platType.length > 0) {
    params.platTypeSet = platType.join(',')
  }
  // if (platType.length > 0) {
  //   const platTypeCodeArr: any = []
  //   platType.forEach((element: any) => {
  //     let code: any = typeof element === 'object' ? Object.keys(element)[0] : element
  //     platTypeCodeArr.push(code)
  //   });
  //   params.platTypeSet = platTypeCodeArr.join(',')
  // }
  // if (platformArr.length > 0) {
  // if(authForm?.platTypeOpArr.length > 0 || platformTypeSet) params.platformTypeSet = authForm?.platTypeOpArr.join(',') || platformTypeSet
  // }
   // baseAppTable.loading = true
  appLoading.value = true
  try {
    const { data: res, code, msg }: any = await Tenant.getAppListGroupPlatform(params)
    // baseAppTable.loading = false
    appLoading.value = false
    baseAppList.value = []
    valueAddedAppList.value = []
    if(code === 200) {
      
      res.forEach((element: any) => {   
        const newBaseAppArr: any = element.baseApp.map((item: any) =>{
          return {
            ...item,
            myIsBase: 1
          }
        })
        baseAppList.value.push(...newBaseAppArr)
        valueAddedAppList.value.push(...element.valueAddedApp)
      })
    }
    console.log(msg)
    // baseAppTable.total = baseAppList.value.length
    // baseAppTable.data = baseAppList.value.slice((baseAppTable.currentPage - 1) * baseAppTable.pageSize, baseAppTable.currentPage * baseAppTable.pageSize)
    
  } catch (error) {
    appLoading.value = false
    // baseAppTable.loading = false
  }
}
const downloadFun = () => {
  deviceAuthRef.value.downloadModelFunction()
}
onMounted(() => {
  console.log('onMounted', tenantId)
  if (tenantId.value) {
    const params = {
      tenantId: tenantId.value
    }
    getTenantDetail(params, () => {
      getAppByPlatList()
    })
    getTypeList()
  }

})
</script>
<style lang="scss" scoped>
.text {
  color: v-bind (color);
}
.marign-t-b{
  margin:16px 0;
}
.marign-r-2{
  margin-right:8px;
}
.marign-bottom-2x{
  margin-bottom:8px;
}
.col-line{
  line-height:30px;
}
.title{
  margin-right:4px;
  color: #999;
}
.title-table{
  width:80px;
  margin-top:6px;
}
.bg{
  background-color:var(--el-fill-color-light);
  border-radius:4px;
  padding:15px;
}
.table-s{
  border-radius:8px;
}
.flex{
  display:flex;
  width:100%;
}
.tab-box {
  position: relative;
}
.tabs-button-box {
  position: absolute;
  top: 0px;
  right: 32px;
}
</style>