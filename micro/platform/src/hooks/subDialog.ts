/*
 * @Author: your name
 * @Date: 2021-10-11 10:48:13
 * @LastEditTime: 2022-04-15 10:19:21
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: /management/src/hooks/subDialog.ts
 */
import { ref, onMounted } from 'vue'
const subDialog = (W: number, H: number, className: string) => {
  const dLeft = ref('')
  const dTop = ref('')
  const dialogFlag = ref(false)
  const open = () => {
    window.parent.postMessage({ dialogOpen: true, dialogSize: { width: W, height: H } }, '*')
  }
  const setPosition = () => {
    const dom = document.querySelectorAll<HTMLElement>(className)
    console.log(dom)
    dom[0].style.left = dLeft.value
    dom[0].style.top = dTop.value
  }
  const close = () => {
    window.parent.postMessage({ dialogClose: true }, '*')
  }
  onMounted(() => {
    window.addEventListener('message', function (e) {
      console.log(e)
      if (e.data.parentWindowSize) {
        const parentW = e.data.parentWindowSize.W
        const parentH = e.data.parentWindowSize.H
        const wWidth = document.body.clientWidth
        const wHeight = e.data.parentWindowSize.iframeHeight
        const leftMeau = parentW - wWidth - 40
        const left = parentW / 2 - W / 2 - leftMeau - 20 + 'px'
        const top = (parentH - H) / 2 - (parentH - wHeight) + 'px'
        dLeft.value = left
        dTop.value = top
        dialogFlag.value = true
        if (e.data.windowResize) {
          setPosition()
        }
      }
      if (e.data.toCloseDialog) {
        console.log('走了哈哈')
        dialogFlag.value = false
      }
    })
  })
  return {
    dialogFlag,
    open,
    setPosition,
    close
  }
}
export { subDialog }
