<script lang='ts' setup>
import { ref, onMounted, watch, computed, onUnmounted } from 'vue'
import { key } from '@/store'
import { useStore } from 'vuex'
import { cloneDeep, isEmpty, size, map, some, every, clone, keys } from 'lodash'
import { useRouter } from 'vue-router'
import { Card, Step, SelectTerminal, nacosConfigs, customConfig } from './modules'
import { initConfig, getServiceStatus, getMiddleware, getTestRes } from '@/service/manage'
import { ElMessage } from 'element-plus'
import { CircleCheck, Loading, Select, CloseBold, Download } from '@element-plus/icons-vue'
import 'animate.css'

const defaultLoginImgPul = new URL('../../assets/images/background-management.png', import.meta.url).href

const emits = defineEmits<{ (e: 'finish', v: boolean): void }>()

const store = useStore(key)
const carouselRef = ref()
const carouselIndex = ref(0)
const animateClass = ref('fadeInRight')
const finalData: any = ref()
const serviceStatus: any = ref({})
const middlewareStatus: any = ref({})
const nacosStatus: any = ref({})
const serviceType: any = computed(() => JSON.parse(sessionStorage.nacosConfigs || '{}')?.config.type || '')
const submitted = computed(() => localStorage?.submitted === 1)
const recheckStatus: any = ref({
  service: true,
  middleware: true
})
const checkLoading: any = ref(false)
const inited = ref(false)
const serviceLeng: any = ref({
  service: {
    org: -1,
    now: 0
  },
  middleware: {
    org: -1,
    now: 0
  }
})
const cardIndex: any = ref({
  middleware: 0,
  db: 0,
  third: 0
})
const disabledNext = ref({
  service: false,
  middleware: false
})

const dbPortMap: any = ref({
  'jdbc:oracle:thin:@': 1521,
  'jdbc:mysql://': 3364,
})
const useTerminal = ref<any[]>([])
const mustPassService: any = {
  service: ['berserker-base', 'berserker-auth', 'berserker-gateway'],
  middleware: ['redis', 'rabbitmq']
}



// 初始化数据集合
const initData: any = ref([
  {
    code: 'nacos',
    label: '首先是NACOS配置',
    title: 'NACOS',
    titleSub: 'Nacos的基本配置',
    data: cloneDeep(nacosConfigs.nacos),
  },
  {
    code: 'middleware',
    label: '还有中间件的一些配置',
    title: '中间件',
    titleSub: '需要完善中间件的一些基本配置信息',
    children: cloneDeep(nacosConfigs.middleware)
  },
  {
    code: 'db',
    label: '还需对数据库进行配置',
    title: '数据库',
    titleSub: '需要完善数据库的一些基本配置信息',
    children: cloneDeep(nacosConfigs.db)
  },
  {
    code: 'third',
    label: '第三方配置',
    title: '第三方',
    titleSub: '需要完善第三方的一些基本配置信息',
    children: cloneDeep(nacosConfigs.third),
  },
  {
    code: 'sios',
    label: 'SIOS配置',
    title: 'SIOS',
    titleSub: '需要完善SIOS的一些基本配置信息',
    data: cloneDeep(nacosConfigs.sios),
  },
  {
    code: 'address',
    label: '配置你的NGINX。',
    title: 'NGINX',
    titleSub: '配置Nginx',
    data: cloneDeep(nacosConfigs.address),
  },
  {
    code: 'select_terminal',
    label: '选择终端',
    labelSub: '勾选后，将只检测选中的终端相关必要服务的状态'
  },
  {
    code: 'check_middleware',
    label: '完成所有配置工作，正在检查中间件的状态',
    labelSub: '*必须为开启状态'
  },
  {
    code: 'check_service',
    label: '正在检查服务启动状态',
    labelSub: '*必须为开启状态'
  },
  {
    code: 'download_nginx_config',
    label: '下载nginx.conf文件',
    labelSub: '1、备份nginx/conf/nginx.conf<br>2、拷贝下载的nginx.conf文件至nginx/conf/目录<br>3、重启nginx'
  },
  {
    code: 'finish',
    label: '初始化工作已完成，您现在可以开始使用统一管理平台！',
  }])

