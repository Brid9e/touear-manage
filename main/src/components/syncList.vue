<script lang="ts" setup>
import { computed, onMounted, ref, watch } from 'vue'
import {
  Select,
  CloseBold,
  Refresh,
  Delete,
  WarnTriangleFilled,
} from '@element-plus/icons-vue'
import {
  isEmpty,
  pullAllWith,
  isEqual,
  sumBy,
  filter,
  cloneDeep
} from 'lodash'
import { useStorage, useSessionStorage } from '@vueuse/core'
import service from '@/service'
import { access } from 'manage-utils'
import dayjs from 'dayjs'
import { useStore } from 'vuex'
import { key } from '@/store'

const emits = defineEmits<{ (name: 'getStatus', v: any): void }>()

const list: any = useStorage('syncList', {})
const authPath: any = useSessionStorage('authPath', '')

const store = useStore(key)
const { state } = store

const userKey = computed(() => {
  return authPath.value
    ? authPath.value?.split('-')?.[1]
    : `${state.userInfo?.account}-${state.userInfo?.identityType}`
})

/**
 * 操作
 * @param type
 * @param item
 */
function onHandle(type: string, item: any) {
  if (type === 'delete') {
    pullAllWith(list.value[userKey.value], [item], isEqual)
  }
}

/**
 * 失败
 * @param res
 * @param item
 */
const failed = (res: any, item: any) => {
  item.success = 2
  item.finished = true
  item.syncing = false
  item.error = access(res, item.errorKey || 'msg')
  window.postMessage(cloneDeep({
    success: false,
    name: item.name,
    type: 'syncOver',
    extra: item.extra
  }))
  handleMsg(res, item)
}

/**
 *
 * 接口方式获取进度
 * @param item
 *
 */
function typApi(item: any) {
  service
    .request({
      method: item.method,
      url: item.url,
      [item.method === 'post' ? 'data' : 'params']: item.params,
    })
    .then((r: any) => {
      if (r.code === 200) {
        const progress = item.key
          ? Number(access(r.data, item.key) || 0)
          : Number(r.data)
        if (progress < 0) {
          failed(r, item)
          return
        }
        if (progress >= 100) {
          item.progress = 100
          item.finished = true
          item.syncing = false
          item.success = 1
          window.postMessage(cloneDeep({
            success: true,
            name: item.name,
            type: 'syncOver',
            extra: item.extra
          }))
          handleMsg(r, item)
          return
        } else {
          handleMsg(r, item)
        }
        item.progress = progress
      } else {
        failed(r, item)
      }
    })
    .catch((err) => {
      handleMsg(err?.data, item)
      console.log('syncList', err)
      item.success = 2
      item.finished = true
      item.syncing = false
      item.error = '请求异常'
    })
}

/**
 * 处理msg
 * @param data
 * @param item
 */
function handleMsg(data: any, item: any) {
  if (item?.msg) {
    const funcParamsBody: any = extractFunctionParts(item.msg)
    // 有body体则是函数，否则是msgKey
    if (funcParamsBody.body) {
      const msgFunction = new Function(funcParamsBody.params, funcParamsBody.body)
      item.msgData = msgFunction(data)
    } else {
      item.msgData = access(data, item.msg)
    }
  }
}

/**
 *
 * 今天只显示时间 其他显示日期时间
 * @param date
 *
 */
function handleTimes(date: string) {
  if (dayjs(date).format('YYYYMMDD') === dayjs().format('YYYYMMDD')) {
    return dayjs(date).format('HH:mm')
  } else {
    return date
  }
}

function test() {
  // const a = (item: any) => {
  //   // console.log()
  //   const arr = []
  //   for (const key in item.data.processInfo) {
  //     const element = item.data.processInfo[key]
  //     arr.push(element + '完成')
  //   }
  //   return JSON.stringify(arr)
  // }
  // const b = (item: any) => item
  // const c = {
  //   a: function(item: any) {
  //     return item
  //   }
  // }
  // console.log(a.toString())
  // console.log(extractFunctionParts(a.toString()))
  // const funcA: { params: string, body: string } = extractFunctionParts(a.toString())
  // console.log(funcA)
  // const msgFunction = new Function(funcA.params, funcA.body)
  // console.log(msgFunction)
  // if (!list.value?.[userKey.value]) {
  //   list.value[userKey.value] = []
  // }
  // list.value?.[userKey.value].unshift({
  //   id: Math.random() * 10000,
  //   progress: 0,
  //   finished: false,
  //   failed: false,
  //   syncing: true,
  //   success: 0,
  //   name: '测试',
  //   url: '/test',
  //   method: 'get',
  //   dateTime: dayjs().format('YYYY-MM-DD HH:mm'),
  //   error: '',
  //   errorKey: '',
  // })
}

/**
 * 拿到函数字符串的函数体和入参
 * @param funcString
 */
