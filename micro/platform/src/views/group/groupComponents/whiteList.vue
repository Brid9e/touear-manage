<!--
 * @Author: your name
 * @Date: 2021-10-14 14:14:04
 * @LastEditTime: 2022-04-07 14:12:24
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /management/src/apps/platform/views/group/groupComponents/whiteList.vue
-->
<template lang="pug">
.whiteList
  el-form(label-width="62px" :model="limitForm")
    el-row.group-input-box(:gutter="20")
      el-col(:xs="24" :sm="12" :md="8" :lg="6" :xl="6")
        el-form-item(label="登录名")
          el-input(v-model="limitForm.accountAccount" clearable)
      el-col(:xs="24" :sm="12" :md="8" :lg="6" :xl="6")
        el-form-item(label="学/工号")
          el-input(v-model="limitForm.accountSno" clearable)
      el-col(:xs="24" :sm="12" :md="8" :lg="6" :xl="6")
        el-form-item(label="姓名")
          el-input(v-model="limitForm.accountName" clearable)
      el-col(:xs="24" :sm="12" :md="8" :lg="6" :xl="6")
        el-form-item(label="身份")
          el-select.display-block(v-model="limitForm.identityCode" clearable)
            el-option(v-for="item in identityList" :label="item.name" :value="item.code"  :key="item.code" )
      el-col(:xs="24" :sm="12" :md="8" :lg="6" :xl="6")
        el-form-item(label="校区")
          el-select.display-block(v-model="limitForm.campusCode" clearable)
            el-option(v-for="item in campusList" :label="item.name" :value="item.code"  :key="item.code" )
      el-col(:xs="24" :sm="12" :md="8" :lg="6" :xl="6")
        el-form-item(label="邮箱" )
          el-input(v-model="limitForm.accountEmail" clearable)
      el-col(:xs="24" :sm="12" :md="8" :lg="4" :xl="6")
        el-form-item(label="手机号" )
          el-input(v-model="limitForm.accountMobile" clearable)
      el-col(:xs="8" :sm="4" :md="5" :lg="2" :xl="6")
        el-button(icon="el-icon-search" type='primary' @click="getWhiteList") 查询
        //- el-button(icon="el-icon-search" type='primary' @click="getExtendInfo") 查询
      el-col(:xs="8" :sm="4" :md="6" :lg="4" :xl="6" )
        el-button(icon="el-icon-circle-plus" type='primary' @click="showWhite = true") 添加白名单
        //- el-button(icon="el-icon-s-tools" type='primary' @click="showUserInfo = true") 设置人员信息
      el-col(:xs="8" :sm="4" :md="5" :lg="2" :xl="6")
        el-button(icon="el-icon-delete-solid" @click='resetting') 重置
  el-table(:data="whiteList" style="width: 100%" v-loading="loading" height="45vh" @selection-change="handleSelectionChange" :row-key="getRowKeys")
    el-table-column(type="selection" align="center"  :reserve-selection="true")
    el-table-column(prop="accountAccount" label="登录名" )
    el-table-column(prop="accountSno" label="学/工号")
    el-table-column(prop="accountName" label="姓名")
    el-table-column(prop="identityName" label="身份")
    el-table-column(prop="address" label="校区")
    el-table-column(prop="accountEmail" label="邮箱" )
    el-table-column(prop="accountMobile" label="手机号" fixed="right")
  .flexCenter
    el-button( icon="el-icon-delete-solid" type='danger' @click="removeWhiteLists" :disabled="selectList.length == 0") 删除(已选{{ selectNum }})
    el-pagination(@size-change="handleSizeChangeForWhite"
      @current-change="handleCurrentChangeForWhite"
      :current-page="white.currentPage"
      :page-sizes="[10, 20, 30, 40]"
      :page-size="white.pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="white.total"
      :page-count="white.pageCount"
      background)

</template>

<script lang="ts">
import { defineComponent } from 'vue'
import addWhite from './addWhite.vue'
import addExtendInfo from './addExtendInfo.vue'
import { Group, identityInfo } from '@/service/platform/index'
import { ElMessage } from 'element-plus'

