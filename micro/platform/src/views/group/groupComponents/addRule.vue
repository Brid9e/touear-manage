<template lang='pug'>
el-dialog(title="规则" :width="450")
  el-form(label-width="80px")
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
  template(#footer)
    el-button(@click="emits('closed')") 取消
    el-button(type="primary" @click="confirm") 确定
</template>
<script lang='ts' setup>
import { onMounted, ref } from 'vue';
import { isEmpty } from 'lodash'
import { Group } from '@/service/platform';
import { ElMessage } from 'element-plus';
import departSelector from '@/components/departSelector.vue'

const props = defineProps(['id', 'identityList', 'departList', 'campusList', 'schcodeList'])

const emits = defineEmits<{ (e: 'closed'): void, (e: 'updateWhiteList'): void }>()

let form: any = ref({
  identity: [],
  campus: [],
  department: [],
})

const sexList = [{
  name: '男',
  code: '1'
},
{
  name: '女',
  code: '2'
}]

const confirm = async () => {
  const params = {
    type: "group",
    resourceId: props.id,
    resourceMap: {
      sex: form.value.sex || undefined,
      identity: form.value.identity || undefined,
      campus: form.value.campus || undefined,
      department: form.value.department || undefined,
      schoolCode: form.value.schoolCode || undefined
    }
  }
  const { data: res, code, msg }: any = await Group.deleteAndSaveExtendInfo(params, 'messageBox')
  if (code === 200) {
    ElMessage.success(msg)
    emits('closed')
    emits('updateWhiteList')
  }
}

const getExtendInfo = async () => {
  const params = {
    type: "group",
    resourceId: props.id
  }
  const { data: res, code, msg }: any = await Group.getListAfterConvertedExtendInfo(params)
  if (code === 200 && !isEmpty(res?.[0])) {
    form.value = { ...res?.[0] }
  }
}

onMounted(() => {
  getExtendInfo()
})

</script>
<style lang='scss' scoped>
.el-select, .el-select-v2 {
  width: 100%;
}
</style>