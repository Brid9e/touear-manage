import CryptoJS from 'crypto-js'

// SHA256
const sha256 = (data: any) => {
  return CryptoJS.SHA256(data).toString()
}
// MD5
const md5 = (data: any) => {
  return CryptoJS.MD5(data).toString()
}

const getDateTimeToString = () => {
  const date_ = new Date()
  const year = date_.getFullYear()
  let month: any = date_.getMonth() + 1
  let day: any = date_.getDate()
  if (month < 10) month = '0' + month
  if (day < 10) day = '0' + day
  let hours: any = date_.getHours()
  let mins: any = date_.getMinutes()
  let secs: any = date_.getSeconds()
  const msecs = date_.getMilliseconds()
  if (hours < 10) hours = '0' + hours
  if (mins < 10) mins = '0' + mins
  if (secs < 10) secs = '0' + secs
  if (msecs < 10) secs = '0' + msecs
  return year + '' + month + '' + day + '' + hours + '' + mins + '' + secs
}

const getNonce = () => {
  return Math.random().toString(36).substring(2)
}

/**
 * 接口参数签名
 * @param {*} config 请求配置
 */
export const sign = (config: any, appId: any, appSecret: any, signType: any) => {
  // 获取到秒级的时间戳,与后端对应
  let data: any = {
    APP_ID: appId,
    TIMESTAMP: getDateTimeToString(),
    SIGN_TYPE: signType,
    NONCE: getNonce()
  }
  console.log('sign config', config)
  const _singKey = 'SIGN'
  const _secretKey = 'SECRET_KEY'
  let keys = []
  if (config.method === 'get') {
    // url参数签名
    data = config.params = Object.assign(config.params ? config.params : {}, data)
    keys = Object.keys(data)
  } else {
    console.log('post', config.data)
    // request body参数的内容
    data = config.data = Object.assign(config.data ? config.data : {}, data)
    keys = Object.keys(data)
  }
  // 排序
  const skeys = keys.sort()
  let str = ''
  skeys
    .filter((k) => {
      return k !== _singKey && k !== _secretKey
    })
    .map((k) => {
      const v = data[k]
      if (v || v === 0) {
        // 参数值为空，则不参与签名
        str = str + k + '=' + v + '&'
      }
    })
  str = str + _secretKey + '=' + appSecret

  console.log('sort', str)
  let sign = ''
  if (data.SIGN_TYPE === 'MD5') {
    sign = md5(str).toUpperCase()
  }
  if (data.SIGN_TYPE === 'SHA256') {
    sign = sha256(str).toUpperCase()
  }
  if (config.method === 'get') {
    config.params[_singKey] = sign
  } else {
    config.data[_singKey] = sign
  }
  return config
}
