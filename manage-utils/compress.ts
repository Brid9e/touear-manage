// 封装一个获取变量的数据类型函数
const getType = (data: any): string => {
  const toStingResult = Object.prototype.toString.call(data)
  const type = toStingResult.replace(/^\[object (\w+)\]$/, '$1')
  return type.toLowerCase()
}

// 封装一个将 Base64 的字符串转换成 Blob 流的函数
const dataURLtoBlob = (dataURL: string): Blob | null => {
  const dataType = getType(dataURL)
  if (dataType !== 'string') return null
  const arr = dataURL.split(',')
  if (!arr[0] || !arr[1]) return null
  const code = window.atob(arr[1])
  const mimeExpRes = arr[0].match(/:(.*?);/)
  if (!mimeExpRes) return null
  let len = code.length
  const mime = mimeExpRes[1]
  if (!mime) return null
  const ia = new Uint8Array(len)
  while (len--) ia[len] = code.charCodeAt(len)
  return new Blob([ia], { type: mime })
}

// 利用规律编码格式把里面的标记以及值等分割开来，传原图片的 ArrayBuffer 进来
const getSegments = (arrayBuffer: ArrayBuffer): number[][] => {
  if (!arrayBuffer.byteLength) return []
  let head = 0
  let length, endPoint, seg
  const segments: number[][] = []
  const arr = Array.from(new Uint8Array(arrayBuffer))
  while (1) {
    if (arr[head] === 0xff && arr[head + 1] === 0xda) break
    if (arr[head] === 0xff && arr[head + 1] === 0xd8) {
      head += 2
    } else {
      length = arr[head + 2] * 256 + arr[head + 3]
      endPoint = head + length + 2
      seg = arr.slice(head, endPoint)
      head = endPoint
      segments.push(seg)
    }
    if (head > arr.length) break
  }
  return segments
}

// 传入上面 getSegments 的返回值，取出EXIF图片元信息
const getEXIF = (segments: number[][]): number[] => {
  if (!segments.length) return []
  let seg: number[] = []
  for (let i = 0; i < segments.length; i++) {
    const item = segments[i]
    if (item[0] === 0xff && item[1] === 0xe1) {
      seg = seg.concat(item)
    }
  }
  return seg
}

// 将 getEXIF 获取的元数据信息，插入到压缩后的图片的 Blob 中，传 压缩图片后的 Blob 流
const insertEXIF = (blob: Blob, exif: number[]): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader()
    fileReader.onload = () => {
      const arr = Array.from(new Uint8Array(fileReader.result as ArrayBuffer))
      if (arr[2] !== 0xff || arr[3] !== 0xe0) {
        return reject(new Error("Couldn't find APP0 marker from blob data"))
      }
      const length = arr[4] * 256 + arr[5]
      const newImage = [0xff, 0xd8, ...exif, ...arr.slice(4 + length)]
      const uint8Array = new Uint8Array(newImage)
      const newBlob = new Blob([uint8Array], { type: 'image/jpeg' })
      resolve(newBlob)
    }
    fileReader.readAsArrayBuffer(blob)
  })
}

// 压缩图片逻辑
const compressImage = (file: File, quality: number): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader()
    fileReader.onload = () => {
      const img = new Image()
      img.src = fileReader.result as string
      img.onload = () => {
        const { width, height } = img
        const canvas = window.document.createElement('canvas')
        const ctx = canvas.getContext('2d')
        if (!ctx)
          return reject(new Error("Canvas context couldn't be obtained"))
        canvas.width = width
        canvas.height = height
        ctx.drawImage(img, 0, 0, width, height)
        const fileData = canvas.toDataURL('image/jpeg', quality)
        const fileBlob = dataURLtoBlob(fileData)
        if (fileBlob) {
          resolve(fileBlob)
        } else {
          reject(new Error("Couldn't convert data URL to Blob"))
        }
      }
      img.onerror = (err) => reject(err)
    }
    fileReader.onerror = (err) => reject(err)
    fileReader.readAsDataURL(file)
  })
}

/**
 *
 * @date 2023-04-13 14:58:54
 * @author Joe
 * @description 完整的压缩图片，最终对外暴露的函数
 *
 */
export default (file: File, quality: number = 0.5): Promise<File> => {
  return new Promise((resolve, reject) => {
    const dataType = getType(file)
    if (dataType !== 'file')
      return reject(
        new Error(`Expected parameter type is file, You passed in ${dataType}`),
      )
    if (file.type.indexOf('image') === -1) return resolve(file)
    // 压缩图片
    compressImage(file, quality)
      .then((compressedBlob) => {
        if (!compressedBlob) return resolve(file)
        const fileReader = new FileReader()
        fileReader.onload = () => {
          // 获取图片元信息
          const segments = getSegments(fileReader.result as ArrayBuffer)
          const exif = getEXIF(segments)
          // 没有元数据, 直接抛出压缩后的图片
          if (!exif.length)
            return resolve(
              new File([compressedBlob], file.name, {
                type: file.type,
                lastModified: file.lastModified,
              }),
            )
          // 有元数据, 将元信息合并到压缩图片里
          insertEXIF(compressedBlob, exif)
            .then((newBlob) =>
              resolve(
                new File([newBlob], file.name, {
                  type: file.type,
                  lastModified: file.lastModified,
                }),
              ),
            )
            .catch(() => resolve(file))
        }
        fileReader.onerror = () => resolve(file)
        fileReader.readAsArrayBuffer(file)
      })
      .catch(() => resolve(file))
  })
}
