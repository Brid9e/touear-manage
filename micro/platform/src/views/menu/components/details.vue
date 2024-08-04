<template lang="pug">
//- div --- props {{currentMenu}}
el-descriptions(v-if="currentMenu" title='基本信息', :column='2')
  el-descriptions-item(label='菜单名称') {{ currentMenu.name }}
  el-descriptions-item(label='英文名称') {{ currentMenu.nameEn }}
  el-descriptions-item(label='菜单代码')
    span(v-if="currentMenu.bh") {{ currentMenu.indexCode }}
    span(v-else) {{ currentMenu.code }}
  el-descriptions-item(label='菜单编号' v-if="currentMenu.bh") {{ currentMenu.bh }}
  el-descriptions-item(label='用户类型')
    span(v-if="currentMenu.myUserType")
      span(v-if="currentMenu.myUserType === 'common'")
        span(v-for="(item, i) in userTypeList")
          | {{ item.name }}
          span(v-if="i + 1 < userTypeList.length") &nbsp;/&nbsp;
      span(v-else)
        | {{userTypeList.find(item => item.label === currentMenu.myUserType)?.name}}
    //- span(v-else-if="currentMenu.userType")
      span(v-if="currentMenu.userType === 'common'")
        span(v-for="(item, i) in userTypeList")
          | {{ item.name }}
          span(v-if="i + 1 < userTypeList.length") &nbsp;/&nbsp;
      span(v-else)
        | {{userTypeList.find(item => item.label === currentMenu.userType)?.name}}
    span.text-gray-6(v-else) 暂无
  el-descriptions-item(label='终端类型', v-if='currentMenu.platType')
    span.dot-list(v-for="(item, i) in currentMenu.platType.split(',')" :key="i") {{ platTypeLevel.find(subItem  => subItem.code === item).name }}

  el-descriptions-item(v-if="currentMenu.bh" label='添加时间' ) {{ currentMenu.createTime }}
  el-descriptions-item(v-if="currentMenu.bh" label='更新时间') {{ currentMenu.updateTime }}

el-descriptions(v-if="urlPlatList" title='菜单地址', :column='1' style="margin-top:20px")
  el-descriptions-item
    el-table(v-if="urlPlatList.length > 0" :data="urlPlatList" border)
      el-table-column(prop='name', label='名称' width="120")
      el-table-column(prop='url', label='地址')
      el-table-column(prop='appId', label='AppId')
      el-table-column(prop='route', label='Route' width="120")
    //- | {{ urlPlatList }}
    //- p.url-item( v-for='(item, i) in urlPlatList', :key='i' :class="{'margin-bottom-x': i + 1 < urlPlatList.length}")
      p {{ item.name }}
      .url-m
        p(v-if='item.url')
          span.font-size-12 地址：{{ item.url || "暂无" }}
        p(v-if='item.appId')
          span.font-size-12 appId：{{ item.appId || "暂无" }}
        p(v-if='item.route')
          span.font-size-12 route：{{ item.route || "暂无" }}
    div.text-gray-6(v-else) 暂无地址

