import service, { IRes } from '@/service'
import { AxiosPromise } from 'axios'
// import qs from 'qs'

// [群组设置]相关接口
interface GroupControl {
  current?: number
  size?: number
  descs?: string
  likeSelectName?: boolean
  resourceId?: number | string
  type?: string
  value?: boolean
  id?: number | string
  name?: string
  status?: string | number
  remark?: string
  scheduleUserType?: string
  scheduleServiceType?: string
  groupId?: number | string
  valueList?: any
  json?: string
  isCondition?: boolean
  accountIdList?: any
  selectLike?: boolean
  resourceIdList?: string | Array<any>
  removeResource?: string | boolean
  resourceList?: string | Array<any>
  resourceMap?: any
  code?: string
  codeList?: Array<any>
  listIndex?: number | string
  param?: any
  [key: string]: any
}
export class Group {
  //  添加或删除群组规则
  static deleteAndSaveExtendInfo = (
    params: GroupControl,
    feedbackType?: string
  ): Promise<IRes> => {
    return service.request(
      {
        method: 'post',
        url: '/berserker-base/extendInfo/deleteAndSavePropertyExtendInfo',
        data: params,
      },
      feedbackType
    )
  }

  // 查询人员数量
  static getAccountCount = (
    params: GroupControl,
    feedbackType?: string
  ): Promise<IRes> => {
    return service.request(
      {
        url: '/berserker-base/extendInfo/accountCount',
        method: 'get',
        params: params,
      },
      feedbackType
    )
  }

  // 新-获取群组列表
  static getGroup = (
    params: GroupControl,
    feedbackType?: string
  ): Promise<IRes> => {
    return service.request(
      {
        url: '/berserker-base-new/group/page',
        method: 'get',
        params: params,
      },
      feedbackType
    )
  }
  //  群组设置
  static groupEdit = (
    params: GroupControl,
    feedbackType?: string
  ): Promise<IRes> => {
    return service.request(
      {
        method: 'post',
        url: '/berserker-base-new/group/edit',
        data: params,
      },
      feedbackType
    )
  }

  //  群组删除
  static removeGroup = (
    params: GroupControl,
    feedbackType?: string
  ): Promise<IRes> => {
    return service.request(
      {
        method: 'post',
        url: '/berserker-base-new/group/remove',
        data: params,
      },
      feedbackType
    )
  }

  //  添加群组
  static addGroup = (
    params: GroupControl,
    feedbackType?: string
  ): Promise<IRes> => {
    return service.request(
      {
        method: 'post',
        url: '/berserker-base-new/group/add',
        data: params,
      },
      feedbackType
    )
  }

  //  保存权限开关
  static extendInfoSwitch = (
    params: GroupControl,
    feedbackType?: string
  ): Promise<IRes> => {
    return service.request(
      {
        method: 'post',
        url: '/berserker-base-new/extendInfo/saveExtendInfoSwitch',
        data: params,
      },
      feedbackType
    )
  }

  //  判断权限开关状态
  static getExtendInfoSwitch = (
    params: GroupControl,
    feedbackType?: string
  ): Promise<IRes> => {
    return service.request(
      {
        method: 'get',
        url: '/berserker-base-new/extendInfo/getExtendInfoSwitch',
        params: params,
      },
      feedbackType
    )
  }

  //  获取白名单
  static getWhiteList = (
    params: GroupControl,
    feedbackType?: string
  ): Promise<IRes> => {
    return service.request(
      {
        method: 'get',
        url: '/berserker-base/extendWhitelist/pageAccount',
        params: params,
      },
      feedbackType
    )
  }
  //  获取名单
  static getExtendInfoList = (
    params: GroupControl,
    feedbackType?: string
  ): Promise<IRes> => {
    return service.request(
      {
        method: 'get',
        url: '/berserker-base-new/extendInfo/pageAccount',
        params: params,
      },
      feedbackType
    )
  }

  // 添加白名单
  static addWhite = (
    params: GroupControl,
    feedbackType?: string
  ): Promise<IRes> => {
    return service.request(
      {
        method: 'post',
        url: '/berserker-base/extendWhitelist/addWhitelist',
        data: params,
      },
      feedbackType
    )
  }

  // 添加名单
  static addExtendInfo = (
    params: GroupControl,
    feedbackType?: string
  ): Promise<IRes> => {
    return service.request(
      {
        method: 'post',
        url: '/berserker-base/extendInfo/saveExtendInfo',
        data: params,
      },
      feedbackType
    )
  }
  // /berserker-base-new/extendInfo/saveExtendInfo
  //  删除白名单
  static removeWhiteList = (
    params: GroupControl,
    feedbackType?: string
  ): Promise<IRes> => {
    return service.request(
      {
        method: 'post',
        url: '/berserker-base/extendInfo/removeExtendInfo',
        data: params,
      },
      feedbackType
    )
  }

  static removeExtendList = (
    params: GroupControl,
    feedbackType?: string
  ): Promise<IRes> => {
    return service.request(
      {
        method: 'post',
        url: '/berserker-base-new/extendInfo/removeExtendInfo',
        data: params,
      },
      feedbackType
    )
  }
  // //  获取身份列表
  // static getIdentityList = ( feedbackType?:string): Promise<IRes> => {
  //   return service.request({
  //     method: 'get',
  //     url: '/berserker-base-new/identity'
  //   }, feedbackType)
  // }

  //  获取校区列表
  static getCampusList = (feedbackType?: string): Promise<IRes> => {
    return service.request(
      {
        method: 'get',
        url: '/berserker-base-new/campus',
      },
      feedbackType
    )
  }
  //获取部门信息
  // static getBasedepartment = ( feedbackType?:string): Promise<IRes> => {
  //   return service.request({
  //     method: 'get',
  //     url: '/berserker-base-new/basedepartment'
  //   }, feedbackType)
  // }

