interface LanguageData {
  cn: {
    [key: string]: any
  },
  en: {
    [key: string]: any
  },
  hk: {
    [key: string]: any
  },
  [key: string]: any
}

interface MergedData {
  [key: string]: string | MergedData | any
}


// 暴露方法
const mergeJSONData = (data: LanguageData): MergedData => {
  const mergedData: MergedData = {}
  for (const lang in data) mergeData(mergedData, data[lang], lang)
  return mergedData
}

// 合并多语言数据的具体实现
const mergeData = (target: MergedData, source: LanguageData, language: string): MergedData => {
  for (const key in source) {
    if (Object.prototype.hasOwnProperty.call(source, key)) {
      const sourceValue = source[key]
      const targetValue = target[key]

      if (typeof sourceValue === 'string') {
        if (typeof targetValue === 'object') {
          target[key] = {
            ...targetValue,
            [language]: sourceValue,
          }
        } else {
          target[key] = {
            cn: '',
            en: '',
            hk: '',
            [language]: sourceValue,
          }
        }
      } else {
        if (typeof targetValue === 'object') {
          mergeData(targetValue as MergedData, sourceValue as LanguageData, language)
        } else {
          target[key] = mergeData({}, sourceValue as LanguageData, language)
        }
      }
    }
  }

  return target
}



export default mergeJSONData
