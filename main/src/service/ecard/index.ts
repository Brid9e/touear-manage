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
    })
  }
  // node详情
  static getNode = (id: number, feedbackType?:string): Promise<IRes> => {
    return service.request({
      url: 'berserker-base/pos/getPosByLoc/' + id,
      method: 'get',
      params: null
    })
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
    })
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
    })
  }
  // 查询pos--商户
  static getPosMerc = (params: string, feedbackType?:string): Promise<IRes> => {
    return service.request({
      url: 'berserker-base/pos/getPosByMerc/' + params,
      method: 'get',
      params: null
    })
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
    })
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
  // 查用户已绑的商户pos
  static getMerchantbBindList = (params: any, feedbackType?:string): Promise<IRes> => {
    return service.request({
      url: '/berserker-base/accountuser/merchant/bind/list',
      method: 'get',
      params: params
    }, feedbackType)
  }
   // 商户绑定pos
  static merchantbBindPos = (params:any, feedbackType?:string): Promise<IRes> => {
    return service.request({
      url: '/berserker-base/accountuser/merchant/bind',
      method: 'post',
      data: params
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
      url: 'charge/refundOrder/platRefundPage',
      method: 'get',
      params: params
    }, feedbackType)
  }
  // 审核退费
  static doRefundAudit = (params: any, feedbackType?:string): Promise<any> => {
    return service.request({
      url: 'charge/refundOrder/doRefundAudit',
      method: 'post',
      data: params
      // headers: {
      //   'Content-Type': 'application/json'
      // }
    })
  }
  // 支付方式
  static getRefundPayInfo = ( feedbackType?:string): Promise<any> => {
    return service.request({
      url: 'berserker-app/ykt/tsm/refundPayInfo',
      method: 'get',
      params: null
    })
  }
  // 导出--明细
  static exportRefundOrder = (params: any, feedbackType?:string): Promise<any> => {
    return service.request({
      url: 'charge/refundOrder/exportRefundOrder',
      method: 'get',
      params: params
    }, feedbackType)
  }
  // 导出---汇总
  static exportRefundOrderCollect = (params: any, feedbackType?:string): Promise<any> => {
    return service.request({
      url: 'charge/refundOrder/exportRefundOrderCollect',
      method: 'get',
      params: params
    }, feedbackType)
  }
  // 导入
  static refundAuditByImport = (params: any, feedbackType?:string): Promise<any> => {
    return service.request({
      url: 'charge/refundOrder/refundAuditByImport',
      method: 'post',
      data: params
    }, feedbackType)
  }
  // 查询导入进度
  static getProgress = (params: any, feedbackType?:string): Promise<any> => {
    return service.request({
      url: 'charge/refundOrder/getProgress',
      method: 'post',
      data: params
    }, feedbackType)
  }
  // 停止导入
  static stopImport = (params: any, feedbackType?:string): Promise<any> => {
    return service.request({
      url: 'charge/refundOrder/stopImport',
      method: 'post',
      data: params
    }, feedbackType)
  }
}
