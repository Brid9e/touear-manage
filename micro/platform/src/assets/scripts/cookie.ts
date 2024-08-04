import { unescape } from 'lodash'
/*
 * @Author       : Joe
 * @Date         : 2022-08-09 15:29:12
 * @LastEditTime : 2022-09-06 10:17:35
 * @LastEditors  : Joe
 * @FilePath     : /management/src/assets/scripts/cookie.ts
 */
class Cookie {
  public set = (key: string, val: string, time: any): void => {
    //设置cookie方法
    const date = new Date() //获取当前时间
    const expiresDays = time //将date设置为n天以后的时间
    date.setTime(date.getTime() + expiresDays * 24 * 3600 * 1000) //格式化为cookie识别的时间
    document.cookie = key + '=' + escape(val) + ';expires=' + date.toUTCString() //设置cookie
  }

  public get = (key: string) => {
    //获取cookie方法
    const getCookie = document.cookie.replace(/[ ]/g, '') //获取cookie，并且将获得的cookie格式化，去掉空格字符
    const arrCookie = getCookie.split(';') //将获得的cookie以"分号"为标识 将cookie保存到arrCookie的数组中
    let tips //声明变量tips
    for (let i = 0; i < arrCookie.length; i++) {
      //使用for循环查找cookie中的tips变量
      const arr = arrCookie[i].split('=') //将单条cookie用"等号"为标识，将单条cookie保存为arr数组
      if (key == arr[0]) {
        //匹配变量名称，其中arr[0]是指的cookie名称，如果该条变量为tips则执行判断语句中的赋值操作
        tips = arr[1] //将cookie的值赋给变量tips
        break //终止for循环遍历
      }
    }
    return unescape(tips)
  }

  public remove = (name: string) => {
    const exp = new Date()
    exp.setTime(exp.getTime() + -1 * 24 * 60 * 60 * 1000)
    const cval = this.get(name)
    document.cookie = name + '=' + cval + '; expires=' + exp.toUTCString()
  }
}

export default new Cookie()
