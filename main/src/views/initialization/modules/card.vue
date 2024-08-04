<script lang='ts' setup>
import { ref, reactive, computed, watch } from 'vue'
import OtherInput from './otherInput.vue'

const props = defineProps(['code', 'label', 'title', 'titleSub', 'data', 'confirm', 'children', 'cardIndex', 'animateClass', 'inited'])
const emits = defineEmits<{ (e: 'toCheck'): void, (e: 'test', v: any): void }>()

const classProp = (classname: string) => {
  return `mg-${classname}`
}

let formItemRefs: any = {}

const labelDict = {
  school: 'SCHOOL(钱包库)',
  ykt: 'YKT(身份库)',
  paymentplat: 'PAYMENTPLAT(支付平台2.0)',
}

const forRef = (e: any) => {
  if (e) formItemRefs[props.code] = e
  console.log(formItemRefs[props.code])
}

const toCheck = () => {
  emits('toCheck')
}

const test = (code: string, key?: string) => {
  emits('test', { code, key })
}

const rules = computed(() => {
  let obj: any = {}
  for (let key in props?.data) {
    obj[key] = [
      {
        required: true,
        message: '该字段不能为空',
        trigger: 'blur',
      }
    ]
  }
  return obj
})
</script>

<template lang='pug'>
#init-card
  //-  一级对象
  el-card.init-item(:class="classProp(animateClass)" v-show="code !== 'finish' && !!data" shadow="never")
    template(#header)
      .head
        .left
          h3.card-title {{ labelDict[title] || title }}
          span.card-title-sub {{ titleSub }}
        el-button(type="primary" @click="toCheck") 直接检测服务状态
    el-form(label-position="right" label-width="90px" )
      el-form-item(:label="key" v-for="(item, key, index) in data" :key="key")
        el-input(v-if="typeof item === 'string' || typeof item === 'number'" v-model.trim="data[key]")
        OtherInput(v-else :type="item.type" v-model="item.value" :key="key")
    .flex-center
      el-button(v-if="['tsmUrl','paymentplat', 'nacos', 'db', 'sios', 'es', 'redis', 'mq']?.includes(code)" type="primary" @click="test(code)") 测试
      div(v-else)
      .pn
        el-button(v-if="code !== 'nacos'" type="primary" @click="confirm('prev')") 上一步
        el-button(type="primary" @click="confirm(code)") 确定

  //-  存在children
  el-card.init-item(:class="classProp(animateClass)" v-for="(item, key, index) in children" :key="key" v-show="code !== 'finish' && !!children && cardIndex[code] == index"  shadow="never")
    template(#header)
      .head
        .left
          h3.card-title {{ labelDict[key] || key }}
          span.card-title-sub {{ titleSub }}
        el-button(type="primary" @click="toCheck") 直接检测服务状态
    el-form(label-position="right" label-width="90px")
      el-form-item(:label="key_" v-for="(item_, key_, index_) in item" :key="key" )
        el-input(v-if="typeof item_ === 'string' || typeof item_ === 'number'" v-model.trim="item[key_]")
        OtherInput(v-else v-model="item[key_].value" :type="item_.type" :key="key")
    .flex-center
      el-button(v-if="['es', 'redis', 'mq', 'tsmUrl', 'paymentplat']?.includes(key) || ['nacos', 'db', 'sios', 'third']?.includes(code)" type="primary" @click="test(code, key)") 测试
      div(v-else)
      .pn
        el-button(v-if="code !== 'nacos'" type="primary" @click="confirm('prev')") 上一步
        el-button(type="primary" @click="confirm(code)") 确定
</template>

<style lang='scss' scoped>
#init-card {
  width: 100%;
  display: flex;
  justify-content: center;

  :deep(.el-carousel) {
    width: 100%;
    height: 100%;
    // background-color: red;

    .el-carousel__container {
      height: 100% !important;
    }

    .el-carousel__item {
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
    }
  }

  .init-item {
    display: flex;
    flex-direction: column;
    max-width: 550px !important;
    width: 100%;
    margin: 1rem;
    box-shadow: 0px 20px 40px 0px rgba(16, 13, 128, 0.12);
  }

  .card-title {
    margin-bottom: 0.35rem;
    text-transform: uppercase;
  }

  .card-title-sub {
    opacity: 0.8;
    font-size: 14px;
  }

  .head {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .flex-center{
    justify-content: space-between;
  }
}
</style>