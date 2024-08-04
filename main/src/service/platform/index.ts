import service, { IRes } from '@/service';
import { AxiosPromise } from 'axios';
// import qs from 'qs'

// [群组设置]相关接口
interface GroupControl {
  current?: number;
  size?: number;
  descs?: string;
  likeSelectName?: boolean;
  resourceId?: number | string;
  type?: string;
  value?: boolean;
  id?: number | string;
  name?: string;
  status?: string | number;
  remark?: string;
  scheduleUserType?: string;
  scheduleServiceType?: string;
  groupId?: number | string;
  valueList?: any;
  json?: string;
  isCondition?: boolean;
  accountIdList?: any;
  selectLike?: boolean;
  resourceIdList?: string | Array<any>;
  removeResource?: string | boolean;
  resourceList?: string | Array<any>;
  resourceMap?: any;
  code?: string;
  codeList?: Array<any>;
  listIndex?: number | string;
  param?: any;
}
export class Group {
  //  获取群组列表
  // static getGroup = (params: GroupControl, feedbackType?:string): Promise<IRes> => {
  //   return service.request({
  //     url: '/berserker-base/group/page',
  //     method: 'get',
  //     params: params
  //   })
  // }
  // 新-获取群组列表
  static getGroup = (
    params: GroupControl,
    feedbackType?: string
  ): Promise<IRes> => {
    return service.request(
      {
        url: '/berserker-base/group/pageGroupWithCount',
        method: 'get',
        params: params,
      },
      feedbackType
    );
  };
  //  群组设置
  static groupEdit = (
    params: GroupControl,
    feedbackType?: string
  ): Promise<IRes> => {
    return service.request(
      {
        method: 'post',
        url: '/berserker-base/group/edit',
        data: params,
      },
      feedbackType
    );
  };

  //  群组删除
  static removeGroup = (
    params: GroupControl,
    feedbackType?: string
  ): Promise<IRes> => {
    return service.request(
      {
        method: 'post',
        url: '/berserker-base/group/remove',
        data: params,
      },
      feedbackType
    );
  };

  //  添加群组
  static addGroup = (
    params: GroupControl,
    feedbackType?: string
  ): Promise<IRes> => {
    return service.request(
      {
        method: 'post',
        url: '/berserker-base/group/add',
        data: params,
      },
      feedbackType
    );
  };

  //  保存权限开关
  static extendInfoSwitch = (
    params: GroupControl,
    feedbackType?: string
  ): Promise<IRes> => {
    return service.request(
      {
        method: 'post',
        url: '/berserker-base/extendInfo/saveExtendInfoSwitch',
        data: params,
      },
      feedbackType
    );
  };

