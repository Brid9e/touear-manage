/*
 * @Author: your name
 * @Date: 2021-08-18 16:36:51
 * @LastEditTime: 2022-04-08 14:54:22
 * @LastEditors: your name
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: /management/src/assets/scripts/storage.ts
 */
/**
 * { 转字符串 }
 *
 * @param      {<Any>}
 * @return     {<String>}  { 如果传入值为对象/数组则转字符串，其他不处理 }
 */
const strings = (value: any) => (typeof value === 'object' ? JSON.stringify(value) : value)

/**
 * { 解析字符串 }
 *
 * @param      {<String>}
 * @return     {<Any>}  { 如果传入值为对象字符串则返回对象，其他不处理 }
 * @return     {<Any>}  { parse('{"a":1,"b":2}') // => {"a":1,"b":2} }
 * @return     {<Any>}  { parse('abcd') // => "abcd" }
 * @return     {<Any>}  { parse('1') 或 parse('1') // => 1/true }
 */
const parse = (value: any) => {
  if (typeof value === 'string') {
    try {
      value = JSON.parse(value, (key, val) => {
        if (key === '') {
          if (typeof val === 'number') {
            return value
          }
        }
        return val
      })
      return value
    } catch (e) {
      // console.error('对象字符串格式错误', 'Storage', e.message)
      return value
    }
  }
}

const storage = {
  /**
   * { 保存本地数据 }
   *
   * @param      {<String>}   key      指定键的值
   * @param      {<String>}   value    保存内容值
   * @param      {<Boolean>}  session  是否保存到sessionStorage
   */
  set: (key: string, value: any, session: boolean) => {
    if (session) {
      sessionStorage.setItem(key, strings(value))
    } else {
      localStorage.setItem(key, strings(value))
    }
  },

  /**
   * { 获取本地数据 }
   *
   * @param      {<String>}   key      指定键的值
   * @param      {Boolean}    session  是否获取sessionStorage
   */
  get: (key: string, session: boolean) => (session ? parse(sessionStorage.getItem(key)) : parse(localStorage.getItem(key))),

  /**
   * { 删除本地数据 }
   *
   * @param      {<String>}   key      指定键的值
   * @param      {Boolean}    session  是否删除sessionStorage
   */
  remove: (key: string, session: boolean) => (session ? sessionStorage.removeItem(key) : localStorage.removeItem(key)),

  /**
   * { 清除所有本地数据 }
   *
   * @param      {Boolean}  session  是否清除所有sessionStorage
   */
  clear: (session: any) => (session ? sessionStorage.clear() : localStorage.clear())
}

export default storage
