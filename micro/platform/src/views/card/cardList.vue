<!--
 * @Author: your name
 * @Date: 2022-01-06 13:32:10
 * @LastEditTime: 2022-05-18 15:55:18
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: /management/src/apps/platform/views/card/cardList.vue
-->
<template lang="pug">
#cardList
  HeadOperation
    el-input(:prefix-icon="Search" placeholder='通过卡样名称筛选', v-model='form.name', clearable, @keydown.enter="search")
    el-button(:icon="Search", type='primary', @click='search') 查询
    el-button(:icon="Refresh", @click='form.name = ""') 重置
    template(#right)
      el-button(type='primary', :icon='Plus', @click='toEdit(null)', :disabled="!state.funcButton.cardEditAdd") 添加
  //- el-form(ref="cardListRef", :label-width="100", :model='form', :rules="rules", hide-required-asterisk, inline)
    //- el-form-item(label='卡样名称', prop="name")

    el-form-item
      el-button(:icon="Search", type='primary', @click='search') 查询
  //- TableTitle(title="卡样列表")
    el-button(type='primary', :icon='Plus', @click='toEdit(null)') 添加
  el-table(:data='testData', v-loading='loading')
    //- el-table-column(label='卡片背景', align='center', width='80')
      template(#default='scope')
        el-popover(placement='right', trigger='hover', width='auto')
          img(:src='scope.row.remark ? scope.row.remark.bgImg : null', style='max-width: 500px')
          template(#reference)
            img(:src='scope.row.remark ? scope.row.remark.bgImg : null', style='max-width: 50px')
    el-table-column(prop='id', label='卡样ID')
    el-table-column(prop='name', label='卡样名称')
    el-table-column(prop='des', label='描述')
    el-table-column(label='操作', width='180')
      template(#default='scope')
        div.link-group
          el-button(type='primary', link, @click='userSettings(scope.row)', :disabled="!state.funcButton.cardEditUserSetting") 用户设置
          //- el-button(type='primary', plain, @click='getBindList(scope.row)') 绑定列表
          el-button(type="primary", link, @click='toEdit(scope.row)', :disabled="!state.funcButton.cardEditEdit") 编辑
          el-button(type='danger', link, @click='toRemove(scope.row.id)' :disabled="scope.row.id == '-1' || !state.funcButton.cardEditRemove") 删除
  .flex-center
    el-pagination(v-model:currentPage='current', :page-sizes='[10, 20, 30, 40]', :page-size='size', layout='total, sizes, prev, pager, next, jumper', :total='total', background, @size-change='handleSizeChange', @current-change='handleCurrentChange')

  el-dialog(v-model='showDialog', :width='800', @closed='closed', title='用户设置')
    el-form(ref="UserType" :label-width='80', inline, :model='formForSetting', :rules="rules", hide-required-asterisk)
      el-form-item(label='设置用户', prop="addType")
        el-select(v-model='addType', :loading="loadingSelect" loading-text="加载中" clearable @change='clearValue')
          el-option(v-for='item in options', :key='item.value', :label='item.label', :value='item.value')
      el-form-item(prop="select_value")
        departSelector.select-item(v-if="addType === 'department'", v-model="select_value", :disabled='!addType', @visible-change='getList' :multiple="true" clearable collapse-tags collapse-tags-tooltip filterable style="width: 189px")
        el-select.select-item(v-else v-model='select_value', :disabled='!addType', @visible-change='getList' :multiple="true" clearable collapse-tags collapse-tags-tooltip filterable)
          el-option(v-for='item in select_options', :key='item.id || item.code', :label='item.name', :value='item.id || item.code')
      el-form-item
        //- el-button(@click="showDialog = false") 取消
        el-button(type="primary" @click="submit(UserType)") 添加
      //- el-form-item(label="请选择")
      //- el-tab-pane(label="绑定列表"  name="second")
      el-table( :data="cardBindList" style="width: 100%" border)
        el-table-column(prop="type" label="类型" width="80" align="center")
          template(#default="scope")
            span(v-if="scope.row.type == 'identity'") 身份
            span(v-if="scope.row.type == 'department'") 部门
            span(v-if="scope.row.type == 'cardType'") 卡类型
        el-table-column(prop="val" label="已绑定")
          template(#default="scope")
            el-tag(effect="plain") {{ scope.row.valName }}
        el-table-column(label="操作")
          template(#default="scope")
            el-button(type="danger", text, @click="unbind(scope.row)") 解绑
    template(#footer)
      el-pagination(v-model:currentPage='currentList', :page-sizes='[10, 20, 30, 40]', :page-size='sizeList', layout='total, sizes, prev, pager, next, jumper', :total='totalList', @size-change='handleSizeChangeList', @current-change='handleCurrentChangeList')
      //- template(#footer)
        el-button(@click="showDialog = false") 取消
        el-button(type="primary" @click="submit") 确定
</template>
<script lang="ts">
import { defineComponent, ref, onMounted, reactive, computed, toRefs } from 'vue'
// import { useRouter } from 'vue-router'
import { Card, identityInfo } from '@/service/platform/index'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useStore } from 'vuex'
import { key } from '@/store'
import FilterContent from '@/components/filterContent/index.vue'
import TableTitle from '@/components/tableTitle.vue'
import HeadOperation from '@/components/headOperation.vue'
import { useRouter } from 'vue-router'
import { Search, Plus, Refresh } from '@element-plus/icons-vue'
import departSelector from '@/components/departSelector.vue'

export default defineComponent({
  components: {
    FilterContent,
    TableTitle,
    HeadOperation,
    departSelector
  },
  setup() {
    //
    onMounted(() => {
      getCardList()
    })
    const { state }: any = useStore(key)
    const router = useRouter()
    // const router = useRouter()
    const toEdit = (data?: any) => {
      if (!sessionStorage.cardObj) {
        sessionStorage.setItem('cardObj', '{}')
      }

      let index = ''
      let url = ''
      if (process.env.NODE_ENV === 'development') index = state.devHost.layoutEditor + '/layout-editor'
      else index = state.configs.base + '/layout-editor'

      if (data) url = `${index}/?token=${state.token}&type=card&id=${data.id}&name=${data.name}&des=${data.des}`
      else url = `${index}/?token=${state.token}&type=card`
      router.push({ name: 'layoutEditor', query: { url: encodeURI(url) } })

      // window.location.href = url
      // sessionStorage.cardObj = JSON.stringify(data)
      // router.push({ path: '/cardEdit/edit', query: { id: id } })
    }
    const current: any = ref(1)
    const size: any = ref(10)
    const total: any = ref(0)
    const currentList: any = ref(1)
    const sizeList: any = ref(10)
    const totalList: any = ref(0)
    const data: any = ref(null)
    const form: any = ref({})
    const loading: any = ref(false)
    const showDialog: any = ref(false)
    const activeName: any = ref('first')
    const UserType = ref()
    const radio: any = ref('1')
    const cardListRef = ref()
    // const addType: any = ref()
    // const select_value = ref()
    const formForSetting: any = reactive({
      addType: null,
      select_value: null
    })
    const { addType, select_value } = toRefs(formForSetting)
    const selectName_value = ref()
    const cardBindList = ref()
    const select_options: any = ref()
    const loadingSelect: any = ref(false)
    const cardId: any = ref()
    const optionCatch: any = reactive({
      // identity: {},
      // department: {},
      // cardType: {}
    })
    const cardBindCatch: any = reactive({})
    const options: any = reactive([
      {
        label: '身份',
        value: 'identity'
      },
      {
        label: '部门',
        value: 'department'
      },
      {
        label: '卡类型',
        value: 'cardType'
      }
    ])

    const rules = reactive({
      addType: [{ required: true, message: '请选择', trigger: 'blur' }],
      select_value: [{ required: true, message: '请选择', trigger: 'blur' }],
      name: [{ required: true, message: '请输入卡样名称', trigger: 'blur' }]
    })

    const search = async () => {
      getCardList('search', 'messageBox')
    }
    const handleSizeChange = (val: number) => {
      size.value = val
      getCardList()
    }
    const handleCurrentChange = (val: number) => {
      current.value = val
      getCardList()
    }
    const handleSizeChangeList = (val: number) => {
      sizeList.value = val
      getBindList(cardId.value)
    }
    const handleCurrentChangeList = (val: number) => {
      currentList.value = val
      getBindList(cardId.value)
    }
    const getCardList = async (type?: string, msgBox?:string) => {
      loading.value = true
      const params = {
        current: current.value,
        size: size.value,
        ...form.value
      }
      const { data: res, msg, code }: any = await Card.getCardList(params, msgBox)
      if (code === 200) {
        for (let val of res.records) {
          if (val.remark != null) {
            try {
              val.remark = JSON.parse(val.remark)
            } catch {
              //
            }
          }
        }
        total.value = res.total
        data.value = res.records
        loading.value = false
      } else {
        ElMessage.error(msg)
        loading.value = false
      }
    }

    const toRemove = async (id: any) => {
      ElMessageBox.confirm('您确定要删除该卡样吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const params = {
          id: id
        }
        const { code, msg }: any = await Card.removeCard(params, 'messageBox')
        if (code === 200) {
          ElMessage.success(msg)
          getCardList()
        }
      }).catch(() => {
        // TODO
      })


    }

    const userSettings = (item: any) => {
      cardId.value = item.id
      getBindList(cardId.value, true)
      showDialog.value = true
    }

    const getIdentity = async () => {
      // const params = {
      //   data: res
      // }
      const { data: res, code }: any = await identityInfo.getIdentityList()
      if (code === 200) {
        select_options.value = res
        optionCatch[addType.value] = res
      } else {
        // console.log(res)
      }
    }

    const getCardType = async () => {
      const { data: res, code }: any = await Card.getCardTypeList()
      if (code === 200) {
        select_options.value = res
        optionCatch[addType.value] = res
      } else {
        // console.log(res)
      }
    }

    // const getDepartmentList = async () => {
    //   const { data: res, code }: any = await identityInfo.getBasedepartmentList()
    //   if (code === 200) {
    //     select_options.value = res
    //     optionCatch[addType.value] = res
    //   } else {
    //     // console.log(res)
    //   }
    // }

    const getList = (show: boolean) => {
      if (show === true && addType.value === 'identity') {
        optionCatch[addType.value] ? (select_options.value = optionCatch[addType.value]) : getIdentity()
      } else if (show === true && addType.value === 'cardType') {
        optionCatch[addType.value] ? (select_options.value = optionCatch[addType.value]) : getCardType()
      }/*  else if (show === true && addType.value === 'department') {
        optionCatch[addType.value] ? (select_options.value = optionCatch[addType.value]) : getDepartmentList()
      } */
    }

    const submit = async (formEl: any) => {
      if (!formEl) return
      await formEl.validate(async (valid: any, fields: any) => {
        if (valid) {
          const valName = select_options.value.filter((r: any) => {
            for (let val of select_value.value) {
              if (r.code === val || r.id === val) return r.name
            }
          })
          const valNameArr: any = []
          for (let val of valName) valNameArr.push(val.name)
          if (valNameArr?.length < 1) {
            ElMessage.warning('请选择')
            return
          }
          const params = {
            cardBackgroundId: cardId.value,
            type: addType.value,
            val: String(select_value.value),
            valName: String(valNameArr)
            // select_options
          }
          const { data: res, msg, code }: any = await Card.bindCard(params, 'messageBox')
          if (code === 200 && res) {
            getBindList(cardId.value)
            ElMessage.success('添加成功')
          } else {
            ElMessage.error('添加失败')
          }
        } else {
          console.log('error submit!', fields)
        }
      })

      // }
    }

    const unbind = async (data: any) => {
      console.log(data)
      const params = {
        cardStyleBindDetail: {
          cardBackgroundId: data.cardBackgroundId
        },
        id: data.id
        // select_options
      }
      const { data: res, code, msg }: any = await Card.unBindCard(params, 'messageBox')
      if (code === 200) {
        //
        ElMessage.success(msg)
        totalList.value--
        const index = cardBindList.value.findIndex((r: any) => r.id === data.id)
        cardBindList.value.splice(index, 1)
      }
    }

    const getBindList = async (id: any, isNotAdd?: boolean) => {
      if (cardBindCatch[id] && isNotAdd) {
        cardBindList.value = cardBindCatch[id]
        return
      }
      const params = {
        current: currentList.value,
        size: sizeList.value,
        cardBackgroundId: id
      }
      const { data: res, msg, code }: any = await Card.getCardBindList(params)
      if (code === 200) {
        cardBindList.value = res.records
        cardBindCatch[id] = cardBindList.value
        totalList.value = res.total
        sizeList.value = res.size
        currentList.value = res.current
      } else {
        ElMessage.error(msg)
      }
    }

    const tabClick = (type: any) => {
      if (type.props.name === 'second') {
        getBindList(cardId.value)
      }
    }

    const clearValue = () => {
      select_value.value = null
      select_options.value = null
    }

    const closed = () => {
      console.log('closed')
      cardId.value = null
      select_value.value = null
      addType.value = null
      radio.value = '1'
      activeName.value = 'first'
      cardBindList.value = []
    }
    const cardName: any = ref()
    return {
      toEdit,
      cardName,
      testData: data,
      size,
      current,
      total,
      sizeList,
      currentList,
      totalList,
      handleSizeChange,
      handleCurrentChange,
      handleSizeChangeList,
      handleCurrentChangeList,
      toRemove,
      form,
      search,
      loading,
      userSettings,
      showDialog,
      closed,
      activeName,
      radio,
      addType,
      options,
      getList,
      select_value,
      select_options,
      loadingSelect,
      clearValue,
      submit,
      getBindList,
      tabClick,
      cardBindList,
      unbind,
      rules,
      formForSetting,
      UserType,
      cardListRef,
      Search,
      Plus,
      state,
      Refresh,
      tableHeight: computed(() => {
        return state.tableHeight
      })
    }
  }
})
</script>
<style lang="scss" scoped>
#cardList {
  .el-input {
    display: block;
    width: 100%;
  }

  .select-item {
    margin-left: 10px;
  }
}
</style>