  //获取规则
  static getListAfterConvertedExtendInfo = (
    params: GroupControl,
    feedbackType?: string
  ): Promise<IRes> => {
    return service.request(
      {
        method: 'post',
        url: '/berserker-base-new/extendInfo/listAfterConvertedExtendInfo',
        data: params,
      },
      feedbackType
    )
  }

  //获取人员信息列表
  static getListAfterConvertedExtendInfoWithDetail = (
    params: GroupControl,
    feedbackType?: string
  ): Promise<IRes> => {
    return service.request(
      {
        method: 'post',
        url: '/berserker-base-new/extendInfo/listAfterConvertedExtendInfoWithDetail',
        data: params,
      },
      feedbackType
    )
  }

  //添加人员信息
  static saveExtendInfo = (
    params: GroupControl,
    feedbackType?: string
  ): Promise<IRes> => {
    return service.request(
      {
        method: 'post',
        url: '/berserker-base-new/extendInfo/saveExtendInfo',
        data: params,
      },
      feedbackType
    )
  }

  //  属性设置列表
  static getExtendInfo = (
    params: GroupControl,
    feedbackType?: string
  ): Promise<IRes> => {
    return service.request(
      {
        method: 'get',
        url: '/berserker-base/extendInfo/pageAccount',
        params: params,
      },
      feedbackType
    )
  }

  // 获取用户账号信息列表
  static getAccount = (
    params: GroupControl,
    feedbackType?: string
  ): Promise<IRes> => {
    return service.request(
      {
        method: 'get',
        url: '/berserker-base-new/account/page',
        params: params,
      },
      feedbackType
    )
  }

  //  获取群组详情方案信息
  static getListGroupDetailWithSchedule = (
    params?: GroupControl,
    feedbackType?: string
  ): Promise<IRes> => {
    return service.request(
      {
        method: 'get',
        url: '/berserker-base-new/groupDetail/listGroupDetailWithSchedule',
        params: params,
      },
      feedbackType
    )
  }

  //  获取可设置方案列表
  static getAppScheduleList = (
    params: GroupControl,
    feedbackType?: string
  ): Promise<IRes> => {
    return service.request(
      {
        method: 'get',
        url: '/berserker-base-new/appSchedule/getAppScheduleList',
        params: params,
      },
      feedbackType
    )
  }

  //  设置群组详情状态
  static editStatus = (
    params: GroupControl,
    feedbackType?: string
  ): Promise<IRes> => {
    return service.request(
      {
        method: 'post',
        url: '/berserker-base/groupDetail/editStatus',
        data: params,
      },
      feedbackType
    )
  }
  // 保存群组详情
  static saveGroupDetail = (
    params: GroupControl,
    feedbackType?: string
  ): Promise<IRes> => {
    return service.request(
      {
        method: 'post',
        url: '/berserker-base-new/groupDetail/saveGroupDetail',
        data: params,
      },
      feedbackType
    )
  }

  //  删除群组详情方案
  static removeSchedule = (
    params: GroupControl,
    feedbackType?: string
  ): Promise<IRes> => {
    return service.request(
      {
        method: 'post',
        url: '/berserker-base-new/groupDetail/remove',
        data: params,
      },
      feedbackType
    )
  }
}

// [参数设置]相关接口
interface ConfigControl {
  ascs?: string | number
  code?: string | number
  description?: string
  id?: string | number
  name?: string | number
  type?: string
  value?: string
  fromTime?: string
  toTime?: string
  fromTimestamp?: string
  reSynchronous?: string
}

export class SystemConfig {
  static getConfigData = (
    params: ConfigControl & pageSize,
    feedbackType?: string
  ): Promise<IRes> => {
    return service.request(
      {
        method: 'get',
        url: 'berserker-base-new/config/page',
        params: params,
      },
      feedbackType
    )
  }

  static synchronous = (
    params: ConfigControl,
    feedbackType?: string
  ): Promise<IRes> => {
    return service.request(
      {
        method: 'post',
        url: '/berserker-ykt-sync/turnover/synchronous',
        data: params,
      },
      feedbackType
    )
  }

  static getTaskSpeed = (feedbackType?: string): Promise<IRes> => {
    return service.request(
      {
        method: 'get',
        url: '/berserker-ykt-sync/turnover/getTaskSpeed',
      },
      feedbackType
    )
  }

  static edit = (
    params: ConfigControl,
    feedbackType?: string
  ): Promise<IRes> => {
    return service.request(
      {
        method: 'post',
        url: '/berserker-base-new/config/edit',
        data: params,
      },
      feedbackType
    )
  }

  static removeAll = (feedbackType?: string): Promise<IRes> => {
    return service.request(
      {
        method: 'post',
        url: '/berserker-base-new/redis/removeAll',
        data: {},
      },
      feedbackType
    )
  }
  static frontInfo = (feedbackType?: string): Promise<IRes> => {
    return service.request(
      {
        method: 'get',
        url: '/berserker-app/frontInfo',
      },
      feedbackType
    )
  }
  // 根据code查询某一条系统参数
  static getConfigByCode = (
    params: any,
    feedbackType?: string
  ): Promise<IRes> => {
    return service.request(
      {
        method: 'get',
        url: '/berserker-base/config/getConfigByCode',
        params: params,
      },
      feedbackType
    )
  }

  // 根据type查询该类型下的系统参数 type: login/third/ecard
  static getConfigByType = (
    type: string,
    feedbackType?: string
  ): Promise<IRes> => {
    return service.request(
      {
        method: 'get',
        url: '/berserker-base/sysConfigManage/list/' + type,
      },
      feedbackType
    )
  }
  // 提交系统参数 type: login/third/ecard
  static editSysconfigsManage = (
    params: any,
    feedbackType?: string
  ): Promise<IRes> => {
    return service.request(
      {
        method: 'post',
        url: 'berserker-base/sysConfigManage/edit',
        data: params,
      },
      feedbackType
    )
  }

