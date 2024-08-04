<template lang="pug">
#physicalCard
  HeadOperation
    el-input(:prefix-icon="Search" placeholder='通过卡样名称筛选', v-model='form.name', clearable, @keydown.enter="search")
    el-button(:icon="Search", type='primary', @click='search') 查询
    el-button(:icon="Refresh", @click='form.name = ""') 重置
    template(#right)
      el-button(type='primary', :icon='Plus', @click='addCard', :disabled="!state.funcButton.physicalCardUpload") 添加
  el-table(:data='cardDate.phyCardData', ref="phyCardRef", v-loading="loading", @cell-click="celledit")
    el-table-column(prop='id',label='编号')
    el-table-column(prop='imageUrl', align='center',label='卡样图片')
      template(#default="scope")
        el-image(v-if='scope.row.imageUrl' fit="cover" :src='scope.row.imageUrl',@click='handlePictureCardPreview(scope.$index, scope.row)' style="height: 40px")
          template(#error)
            .image-slot
              el-icon(:size="20")
                Picture
          template(#placeholder)
            .image-slot  Loading...
        span.noimage(v-else)
          el-empty(description="暂无图片")
    el-table-column(prop='name',label='卡样名称')
    //- el-table-column(prop='flag',label='是否默认')
      template(#default="scope")
        span(v-if="scope.row.flag === '1'" type="primary") 默认
        span(v-if="scope.row.flag === '0'" type="info") 非默认
    el-table-column(prop='type',label='卡样类型')
      template(#default='scope')
        span(v-if="scope.row.type === '0'") 正面
        span(v-if="scope.row.type === '1'") 背面
    el-table-column(prop='identity',label='身份')
      template(#default='scope')
        span.dot-list(v-for='(item, index) in getIdentityArr(scope.row.identity)', :key='index') {{ item.name }}
    el-table-column(prop='describe',label='描述')
    el-table-column(label='操作' width="200")
      template(#default='scope')
        el-button(type='primary', link, @click='handlePictureCardPreview(scope.$index, scope.row)') 查看
        el-button(:disabled="!state.funcButton.physicalCardEdit", type='primary', link, @click='editCard(scope.$index, scope.row)') 编辑
        el-button(:disabled="!state.funcButton.physicalCardRemove",type='danger', link, @click='handleRemove(scope.$index, scope.row)') 删除
        MoreHandle
          el-button(:disabled="!state.funcButton.physicalCardEdit", type='primary', link, @click='toEdit(scope.row)') 设计卡样
  .flex-center
    el-pagination(
      @size-change='handleSizeChange'
      @current-change='handleCurrentChange'
      :current-page='pageInfo.current'
      :page-sizes='[5,10, 30, 50, 100]'
      :page-size='pageInfo.size'
      layout="total, sizes, prev, pager, next, jumper"
      background
      :total='pageInfo.total')

  el-drawer(v-model='dialogVisible' size="40%" :title="currentData?.name")
    el-descriptions(title="基本信息" :column="2")
      el-descriptions-item(label="ID") {{ currentData.id }}
      el-descriptions-item(label="卡样名称") {{ currentData.name }}
      el-descriptions-item(label="是否默认") {{ currentData.flag === '1'? '默认' : '非默认'}}
      el-descriptions-item(label="卡样类型") {{ currentData.type === '1'? '背面' : '正面'}}
      el-descriptions-item(label="描述") {{ currentData.describe }}
    el-descriptions(title="卡样图" style="margin-top: 20px")
      el-descriptions-item
        el-image(:src='currentData?.imageUrl')

  el-dialog(v-model='showAdd', :width='600', @closed='closed', :title='dialogTit')
    el-alert(title="提示：上传的图片必须是JPG、JPEG、PNG、SVG、GIF格式! 图片大小不能超过2MB!" type="info" show-icon :closable="false")
    el-form(:model='addCardForm' :rules="addCardFormRules" ref="addCardFormRef" label-width="100px" label-position="right",autocomplete="off")
      //- el-form-item(label="卡样文件名" prop='id')
      //-   el-input(v-model="addCardForm.id", placeholder="请输入卡样文件名（必填）")
      //-   .alert 统一使用"back"+3位数字来命名.如: back001
      el-form-item(label="卡样名称" prop='name')
        el-input(v-model="addCardForm.name", placeholder="请输入卡样名称（必填）")
      el-form-item(label="卡样类型" prop='type')
        el-radio-group(v-model="addCardForm.type")
          el-radio-button(label="0" ) 正面
          el-radio-button(label="1") 背面
      el-form-item(label="身份" prop='identityCode')
        el-select(v-model="addCardForm.identityCode" placeholder="请选择身份" style="width: 100%" clearable multiple  collapse-tags-tooltip :max-collapse-tags="6")
          el-option(v-for="(item, index) in identitySelect" :key="item.code" :label="item.name", :value="item.code")
        //- .alert 若不设置该项，默认选择全部身份
      el-form-item(label="卡样图片" prop='cardFront')
        .upload-box
          .upload-hd
            el-upload.avatar-uploadered(ref='cardFrontRef' v-model="cardFile.front", action="#", :show-file-list="false", :limit="1",:http-request="httpRequestFront", :before-upload="beforeUpload",:on-exceed="handleExceedFront")
              i.avatar-uploadered-icon(v-if="!addCardForm.cardFront")
                el-icon(:size="30")
                  Plus
                span 点击上传
              .images-box(v-else)
                el-image(:src="addCardForm.cardFront",fit="contain", style="width: 500px; height: 200px")
                  template(#error="")
                    el-icon(:size="20")
                      Picture
          el-row.handle-bar(:gutter="0", v-if="addCardForm.cardFront")
            el-col.text-danger.text-center( :span="24", @click="deleteImg('cardFront')") 删除
      el-form-item(label="设置默认卡样" prop='flag')
        el-radio-group(v-model="addCardForm.flag")
          el-radio-button(label='1') 是
          el-radio-button(label='0') 否
      el-form-item(label='描述' prop='describe')
        el-input(v-model='addCardForm.describe', type='textarea', placeholder='备注')
    template(#footer)
      el-button(@click='cancelU') 取消
      el-button(type='primary', @click='saveCardForm(addCardFormRef)') 确认
</template>
<script lang="ts" setup>
import { defineComponent, ref, onMounted, reactive, toRaw, toRefs, watch } from "vue"
// import { useRouter } from 'vue-router'
import { Card } from "@/service/platform/index"
import { Role } from "@/service/manage"
import { ElMessage, ElMessageBox } from "element-plus"
// import { IMsgBoxOptions, msgbox } from '@/hooks/subMessageBox'
import { useStore } from "vuex"
import { key } from "@/store"
import { Search, Edit, Delete, Plus, Picture, Refresh } from "@element-plus/icons-vue"
import { Picture as IconPicture } from "@element-plus/icons-vue"
// import subDialog from '@/components/subDialog.vue'
import TableTitle from "@/components/tableTitle.vue"
import HeadOperation from "@/components/headOperation.vue"
import type { FormInstance, FormRules } from "element-plus"
import { useRouter } from "vue-router"
import MoreHandle from "@/components/moreHandle.vue"

onMounted(() => {
  // getListHand()
  getIdentitySelect()
  getCardBg()
  // console.log('state---', state)
})

const router = useRouter()
const { state } = useStore(key)
// const router = useRouter()
const loading = ref(false)
const amountRef: any = ref(null)
const addCardFormRef: any = ref<FormInstance>()
const currentData = ref()
const amountRules = {}
const cardDate: any = reactive({
  typeList: [],
  bgUrl: [],
  phyCardData: [],
  // celleditData: {}
})
const autoUpload = ref(true)
//const disabled = ref(false)
const uploadDisabled = ref(false)
const uploadFile: any = ref()
const dialogImageUrl: any = ref("")
const form: any = reactive({ name: "" })
const dialogVisible = ref(false)
const celleditData: any = ref({})
const identitySelect: any = ref([])
const showAdd = ref(false)
const dialogTit = ref("添加角色")
const isEdit: any = ref(0) //0是非编辑状态（新建状态）
const editData: any = reactive({
  id: "",
  name: "",
  type: "",
  index: "",
})
const delData: any = reactive({
  id: "",
  name: "",
  type: "",
  index: "",
})
const uploadBoolean = ref(false)
const imageUrl: any = ref("")
const cardBgFront: any = ref()
const handleType: any = ref()
const addUploadFile: any = reactive({
  bucketName: "",
  file: "",
  name: "",
  type: "",
  id: "",
  index: "",
})

const pageInfo: any = reactive({
  current: 1,
  size: 10,
  total: 0,
})
const isChanged: any = reactive({
  front: "",
  back: "",
})
const cardFrontRef: any = ref()
const cardBackRef: any = ref()
const cardFile: any = reactive({
  front: "",
  back: "",
})
const addCardForm: any = reactive({
  id: "",
  name: "",
  cardFront: "",
  type: "",
  identityCode: "",
  describe: "",
  flag: "1",
})
const validateCardId = (rule: any, value: any, callback: any) => {
  if (value === "") {
    callback(new Error("卡样文件名不能为空"))
  } else {
    let num = 0
    for (var i = 0; i < value.length; i++) {
      if (/[\u4e00-\u9fa5]/.test(value[i])) {
        num += 2
      } else {
        num++
      }
    }
    const subStr = value.substring(0, 4)
    const subStr2 = value.substring(4, 7)
    const regCN = /^[0-9]*$/
    console.log("validateCardId", subStr, subStr2, num)
    if (subStr !== "back" || !regCN.test(subStr2) || num < 5) {
      callback(new Error("卡样文件名命名不规范"))
    } else {
      callback()
    }
  }
}
const addCardFormRules: any = reactive<FormRules>({
  // id: [{ required: true, validator: validateCardId, trigger: "blur" }],
  name: [
    { required: true, message: "卡样名称不能为空", trigger: "blur" },
    { max: 20, message: "卡样名称超出长度限制", trigger: "blur" },
  ],
  cardFront: [{ required: true, message: "卡样图片不能为空", trigger: "blur" }],
  type: [{ required: true, message: "卡样类型不能为空", trigger: "blur" }],
  describe: [{ max: 100, message: "卡样名称超出长度限制", trigger: "blur" }],
  // identityCode: [{ required: true, message: "身份不能为空", trigger: "blur" }],
})

//查询
const search = async () => {
  // pageInfo.current = 1
  // getCardBg()
  const newMerData: any = []
  if (form.name) {
    cardDate.phyCardData.filter((item: any) => {
      if (item.name) {
        if (item.name.indexOf(form.name) !== -1) {
          newMerData.push(item)
        }
      }
    })
    cardDate.phyCardData = newMerData
    pageInfo.total = newMerData.length
  } else {
    getCardBg()
  }
  console.log("查询", cardDate.phyCardData)
}
//获取卡样背景
const getCardBg = async (msgBox?: string) => {
  loading.value = true
  const params = {
    current: pageInfo.current,
    size: pageInfo.size,
    // name: form.name || undefined,
  }
  const { data: res, code, msg }: any = await Card.getCardBackground(params, msgBox)
  if (code === 200) {
    loading.value = false
    // cardDate.bgUrl = res
    // res.records.forEach((element: any) => {
    //     if (element.imageUrl !== null) {
    //         let imageUrlArr = element.imageUrl.split(",")
    //         element.cardBgFrontUrl = imageUrlArr[0] || ""
    //         element.cardBgBackUrl = imageUrlArr[1] || ""
    //     }
    // })
    cardDate.phyCardData = res.records
    pageInfo.total = res.total
    console.log("获取卡样背景", res.records, cardDate.phyCardData)
  } else {
    loading.value = false
    ElMessage.error(msg)
  }
}

//限制用户上传文件的格式和大小
const beforeUpload = (file: any) => {
  const type = ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/svg"]
  if (type.indexOf(file.type) === -1) {
    ElMessage.error("上传的文件必须是JPG、JPEG、PNG,SVG,GIF格式!")
    return false
  } else if (file.size / 1024 / 1024 > 2) {
    ElMessage.error("图片大小不能超过2MB!")
    return false
  }
  return true
}

// 图片放大
const handlePictureCardPreview = (index: number, val: any) => {
  // console.log("放大------", index, val)
  uploadBoolean.value = true
  dialogVisible.value = true
  currentData.value = val

}

//删除卡
const handleRemove = async (index: number, val: any) => {
  console.log("删除------", index, val)
  uploadBoolean.value = true
  setTimeout(() => {
    var tit = "是否要删除" + val.name + "的卡图片？"
    ElMessageBox.confirm(tit, "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
    })
      .then(() => {
        removeData(val)
      })
      .catch(() => {
        return
      })
  }, 20)
}

const removeData = async (val: any) => {
  let params = { id: val.id }
  const { code, msg }: any = await Card.removeCardBackground(params)
  if (code === 200) {
    ElMessage.success(msg)
    getCardBg()
  } else {
    ElMessage.error(msg)
  }
}
//添加卡样
const addCard = () => {
  showAdd.value = true
  isEdit.value = 0
  addCardForm.id = ""
  addCardForm.name = ""
  addCardForm.cardFront = ""
  addCardForm.type = ""
  addCardForm.identityCode = ""
  addCardForm.describe = ""
  addCardForm.flag = "1"
  dialogTit.value = "添加卡样"
}
//编辑卡样
const editCard = (index: number, data: any) => {
  showAdd.value = true
  isEdit.value = 1
  dialogTit.value = "编辑卡样"
  cardFile.front = ""
  addCardForm.id = data.id
  addCardForm.name = data.name
  addCardForm.cardFront = data.imageUrl
  addCardForm.type = data.type
  addCardForm.model = data.model || ''
  if (data.identity !== null) {
    addCardForm.identityCode = data.identity?.split(",")
  }
  if (data.describe !== null) {
    addCardForm.describe = data.describe
  }
  addCardForm.flag = data.flag
  console.log("编辑卡样", data, addCardForm)
}
//上传图片
const httpRequestFront = (data: any) => {
  cardFile.front = data.file
  addCardForm.cardFront = URL.createObjectURL(data.file)
}
const httpRequestBack = (data: any) => {
  cardFile.back = data.file
  addCardForm.cardBack = URL.createObjectURL(data.file)
}
const handleExceedFront = (data: any) => {
  cardFrontRef.value!.clearFiles()
  const file: any = data[0]
  cardFrontRef.value!.handleStart(file)
  addCardForm.cardFront = URL.createObjectURL(file)
  cardFile.front = file
}
const handleExceedBack = (data: any) => {
  cardBackRef.value!.clearFiles()
  const file: any = data[0]
  cardBackRef.value!.handleStart(file)
  addCardForm.cardBack = URL.createObjectURL(file)
  cardFile.back = file
}
// 取消
const cancelU = () => {
  showAdd.value = false
  addCardFormRef.value.resetFields()
}
const deleteImg = (type?: any) => {
  if (type === "cardFront") {
    addCardForm.cardFront = ""
  }
  if (type === "cardBack") {
    addCardForm.cardBack = ""
  }
}
//确认
const saveCardForm = async (formEl: FormInstance) => {
  if (!formEl) return
  await formEl.validate((valid, fields) => {
    if (valid) {
      console.log("submit!", addCardForm, addCardForm.identityCode, cardFile, isEdit.value)
      let formData = new FormData()
      // formData.append("id", addCardForm.id)
      formData.append("name", addCardForm.name)
      formData.append("bucketName", "photo")
      formData.append("type", "background")
      formData.append("index", addCardForm.type)
      formData.append("file", cardFile.front)
      formData.append("flag", addCardForm.flag)
      formData.append("model", addCardForm.model || '')
      if (addCardForm.identityCode.length > 0) {
        formData.append("identity", addCardForm.identityCode.join(","))
      } else {
        // formData.append("identity", "")
      }
      if (addCardForm.describe !== null) {
        formData.append("describe", addCardForm.describe)
      }
      if (isEdit.value !== 0) {
        formData.append("id", addCardForm.id)
      }
      console.log("添加---", cardFile.front, addCardForm)

      addCardBackground(formData)
    } else {
      console.log("error submit!", fields)
    }
  })
}
const addCardBackground = async (formData: any) => {
  const { data: res, msg, code }: any = await Card.addCardBackground(formData)
  if (code === 200) {
    ElMessage.success(msg)
    showAdd.value = false
    // bindIdentity(res)
    getCardBg()
  } else {
    ElMessage.error(msg)
    showAdd.value = false
  }
}
const bindIdentity = async (val: any) => {
  let formData = new FormData()
  formData.append("identity", val.identity)
  formData.append("ids", val.id)
  const { data: res, msg, code }: any = await Card.bindIdentity(formData)
  if (code === 200) {
    // ElMessage.success(msg)
    // showAdd.value = false
    // getCardBg()
  } else {
    ElMessage.error(msg)
    // showAdd.value = false
  }
}

//分页
const handleSizeChange = (val: number) => {
  pageInfo.size = val
  pageInfo.current = 1
  getCardBg()
}
const handleCurrentChange = (val: number) => {
  pageInfo.current = val
  getCardBg()
}
//身份
const getIdentitySelect = async () => {
  const res = await Role.listIdentity()
  if (res.code === 200 && res.data) {
    identitySelect.value = res.data
  } else {
    // ElMessage.error(msg)
  }
}
const getIdentityArr = (val: any) => {
  if (val !== null) {
    const res = identitySelect.value.filter((o: any) => {
      return val.includes(o.code)
    })
    return res
  }
}
// 修改状态
const changeStatus = () => { }

// 跳转到编辑器
const toEdit = (data?: any) => {
  if (!sessionStorage.cardObj) {
    sessionStorage.setItem("cardObj", "{}")
  }

  let index = ""
  let url = ""
  if (process.env.NODE_ENV === "development") index = state.devHost.layoutEditor + "/layout-editor"
  else index = state.configs.base + "/layout-editor"

  if (data) url = `${index}/?token=${state.token}&type=card&id=${data.id}&name=${data.name}&des=${data.des}&isPhyCard=1`
  else url = `${index}/?token=${state.token}&type=card`
  router.push({ name: "layoutEditor", query: { url: encodeURI(url) } })
  // window.location.href = url
  // sessionStorage.cardObj = JSON.stringify(data)
  // router.push({ path: '/cardEdit/edit', query: { id: id } })
}

</script>
<style lang="scss" scoped>
#physicalCard {
  // padding: 18px 0;

  .mdtable {
    width: 100%;
    min-height: 485px;
  }

  .cardimgbox {
    display: flex;
    align-items: center;

    .cardimg {
      //flex: 1;
      cursor: pointer;

      //min-width: 60px;
      .cardbg {
        height: 80px;
      }
    }

    .imgedit {
      margin-left: 10px;

      .el-button {
        margin-bottom: 8px;
        display: block;
        margin-left: 0;
        padding: 8px;
        // opacity: 0.6;
        // &:hover {
        //   opacity: 1;
        // }
      }
    }
  }

  .amountbox {
    padding: 15px;
    display: block;
    font-weight: 600;
    color: var(--el-color-primary);
    cursor: pointer;
  }

  .amountpro {
    color: #999;
    cursor: pointer;
  }

  .amountinput {
    display: flex;
    align-items: center;

    .el-button {
      margin-left: 10px;
    }
  }

  .el-upload-action {
    position: absolute;
    top: 0;
    left: 0;
    display: block;
    width: 100%;
    height: 100%;
    font-size: 0;
    color: #fff;
    text-align: center;
    line-height: 120px;

    .el-button--mini.is-circle {
      padding: 8px;
    }
  }

  .el-upload-action:hover {
    font-size: 0;
    background-color: #000;
    background-color: rgba(0, 0, 0, 0.3);
  }

  // :v-deep .el-dialog .hide .el-upload--picture-card {
  //   //因为是dialog里的upload
  //   display: none;
  // }
  :deep(.avatar-uploader) {
    .el-upload {
      border: 1px dashed #d9d9d9;
      border-radius: 6px;
      cursor: pointer;
      position: relative;
      overflow: hidden;
      display: block;
      height: 150px;
      width: auto;
    }
  }

  .el-upload-list__item-actions:hover span {
    display: inline-block;
  }

  .el-icon-zoom-in:before {
    content: "\E626";
  }

  .el-icon-delete:before {
    content: "\E612";
  }

  .el-upload-list__item-actions:hover {
    opacity: 1;
  }

  .el-upload-list__item-actions {
    position: absolute;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
    cursor: default;
    text-align: center;
    color: #fff;
    opacity: 0;
    font-size: 20px;
    background-color: rgba(0, 0, 0, 0.5);
    transition: opacity 0.3s;
  }

  :deep(.avatar-uploader) {
    .el-upload:hover {
      border-color: var(--main-primary);
    }

    .el-image__wrapper {
      height: 150px;
    }
  }

  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: auto;
    height: 150px;
    line-height: 150px;
    text-align: center;
    display: block;

    span {
      font-size: 14px;
      display: block;
      line-height: 0;
      margin-top: -40px;
      font-style: normal;
      font-weight: 500;
    }
  }

  :deep(.el-upload--text) {
    display: block;
  }

  .avatar {
    // width: 150px;
    width: auto;
    height: 150px;
    display: block;
    margin: auto;
    border-radius: 4px;
  }

  .upload-icon {
    position: absolute;
    top: 50%;
    margin-left: -53px;
    margin-top: -18px;

    .el-button--mini.is-circle {
      padding: 8px;
    }
  }

  :deep(.dialogBox) {
    .el-dialog {
      top: 30% !important;
      width: 30%;
    }
  }

  .image-slot {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 150px;
    background: #f5f7fa;
    color: var(--el-text-color-secondary);
    font-size: 14px;

    .el-icon-picture {
      font-size: 30px;
      color: #c4c7cd;
    }
  }

  .el-alert--info.is-light {
    background-color: #ecf5ff;
    border-color: #c6e2ff;
    margin-bottom: 18px;

    :deep(.el-alert__icon) {
      color: var(--main-primary);
    }
  }

  .noimage {
    :deep(.el-empty__image) {
      width: 50px;
      height: 50px;
    }

    :deep(.el-empty__description) {
      margin-top: 5px;

      p {
        font-size: 12px;
        display: block;
        vertical-align: middle;
        color: #8c939d;
      }
    }
  }

  .upload-box {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    width: 500px;
    height: 200px;
    line-height: 200px;
    background-color: #fff;

    .upload-hd {
      display: block;
      height: 200px;
    }

    .avatar-uploadered {
      display: flex;
      justify-content: center;
      align-items: center;
      cursor: pointer;
      height: 200px;
    }

    .avatar-uploadered-icon {
      display: block;
      font-size: 28px;
      color: #8c939d;
      width: 100%;
      height: 100px;
      line-height: normal;
      text-align: center;

      .el-icon {
        margin-top: 22px;
      }

      span {
        display: inherit;
        font-style: normal;
        font-size: 5px;
        line-height: normal;
      }
    }

    .handle-bar {
      height: 30px;
      z-index: 5;
      position: absolute;
      width: 100%;
      color: #000;
      background: #f4f4f5;
      bottom: 0;

      .text-center {
        display: block;
        height: 30px;
        line-height: 30px;
        font-size: 12px;
      }
    }

    .images-box {
      position: relative;
      display: block;
      min-height: 1px;
      border: 0;
      line-height: 0;
      background: var(--el-fill-color-light);
      overflow: hidden;

      :deep(.el-image__wrapper) {
        position: relative;
        line-height: 100px;
        text-align: center;
      }
    }
  }

  .alert {
    font-size: 12px;
    color: #333;
    opacity: 0.8;
  }
}
</style>