function extractFunctionParts(funcString: string): { params: string, body: string } {
  const functionRegex = /function\s*\(([^)]*)\)\s*{([\s\S]*)}/
  const arrowFunctionRegex = /\(([^)]*)\)\s*=>\s*{([\s\S]*)}/
  const arrowFunctionWithoutBracesRegex = /\(([^)]*)\)\s*=>\s*([^{]+)/

  let match = functionRegex.exec(funcString)
  if (match) {
    return {
      params: match[1].trim(),
      body: match[2].trim()
    }
  }

  match = arrowFunctionRegex.exec(funcString)
  if (match) {
    return {
      params: match[1].trim(),
      body: match[2].trim()
    }
  }

  match = arrowFunctionWithoutBracesRegex.exec(funcString)
  if (match) {
    return {
      params: match[1].trim(),
      body: `return ${match[2].trim()};`
    }
  }
  return {
    params: '',
    body: ''
  }
}

watch(
  () => list.value?.[userKey.value],
  (res: any) => {
    // list.value = res
    const syncingNum = res?.filter((item: any) => {
      return !item.finished
    })?.length
    const failedNum = res?.filter((item: any) => {
      return item.success === 2
    })?.length
    const totalProgress = Math.floor(
      (sumBy(filter(res, { finished: false }), 'progress') /
        ((syncingNum === 0 ? 1 : syncingNum) * 100)) *
      100,
    )
    emits('getStatus', {
      syncingNum,
      failedNum,
      totalProgress,
      finishedNum: res?.length - syncingNum || 0,
    })
  },
  {
    immediate: true,
    deep: true,
  },
)

onMounted(() => {
  window.addEventListener('message', ({ data }) => {
    let res: any
    try {
      res = JSON.parse(data)
    } catch (error) {
      res = data
    }
    if (res.type === 'syncItem') {
      if (!list.value?.[userKey.value]) {
        list.value[userKey.value] = []
      }
      // console.log(res.data)
      list.value?.[userKey.value]?.unshift(res.data)
    }
  })
  setInterval(() => {
    if (list.value?.[userKey.value]?.length > 0) {
      for (let item of list.value?.[userKey.value]) {
        if (!item.finished) {
          typApi(item)
        }
      }
    }
  }, 1500)
})
</script>

<template lang="pug">
el-scrollbar.sync-list(:max-height="350")
  //- el-button(@click="test") 测试数据
  .sync-list__item(v-if="!isEmpty(list?.[userKey])" v-for="(item, i) in list?.[userKey]" :key="item.id" @click="test")
    .item-status-icon
      el-icon(:class="{'is-loading': item.syncing || !item.finished }" :color="item.finished && item.success === 1 ? 'var(--el-color-success)' : item.success === 2 ? 'var(--el-color-danger)' : 'var(--el-color-primary)'" :size="26")
        Select(v-show="item.success === 1 && item.finished")
        WarnTriangleFilled(v-show="item.success === 2")
        Refresh(v-show="item.syncing || !item.finished")
    .sync-list__item-right
      .sync-list__item-title
        span.name {{ item.name }}
        span.date-time {{handleTimes(item.dateTime)}}
          el-icon.more-handle(:size="13" @click="onHandle('delete', item)")
            Delete
      .progress-box
        el-progress.sync-list__item-progress(:status="item.success === 2 ? 'exception' : ''" :percentage="item.progress" :show-text="false" :duration="10" :stroke-width="3")
        span.progress-values {{ (item.progress || 0) + '%'}}
      //- .msg-box(v-if="item.success === 2")
      .msg-box(:class="{'is-error-msg': item.success === 2 }" v-if="item.success === 2 || item?.msgData")
        span {{ item?.msgData || item?.error }}

  el-empty(v-else description="暂无任务")
</template>
<style lang="scss" scoped>
.sync-list {
  position: relative;

  p.title {
    margin-bottom: 1rem;
  }

  .sync-list__item {
    display: flex;
    align-items: flex-start;
    min-height: 44px;
    cursor: default;
    padding: 0.4rem var(--el-popover-padding) !important;
    position: relative;

    .more-handle {
      cursor: pointer;
    }

    &:hover {
      background-color: var(--el-fill-color-light);
    }

    .item-status-icon {
      border-radius: 4px;
      width: 1.5625rem;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      margin-right: var(--el-popover-padding);
    }

    .sync-list__item-right {
      width: 100%;
    }

    .sync-list__item-title {
      font-size: .75rem;
      display: flex;
      justify-content: space-between;
      align-items: center;

      .name {
        // 省略号
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        flex: 1;
      }

      .date-time {
        font-size: 0.75rem;
      }

      .el-icon {
        margin-left: 0.5rem;
      }
    }

    .sync-list__item-progress {
      width: 100%;
    }

    // margin-bottom: 1rem;

    &:last-child {
      margin-bottom: 0;
    }
  }
}

.progress-box {
  display: flex;
  white-space: nowrap;
  align-items: center;
  margin-top: 0.1rem !important;

  .progress-values {
    margin-left: 0.35rem;
    font-size: 0.75rem;
  }
}

.msg-box {
  font-size: 12px;
  // position: absolute;
  // bottom: 0;
  color: var(--el-color-primary);
}

.is-error-msg {
  color: var(--el-color-danger) !important;
}
</style>