// 提交
const confirm = async (type: string, codes?: any) => {
  console.log(type, codes)
  finalData.value = outputJson()
  localStorage.initCatch = JSON.stringify(outputJson())
  if (type === 'toCheck') {
    if (!finalData.value.nacos.host) {
      ElMessage.error('至少需要填写Nacos的host配置')
      return
    }
    if (initData.value[carouselIndex.value].code === 'nacos' && !nacosStatus.value[`${finalData.value.nacos.host}:${finalData.value.nacos.port}`]) {
      ElMessage.warning('Nacos测试通过后，才允许跳转')
      return
    }
    window.removeEventListener('beforeunload', closePage)
    let jumpIndex = 0
    let handleFunc = () => { }
    let timer = 0
    jumpIndex = initData.value.findIndex((item: any) => item.code === 'select_terminal')
    if (jumpIndex < 0) {
      jumpIndex = initData.value.findIndex((item: any) => item.code === 'check_middleware')
      handleFunc = () => { checkMiddleware() }
    }
    for (let i = 0; i < jumpIndex; i++) {
      setTimeout(() => {
        carouselRef.value.next()
      }, 50 * i)
      timer = 50 * i
    }
    setTimeout(() => {
      handleFunc()
    }, timer)
    return
  }

  // 点击测试时候的一些后续处理
  if (type === 'test') {
    let _code = codes.key || codes.code
    if (codes.code === 'db') _code = codes.code
    finalData.value = JSON.parse(localStorage.initCatch)
    let params = finalData.value?.[codes.code]?.[codes.key] || finalData.value?.[codes.code]
    if (codes.code === 'third') params = finalData.value[_code]
    const { result, msg } = await getTestRes(params, finalData.value.nacos.host, _code, serviceType.value)
    nacosStatus.value[`${finalData.value.nacos.host}:${finalData.value.nacos.port}`] = result
    localStorage.nacosStatus = JSON.stringify(nacosStatus.value)
    ElMessage[result ? 'success' : 'error'](result ? '测试成功' : `测试失败： ${msg}`)
    return
  }

  // 表单有空值的情况下
  if (initData.value[carouselIndex.value].data && !checkEmptyValue(initData.value[carouselIndex.value].data)) {
    ElMessage.error('请填写完整')
    return
  }
  if (initData.value[carouselIndex.value]?.children) {
    const keyArr = Object.keys(initData.value[carouselIndex.value]?.children)
    const key = keyArr[cardIndex.value[type]]
    console.log(initData.value[carouselIndex.value]?.children[key])
    if (!checkEmptyValue(initData.value[carouselIndex.value]?.children[key])) {
      ElMessage.error('请填写完整')
      return
    }
  }

  // 下一步的行为
  const nextHandle = async (ctp: string) => {
    const submitAndRemoveListener = async () => {
      !submitted.value && await submit()
      window.removeEventListener('beforeunload', closePage)
    }
    switch (initData.value[initData.value.findIndex((item: any) => item.code === ctp) + 1]?.code) {
      case 'check_middleware':
        setTimeout(async () => {
          await submitAndRemoveListener()
          await checkMiddleware()
        }, 250)
        break
      case 'check_service':
        setTimeout(async () => {
          await submitAndRemoveListener()
          await checkService()
        }, 250)
        break
      case 'select_terminal':
        await submitAndRemoveListener()
        break
      default:
        break
    }
  }
  // base配置
  if (['base', 'sios', 'nacos', 'check_middleware', 'check_service', 'select_terminal', 'address', 'download_nginx_config'].includes(type)) {
    if (type === 'nacos') {
      if (!nacosStatus.value[`${finalData.value.nacos.host}:${finalData.value.nacos.port}`]) {
        ElMessage.warning('Nacos测试通过后，才允许下一步')
        return
      }
    }
    carouselRef.value.next()

    nextHandle(type)

    return
  }

  // 中间件配置
  if (['middleware', 'db', 'third'].includes(type)) {
    const objLeng = size(initData.value?.find((item: any) => item.code === type)?.children)
    if (cardIndex.value[type] === objLeng - 1) {
      carouselRef.value.next()
      nextHandle(type)
    } else cardIndex.value[type]++
    animateClass.value = 'fadeInRight'
    return
  }

  // 完成时
  // finish
  if (type === 'finish') {
    carouselRef.value.next()
    setTimeout(() => {
      emits('finish', true)
    }, 1000)
    return
  }
  // 上一步
  if (type === 'prev' && initData.value[carouselIndex.value]?.children) {
    if (cardIndex.value?.[initData.value[carouselIndex.value].code] === 0) {
      carouselRef.value.prev()
    } else cardIndex.value[initData.value[carouselIndex.value].code]--
    animateClass.value = 'fadeInLeft'

    return
  }
  // next或prev
  try {
    carouselRef.value?.[type]()
  } catch (error) {
    //
  }
}