  // 查询登录配置
  static getLoginConfig = (feedbackType?: string): Promise<IRes> => {
    return service.request(
      {
        method: 'get',
        url: '/berserker-base/loginConfig/list',
      },
      feedbackType
    )
  }
  // 编辑登录配置
  static editLoginConfig = (
    params: any,
    feedbackType?: string
  ): Promise<IRes> => {
    return service.request(
      {
        method: 'post',
        url: '/berserker-base/loginConfig/edit',
        data: params,
      },
      feedbackType
    )
  }
  // 测试统一身份认证是否畅通
  static testAddressConnect = (
    params: any,
    feedbackType?: string
  ): Promise<IRes> => {
    return service.request(
      {
        method: 'get',
        url: '/berserker-auth/auth/testAddressConnect',
        params: params,
      },
      feedbackType
    )
  }
  // 测试统一身份认证是否畅通
  static syncLoginType = (): Promise<IRes> => {
    return service.request({
      method: 'get',
      url: '/berserker-base/sysConfigManage/syncLoginType',
      params: null,
    })
  }
  // 脱机码参数查询
  static getOfflienConfig = (): Promise<IRes> => {
    return service.request({
      method: 'get',
      url: '/berserker-base/QrCodesysConfigManage/getOfflienConfig',
      params: null,
    })
  }
  // 初始化脱机码参数
  static syncOfflienCodeConfig = (): Promise<IRes> => {
    return service.request({
      method: 'get',
      url: '/berserker-base/QrCodesysConfigManage/syncOfflienCodeConfig',
      params: null,
    })
  }
  // 编辑脱机码参数
  static editOfflienCode = (
    params: any,
    feedbackType?: string
  ): Promise<IRes> => {
    return service.request(
      {
        method: 'post',
        url: '/berserker-base/QrCodesysConfigManage/editOfflienCode',
        data: params,
      },
      feedbackType
    )
  }
  // 检测脱机码参数
  static checkOfflienApi = (
    params: any,
    feedbackType?: string
  ): Promise<IRes> => {
    return service.request(
      {
        method: 'post',
        url: '/berserker-base/QrCodesysConfigManage/checkOfflienApi',
        data: params,
      },
      feedbackType
    )
  }
  // 上传脱机码秘钥文件
  static uploadSecretKeyFile = (
    params: any,
    feedbackType?: string
  ): Promise<IRes> => {
    return service.request(
      {
        method: 'post',
        url: '/berserker-base/QrCodesysConfigManage/uploadSecretKeyFile',
        data: params,
      },
      feedbackType
    )
  }
}

// [主题管理]相关接口
interface ThemeControl {
  platType?: string
  themeId?: string
  themeName?: string
  local?: boolean
  themePriority?: number
  startTime?: string
  endTime?: string
  scheduleId?: string
}

export class Theme {
  // 获取app主题列表
  static getTheme = (
    params?: ThemeControl,
    feedbackType?: string
  ): Promise<IRes> => {
    return service.request(
      {
        method: 'get',
        url: '/berserker-base-new/theme/info',
        params: params,
      },
      feedbackType
    )
  }
  // 获取主题计划
  static getThemeScheduleList = (
    params: ThemeControl,
    feedbackType?: string
  ): Promise<IRes> => {
    return service.request(
      {
        method: 'get',
        url: '/berserker-base-new/theme/normalThemeScheduleList',
        params: params,
      },
      feedbackType
    )
  }
  // 删除主题
  static deleteTheme = (
    params: ThemeControl,
    feedbackType?: string
  ): Promise<IRes> => {
    return service.request(
      {
        method: 'get',
        url: '/berserker-base-new/theme/delete',
        params: params,
      },
      feedbackType
    )
  }
  // 下载主题
  static installTheme = (
    params: ThemeControl,
    feedbackType?: string
  ): Promise<IRes> => {
    return service.request(
      {
        method: 'get',
        url: '/berserker-base/theme/receiveTheme',
        params: params,
        timeout: 1000000,
      },
      feedbackType
    )
  }
  // 设置计划
  static addNewPlan = (
    params: ThemeControl,
    feedbackType?: string
  ): Promise<IRes> => {
    return service.request(
      {
        method: 'post',
        url: '/berserker-base-new/theme/addSchedule',
        data: params,
      },
      feedbackType
    )
  }
  // 删除计划
  static deleteThemeSetting = (
    params: ThemeControl,
    feedbackType?: string
  ): Promise<IRes> => {
    return service.request(
      {
        method: 'get',
        url: '/berserker-base-new/theme/deleteSchedule',
        params: params,
      },
      feedbackType
    )
  }

  // // 获取pc商店主题
  // static getPcStoreTheme = ( feedbackType?:string): Promise<IRes> => {
  //   const configs = JSON.parse(localStorage.configsManage)
  //   console.log('configs', configs)
  //   return service.request({
  //     method: 'get',
  //     url: `${configs.cloudUrl}/cloud-api/theme/getThemes`
  //   }, feedbackType)
  // }

