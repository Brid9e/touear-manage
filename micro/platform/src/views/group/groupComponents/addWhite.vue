<!--
 * @Author: your name
 * @Date: 2021-09-02 16:50:31
 * @LastEditTime: 2022-05-18 11:53:20
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /management/src/components/group/groupComponents/addWhite.vue
-->
<template lang="pug">
#AddWhite
  el-dialog(title='添加成员', v-model='show', @closed='closed', :width='1000')
    .box
      el-form(label-width='62px')
        el-row.group-input-box(:gutter='20')
          el-col(:xs='24', :sm='12', :md='8', :lg='8', :xl='6')
            el-form-item(label='登录名')
              el-input(v-model='addWhiteForm.account', clearable)
          el-col(:xs='24', :sm='12', :md='8', :lg='8', :xl='6')
            el-form-item(label='学工号')
              el-input(v-model='addWhiteForm.sno', clearable)
          el-col(:xs='24', :sm='12', :md='8', :lg='8', :xl='6')
            el-form-item(label='姓名')
              el-input(v-model='addWhiteForm.name', clearable)
          el-col(:xs='24', :sm='12', :md='8', :lg='8', :xl='6')
            el-form-item(label='身份')
              el-select.display-block(v-model='addWhiteForm.identityCode', placeholder='请选择', clearable)
                el-option(v-for='item in identityList', :label='item.name', :value='item.code', :key='item.code')
          el-col(:xs='24', :sm='12', :md='8', :lg='8', :xl='6')
            el-form-item(label='手机号')
              el-input(v-model='addWhiteForm.mobile', clearable)
          el-col(:xs='12', :sm='6', :md='4', :lg='4', :xl='6')
            el-button(:icon='Search', type='primary', @click='getAccount') 查询
          el-col(:xs='12', :sm='6', :md='4', :lg='4', :xl='6')
            el-button(:icon='Refresh', @click='resetting') 重置
      .table-box
        el-table(ref="tableRef" :data='accountList', border, v-loading='loading', @selection-change='handleSelectionChange' :row-key="getRowKeys")
          el-table-column(type='selection', align='center'  :reserve-selection="true")
          el-table-column(prop='account', label='登录名')
          el-table-column(prop='sno', label='学工号', :show-overflow-tooltip='true')
          el-table-column(prop='name', label='姓名')
          el-table-column(prop='mobile', label='手机号')
    template(#footer)
      .flexCenter
        el-row.group-input-box(:gutter='6')
          el-col(:span='12')
            el-button(type='primary', @click='addWhite', :disabled='selectList.length < 1') 确认(共选中{{ selectNum }}人)
        el-pagination(@size-change='handleSizeChange', @current-change='handleCurrentChange', :current-page='currentPage', :page-size='pageSize', layout="total, sizes, prev, pager, next, jumper", :total='total', :page-count='pageCount', background)

</template>

<script lang="ts">
import { ref, defineComponent, onUnmounted } from 'vue'
import { ElMessage } from 'element-plus'
import { Group } from '@/service/platform/index'
import FilterContent from '@/components/filterContent/index.vue'
import { Search, Refresh } from '@element-plus/icons-vue'

export default defineComponent({

  setup() {
    const tableRef: any = ref<HTMLElement>()
    onUnmounted(() => {
      tableRef.value?.clearSelection()
      console.log('destroy')
    })
    return {
      tableRef
    }
  },
  // props: ['showWhite', 'identityList', 'id', 'updateWhiteList'],
  props: {
    showWhite: {
      type: Boolean,
      default: false
    },
    identityList: {
      type: Array,
      default: null
    },
    id: {
      type: String,
      default: null
    }
  },
  components: {
    FilterContent
  },
  data() {
    return {
      Search,
      Refresh,
      show: false,
      addWhiteForm: {
        account: '',
        name: '',
        sno: '',
        identityCode: '',
        mobile: ''
      },
      accountList: [],
      pageCount: 0,
      total: 0,
      currentPage: 1,
      pageSize: 10,
      loading: true,
      selectNum: 0,
      selectList: []
    }
  },
  watch: {
    showWhite(val) {
      this.show = val
      if (val === true) {
        this.getAccount()
      } else {
        (this.$refs as any).tableRef?.clearSelection()
      }
    }
  },
  methods: {
    handleSelectionChange(val: any) {
      this.selectNum = val?.length
      this.selectList = val
    },
    handleCurrentChange(val: number) {
      this.currentPage = val
      this.getAccount()
    },
    handleSizeChange(val: number) {
      this.pageSize = val
      this.getAccount()
    },

    // /berserker-base/extendWhitelist/addWhitelist
    async addWhite() {
      const selectIdList = []
      for (const i in this.selectList) {
        selectIdList.push(String((this.selectList as any)[i].sno))
      }
      const params: any = {
        // accountIdList: selectIdList,
        // resourceMap: {
        //   '12313': {
        //     sno: selectIdList
        //   }
        // },
        // resourceIdList: [this.id],
        // isCondition: false,
        // resourceId: Number(this.id),
        resourceMap: {},
        removeResource: 'false',
        type: 'group'
      }
      // this.selectIdList.push
      params.resourceMap[this.id] = {
        sno: selectIdList
      }
      const {
        // data: res,
        code,
        msg
      }: any = await Group.addExtendInfo(params, 'messageBox')
      if (code === 200) {
        ElMessage.success(msg)
        this.$emit('update:showWhite', false)
        this.$emit('updateWhiteList', null)
      }
    },

    async getAccount() {
      const params: any = {
        current: this.currentPage,
        size: this.pageSize,
        selectLike: true,
        status: 1
      }
      if (this.addWhiteForm.account) {
        params.account = this.addWhiteForm.account
      }
      if (this.addWhiteForm.name) {
        params.name = this.addWhiteForm.name
      }
      if (this.addWhiteForm.sno) {
        params.sno = this.addWhiteForm.sno
      }
      if (this.addWhiteForm.identityCode) {
        params.identityCode = this.addWhiteForm.identityCode
      }
      if (this.addWhiteForm.mobile) {
        params.mobile = this.addWhiteForm.mobile
      }
      const { data: res, code, msg }: any = await Group.getAccount(params)
      if (code === 200) {
        this.accountList = res.records
        this.pageCount = res.pages
        this.total = res.total
        this.loading = false
      } else {
        ElMessage.error(msg)
        this.loading = false
      }
    },
    resetting() {
      for (const i in this.addWhiteForm) {
        ; (this.addWhiteForm as any)[i] = ''
      }
    },
    closed() {
      this.resetting()
      this.selectNum = 0
      this.selectList = []
      this.$emit('update:showWhite', false)
    },
    getRowKeys(row: any) {
      return row.id
    }
    // /berserker-base/account/page
    // account: 123
    // name: 132
    // sno: 123
    // identityCode: 2
    // mobile:
  }
})
</script>

<style lang="scss" scope>
#AddWhite {
  .display-block {
    display: block;
  }

  .group-input-box .el-button {
    width: 100% !important;
  }

  .flexCenter {
    display: flex !important;
    justify-content: space-between;
    align-items: flex-end;
    margin-top: -1.5rem;

    [class*='el-col-'] {
      max-width: 100% !important;
    }
  }
}
</style>
