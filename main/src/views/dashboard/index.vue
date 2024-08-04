<!--
 * @Author: Joe
 * @Date: 2022-10-12 09:57:13
 * @LastEditors: Joe
 * @LastEditTime: 2022-10-12 09:57:18
 * @FilePath: /management_micro/main/src/views/Dashboard.vue
 * @Description: #Dashboard
 *
 * Copyright (c) 2022 by Brid9e wangdongqiao1997@163.com, All Rights Reserved.
-->
<template lang='pug'>
#Dashboard
  el-row(:gutter="16")
    DashboardItem(:span="4" :height="90")
      .box(v-if="!loading")
        .info
          .sub-title 已登录过的用户
          //- 当前APP在线人数
          span.hover-animate(@click="onShow(undefined)") {{ wsData?.numberOfPeopleLoggedIn || 0 }}
        .icon
          el-icon(:size="20" color="var(--main-color-default)")
            UserFilled
      el-skeleton.skeleton(v-else :rows="1")
    DashboardItem(:span="4" :height="90")
      .box(v-if="!loading")
        .info
          .sub-title 当前在线
          span.hover-animate(@click.native="onShow('1')") {{ wsData?.numberOfPeopleOnline || 0 }}
          //- el-progress.hover-animate(@click.native="onShow(1)" :percentage="(wsData?.numberOfPeopleLoggedIn / (wsData?.numberOfPeopleLoggedIn + wsData?.numberOfPeopleOffline)) * 100" :stroke-width="16" :text-inside="true" :format="() => wsData?.numberOfPeopleLoggedIn")
        .cut-line
        .info
          .sub-title 未登录
          span.hover-animate(@click.native="onShow('0')") {{ wsData?.numberOfPeopleOffline || 0 }}
          //- el-progress.hover-animate(@click.native="onShow(0)" :percentage="(wsData?.numberOfPeopleOffline / (wsData?.numberOfPeopleLoggedIn + wsData?.numberOfPeopleOffline)) * 100" :stroke-width="16" :text-inside="true" :format="() => wsData?.numberOfPeopleOffline")
      el-skeleton.skeleton(v-else :rows="1")
    //- DashboardItem.hover-animate(:span="2" :height="90")
      .box(v-if="!loading")
        .info
          .sub-title 未登录
          span {{ wsData?.numberOfPeopleOnline || 0 }}
      el-skeleton.skeleton(v-else :rows="1")
    DashboardItem(:span="8" :height="90")
      .box(v-if="!loading")
        .info
          .sub-title 本月新增用户数
          span {{ wsData?.newUsers || 0 }}
        .icon
          el-icon(:size="20" color="var(--main-color-default)")
            Histogram
      el-skeleton.skeleton(v-else :rows="1")
    DashboardItem(:span="8" :height="90")
      .ver
        h3 版本号
        h2 1.0.7
    //- DashboardItem(:span="6" :height="90")
  el-row.dash-row(:gutter="16")
    DashboardItem.dash-bar-item(:span="8" :height="350")
      .box-top(v-if="!loading")
        DashBar(:data="wsData?.mobilePhoneSystem")
      .title(v-if="!loading") 用户相关统计
      .sub-title(v-if="!loading") 移动设备&男女用户统计
      .box-bottom(v-if="!loading")
        el-row(:gutter="16")
          el-col(:span="8" v-for="(item, key, index) in wsData?.identity" :key="index")
            SmallItem(:icon="sexIconObj[key]" :keys="key" :value="item" :scale="(item / count()) * 100")
      el-skeleton.skeleton(v-else :rows="5")
    DashboardItem.dash-line-item(:span="16" :height="350")
      .box-top(v-if="!loading")
        .title 月访问量趋势
        .sub-title 一个自然月的访问量趋势
      .box-bottom(v-if="!loading")
        DashLine(:data="wsData?.monthlyVisits")
      el-skeleton.skeleton(v-else :rows="5")
  el-row.dash-row(:gutter="16")
    DashboardItem.dash-bar-top-item(:span="16" :height="350")
      .title(v-if="!loading") 当日应用访问频率排行榜
      .sub-title(v-if="!loading") 使用频率由高到低
      .box-top(v-if="!loading")
        DashBarTop(:data="wsData?.applicationFrequency")
      el-skeleton.skeleton(v-else :rows="5")
    DashboardItem.dash-bar-y-item(:span="8" :height="350")
      .title(v-if="!loading") 热门搜索排行榜
      .sub-title(v-if="!loading") 搜索最多的词条排名
      .box-bottom(v-if="!loading")
        DashTop(:data="wsData?.hotSearch")
      el-skeleton.skeleton(v-else :rows="5")

Detailed(v-model="show" :show="show" :status="detType")

</template>

<script lang='ts' setup>
import { ref, onMounted, onUnmounted } from 'vue'
import Socket from '@/assets/scripts/websocket'
import { useStore } from 'vuex'
import { key } from '@/store'
import DashboardItem from '@/components/dashboardItem.vue'
import { UserFilled, Histogram, Male, Female, QuestionFilled, Select, CloseBold } from '@element-plus/icons-vue'
import { DashBar, DashLine, DashPie, DashTop, SmallItem, DashBarTop, Detailed } from './modules/index'
import data from './test'
import { Home } from '@/service/manage'