  // 获取当前使用主题
  static getCurrentTheme = (
    params: any,
    feedbackType?: string
  ): Promise<IRes> => {
    return service.request(
      {
        method: 'get',
        url: '/berserker-app/theme/currentTheme',
        params: params,
      },
      feedbackType
    )
  }
}
// [分页]相关接口
interface pageSize {
  current: number
  size: number
}
// interface reomoveZcomIn {
//   comId: number
// }
export class Module {
  // 获取组件列表分页
  static getZcomListPage = (
    params?: any,
    feedbackType?: string
  ): Promise<IRes> => {
    return service.request(
      {
        url: '/berserker-base-new/zcom/page',
        method: 'get',
        params: params,
      },
      feedbackType
    )
  }
  // 获取组件列表
  static getZcomList = (params?: any, feedbackType?: string): Promise<IRes> => {
    return service.request(
      {
        url: '/berserker-base-new/zcom/listCom',
        method: 'get',
        params: params,
      },
      feedbackType
    )
  }
  // 删除组件
  static removeZcom = (bh: number, feedbackType?: string): Promise<IRes> => {
    return service.request(
      {
        method: 'post',
        url: '/berserker-base-new/zcom/remove',
        data: bh,
        headers: {
          'Content-Type': 'application/json',
        },
      },
      feedbackType
    )
  }
  // headers: {
  //   'Content-Type': 'multipart/form-data'
  // }
  // 添加组件
  static addZcom = (data: any, feedbackType?: string): Promise<IRes> => {
    return service.request(
      {
        method: 'post',
        url: '/berserker-base-new/zcomnew/add',
        data: data,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      },
      feedbackType
    )
  }
  // 编辑组件
  static editZcom = (data: any, feedbackType?: string): Promise<IRes> => {
    return service.request(
      {
        method: 'post',
        url: '/berserker-base-new/zcomnew/update',
        data: data,
      },
      feedbackType
    )
  }
  // /berserker-base-d/zappnew/listByComBindApp
  // 获取组件绑定应用
  static getComBindApp = (
    params?: any,
    feedbackType?: string
  ): Promise<IRes> => {
    return service.request(
      {
        url: '/berserker-base-new/zappnew/listByComBindApp',
        method: 'get',
        params: params,
      },
      feedbackType
    )
  }
  // 设置组件绑定应用
  static setComBindApp = (data?: any, feedbackType?: string): Promise<IRes> => {
    return service.request(
      {
        method: 'post',
        // url: '/berserker-base-d/zcomnew/edit',
        url: '/berserker-base-new/zacanew/set',
        data: data,
      },
      feedbackType
    )
  }
  // 获取组件绑定广告
  static getComBindAdvertising = (
    params?: any,
    feedbackType?: string
  ): Promise<IRes> => {
    return service.request(
      {
        url: '/berserker-base/advertisingRelation/listByBind',
        method: 'get',
        params: params,
      },
      feedbackType
    )
  }

  // 设置组件绑定广告
  static setComBindAdvertising = (
    data?: any,
    feedbackType?: string
  ): Promise<IRes> => {
    return service.request(
      {
        method: 'post',
        // url: '/berserker-base-d/zcomnew/edit',
        url: '/berserker-base/advertisingRelation/bind',
        data: data,
      },
      feedbackType
    )
  }
  // 获取全部广告
  static getAdvertListPage = (
    params: any,
    feedbackType?: string
  ): Promise<IRes> => {
    return service.request(
      {
        method: 'get',
        url: 'berserker-base/basenoticeNew/page',
        params: params,
      },
      feedbackType
    )
  }
  // 不分页
  static getAdvertList = (
    params?: any,
    feedbackType?: string
  ): Promise<IRes> => {
    return service.request(
      {
        url: '/berserker-base/basenoticeNew',
        method: 'get',
        params: params,
      },
      feedbackType
    )
  }
}
/**
 * 菜单相关接口
 */
export class Menu {
  // 获取菜单列表
  static getZindexListPage = (
    params: pageSize,
    feedbackType?: string
  ): Promise<IRes> => {
    return service.request(
      {
        url: '/berserker-base/zindex/indexPage',
        method: 'get',
        params: params,
      },
      feedbackType
    )
  }
  static getZindexList = (
    params?: pageSize,
    feedbackType?: string
  ): Promise<IRes> => {
    return service.request(
      {
        url: '/berserker-base-new/zindex/listIndex',
        method: 'get',
        params: params,
      },
      feedbackType
    )
  }
  // 删除菜单
  static reomoveZindex = (bh: any, feedbackType?: string): Promise<IRes> => {
    return service.request(
      {
        method: 'post',
        // url: '/berserker-base-new/zindex/remove',
        url: '/berserker-base-new/zindex/deleteIndex',
        data: bh,
        headers: {
          'Content-Type': 'application/json',
        },
      },
      feedbackType
    )
  }
  // 编辑菜单JSON
  static editZindex = (data: any, feedbackType?: string): Promise<IRes> => {
    return service.request(
      {
        method: 'post',
        // url: '/berserker-base-new/zindex/edit',
        url: '/berserker-base-new/zindex/editIndex',
        data: data,
        headers: {
          'Content-Type': 'application/json',
        },
      },
      feedbackType
    )
  }
  // 编辑菜单FormData
  static editZindexFormData = (
    data: any,
    feedbackType?: string
  ): Promise<IRes> => {
    return service.request(
      {
        method: 'post',
        // url: '/berserker-base-new/zindex/edit',
        url: '/berserker-base/zindex/editIndexByFormData',
        data: data,
        // headers: {
        //   'Content-Type': 'multipart/form-data'
        // }
      },
      feedbackType
    )
  }
  //添加菜单
  static addZindex = (data: any, feedbackType?: string): Promise<IRes> => {
    return service.request(
      {
        method: 'post',
        url: '/berserker-base/zindex/addIndex',
        // url: '/berserker-base-new/zindex/add',
        data: data,
        // headers: {
        //   'Content-Type': 'multipart/form-data'
        // }
      },
      feedbackType
    )
  }
  // /berserker-base/zindex/edit
  // 获取子菜单- 不分页
  static getChildIndex = (
    params?: any,
    feedbackType?: string
  ): Promise<IRes> => {
    return service.request(
      {
        url: '/berserker-base/zindexNew/childIndex',
        method: 'get',
        params: params,
      },
      feedbackType
    )
  }
  //添加子菜单
  static addSubZindex = (data: any, feedbackType?: string): Promise<IRes> => {
    return service.request(
      {
        method: 'post',
        url: '/berserker-base-new/zindexNew/addIndex',
        data: data,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      },
      feedbackType
    )
  }
  // 菜单排序
  static zindexSort = (data: any, feedbackType?: string): Promise<IRes> => {
    return service.request(
      {
        method: 'post',
        // url: '/berserker-base-new/zindex/remove',
        url: '/berserker-base/zindexNew/sort',
        data: data,
        // headers: {
        //   'Content-Type': 'application/json'
        // }
      },
      feedbackType
    )
  }
  // /berserker-base/zindexNew/addIndex
}
/**
 * 方案相关接口
 */
