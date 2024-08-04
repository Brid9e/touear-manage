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
      date = Y + parts[0] + M + parts[0] + D + parts[2] + HH + parts[1] + MM + parts[1] + SS
      break
    default:
      date = Y + parts[0] + M + parts[0] + D + parts[2] + HH + parts[1] + MM + parts[1] + SS
  }
  return date
}

export { dateFormat }
