<template lang="pug">
.limit-box
  add-extendInfo(v-model:showExtendInfo="showUserInfo" :identityList="identityList" :campusList="campusList" :id="id" @update-extend="getExtendInfo")
  FilterContent
    el-form(label-width="72px" :model="limitForm" inline)
      el-form-item(label="登录名")
        el-input(v-model="limitForm.accountAccount" clearable)
      el-form-item(label="学/工号")
        el-input(v-model="limitForm.accountSno" clearable)
      el-form-item(label="姓名")
        el-input(v-model="limitForm.accountName" clearable)
      el-form-item(label="身份")
        el-select.display-block(v-model="limitForm.identityCode" clearable)
          el-option(v-for="item in identityList" :label="item.name" :value="item.code"  :key="item.code" )
      el-form-item(label="校区")
        el-select.display-block(v-model="limitForm.campusCode" clearable)
          el-option(v-for="item in campusList" :label="item.name" :value="item.code"  :key="item.code" )
      el-form-item(label="邮箱" )
        el-input(v-model="limitForm.accountEmail" clearable)
      el-form-item(label="手机号" )
        el-input(v-model="limitForm.accountMobile" clearable)
    template(#buttonGroup)
      //- el-button(icon="el-icon-search" type='primary' @click="getWhiteList") 查询
      //- el-button(icon="el-icon-circle-plus" type='primary' @click="showWhite = true") 添加白名单
      el-button(icon="el-icon-search" type='primary' @click="getExtendInfo") 查询
      el-button(icon="el-icon-s-tools" type='primary' @click="showUserInfo = true") 人员信息
      el-button(icon="el-icon-delete-solid" @click='resetting') 重置
  //- el-table(v-if="type === '白名单'" :data="whiteList" style="width: 100%" v-loading="loading"  @selection-change="handleSelectionChange":height="tableHeight - 50")
  //-   el-table-column(type="selection" align="center")
  //-   el-table-column(prop="accountAccount" label="登录名" )
  //-   el-table-column(prop="accountSno" label="学/工号")
  //-   el-table-column(prop="accountName" label="姓名")
  //-   el-table-column(prop="identityName" label="身份")
  //-   el-table-column(prop="address" label="校区")
  //-   el-table-column(prop="accountEmail" label="邮箱" )
  //-   el-table-column(prop="accountMobile" label="手机号" fixed="right")

  el-table(:data="extendInfoList" v-loading="loading")
    el-table-column(type="selection" align="center")
    el-table-column(prop="accountAccount" label="登录名")
    el-table-column(prop="accountSno" label="学/工号")
    el-table-column(prop="accountName" label="姓名")
    el-table-column(prop="identityName" label="身份")
    el-table-column(prop="address" label="校区" )
    el-table-column(prop="accountEmail" label="邮箱" )
    el-table-column(prop="accountMobile" label="手机号"  fixed="right")
  .flexCenter
    el-pagination(@size-change="handleSizeChangeForExtendInfo"
      @current-change="handleCurrentChangeForExtendInfo"
      :current-page="extendInfo.currentPage"
      :page-sizes="[10, 20, 30, 40]"
      :page-size="extendInfo.pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="extendInfo.total"
      :page-count="extendInfo.pageCount"
      background)


</template>

<script lang="ts">
import { defineComponent, computed } from 'vue'
import addWhite from './addWhite.vue'
import addExtendInfo from './addExtendInfo.vue'
import { Group, identityInfo } from '@/service/platform/index'
import { ElMessage } from 'element-plus'
import { msgbox, IMsgBoxOptions } from '@/hooks/subMessageBox'
import { useStore } from 'vuex'
import { key } from '@/store'
import FilterContent from '@/components/filterContent/index.vue'

export default defineComponent({
  setup() {
    const store = useStore(key)
    return {
      tableHeight: computed(() => {
        return store.state.tableHeight
      })
    }
  },
  props: {
    type: {
      type: String,
      default: null
    },
    id: {
      type: String,
      default: null
    }
  },
  components: {
    addWhite,
    addExtendInfo,
    FilterContent
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
      }
    }
  },
  watch: {
    id() {
      this.getWhiteList()
      this.getExtendInfo()
    }
  },

  mounted() {
    this.getExtendInfo()
    this.getIdentityList()
    this.getCampusList()
  },
  methods: {
    back() {
      this.$router.back()
    },
    // /berserker-base/extendWhitelist/pageAccount 分页查询白名单人员
    async getWhiteList() {
      this.loading = true
      const params = {
        type: 'group',
        resourceId: this.id,
        current: this.white.currentPage,
        size: this.white.pageSize,
        json: JSON.stringify(this.limitForm)
      }
      // {"selectLike":true,"accountAccount":null,"accountName":null,"accountSno":null,"identityCode":null,"campusCode":null,"accountMobile":null,"accountEmail":null}
      const { data: res, code }: any = await Group.getWhiteList(params)
      if (code === 200) {
        this.whiteList = res.records
        this.white.total = res.total
        this.white.pageSize = res.size
        this.white.currentPage = res.current
        this.white.pageCount = res.pages == 0 ? 1 : res.pages
        this.loading = false
      }
    },

    msg(title: string, message: string, showButton: any) {
      const opt: IMsgBoxOptions = {
        title: title,
        message: message,
        showCancelButton: showButton ? showButton : true
      }
      msgbox
        .open(opt)
        .then(async (r: any) => {
          if (r === 'confirm') {
            const pushArr = []
            for (const data of this.selectList) {
              pushArr.push((data as any).accountId)
              console.log(pushArr)
            }
            const params = {
              accountIdList: pushArr,
              isCondition: false,
              resourceId: this.id,
              type: 'group'
            }
            const { code, msg }: any = await Group.removeWhiteList(params, 'messageBox')
            if (code === 200) {
              ElMessage.success(msg)
              this.getWhiteList()
            }
          } else {
            return
          }
        })
        .catch(() => {
          return
        })
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
    async getExtendInfo() {
      this.loading = true
      const params = {
        type: 'group',
        resourceId: String(this.$route.params.id),
        current: this.extendInfo.currentPage,
        size: this.extendInfo.pageSize,
        json: ''
        // json: JSON.stringify(this.limitForm)
      }
      const { data: res, code }: any = await Group.getExtendInfo(params)
      if (code === 200) {
        this.extendInfoList = res.records
        this.extendInfo.total = res.total
        this.extendInfo.pageSize = res.size
        this.extendInfo.currentPage = res.current
        this.extendInfo.pageCount = res.pages == 0 ? 1 : res.pages
        this.loading = false
      }
    },

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
    handleCurrentChangeForExtendInfo(val: number) {
      this.extendInfo.currentPage = val
      this.getExtendInfo()
    },
    handleSizeChangeForExtendInfo(val: number) {
      this.extendInfo.pageSize = val
      this.getExtendInfo()
    },
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
  .el-pagination {
    margin: 0;
  }
  .flexCenter {
    display: flex;
    justify-content: space-between !important;
    padding-top: 1rem;
    margin: 0;
  }
}
</style>