interface scheduleControl {
  id?: number
  appScheduleId?: number | string
}
export class Scheme {
  // 获取方案列表分页
  static getAppScheduleListPage = (
    params: pageSize,
    feedbackType?: string
  ): Promise<IRes> => {
    return service.request(
      {
        // url: '/berserker-base-new/appSchedule/getAppScheduleListByPage',
        url: '/berserker-base-new/appSchedule/schedulePage',
        method: 'get',
        params: params,
      },
      feedbackType
    )
  }
  // 获取方案列表
  static getAppScheduleList = (
    params?: scheduleControl,
    feedbackType?: string
  ): Promise<IRes> => {
    return service.request(
      {
        // url: '/berserker-base-new/appSchedule/getAppScheduleList',
        url: '/berserker-base-new/appSchedule/getAppScheduleList',
        method: 'get',
        params: params,
      },
      feedbackType
    )
  }
  // 删除方案
  static deleteAppSchedule = (
    data: scheduleControl,
    feedbackType?: string
  ): Promise<IRes> => {
    // alert(id)
    return service.request(
      {
        // url: '/berserker-base-new/appSchedule/deleteAppSchedule',
        method: 'post',
        url: '/berserker-base-new/appSchedule/deleteSchedule',
        data: data,
        headers: {
          'Content-Type': 'application/json',
        },
      },
      feedbackType
    )
  }
  // // 删除菜单
  // static reomoveZindex = (bh: number, feedbackType?:string): Promise<IRes> => {
  //   return service.request({
  //     method: 'post',
  //     // url: '/berserker-base-new/zindex/remove',
  //     url: ' /berserker-base-new/zindex/deleteIndex',
  //     data: bh,
  //     headers: {
  //       'Content-Type': 'application/json'
  //     }
  //   }, feedbackType)
  // }
  // 编辑方案信息
  static updateAppScheduleWithDetail = (
    data: any,
    feedbackType?: string
  ): Promise<IRes> => {
    return service.request(
      {
        method: 'post',
        url: '/berserker-base-new/appSchedule/updateAppScheduleWithDetail',
        data: data,
        headers: {
          'Content-Type': 'application/json',
        },
      },
      feedbackType
    )
  }
  // 添加方案信息
  static addSchedule = (data: any, feedbackType?: string): Promise<IRes> => {
    return service.request(
      {
        method: 'post',
        // url: '/berserker-base-new/appSchedule/insertAppSchedule',
        // /berserker-base/appSchedule/insertAppSchedule
        url: '/berserker-base-new/appSchedule/addSchedule',
        data: data,
        headers: {
          'Content-Type': 'application/json',
        },
      },
      feedbackType
    )
  }
  //新增方案
  static addNewSchedule = (data: any, feedbackType?: string): Promise<IRes> => {
    return service.request(
      {
        method: 'post',
        url: '/berserker-base-new/appSchedule/insertAppSchedule',
        data: data,
        headers: {
          'Content-Type': 'application/json',
        },
      },
      feedbackType
    )
  }
  //  获取群组详情方案信息/分页
  static getPageGroupDetailWithSchedule = (
    params?: GroupControl,
    feedbackType?: string
  ): Promise<IRes> => {
    return service.request(
      {
        method: 'get',
        url: '/berserker-base/group/pageGroupWithGroupDetailAndSchedule',
        params: params,
      },
      feedbackType
    )
  }
  // 查询当前使用的方案
  static getAppBindScheme = (
    params?: GroupControl,
    feedbackType?: string
  ): Promise<IRes> => {
    return service.request(
      {
        method: 'get',
        url: '/berserker-base/appScheduleBindInfo/listScheduleBindInfo',
        params: params,
      },
      feedbackType
    )
  }
  //  应用绑定方案
  static saveAppBindScheme = (
    params?: GroupControl,
    feedbackType?: string
  ): Promise<IRes> => {
    return service.request(
      {
        method: 'post',
        url: '/berserker-base/appScheduleBindInfo/saveAppScheduleBindInfo',
        data: params,
      },
      feedbackType
    )
  }
  //  应用解绑方案
  static removeAppBindScheme = (
    params?: GroupControl,
    feedbackType?: string
  ): Promise<IRes> => {
    return service.request(
      {
        method: 'post',
        url: '/berserker-base/appScheduleBindInfo/removeAppScheduleBindInfo',
        data: params,
      },
      feedbackType
    )
  }
}

/**
 * 开发者管理相关接口
 */

export class Developer {
  // 获取开发者列表
  static getDeveloperList = (
    params: pageSize,
    feedbackType?: string
  ): Promise<IRes> => {
    return service.request(
      {
        url: '/berserker-base/developer/page',
        method: 'get',
        params: params,
      },
      feedbackType
    )
  }
}
// [应用]相关接口
interface Iapp {
  current: number
  size: number
  platType: any
}
interface IaddZappT {
  name: string
  nameEn: string
  status: number
}
interface IaddApp {
  apiKey: ''
  appCode: 'textAdd'
  appDesc: ''
  appIcon: 'textAdd.png'
  appIconPrefix: ''
  appName: '测试添加应用'
  appNameEn: 'textAdd'
  appType: '1'
  appUserType: 1
  developerId: null
  flagIsAdSupport: '1'
  flagIsEmbeddedRedirect: '1'
  flagIsH5App: '1'
  flagIsMobileApp: '0'
  flagIsPublicIcon: '0'
  flagIsSelfApp: '0'
  flagIsServiceApp: '0'
  flagIsShow: '0'
  flagIsTopApp: '0'
  flagIsWeChatMiniApp: '0'
  flagIsWebApp: '0'
  isPersist: '0'
  newIconUrl: null
  route: ''
  secretKey: ''
  serviceAppWebsite: ''
  showTitle: '0'
  status: '0'
  webApi: ''
  webAppWebsite: ''
  website: ''
}
export class App {
  // 查询应用列表---分页
  static getZappList = (params: Iapp, feedbackType?: string): Promise<IRes> => {
    return service.request(
      {
        // url: '/berserker-base/zapp/page',
        url: '/berserker-base-new/zappnew/page',
        method: 'get',
        params: params,
      },
      feedbackType
    )
  }

