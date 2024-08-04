<template lang="pug">
div
  //- p id {{id}}
  ChannelInfo(v-if="id === '3'")
  TenantInfo(v-if="id === '4'")
</template>
<script lang="ts" setup>
import { ref, reactive, onMounted, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
// import TableTitle from '@/components/tableTitle.vue'
// import { Subarea, Agency } from '@/service/manage'
import { ElMessage } from 'element-plus'
import ChannelInfo from './info.vue'
import TenantInfo from './tenantInfo.vue'

const route: any = useRoute()
const id = computed(() => route.params.id)

// const authType = reactive({
//   type: '',
//   name:'',
//   value:''
// })
// //授权数据的回显
// let authList: any = ref({})
// let messageList:any = ref([])
// const getExtendInfoData = async () => {
// 	const params: any = {
// 		id: 1,
// 	}
// 	const res = await Agency.getExtendInfoList(params)
// 	if (res.code === 200) {
//     authList.value = res.data
//     if (authList.value['tenantMaxNum'] && authList.value['tenantMaxNum'].length > 0 && authList.value['tenantMaxNum'][0].value !== -1){
//       authType.type ='tenant'
//       authType.name = "租户"
//       authType.value = authList.value['tenantMaxNum'][0].value
//     } else if (authList.value['userMaxNum'] && authList.value['userMaxNum'].length > 0 && authList.value['userMaxNum'][0].value !== -1){
//       authType.type ='user'
//       authType.name = "用户"
//       authType.value = authList.value['userMaxNum'][0].value
//     }
//     authList.value['messageChannel'].forEach((element:any) => {
//       const index = channelList.value.findIndex((c:any) => {return c.code === element.value})
//       console.log(333, index)

//       const arr = element.channels.map((o:any, index:number) => {
//         return{
//           num: index === 0 ? element.channels.length : 0,
//           type: element.value,
//           typeName: channelList.value[index]?.name,
//           message: o,
//           messageName: channelList.value[index]?.channels.find((c:any) => {return c.code === o})?.name
//         }
//       })
//       messageList.value = messageList.value.concat(arr)
//     })
//     console.log(2222, messageList.value)
    
// 	} else {
// 		ElMessage.error(msg)
// 	}
// }
// getExtendInfoData()
// // tab
// const tabsValue = ref('base')
// const handleClickAuth = (val: any) => {
// }
//平台类型&终端类型 字典
// const platTypeList: any = ref({})
// const terminalTypeList: any = ref({})
// const getTypeByAuthList = async () => {
// 	const { data: res, msg, code }: any = await Agency.getTypeByAuth()
// 	if (code === 200) {
// 		platTypeList.value = res.platformType || []
// 		terminalTypeList.value = res.terminalType || []
// 	} else {
// 		ElMessage.error(msg)
// 	}
// }
// getTypeByAuthList()
//获取消息通道 字典
// const channelList =ref([])
// const getMessageChannel = async () => {
// 	const { data: res, msg, code }: any = await Agency.getAgencyChannelTree()
// 	if (code === 200) {
// 		channelList.value = res
// 	} else {
// 		ElMessage.error(msg)
// 	}
// }
// getMessageChannel()
// const objectSpanMethod = ({ row, column, rowIndex, columnIndex }: any) => {
//   if (columnIndex === 0) {
//     return {
//       rowspan: 0,
//       colspan: 0
//     }
//   }
// }

</script>
<style lang="scss" scoped>
// .text {
//   color: v-bind (color);
// }
// .marign-t-b{
//   margin:16px 0;
// }
// .marign-r-2{
//   margin-right:8px;
// }
// .marign-bottom-2x{
//   margin-bottom:8px;
// }
// .col-line{
//   line-height:30px;
// }
// .title{
//   margin-right:4px;
//   color: #999;
// }
// .title-table{
//   width:80px;
//   margin-top:6px;
// }
// .bg{
//   background-color:var(--el-fill-color-light);
//   border-radius:4px;
//   padding:15px;
// }
// .table-s{
//   border-radius:8px;
// }
// .flex{
//   display:flex;
//   width:100%;
// }
</style>