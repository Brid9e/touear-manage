<!--
 * @Author: your name
 * @Date: 2022-02-24 14:28:03
 * @LastEditTime: 2022-04-07 16:30:44
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: /management/src/apps/platform/views/group/groupComponents/schemeBox.vue
-->
<template lang="pug">
//- el-card
//-   h1 {{ prop.name }}
//-   .choose-list
//-     .scheme-box(v-for='item in 20', :key='item')
//-       span 测试
//-     .scheme-box(
//-       v-for='item in transferData',
//-       :key='item.id',
//-       @click='settingScheme(item)',
//-       :class='{ isUse: item.status === true }'
//-     )
//-       span {{ item.scheduleName }}
//-       span.now-use(v-if='item.status') 当前绑定
//- 测试测试测试测试测试测试


el-card#boxCard
  template(#header)
    .card-header
      span {{ prop.name }}
      el-button.button(type='text', @click='removeSchedule') 删除方案
  .choose-list
    //- .scheme-box(v-for='item in 10', :key='item')
    //-   span 测试
    .scheme-box(
      v-for='item in transferData',
      :key='item.id',
      @click='settingScheme(item)',
      :class='{ isUse: item.status === true }'
    )
      span {{ item.scheduleName }}
      span.now-use(v-if='item.status') 当前绑定


    //- 测试测试测试测试测试
    //- .scheme-box(v-for='item in 10', :key='item')
    //-   span 测试
    //- SubDialog(v-model="showDialog" :width="500" title="注意")
    //-   el-form
    //-     el-form-item
    //-       span 此次操作将会使该群组下的所有用户方案变更，
    //-       span(style="color:#F56C6C;") 请慎重操作
    //-       span 。
    //-     el-form-item(label="请输入更换的方案名称")
    //-       el-input(v-model="schemeName")
    //-     el-form-item
    //-       el-button 确定
    //-       el-button 取消
</template>
<script lang="ts">
import { Group } from '@/service/platform'
import { ElMessage } from 'element-plus'
import { defineComponent, onMounted, ref } from 'vue'
import SubDialog from '@/components/subDialog.vue'
import { IMsgBoxOptions, msgbox } from '@/hooks/subMessageBox'
import { useStore } from 'vuex'
import { key } from '@/store'
export default defineComponent({
  components: {
    SubDialog
  },
  props: ['type', 'name', 'userType', 'rType', 'id'],
  setup(prop) {
    //
    const store = useStore(key)
    const { state } = store
    const transferData: any = ref([])
    const nowScheme: any = ref({})
    const scheduleData: any = ref({})
    const GROUP_DETAIL_ID: any = ref('')
    const APP_SCHEDULE_ID: any = ref(null)
    let showDialog: any = ref(false)
    let schemeName: any = ref('')
    const getAppScheduleList = async () => {
      const params = {
        scheduleUserType: prop.userType,
        scheduleServiceType: prop.type
      }
      const { data: res, code, msg }: any = await Group.getAppScheduleList(params)
      if (code === 200) {
        getListGroupDetailWithSchedule()
        res.filter((r: any) => {
          r.status = false
        })
        transferData.value = res
        // for (let data of transferData_) {
        //   data.label = data.scheduleName
        //   data.key = String(data.id)
        // }
        // console.log(res)
      } else {
        ElMessage.error(msg)
      }
    }
    const settingScheme = (data: any) => {
      if (APP_SCHEDULE_ID.value === data.id) {
        return
      }
      msg('提示', '你确定要更换此方案吗？', true, data)
      // showDialog.value = true
      // if (schemeName.value !== data.schemeName) {
      //   return
      // }
    }
    const getListGroupDetailWithSchedule = async () => {
      const params = {
        groupId: prop.id,
        type: prop.rType
      }
      const { data: res, code }: any = await Group.getListGroupDetailWithSchedule(params)
      if (code === 200) {
        nowScheme.value.scheduleName = res[0] ? res[0].APP_SCHEDULE_NAME : null
        GROUP_DETAIL_ID.value = res[0] ? res[0].GROUP_DETAIL_ID : null
        APP_SCHEDULE_ID.value = res[0] ? res[0].APP_SCHEDULE_ID : null
        transferData.value.filter((r: any) => {
          if (r.id === APP_SCHEDULE_ID.value) {
            r.status = true
          }
        })
        // console.log(nowScheme.value)
      }
    }
    const saveGroupDetail = async (list: any) => {
      const params = {
        groupId: prop.id,
        type: prop.rType,
        valueList: list
      }
      const { code, msg }: any = await Group.saveGroupDetail(params, 'messageBox')
      if (code === 200) {
        APP_SCHEDULE_ID.value = Number(list[0])
        getListGroupDetailWithSchedule()
        ElMessage.success(msg)
      }
    }
    const removeSchedule = async () => {
      const params = {
        id: GROUP_DETAIL_ID.value
      }
      const { code }: any = await Group.removeSchedule(params, 'messageBox')
      if (code === 200) {
        transferData.value.forEach((r: any) => {
          r.status = false
        })
        APP_SCHEDULE_ID.value = null
        ElMessage.success('删除成功')
      }
    }
    const msg = (title: string, message: string, showButton: any, data: any) => {
      const opt: IMsgBoxOptions = {
        title: title,
        message: message,
        showCancelButton: showButton ? showButton : true
      }
      msgbox
        .open(opt)
        .then(async (r: any) => {
          if (r === 'confirm') {
            //
            nowScheme.value = data
            saveGroupDetail([String(data.id)])
            transferData.value.forEach((r: any) => {
              r.status = false
            })
            data.status = true
          }
        })
        .catch(() => {
          return
        })
    }
    onMounted(() => {
      getAppScheduleList()
    })
    return {
      prop,
      transferData,
      settingScheme,
      nowScheme,
      scheduleData,
      removeSchedule,
      showDialog,
      schemeName,
      state
    }
  }
})
</script>

<style lang="scss">
#boxCard {
  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .text {
    font-size: 14px;
  }

  .item {
    margin-bottom: 18px;
  }

  .box-card {
    width: 480px;
  }
  height: 400px;
  margin-bottom: 10px;
  border-radius: 6px;
  padding: 1rem;
  box-sizing: border-box;
  overflow: hidden;
  transition: all 0.3s ease;
  &:hover {
    box-shadow: 0 8px 12px rgba(168, 168, 168, 0.349);
  }
  .choose-list,
  .el-card__body {
    display: flex;
    height: calc(100% - 50px);
    overflow-y: auto !important;
    flex-direction: column;
    overflow-x: hidden;
    &::-webkit-scrollbar {
      display: none;
    }
    .scheme-box {
      cursor: pointer;
      margin-right: 10px;
      width: 100%;
      height: 50px;
      padding: 12px !important;
      box-sizing: border-box;
      flex-shrink: 0;
      border: 1px solid #d3d4d6;
      background-color: white;
      color: #909399;
      margin-bottom: 10px;
      display: flex;
      align-items: center;
      transition: all 0.1s ease;
      border-radius: 8px;
      transform: scale(0.95);
      &:hover {
        transform: scale(1);
      }
    }
  }
  h1 {
    // color: white;
    height: 36px;
    margin-bottom: 10px;
  }
  .isUse {
    transform: scale(1) !important;
    // background-color: #ecf5ff;
    background-color: var(--main-primary) !important;
    position: sticky;
    bottom: 0;
    top: 0;
    display: flex;
    z-index: 1001;
    justify-content: space-between;
    border-color: var(--main-primary) !important;
    // color: var(--main-primary) !important;
    color: white !important;
  }
  .now-use {
    font-size: 14px;
    float: right;
    opacity: 0.6;
    color: white;
  }
  // .choose-box {
  //   font-weight: 600;
  //   cursor: pointer;
  //   margin-top: 10px;
  //   span {
  //     font-size: 16px;
  //     font-weight: 400;
  //     color: white;
  //   }
  // }
}
</style>