  // 查询应用列表---不分页
  static getZappListAll = (
    params?: any,
    feedbackType?: string
  ): Promise<IRes> => {
    return service.request(
      {
        // url: '/berserker-base/zapp/page',
        url: '/berserker-base-new/zappnew',
        method: 'get',
        params: params,
      },
      feedbackType
    )
  }
  // 查询应用列表
  static getZappListApp = (
    params?: IaddApp,
    feedbackType?: string
  ): Promise<IRes> => {
    return service.request(
      {
        url: '/berserker-base-new/zapp/listApp',
        method: 'get',
        params: params,
      },
      feedbackType
    )
  }
  // 查询类型列表-分页
  static getZappTList = (
    params: Iapp,
    feedbackType?: string
  ): Promise<IRes> => {
    return service.request(
      {
        url: '/berserker-base-new/zappT/page',
        method: 'get',
        params: params,
      },
      feedbackType
    )
  }
  // 查询类型列表-不分页
  static getZappTListAll = (
    params?: any,
    feedbackType?: string
  ): Promise<IRes> => {
    return service.request(
      {
        url: '/berserker-base-new/zappT/listApp',
        method: 'get',
        params: params,
      },
      feedbackType
    )
  }
  // 删除类型
  static removeZappT = (bh: number, feedbackType?: string): Promise<IRes> => {
    return service.request(
      {
        url: '/berserker-base-new/zappT/remove',
        method: 'post',
        data: bh,
        headers: {
          'Content-Type': 'application/json',
        },
      },
      feedbackType
    )
  }
  // 编辑应用类型
  // static editZappT = (data: any, feedbackType?:string): Promise<IRes> => {
  //   return service.request({
  //     url: '/berserker-base-new/zappT/edit',
  //     method: 'post',
  //     data: data,
  //     headers: {
  //       'Content-Type': 'application/json'
  //     }
  //   }, feedbackType)
  // }
  static editZappT = (data: any, feedbackType?: string): Promise<IRes> => {
    return service.request(
      {
        url: '/berserker-base-new/zappT/newEdit',
        method: 'post',
        data: data,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      },
      feedbackType
    )
  }
  // 添加类型
  static addZappT = (
    params: IaddZappT,
    feedbackType?: string
  ): Promise<IRes> => {
    return service.request(
      {
        url: '/berserker-base-new/zappT/add',
        method: 'post',
        data: params,
      },
      feedbackType
    )
  }
  // 添加类型-支持图片
  static addZappTFormData = (
    params: any,
    feedbackType?: string
  ): Promise<IRes> => {
    return service.request(
      {
        url: '/berserker-base-new/zappT/newAdd',
        method: 'post',
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        data: params,
      },
      feedbackType
    )
  }
  // 添加应用
  static addApp = (params: any, feedbackType?: string): Promise<IRes> => {
    return service.request(
      {
        url: 'berserker-base/zappnew/add',
        method: 'post',
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        data: params,
      },
      feedbackType
    )
  }
  // 编辑应用
  static editApp = (params: any, feedbackType?: string): Promise<IRes> => {
    return service.request(
      {
        // url: 'berserker-base-new/zapptest/add',
        url: '/berserker-base-new/zappnew/edit',
        method: 'post',
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        data: params,
      },
      feedbackType
    )
  }
  // 删除应用
  static deleteApp = (params: any, feedbackType?: string): Promise<IRes> => {
    return service.request(
      {
        // url: 'berserker-base-new/zapptest/add',
        url: '/berserker-base-new/zappnew/delete',
        method: 'post',
        data: params,
      },
      feedbackType
    )
  }
  // 查询已安装的应用
  static getAppAll = (params: any, feedbackType?: string): Promise<IRes> => {
    return service.request(
      {
        // url: 'berserker-base-d/zapptest/add',
        url: '/berserker-base-new/zappnew/listByCode',
        method: 'get',
        params: params,
      },
      feedbackType
    )
  }
  // 获取图标库图片
  static getIconLibrary = (
    params: any,
    feedbackType?: string
  ): Promise<IRes> => {
    return service.request(
      {
        url: '/berserker-app/theme/fileList',
        method: 'get',
        params: params,
      },
      feedbackType
    )
  }
  // 根据缴费项目id查询信息
  static byItemidGetinfo = (
    params: any,
    feedbackType?: string
  ): Promise<IRes> => {
    return service.request(
      {
        url: '/charge/pay/byItemidGetinfo',
        method: 'get',
        params: params,
      },
      feedbackType
    )
  }

  // 根据BasePublic获取不同应用列表
  static pageByPermission = (
    params: any,
    feedbackType?: string
  ): Promise<IRes> => {
    return service.request(
      {
        url: 'berserker-base/zappnew/pageByPermission',
        method: 'get',
        params: params,
      },
      feedbackType
    )
  }

  // 获取应用使用数量的租户列表
  static listTenantByCode = (
    params: { appCode: number },
    feedbackType?: string
  ): Promise<IRes> => {
    return service.request(
      {
        url: '/berserker-base/zappnew/listTenantByCode',
        method: 'get',
        params: params,
      },
      feedbackType
    )
  }
  // 获取应用使用数量的租户列表分页
  static pageTenantByCode = (
    params: any,
    feedbackType?: string
  ): Promise<IRes> => {
    return service.request(
      {
        url: '/berserker-base/zappnew/pageTenantByCode',
        method: 'get',
        params: params,
      },
      feedbackType
    )
  }

  // 基础应用上下架应用
  static updateBaseByAppCode = (
    data: { appCode: number },
    feedbackType?: string
  ): Promise<IRes> => {
    return service.request(
      {
        url: '/berserker-base/zappnew/updateBaseByAppCode',
        method: 'post',
        data,
      },
      feedbackType
    )
  }

  // 公共应用上下架应用
  static updatePublicByAppCode = (
    data: { appCode: number },
    feedbackType?: string
  ): Promise<IRes> => {
    return service.request(
      {
        url: '/berserker-base/zappnew/updatePublicByAppCode',
        method: 'post',
        data,
      },
      feedbackType
    )
  }