// 导出Json
const outputJson = () => {
  let obj: any = {}
  for (let val of initData.value) if (val.data || val?.children) obj[val.code] = processJSON(cloneDeep(val?.children || val.data))
  for (let key in obj) {
    // middleware
    if (key === 'middleware') {
      if (obj[key]?.['minio']) {
        obj[key]['minio'].endpoint = `${obj[key]['minio'].ip}:${obj[key]['minio'].port}`
        delete obj[key]['minio'].ip
        delete obj[key]['minio'].port
      }
    }
    // sios
    if (key === 'sios') {
      obj[key]['siosIp'] = obj[key]?.ip
      obj[key]['siosPort'] = obj[key]?.port
      delete obj[key]?.ip
      delete obj[key]?.port
    }
    // nacos
    if (key === 'nacos') {
      obj[key]['port'] = obj[key]['host']?.port
      obj[key]['host'] = obj[key]['host']?.ip
    }
    // third
    if (key === 'third') {
      obj = { ...obj, ...obj[key] }
      delete obj[key]
    }
  }
  // test
  // obj.nacos.namespaceId = 'test'
  //
  return obj
}

// 提交
const submit = async () => {
  const finalJson = cloneDeep(outputJson())
  finalData.value = finalJson
  const { data: res, msg, code }: any = await initConfig(finalData.value, finalData.value.nacos.host, serviceType.value)
  if (code === 200) localStorage.submitted = 1
}

// 直接去检测页
const toCheck = () => confirm('toCheck')

// 检查服务器状态
const checkService = async (type?: string) => {
  console.log('checkService')
  checkLoading.value = true
  let data = await getServiceStatus({ ...finalData.value?.nacos, platTypes: useTerminal.value.join(',') }, finalData.value?.nacos?.host, serviceType.value)
  data = map(data, (value: any, key: any) => ({ key, value }))
  // 重新检测
  if (type === 'recheck') {
    const recheckData: any = {}
    for (let v of data) {
      recheckData[v.key] = {
        data: v.value,
        healthy: some(map(v.value, 'healthy')),
        must: !!mustPassService.service.includes(v.key),
        loading: some(map(v.value, 'healthy')) ? false : true
      }
    }
    serviceStatus.value = { ...serviceStatus.value, ...recheckData }
    setTimeout(() => {
      Object.keys(serviceStatus.value).map((k: any) => {
        serviceStatus.value[k].loading = false
        if (mustPassService.service.includes(k) && !serviceStatus.value[k].healthy) disabledNext.value.service = true
      })
      checkLoading.value = false
    }, 500)
    recheckStatus.value.service = every(map(map(serviceStatus.value), 'healthy'))
    const arr = []
    for (let v of mustPassService.service) {
      arr.push(serviceStatus.value[v])
    }
    disabledNext.value.service = !every(map(map(arr), 'healthy'))
    return
  }
  checkLoading.value = false
  serviceLeng.value.service.org = data.length
  //  依次推入
  const pushDataToObj = (key: any, index: any) => {
    setTimeout(() => {
      serviceStatus.value[key] = {
        data: data[index].value,
        healthy: some(map(data[index].value, 'healthy')),
        must: !!mustPassService.service.includes(key),
        loading: true
      }
      setTimeout(() => {
        serviceStatus.value[key].loading = false
      }, 600)
      // if (mustPassService.service.includes(key) && !serviceStatus.value[key].healthy) disabledNext.value.service = true
      recheckStatus.value.service = every(map(map(serviceStatus.value), 'healthy'))
      serviceLeng.value.service.now++
      if (index === data.length - 1) {
        const arr = []
        for (let v of mustPassService.service) {
          arr.push(serviceStatus.value[v])
        }
        disabledNext.value.service = !every(map(map(arr), 'healthy'))
      }
    }, 300 * index)
  }
  setTimeout(() => {
    for (let i = 0; i < data.length; i++) {
      pushDataToObj(data[i].key, i)
    }
  }, 600)
}

