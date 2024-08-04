<template lang='pug'>
div.notice_box(v-loading='loading')
  el-row(style='position:absolute;top:10px;right:190px;')
    el-col(:span="3" :offset="21")
      el-button(label="left", @click='toList')
        |返回列表
  div.notice_title
    div.title {{noticeItem.title}}
    div.info
      span 发布时间: {{noticeItem.publishDatetime}}&nbsp;&nbsp;&nbsp;&nbsp;
      span 发布者: {{noticeItem.publishDepartmentCode}}
  div.preview_content(v-html='noticeItem.content')
</template>
<script setup lang='ts'>
import { defineComponent, computed, onMounted, reactive, toRefs, ref, nextTick, onUnmounted, watch } from 'vue'
import { Statistics } from '@/service/manage'
import { Search, Plus, Refresh } from '@element-plus/icons-vue'
import { useRoute, useRouter } from 'vue-router'
const router = useRouter()
const route: any = useRoute()
const paramsId = computed(() => route.params?.id)
let noticeItem = ref({})
const loading = ref(false)
const getNoticeDetial = async (msgBox?: string) => {
  loading.value = true
  const params = {
    id: paramsId.value,
    type: 1
  }
  const { data, code }: any = await Statistics.getNoticeDetail(params, msgBox)

  if (code === 200) {
    loading.value = false
    noticeItem.value = data[0]
  }
  console.log('------详情', noticeItem.value)
}
const toList = () => {
  router.push({
    name: 'noticeList'
  })
}
watch(
  paramsId.value,
  (val: any) => {
    loading.value = true
    getNoticeDetial()
  },
  {
    deep: true,
  },
)
onMounted(async () => {
  await getNoticeDetial()
})
</script>
<style lang="scss" scoped>
.notice_title {
  text-align: center;
  margin: 0 0 30px 0;
  .info {
    // text-align: right;
    // padding-right: 50px;
    span{
      margin-top: 20px;
      font-size: 12px;
      color: #666;
    }
  }
}
</style>