  // 获取应用授权回显数据
  static getAppAuth = (params: any, feedbackType?: string): Promise<IRes> => {
    return service.request(
      {
        url: '/berserker-base/zappnew/getUpdateByAppCodeParam',
        method: 'get',
        params
      },
      feedbackType
    )
  }
}

interface cardControl {
  id?: number | string
  model?: string
  name?: string
  desc?: string
  remark?: string
  formData?: File
  current?: number
  size?: number
  cardBackgroundId?: string
  type?: string
  val?: string
  cardStyleBindDetail?: any
}
interface cardStyleBg {
  bucketName?: string
  file?: File
  name?: string
  type?: string
  id?: number | string
  imageUrl?: string
  [key: string]: any
}

export class Card {
  //  获取卡样
  static getCardList = (
    params: cardControl,
    feedbackType?: string
  ): Promise<IRes> => {
    return service.request(
      {
        url: '/berserker-base-new/cardStyle',
        // url: '/berserker-base/cardStyle',
        method: 'get',
        params: params,
      },
      feedbackType
    )
  }

  // 上传文件
  static uploadFiles = (
    params: cardControl,
    feedbackType?: string
  ): Promise<IRes> => {
    return service.request(
      {
        // url: '/berserker-base-new/file/uploadFiles',
        url: '/berserker-base-new/file/uploadFiles',
        method: 'post',
        data: params,
      },
      feedbackType
    )
  }
  // 保存卡样
  static addAndUpdate = (
    params: cardControl,
    feedbackType?: string
  ): Promise<IRes> => {
    return service.request(
      {
        // url: '/berserker-base-new/cardStyle/addAndUpdate',
        url: '/berserker-base-new/cardStyle/addAndUpdate',
        method: 'post',
        data: params,
      },
      feedbackType
    )
  }
  // 删除卡样
  static removeCard = (
    params: cardControl,
    feedbackType?: string
  ): Promise<IRes> => {
    return service.request(
      {
        // url: '/berserker-base-new/cardStyle/remove',
        url: '/berserker-base-new/cardStyle/remove',
        method: 'post',
        data: params,
      },
      feedbackType
    )
  }

  //  查询卡样类型
  static getCardTypeList = (feedbackType?: string): Promise<IRes> => {
    return service.request(
      {
        // url: '/berserker-base-new/cardStyle/type',
        url: '/berserker-base-new/cardStyle/type',
        method: 'get',
      },
      feedbackType
    )
  }

  // 绑定卡样
  static bindCard = (
    params: cardControl,
    feedbackType?: string
  ): Promise<IRes> => {
    return service.request(
      {
        // url: '/berserker-base-new/cardStyle/bind',
        url: '/berserker-base-new/cardStyle/bind',
        method: 'post',
        data: params,
      },
      feedbackType
    )
  }

  // 解绑卡样
  static unBindCard = (
    params: cardControl,
    feedbackType?: string
  ): Promise<IRes> => {
    return service.request(
      {
        // url: '/berserker-base-new/cardStyle/bind',
        url: '/berserker-base-new/cardStyle/unbind',
        method: 'post',
        data: params,
      },
      feedbackType
    )
  }

  //  查询绑定卡样列表
  static getCardBindList = (
    params: cardControl,
    feedbackType?: string
  ): Promise<IRes> => {
    return service.request(
      {
        // url: '/berserker-base-new/cardStyle/bind/page',
        url: '/berserker-base-new/cardStyle/bind/page',
        method: 'get',
        params: params,
      },
      feedbackType
    )
  }

  // 获取卡样背景 /berserker-base-new/cardStyle/background
  static getCardBackground = (
    params?: any,
    feedbackType?: string
  ): Promise<IRes> => {
    return service.request(
      {
        url: '/berserker-base-new/cardStyle/background',
        method: 'get',
        params: params,
      },
      feedbackType
    )
  }

  // 添加编辑卡样背景 /berserker-base-new/cardStyle/background/addAndUpdate
  static addCardBackground = (
    params: cardStyleBg,
    feedbackType?: string
  ): Promise<IRes> => {
    return service.request(
      {
        url: '/berserker-base-new/cardStyle/background/addAndUpdate',
        method: 'post',
        data: params,
      },
      feedbackType
    )
  }
  // 批量设置身份
  static bindIdentity = (
    params?: cardStyleBg,
    feedbackType?: string
  ): Promise<IRes> => {
    return service.request(
      {
        url: '/berserker-base/cardStyle/background/bindIdentity',
        method: 'post',
        data: params,
      },
      feedbackType
    )
  }

  //删除卡样背景 /berserker-base-new/cardStyle/background/remove
  static removeCardBackground = (
    params: cardStyleBg,
    feedbackType?: string
  ): Promise<IRes> => {
    return service.request(
      {
        url: '/berserker-base-new/cardStyle/background/remove',
        method: 'post',
        data: params,
      },
      feedbackType
    )
  }
}

// 选择框信息查询
export class identityInfo {
  // 获取身份列表
  static getIdentityList = (feedbackType?: string): Promise<IRes> => {
    return service.request(
      {
        method: 'get',
        url: '/berserker-base-new/identity',
      },
      feedbackType
    )
  }

  // 获取部门列表
  static getBasedepartmentList = (feedbackType?: string): Promise<IRes> => {
    return service.request(
      {
        method: 'get',
        url: '/berserker-base-new/basedepartment',
      },
      feedbackType
    )
  }

  // 获取部门树列表
  static getBasedepartmentTreeList = (
    feedbackType?: string
  ): AxiosPromise<IRes> => {
    return service.request({
      method: 'get',
      url: '/berserker-base/basedepartment/gettree',
    })
  }

