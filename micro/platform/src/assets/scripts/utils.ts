/*
 * @Author: your name
 * @Date: 2021-11-23 14:36:21
 * @LastEditTime: 2022-04-20 11:42:10
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /management/src/assets/scripts/utils.ts
 */
import { decode } from 'js-base64'
import { ElMessage } from 'element-plus'

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
        strs[i].split('=')[1]
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
      contentDisposition.split('filename=')[1]
  )
  const blob = new Blob([result] || [result.data])
  console.log('blob', blob)
  const url = window.URL.createObjectURL(blob)
  console.log('url', url)
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
      .filter((item: any) => {
        return item.parentId === id
      })
      .forEach((item: any) => {
        if (item.status === 0) {
          return
        }
        arr.push({
          node: item.menuId,
          name: item.menuName,
          target: item.target,
          index:
            item.path == null ? String(item.menuId) : item.scheme + item.path,
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
        item.menuId
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

const guid = (): string => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0,
      v = c == 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

const isEnable = (code: string): boolean => {
  const _o = sessionStorage.getItem('actionMap') || '{}'
  const _v = JSON.parse(decode(_o) || '{}')
  return _v[code] ? true : false
}
// 复制到剪贴板
const copyclip = (data: any) => {
  let domInput = document.createElement('input')
  domInput.value = data
  document.body.appendChild(domInput) // 添加input节点
  domInput.select() // 选择对象;
  document.execCommand('Copy') // 执行浏览器复制命令
  ElMessage({
    showClose: true,
    message: '复制成功',
    type: 'success',
  })
  domInput.remove()
}

/**
 *
 * @date 2022-11-24 14:01:25
 * @author Joe
 * @description 自定义生成表的树结构
 *
 */
const getTableTree = {
  // 开始递归方法
  generateOptions: (
    data: any,
    params: { nodeKey: string; parentNodeKey: string; childrenKey: string },
    append = {}
  ) => {
    let result = []
    for (const param of data) {
      if (!param?.[params.parentNodeKey]) {
        // 判断是否为顶层节点
        let parent: any = {
          ...param,
          ...append,
        }
        parent[params.childrenKey] = getTableTree.getchilds(
          param?.[params.nodeKey],
          data,
          append
        ) // 获取子节点
        result.push(parent)
      }
    }
    return result
  },
  getchilds: (code: any, array: any, append = {}) => {
    let childs: any = []
    for (const obj of array) {
      // 循环获取子节点
      if (obj.parentId === code) {
        childs.push({ ...obj, ...append })
      }
    }
    for (const child of childs) {
      // 获取子节点的子节点
      const childscopy = getTableTree.getchilds(child.id, array) // 递归获取子节点
      if (childscopy.length > 0) {
        child.children = childscopy
      }
    }
    return childs
  },
  replaceObjectById(array: any, id: any, newObject: any, cusKey:{ idKey: string, childrenKey: string }) {
    for (let i = 0; i < array.length; i++) {
      const obj = array[i]
      if (obj[cusKey.idKey] === id) {
        array[i] = newObject
        if (obj[cusKey.childrenKey]) {
          obj[cusKey.childrenKey] = getTableTree.replaceObjectById(obj[cusKey.childrenKey], id, newObject, cusKey)
        }
        break // 如果只想替换第一个匹配项，可注释此行
      } else if (obj[cusKey.childrenKey]) {
        obj[cusKey.childrenKey] = getTableTree.replaceObjectById(obj[cusKey.childrenKey], id, newObject, cusKey)
      }
    }
    return array
  }
}
// 日期格式化 type (YYYY-MM, YYYY-MM-DD, MM-DD)   date 默认为当前时间
const dateFormat = (type? :any, date?: any) => {
  const n = date || new Date()
  const Y = n.getFullYear()
  const M = (n.getMonth() + 1) < 10 ? '0' + (n.getMonth() + 1) : n.getMonth() + 1
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
    default:
      date = Y + parts[0] + M + parts[0] + D + parts[2] + HH + parts[1] + MM + parts[1] + SS
  }
  return date
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
  guid,
  isEnable,
  copyclip,
  getTableTree,
  dateFormat
}