// 检查中间件
const checkMiddleware = async (type?: string) => {
  console.log('checkMiddleware')
  // let data = await getMiddleware({ host: finalData.value?.nacos?.host }, finalData.value?.nacos?.host)
  checkLoading.value = true
  let data = await getMiddleware(finalData.value?.nacos, finalData.value?.nacos?.host, serviceType.value)
  data = map(data, (value: any, key: any) => ({ key, value }))
  // 重新检测
  if (type === 'recheck') {
    const recheckData: any = {}
    for (let v of data) {
      recheckData[v.key] = {
        data: v.value,
        healthy: v.value.healthy,
        must: !!mustPassService.middleware.includes(v.key),
        loading: v.value.healthy ? false : true
      }
    }
    middlewareStatus.value = { ...middlewareStatus.value, ...recheckData }
    setTimeout(() => {
      Object.keys(middlewareStatus.value).map((k: any) => {
        middlewareStatus.value[k].loading = false
        console.log(middlewareStatus.value[k])
        // if (mustPassService.middleware.includes(k) && !middlewareStatus.value[k].healthy) disabledNext.value.middleware = true
      })
      checkLoading.value = false
    }, 500)
    recheckStatus.value.middleware = every(map(map(middlewareStatus.value), 'healthy'))
    const arr = []
    for (let v of mustPassService.middleware) {
      arr.push(middlewareStatus.value[v])
    }
    disabledNext.value.middleware = !every(map(map(arr), 'healthy'))
    return
  }
  checkLoading.value = false
  serviceLeng.value.middleware.org = data.length
  //  依次推入
  const pushDataToObj = (key: any, index: any) => {
    setTimeout(() => {
      middlewareStatus.value[key] = {
        data: data[index].value,
        healthy: data[index].value.healthy,
        must: !!mustPassService.middleware.includes(key),
        loading: true
      }
      setTimeout(() => {
        middlewareStatus.value[key].loading = false
      }, 600)
      // if (mustPassService.middleware.includes(key) && !middlewareStatus.value[key].healthy) disabledNext.value.middleware = true
      serviceLeng.value.middleware.now++
      recheckStatus.value.middleware = every(map(map(middlewareStatus.value), 'healthy'))
      if (index === data.length - 1) {
        const arr = []
        for (let v of mustPassService.middleware) {
          arr.push(middlewareStatus.value[v])
        }
        disabledNext.value.middleware = !every(map(map(arr), 'healthy'))
      }
    }, 300 * index)
  }
  setTimeout(() => {
    for (let i = 0; i < data.length; i++) {
      pushDataToObj(data[i].key, i)
    }
  }, 600)
  // middlewareStatus.value = data
}

// 递归处理数据
const processJSON = (json: any, key?: string): any => {
  let newJson = json
  for (let key in newJson) {
    if (!isEmpty(newJson[key]) && !newJson[key].key) {
      processJSON(newJson[key], key)
    } else {
      if (typeof newJson[key].value === 'string') {
        newJson[key].value = trim(newJson[key].value)
      } else {
        for (let k in newJson[key].value) {
          newJson[key].value[k] = trim(newJson[key].value[k])
        }
      }
      newJson[newJson[key].key] = newJson[key].value
      delete newJson[key]
    }
  }
  newJson = { ...newJson, ...newJson.ip }
  for (let key in newJson) {
    if (typeof newJson[key] === 'object') {
      newJson[key] = { ...newJson[key], ...newJson[key].ip }
    }
  }
  return newJson
}

// 校验并处理输入内容
const checkEmptyValue = (obj: any) => {
  const isEmpty = (value: any) => {
    if (value === "" || value === null || value === undefined) return true
    if (typeof value === "object") for (const key in value) if (value.hasOwnProperty(key) && isEmpty(value[key])) return true
    return false
  }
  for (const key in obj) {
    if (key === "value") {
      if (isEmpty(obj[key])) return false
    } else if (typeof obj[key] === "object") {
      if (!checkEmptyValue(obj[key])) return false
    }
  }
  return true
}

// 监听关闭或刷新
const closePage = (event: any) => {
  event.preventDefault()
  event.returnValue = '' // 必须在非空字符串中设置 returnValue 属性，以触发弹窗

  // 弹出确认框
  const confirmationMessage = '您有未完成的配置项，确定要离开吗？'
  event.returnValue = confirmationMessage // 用于兼容旧版浏览器

  return confirmationMessage
}

// 禁止Tab切换事件
const banTab = (event: any) => (event.key === 'Tab' && event.preventDefault())

