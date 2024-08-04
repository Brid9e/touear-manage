import axios, {
  AxiosRequestConfig,
  AxiosInstance,
  // AxiosPromise,
  AxiosResponse,
} from 'axios'
import { store } from '@/store'
// import Vrouter from '@/router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { h, ref } from 'vue'
import { sign } from '@/assets/scripts/sign'
import { serializeObj, serialize } from '@/assets/scripts/utils'
import Cookie from '@/assets/scripts/cookie'
import qs from 'qs'
import initBaseConfigJson from '@/assets/scripts/initBaseConfig'
/**
 * { 缓存操作 }
 */
import Storage from '@/assets/scripts/storage'
import { isArray, isEmpty } from 'lodash'
import { needCatchUrl } from '../../../../api.config'

console.log('needCatchUrl', needCatchUrl)

/**
 * { 同步获取配置信息 }
 *
 * @type       {XMLHttpRequest}
 */
// const urlPath = document.referrer
// const urlPath = function () {
//   let url = null
//   if (parent !== window) {
//     try {
//       url = parent.location.href
//     } catch (e) {
//       url = document.referrer
//     }
//   }
//   return url
// }

// 首次打开到时候，初始化baseConfig
initBaseConfigJson()

const config = localStorage.configsManage
  ? JSON.parse(localStorage.configsManage)
  : {}
// console.log('urlPath', urlPath())
// console.log('urlPath', urlPath())
// const router = Vrouter
// const route = Vrouter.currentRoute.value

// 2,open, false表示同步请求

if (isEmpty(config)) {
  const oAjax = new XMLHttpRequest()
  let url = '/config/base.config.json'
  if (process.env.NODE_ENV === 'development') {
    url = '../../../../config/base.config.json'
    // url = '/manage/config/base.config.json'
  }
  oAjax.open('get', url, false)

  // 3,setHeader,get请求不需要
  oAjax.setRequestHeader('Content-type', 'application/x-www-form-urlencoded')

  // 4，定义返回触发的函数，定义在send之前，不然同步请求就出问题
  oAjax.onreadystatechange = function () {
    // 6,通过状态确认完成
    if (oAjax.readyState === 4 && oAjax.status === 200) {
      // 7,获取返回值，解析json格式字符串为对象
      const data = JSON.parse(oAjax.responseText)
      const newConfig = { ...data.management, ...config }
      Storage.set('configsManage', JSON.stringify(newConfig), false)
    } else {
      console.log(oAjax)
    }
  }
  // 5,发送
  oAjax.send()
}

const configs: any = Storage.get('configsManage', false)
let catchStatus = 0
class Service {
  // 需要缓存的数据的接口
  private needCatchResponseUrl = needCatchUrl
  private errorHandle(res: any, feedbackType: string) {
    console.log('errorHandle------', res)
    if (res.data.code === 8002) {
      store.dispatch('getCaptcha', res.data)
    }
    // 状态码判断
    let errMsg = res.data.message || res.data.msg
    switch (res.status) {
      case 401:
        if (catchStatus) return
        catchStatus = 401
        ElMessageBox.confirm(res.data.message, '警告', {
          confirmButtonText: '确定',
          showCancelButton: false,
          type: 'warning',
          closeOnClickModal: false,
          closeOnPressEscape: false,
          showClose: false,
        }).then(() => {
          Cookie.remove('_uuid')
          Cookie.remove('_type')
          sessionStorage.clear()
          const url =
            process.env.NODE_ENV === 'development'
              ? window.location.href + '?msg=' + res.data.message
              : window.location.origin + '/manage/login'
          window.location.href = url
          // window.history.pushState({}, '', url)
        })
        break
      case 403:
        errMsg = '服务器拒绝请求'
        console.log('Error Status:', res.status)
        break
      case 404:
        errMsg = '请求的资源不存在，请稍后再试'
        console.log('请求的资源不存在', res.status)
        break
      case 500:
        errMsg = '服务器内部错误，无法完成请求'
        break
      default:
        console.log('连接错误', res.status)
    }
    if (feedbackType === 'message') {
      ElMessage({
        type: 'error',
        grouping: true,
        message: errMsg,
      })
    } else if (feedbackType === 'messageBox') {
      ElMessageBox({
        title: '',
        center: true,
        type: 'error',
        showConfirmButton: false,
        customClass: 'common-error-feedback',
        message: h('p', null, [
          h('span', { style: 'color: #333;font-size: 16px' }, errMsg),
        ]),
      })
    }
  }

