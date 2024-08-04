<template lang="pug">
el-form.form(label-width='100px', ref="formPay" :inline='false', :model="formPlat")
  el-alert(title='' type='warning' :closable='false')
    p.font-size-14  1.支付方式为非必填项，默认支持该应用所有的支付方式；
    p.font-size-14 2.若平台下有多个系统，且各个系统支付方式不一致，可使用“按子系统”模式，分别绑定支付方式。
  div.app-pay(v-for="(item, index) in formPlat.items", :key="index") 
    TableTitle(:title='item.name')
      span.title-info
        el-radio-group(v-model='item.bindType' style="transform:translateY(7px)", @change="changeBindType(index)")
          el-radio(label='platType') 按平台
          el-radio(label='system') 按子系统
    div.form
      template(v-if="item.bindType === 'platType'")
        el-form-item(label='支付方式：', :prop='"item." + index + ".pay"', label-width='120px',)
          el-select(v-model='item.pay' multiple placeholder='请选择' style='width:500px')
            el-option(v-for='item in payArr' :key='item.value.value' :label='`${item.value.label}`' :value='item.value.value')
          el-button(type='primary' link @click="showSort([index])" v-if="item.pay && item.pay?.length > 1 ").margin-left-x 设置顺序
      template(v-else-if="item.bindType === 'system'" )
        div.system-group(v-for="(sItem, i) in item.system" :key="i")
          p.text-right()
            el-icon.cursor-pointer(v-if="sItem.value !== 'Synjones-E-Campus'" :size="16")
              Delete.text-primary(@click="deleteSystem(sItem, i, index)")
            span(v-else).text-gray-6 默认
          el-form-item(label='系统名称：' :prop='"items." + index + ".system." + i + ".name"', :rules="rule")
            el-input(v-model='sItem.name', placeholder='请输入' style="width: 500px" :disabled="sItem.value === 'Synjones-E-Campus'")
          el-form-item(label='系统code：' :prop='"items." + index + ".system." + i + ".value"', :rules="rule")
            el-input(v-model='sItem.value', placeholder='请输入'  style="width: 500px" :disabled="sItem.value === 'Synjones-E-Campus'")
          el-form-item(label='支付方式：' :prop='"items." + index + ".system." + i + ".pay"', )
            el-select(v-model='sItem.pay' multiple placeholder='请选择'   style='width: 500px')
              el-option(v-for='item in payArr' :key='item.value.value' :label='`${item.value.label}`' :value='item.value.value')
            el-button(type='primary' link @click="showSort([index, i])" v-if="sItem.pay && sItem.pay?.length > 1").margin-left-x 设置顺序
        div.text-center
          span.btn.text-primary.cursor-pointer(@click="addSystem(item, index)")
            el-icon(:size="26" style="transform:translateY(6px);margin-right:2px;")
              CirclePlus() 
            span(style="line-height:30px;)") 添加子系统
  //- el-button(type='primary' plain :icon='Plus' @click="submit") text
  SelectPay(:data="sortPays" v-model="showSortDialog" @getSort="getSort")

