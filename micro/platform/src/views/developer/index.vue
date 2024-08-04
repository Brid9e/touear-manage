<template lang="pug">
div
  el-form(label-width="90px")
    el-row.group-input-box(:gutter="10")
      el-col(:xs="24" :sm="12" :md="8" :lg="6" :xl="6")
        el-form-item(label="名称：")
          el-input(v-model='name', placeholder='请输入关键字')
      el-col(:xs="24" :sm="12" :md="8" :lg="6" :xl="6")
        el-form-item(label="状态：")
          el-select(v-model="status" placeholder="请选择" )
            el-option(v-for="(item, i) in statusList", :key="i", :label="item.label", :value="item.value")
      el-col(:xs="24" :sm="12" :md="8" :lg="6" :xl="6")
        el-form-item(label="类型：")
          el-select(v-model="type" placeholder="请选择")
            el-option(v-for="(item, i) in userTypeList", :key="i", :label="item.label", :value="item.value")
      el-col(:xs="24" :sm="12" :md="8" :lg="6" :xl="6")
        el-form-item(label="企业代码：")
          el-input(v-model='companyCode', placeholder='请输入内容')
      el-col(:xs="24" :sm="12" :md="8" :lg="6" :xl="6")
        el-form-item(label="手机号：")
          el-input(v-model='mobile', placeholder='请输入内容')
      el-col(:xs="24" :sm="12" :md="8" :lg="6" :xl="6")
        el-form-item(label="邮箱：")
          el-input(v-model='email', placeholder='请输入内容')
      //- el-col(:xs="24" :sm="12" :md="8" :lg="6" :xl="6")
        el-form-item(label="注册时间：")
          el-input(v-model='name', placeholder='请输入关键字')
      el-col.text-right(:xs="24" :sm="24" :md="16" :lg="12" :xl="12")
        el-form-item(label-width="auto")
          el-button(icon="el-icon-search" type='primary' @click='inquire') 查询
          el-button(icon="el-icon-plus" type='primary' @click='add') 添加
          el-button(icon="el-icon-delete-solid" @click="reset") 重置
  .table-content()
    el-table(:data="tableData" style="width: 100%; min-height:535px" border  v-loading="loading" size="medium")
      el-table-column(prop="avatar" width="70")
        template(#default="scope")
          .avatar-box
            //- img(:src="scope.row.avatar || require('@/assets/images/avatar.png')")
      el-table-column(prop="accountId" label="ID" align="center" width="60")
      el-table-column(prop="name" label="名称")
      //- el-table-column(prop="nameEn" label="英文名称")
      el-table-column(prop="companyCode" label="企业代码")
      //- el-table-column(prop="status" label="状态")
      //-   template(#default="scope")
      //-     //- span {{scope.row.status}}
      //-     el-switch(v-model="scope.row.status" :active-value="1" :inactive-value="0")
      //- el-table-column(prop="websize" label="地址")
      el-table-column(prop="type" label="类型")
        template(#default="scope")
          span {{userTypeList.find(item => item.value === scope.row.type).label}}
      //- el-table-column(prop="scheduleServiceType" label="终端类型")
        template(#default="scope")
          //- span {{switchPlatType(scope.row)}}
          span {{platList.find(item => item.value === scope.row.scheduleServiceType).label}}
      //- //- el-table-column(prop="state" label="标记" )
      el-table-column(prop="status" label="状态")
        template(#default="scope")
          .dot-box
            el-badge(is-dot :type="scope.row.status === 0 ? 'danger' : (scope.row.status === 1 ? 'primary' : 'warning')" class="mark")
            span.text {{statusList.find(item => item.value === scope.row.status).label}}
          //- span {{statusList.find(item => item.value === scope.row.status).label}}
      el-table-column(prop="mobile" label="手机号")
      el-table-column(prop="email" label="邮箱")
      el-table-column(prop="createTime" label="注册时间")
      el-table-column(label="操作" width="170")
        template(#default="scope")
          el-button(size="mini" plain @click="editDeveloper(scope.row)") 编辑
          el-button(size="mini" type="danger" plain @click="deleteDeveloper(scope.row)") 删除
    el-pagination(@size-change='handleSizeChange', @current-change='handleCurrentChange', :current-page='currentPage', :page-sizes='[10, 20, 30, 40]', :page-size='pageSize', layout='total, sizes, prev, pager, next, jumper', :total='total')
    el-dialog(title="修改" v-model="dialogFormVisible")

</template>
<script lang="ts">
import {
  defineComponent,
  computed,
  reactive,
  toRefs,
  onMounted,
  getCurrentInstance
} from 'vue'
// import { getDeveloperList } from '@/service/platform'
import { msgbox, IMsgBoxOptions } from '@/hooks/subMessageBox'
import { Developer } from '@/service/platform/index'
import { useStore } from 'vuex'
import { key } from '@/store/index'
export default defineComponent({
  name: 'login',
  setup() {
    const { appContext }: any = getCurrentInstance()
    // 弹窗
    const openMesage = (message: string, callback: any) => {
      const opt: IMsgBoxOptions = {
        title: '提醒',
        message: message,
        showCancelButton: true
      }
      msgbox.open(opt).then((r) => {
        callback(r)
      })
    }
    const { state } = useStore(key)
    interface DataProps {
      name: string
      type: string
      status: any
      companyCode: any
      mobile: string
      email: string
      userTypeList: any[]
      tableData: any[]
      currentPage: number
      pageSize: number
      total: number
      loading: boolean
      dialogFormVisible: boolean
    }
    const data: DataProps = reactive({
      name: '',
      type: '',
      status: null,
      companyCode: null,
      mobile: '',
      email: '',
      userTypeList: [
        {
          label: '服务提供商',
          value: 'isp'
        },
        {
          label: '自研开发者',
          value: 'normal'
        }
      ],
      // 0:禁用 1：正常 2:锁定
      statusList: [
        {
          label: '启用',
          value: 1
        },
        {
          label: '禁用',
          value: 0
        },
        {
          label: '锁定',
          value: 2
        }
      ],
      platList: [
        {
          label: 'APP',
          value: 'app'
        },
        {
          label: 'H5网页',
          value: 'h5'
        },
        {
          label: '微信小程序',
          value: 'wechatMini'
        },
        {
          label: 'PC网页',
          value: 'pc'
        }
      ],
      tableData: [],
      currentPage: 1,
      pageSize: 10,
      total: 0,
      loading: false,
      dialogFormVisible: false,
      reset: () => {
        // 重置
        data.name = ''
        data.type = ''
        data.status = null
        data.companyCode = null
        data.mobile = ''
        data.email = ''
      },
      inquire: () => {
        // 查询
        // console.log(data.name, data.type, data.status)
        getDeveloperList()
      },
      add: () => {
        // 添加开发人员
        // appContext.config.globalProperties.$message('添加开发人员')
      },
      handleSizeChange: (val: number) => {
        console.log(`每页 ${val} 条`)
        data.pageSize = val
        getDeveloperList()
      },
      handleCurrentChange: (val: number) => {
        console.log(`当前页: ${val}`)
        data.currentPage = val
        getDeveloperList()
      },
      // 查看详情
      toDetails: (item: any) => {
        data.dialogFormVisible = true
        console.log('查看详情:', item)
      },
      editDeveloper: (item: any) => {
        //编辑
        console.log('编辑开发者:', item.bh, item.name)
        // appContext.config.globalProperties.$message.warning('正在开发中')
      },
      deleteDeveloper: (item: any) => {
        //编辑
        console.log('删除开发者:', item.bh, item.name)
        // appContext.config.globalProperties.$message.warning('正在开发中')
      }
      // visibleType: (e: any) => {
      //   console.log(`e`, e)
      //   // data.currentPage = val
      //   // getDeveloperList()
      // }
    })
    // 查询开发者列表
    const getDeveloperList = async () => {
      const params: any = {
        current: data.currentPage,
        size: data.pageSize
      }
      if (data.name) params.name = data.name
      if (data.type) params.type = data.type
      if (data.status !== null) params.status = data.status
      if (data.companyCode !== null) params.companyCode = data.companyCode
      if (data.mobile) params.mobile = data.mobile
      if (data.email) params.email = data.email
      data.loading = true
      const {
        data: res,
        code,
        message
      }: any = await Developer.getDeveloperList(params)
      data.loading = false
      if (code === 200) {
        console.log(res)
        data.total = res.total
        data.tableData = res.records
      } else {
        console.log(message)
      }
    }
    //  监听回车
    const onkeydown = () => {
      document.onkeydown = (e) => {
        console.log(e)
        // if (e.key === 'Enter') {
        //   getDeveloperList()
        // }
      }
    }

    // console.log(this)
    onMounted(() => {
      onkeydown()
      // console.log('onMounted')
      getDeveloperList()
    })
    const refData = toRefs(data)
    return {
      token: computed(() => state.token),
      ...refData
    }
  },
  methods: {
    switchPlatType: (item: any) => {
      const key =
        item.flagIsServiceApp === '1'
          ? 'flagIsServiceApp'
          : item.flagIsMobileApp === '1'
          ? 'flagIsMobileApp'
          : item.flagIsWebApp === '1'
          ? 'flagIsWebApp'
          : ''
      return key
    }
    // async getDeveloperList() {
    //   const params: any = {
    //     current: this.currentPage,
    //     size: this.pageSize
    //   }
    //   if (this.id) params.id = this.id
    //   if (this.name) params.name = this.name
    //   if (this.nameEn) params.nameEn = this.nameEn
    //   if (this.type) params.type = this.type
    //   const { data: res, code, message }: any = await Module.getDeveloperList(params)
    //   if (code === 200) {
    //     console.log(res)
    //   } else {
    //     console.log(message)
    //   }
    // }
  }
})
</script>
<style scoped>
.el-select {
  display: block;
}
.avatar-box {
  text-align: center;
  width: 50px;
  height: 50px;
  overflow: hidden;
  border-radius: 50%;
}
.avatar-box img {
  width: 100%;
}

/* .el-table .warning-row {
  background: oldlace;
}

.el-table .success-row {
  background: #f0f9eb;
} */
</style>