  //  判断权限开关状态
  static getExtendInfoSwitch = (
    params: GroupControl,
    feedbackType?: string
  ): Promise<IRes> => {
    return service.request(
      {
        method: 'get',
        url: '/berserker-base/extendInfo/getExtendInfoSwitch',
        params: params,
      },
      feedbackType
    );
  };

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
    );
  };
  //  获取名单
  static getExtendInfoList = (
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
    );
  };

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
    );
  };
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
    );
  };

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
    );
  };
  // /berserker-base/extendInfo/saveExtendInfo
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
    );
  };

  static removeExtendList = (
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
    );
  };
  // //  获取身份列表
  // static getIdentityList = ( feedbackType?:string): Promise<IRes> => {
  //   return service.request({
  //     method: 'get',
  //     url: '/berserker-base/identity'
  //   })
  // }

  //  获取校区列表
  static getCampusList = (feedbackType?: string): Promise<IRes> => {
    return service.request({
      method: 'get',
      url: '/berserker-base/campus',
    });
  };
  //获取部门信息
  // static getBasedepartment = ( feedbackType?:string): Promise<IRes> => {
  //   return service.request({
  //     method: 'get',
  //     url: '/berserker-base/basedepartment'
  //   })
  // }

  //获取人员信息列表
  static getListAfterConvertedExtendInfo = (
    params: GroupControl,
    feedbackType?: string
  ): Promise<IRes> => {
    return service.request(
      {
        method: 'post',
        url: '/berserker-base/extendInfo/listAfterConvertedExtendInfo',
        data: params,
      },
      feedbackType
    );
  };

  //获取人员信息列表
  static getListAfterConvertedExtendInfoWithDetail = (
    params: GroupControl,
    feedbackType?: string
  ): Promise<IRes> => {
    return service.request(
      {
        method: 'post',
        url: '/berserker-base/extendInfo/listAfterConvertedExtendInfoWithDetail',
        data: params,
      },
      feedbackType
    );
  };

  //添加人员信息
  static saveExtendInfo = (
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
    );
  };

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
    );
  };

  // 获取用户账号信息列表
  static getAccount = (
    params: GroupControl,
    feedbackType?: string
  ): Promise<IRes> => {
    return service.request(
      {
        method: 'get',
        url: '/berserker-base/account/page',
        params: params,
      },
      feedbackType
    );
  };

  //  获取群组详情方案信息
  static getListGroupDetailWithSchedule = (
    params?: GroupControl,
    feedbackType?: string
  ): Promise<IRes> => {
    return service.request(
      {
        method: 'get',
        url: '/berserker-base/groupDetail/listGroupDetailWithSchedule',
        params: params,
      },
      feedbackType
    );
  };

  //  获取可设置方案列表
  static getAppScheduleList = (
    params: GroupControl,
    feedbackType?: string
  ): Promise<IRes> => {
    return service.request(
      {
        method: 'get',
        url: '/berserker-base/appSchedule/getAppScheduleList',
        params: params,
      },
      feedbackType
    );
  };

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
    );
  };
  // 保存群组详情
  static saveGroupDetail = (
    params: GroupControl,
    feedbackType?: string
  ): Promise<IRes> => {
    return service.request(
      {
        method: 'post',
        url: '/berserker-base/groupDetail/saveGroupDetail',
        data: params,
      },
      feedbackType
    );
  };

  //  删除群组详情方案
  static removeSchedule = (
    params: GroupControl,
    feedbackType?: string
  ): Promise<IRes> => {
    return service.request(
      {
        method: 'post',
        url: '/berserker-base/groupDetail/remove',
        data: params,
      },
      feedbackType
    );
  };
}

// [参数设置]相关接口
interface ConfigControl {
  ascs?: string | number;
  code?: string | number;
  description?: string;
  id?: string | number;
  name?: string | number;
  type?: string;
  value?: string;
  fromTime?: string;
  toTime?: string;
  fromTimestamp?: string;
  reSynchronous?: string;
}

export class SystemConfig {
  static getConfigData = (
    params: ConfigControl & pageSize,
    feedbackType?: string
  ): Promise<IRes> => {
    return service.request(
      {
        method: 'get',
        url: 'berserker-base/config/page',
        params: params,
      },
      feedbackType
    );
  };

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
    );
  };

  static getTaskSpeed = (feedbackType?: string): Promise<IRes> => {
    return service.request({
      method: 'get',
      url: '/berserker-ykt-sync/turnover/getTaskSpeed',
    });
  };

  static edit = (
    params: ConfigControl,
    feedbackType?: string
  ): Promise<IRes> => {
    return service.request(
      {
        method: 'post',
        url: '/berserker-base/config/edit',
        data: params,
      },
      feedbackType
    );
  };

  static removeAll = (feedbackType?: string): Promise<IRes> => {
    return service.request({
      method: 'post',
      url: '/berserker-base/redis/removeAll',
    });
  };
  static frontInfo = (feedbackType?: string): Promise<IRes> => {
    return service.request({
      method: 'get',
      url: '/berserker-app/frontInfo',
    });
  };
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
    );
  };

  // 根据type查询该类型下的系统参数 type: login/third/ecard
  static getConfigByType = (
    type: string,
    feedbackType?: string
  ): Promise<IRes> => {
    return service.request({
      method: 'get',
      url: '/berserker-base/sysConfigManage/list/' + type,
    });
  };
  // 提交系统参数 type: login/third/ecard
  static editSysConfigManage = (
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
    );
  };

  // 查询登录配置
  static getLoginConfig = (feedbackType?: string): Promise<IRes> => {
    return service.request({
      method: 'get',
      url: '/berserker-base/loginConfig/list',
    });
  };
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
    );
  };
}

