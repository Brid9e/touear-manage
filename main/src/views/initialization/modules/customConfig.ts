import Axios from 'axios'
import { ElMessage } from 'element-plus'
import { cloneDeep, isEmpty, isObject, map } from 'lodash'

export default async (origin: any) => {
  //  默认全部
  let activeConfig: any = {
    nacos: [],
    middleware: ['redis', 'mq', 'es', 'minio'],
    db: ['base', 'school', 'ykt'],
    third: ['tsm', 'paymentplat'],
    sios: [],
    address: [],
    select_terminal: [],
    check_middleware: [],
    check_service: [],
    download_nginx_config: [],
    finish: [],
  }

  try {
    await Axios.get('/config/nacos.config.json')
      .then((r) => {
        if (r.status === 200 && !isEmpty(r?.data) && isObject(r?.data))
          sessionStorage.nacosConfigs = JSON.stringify(r.data)
          activeConfig = { nacos: [], ...r.data, finish: [] }
      })
      .catch(() => {})
  } catch (error) {
    //
  }

  // nacos和finish 必须存在
  const activeList = map(activeConfig, (v: any, k: any) => k)

  origin = origin?.filter((r: any) => activeList.includes(r.code))

  for (let v of origin) {
    for (let k in activeConfig) {
      if (v?.children) {
        let obj: any = {}
        for (let m of activeConfig[v.code]) {
          obj[m] = cloneDeep(v?.children)[m]
        }
        v.children = obj
      }
    }
  }

  console.log(origin)
  return origin
}
