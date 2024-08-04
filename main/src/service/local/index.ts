import axios from 'axios'
// 本地资源文件
export class Local {
  // 终端类型数据
  static getPlayType = (): Promise<any> => {
    return axios.get(process.env.NODE_ENV === 'development' ? '../../static/defaultData/paltType.json' : '/manage/static/defaultData/paltType.json').then((res) => {
      return Promise.resolve(res)
    })
  }
  // 退费导入模版
  static refoundTemp = (): Promise<any> => {
    return axios.get(process.env.NODE_ENV === 'development' ? '/static/defaultData/refoundTemp.json' : '/manage/static/defaultData/refoundTemp.json').then((res) => {
      return Promise.resolve(res)
    })
  }
}
