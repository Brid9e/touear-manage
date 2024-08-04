/*
 * @Author       : your name
 * @Date         : 2022-06-16 18:15:21
 * @LastEditTime: 2022-09-22 17:52:48
 * @LastEditors: Joe
 * @FilePath: /management/src/assets/scripts/file.ts
 */

// 网络图片转file文件(filename为文件名*,文件名必须带后缀名，如.jpg,.png))
const getFileFromOnlineImg = (url: string, filename?: string): Promise<any> => {
  const img = url
  let imgRes: any = ''
  return new Promise((resolve, reject) => {
    getBase64(img, (dataURL: any) => {
      if (!dataURL) {
        resolve(null)
      }
      // console.log('dataURL--------', dataURL)
      imgRes = dataURLtoFile(dataURL, filename ? filename : img)
      resolve(imgRes)
    })
  })
}
// 网络图片转Base64
const getBase64 = (url: any, callback: any) => {
  const Img = new Image()
  let dataURL = ''
  Img.src = url + '?v=' + Math.random() // 处理缓存,fix缓存bug,有缓存，浏览器会报错;
  Img.setAttribute('crossOrigin', 'Anonymous') // 解决控制台跨域报错的问题
  Img.onload = function () {
    //要先确保图片完整获取到，这是个异步事件
    const canvas = document.createElement('canvas'), //创建canvas元素
      width = Img.width, //确保canvas的尺寸和图片一样
      height = Img.height
    canvas.width = width
    canvas.height = height
    const ctx: any = canvas.getContext('2d')
    ctx.fillStyle = '#f40'
    ctx.drawImage(Img, 0, 0, width, height) //将图片绘制到canvas中
    dataURL = canvas.toDataURL('image/png') //转换图片为dataURL
    callback ? callback(dataURL) : null //调用回调函数
  }
  Img.onerror = () => {
    // alert('onerror')
    callback(0)
  }
}
// base64转换为file(dataurl为base64字符串;
const dataURLtoFile = (dataurl: any, filename: any) => {
  try {
    const arr = dataurl.split(',')
    const mime = arr[0].match(/:(.*?);/)[1]
    const bstr = atob(arr[1])
    let n: any = bstr.length
    const u8arr = new Uint8Array(n)
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n)
    }
    return new File([u8arr], filename, { type: mime })
  } catch {
    return null
  }
}
export { getFileFromOnlineImg }
