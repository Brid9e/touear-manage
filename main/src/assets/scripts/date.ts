/*
 * @Author: your name
 * @Date: 2021-08-31 10:25:20
 * @LastEditTime: 2021-11-11 16:32:31
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /management/src/assets/scripts/date.ts
 */

// 日期格式化 type (YYYY-MM, YYYY-MM-DD, MM-DD)   date 默认为当前时间
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
const dateFormat = (type: string, date?: any) => {
  const n = date || new Date()
  const Y = n.getFullYear()
  const M = n.getMonth() + 1 < 10 ? '0' + (n.getMonth() + 1) : n.getMonth() + 1
  const D = n.getDate() < 10 ? '0' + n.getDate() : n.getDate()
  const HH = n.getHours() < 10 ? '0' + n.getHours() : n.getHours()
  const MM = n.getMinutes() < 10 ? '0' + n.getMinutes() : n.getMinutes()
  const SS = n.getSeconds() < 10 ? '0' + n.getSeconds() : n.getSeconds()
  const parts = ['-', ':', ' ']
  switch (type) {
    case 'YYYY-MM':
      date = Y + parts[0] + M
      break
    case 'YYYY-MM-DD':
      date = Y + parts[0] + M + parts[0] + D
      break
    case 'MM-DD':
      date = M + parts[0] + D
      break
    case 'HH:MM:SS':
      date = HH + parts[1] + MM + parts[1] + SS
      break
    case 'YYYY-MM-DD HH-MM-SS':
      date =
        Y +
        parts[0] +
        M +
        parts[0] +
        D +
        parts[2] +
        HH +
        parts[1] +
        MM +
        parts[1] +
        SS
      break
    default:
      date =
        Y +
        parts[0] +
        M +
        parts[0] +
        D +
        parts[2] +
        HH +
        parts[1] +
        MM +
        parts[1] +
        SS
  }
  return date
}
// 日期字符串转时间戳
const getTimestamp = (str: any) => {
  // const dateString = 'YYYY-MM-DD HH:mm:ss';
  const timestamp = new Date(str).getTime();
  // str = str.replace(/-/g, '/')
  // var date = new Date(str)
  // var humanDate = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds()))
  // return humanDate.getTime() / 1000 - 8 * 60 * 60
  return timestamp
}

/**
 * 有效期
 * @returns
 */
const expirationTime = (tenantExpirationTime: any, limitDays = 30) => {
  if (tenantExpirationTime === '-1') {
    return {
      days: -1,
      msg: '有效期：永久有效',
      type: '',
      safe: true
    }
  } else {
    // 计算两个时间之间的天数
    const days = daysBetween(new Date(), tenantExpirationTime)
    if (days <= limitDays) {
      if (days < 0) {
        return {
          days,
          value: '已过期',
          msg: `已过期`,
          type: 'danger',
          safe: false
        }
      }
      return {
        days,
        value:  `剩余 ${days} 天到期`,
        msg: `剩余 ${days} 天到期`,
        type: 'danger',
        safe: false
      }
    } else {
      return {
        days,
        value: tenantExpirationTime,
        msg: `有效期：${tenantExpirationTime}`,
        type: '',
        safe: true
      }
    }
  }

  /**
   * 两天之间的天数
   */
  function daysBetween(date1: any, date2: any) {
    // 清除时间部分，只保留日期
    const startOfDay1 = new Date(date1)
    const startOfDay2 = new Date(date2)
    startOfDay1.setHours(0, 0, 0, 0)
    startOfDay2.setHours(0, 0, 0, 0)
    // 计算两个日期之间的毫秒数差
    const timeDifference = startOfDay2.getTime() - startOfDay1.getTime()
    // 将毫秒数转换为天数
    const daysDifference = Math.floor(timeDifference / (1000 * 3600 * 24))
    return daysDifference
  }

}

export { dateFormat, getTimestamp, expirationTime }