el-descriptions(v-if="currentMenu?.myIconList" title='菜单图标', :column='1' style="margin-top:20px")
  el-descriptions-item
    el-table(v-if="currentMenu.myIconList" :data="currentMenu.myIconList" border)
      el-table-column(prop='list[0].platType.name', label='平台' width="120")
      el-table-column(prop='list[0].platType.name', label='图标')
        template(#default='{row}')
          .table-icon-list.flex-fit
            .img-item.text-center(v-for="(subItem, j) in row.list")
              el-image(:src='subItem.src', style='width: 36px; height: 36px')
              p.font-size-12.text-gray-7 {{ subItem.model.name }}
    //- | {{currentMenu.myIconList}}
    //- p.flex-box(v-if="currentMenu.myIconList" v-for="(item, i) in currentMenu.myIconList" :key="i" style="margin-top:1rem;")
      p(style="width: 120px" v-if="currentMenu.myIconList.length > 1") {{ item.list[0]?.platType?.name }}

          //-  --- {{ subItem.platType.name }}


</template>

<script lang="ts" setup>
import { reactive, toRefs, defineProps, ref, onMounted, onActivated } from 'vue'
// import { useRoute, useRouter } from 'vue-router'
// import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { key } from '@/store'

const props = defineProps(['data', 'isCloud', 'platType'])
console.log('currentMenu props', props)
const currentMenu: any = ref(props.data.currentMenu)

const { state } = useStore(key)
const { platTypeList, userTypeList, platTypeLevel } = state
const urlList: any = ref([])
// currentMenu.value.myUrlList
console.log(platTypeList)
// currentMenu.value.myUrlList.forEach((element: any) => {
//   if (element) {
//     console.log(element.parentCode)
//   }
// })
const urlPlatList: any = ref([])

onMounted(() => {
  //  各终端类型地址
  // if (currentMenu.value.extraConfig) {

  console.log('isCloud', props.data.isCloud)
  console.log('platType', props.data, props.data.currentMenu.platType)
  currentMenu.value.myUserType = currentMenu.value.type || currentMenu.value.userType
  if (props.data.isCloud) {
    urlPlatList.value = (currentMenu.value.extraConfig && currentMenu.value.extraConfig.url) ? currentMenu.value.extraConfig.url : []
  } else {
    // alert(2)
    urlPlatList.value = currentMenu.value.extraConfig ? JSON.parse(currentMenu.value.extraConfig) : []
  }
  if (props.data.currentMenu.platType) {
    const arr = props.data.currentMenu.platType.split(',')
    console.log('----', urlPlatList.value)
    urlPlatList.value = urlPlatList.value.filter((item: any) => arr.findIndex((subitem: any) => subitem === item.code) !== -1)
  }
  urlPlatList.value = urlPlatList.value.filter((item: any) => item.url || item.appId || item.route)

  // }
  // if (currentMenu.value.myUrlList) {
  // const urlList = currentMenu.value.myUrlList || currentMenu.value.extraConfig.url || [] // myUrlList->本地 extraConfig.url -> 云端
  // platTypeList.forEach((element: any) => {
  //   const arr = urlList.filter((item: any) => {
  //     if (item.parentCode) {
  //       return element.code === item.parentCode
  //     } else {
  //       return element.code === item.code
  //     }
  //   })
  //   element.children = arr
  //   // console.log('arr', urlList.find((item: any) => item.code === element.code ))
  //   if (element.children.length > 0 && arr.length > 0) {
  //     element.children = arr
  //     urlPlatList.value.push(element)
  //   } else if (element.children.length === 0 && arr.length > 0) {
  //     element = arr[0]
  //     urlPlatList.value.push(element)
  //   }
  // })
  // console.log('currentMenu', currentMenu.value.myIconList)
  // console.log('urlPlatList', urlPlatList.value)
})
// onActivated (() => {
//   alert('onActivated')
// })
</script>
<style scoped lang="scss">
.table-icon-title {
  margin-top: 6px;
  margin-bottom: 4px;
}

.table-icon-list .img-item {
  display: inline-block;
  line-height: 20px;
  margin-right: 20px;

  &:last-child {
    margin-right: 0;
  }
}

.url-type-item {
  background-color: #f4f5f5;
  padding: 15px;
  margin-bottom: 10px;
  border-radius: 6px;
}

.url-group-item {
  overflow: hidden;

  .input-item-right {
    float: left;
    width: calc(100% - 90px);
  }

  .input-item-left {
    float: left;
    width: 80px;
    margin-right: 10px;
    text-align: right;
  }

  .margin-top-xs {
    margin-top: 3px;
  }
}

.url-item {
  overflow: hidden;
  margin: 0.5rem 1rem 0 0;

  .url-n {
    background-color: red;
  }

  .padding-bottom-top {
    margin-bottom: 10px;
  }

  .url-m {
    float: left;
    width: 100%;
    padding: 0.4rem 1rem;
    box-sizing: border-box;
    border-radius: var(--el-border-radius-base);
    background-color: var(--el-fill-color-light);
    min-height: 34px;
    margin-top: 0.2rem;

    // .padding-bottom-top:first-child {
    //   padding-top: 0;
    // }
    .padding-bottom-top:last-child {
      margin-bottom: 0;
    }
  }
}

// #f4f5f5</style>