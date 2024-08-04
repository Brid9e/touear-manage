/*
 * @Author: your name
 * @Date: 2021-08-31 10:25:20
 * @LastEditTime: 2021-09-09 18:52:04
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /management/src/assets/scripts/date.ts
 */

// 用户类型
const userType = (type: string) => {
  let usertypeName = ''
  switch (type) {
    case 'user':
      usertypeName = '用户'
      break
    case 'mercacc':
      usertypeName = '商户'
      break
    case 'common':
      usertypeName = '通用'
      break
    default:
      usertypeName = '无'
  }
  return usertypeName
}

export { userType }
