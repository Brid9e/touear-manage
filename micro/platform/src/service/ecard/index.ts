import service, { IRes } from '@/service'

// [商户]相关接口
export class merchant {
  // 查询商户列表
  static getMerchantList = (params: any, feedbackType?:string): Promise<IRes> => {
    return service.request({
      url: 'berserker-base/mercPos/getPageMerchant',
      method: 'get',
      params: params
    }, feedbackType)
  }
  // pos位置
  static getLocation = ( feedbackType?:string): Promise<IRes> => {
    return service.request({
      url: 'berserker-base/loc/getTree',
      method: 'get',
      params: null
    }, feedbackType)
  }
  // node详情
  static getNode = (id: number, feedbackType?:string): Promise<IRes> => {
    return service.request({
      url: 'berserker-base/pos/getPosByLoc/' + id,
      method: 'get',
      params: null
    }, feedbackType)
  }
  // 添加node
  static addNode = (params: any, feedbackType?:string): Promise<IRes> => {
    return service.request({
      url: 'berserker-base/berserker-base/loc/add',
      method: 'post',
      data: params
    }, feedbackType)
  }
  // 编辑node
  static editNode = (params: any, feedbackType?:string): Promise<IRes> => {
    return service.request({
      url: 'berserker-base/loc/edit',
      method: 'post',
      data: params
    }, feedbackType)
  }
  // 删除node
  static deleteNode = (id: number, feedbackType?:string): Promise<IRes> => {
    return service.request({
      url: 'berserker-base/loc/delete/' + id,
      method: 'post',
      data: null
    }, feedbackType)
  }
  // 绑定pos--餐厅
  static bindPos = (params: any, feedbackType?:string): Promise<IRes> => {
    return service.request({
      url: 'berserker-base/pos/linkLoc',
      method: 'post',
      data: params
    }, feedbackType)
  }
  // 移除pos--餐厅
  static removePos = (id: number, feedbackType?:string): Promise<IRes> => {
    return service.request({
      url: 'berserker-base/pos/disconnectLoc/' + id,
      method: 'post',
      data: null
    }, feedbackType)
  }
  // 查询pos--商户
  static getPosMerc = (params: string, feedbackType?:string): Promise<IRes> => {
    return service.request({
      url: 'berserker-base/pos/getPosByMerc/' + params,
      method: 'get',
      params: null
    }, feedbackType)
  }
  // 绑定pos--商户
  static bindPosMerc = (params: any, feedbackType?:string): Promise<IRes> => {
    return service.request({
      url: 'berserker-base/pos/linkMerc',
      method: 'post',
      data: params
    }, feedbackType)
  }
  // 绑定pos--商户
  static removePosMerc = (params: any, feedbackType?:string): Promise<IRes> => {
    return service.request({
      url: 'berserker-base/pos/disconnectMerc/' + params,
      method: 'post',
      data: null
    }, feedbackType)
  }
  // /berserker-base-d/mercacc/page
  // 获取分页商户申请列表
  static mercacc = (params: any, feedbackType?:string): Promise<IRes> => {
    return service.request({
      url: '/berserker-base/mercacc/page',
      method: 'get',
      params: params
    }, feedbackType)
  }

  // 商户申请审核
  static audit = (params: any, feedbackType?:string): Promise<IRes> => {
    return service.request({
      url: '/berserker-base/mercacc/audit',
      method: 'post',
      data: params
    }, feedbackType)
  }
  // 上传商户头像
  static setAvatar = (params: any, feedbackType?:string): Promise<IRes> => {
    return service.request({
      url: 'berserker-base/merchant/setAvatar',
      method: 'post',
      data: params
    }, feedbackType)
  }
  // 查询商户头像
  static getAvatar = (params: number | string, feedbackType?:string): Promise<IRes> => {
    return service.request({
      url: 'berserker-base/merchant/getPicUrl/' + params,
      method: 'get'
    }, feedbackType)
  }
}
// [支付管理]相关接口
export class payWay {
  // 查询支付列表
  static getPaypage = (params: any, feedbackType?:string): Promise<any> => {
    return service.request({
      url: 'charge/pay/getPaypage',
      method: 'get',
      params: params
    }, feedbackType)
  }
  // 添加支付列表
  static addPayInfo = (params: any, feedbackType?:string): Promise<any> => {
    return service.request({
      url: 'charge/pay/addpayinfo',
      method: 'post',
      data: params
    }, feedbackType)
  }
  // 删除支付列表
  static deletepayinfo = (params: any, feedbackType?:string): Promise<any> => {
    return service.request({
      url: 'charge/pay/deletepayinfo',
      method: 'post',
      data: params
    }, feedbackType)
  }
  // 编辑支付列表
  static editpayinfo = (params: any, feedbackType?:string): Promise<any> => {
    return service.request({
      url: 'charge/pay/editpayinfo',
      method: 'post',
      data: params
    }, feedbackType)
  }
}
// [退费管理]相关接口
export class refound {
  // 查询退费列表
  static getRefundPage = (params: any, feedbackType?:string): Promise<any> => {
    return service.request({
      url: 'charge/order/platRefundPage',
      method: 'get',
      params: params
    }, feedbackType)
  }
  // 审核退费
  static doRefundAudit = (params: any, feedbackType?:string): Promise<any> => {
    return service.request({
      url: 'charge/order/doRefundAudit',
      method: 'post',
      data: params
      // headers: {
      //   'Content-Type': 'application/json'
      // }
    }, feedbackType)
  }
  // 支付方式
  static getRefundPayInfo = ( feedbackType?:string): Promise<any> => {
    return service.request({
      url: 'berserker-app/ykt/tsm/refundPayInfo',
      method: 'get',
      params: null
    }, feedbackType)
  }
  // 导出
  static exportRefundOrder = (params: any, feedbackType?:string): Promise<any> => {
    return service.request({
      url: 'charge/order/exportRefundOrder',
      method: 'get',
      params: params
    }, feedbackType)
  }
}
// export class refound {
//   // 查询退费列表  ---d
//   static getRefundPage = (params: any, feedbackType?:string): Promise<any> => {
//     return service.request({
//       // url: 'charge/order/platRefundPage',
//       url: 'charge-d/order/platRefundPage',
//       method: 'get',
//       params: params
//     }, feedbackType)
//   }
//   // 审核退费
//   static doRefundAudit = (params: any, feedbackType?:string): Promise<any> => {
//     return service.request({
//       // url: 'charge/order/doRefundAudit',
//       url: 'charge-d/order/doRefundAudit',
//       method: 'post',
//       data: params
//       // headers: {
//       //   'Content-Type': 'application/json'
//       // }
//     }, feedbackType)
//   }
//   // 支付方式
//   static getRefundPayInfo = ( feedbackType?:string): Promise<any> => {
//     return service.request({
//       url: 'berserker-app/ykt/tsm/refundPayInfo',
//       method: 'get',
//       params: null
//     }, feedbackType)
//   }
//   // 导出
//   static exportRefundOrder = (params: any, feedbackType?:string): Promise<any> => {
//     return service.request({
//       // url: 'charge/order/exportRefundOrder',
//       url: 'charge-d/order/exportRefundOrder',
//       method: 'get',
//       params: params
//     }, feedbackType)
//   }
// }