  constructor(public baseUrl: any = configs.base) {
    this.baseUrl = baseUrl
  }

  private fullUrl(url: any) {
    if (url.slice(0, 1) === '/') return url
    else return '/' + url
  }

  /**
   * { 请求方法 }
   * options:axios配置
   * feedbackType 错误反馈展示方式,默认为message消息提示("message": 消息提示；"messageBox": 弹框提示； "none":不展示错误信息)。
   */
  public request(options: AxiosRequestConfig, feedback?: string): Promise<any> {
    let feedbackType = feedback || 'message'
    // console.log('FeedbackType--------', feedbackType)
    const optUrl: any = options.url = (options.url as any).replace('-new/', '/')
    if (options.url?.slice(0, 1) !== '/' && !(/^https?:\/\//).test(optUrl)) options.url = '/' + options.url
    // options.url = process.env.NODE_ENV === 'development' ? options.url : (options.url as any).replace('-new/', '/')
    options = this.configs(options)
    const url: any = this.fullUrl(options.url)

    if (
      this.needCatchResponseUrl.includes(url) &&
      store.state.responseDataCatch[url]
    ) {
      return store.state.responseDataCatch[url]
    }
    const instance: AxiosInstance = axios.create({
      timeout: 30000,
    })

    this.interceptors(instance, url, feedbackType)

    return instance(options)
  }

  private configs(options: AxiosRequestConfig): AxiosRequestConfig {
    return Object.assign({ baseURL: this.baseUrl }, options)
  }

  /**
   * { 请求和响应拦截 }
   *
   * @param      {AxiosInstance}  instance     The instance
   * @param      {<type>}         url?:string  The url string
   */
  private interceptors(
    instance: AxiosInstance,
    url: any,
    feedbackType: string
  ) {
    instance.interceptors.request.use(
      (config: AxiosRequestConfig | any) => {
        if (store.state.token) {
          // const token = {
          //   token: store.state.token,
          //   token_type: store.state.token_type ? store.state.token_type : 'bearer'
          // }
          // config.headers['synjones-auth'] = `${token.token_type} ${token.token}`
          config.headers['synjones-auth'] = store.state.token
        }
        // 软授权
        config.headers['synAccessSource'] = 'management'
        const synAccessSource: any = {
          // synAccessSource: 'management'
        }
        const isFormData = (v: any) => {
          return Object.prototype.toString.call(v) === '[object FormData]'
        }
        if (config.method === 'post' || config.method === 'put') {
          if (
            config.headers &&
            config.headers['Content-Type'] ===
              'application/x-www-form-urlencoded'
          ) {
            const obj = { ...config.data, ...synAccessSource }
            config.data = qs.stringify(obj)
          } else if (isFormData(config.data)) {
            config.data.append('synAccessSource', 'management')
          } else if (isArray(config.data)) {
            config.data = [...config.data]
          } else if (Object.getPrototypeOf(config.data) === Object.prototype) {
            config.data = { ...config.data, ...synAccessSource }
          }
        } else if (config.method === 'get' || config.method === 'delete') {
          config.params = { ...config.params, ...synAccessSource }
        }
        return config
      },
      (error) => {
        return Promise.reject(error)
      }
    )
    instance.interceptors.response.use(
      (response: AxiosResponse) => {
        const {
          data,
          config: { url },
        }: any = response
        if (data.code === 200 || data.code === undefined) {
          if (this.needCatchResponseUrl.includes(url)) {
            store.state.responseDataCatch[url] = data
          }
          return data
        } else {
          this.errorHandle(response, feedbackType)
          return Promise.reject(response)
        }
      },
      (error) => {
        this.errorHandle(error.response, feedbackType)
        return Promise.reject(error)
      }
    )
  }
}
export interface IRes {
  code?: number
  data?: any
  msg: string
  success?: boolean
}
export interface IResLogin extends IRes {
  access_token: string
  client_id: string
  expires_in: number
  id: number
  jti: string
  loginFrom: string
  logintype: string
  name: string
  refresh_token: string
  sno: string
  token_type: string
  uuid: string
}
export default Service