// [主题管理]相关接口
interface ThemeControl {
  platType?: string;
  themeId?: string;
  themeName?: string;
  local?: boolean;
  themePriority?: number;
  startTime?: string;
  endTime?: string;
  scheduleId?: string;
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
        url: '/berserker-base/theme/info',
        params: params,
      },
      feedbackType
    );
  };
  // 获取主题计划
  static getThemeScheduleList = (
    params: ThemeControl,
    feedbackType?: string
  ): Promise<IRes> => {
    return service.request(
      {
        method: 'get',
        url: '/berserker-base/theme/normalThemeScheduleList',
        params: params,
      },
      feedbackType
    );
  };
  // 删除主题
  static deleteTheme = (
    params: ThemeControl,
    feedbackType?: string
  ): Promise<IRes> => {
    return service.request(
      {
        method: 'get',
        url: '/berserker-base/theme/delete',
        params: params,
      },
      feedbackType
    );
  };
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
      },
      feedbackType
    );
  };
  // 设置计划
  static addNewPlan = (
    params: ThemeControl,
    feedbackType?: string
  ): Promise<IRes> => {
    return service.request(
      {
        method: 'post',
        url: '/berserker-base/theme/addSchedule',
        data: params,
      },
      feedbackType
    );
  };
  // 删除计划
  static deleteThemeSetting = (
    params: ThemeControl,
    feedbackType?: string
  ): Promise<IRes> => {
    return service.request(
      {
        method: 'get',
        url: '/berserker-base/theme/deleteSchedule',
        params: params,
      },
      feedbackType
    );
  };
  // 获取pc商店主题
  static getPcStoreTheme = (feedbackType?: string): Promise<IRes> => {
    const configs = JSON.parse(localStorage.configsManage);
    console.log('configs', configs);
    return service.request({
      method: 'get',
      url: `${configs.cloudUrl}/theme/getThemes`,
    });
  };

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
    );
  };
}
// [分页]相关接口
interface pageSize {
  current: number;
  size: number;
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
        url: '/berserker-base/zcom/page',
        method: 'get',
        params: params,
      },
      feedbackType
    );
  };
  // 获取组件列表
  static getZcomList = (params?: any, feedbackType?: string): Promise<IRes> => {
    return service.request(
      {
        url: '/berserker-base/zcom/listCom',
        method: 'get',
        params: params,
      },
      feedbackType
    );
  };
  // 删除组件
  static removeZcom = (bh: number, feedbackType?: string): Promise<IRes> => {
    return service.request({
      method: 'post',
      url: '/berserker-base/zcom/remove',
      data: bh,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  };
  // 添加组件
  static addZcom = (data: any, feedbackType?: string): Promise<IRes> => {
    return service.request({
      method: 'post',
      url: '/berserker-base/zcomnew/add',
      data: data,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  };
  // 编辑组件
  static editZcom = (data: any, feedbackType?: string): Promise<IRes> => {
    return service.request({
      method: 'post',
      url: '/berserker-base/zcomnew/update',
      data: data,
    });
  };
  // /berserker-base-d/zappnew/listByComBindApp
  // 获取组件绑定应用
  static getComBindApp = (
    params?: any,
    feedbackType?: string
  ): Promise<IRes> => {
    return service.request(
      {
        url: '/berserker-base/zappnew/listByComBindApp',
        method: 'get',
        params: params,
      },
      feedbackType
    );
  };
  // 设置组件绑定应用
  static setComBindApp = (data?: any, feedbackType?: string): Promise<IRes> => {
    return service.request({
      method: 'post',
      // url: '/berserker-base-d/zcomnew/edit',
      url: '/berserker-base/zacanew/set',
      data: data,
    });
    // return service.request({
    //   url: '/berserker-base-d/zacanew/set',
    //   method: 'get',
    //   params: params
    // })
  };
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
    );
  };
  static getZindexList = (
    params?: pageSize,
    feedbackType?: string
  ): Promise<IRes> => {
    return service.request(
      {
        url: '/berserker-base/zindex/listIndex',
        method: 'get',
        params: params,
      },
      feedbackType
    );
  };
  // 删除菜单
  static reomoveZindex = (bh: number, feedbackType?: string): Promise<IRes> => {
    return service.request({
      method: 'post',
      // url: '/berserker-base/zindex/remove',
      url: '/berserker-base/zindex/deleteIndex',
      data: bh,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  };
  // 编辑菜单JSON
  static editZindex = (data: any, feedbackType?: string): Promise<IRes> => {
    return service.request({
      method: 'post',
      // url: '/berserker-base/zindex/edit',
      url: '/berserker-base/zindex/editIndex',
      data: data,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  };
  // 编辑菜单FormData
  static editZindexFormData = (
    data: any,
    feedbackType?: string
  ): Promise<IRes> => {
    return service.request({
      method: 'post',
      // url: '/berserker-base/zindex/edit',
      url: '/berserker-base/zindex/editIndexByFormData',
      data: data,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  };
  //添加菜单
  static addZindex = (data: any, feedbackType?: string): Promise<IRes> => {
    return service.request({
      method: 'post',
      url: '/berserker-base/zindex/addIndex',
      // url: '/berserker-base/zindex/add',
      data: data,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  };
  // /berserker-base/zindex/edit
}
/**
 * 方案相关接口
 */
interface scheduleControl {
  id?: number;
  appScheduleId?: number | string;
}
export class Scheme {
  // 获取方案列表分页
  static getAppScheduleListPage = (
    params: pageSize,
    feedbackType?: string
  ): Promise<IRes> => {
    return service.request(
      {
        // url: '/berserker-base/appSchedule/getAppScheduleListByPage',
        url: '/berserker-base/appSchedule/schedulePage',
        method: 'get',
        params: params,
      },
      feedbackType
    );
  };
  // 获取方案列表
  static getAppScheduleList = (
    params?: scheduleControl,
    feedbackType?: string
  ): Promise<IRes> => {
    return service.request(
      {
        // url: '/berserker-base/appSchedule/getAppScheduleList',
        url: '/berserker-base/appSchedule/getAppScheduleList',
        method: 'get',
        params: params,
      },
      feedbackType
    );
  };
  // 删除方案
  static deleteAppSchedule = (
    data: scheduleControl,
    feedbackType?: string
  ): Promise<IRes> => {
    // alert(id)
    return service.request({
      // url: '/berserker-base/appSchedule/deleteAppSchedule',
      method: 'post',
      url: '/berserker-base/appSchedule/deleteSchedule',
      data: data,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  };
  // // 删除菜单
  // static reomoveZindex = (bh: number, feedbackType?:string): Promise<IRes> => {
  //   return service.request({
  //     method: 'post',
  //     // url: '/berserker-base/zindex/remove',
  //     url: ' /berserker-base/zindex/deleteIndex',
  //     data: bh,
  //     headers: {
  //       'Content-Type': 'application/json'
  //     }
  //   })
  // }
  // 编辑方案信息
  static updateAppScheduleWithDetail = (
    data: any,
    feedbackType?: string
  ): Promise<IRes> => {
    return service.request({
      method: 'post',
      url: '/berserker-base/appSchedule/updateAppScheduleWithDetail',
      data: data,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  };
  // 添加方案信息
  static addSchedule = (data: any, feedbackType?: string): Promise<IRes> => {
    return service.request({
      method: 'post',
      // url: '/berserker-base/appSchedule/insertAppSchedule',
      // /berserker-base/appSchedule/insertAppSchedule
      url: '/berserker-base/appSchedule/addSchedule',
      data: data,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  };
  //新增方案
  static addNewSchedule = (data: any, feedbackType?: string): Promise<IRes> => {
    return service.request({
      method: 'post',
      url: '/berserker-base/appSchedule/insertAppSchedule',
      data: data,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  };
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
    );
  };
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
    );
  };
}
// [应用]相关接口
interface Iapp {
  current: number;
  size: number;
}
interface IaddZappT {
  name: string;
  nameEn: string;
  status: number;
}
interface IaddApp {
  apiKey: '';
  appCode: 'textAdd';
  appDesc: '';
  appIcon: 'textAdd.png';
  appIconPrefix: '';
  appName: '测试添加应用';
  appNameEn: 'textAdd';
  appType: '1';
  appUserType: 1;
  developerId: null;
  flagIsAdSupport: '1';
  flagIsEmbeddedRedirect: '1';
  flagIsH5App: '1';
  flagIsMobileApp: '0';
  flagIsPublicIcon: '0';
  flagIsSelfApp: '0';
  flagIsServiceApp: '0';
  flagIsShow: '0';
  flagIsTopApp: '0';
  flagIsWeChatMiniApp: '0';
  flagIsWebApp: '0';
  isPersist: '0';
  newIconUrl: null;
  route: '';
  secretKey: '';
  serviceAppWebsite: '';
  showTitle: '0';
  status: '0';
  webApi: '';
  webAppWebsite: '';
  website: '';
}
export class App {
  // 查询应用列表---分页
  static getZappList = (params: Iapp, feedbackType?: string): Promise<IRes> => {
    return service.request(
      {
        // url: '/berserker-base/zapp/page',
        url: '/berserker-base/zappnew/page',
        method: 'get',
        params: params,
      },
      feedbackType
    );
  };

  // 查询应用列表---不分页
  static getZappListAll = (
    params?: Iapp,
    feedbackType?: string
  ): Promise<IRes> => {
    return service.request(
      {
        // url: '/berserker-base/zapp/page',
        url: '/berserker-base/zappnew',
        method: 'get',
        params: params,
      },
      feedbackType
    );
  };
  // 查询应用列表
  static getZappListApp = (
    params?: IaddApp,
    feedbackType?: string
  ): Promise<IRes> => {
    return service.request(
      {
        url: '/berserker-base/zapp/listApp',
        method: 'get',
        params: params,
      },
      feedbackType
    );
  };
  // 查询类型列表-分页
  static getZappTList = (
    params: Iapp,
    feedbackType?: string
  ): Promise<IRes> => {
    return service.request(
      {
        url: '/berserker-base/zappT/page',
        method: 'get',
        params: params,
      },
      feedbackType
    );
  };
  // 查询类型列表-不分页
  static getZappTListAll = (
    params: any,
    feedbackType?: string
  ): Promise<IRes> => {
    return service.request(
      {
        url: '/berserker-base/zappT/listApp',
        method: 'get',
        params: params,
      },
      feedbackType
    );
  };
  // 删除类型
  static removeZappT = (bh: number, feedbackType?: string): Promise<IRes> => {
    return service.request({
      url: '/berserker-base/zappT/remove',
      method: 'post',
      data: bh,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  };
  // 编辑应用类型
  // static editZappT = (data: any, feedbackType?:string): Promise<IRes> => {
  //   return service.request({
  //     url: '/berserker-base/zappT/edit',
  //     method: 'post',
  //     data: data,
  //     headers: {
  //       'Content-Type': 'application/json'
  //     }
  //   })
  // }
  static editZappT = (data: any, feedbackType?: string): Promise<IRes> => {
    return service.request({
      url: '/berserker-base/zappT/newEdit',
      method: 'post',
      data: data,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  };
  // 添加类型
  static addZappT = (
    params: IaddZappT,
    feedbackType?: string
  ): Promise<IRes> => {
    return service.request(
      {
        url: '/berserker-base/zappT/add',
        method: 'post',
        data: params,
      },
      feedbackType
    );
  };
  // 添加类型-支持图片
  static addZappTFormData = (
    params: any,
    feedbackType?: string
  ): Promise<IRes> => {
    return service.request(
      {
        url: '/berserker-base/zappT/newAdd',
        method: 'post',
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        data: params,
      },
      feedbackType
    );
  };
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
    );
  };
  // 编辑应用
  static editApp = (params: any, feedbackType?: string): Promise<IRes> => {
    return service.request(
      {
        // url: 'berserker-base/zapptest/add',
        url: '/berserker-base/zappnew/edit',
        method: 'post',
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        data: params,
      },
      feedbackType
    );
  };
  // 删除应用
  static deleteApp = (params: any, feedbackType?: string): Promise<IRes> => {
    return service.request(
      {
        // url: 'berserker-base/zapptest/add',
        url: '/berserker-base/zappnew/delete',
        method: 'post',
        data: params,
      },
      feedbackType
    );
  };
  // 查询已安装的应用
  static getAppAll = (params: any, feedbackType?: string): Promise<IRes> => {
    return service.request(
      {
        // url: 'berserker-base-d/zapptest/add',
        url: '/berserker-base/zappnew/listByCode',
        method: 'get',
        params: params,
      },
      feedbackType
    );
  };
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
    );
  };
}

interface cardControl {
  id?: number | string;
  model?: string;
  name?: string;
  desc?: string;
  remark?: string;
  formData?: File;
  current?: number;
  size?: number;
  cardBackgroundId?: string;
  type?: string;
  val?: string;
  cardStyleBindDetail?: any;
}
interface cardStyleBg {
  bucketName?: string;
  file?: File;
  name?: string;
  type?: string;
  id?: number | string;
  imageUrl?: string;
  [key: string]: any;
}

export class Card {
  //  获取卡样
  static getCardList = (
    params: cardControl,
    feedbackType?: string
  ): Promise<IRes> => {
    return service.request(
      {
        url: '/berserker-base/cardStyle',
        // url: '/berserker-base/cardStyle',
        method: 'get',
        params: params,
      },
      feedbackType
    );
  };

  // 上传文件
  static uploadFiles = (
    params: cardControl,
    feedbackType?: string
  ): Promise<IRes> => {
    return service.request(
      {
        // url: '/berserker-base/file/uploadFiles',
        url: '/berserker-base/file/uploadFiles',
        method: 'post',
        data: params,
      },
      feedbackType
    );
  };
  // 保存卡样
  static addAndUpdate = (
    params: cardControl,
    feedbackType?: string
  ): Promise<IRes> => {
    return service.request(
      {
        // url: '/berserker-base/cardStyle/addAndUpdate',
        url: '/berserker-base/cardStyle/addAndUpdate',
        method: 'post',
        data: params,
      },
      feedbackType
    );
  };
  // 删除卡样
  static removeCard = (
    params: cardControl,
    feedbackType?: string
  ): Promise<IRes> => {
    return service.request(
      {
        // url: '/berserker-base/cardStyle/remove',
        url: '/berserker-base/cardStyle/remove',
        method: 'post',
        data: params,
      },
      feedbackType
    );
  };

  //  查询卡样类型
  static getCardTypeList = (feedbackType?: string): Promise<IRes> => {
    return service.request(
      {
        url: '/berserker-base/cardStyle/type',
        method: 'get',
      },
      feedbackType
    );
  };

  // 绑定卡样
  static bindCard = (
    params: cardControl,
    feedbackType?: string
  ): Promise<IRes> => {
    return service.request(
      {
        url: '/berserker-base/cardStyle/bind',
        method: 'post',
        data: params,
      },
      feedbackType
    );
  };

  // 解绑卡样
  static unBindCard = (
    params: cardControl,
    feedbackType?: string
  ): Promise<IRes> => {
    return service.request(
      {
        // url: '/berserker-base/cardStyle/bind',
        url: '/berserker-base/cardStyle/unbind',
        method: 'post',
        data: params,
      },
      feedbackType
    );
  };

  //  查询绑定卡样列表
  static getCardBindList = (
    params: cardControl,
    feedbackType?: string
  ): Promise<IRes> => {
    return service.request(
      {
        // url: '/berserker-base/cardStyle/bind/page',
        url: '/berserker-base/cardStyle/bind/page',
        method: 'get',
        params: params,
      },
      feedbackType
    );
  };

  // 获取卡样背景 /berserker-base/cardStyle/background
  static getCardBackground = (feedbackType?: string): Promise<IRes> => {
    return service.request(
      {
        url: '/berserker-base/cardStyle/background',
        method: 'get',
      },
      feedbackType
    );
  };

  // 添加编辑卡样背景 /berserker-base/cardStyle/background/addAndUpdate
  static addCardBackground = (
    params: cardStyleBg,
    feedbackType?: string
  ): Promise<IRes> => {
    return service.request(
      {
        url: '/berserker-base/cardStyle/background/addAndUpdate',
        method: 'post',
        data: params,
      },
      feedbackType
    );
  };

  //删除卡样背景 /berserker-base/cardStyle/background/remove
  static removeCardBackground = (
    params: cardStyleBg,
    feedbackType?: string
  ): Promise<IRes> => {
    return service.request(
      {
        url: '/berserker-base/cardStyle/background/remove',
        method: 'post',
        data: params,
      },
      feedbackType
    );
  };
}

// 选择框信息查询
export class identityInfo {
  // 获取身份列表
  static getIdentityList = (feedbackType?: string): Promise<IRes> => {
    return service.request({
      method: 'get',
      url: '/berserker-base/identity',
    });
  };

  // 获取部门列表
  static getBasedepartmentList = (feedbackType?: string): Promise<IRes> => {
    return service.request({
      method: 'get',
      url: '/berserker-base/basedepartment',
    });
  };

  // 获取部门树列表
  static getBasedepartmentTreeList = (feedbackType?: string): AxiosPromise<IRes> => {
    return service.request({
      method: 'get',
      url: '/berserker-base/basedepartment/gettree'
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
    );
  };
}
