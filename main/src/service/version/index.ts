import { map, orderBy, uniqBy } from 'lodash'
import { microAppList } from '../../../../api.config'

const isDev = process.env.NODE_ENV === 'development'

// dev
let maxPort = 9000
let startPort = 7100
const hostName = window.location.hostname
const protocol = window.location.protocol
const origin = window.location.origin

// proj
const childrenApp = map(microAppList, 'code')

// 版本列表
let vList: any = []

// 版本信息转换为对象
const text2Json = (text: string) => {
  const str = text
  let result: any = {}
  if (str.indexOf('|') > -1) {
    const keyValuePairs = str.split('|')
    // 遍历键值对数组，并将其分割成键和值，然后存储到对象中
    keyValuePairs.forEach((keyValue) => {
      const [key, ...valueParts] = keyValue.split(':')
      const value = valueParts.join(':').trim()
      result[key.trim()] = value
    })
  } else {
    const strArr = str.split('-')
    result = {
      name: strArr?.[0],
      version: strArr?.[1],
      date: strArr?.[2],
    }
  }
  return result
}

// 获取noscript标签之间的内容
const noscriptText = (html: any) => {
  let contentWithinNoscript: any = ''
  let code: any = ''
  const regex = /<noscript>([\s\S]*?)<\/noscript>/ // 正则表达式匹配 noscript 标签
  const regexApp = /global\.qiankunName\s*=\s*'([^']+)'/
  const match = regex.exec(html)
  const matchApp = regexApp.exec(html)
  if (match) contentWithinNoscript = match?.[1] || undefined
  if (matchApp) code = matchApp?.[1] || undefined
  let vObj: any = { code, ...text2Json(contentWithinNoscript) }
  return vObj
}

// install
const version = {
  async install() {
    let isOver = false
    if (isDev) {
      for (let port = startPort; port < maxPort; port += 100) {
        if (isOver) break
        await fetch(`${protocol}//${hostName}:${port}/`)
          .then((r) => {
            return r.text() // 获取HTML文本
          })
          .then((html) => {
            vList.push(noscriptText(html))
          })
          .catch(() => {
            isOver = true
          })
      }
    } else {
      for (let v of childrenApp) {
        if (isOver) break
        await fetch(`${origin}/${v}`)
          .then((r) => {
            return r.text() // 获取HTML文本
          })
          .then((html) => {
            vList.push(noscriptText(html))
          })
          .catch(() => {
            isOver = true
          })
      }
    }
    for (let v of vList) {
      if (!v.code) v.code = 'manage'
      if (v?.name?.includes('布局')) v.code = 'layout-editor'
    }
    vList = uniqBy(orderBy(vList, ['date'], ['asc']), 'code')
    localStorage.version = JSON.stringify(vList)
    console.table(vList)
  },
}

export default version