</template>
<script lang="ts" setup>
import { ref, computed, reactive, watch, getCurrentInstance } from 'vue'
import { useStore } from 'vuex'
import { key } from '@/store/index'
import { useRouter } from 'vue-router'
import { Delete, DeleteFilled, Plus, CirclePlus } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { FormBoxItem, toc } from '../../../systemConfig/configComponents/index'
import TableTitle from '@/components/tableTitle.vue'
import SelectPay from '../selectPay.vue'
import { App } from '@/service/platform'
import _ from 'lodash'
const instance: any = getCurrentInstance()
const router = useRouter()
const store: any = useStore(key)
const { state } = store
const props = defineProps(['platTypeArr', 'payArr', 'platPayInfo'])
let platArr = ref(state.platTypeLevel.filter((o: any) => { return props.platTypeArr.includes(o.code) }))
let payArr = ref(props.payArr)
const showAddSystem = ref(false)
platArr.value = platArr.value.map((o: any) => {
  return { ...o, bindType: 'platType', system: [] }
})
let formPlat: any = ref({
  items: platArr.value
})
let historyPayInfo = ref(props.platPayInfo)
const rule = [
  {
    required: true,
    message: '必填项',
    trigger: 'blur',
  }
]
const changeBindType = (index: any) => {
  if (!formPlat.value.items[index].system || formPlat.value.items[index].system.length === 0) {
    formPlat.value.items[index].system = [
      {
        name: '移动服务平台',
        value: 'Synjones-E-Campus',
        pay: []
      }
    ]
  }
}
const addSystem = (data: any, index: number) => {
  formPlat.value.items[index].system.push({
    name: '',
    value: '',
    pay: []
  })
}
const deleteSystem = (data: any, index: number, indexPlat: number) => {
  ElMessageBox.confirm('确定删除吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(() => {
      formPlat.value.items[indexPlat].system.splice(index, 1)
    })
    .catch(() => {
      // TODO
    })
}
// 排序
const showSortDialog = ref(false)
const currentIndex: any = ref([])
const sortPays = ref([])
// 根据payid 获取 pay对象
const getSortPay = (pay: any) => {
  const arr: any = []
  pay.forEach((ele: any, index: number) => {
    const obj = payArr.value.find((o: any) => {
      return o.value.value === ele
    })
    arr.push(obj)
  })
  return arr
}
const showSort = (arr: any) => {
  sortPays.value = arr.length === 1 ? getSortPay(formPlat.value.items[arr[0]].pay) : getSortPay(formPlat.value.items[arr[0]].system[arr[1]].pay)
  currentIndex.value = arr
  showSortDialog.value = true
}
const getSort = (data: any) => {
  if (currentIndex.value.length === 1) {
    formPlat.value.items[currentIndex.value[0]].pay = data.map((o: any) => {
      return o.value.value
    })
  } else if (currentIndex.value.length === 2) {
    formPlat.value.items[currentIndex.value[0]].system[currentIndex.value[1]].pay = data.map((o: any) => {
      return o.value.value
    })
  }
}
const submit = async () => {
  return new Promise((resolve: any, reject: any) => {
    const formJsonRef: any = instance.refs.formPay
    formJsonRef.validate((valid: any) => {
      const platInfo: any = []
      if (valid) {
        formPlat.value.items.forEach((element: any) => {
          const obj: any = {
            platType: element.code,
          }
          if (element.bindType === 'platType') {
            obj.pay = element.pay.map((o: any, oi: number) => {
              return {
                id: o,
                sort: oi
              }
            })
          } else if (element.bindType === 'system') {
            obj.system = []
            element.system.forEach((o: any) => {
              obj.system.push({
                name: o.name,
                pay: o.pay.map((p: any, i: number) => {
                  return {
                    id: p,
                    sort: i
                  }
                }),
                value: o.value
              })
            })
          }
          platInfo.push(obj)
          return platInfo
        });
      }
      resolve({
        valid: valid,
        platInfo: platInfo
      })
    })
  })

}
const setHistory = () => {
  historyPayInfo.value.forEach((ele: any) => {
    const i = formPlat.value.items.findIndex((o: any) => {
      return o.code === ele.platType
    })
    if (ele.system && ele.system.length > 0) {
      formPlat.value.items[i].bindType = 'system'
      formPlat.value.items[i].system = ele.system.map((s: any) => {
        s.pay = _.sortBy(s.pay, obj => obj.sort)
        s.pay = s.pay.map((sp: any) => { return sp.id })
        return s
      })
    }
    if (ele.pay && ele.pay.length > 0) {
      ele.pay = _.sortBy(ele.pay, obj => obj.sort)
      formPlat.value.items[i].pay = ele.pay.map((p: any) => { return p.id })
    }
  })
}
watch(
  () => props.payArr,
  (newData, oldData) => {
    payArr.value = newData
  }
)
watch(
  () => props.platPayInfo,
  (newData, oldData) => {
    historyPayInfo.value = newData
    if(historyPayInfo.value) {
      setHistory()
    }
  }
)
defineExpose({
  submit
})
</script>
<style lang="scss">
.app-pay {
  border-bottom: 1px solid #f7f7f7;
  margin-bottom: 10px;

  #FormBoxItem {
    padding-bottom: 0;
    max-width: 100%;
  }

  .item-slot {
    display: none;
  }

  .form {
    margin-top: 20px;
    padding-bottom: 8px;
  }

  .form-box-sub {
    color: #999 !important;
  }

  .system-group {
    background-color: #f5f5f5;
    padding: 20px 20px 5px 20px;
    border-radius: 6px;
    margin-bottom: 10px;
  }

  .el-form-item__error {
    position: static;
    margin-left: 5px;
  }

  .cursor-pointer {
    cursor: pointer;
  }

  .title-info {
    font-weight: 500;
    font-size: 14px;
    color: #999;
  }
}
</style>