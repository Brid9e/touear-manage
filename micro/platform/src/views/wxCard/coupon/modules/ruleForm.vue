<template lang="pug">
el-form.bg-white-form(:inline="true" label-width="80px")
  el-form-item(label="性别")
    el-select(v-model='form.sex', placeholder='请选择性别', clearable, multiple, collapse-tags filterable collapse-tags-tooltip)
      el-option(v-for='item in sexList',:label='item.name',:value='item.code', :key='item + "type"')
  el-form-item(label="校区")
    el-select(v-model='form.campus', placeholder='请选择校区', clearable, multiple, collapse-tags filterable collapse-tags-tooltip)
      el-option(v-for='item in campusList',:label='item.name',:value='item.code', :key='item + "type"')
  el-form-item(label="身份")
    el-select(v-model='form.identity', placeholder='请选择身份', clearable, multiple, collapse-tags filterable collapse-tags-tooltip)
      el-option(v-for='item in identityList',:label='item.name',:value='item.code', :key='item + "type"')
  el-form-item(label="部门")
    departSelector(v-model='form.department', placeholder='请选择部门', clearable, multiple, collapse-tags filterable collapse-tags-tooltip)
  //- el-form-item(label="核算单位")
    el-select(v-model='form.schoolCode', placeholder='请选择核算单位', clearable, multiple, collapse-tags filterable collapse-tags-tooltip)
      el-option(v-for='item in schcodeList',:label='item.name',:value='item.schcode', :key='item + "schcode"')
LimitPage(ref="limitPageRef" :id="id" :show="show")
</template>
<script lang="ts" setup>
import { onMounted, ref, watch } from 'vue'
import { cloneDeep, isEmpty, isEqual } from 'lodash'
import { Group, identityInfo } from '@/service/platform'
import { ElMessage } from 'element-plus'
import { Info } from '@/service/multiMedia'
import LimitPage from './limitPage.vue'
import departSelector from '@/components/departSelector.vue'

const props = defineProps([
  'id',
  'identityList',
  'departList',
  'campusList',
  'schcodeList',
  'ruleData',
  'show'
])

let form: any = ref({
  identity: [],
  campus: [],
  department: [],
  schcodeList: []
})

const oForm = ref({})
const identityList: any = ref([])
const departList: any = ref([])
const campusList: any = ref([])
const schcodeList: any = ref([])
const limitPageRef = ref()

const sexList = [
  {
    name: '男',
    code: '1',
  },
  {
    name: '女',
    code: '2',
  },
]


// 提交规则
const confirm = async () => {
  // 数据没变不提交
  if (isEqual(form.value, oForm.value)) return
  const params = {
    type: 'wechatCard',
    resourceId: props.id,
    resourceMap: {
      sex: form.value.sex,
      identity: form.value.identity,
      campus: form.value.campus,
      department: form.value.department,
      schoolCode: form.value.schoolCode,
    },
  }
  const {
    data: res,
    code,
    msg,
  }: any = await Group.deleteAndSaveExtendInfo(params, 'messageBox')
  if (code === 200) {
    // ElMessage.success(msg)
  }
}

// const getExtendInfo = async () => {
//   const params = {
//     type: 'wechatCard',
//     resourceId: props.id,
//   }
//   const {
//     data: res,
//     code,
//     msg,
//   }: any = await Group.getListAfterConvertedExtendInfo(params)
//   if (code === 200 && !isEmpty(res?.[0])) {
//     form.value = { ...res?.[0] }
//     oForm.value = cloneDeep(res?.[0])
//   }
// }

const getIdentityList = async () => {
  const { data: res, code, msg }: any = await Info.getIdentityList()
  if (code === 200) {
    identityList.value = res
  }
}

const getCampusList = async () => {
  const { data: res, code, msg }: any = await Group.getCampusList()
  if (code === 200) {
    campusList.value = res
  }
}

const getSchcodeList = async () => {
  const { data: res, code, msg }: any = await identityInfo.getSchcodeList()
  if (code === 200) {
    schcodeList.value = res
  }
}

watch(() => props.ruleData, (res) => {
   form.value = { ...res?.[0] }
   oForm.value = cloneDeep(res?.[0])
}, {
  immediate: true
})

onMounted(() => {
  if(isEmpty(identityList.value)) getIdentityList()
  if(isEmpty(campusList.value)) getCampusList()
  // if(isEmpty(schcodeList.value)) getSchcodeList()
})


defineExpose({
  confirm,
  limitPageRef
})
</script>
