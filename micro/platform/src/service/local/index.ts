import axios from 'axios'
// 本地资源文件
export class Local {
  // 终端类型数据
  static getPlayType = (): Promise<any> => {
    return axios.get(process.env.NODE_ENV === 'development' ? '/static/defaultData/paltType.json' : '/manage/static/defaultData/paltType.json').then((res) => {
      return Promise.resolve(res)
    })
  }
  // 统一身份认证跳转地址
  static thirdLoginUrl = (): Promise<any> => {
    return axios.get(process.env.NODE_ENV === 'development' ? '/static/defaultData/thirdLoginUrl.json' : '/manage/static/defaultData/thirdLoginUrl.json').then((res) => {
      return Promise.resolve(res)
    })
  }
}
