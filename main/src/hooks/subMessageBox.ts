export interface IMsgBoxOptions {
  title?: string
  message?: any
  showCancelButton?: boolean
  confirmButtonText?: string
  cancelButtonText?: string
  type?: string
  customClass?: string
}
const msgbox = {
  open: (options: IMsgBoxOptions): Promise<any> => {
    return new Promise((resolve) => {
      const data = {
        messageBox: true,
        messageBoxOptions: {
          ...options
        }
      }
      window.parent.postMessage(data, '*')
      window.addEventListener('message', function (e) {
        if (e.data.messageBoxAction) {
          resolve(e.data.messageBoxAction)
        }
      })
    })
  }
}
export { msgbox }