// 当选择终端有变化时，执行回调
const onChange = (val: any[]) => {
  useTerminal.value = cloneDeep(val)
}

// 下载nginx.config
const downloadNginxConfig = async () => {
  const host = finalData.value?.nacos?.host
  const port = finalData.value?.nacos?.port
  const url = `http://${host}:8858/nginx/nginx-conf?host=${host}&port=${port}`
  // const url = `http://192.168.3.14:8080/nginx/nginx-conf?host=192.168.3.228&port=8848`
  const btn = document.createElement('a')
  btn.href = url
  btn.click()
}

const trim = (v: any) => {
  if (typeof v === 'number') {
    return Number(String(v).replace(/\s+/g, ''))
  }
  return v.replace(/\s+/g, '')
}

const getNextCode = (code: string) => {
  const currentIndex = initData.value?.findIndex((r: any) => r.code === code)
  return initData.value?.[currentIndex + 1]?.code || ''
}

// 监听中间件ip变化，自动填充
watch([...initData.value]?.find(t => t.code === 'middleware')?.children.redis, (r: any) => {
  const item: any = [...initData.value]?.find(t => t.code === 'middleware')
  if (r.Ip地址.value.ip) {
    if (item.children.mq.Ip地址.value.ip?.length < 15) item.children.mq.Ip地址.value.ip = r.Ip地址.value.ip
    if (item.children.minio.Ip地址.value.ip?.length < 15) item.children.minio.Ip地址.value.ip = r.Ip地址.value.ip
  }
}, {
  deep: true
})

// 监听中间件ip变化，自动填充
watch([...initData.value]?.find(t => t.code === 'db')?.children.school, (r: any) => {
  const item: any = [...initData.value]?.find(t => t.code === 'db')
  if (r.Ip地址.value.ip) {
    if (item.children.ykt.Ip地址.value.ip?.length < 15) item.children.ykt.Ip地址.value.ip = r.Ip地址.value.ip
  }
}, {
  deep: true
})

// 数据库类型数组，用于监听
const findDb = computed(() => {
  const obj = [...initData.value]?.find(t => t.code === 'db')?.children
  const _o: any = {}
  Object.keys(obj || {})?.map((key: any) => _o[key] = obj?.[key])
  return _o
})

// 监听数据库类型变化
watch(findDb, (r: any, or) => {
  console.log(r, or)
  const db = [...initData.value]?.find(t => t.code === 'db')?.children
  if (db) {
    Object.keys(db).map((key) => {
      if ([1521, 3364].includes(db[key].Ip地址.value.port)) {
        db[key].Ip地址.value.port = cloneDeep(dbPortMap.value[db[key].数据库类型.value])
      }
    })
  }
}, {
  deep: true
})

// 页面加载完成后的一些操作
onMounted(async () => {
  initData.value = await customConfig(initData.value)
  if (localStorage?.nacosStatus) nacosStatus.value = JSON.parse(localStorage?.nacosStatus || '{}')
  inited.value = !!localStorage.submitted
  // 未完成配置，退出前提示
  window.addEventListener('beforeunload', closePage)
  // window.addEventListener('keydown', banTab)
})

onUnmounted(() => {
  window.removeEventListener('beforeunload', closePage)
  // window.removeEventListener('keydown', banTab)
})

</script>

