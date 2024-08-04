import { computed } from 'vue'
import { getRequest } from '@/assets/scripts/utils'
import { store } from '@/store'
import { useSessionStorage } from '@vueuse/core'

const tenantInfo: any = useSessionStorage('tenantInfo', {})
const href = window.location.href

const tenId = computed(() => {
  return sessionStorage.authPath?.split('-')?.[1]
})

// 给其他标签页发送消息
function postMessage(tenantId: any) {
  window.addEventListener('beforeunload', function () {
    window.opener?.postMessage({ tenantId, type: 'close' })
  })
  window.addEventListener('DOMContentLoaded', () => {
    setInterval(() => {
      window.opener?.postMessage({ tenantId, type: 'open' })
    }, 1000)
  })
}

if (href.indexOf('ten-') > -1) {
  const regex = /manage\/(\S+?)(?=\/|$)/
  const match = regex.exec(href)
  if (match) {
    const result = match[1]
    const tenantId = result?.split('-')?.[1]
    // 用authPath判断是刷新还是新页面打开
    if (!sessionStorage.authPath) {
      sessionStorage.removeItem('shortcut')
      sessionStorage.removeItem('menuData')
      sessionStorage.removeItem('platTypeList')
      sessionStorage.removeItem('platTypeLevel')
      sessionStorage.removeItem('platMediaTypeLevel')
    }
    sessionStorage.authPath = `/ten-${tenantId}`
    sessionStorage.token = tenantInfo.value?.[tenantId]?.token
    window.document.title = `${window.document.title}#${tenantInfo.value?.[tenantId]?.tenantName}`
    postMessage(tenantId)
  } else {
    sessionStorage.authPath = ''
  }
} else {
  sessionStorage.authPath = ''
}

// console.log('testestse')
// const urlQuery = getRequest(window.location.href)

// // if (urlQuery.tName) {
// //   window.document.title = window.document.title + '#' + urlQuery.tName
// // }
// if (urlQuery.token) {
//   token.value[urlQuery.tenantId] =
//     store.state.token =
//     sessionStorage.token =
//       urlQuery.token
// }