  // /berserker-base/extendInfo/listAllExtendInfoCode
  // 获取数据权限
  static getListAllExtendInfo = (
    params: any,
    feedbackType?: string
  ): Promise<IRes> => {
    return service.request(
      {
        method: 'get',
        url: '/berserker-base/extendInfo/list',
        params: params,
      },
      feedbackType
    )
  }
  // 获取核算单位
  static getSchcodeList = (feedbackType?: string): Promise<IRes> => {
    return service.request(
      {
        method: 'get',
        url: 'berserker-base/ykt/schcode/list',
      },
      feedbackType
    )
  }
}
export class Log {
  // 查询日志列表---分页
  static gatewayAccessLogs = (
    params: any,
    feedbackType?: string
  ): Promise<IRes> => {
    return service.request(
      {
        url: '/berserker-log/gatewayAccessLogs/page',
        method: 'get',
        params: params,
      },
      feedbackType
    )
  }
  static gatAppClickLogs = (
    params: any,
    feedbackType?: string
  ): Promise<IRes> => {
    return service.request(
      {
        url: '/berserker-log/appClickLogs/page',
        method: 'get',
        params: params,
      },
      feedbackType
    )
  }
}

export class Language {
  // 查询多语言
  static getLanguage = (params: any, feedbackType?: string): Promise<IRes> => {
    return service.request(
      {
        url: '/berserker-base/language/list',
        method: 'get',
        params: params,
      },
      feedbackType
    )
  }

  // 查询多语言-分页
  static getLanguagePage = (
    params: any,
    feedbackType?: string
  ): Promise<IRes> => {
    return service.request(
      {
        url: '/berserker-base/language/page',
        method: 'get',
        params: params,
      },
      feedbackType
    )
  }
  //  编辑多语言
  static editLanguage = (params: any, feedbackType?: string): Promise<IRes> => {
    return service.request(
      {
        url: '/berserker-base/language/edit',
        method: 'post',
        data: params,
      },
      feedbackType
    )
  }

  //   添加多语言
  static addLanguage = (params: any, feedbackType?: string): Promise<IRes> => {
    return service.request(
      {
        url: '/berserker-base/language/add',
        method: 'post',
        data: params,
      },
      feedbackType
    )
  }

  //   删除多语言
  static removeLanguage = (id: any, feedbackType?: string): Promise<IRes> => {
    return service.request(
      {
        url: `/berserker-base/language/delete/${id}`,
        method: 'post',
        data: { id },
      },
      feedbackType
    )
  }
  //   清空多语言
  static removeAllLanguage = (
    type: string,
    feedbackType?: string
  ): Promise<IRes> => {
    return service.request(
      {
        url: `/berserker-base/language/deleteAll/${type}`,
        method: 'post',
        data: {},
      },
      feedbackType
    )
  }
  //   压缩包方式上传多语言
  static uploadLangZip = (data: any, feedbackType?: string): Promise<IRes> => {
    return service.request(
      {
        url: '/berserker-base/language/upload',
        method: 'post',
        data,
      },
      feedbackType
    )
  }
  //
}

export class Auth {
  // 查询注册列表
  static getH5AuthPage = (
    params: any,
    feedbackType?: string
  ): Promise<IRes> => {
    return service.request(
      {
        url: '/berserker-base/h5Auth/page',
        method: 'get',
        params: params,
      },
      feedbackType
    )
  }

  // 查询注册列表
  static addH5Auth = (params: any, feedbackType?: string): Promise<IRes> => {
    return service.request(
      {
        url: '/berserker-base/h5Auth/register',
        method: 'post',
        data: params,
      },
      feedbackType
    )
  }

  // 查询注册列表
  static removeH5Auth = (id: any, feedbackType?: string): Promise<IRes> => {
    return service.request(
      {
        url: `/berserker-base/h5Auth/delete/${id}`,
        method: 'post',
        data: { id },
      },
      feedbackType
    )
  }
}
export class WxCard {
  // 查询背景色
  static getBgColor = (feedbackType?: string): Promise<IRes> => {
    return service.request(
      {
        url: `/berserker-wechat/card/color`,
        method: 'get',
        params: null,
      },
      feedbackType
    )
  }

  // 查询领卡用户
  static getCardUser = (params: any, feedbackType?: string): Promise<IRes> => {
    return service.request(
      {
        url: `/berserker-wechat/cardUser/page`,
        method: 'get',
        params,
      },
      feedbackType
    )
  }
  // 删除领卡用户
  static removeCardUser = (data: any, feedbackType?: string): Promise<IRes> => {
    return service.request(
      {
        url: `/berserker-wechat/cardUser/remove`,
        method: 'post',
        data,
      },
      feedbackType
    )
  }
  // 查询卡券
  static getCard = (params: any, feedbackType?: string): Promise<IRes> => {
    return service.request(
      {
        url: `/berserker-wechat/card/page`,
        method: 'get',
        params,
      },
      feedbackType
    )
  }
  // 删除领卡用户
  static removeCard = (data: any, feedbackType?: string): Promise<IRes> => {
    return service.request(
      {
        url: `/berserker-wechat/card/remove`,
        method: 'post',
        data,
      },
      feedbackType
    )
  }
  // 获取有效期
  static getDateType = (feedbackType?: string): Promise<IRes> => {
    return service.request(
      {
        url: `/berserker-wechat/card/dateType`,
        method: 'get',
        params: null,
      },
      feedbackType
    )
  }
  // 创建卡片
  static wxCardSave = (params: any, feedbackType?: string): Promise<IRes> => {
    return service.request(
      {
        url: '/berserker-wechat/card/save',
        method: 'post',
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        data: params,
      },
      feedbackType
    )
  }
  static codeValue = (params?: any, feedbackType?: string): Promise<IRes> => {
    return service.request(
      {
        url: '/berserker-wechat/cardField/codeValue',
        method: 'get',
        params: params,
      },
      feedbackType
    )
  }
  // 创建卡片
  static wxCardEdit = (data: any, feedbackType?: string): Promise<IRes> => {
    return service.request(
      {
        url: '/berserker-wechat/card/update',
        method: 'post',
        data,
      },
      feedbackType
    )
  }
  // /berserker-wechat/card/update
}