export default defineComponent({
  components: {
    addWhite,
    addExtendInfo
  },
  data() {
    return {
      limitForm: {
        accountAccount: null,
        accountName: null,
        identityCode: null,
        campusCode: null,
        accountSno: null,
        accountMobile: null,
        accountEmail: null,
        selectLike: true
      },
      showWhite: false,
      showUserInfo: false,
      identityList: [],
      campusList: [],
      whiteList: [],
      extendInfoList: [],
      loading: false,
      selectList: [],
      selectNum: 0,
      white: {
        currentPage: 1,
        total: 0,
        pageCount: 0,
        pageSize: 10
      },
      extendInfo: {
        currentPage: 1,
        total: 0,
        pageCount: 1,
        pageSize: 10
      },
      activeIndex: 1
    }
  },
  watch: {
    // type(type) {
    //   this.selectList = []
    //   // if (type === '属性设置') {
    //   //   this.getExtendInfo()
    //   // } else {
    //   //   this.getWhiteList()
    //   // }
    // }
  },

  mounted() {
    // this.getWhiteList()
    // } else {
    //   this.getExtendInfo()
    // },
    this.getWhiteList()
    this.getIdentityList()
    this.getCampusList()
  },
  methods: {
    // /berserker-base/extendWhitelist/pageAccount 分页查询白名单人员
    async getWhiteList() {
      this.loading = true
      const params = {
        type: 'group',
        resourceId: this.$route.params.id,
        current: this.white.currentPage,
        size: this.white.pageSize
      }
      // {"selectLike":true,"accountAccount":null,"accountName":null,"accountSno":null,"identityCode":null,"campusCode":null,"accountMobile":null,"accountEmail":null}
      const { data: res, code }: any = await Group.getExtendInfoList(params as any)
      if (code === 200) {
        this.whiteList = res.records
        this.white.total = res.total
        this.white.pageSize = res.size
        this.white.currentPage = res.current
        this.white.pageCount = res.pages == 0 ? 1 : res.pages
        this.loading = false
      }
    },
    getRowKeys(row: any) {
      return row.id
    },
    async removeWhiteLists() {
      const pushArr = []
      for (const data of this.selectList) {
        console.log(data)
        pushArr.push((data as any).accountId)
      }

      const params = {
        accountIdList: pushArr,
        isCondition: false,
        resourceId: this.$route.params.id,
        type: 'group'
      }
      const { code, msg }: any = await Group.removeWhiteList(params as any)
      if (code === 200) {
        ElMessage.success(msg)
        this.getWhiteList()
      } else {
        ElMessage.error(msg)
      }
    },
    // /berserker-base/identity
    async getIdentityList() {
      const { data: res, code, msg }: any = await identityInfo.getIdentityList()
      if (code === 200) {
        this.identityList = res
      } else {
        console.log(msg)
      }
    },
    // /berserker-base/campus
    async getCampusList() {
      const { data: res, code, msg }: any = await Group.getCampusList()
      if (code === 200) {
        this.campusList = res
      } else {
        console.log(msg)
      }
    },
    // /berserker-base/extendInfo/pageAccount 属性设置列表
    // async getExtendInfo() {
    //   this.loading = true
    //   const params = {
    //     type: 'group',
    //     resourceId: this.id,
    //     current: this.extendInfo.currentPage,
    //     size: this.extendInfo.pageSize,
    //     json: JSON.stringify(this.limitForm)
    //   }
    //   const { data: res, code }: any = await Group.getExtendInfo(params)
    //   if (code === 200) {
    //     this.extendInfoList = res.records
    //     this.extendInfo.total = res.total
    //     this.extendInfo.pageSize = res.size
    //     this.extendInfo.currentPage = res.current
    //     this.extendInfo.pageCount = res.pages == 0 ? 1 : res.pages
    //     this.loading = false
    //   }
    // },

    handleSelectionChange(val: any) {
      this.selectNum = val.length
      this.selectList = val
    },
    handleCurrentChangeForWhite(val: number) {
      this.white.currentPage = val
      this.getWhiteList()
    },
    handleSizeChangeForWhite(val: number) {
      this.white.pageSize = val
      this.getWhiteList()
    },
    // handleCurrentChangeForExtendInfo(val: number) {
    //   this.extendInfo.currentPage = val
    //   this.getExtendInfo()
    // },
    // handleSizeChangeForExtendInfo(val: number) {
    //   this.extendInfo.pageSize = val
    //   this.getExtendInfo()
    // },
    closeWhite(val: boolean) {
      this.showWhite = val
    },
    resetting() {
      for (const i in this.limitForm) {
        ;(this.limitForm as any)[i] = ''
      }
    }
  }
})
</script>

<style lang="scss" scope>
.limit-box {
  .display-block {
    display: block;
  }
  .group-input-box .el-button {
    width: 100%;
  }
  // .el-pagination {
  //   margin: 0;
  // }
  // .flexCenter {
  //   display: flex;
  //   justify-content: space-between !important;
  //   padding-top: 1rem;
  // }
}
</style>
