import service, { IRes } from '@/service'
// 获取云端域名
let cloudUrl = localStorage.getItem('configsManage') ? (JSON.parse(localStorage.getItem('configsManage') as any) as any).cloudUrl + '/cloud-api' : null
if (!cloudUrl) {
  const oAjax = new XMLHttpRequest()
  oAjax.open('get', '/config/', false)
  oAjax.setRequestHeader('Content-type', 'application/x-www-form-urlencoded')
  oAjax.onreadystatechange = function () {
    if (oAjax.readyState === 4 && oAjax.status === 200) {
      const data = JSON.parse(oAjax.responseText)
      localStorage.setItem('configs', JSON.stringify(data.management))
      cloudUrl = data.cloudUrl
    } else {
      console.log(oAjax)
    }
  }
  // 5,发送
  oAjax.send()
}
// [云端]相关接口
export class Cloud {
  // 云端应用列表
  static getAppList = (params?: any, feedbackType?:string): Promise<IRes> => {
    return service.request({
      url: cloudUrl + '/baseApp/page',
      method: 'get',
      params: params
    }, feedbackType)
  }
  // 云端组件列表
  static getModuleList = (params?: any, feedbackType?:string): Promise<IRes> => {
    return service.request({
      url: cloudUrl + '/baseComponent/list',
      method: 'get',
      params: params
    }, feedbackType)
  }
  // 云端组件列表-分页
  static getModuleListPage = (params: any, feedbackType?:string): Promise<IRes> => {
    return service.request({
      url: cloudUrl + '/baseComponent/page',
      method: 'get',
      params: params
    }, feedbackType)
  }
  // 组件绑定应用
  static getModuleBindApp = (params: any, feedbackType?:string): Promise<IRes> => {
    return service.request({
      url: cloudUrl + '/baseComponentBindApp/listAppByComCode',
      method: 'get',
      params: params
    }, feedbackType)
  }
  // 云端组件类型列表
  static getModuleTypeList = (params?: any, feedbackType?:string): Promise<IRes> => {
    return service.request({
      url: cloudUrl + '/baseComponentTypeInfo/list',
      method: 'get',
      params: params
    }, feedbackType)
  }
  // 云端菜单列表
  static getMenuList = (params?: any, feedbackType?:string): Promise<IRes> => {
    return service.request({
      url: cloudUrl + '/baseIndex/list',
      method: 'get',
      params: params
    }, feedbackType)
  }
  // 云端菜单列表-分页
  static getMenuListPage = (params?: any, feedbackType?:string): Promise<IRes> => {
    return service.request({
      url: cloudUrl + '/baseIndex/page',
      method: 'get',
      params: params
    }, feedbackType)
  }
  // 云端方案列表
  static getSchemeList = (params?: any, feedbackType?:string): Promise<IRes> => {
    return service.request({
      url: cloudUrl + '/baseSchedule/list',
      method: 'get',
      params: params
    }, feedbackType)
  }
  // 云端方案列表-分页
  static getSchemeListPage = (params?: any, feedbackType?:string): Promise<IRes> => {
    return service.request({
      url: cloudUrl + '/baseSchedule/page',
      method: 'get',
      params: params
    }, feedbackType)
  }
  // 云端支付方式-分页
  static getPayListPage = (params?: any, feedbackType?:string): Promise<IRes> => {
    return service.request({
      url: cloudUrl + '/configData/treePage',
      method: 'get',
      params: params
    }, feedbackType)
  }
  // 云端终端类型-分页
  static getPlatType = (params?: any, feedbackType?:string): Promise<IRes> => {
    return service.request({
      url: cloudUrl + '/basePlatInfo/list',
      method: 'get',
      params: params
    }, feedbackType)
  }
  // 获取云端方案结构
  static getScheduleStructure = (params: any, feedbackType?:string): Promise<IRes> => {
    return service.request({
      url: cloudUrl + '/baseScheduleStructure/callbackView',
      method: 'get',
      params: params
    }, feedbackType)
  }
}
