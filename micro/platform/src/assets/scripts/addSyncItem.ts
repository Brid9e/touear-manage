/*
 * @LastEditTime: 2024-04-03 15:33:23
 */
import dayjs from 'dayjs'
import { guid } from './utils'

function addSyncItem(params: any, callback?: any) {
  const syncItem = {
    ...params,
    id: guid(),
    progress: 0,
    finished: false,
    failed: false,
    syncing: true,
    success: 0,
    name: params.name,
    url: params.url,
    method: params.method,
    params: params.params,
    dateTime: dayjs().format('YYYY-MM-DD HH:mm'),
    key: params.key || '',
    errorKey: params.errorKey || 'msg',
  }
  if (typeof syncItem?.msg === 'function') {
    syncItem.msg = syncItem.msg.toString()
  }
  window.postMessage(JSON.stringify({ type: 'syncItem', data: syncItem }))
}

/**
 * 监听成功失败的回调
 * @param callback
 */
function listenerSyncItem(callback: any) {
  window.addEventListener('message', (val) => {
    const data = val?.data
    let res: any
    try {
      res = JSON.parse(data)
    } catch (error) {
      res = data
    }
    if (res.type === 'syncOver') {
      callback(res)
    }
  })
}

export { addSyncItem, listenerSyncItem }