const { state } = useStore(key)
const { configs } = state

const detType: any = ref(0)
const show = ref(false)
const loading = ref(false)
const timer = ref()
const wsData: any = ref({})
const sexIconObj = {
  男: Male,
  女: Female,
  未知: QuestionFilled
}

onMounted(async () => {
  await initData(true)
  timer.value = setInterval(() => {
    initData()
  }, 30000)
})

onUnmounted(() => {
  clearInterval(timer.value)
})

/**
 *
 * @date 2022-12-29 09:17:45
 * @author Joe
 * @description 连接ws，获取实时数据
 *
 */
const initData = async (init = false) => {
  loading.value = init
  const { data: res, code, msg }: any = await Home.getHomeStatistics()
  loading.value = false
  if (code === 200) wsData.value = JSON.parse(res)
}

/**
 *
 * @date 2022-12-29 14:46:26
 * @author Joe
 * @description 男女比例总人数
 *
 */
const count = () => {
  //
  let count = 0
  for (let val of Object.values(wsData.value.identity) as any) {
    count += val
  }
  return count
}


const onShow = (status: any) => {
  show.value = true
  detType.value = status
}

</script>

<style lang='scss' scoped>
#Dashboard {
  //
  // padding: -3.25rem -1.25rem -1.25rem !important;
  overflow: hidden;
  // user-select: none;

  .box {
    padding: 1.375rem 1rem;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .info {
      box-sizing: border-box;



      span {
        font-size: 1.25rem;
        font-weight: 800;
      }
    }

    .icon {
      width: 2.5rem;
      height: 2.5rem;
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: var(--el-color-primary);
      border-radius: 9px;
    }
  }

  .cut-line {
    width: 1px;
    height: 3.125rem;
    background-color: var(--main-color-font-sub);
    border-radius: 100%;
    transform: scaleX(0.5);
    opacity: 0.7;

  }

  // .box-r {
  //   padding: 1.375rem 1rem;
  //   display: flex;
  //   flex-direction: column;

  //   :deep(.el-progress) {
  //     width: 100%;
  //     margin-bottom: 1rem;
  //     margin-left: 1rem;
  //   }

  //   .info-r {
  //     display: flex;
  //     width: 100%;
  //     flex-shrink: 0;
  //     align-items: center;
  //   }
  // }

  .dash-row {
    margin-top: 16px;
  }

  :deep(.dash-charts) {
    height: 100%;
    // background-color: red;
  }

  :deep(.dash-bar-item) {
    .db-item {
      padding: 1rem;
      box-sizing: border-box;
    }

    .box-top {
      height: 50%;
      margin-bottom: 1rem;
      background-color: var(--main-menu-color-bg);
      border-radius: var(--main-border-radius);
    }

    .box-bottom {
      margin-top: 1.625rem;
      // background-color: red;
    }
  }

  :deep(.dash-bar-top-item) {
    .db-item {
      padding: 1rem;
      box-sizing: border-box;
    }

    .box-top {
      height: 75%;
      margin-bottom: 1rem;
      // background-color: #FF3CAC;
      background-color: var(--main-menu-color-bg);
      border-radius: var(--main-border-radius);
    }

    .box-bottom {
      margin-top: 1.625rem;
      // background-color: red;
    }
  }

  :deep(.dash-line-item) {
    .db-item {
      padding: 1rem;
      box-sizing: border-box;
    }

    .box-top {
      // background-color: black;
      border-radius: var(--main-border-radius);
      margin-bottom: 2rem;
    }

    .box-bottom {
      height: 70%;
      // margin: 0 0 1rem 0;
    }
  }

  :deep(.dash-bar-y-item) {
    .db-item {
      padding: 1rem;
      box-sizing: border-box;
    }

    .box-bottom {
      height: 75%;
      border-radius: var(--main-border-radius);
      // background-color: #8BC6EC;
      // background-image: linear-gradient(135deg, #8BC6EC 0%, #9599E2 100%);
      background-color: var(--main-menu-color-bg);
      // background-image: linear-gradient(225deg, var(--main-primary) 0%, var(--main-menu-color-bg) 50%, var(--main-menu-color-bg) 100%);
      // background-image: linear-gradient(225deg, #1c2236 0%, #181e3d 50%, #212a5e 100%);
    }
  }

  .m-progress {
    height: 20px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
}

.title {
  margin: 1rem 0 0.625rem 0;
  font-weight: 800;
}

.sub-title {
  font-size: 0.875rem;
  margin-bottom: 1rem;
  color: var(--main-color-font-sub);
  font-weight: 500;
  flex-shrink: 0;
}

.ver {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: var(--main-border-radius);
  background-color: var(--main-primary);

  h2,
  h3 {
    color: white;
    font-weight: 800;
  }

  h2 {
    margin-left: 1.5rem;
    font-size: 40px;
    background-image: linear-gradient(to right, #85FFBD, #FFFB7D);
    -webkit-background-clip: text;
    color: transparent;
    font-weight: 500;
  }

}

.skeleton {
  width: 100%;
  height: 100%;
  padding: 1rem;
  box-sizing: border-box;
}

.hover-animate {
  transition: transform 0.15s ease;

  &:hover {
    cursor: pointer;
    text-decoration: underline;
    color: var(--el-color-primary);
    transform: scale(1.1);
  }
}
</style>