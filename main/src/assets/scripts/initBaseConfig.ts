// is development
const isDevelopment = (process.env.NODE_ENV === "development")

const initBaseConfigJson = () => {
  const _base = JSON.stringify({
    base: window.location.origin,
    // title: '统一管理端平台',
    // cloudUrl: 'https://ecampus.xzxpay.com.cn/test-api/cloud-api',
    websocketUrl: window.location.origin.replace('http', 'ws') + '/websocket/mobile_service_platform',
    // version: '1.0.7',
    // code: 200,
  })
  if (!isDevelopment) localStorage.setItem('configsManage', _base)
}

export default initBaseConfigJson
