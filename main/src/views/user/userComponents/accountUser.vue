<template lang="pug">
div()
  //- span saas:{{typeof  deploymentType }} 
  el-tabs(v-model="activeName" type="card" class="demo-tabs" @tab-click="handleClick" :class="!deploymentType ?'' :'isSaas'")
    el-tab-pane(label="商户" name="first") 
      el-form(label-width="5.625rem" inline)
        el-row.group-input-box(:gutter="10")
          el-col(:xs="24" :sm="24" :md="14" :lg="14" :xl="6")
            el-form-item(label="商户信息：")
              el-input(v-model="mercacc", placeholder="请输入商户名或者商户号")
            el-form-item()
              el-button(:icon="Search" type="primary" @click="inquireMa") 查询
          el-col.text-right(:xs="24" :sm="24" :md="10" :lg="10" :xl="18")
            el-form-item(label-width="auto")
              el-button(:disabled="!state.funcButton.systemUserBind",type="primary" :icon="Connection" @click="addHandleMa") 绑定
          el-table(:data="tableDataMa" style="width: 100%" border v-loading="tableLoadingMa")
            el-table-column(label="序号" type="index" align="center" width="56")
            el-table-column(prop="type" label="姓名")
              template(#default="scope")
                p(v-if="scope.row.baseAccount !== null") {{scope.row.baseAccount.name}}
                p(v-else) 无
            el-table-column(prop="type" label="群组类型")
              template(#default="scope")
                p(v-if="scope.row.type === 1") {{groupName}}
                p(v-else) 无
            el-table-column(prop="type" label="绑定类型" width="88")
              template(#default="scope")
                p(v-if="scope.row.type === 1") 商户
            el-table-column(prop="mercacc.code" label="商户号" )
            el-table-column(prop="resourceCode" label="商户名称" )
            el-table-column(prop="type" label='状态', width='100', align='center')
              template(#default="scope")
                el-switch(:before-change="beforeChange" :disabled="!state.funcButton.systemUserBind", v-model='scope.row.status', :active-value='1', :inactive-value='0', @click='changeStatus(scope.row)')
            el-table-column(label="操作" width="120")
              template(#default="scope")
                div.link-group
                  el-button(type="primary", link, plain, @click="toGetPos(scope.row)") Pos管理
                //- el-link.font-size-12(v-if="scope.row.status === 1" :href="null" type="danger"  @click="removeRole(scope.$index, scope.row)") 禁用
                //- el-link.font-size-12(v-if="scope.row.status !== 1" :href="null" type="primary" @click="reduction(scope.$index, scope.row)") 启用
        .flex-center
          el-pagination(@size-change='handleSizeChangeMa'
            @current-change='handleCurrentChangeMa'
            :current-page='currentPageMa'
            :page-sizes='[10, 30, 50, 100]'
            :page-size='pageSizeMa'
            layout="total, sizes, prev, pager, next"
            background
            :total='totalMa'
            )
    el-tab-pane(v-if="!deploymentType" label="一卡通" name="second")
      el-form(label-width="6rem" inline)
        el-row.group-input-box(:gutter="10")
          el-col(:xs="24" :sm="24" :md="14" :lg="14" :xl="6")
            el-form-item(label="一卡通信息：")
              el-input(v-model="resourceCode", placeholder="请输入一卡通号码")
            el-form-item
              el-button(:icon="Search" type="primary" @click="inquireCard") 查询
          el-col.text-right(:xs="24" :sm="24" :md="10" :lg="10" :xl="18")
            el-form-item(label-width="auto")
              el-button(:disabled="!state.funcButton.systemUserBind",type="primary" :icon="Connection" @click="addHandleCard") 绑定
          el-table(:data="tableDataCard" style="width: 100%" border v-loading="tableLoadingCard")
            el-table-column(label="序号" type="index" align="center" width="56")
            el-table-column(prop="type" label="姓名")
              template(#default="scope")
                p(v-if="scope.row.baseAccount !== null") {{scope.row.baseAccount.name}}
                p(v-else) 无
            el-table-column(prop="type" label="群组类型")
              template(#default="scope")
                p(v-if="scope.row.type === 1") {{groupName}}
                p(v-else) 无
            //- el-table-column(prop="status" label="状态" width="88")
            //-   template(#default="scope")
            //-     p(v-if="scope.row.status === 1") 启用
            //-     p(v-else) 禁用
            el-table-column(prop="type" label='状态', width='100', align='center')
              template(#default="scope")
                el-switch(:before-change="beforeChange" :disabled="!state.funcButton.systemUserBind", v-model='scope.row.status', :active-value='1', :inactive-value='0',  @click='changeStatus(scope.row)')
            el-table-column( prop="type" label="绑定类型" width="88")
              template(#default="scope")
                p(v-if="scope.row.type === 2") 一卡通
            el-table-column(prop="resourceCode" label="一卡通号" )
            //- el-table-column(label="操作" width="80")
            //-   template(#default="scope")
            //-     el-link.font-size-12(v-if="scope.row.status === 1" :href="null" type="danger"  @click="removeRole(scope.$index, scope.row)") 禁用
            //-     el-link.font-size-12(v-if="scope.row.status !== 1" :href="null" type="primary" @click="reduction(scope.$index, scope.row)") 启用
        .flex-center
          el-pagination(@size-change='handleSizeChangeCard'
            @current-change='handleCurrentChangeCard'
            :current-page='currentPageCard'
            :page-sizes='[10, 30, 50, 100]'
            :page-size='pageSizeCard'
            layout="total, sizes, prev, pager, next"
            background
            :total='totalCard'
            )
    el-dialog(:title="dialogTit" v-model="showMacc" destroy-on-close='true')
      el-form(v-if="maccInfo.isCard === '0'")
        el-form-item( label="群组类型" label-width="5.625rem" prop='')
          el-select(v-model="maccInfo.groupType" placeholder="请选择" style="width: 13.75rem")
            el-option(v-for="item in maccInfo.groupSelect.data" :key="item.id" :label="item.name", :value="item.id")
        el-form-item( label="商户" label-width="5.625rem" prop='')
          el-transfer(filterable :filter-method="filterMethod" filter-placeholder="请输入商户名或商户号" v-model = "maccValue" :data = "mercaccData" :titles="['未添加商户', '已添加商户']")  
          //- TableTransfer(:metadata='mercaccData' :beMerData='selMaData' @maccmodelValue='getMaccNewData')
      el-form(v-if="maccInfo.isCard === '1'")
        el-form-item( label="一卡通号" label-width="5.625rem" prop='')
          el-input(v-model="cardNum", placeholder="请输入一卡通号")
      template(#footer)
        el-button(@click='showMacc = false') 取消
        el-button(type='primary' @click='confirm') 确定
  //- pos管理
el-dialog(v-model='showBindPos', :width='650', title='Pos列表', custom-class='bindPos-dialog-list')
  div(style='padding-bottom: 20px')
    el-form(label-width="5.625rem" inline)
      el-row.group-input-box(:gutter="10")
        el-col(:xs="24" :sm="24" :md="24" :lg="24" :xl="24")
          el-form-item(label="POS信息：")
            el-select(v-model="posInfo" multiple placeholder="请输入pos号" filterable clearable)
              el-option(v-for="item in posAllData" :key="item.posId" :label="item.posId" :value="item.posId")
          el-form-item()
            el-button(:icon="Connection" type="primary" @click="bindPos") 绑定Pos
    el-table.margin-top-x(:data='posTableData', style='width: 100%', border, v-loading='tableLoading')
      el-table-column(prop='posId', label='Pos号')
      el-table-column(prop='nodeId', label='网关节点')
      el-table-column(label='操作')
        template(#default='scope')
          el-button(size='mini', link, type='primary', @click='toRemovePos(scope.row)') 解除绑定  
</template>
<script lang="ts">
import { defineComponent, computed, onMounted, reactive, toRefs, ref } from "vue"
import { useStore } from "vuex"
import { key } from "@/store"
import { Role } from "@/service/manage"
import { merchant } from "@/service/ecard"
import { ElMessageBox, ElMessage } from "element-plus"
import { useRouter } from "vue-router"
import { Search, Connection } from "@element-plus/icons-vue"
import TableTransfer from "./tableTransfer.vue"

export default defineComponent({
  components: {
    // SubDialog
    TableTransfer,
  },
  data() {
    return {
      color: "red",
      title: this.$route.meta.title,
      // profile: this.$store.state.userInfo,
      activeName: "first",
      value: "",
    }
  },
  setup() {
    const router = useRouter()
    const store = useStore(key)
    const { state } = store
    const formRef = ref()
    const deploymentType = store.state.deploymentType
    const table: any = reactive({
      userInfo: store.state.userInfo,
      currentPageCard: 1,
      totalCard: 0,
      pageSizeCard: 10,
      resourceCode: "",
      currentPageMa: 1,
      totalMa: 0,
      pageSizeMa: 10,
      mercacc: "",
      accountId: "",
      dialogTit: "",
      showMacc: false,
      groupName: "",
      groupId: null,
      cardNum: "",
      tableLoadingMa: true,
      tableLoadingCard: true,
      tableDataCard: [],
      tableDataMa: [],
      selMaData: [] as any[],
      maccValue: [] as any[],
      maccNeValue: [] as any[],
      macclength: "" as any,
      // mercaccDataKey:[''],
      mercaccData: [] as any[],
      maccInfo: {
        groupType: "", // 群组类型
        groupSelect: {
          isShow: true,
          data: [
            {
              id: "",
              name: "",
            },
          ],
        },
        roleName: "", // 角色名称
        isCard: "0", // 0商户 1卡通
        roleDesc: "", // 描述
      },
      switchItem: {},
      showBindPos: false,
      posTableData: [] as any[],
      posInfo: [] as any[],
      posAllData: [] as any[],
      formPos: {
        mercAcc: "",
        nodeId: "",
        posId: "",
      }
    })
    const handleClick = (tab: any) => {
      if (tab.props.name === "first") {
        table.maccInfo.isCard = "0"
        getAccountUserList()
        getMaData()
      } else if (tab.props.name === "second") {
        table.maccInfo.isCard = "1"
        getCardData()
      }
      // console.log('切换', table.maccInfo.isCard)
    }
    //一卡通
    const getCardData = async () => {
      const params = {
        current: table.currentPageCard,
        size: table.pageSizeCard,
        resourceCode: table.resourceCode,
        accountId: router.currentRoute.value.params.id,
        type: "2",
      }
      const res = await Role.getAccountUser(params)
      if (res && res.data && res.data.records) {
        table.tableLoadingCard = false
        const dataArr = res.data.records
        table.tableDataCard = dataArr
        table.totalCard = res.data.total
      } else {
        table.tableLoadingCard = false
        ElMessage({
          showClose: true,
          message: res.msg,
          type: "warning",
        })
      }
      // console.log('获取一卡通数据', params, table.tableDataCard)
    }
    const inquireCard = () => {
      getCardData()
      let _search = table.resourceCode.toLowerCase()
      let newListData: any = []
      if (_search) {
        table.tableDataCard.filter((item: any) => {
          if (item.resourceCode) {
            if (item.resourceCode.toLowerCase().indexOf(_search) !== -1) {
              newListData.push(item)
            }
          }
        })
      }
      table.tableDataCard = newListData
      table.totalCard = newListData.length
    }
    const handleSizeChangeCard = (val: number) => {
      table.pageSizeCard = val
      table.currentPageCard = 1
      getCardData()
    }
    const handleCurrentChangeCard = (val: number) => {
      table.currentPageCard = val
      getCardData()
    }
    const addHandleCard = () => {
      table.dialogTit = "一卡通绑定"
      table.showMacc = true
      table.maccInfo.isCard = "1"
      table.cardNum = ""
    }
    //商户
    const getMaData = async () => {
      // getAccountUserList()
      const params = {
        current: table.currentPageMa,
        size: table.pageSizeMa,
        resourceCode: table.mercacc,
        accountId: router.currentRoute.value.params.id,
        type: "1",
      }
      const res = await Role.getAccountUser(params)
      if (res && res.data && res.data.records) {
        table.tableLoadingMa = false
        const dataArr = res.data.records
        table.tableDataMa = dataArr
        table.totalMa = res.data.total
      } else {
        table.tableLoadingMa = false
        ElMessage({
          showClose: true,
          message: res.msg,
          type: "warning",
        })
      }
      listGroupByAccountId()
      console.log("已绑定的商户数据", res.data.records, table.tableDataMa)
    }
    const inquireMa = async () => {
      await getMaData()
      // const tableDataMaBB: any = table.tableDataMa
      let _search = table.mercacc.toLowerCase()
      let newListData: any = []
      if (_search) {
        table.tableDataMa.filter((item: any) => {
          if (item.resourceCode) {
            // console.log('resourceCode', item.resourceCode)
            if (item.resourceCode.toLowerCase().indexOf(_search) !== -1) {
              newListData.push(item)
            } else if (item.mercacc.code.toLowerCase().indexOf(_search) !== -1) {
              newListData.push(item)
            }
          }
        })
      } else {
        newListData = table.tableDataMa
      }
      table.tableDataMa = newListData
      table.totalMa = newListData.length
      console.log("模糊查询jiji", table.tableDataMa, newListData, _search)
    }
    const handleSizeChangeMa = (val: number) => {
      table.pageSizeMa = val
      table.currentPageMa = 1
      getMaData()
    }
    const handleCurrentChangeMa = (val: number) => {
      table.currentPageMa = val
      getMaData()
    }
    const addHandleMa = () => {
      table.dialogTit = "商户绑定"
      table.showMacc = true
      getAccountUserList()
      getGroups()
      getMercaccList()
      listGroupIdByAccountId()
      console.log('商户绑定', table.mercaccData, table.selMaData, table.maccValue);

    }
    //
    const getMaccNewData = (val: any) => {
      // table.maccNeValue = val
      const arr: any = []
      if (val) {
        val.forEach((element: any) => {
          if (element) {
            arr.push(element.key)
          }
        })
      }
      table.maccNeValue = arr
      console.log("传过来的值", val, table.maccNeValue)
    }

    //确认
    const confirm = () => {
      // getMaccNewData()
      if (table.maccInfo.isCard === "0") {
        if (table.maccInfo.groupType == "") {
          ElMessage.warning("请选择群组类型！")
        } else if (table.maccValue.length === 0) {
          ElMessage.warning("请选择商户！")
        } else {
          addAccountUser()
        }
      } else {
        if (table.cardNum == "") {
          ElMessage.warning("请输入一卡通号！")
        } else {
          addAccountUser()
        }
      }
    }
    //添加绑定
    const addAccountUser = async () => {
      const params = {
        accountId: table.accountId,
        groupId: table.maccInfo.groupType,
        resourceCode: table.maccInfo.isCard === "0" ? table.maccValue.join(",") : table.cardNum,
        // resourceCode: table.maccInfo.isCard === "0" ? table.maccNeValue.join(",") : table.cardNum,
        status: 1,
        type: table.maccInfo.isCard === "0" ? "1" : "2",
      }
      const { code, msg }: any = await Role.addAccountUser(params)
      if (code === 200) {
        table.showMacc = false
        if (table.maccInfo.isCard === "0") {
          getMaData()
        }
        if (table.maccInfo.isCard === "1") {
          getCardData()
        }
      } else {
        ElMessage.warning(msg)
      }
      // console.log('添加绑定', params.resourceCode)
    }
    //一卡通状态
    const beforeChange = () => {
      console.log("beforeChange", table.maccInfo.isCard)
      if (table.maccInfo.isCard === "0") {
        return new Promise((resove, reject) => {
          ElMessageBox.confirm("确定要切换该商户状态吗？", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
          })
            .then(() => {
              // resove(true)
              oChangeStatus()
            })
            .catch(() => {
              reject(false)
            })
        })
      }
      if (table.maccInfo.isCard === "1") {
        return new Promise((resove, reject) => {
          ElMessageBox.confirm("确定要切换该一卡通状态吗？", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
          })
            .then(() => {
              // resove(true)
              oChangeStatus()
            })
            .catch(() => {
              reject(false)
            })
        })
      }
    }
    // const changeStatus = (val: any, data: any) => {
    //     table.addRoleForm = data
    //     saveRoleData(val, "switch")
    // }
    const changeStatus = (data: any) => {
      table.switchItem = data
      console.log("changeStatus", data)
      // const val = data.status
      // if (val === 1) {
      //     reduction(val, data)
      // } else {
      //     removeRole(val, data)
      // }
      // table.addRoleForm = data
      // saveRoleData(val, "switch")
    }
    const oChangeStatus = () => {
      console.log("oChangeStatus", table.switchItem.status)
      const val = table.switchItem.status
      if (val === 0) {
        reduction(val, table.switchItem)
      } else {
        removeRole(val, table.switchItem)
      }
    }
    //禁用
    const removeRole = async (index: number, data: any) => {
      const id = data.id
      const params = {
        id: id,
      }
      const { code, msg }: any = await Role.deleteAccountUser(params)
      if (code === 200) {
        ElMessage.success("操作成功")
        if (table.maccInfo.isCard === "0") {
          getMaData()
        }
        if (table.maccInfo.isCard === "1") {
          getCardData()
        }
      } else {
        ElMessage.error(msg)
      }

      // ElMessageBox.confirm("确认禁用吗?", "提示", {
      //     confirmButtonText: "确定",
      //     cancelButtonText: "取消",
      //     type: "warning",
      // })
      //     .then(async () => {})
      //     .catch(() => {
      //         return
      //     })
    }
    //启用
    const reduction = async (index: number, data: any) => {
      const id = data.id
      const params = {
        id: id,
      }
      const { code, msg }: any = await Role.reductionAccountUser(params)
      if (code === 200) {
        ElMessage.success("操作成功")
        if (table.maccInfo.isCard === "0") {
          getMaData()
        }
        if (table.maccInfo.isCard === "1") {
          getCardData()
        }
      } else {
        ElMessage.error(msg)
      }
      // console.log('启用', data)
      // ElMessageBox.confirm("确认启用吗?", "提示", {
      //     confirmButtonText: "确定",
      //     cancelButtonText: "取消",
      //     type: "warning",
      // })
      //     .then(async () => {})
      //     .catch(() => {
      //         return
      //     })
    }
    //通过用户id查询群组
    const listGroupByAccountId = async () => {
      const params = {
        accountId: table.accountId,
        groupType: "mercacc",
        defaultGroup: 1,
      }
      const res = await Role.listGroupByAccountId(params)
      if (res && res.data) {
        if (res && res.data.length === 1) {
          table.groupName = res.data[0].name
          table.groupId = res.data[0].id
        }
      }
    }
    //获取商户已绑定的集合
    const getAccountUserList = async () => {
      await getMercaccList()
      const params: any = {
        // accountId: table.accountId,
        accountId: router.currentRoute.value.params.id,
        type: 1,
        status: 1,
      }
      const res = await merchant.getMerchantbBindList(params)
      if (res && res.data) {
        let temp = []
        const arr = []
        for (let i = 0, len = res.data.length; i < len; i++) {
          temp.push(res.data[i].mercacc.code)
          for (const item of table.mercaccData) {
            if (res.data[i].mercacc.code === item.key) {
              // res.data[i].label = item.label
              const obj: any = res.data[i]
              obj.label = item.label
              arr.push(obj)
            }
          }
        }
        table.selMaData = arr
        // table.tableDataMa= arr
        table.maccValue = temp
        table.macclength = temp.length
      }

      console.log("获取商户绑定集合信息", table.mercaccData, table.selMaData, table.maccValue)
    }
    //获取群组列表
    const getGroups = async () => {
      const params = {
        status: 1,
        type: "mercacc", // 群组类型【user：用户；mercacc：商户；visitor：游客】
        flag0: 1, // 默认群组0：非默认群组；1：默认群组
      }
      const res = await Role.getGroups(params)
      if (res && res.data) {
        if (res && res.data) {
          table.maccInfo.groupSelect.data = res.data
        }
      }
      // console.log('获取群组列表', res)
    }
    //全部商户
    const getMercaccList = async () => {
      const res = await Role.getMercaccList()
      if (res && res.data) {
        if (res && res.data) {
          const transferData = res.data
          const data: any = []
          transferData.forEach((val: any, index: any) => {
            data.push({
              label: `${val.name}(${val.code})`,
              key: String(val.code),
            })
          })
          table.mercaccData = data
          // console.log('全部商户', res.data, table.mercaccData)
        }
      }
    }
    //通过用户id查询编号集合(群组)
    const listGroupIdByAccountId = async () => {
      const params = {
        accountId: table.accountId,
        groupType: "mercacc",
        defaultGroup: 1, // 默认群组【0：非默认群组；1：默认群组】
      }
      const res = await Role.listGroupIdByAccountId(params)
      if (res && res.data) {
        console.log("通过用户id查询编号集合", res)
        if (res && res.data && res.data.length === 1) {
          table.maccInfo.groupType = res.data[0]
          // console.log("maccValue")
          // console.log(table.maccValue)
        }
      }
    }
    //自定义搜索方法
    const filterMethod = (query: any, item: any) => {
      // console.log('filterMethod', query, item)
      return item.label.indexOf(query) > -1
    }
    onMounted(() => {
      table.mercacc = ""
      // console.log("onMounted666",store.state )
      // getCardData()
      getAccountUserList()
      getMaData()
      // console.log(router.currentRoute.value.params.id)
      table.accountId = router.currentRoute.value.params.id as string
    })
    // pos
    const toGetPos = async (val: any) => {
      let id = val.mercacc.code
      table.formPos.mercAcc = id
      table.posInfo=[]
      const res = await merchant.getPosMerc(id)
      if (res.code === 200) {
        table.posAllData = res.data
      }
      const selectedItem = table.selMaData.find((item: any) => item.mercacc.code === id)
      const selectedItemData = selectedItem ? selectedItem.children : null;
      if (selectedItemData) {
        table.posTableData = selectedItemData.map((item: any) => {
          const [posId, nodeId] = item.resourceCode.split('-');
          return {
            ...item,
            nodeId,
            posId,
          };
        });
      } else {
        table.posTableData = table.posAllData
      }
      table.showBindPos = true
      // console.log('pos-----', id, table.selMaData, selectedItemData, table.posTableData);
    }

    const bindPos = async () => {
      if (table.posInfo.length > 0) {
        let childPos: any = []
        childPos = table.posAllData
          .filter((item: any) => table.posInfo.includes(item.posId))
          .map((item: any) => ({
            resourceCode: `${item.posId}-${item.nodeId}`,
            type: 3,
            status: 1,
            accountId: table.accountId,
            groupId: table.groupId,
          }));

        const params: any = table.selMaData.map((e: any) => {
          if (e.mercacc && e.mercacc.code === table.formPos.mercAcc) {
            const oldChild: any = ref([]);
            if (e.children) {
              oldChild.value = e.children.map((o: any) => ({
                id: o.id,
                accountId: o.accountId,
                status: o.status,
                type: o.type,
                resourceCode: o.resourceCode,
                groupId: table.groupId,
              }));
            }
            // 如果找到目标元素，则创建一个新对象进行修改
            return {
              id: e.id,
              accountId: e.accountId,
              type: e.type,
              status: e.status,
              resourceCode: e.mercacc.code,
              groupId: table.groupId,
              children: e.children ? [...oldChild.value, ...childPos] : childPos,
            };
          } else {
            return {
              id: e.id,
              accountId: e.accountId,
              type: e.type,
              status: e.status,
              resourceCode: e.mercacc.code,
              groupId: table.groupId,
              children: e.children
            };
          }
        });
        console.log("绑定pos", table.formPos.mercAcc, childPos, params)
        const { code, msg }: any = await merchant.merchantbBindPos(params)
        if (code === 200) {
          ElMessage.success("操作成功")
          table.showBindPos = false
          getAccountUserList()
        }
        else {
          ElMessage.error(msg)
        }
      } else {
        ElMessage.warning('请选择需要绑定的Pos号')
      }
    }
    const toRemovePos = async (e: any) => {
      console.log("解除pos", e, table.selMaData)
      ElMessageBox.confirm("是否确认解除该Pos(" + e.posId + "-" + e.nodeId + ") — 商户(" + table.formPos.mercAcc + ")的绑定关系？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          const formattedArr = ref([]);
          formattedArr.value = table.selMaData.map((item: any) => {
            // 判断是否存在 children，并且 children 中有目标元素
            if (!item.children && (item.mercacc.code === e.mercAcc)) {
              item.children = table.posTableData
            }
            if (item.children && item.children.some((child: any) => child.id === e.id
            )) {
              console.log('判断是否存在 children', item, e);
              return {
                // ...item,
                id: item.id,
                accountId: item.accountId,
                type: item.type,
                status: item.status,
                resourceCode: item.mercacc.code,
                groupId: table.groupId,
                children: item.children.filter((child: any) => child.id !== e.id
                ),
              };
            } else {
              // return item;
              return {
                id: item.id,
                accountId: item.accountId,
                type: item.type,
                status: item.status,
                resourceCode: item.mercacc.code,
                groupId: table.groupId,
                children: item.children
              };
            }
          });
          console.log("解除pos---2", formattedArr.value)
          const { code, msg }: any = await merchant.merchantbBindPos(formattedArr.value)
          if (code === 200) {
            ElMessage.success("操作成功")
            table.showBindPos = false
            getAccountUserList()
          }
          else {
            ElMessage.error(msg)
          }
        })
        .catch(() => {
          // TODO
        })
    }
    const refTable = toRefs(table)
    return {
      state,
      token: computed(() => state.token),
      token_type: computed(() => state.token_type),
      ...refTable,
      formRef,
      getCardData,
      handleClick,
      inquireCard,
      handleSizeChangeCard,
      handleCurrentChangeCard,
      addHandleCard,
      confirm,
      addAccountUser,
      removeRole,
      reduction,
      inquireMa,
      handleSizeChangeMa,
      handleCurrentChangeMa,
      addHandleMa,
      getAccountUserList,
      getGroups,
      getMercaccList,
      listGroupIdByAccountId,
      Search,
      Connection,
      filterMethod,
      changeStatus,
      getMaccNewData,
      beforeChange,
      oChangeStatus,
      toGetPos,
      bindPos,
      toRemovePos,
      deploymentType
    }
  },
})
</script>

<style>
.el-transfer {
  display: flex;
  justify-content: center;
}
.isSaas .el-tabs__header{
  
    display: none;
 
}
/* .text {
  color: v-bind (color);
}
.el-table .warning-row {
  background: oldlace;
}
.el-table .success-row {
  background: #f0f9eb;
}
.footerD {
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
}
.diafoot {
  text-align: right;
}
.el-transfer__buttons {
  display: inline-flex;
  align-items: center;
}
.el-transfer__buttons .el-button {
  display: inline-block;
}
.el-transfer {
  justify-content: left;
} */
</style>
