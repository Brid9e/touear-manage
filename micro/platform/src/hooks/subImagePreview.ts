/*
 * @Author: your name
 * @Date: 2021-12-06 10:00:27
 * @LastEditTime: 2022-04-15 10:04:19
 * @LastEditors: your name
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: /management/src/hooks/subImagePreview.ts
 */
interface Iurl {
  url: string
}
interface Idata {
  urlList: Iurl[]
  zIndex?: number
  initialIndex?: number
  infinite?: boolean
  hideOnClickModal?: boolean
}
const imagePreview = (data: Idata): void => {
  const obj = {
    urlList: data.urlList, // 图片地址,（注：本地图片仅至支持'@/assets/images'目录下的图片， 如图片完整地址为：'@/assets/images/icon/arrow.png',传入'/icon/arrow.png'即可)
    zIndex: data.zIndex !== undefined ? data.zIndex : 2000, // 层级
    initialIndex: data.initialIndex !== undefined ? data.initialIndex : 0, // 打开展示第几张图
    infinite: data.infinite !== undefined ? data.infinite : true, // 是否循环
    hideOnClickModal: data.hideOnClickModal !== undefined ? data.hideOnClickModal : false // 点击遮罩是否关闭
  }
  window.parent.postMessage(
    {
      imagePreview: obj
    },
    '*'
  )
}
export { imagePreview }
