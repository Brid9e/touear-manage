<template lang='pug'>
div.wx-card-wrapper
  //- el-steps.step(:active='currentStep', align-center='')
  //-   el-step(v-for='(item, index) in stepList', :title='item.value', :key='item.index', :description='item.description')
  //-     template(#icon, v-if='index === 3 && currentStep === 4') 
  //-       el-svg-icon.small-icon-finished
  //-         Select
  //- .step-content(:style="`height: ${pageHeight - 260}px`")
  //-   div(v-if="currentStep === 0" style="height:100%")
  //-     div 第一步
  el-row(:gutter='0' align="middle" )
    el-col.text-center(:span='8' )
      p.text-center.text-gray-6.margin-bottom-2x 配置卡面图示
      el-image(:src="defaultAppIcon" :style="`width:350px;`" )
    el-col(:span='1')
      el-divider(direction="vertical", :style="`height: ${pageHeight - 200}px`")
    el-col(:span='15' )
      div(:style="`height:${pageHeight - 200}px;width:100%;overflow:auto`")
        el-form(label-width='180px'  ref="ruleFormRef", :model="form", :rules="rules", )
          TableTitle.title(title="基础信息")
          div
            el-form-item(prop="name" label="卡名称:")
              el-input(placeholder='请输入' v-model="form.name" )
            el-form-item(prop="baseInfoBean.quantity" label="库存:")
              el-input(placeholder='请输入' v-model="form.baseInfoBean.quantity")
              p.font-size-12.text-gray-6  卡券库存的数量，不支持填写0，上限为100000000
            el-form-item( label="单人领取上限:")
              el-input(placeholder='请输入' v-model="form.baseInfoBean.getLimit")
            el-form-item(prop="wxCardDateBean.type" label="有效期:")
              el-radio-group(v-model='form.wxCardDateBean.type')
                el-radio(:label='key' v-for="(item, key) in dateInfoList" :key="key") {{item}}
            el-form-item(label="时间范围:",  v-if="form.wxCardDateBean.type === 'DATE_TYPE_FIX_TIME_RANGE'")
              el-date-picker(v-model='timeRange' type='datetimerange' start-placeholder='开始时间' end-placeholder='结束时间' format='YYYY-MM-DD HH:mm:ss' date-format='YYYY/MM/DD ddd' time-format='A hh:mm:ss' @change="changeDate")
            el-form-item(label="时间期限:",  v-if="form.wxCardDateBean.type === 'DATE_TYPE_FIX_TERM'")
              el-row(:gutter='20' align="middle" )
                el-col.text-center(:span='12' )
                  el-input(placeholder='自领取后多少天内有效' v-model="form.wxCardDateBean.fixedBeginTerm")
                    template(#append='') 天
                el-col.text-center(:span='12' )
                  el-input(placeholder='自领取后多少天开始生效' v-model="form.wxCardDateBean.fixedTerm")
                    template(#append='') 天
              p.font-size-12.text-gray-6  领取后当天有效填写0
          TableTitle.title(title="配置卡面")
            template(#info)
              span.font-size-14.text-gray-6(style="font-weight:500") （参照左侧图示）
          div()
            el-form-item(prop="baseInfoBean.brandName")
              template(#label)
                el-badge(:value='1' type="success")
                span 商户名:
              el-input(placeholder='请输入' v-model="form.baseInfoBean.brandName" )
              p.font-size-12.text-gray-6  字数上限为12个汉字
            el-form-item(prop="baseInfoBean.title")
              template(#label)
                el-badge(:value='2' type="success")
                span 卡券名:
              el-input(placeholder='请输入' v-model="form.baseInfoBean.title")
              p.font-size-12.text-gray-6  字数上限为9个汉字
            el-form-item.bgc-item()
              template(#label)
                el-badge(:value='3' type="success")
                span 背景图:
              .bgc-box
                el-upload(action='#', :http-request='(data:any)=> uploadFile(data, bgcObj, "backgroundPicFile")' accept='image/gif,image/jpeg,image/jpg,image/png,image/svg')
                  img.bgc-img(v-if='bgcObj.imgSrc', :src='bgcObj.imgSrc', :onerror='defaultPicture')
                  p.tip(v-else) 请上传卡面背景图
                  el-icon.margin-left-x.cursor.text-primary(v-if="bgcObj.imgSrc" @click.stop="bgcObj.imgSrc = '', bgcObj.file = ''")
                    delete
                p.font-size-12.text-gray-6.describe 文件大小限制1MB，仅支持JPG、PNG格式， 像素大小控制在 1000像素*600像素以下。
                  a(href="https://mp.weixin.qq.com/cgi-bin/readtemplate?t=cardticket/card_cover_tmpl&type=info&lang=zh_CN" target="_blank") 会员卡设计规范
            el-form-item.bgc-item(prop="baseInfoBean.color")
              template(#label)
                el-badge(:value='3' type="success")
                span 背景色:
              div.choose-bg-color()
                el-radio-group(v-model='form.baseInfoBean.color')
                  el-radio(:label='key' v-for="(item, key) in colorList" :key="key")
                    div.color-block(:style="`background-color:${item}`") {{item}}
            el-form-item.bgc-item(prop="baseInfoBean.logoFile")
              template(#label)
                el-badge(:value='4' type="success")
                span LOGO:
              .bgc-box.logo-box
                el-upload(action='#', :http-request='(data:any)=> uploadFile(data, logoObj, "baseInfoBean.logoFile")', accept='image/gif,image/jpeg,image/jpg,image/png,image/svg')
                  img.bgc-img(v-if='logoObj.imgSrc', :src='logoObj.imgSrc', :onerror='defaultPicture')
                  p.tip(v-else) 请上传LOGO
                  el-icon.margin-left-x.cursor.text-primary(v-if="logoObj.imgSrc" @click.stop="logoObj.imgSrc = '', logoObj.file = ''")
                    delete
                p.font-size-12.text-gray-6 *建议像素为300*300。
            el-form-item()
              template(#label)
                el-badge(:value='5' type="success")
                span 会员信息类目:
              div(style="width:100%")
                el-checkbox-group(v-model="codeArr" :max='3')
                  el-checkbox(v-for='(o, key) in codeList' :key='key' :label='key') {{o}}
                  el-checkbox(v-for='(c, key) in 3' :key='key' :label='`customField${key + 1}`') 自定义{{key + 1}}
                p.font-size-12.text-gray-6 最多可添加三个
                el-divider(border-style='dashed' style="margin:5px 0" v-if="codeArr.includes('customField1') || codeArr.includes('customField2') ||codeArr.includes('customField3')")
                .input-group.input-group-trends.border-top(v-if="codeArr.includes('customField1')")
                  el-row(:gutter='0' align="middle" )
                    el-col.text-center(:span='4') 自定义1
                    el-col.text-center(:span='20')
                      el-input(placeholder='请输入custom_field1' v-model="customFieldList.customField1.title")
                        template(#prepend='') 名称
                      el-input(placeholder='请输入' v-model="customFieldList.customField1.url")
                        template(#prepend='') 地址
                .input-group.input-group-trends(v-if="codeArr.includes('customField2')")
                  el-row(:gutter='0' align="middle" )
                    el-col.text-center(:span='4') 自定义2
                    el-col.text-center(:span='20')
                      el-input(placeholder='请输入custom_field1' v-model="customFieldList.customField2.title")
                        template(#prepend='') 名称
                      el-input(placeholder='请输入' v-model="customFieldList.customField2.url")
                        template(#prepend='') 地址
                .input-group.input-group-trends(v-if="codeArr.includes('customField3')")
                  el-row(:gutter='0' align="middle" )
                    el-col.text-center(:span='4') 自定义3
                    el-col.text-center(:span='20')
                      el-input(placeholder='请输入custom_field1' v-model="customFieldList.customField3.title")
                        template(#prepend='') 名称
                      el-input(placeholder='请输入' v-model="customFieldList.customField3.url")
                        template(#prepend='') 地址
            el-form-item()
              template(#label)
                el-badge(:value='6' type="success")
                span 中部居中按钮:
              .input-group
                el-input(placeholder='请输入' v-model="form.baseInfoBean.center.title")
                  template(#prepend='') 名称
                el-input(placeholder='请输入' v-model="form.baseInfoBean.center.url")
                  template(#prepend='') 地址
                el-input(placeholder='请输入' v-model="form.baseInfoBean.center.subTitle")
                  template(#prepend='') 提示
            el-form-item()
              template(#label)
                el-badge(:value='7' type="success")
                span 自定义跳转外链:
              .input-group.margin-bottom-x
                el-input(placeholder='请输入' v-model="form.baseInfoBean.custom.title")
                  template(#prepend='') 名称
                el-input(placeholder='请输入' v-model="form.baseInfoBean.custom.subTitle")
                  template(#prepend='') 提示
                el-input(placeholder='请输入' v-model="form.baseInfoBean.custom.url")
                  template(#prepend='') 地址
            el-form-item()
              template(#label)
                el-badge(:value='8' type="success")
                span 自定义菜单:
              .input-group.input-group-trends(v-for="(item, i) in customCellList" :key="i")
                el-input(placeholder='请输入' v-model="item.title")
                  template(#prepend='') 名称
                el-input(placeholder='请输入' v-model="item.subTitle")
                  template(#prepend='') 提示
                el-input(placeholder='请输入' v-model="item.url")
                  template(#prepend='') 地址
                el-icon.btn-delete.cursor(v-if="customCellList.length >1" color="#999" @click="deleteCustom(i, customCellList)")
                  Close 
              p.text-center(style="width:100%" v-if="customCellList.length <3")
                el-icon.text-primary(:size="20"  @click="addCustom(customCellList)", style="transform:translateY(4px);cursor:pointer;margin-right:3px;")
                  CirclePlus
                span.font-size-12.text-gray-6(style="margin-right:3px;") (最多可添加三个，激活后显示)
            el-form-item()
              template(#label)
                el-badge(:value='9' type="success")
                span 自定义营销场景:
              .input-group.margin-bottom-x
                el-input(placeholder='请输入' v-model="form.baseInfoBean.promotion.title")
                  template(#prepend='') 名称
                el-input(placeholder='请输入' v-model="form.baseInfoBean.promotion.url")
                  template(#prepend='') 地址
                el-input(placeholder='请输入' v-model="form.baseInfoBean.promotion.subTitle")
                  template(#prepend='') 提示
            el-form-item(prop="prerogative" )
              template(#label)
                el-badge(:value='10' type="success")
                span 卡详情-特权说明:
              el-input(placeholder='请输入' v-model="form.prerogative" type="textarea", :rows="2", :maxlength="1024",clearable, show-word-limit)
              p.font-size-12.text-gray-6 会员卡详情页面：特权说明,限制1024个汉字，图示
                el-popover(placement='top-start' title='图示' :width='350' trigger='hover')
                  el-image(style='width: 350px;height:500px;' :src='prerogativeImg' fit='contain')
                  template(#reference='')
                    el-icon(:size="16" style="transform:translate(3px, 3px)")
                      warning
            el-form-item(prop="baseInfoBean.description" )
              template(#label)
                el-badge(:value='10' type="success")
                span 卡详情-使用说明:
              el-input(placeholder='请输入' v-model="form.baseInfoBean.description" type="textarea", :rows="2", :maxlength="1024",clearable, show-word-limit)
              p.font-size-12.text-gray-6 会员卡详情页面：使用说明，字数上限为1024个汉字，图示
                el-popover(placement='top-start' title='图示' :width='350' trigger='hover')
                  el-image(style='width: 350px;height:500px;' :src='descriptionImg' fit='contain')
                  template(#reference='')
                    el-icon(:size="16" style="transform:translate(3px, 3px)")
                      warning
          //- TableTitle.title(title="卡详情")
          //- div
          //-   el-form-item(prop="prerogative" label="特权说明:")
          //-     el-input(placeholder='请输入' v-model="form.prerogative" type="textarea", :rows="2", :maxlength="1024",clearable, show-word-limit)
          //-     p.font-size-12.text-gray-6 会员卡特权说明,限制1024个汉字，图示
          //-       el-popover(placement='top-start' title='图示' :width='350' trigger='hover')
          //-         el-image(style='width: 350px;height:500px;' :src='prerogativeImg' fit='contain')
          //-         template(#reference='')
          //-           el-icon(:size="16" style="transform:translate(3px, 3px)")
          //-             warning
          //-   el-form-item(prop="baseInfoBean.description" label="使用说明:")
          //-     el-input(placeholder='请输入' v-model="form.baseInfoBean.description" type="textarea", :rows="2", :maxlength="1024",clearable, show-word-limit)
          //-     p.font-size-12.text-gray-6 卡券使用说明，字数上限为1024个汉字，图示
          //-       el-popover(placement='top-start' title='图示' :width='350' trigger='hover')
          //-         el-image(style='width: 350px;height:500px;' :src='descriptionImg' fit='contain')
          //-         template(#reference='')
          //-           el-icon(:size="16" style="transform:translate(3px, 3px)")
          //-             warning
      div.text-center
        //- el-button( plain, size='large', v-if='currentStep !== 0', @click='preStep') 上一步
        //- el-button(type='primary', size='large', v-if='currentStep < stepList.length - 1', @click='nextStep')  下一步
        //- el-button(type='primary', size='large', v-if='currentStep === stepList.length - 1', @click="submit(ruleFormRef)")  提交
        el-button(type='primary', size='large',  @click="submit(ruleFormRef)" :loading="confirmLoading")  提交
</template>
<script lang='ts' setup>
import { defineComponent, reactive, toRefs, ref, computed, watch, inject, getCurrentInstance, defineProps } from "vue";
import TableTitle from '@/components/tableTitle.vue'
import { Close, Plus, CirclePlus, CircleClose, Delete, Warning } from '@element-plus/icons-vue'
import { WxCard } from "@/service/platform/index";
import type { FormInstance, FormRules} from 'element-plus'
import { ElMessage, ElMessageBox } from 'element-plus'
const defaultAppIcon = new URL('../../assets/images/wxDemo.jpg', import.meta.url).href
const prerogativeImg = new URL('../../assets/images/prerogative.jpg', import.meta.url).href
const descriptionImg = new URL('../../assets/images/description.jpg', import.meta.url).href

const pageHeight = window.innerHeight
let currentStep = ref(0) //当前步骤
const confirmLoading = ref(false)
// 添加步骤
let stepList = ref([
  {
    name: 'base',
    value: '填写卡信息',
    // description: '自有应用'
  },
  {
    name: 'cardInfo',
    value: '配置卡面',
    // description: '自有应用'
  },
])
const nextStep = () => {
  currentStep.value++
}
const preStep = () => {
  currentStep.value--
}
/* background img */
const bgcObj:any = reactive({
  imgSrc: '',
  file: ''
})
/* background logo */
const logoObj:any = reactive({
  imgSrc: '',
  file: ''
})
const uploadFile = async (data: any, obj:any, path:string) => {
  obj.file = data.file
  obj.imgSrc = URL.createObjectURL(data.file)
  form[path] = data.file
}
// 菜单动态添加删除
const addCustom = (data:any) => {
  data.push({})
}
const deleteCustom = (i:number, data:any) => {
  data.splice(i, 1)
}
// 获取背景色
const colorList = ref([])
const toGetBgColor = async () => {
  const { data } = await WxCard.getBgColor()
  colorList.value = data
}
toGetBgColor()
// 获取有效期
const dateInfoList = ref([])
const toGetDateInfo = async () => {
  const { data } = await WxCard.getDateType()
  dateInfoList.value = data
}
toGetDateInfo()
// 日期范围
const timeRange = ref([])
const changeDate = (val:any) => {
  const s:any = new Date(val[0])
  const e:any = new Date(val[1])
  form.wxCardDateBean.beginTimestamp = Date.parse(s) / 1000
  form.wxCardDateBean.endTimestamp = Date.parse(e) / 1000
}
// 会员信息类目
const codeList = ref([])
const codeArr = ref([])
const getCodeValue = async () => {
  const res = await WxCard.codeValue()
  if (res.code === 200 && res.success && res.data) {
    codeList.value = res.data
  }
}
getCodeValue()
// form
const customFieldList:any = reactive({
  customField1: {},
  customField2: {},
  customField3: {}
})
const customCellList = ref([{}])
const form:any = reactive({
  name: '',
  backgroundPicFile: null, // 背景图
  baseInfoBean: {
    logoFile: logoObj.file, // logo
    brandName: '', // 商户名
    title: '',  // 卡券名
    color: '', // 背景色
    center: { // 中部按钮
      title: '', // 名称
      subTitle: '', //  入口下方的提示语 
      url: '' // 顶部居中的url 
    },
    custom: {
      title: '',
      url: '',
      subTitle: ''
    },
    promotion: {
      title: '',
      url: '',
      subTitle: ''
    },
    description: '', // 描述
    getLimit: '', // 单人领取上限
    quantity: '', // 库存
    notice: '卡券使用提醒' // 添加成功后未体现到页面上，应该用不到这个参数，暂时数据中写死
  },
  wxCardDateBean: {
    type: 'DATE_TYPE_PERMANENT', // 永久有效
    beginTimestamp: '', // type为DATE_TYPE_FIX_TIME_RANGE时专用， 表示起用时间。从1970年1月1日00:00:00至起用时间的秒数 （ 东八区时间,UTC+8，单位为秒 ）。
    endTimestamp: '', // type为DATE_TYPE_FIX_TERM_RANGE时专用，表示结束时间 （ 东八区时间,UTC+8，单位为秒 ）
    fixedBeginTerm: '', // type为DATE_TYPE_FIX_TERM时专用，表示自领取后多少天内有效，领取后当天有效填写0（单位为天）
    fixedTerm: '' // type为DATE_TYPE_FIX_TERM时专用，表示自领取后多少天开始生效。（单位为天）
  },
  activateUrl: '123',
  prerogative: '' // 特权说明
})
const rules = reactive({
  'name': [
    { required: true, message: '请输入', trigger: 'blur' },
    { min: 1, max: 12, message: '长度不能超过12个字符', trigger: 'blur' },
  ],
  'baseInfoBean.quantity': [
    { required: true, message: '请输入', trigger: 'blur' },
    { min: 0, max: 100000000, message: '长度不能超过12个字符', trigger: 'blur' },
  ],
  'wxCardDateBean.type': [
    { required: true, message: '请输入', trigger: 'blur' }
  ],
  'baseInfoBean.brandName': [
    { required: true, message: '请输入', trigger: 'blur' },
    { min: 1, max: 12, message: '长度不能超过12个字符', trigger: 'blur' },
  ],
  'baseInfoBean.title': [
    { required: true, message: '请输入', trigger: 'blur' },
    { min: 1, max: 9, message: '长度不能超过9个字符', trigger: 'blur' },
  ],
  'baseInfoBean.color': [
    { required: true, message: '请选择', trigger: 'blur' },
  ],
  'baseInfoBean.logoFile': [
    { required: true, message: '请上传', trigger: 'blur' },
  ],
  'baseInfoBean.description': [
    { required: true, message: '请输入', trigger: 'blur' },
    { min: 1, max: 1024, message: '长度不能超过1024个字符', trigger: 'blur' },
  ],
  'prerogative': [
    { required: true, message: '请输入', trigger: 'blur' },
    { min: 1, max: 1024, message: '长度不能超过1024个字符', trigger: 'blur' },
  ]
})
const ruleFormRef = ref<FormInstance>()
const submit = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  let resValid = false
  await formEl.validate((valid, fields) => {
    resValid = valid
  })
  if (!resValid) {
    ElMessage({
      showClose: true,
      message: '请填写完整',
      type: 'error'
    })
    return
  }
  confirmLoading.value = true
  if (bgcObj.file) {
    form.backgroundPicFile = bgcObj.file
  }
  form.baseInfoBean.logoFile = logoObj.file
  const codeKeys = Object.keys(codeList.value)
  codeArr.value.forEach((ele:any, index:number) => {
    if (codeKeys.includes(ele)) {
      form[`customField${index + 1}Bean`] = {code: ele}
    } else {
      form[`customField${index + 1}Bean`] = customFieldList[ele]
    }
  });
  customCellList.value.forEach((ele:any, index:number) => {
    if (ele && Object.keys(ele).length > 0) {
      form[`customCell${index + 1}Bean`] = ele
    }
  })
  const form_data = new FormData()
  makeFormData(form, form_data)
  // obj 转 FormData
  function makeFormData(obj:any, form_data?:any) {
    var data = [];
    if (obj instanceof File) {
      data.push({
        key: "",
        value: obj
      });
    } else if (obj instanceof Array) {
      for (let j:number = 0, len = obj.length; j < len; j++) {
        let arr:any = makeFormData(obj[j]);
        for (var k = 0, l = arr.length; k < l; k++) {
          var key:any = !!form_data ? j + arr[k].key : "[" + j + "]" + arr[k].key;
          data.push({
            key: key,
            value: arr[k].value
          })
        }
      }
    } else if (typeof obj == 'object') {
      for (let j in obj) {
        let arr:any = makeFormData(obj[j]);
        for (var k = 0, l = arr.length; k < l; k++) {
          var key:any = !!form_data ? j + arr[k].key : "." + j + arr[k].key;
          data.push({
            key: key,
            value: arr[k].value
          })
        }
      }
    } else {
      data.push({
        key: "",
        value: obj
      });
    }
    if (!!form_data) {
      // 封装
      for (var i = 0, len = data.length; i < len; i++) {
        form_data.append(data[i].key, data[i].value)
      }
    } else {
      return data;
    }
  }
  const res = await WxCard.wxCardSave(form_data)
  if (res.code === 200 && res.success) {
    ElMessage({
      message: '创建成功',
      type: 'success'
    })
  }
  confirmLoading.value = false
}
</script>

<style lang='scss'>
.wx-card-wrapper{
  .cursor{
    cursor:pointer;
  }
  .title{
    margin-bottom:20px!important;
  }
  .el-form-item__label{
    position:relative;
  }
  .el-badge{
    position:absolute;
    top:2px;
    left:0;
  }
  .el-badge__content{
    transform:translateY(5px);
    margin-right:3px;
    background-color:#24BA6B;
  }
  .bgc-item {
    .bgc-box {
      .bgc-img {
        width:330px;
        height: calc(330px * 600 / 1000);
        border-radius:10px;
      }
      .tip {
        width:330px;
        height: calc(330px * 600 / 1000);
        border-radius:10px;
        background-color: rgb(247, 247, 247);
        font-size: 30px;
        text-align: center;
        line-height: calc(330px * 600 / 1000);
        color: rgb(209, 209, 209);
        transform: translateY(0);
      }
    }
    .logo-box{
      .bgc-img{
        width:90px;
        height:90px;
      }
      .tip{
        width:90px;
        height:90px;
        font-size:12px;
        line-height: 90px;
      }
    }
    .el-upload-list {
      display: none;
    }
    .el-dialog__body {
      padding-top: 15px;
    }
    .el-upload{
      align-items:flex-end;
    }
  }
  .el-form{
    width:650px!important;
    padding-right:100px;
    margin:0 auto;
  }
  .el-form-item {
    .input-group{
      margin-bottom:12px;
      &:last-of-type{
        margin-bottom:0
      }
    }
  }
  .input-group{
    position: relative;
    box-sizing:border-box;
    // padding-right:25px;
    width:100%;
    .el-input{
      margin-bottom:3px;
    }
  }
  .input-group-trends{
    // padding-right:30px;
    .btn-delete{
      position: absolute;
      right:-23px;
      top:50%;
      transform: translateY(-50%);
    }
  }
  .choose-bg-color{
    .el-radio{
      margin-bottom:5px;
      margin-right:10px;
    }
    .color-block{
      width:58px;
      text-align:center;
      font-size:12px;
      color:#fff;
    }
  }
  .describe{
    line-height:20px;
  }
}
</style>