<template lang='pug'>
#initialization
  .init-setting-box
    el-carousel(ref="carouselRef", height="300px", :autoplay="false", arrow="never", indicator-position="none", @change="i => carouselIndex = i")
      el-carousel-item(v-for="item in initData" :key="code")
        .title-box
          h1.init-label(:style="`margin-top:${item.code == 'finish' ? '25vh' : ''}`") {{ item.label }}
          span.init-label-sub(v-if="item.labelSub" v-html="item.labelSub")
          //- el-card.init-item
          el-collapse.service-list(v-if="!isEmpty(serviceStatus) && item.code == 'check_service'" :accordion="true")
            el-collapse-item.mg-fadeInRight(v-for="(item, key, index) in serviceStatus" :key="key")
              template(#title)
                el-icon(v-if="item.loading" class="is-loading")
                  Loading
                el-icon(v-else :color="`var(--el-color-${item.healthy ? 'success': 'danger'})`")
                  Select(v-if="item.healthy")
                  CloseBold(v-else)
                span {{ key }}
                span(style="color:var(--el-color-danger)") {{ item.must ? '*' : '' }}
              el-tag(:type="value.healthy ? 'success':'danger'" effect="dark" v-for="(value, index) in item.data" :key="index" style="margin-right:4px;margin-bottom:4px;") {{ value.clusterName }} : {{ value.ip }}
            .next-btn.mg-fadeInBottom(v-if="serviceLeng.service.now === serviceLeng.service.org")
              el-button(:disabled="disabledNext.service" @click="confirm('check_service')") 下一步
              el-button.btn-reload(v-if="!recheckStatus.service" type="warning" @click="checkService('recheck')" :loading="checkLoading") 重新检测
          .middleware-status(v-if="item.code == 'check_middleware'")
            p.m-item.mg-fadeInRight(v-for="(item, key, i) in middlewareStatus" :key="item.name")
              el-icon(v-if="item.loading" class="is-loading")
                Loading
              el-icon(v-else :color="`var(--el-color-${item.healthy ? 'success': 'danger'})`")
                Select(v-if="item.healthy")
                CloseBold(v-else)
              span {{ item.data.name }} : {{ item.data.ip }}
              span(style="color:var(--el-color-danger)") {{ item.must ? '*' : '' }}
            .next-btn.mg-fadeInBottom(v-if="serviceLeng.middleware.now === serviceLeng.middleware.org")
              el-button(:disabled="disabledNext.middleware" @click="confirm('check_middleware')") 下一步
              el-button.btn-reload(v-if="!recheckStatus.middleware" type="warning" @click="checkMiddleware('recheck')" :loading="checkLoading") 重新检测
          .download-nginx-config(v-if="item.code == 'download_nginx_config'")
            el-button(@click="downloadNginxConfig" :icon="Download") 下载nginx.conf文件
            el-button(@click="confirm('finish')") 下一步
        SelectTerminal(v-if="item.code == 'select_terminal'" @change="onChange" @next="confirm('select_terminal')")
        Card(v-if="item.data", v-bind="{...item, confirm, animateClass}" @toCheck="toCheck" :inited="inited" @test="code => confirm('test', code)")
        Card(v-if="item?.children", v-bind="{...item, confirm, cardIndex, animateClass}" @toCheck="toCheck" :inited="inited" @test="code => confirm('test', code)")
        Step(v-if="item?.children", v-bind="{ ...item, cardIndex }" @toStep="toStep")
</template>

<style lang='scss' scoped>
#initialization {
  width: 100%;
  height: 100vh;
  position: relative;
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center center;

  .init-item {
    display: flex;
    justify-content: center;
    max-width: 550px !important;
    width: 100%;
    margin: 1rem;
    box-shadow: 0px 20px 40px 0px rgba(16, 13, 128, 0.12);
  }

  .init-setting-box {
    width: 100%;
    height: 100%;
    z-index: 1;

    :deep(.el-carousel) {
      height: 100%;

      .el-carousel__container {
        height: 100% !important;
      }

      .el-carousel__item {
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
      }

    }

    .title-box {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      position: absolute;
      top: 15%;

      .init-label {
        color: #fff;
        font-weight: 600;
        margin-bottom: 2rem;
      }

      .init-label-sub {
        color: #fff;
        margin-bottom: 2rem;
        line-height: 1.5rem;
      }
    }

  }

  .download-nginx-config {
    display: flex;
    align-items: center;
    height: 15vh;
  }

  .login-bg {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    pointer-events: none;
    z-index: 0;
  }

  .progress {
    width: 400px;
  }

  .service-list {
    width: 300px;
    color: #ffffff;
    font-size: 1.125rem;

    .next-btn {
      display: flex;
      justify-content: center;
      margin-top: 2rem;
    }

    .el-icon {
      margin-right: 1rem;
    }

    p {
      margin: 0.5rem 0 0.5rem 3.125rem;
    }
  }

  :deep(.el-collapse) {
    border: none;

    .el-collapse-item {
      // height: 2rem;
      user-select: none;
    }

    .el-collapse-item__header,
    .el-collapse-item__wrap {
      background-color: transparent;
      border: none;
      color: #ffffff !important;
      font-size: 1rem;
    }

    .el-collapse-item__content {
      color: #ffffff !important;
      padding: 0 2rem;
    }
  }

  .middleware-status {
    color: #ffffff;

    .m-item {
      height: 48px;
    }

    .el-icon {
      margin-right: 1rem;
    }
  }
}
</style>
