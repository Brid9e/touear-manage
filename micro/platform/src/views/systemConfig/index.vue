<!--
 * @Author: your name
 * @Date: 2021-08-23 15:48:52
 * @LastEditTime: 2022-05-18 14:27:02
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /management/src/components/systemConfig/imdex.vue
-->
<template lang="pug">
#systemConfig
  HeadOperation
    el-input(:prefix-icon="Search" placeholder="通过系统代码筛选" v-model="form.code" clearable @keydown.enter="getConfigData('messageBox')")
    el-button(:icon="Search" type='primary' @click="getConfigData('messageBox')") 查询
    el-button(:icon="Refresh" @click="resetting") 重置
    template(#right)
      el-button(:icon="Cpu" type='primary' @click="removeAllCatch" :disabled="!state.funcButton.systemConfigAllCleanCatch") 清除系统缓存
      el-button(v-if="Number(state.userInfo?.tenant?.privatization) === 1" :icon="Refresh" type='primary' @click="showDialog" :disabled="!state.funcButton.systemConfigAllSyncFlow") 同步流水
    template(#fold)
      el-form(:model="form" inline :label-width="60")
        el-row
          //- el-col(:xs="12", :sm="12", :md="8", :lg="6", :xl="4")
            el-form-item(label="代码")
              el-input(placeholder="请输入内容" v-model="form.code" clearable )
          el-col(:xs="12", :sm="12", :md="8", :lg="6", :xl="4")
            el-form-item(label="名称")
              el-input(placeholder="请输入内容" v-model="form.name" clearable )
          el-col(:xs="12", :sm="12", :md="8", :lg="6", :xl="4")
            el-form-item(label="类型")
              el-select.display-block(placeholder="请输入内容" v-model="form.type" clearable)
                el-option(v-for="item in options", :key="item.value", :label="item.label", :value="item.value")
          //- el-col(:xs="12", :sm="12", :md="8", :lg="6", :xl="4")
            el-form-item
              el-button(:icon="Search" type='primary' @click="getConfigData") 查询
              el-button(:icon="Refresh" @click="resetting") 重置
  //- FilterContent
  //- template(#buttonGroup)
    el-button(:icon="Search" type='primary' @click="getConfigData") 查询
    el-button(:icon="Refresh" @click="resetting") 重置
  el-table(:data="configData" type="index" v-loading="loading" size="medium")
    //- el-table-column(prop="id" label="系统ID" align="center" width="100" )
    el-table-column(prop="id" label="编号" width="80" align="center")
    el-table-column(prop="code" label="系统代码" :show-overflow-tooltip="true")
    el-table-column(prop="name" label="系统名称" :show-overflow-tooltip="true" )
    //- el-table-column(prop="type" label="类型")
    //-   template(#default="scope")
    //-     p(v-if="scope.row.type == 0") 字符串
    //-     p(v-else-if="scope.row.type == 1") LIST集合
    //-     p(v-else="scope.row.type == 2") MAP集合
    el-table-column(prop="value" label="参数值" :show-overflow-tooltip="true" )
    el-table-column(prop="description" label="描述" :show-overflow-tooltip="true" )
    el-table-column(label="操作" align="center" width="100")
      template(#default="scope")
        el-button(link, type="primary", @click="openEdit(scope.row, scope.$index)", :disabled="!state.funcButton.systemConfigAllEdit") 编辑
  edit(v-model:show="showEdit" :index="rowIndex" :data="dialogData" @update-list="getConfigData")
  .flex-center
    el-pagination(@size-change="handleSizeChange",
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-sizes="[10, 20, 30, 40]"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total",
      background
      :page-count="pageCount")
  el-dialog(v-model="show" title="同步流水" :width="800")
    el-form(style="display:flex;" label-width="100px")
      el-form-item(label="开始日期")
        el-date-picker(type="date" v-model="fromTime" value-format="YYYY-MM-DD")
      el-form-item(label="结束日期")
        el-date-picker(type="date" v-model="toTime" value-format="YYYY-MM-DD")
        el-button(type="primary" style="margin-left:2rem;" @click="synchronous") 开始同步
    el-scrollbar.pre-box(ref="scrollRef")
      pre(ref="preBox")
        pre.empty 准备就绪...
</template>

<script lang="ts">
import { defineComponent, computed, ref, onActivated } from 'vue'
import edit from './configComponents/editBox.vue'
import subDialog from '@/components/subDialog.vue'
import { SystemConfig } from '@/service/platform/index'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useStore } from 'vuex'
import { key } from '@/store/index'
import { msgbox, IMsgBoxOptions } from '@/hooks/subMessageBox'
import FilterContent from '@/components/filterContent/index.vue'
import { Search, Cpu, Refresh } from '@element-plus/icons-vue'
import HeadOperation from '@/components/headOperation.vue'

export default defineComponent({
  components: {
    edit,
    subDialog,
    FilterContent,
    HeadOperation
  },
  created() {
    // console.log(this.configData)
  },
  setup() {
    const store = useStore(key)
    const { state } = store
    const disabled: any = ref(false)
    const fromTime: any = ref(null)
    const toTime: any = ref(null)
    const preBox: any = ref(null)
    const show: any = ref(false)
    const timer: any = ref()
    const scrollRef: any = ref()
    if (state.userInfo && state.userInfo === 'admin') {
      disabled.value = false
    } else {
      disabled.value = true
    }
    const daterange: any = ref([])
    const synchronous = async () => {
      if (fromTime.value && toTime.value) {
        ElMessageBox.confirm("确定同步历史流水？", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(async () => {
          await syncApi('0')
        })
      } else {
        ElMessage.error('请输入日期')
      }
    }

    const syncApi = async (reSynchronous: string) => {
      const params = {
        fromTime: fromTime.value,
        fromTimestamp: String(new Date().getTime()),
        reSynchronous,
        toTime: toTime.value
      }
      const { data: res, msg, code }: any = await SystemConfig.synchronous(params, 'messageBox')
      if (code === 200) {
        if (res === '1') {
          getTaskSpeed('init')
        } else {
          ElMessageBox.confirm("已经有同步在进行，是否重新同步？", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          }).then(async () => {
            preBox.value.innerHTML = ''
            clearTimeout(timer.value)
            await syncApi('1')
            getTaskSpeed('init')
          })
          // ElMessage.warning('无可同步流水')
        }
      }
    }

    const getTaskSpeed = (status?: any) => {
      if (status === 'init') preBox.value.innerHTML = '<p class="init-text">——————————————数据初始化——————————————</p>'

      if (show.value === false) return
      timer.value = setTimeout(async () => {
        const { data: res, msg, code }: any = await SystemConfig.getTaskSpeed()
        if (code === 200) {
          if (!res) {
            clearTimeout(timer.value)
            preBox.value.innerHTML = preBox.value.innerHTML + '<p class="init-text">——————————————同步结束——————————————</p>'
            scrollRef.value.setScrollTop(preBox.value.scrollHeight)
            return
          }
          preBox.value.innerHTML = preBox.value.innerHTML + '数据：' + res + '<br>'
          preBox.value.scrollTop = preBox.value.scrollHeight + 'px'
          scrollRef.value.setScrollTop(preBox.value.scrollHeight)

        } else {
          preBox.value.innerHTML = preBox.value.innerHTML + '<span style="color: red;">数据异常：' + msg + '</span><br>'
          scrollRef.value.setScrollTop(preBox.value.scrollHeight)

          return
        }
        await getTaskSpeed()
      }, 1000)
    }

    const showDialog = () => {
      show.value = true
    }

    return {
      disabled,
      daterange,
      synchronous,
      fromTime,
      toTime,
      preBox,
      show,
      showDialog,
      Search,
      Cpu,
      Refresh,
      state,
      scrollRef,
      tableHeight: computed(() => {
        return state.tableHeight
      })
    }
  },
  data() {
    return {
      configData: [],
      data: {},
      currentPage: 1,
      loading: false,
      total: 0,

      pageSize: 10,
      pageCount: 0,
      rowIndex: 0,
      showEdit: false,
      dialogData: {},
      form: {},
      options: [
        {
          label: '字符串',
          value: '0'
        },
        {
          label: 'LIST集合',
          value: '1'
        },
        {
          label: 'MAP集合',
          value: '2'
        }
      ]
    }
  },
  watch: {
    fromTime(val) {
      console.log(val)
    },
    toTime(val) {
      console.log(val)
    }
  },
  mounted() {
    this.getConfigData()
  },
  activated() {
    this.getConfigData()
  },
  methods: {
    // /berserker-ykt-sync/turnover/synchronous
    // fromTime: "2020-11-10"
    // fromTimestamp: "1517451581000"
    // reSynchronous: "0"
    // toTime: "2021-11-16"

    // current: 1
    // size: 10
    // ascs: id
    // code: 代码
    // name: 名称
    // type: 0 字符串 1 LIST 2 MAP
    handleCurrentChange(val: number) {
      this.currentPage = val
      this.getConfigData()
    },
    handleSizeChange(val: number) {
      this.pageSize = val
      this.getConfigData()
    },
    openEdit(data: any, index: any) {
      this.showEdit = true
      this.rowIndex = index
      this.dialogData = data
    },
    // close(data: any) {
    //   data.show = false
    // },
    async getConfigData(msgBox?: string) {
      this.loading = true
      const params: any = {
        current: this.currentPage,
        size: this.pageSize,
        ascs: 'id',
        ...this.form
      }
      const { data, code }: any = await SystemConfig.getConfigData(params, msgBox)
      if (code === 200) {
        let configDataArr = data.records
        for (const i of configDataArr) {
          i.show = false
        }
        this.configData = configDataArr
        this.total = data.total
        this.pageCount = data.pages
        this.loading = false
      }
    },
    // /berserker-base/redis/removeAllCatch
    async removeAllCatch() {
      ElMessageBox.confirm("确认清除缓存？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(async () => {
        const { msg, code }: any = await SystemConfig.removeAll('messageBox')
        if (code === 200) {
          ElMessage.success('清除成功')
        }
      })
    },
    resetting() {
      for (const i in this.form) {
        ; (this.form as any)[i] = ''
      }
    }
  }
})
</script>

<style lang="scss" scope>
#systemConfig {
  overflow-x: hidden;

  .display-block {
    display: block;
  }

  .marging-top {
    margin-top: 16px;
  }

  .pre-box {
    width: 100%;
    max-height: 400px;
    height: 500px;
    background-color: rgb(29, 29, 29);
    color: #8efc8e;
    border-radius: 5px;
    padding: 0.5rem 1rem;
    box-sizing: border-box;
    overflow-y: auto;

    p::selection,
    pre::selection {
      background-color: var(--el-color-primary) !important;
      color: #ffffff;
    }
  }

  .flexCenter {
    // display: flex;
    // justify-content: center;
  }

  .init-text {
    width: 100%;
    margin: 1rem 0;
    text-align: center;
  }
}
</style>