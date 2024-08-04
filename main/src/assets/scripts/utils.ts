/*
 * @Author: your name
 * @Date: 2021-11-23 14:36:21
 * @LastEditTime: 2024-05-10 21:27:29
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /management_micro/main/src/assets/scripts/utils.ts
 */
/*
  处理url参数
*/
const getRequest = (url: string) => {
  const theRequest: any = {}
  if (url.indexOf('?') !== -1) {
    // 获取url中"?"符后的字串
    const str = url.substr(url.indexOf('?') + 1)
    const j = url.indexOf('?')
    const k = url.indexOf('#')
    let strs: any = ''
    if (j > k) {
      strs = str.split('&')
    } else if (j < k) {
      const str2 = str.slice(0, str.indexOf('#'))
      strs = str2.split('&')
    }
    for (let i = 0; i < strs.length; i++) {
      theRequest[strs[i].split('=')[0]] = decodeURIComponent(
        strs[i].split('=')[1],
      )
    }
  }
  return theRequest
}

const getGreetings = (): string => {
  const now = new Date().getHours()
  let str = ' '
  if (now > 0 && now <= 6) {
    str = '午夜好'
  } else if (now > 6 && now <= 9) {
    str = '早上好'
  } else if (now > 9 && now <= 12) {
    str = '上午好'
  } else if (now > 12 && now <= 14) {
    str = '中午好'
  } else if (now > 14 && now <= 17) {
    str = '下午好'
  } else if (now > 17 && now <= 19) {
    str = '傍晚好'
  } else {
    str = '晚上好'
  }
  return str
}

const exportFile = (result: any) => {
  const contentDisposition = result.headers['content-disposition']
  const filename = decodeURI(
    contentDisposition.split('fileName=')[1] ||
      contentDisposition.split('filename=')[1],
  )
  const blob = new Blob([result] || [result.data])
  const url = window.URL.createObjectURL(blob)
  let _window: any = window
  if (_window.navigator.msSaveBlob) {
    try {
      _window.navigator.msSaveBlob(blob, filename)
    } catch (e) {
      console.log(e)
    }
  } else {
    const link = document.createElement('a')
    link.style.display = 'none'
    link.href = url
    link.setAttribute('download', filename)
    document.body.appendChild(link)
    link.click()
  }
}

// 通过递归生成菜单树结构，data为原始数据，pid为最顶层父元素的id
const toTreeData = (data: any, pid: any) => {
  const tree = (id: any) => {
    const arr: any = []
    data
      .filter((item: any) => item.parentId === id)
      .forEach((item: any) => {
        if (item.status === 0) return
        arr.push({
          node: item.menuId,
          name: item.menuName,
          target: item.target,
          index: !item.path ? String(item.menuId) : item.scheme + item.path,
          icon: item.icon,
          child: tree(item.menuId),
          status: item.status,
        })
      })
    for (const i of arr) {
      if (i.child.length == 0) {
        delete i.child
      } else {
        for (const j of i.child) {
          j.parentNode = i.node
        }
      }
    }
    // store.commit('menuData', arr)
    return arr
  }
  return tree(pid) // 第一级节点的父id，是null或者0，视情况传入
}

// 将某个节点的所有父节点找出
const familyTree = (arr_: any, id: any) => {
  const temp: any = []
  const forFn = function (arr: any, id: any) {
    for (let i = 0; i < arr.length; i++) {
      const item = arr[i]
      if (item.node === id) {
        temp.unshift(item)
        forFn(arr_, item.parentNode)
        break
      } else {
        if (item.child) {
          forFn(item.child, id)
        }
      }
    }
  }
  forFn(arr_, id)
  return temp
}

const arrayToTree = (arr: Array<any>, pid: string | number) => {
  const res: Array<any> = []
  arr.forEach((item: any) => {
    if (item.parentId == pid) {
      item.label = item.menuName
      item.id = item.parentId
      const children = arrayToTree(
        arr.filter((v) => v.pid != pid),
        item.menuId,
      )
      if (children.length) {
        res.push({
          ...item,
          children,
        })
      } else {
        res.push({ ...item })
      }
    }
  })
  return res
}
/**
 * 对象转键值对
 * @param {*} obj
 */
const serialize = (obj: any) => {
  const str = []
  for (const key in obj) {
    if (key) {
      str.push(encodeURIComponent(key) + '=' + encodeURIComponent(obj[key]))
    }
  }
  // for (const key in obj) {
  //   console.log(typeof obj[key])
  //   if (typeof obj[key] === 'object') {
  //     for (const subey in object) {
  //       if (Object.prototype.hasOwnProperty.call(object,subkey)) {
  //         const element = objectsubkey];

  //       }
  //     }
  //   } else {
  //   }
  //   // if (key) {
  //   //   str.push(encodeURIComponent(key) + '=' + encodeURIComponent(obj[key]))
  //   // }
  // }
  // console.log(str.join('&'))
  return str.join('&')
}
/**
 * 键值对转对象
 * @str {*} 键值对字符串
 * @type 类型 str-> json字符串  obj->对象 默认obj
 */
const serializeObj = (str: string, type?: any) => {
  const newArr = str.replace(/&/g, ',').split(',')
  const obj: any = {}
  let json = ''
  for (const item in newArr) {
    const key = newArr[item].split('=')[0]
    const value = newArr[item].split('=')[1]
    obj[key] = value
  }
  if (type === 'str') json = JSON.stringify(obj)
  return type === 'str' ? json : obj
}
const getCookie = (): any => {
  const cookie = document.cookie.replace(/\s*/g, '')
  const cookieData = cookie.split(';')
  const obj: any = {}
  for (const val of cookieData) {
    obj[val.split('=')[0]] = val.split('=')[1]
  }
  return obj
}
/*
  删除对象key
*/
const objDelete = (obj: any, ...args: any) => {
  args.forEach((v: any) => {
    delete obj[v]
  })
  return obj
}

//生成uuid

const guid = (split = '-'): string => {
  return `xxxxxxxx${split}xxxx${split}4xxx${split}yxxx${split}xxxxxxxxxxxx`.replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0,
      v = c == 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

/*
  金额格式化
*/
const money = (num: any, point: number) => {
  const pow = 10 ** point
  num = num.toString().replace(/\$|/g, '')
  if (isNaN(num)) {
    num = '0'
  }
  const sign = Number(num) === (num = Math.abs(num))
  num = Math.floor(num * pow + 0.50000000001)
  let cents: number | string = num % pow
  num = Math.floor(num / pow).toString()
  if (cents < pow / 10) {
    cents = '0' + cents
  }
  for (let i = 0; i < Math.floor((num.length - (1 + i)) / 3); i++) {
    num =
      num.substring(0, num.length - (4 * i + 3)) +
      ',' +
      num.substring(num.length - (4 * i + 3))
  }
  return (sign ? '' : '-') + num + (point === 0 ? '' : '.' + cents)
}

export {
  getRequest,
  getGreetings,
  exportFile,
  toTreeData,
  familyTree,
  arrayToTree,
  serialize,
  serializeObj,
  objDelete,
  money,
  guid
}
