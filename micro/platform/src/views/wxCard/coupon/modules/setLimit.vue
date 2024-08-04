<template lang="pug">
.limit-com(v-if="showResult")
  el-form-item(label="所有人可见：")
    span {{ openLimit ? '是' : '否' }}
  el-form-item(v-if="groupListInfo", label="可见群组：")
    span {{ groupListInfo }}
  el-form-item(v-if="sno.length > 0", label="可见人员：")
    el-tag.margin-right(v-for="(item, index) in sno", :key="index", type="success", closable, effect="light") {{ item.name }}
      span.text-gray-6 （{{ item.sno }}）
.limit-com(v-else)
  el-form-item(label="所有人可见：")
    el-switch(v-model="openLimit", @change="changeOpenLimit")
    //- span(v-if='!openLimit', style='padding-left: 15px; font-size: 12px') （*已关闭所有人可见的权限，如需对部分人可见，可选择下方的“群组或学号”进行设置。）
  el-form-item(label="设置方式：", v-if="!openLimit")
    el-radio-group(v-model="limitsType")
      el-radio-button(label="group") 群组
      el-radio-button(label="sno") 学号
      el-radio-button(label="rule") 规则
  el-form-item.margin-bottom-0.select-width-s(v-if="limitsType === 'group' && !openLimit", label="可见群组：")
    el-select.m-2(v-model="groupValue", placeholder="请选择", @change="changeGroup", multiple)
      el-option(v-for="item in groupList", :key="item.id", :label="item.name", :value="item.id")
  el-form-item.margin-bottom-0(v-if="limitsType === 'sno' && !openLimit", label="可见人员：")
    div
      .margin-bottom-x 已选择：
        el-tag.margin-right(v-for="(item, index) in sno", :key="index", type="success", closable, effect="light", @close="closeTag(item)") {{ item.name }}
          span.text-gray-6 （{{ item.sno }}）
    el-form.bg-white-form(:inline="true" label-width="80px")
      el-form-item(label="用户名：")
        el-input(v-model="findPerson.account", placeholder="请输入登录名")
      el-form-item(label="学号：")
        el-input(v-model="findPerson.sno", placeholder="请输入学号")
      el-form-item(label="姓名：")
        el-input(v-model="findPerson.name", placeholder="请输入姓名")
      el-form-item(label="手机号：")
        el-input(v-model="findPerson.mobile", placeholder="请输入姓名")
      el-form-item(label="身份：")
        el-select.display-block(v-model="findPerson.identityCode", placeholder="请选择")
          el-option(v-for="item in identityList", :label="item.name", :value="item.code", :key="item.code")
      el-form-item
        el-button(:icon="Refresh" @click="toReset") 重置
        el-button(:icon="Search" type="primary", @click="toFilterPerson") 查询
    el-table(ref="multipleTableRef",:data="findPersonList", style="width: 100%",@select-all="handleSelecAll",  @select="handleSelect" row-key="id",)
      el-table-column(type="selection", width="55", :reserve-selection="true")
      el-table-column(property="sno", label="学号", width="120")
      el-table-column(property="name", label="姓名", width="120")
      el-table-column(property="account", label="用户名", width="120")
      el-table-column(property="avatar", label="照片")
        template(#default="scope") {{ scope.row.date }}
          el-avatar.avatar(:src="photoUrl + scope.row.avatar", :size="36")
    el-pagination(background, layout="total,prev, pager, next", :total="total", :page-size="findPerson.size", :current-page="findPerson.current", @current-change="handleCurrentChange")
  el-form-item.margin-bottom-0(v-if="limitsType === 'rule' && !openLimit", label="添加规则：")
    RuleForm(ref="ruleFormRef", :id="id" :ruleData="ruleData", :show="show")
</template>
<script lang="ts" setup>
import { reactive, toRefs, defineProps, ref, nextTick } from 'vue'
import { Aim, Search, Refresh } from '@element-plus/icons-vue'
import { userType } from '@/assets/scripts/state'
import { Role } from '@/service/manage'
import { Group, identityInfo } from '@/service/platform/index'
import { ElTable } from 'element-plus'
import RuleForm from './ruleForm.vue'
import { isEmpty } from 'lodash'

const props = defineProps(['id', 'showResult', 'value', 'show'])
const emits = defineEmits(['changeLimit', 'lastDataLimit'])
const id = ref(props.id)
const valueObj = ref(props.value)
console.log('333333333', props)
const openLimit = ref(true)
let limitsType = ref('')
const changeOpenLimit = (item: any) => {
  changeLimit()
}
// 人员
const photoUrl = ref('')
const findPersonList = ref([])
const sno: any = ref([])
const ruleFormRef = ref()
const findPerson: any = reactive({
  sno: '',
  name: '',
  account: '',
  selectLike: true,
  identityCode: '',
  mobile: '',
  current: 1,
  size: 3,
  status: 1,
})
const snoTag: any = ref([])
const total = ref(0)
const multipleTableRef = ref<InstanceType<typeof ElTable>>()
const toFilterPerson = async () => {
  const res = await Role.getUserList(findPerson)
  if (res.code === 200 && res.data && res.data.records) {
    total.value = res.data.total
    findPersonList.value = res.data.records
    await nextTick()
    if (sno.value.length > 0) {
      res.data.records.forEach((item: any) => {
        const index = sno.value.findIndex((o: any) => {
          return o.id === item.id
        })
        if (index !== -1) {
          multipleTableRef.value!.toggleRowSelection(item, true)
        } else {
          multipleTableRef.value!.toggleRowSelection(item, false)
        }
      })
    }
    console.log(1111, 'sno', sno.value)
  }
}
// 表格--分页
const handleCurrentChange = (val: number) => {
  findPerson.current = val
  toFilterPerson()
}
// 表格--选中某一行
const handleSelect = (val: any, row: any) => {
  const index = val.findIndex((o: any) => {
    return o.id === row.id
  })
  if (index !== -1) {
    // 选中
    sno.value.push(row)
  } else {
    // 取消选中
    const index = sno.value.findIndex((o: any) => {
      return o.id === row.id
    })
    sno.value.splice(index, 1)
  }
  changeLimit()
}
// 表格--全选
const handleSelecAll = (selection: any) => {
  // 判断为全选中/全部取消选中
  const obj = selection.find((o: any) => {
    return o.id === (findPersonList.value[0] as any).id
  })
  findPersonList.value.forEach((ele: any) => {
    const index = sno.value.findIndex((o: any) => {
      return o.id === ele.id
    })
    if (obj) {
      // 全选中， push当前页数据
      if (index === -1) {
        sno.value.push(ele)
      }
    } else {
      // 全取消选中， 删除当前页数据
      if (index !== -1) {
        sno.value.splice(index, 1)
      }
    }
  })
  changeLimit()
  console.log(333, '全部选中', obj)
}
const closeTag = async (item: any) => {
  const j = findPersonList.value.findIndex((o: any) => {
    return o.id === item.id
  })
  if (j !== -1) {
    multipleTableRef.value!.toggleRowSelection(findPersonList.value[j], false)
  }
  const i = sno.value.findIndex((o: any) => {
    return o.id === item.id
  })
  sno.value.splice(i, 1)
  changeLimit()
}
const getImgurl = async () => {
  const res1 = await Role.getForeignAddress()
  photoUrl.value = res1.data
}
getImgurl()
const toReset = () => {
  findPerson.sno = ''
  findPerson.name = ''
  findPerson.account = ''
  findPerson.mobile = ''
  findPerson.identityCode = ''
}
// 群组
const groupList = ref([])
const groupValue: any = ref([])
const getGroupList = async () => {
  const params: any = {
    current: 1,
    size: 100,
    descs: 'create_time',
    likeSelectName: true,
  }
  const res = await Group.getGroup(params)
  if (res.code === 200) {
    res.data.records.forEach((item: any) => {
      item.appValue = []
    })
    groupList.value = res.data.records
    if (id.value) {
      getLimitStatus()
    }
  }
}
getGroupList()
const changeGroup = (val: string) => {
  changeLimit()
}
const changeLimit = () => {
  emits('changeLimit', {
    openLimit: openLimit.value,
    type: limitsType.value,
    group:
      limitsType.value === 'group'
        ? groupList.value.filter((o: any) => {
            return groupValue.value.includes(o.id)
          })
        : [],
    groupValue: limitsType.value === 'group' ? groupValue.value : [],
    sno: limitsType.value === 'sno' ? sno.value : [],
    snoValue:
      limitsType.value === 'sno'
        ? sno.value.map((o: any) => {
            return o.sno
          })
        : [],
  })
}
// 部门
const identityList = ref([])
const getIdentityList = async () => {
  const { data: res, code, msg }: any = await identityInfo.getIdentityList()
  if (code === 200 && res) {
    identityList.value = res
  }
}
getIdentityList()
const groupListInfo = ref('')
// 历史数据
const getLimitStatus = async () => {
  const params = {
    type: 'wechatCard',
    resourceId: id.value,
  }
  const res = await Group.getExtendInfoSwitch(params)
  if (res.code === 200) {
    openLimit.value = res.data
    changeLimit()
    if (!res.data) {
      // false 关闭
      const resInfo = await Group.getListAfterConvertedExtendInfoWithDetail(
        params
      )
      if (resInfo.code === 200 && resInfo.data) {
        // limitsType.value = resInfo.data[0]?.sno.length > 0 ? "sno" : resInfo.data[0]?.group.length > 0 ? "group" : "";
        if (resInfo.data[0]?.group.length > 0) {
          limitsType.value = 'group'
          groupValue.value = resInfo.data[0].group.map((o: any) => {
            return Number(o)
          })
          let groupListInfoArr: any = groupList.value.filter((o: any) => {
            return groupValue.value.indexOf(o.id) !== -1
          })
          groupListInfoArr = groupListInfoArr.map((o: any) => {
            return o.name
          })
          groupListInfo.value = groupListInfoArr.join('，')
        }
        const snoArr: any = []
        if (resInfo.data[0]?.sno.length > 0) {
          limitsType.value = 'sno'
          sno.value = []
          resInfo.data[0].sno.forEach((o: any) => {
            const obj = {
              id: o.accountId,
              name: o.accountName,
              sno: o.accountSno,
            }
            sno.value.push(obj)
            snoArr.push(o.accountSno)
          })
        }
        if (
          resInfo.data[0]?.group.length === 0 &&
          resInfo.data[0]?.sno.length === 0
        ) {
          limitsType.value = 'rule'
        }
        emits('lastDataLimit', {
          openLimit: openLimit.value,
          type: limitsType.value,
          groupValue: groupValue.value,
          sno: snoArr,
        })
      }
    } else {
      // true 开启
      emits('lastDataLimit', { openLimit: openLimit.value })
    }
  }
}
// 初始值
if (valueObj.value) {
  console.log('valueObj.value------', valueObj.value)
  openLimit.value = valueObj.value.openLimit
  limitsType.value = valueObj.value.type
  groupValue.value = valueObj.value.groupValue
  sno.value = valueObj.value.sno
}

const ruleData = ref({})
const getExtendInfo = async () => {
  const params = {
    type: 'wechatCard',
    resourceId: props.id,
  }
  const {
    data: res,
    code,
    msg,
  }: any = await Group.getListAfterConvertedExtendInfo(params)
  if (code === 200 && !isEmpty(res?.[0])) {
    ruleData.value = res
  }
}
getExtendInfo()

defineExpose({
  ruleFormRef,
})
</script>
<style lang="scss">
.limit-com {
  .margin-right {
    margin-right: 10px;
  }
  .filter-person,
  .el-table th,
  .el-table td,
  .el-table__empty-block {
    background-color: var(--el-fill-color-light);
  }
  .bg-white-form {
    padding: 10px;
    background-color: var(--el-fill-color-light);
    .el-form-item {
      margin-bottom: 8px;
      width: 250px !important;
    }
  }
  .select-width-s .el-select {
    width: 300px;
  }

  .el-avatar {
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }
}
</style>
