import service, { IRes, IResLogin } from '@/service'
import { AxiosPromise } from 'axios'

interface IData {
  username?: string
  password?: number | string
  grant_type?: string
  scope?: string
  logintype?: string
}

export const getUser = (feedbackType?: string): Promise<IRes> => {
  return service.request(
    {
      url: '/berserker-base/user/user-pc',
      // url: '/berserker-base/operator/operator-pc',
      method: 'get',
    },
    feedbackType,
  )
}

export const checkPasswordStrength = (
  params: any,
  feedbackType?: string,
): Promise<IRes> => {
  return service.request(
    {
      // url: '/berserker-base/user/user-pc',
      url: '/berserker-secure/keyboard/checkPasswordStrength',
      method: 'get',
      params,
    },
    feedbackType,
  )
}

export const getOperatorUser = (feedbackType?: string): Promise<IRes> => {
  return service.request(
    {
      // url: '/berserker-base/user/user-pc',
      url: '/berserker-base/operator/operator-pc',
      method: 'get',
    },
    feedbackType,
  )
}

export const getToken = (
  params: IData,
  feedbackType?: string,
): Promise<IResLogin> => {
  return service.request(
    {
      method: 'post',
      url: '/berserker-auth/oauth/token',
      data: params,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization:
          'Basic bW9iaWxlX3NlcnZpY2VfcGxhdGZvcm06bW9iaWxlX3NlcnZpY2VfcGxhdGZvcm1fc2VjcmV0',
      },
    },
    feedbackType,
  )
}
// // 退出登录
// export const logoutApi = (feedbackType?: string): Promise<IRes> => {
//   return service.request(
//     {
//       url: '/berserker-auth/login/logout',
//       method: 'post',
//     },
//     feedbackType
//   )
// }
// export const logoutApi = (feedbackType?: string): Promise<IRes> => {
//   return service.request(
//     {
//       url: '/berserker-auth/login/logout',
//       method: 'post',
//     },
//     feedbackType
//   )
// }
// export const logout = (
//   feedbackType?: string
// ): Promise<IResLogin> => {
//   return service.request(
//     {
//       method: 'post',
//       url: '/berserker-auth/login/logout',
//       data: null
//     },
//     feedbackType
//   )
// }

// 提交配置参数
export const initConfig = (
  params: IData,
  host?: string,
  type?: string,
  feedbackType?: string,
): Promise<IResLogin> => {
  return service.request(
    {
      method: 'post',
      url: `http://${host}:8858/${type ? type + '/' : ''}initConfig`,
      data: params,
    },
    feedbackType,
  )
}

// 检查服务状态
export const getServiceStatus = (
  params?: any,
  host?: string,
  type?: string,
) => {
  return service.request({
    // url: process.env.NODE_ENV == "development" ? `http://192.168.3.14:8080/service` : `http://${host}:8858/${type? type + '/' : ''}service`,
    url:
      process.env.NODE_ENV == 'development'
        ? `http://${host}:8858/${type ? type + '/' : ''}service`
        : `http://${host}:8858/${type ? type + '/' : ''}service`,
    method: 'get',
    params,
  })
}

// 检查中间件状态
export const getMiddleware = (params?: any, host?: string, type?: string) => {
  return service.request({
    // url: process.env.NODE_ENV == "development"  ? `http://192.168.3.14:8080/middleware` : `http://${host}:8858/${type? type + '/' : ''}middleware`,
    url:
      process.env.NODE_ENV == 'development'
        ? `http://${host}:8858/${type ? type + '/' : ''}middleware`
        : `http://${host}:8858/${type ? type + '/' : ''}middleware`,
    method: 'get',
    params,
  })
}

// 检查配置项
export const getTestRes = (
  params?: any,
  host?: string,
  code?: string,
  type?: string,
) => {
  return service.request({
    url: `http://${host}:8858/${type ? type + '/' : ''}${code}/test`,
    method: 'get',
    params,
  })
}

/**
 * 发送验证码
 * @param params
 * @param feedbackType
 * @returns
 */
export const verificationCode = (
  params: any,
  feedbackType?: string,
): Promise<IRes> => {
  return service.request(
    {
      url: '/berserker-base/login/verificationCode',
      method: 'post',
      data: params,
    },
    feedbackType,
  )
}

/**
 * 校验验证码
 * @param params
 * @param feedbackType
 * @returns
 */
export const checkVerificationCode = (
  params: any,
  feedbackType?: string,
): Promise<IRes> => {
  return service.request(
    {
      url: '/berserker-base/login/verificationCode/check',
      method: 'post',
      data: params,
    },
    feedbackType,
  )
}

/**
 * 修改密码
 * @param params
 * @param feedbackType
 * @returns
 */
export const setPasswordByVerificationCode = (
  params: any,
  feedbackType?: string,
): Promise<IRes> => {
  return service.request(
    {
      url: '/berserker-base/login/setPasswordByVerificationCode',
      method: 'post',
      data: params,
    },
    feedbackType,
  )
}

// /essentialServices?platTypes=selfService,h5

interface Captcha {
  synAccessSource?: string
  data?: any
  codeValue?: string | any
}

//  获取登录验证码
export const getCaptcha = (params: Captcha, feedbackType?: string) => {
  return service.request(
    {
      url: '/berserker-auth-new/oauth/captcha',
      method: 'get',
      params: params,
    },
    feedbackType,
  )
}

export const getPlatType = (feedbackType?: string): Promise<IRes> => {
  return service.request(
    {
      url: '/auth/list',
      method: 'get',
    },
    feedbackType,
  )
}
// 内容管理 使用该平台类型
export const getMediaPlatType = (feedbackType?: string): Promise<IRes> => {
  return service.request(
    {
      url: '/berserker-base/basenoticeNew/getPlatType',
      method: 'get',
    },
    feedbackType,
  )
}
// 获取登录二维码状态
// /berserker-base/login/qrCode/login_SsynjonesS_842379402fa249658615fc870440ef0d
export const getQRCodeStatus = (
  params: Captcha,
  feedbackType?: string,
): Promise<IRes> => {
  return service.request(
    {
      url: `/berserker-base/login/qrCode/${params.codeValue}`,
      method: 'post',
      data: params.data,
    },
    feedbackType,
  )
}

// 获取登录二维码
export const getQRCode = (
  params: Captcha,
  feedbackType?: string,
): Promise<IRes> => {
  return service.request(
    {
      url: '/berserker-base/login/qrCode',
      method: 'get',
      params: params,
    },
    feedbackType,
  )
}
// /berserker-base/login/qrCode?synAccessSource=pc
// 角色管理

interface Irole {
  current: number
  size: number
}
interface IAddRole {
  roleCode: string
  roleName: string
  status: string
}
interface ISaveRole {
  roleCode: string
  roleName: string
  status: string
  roleId: string
}
interface IRemoveRole {
  roleId: string
}
interface Iuser {
  current: number
  size: number
}
// interface IdList {
//   code: string
//   name: string
// }

// interface IaddZappT {
//   name: string
//   nameEn: string
//   status: number
// }
interface userSno {
  sno: string
  // account: string
}
interface userAccount {
  // sno: string
  account: string
}
interface userAdd {
  sno: string
  account: string
}
interface userUpdata {
  sno: string
  account: string
}
interface accountId {
  accountId: string
  // account: string
}
interface synPhoto {
  id: string
}
interface synPhotos {
  current: number
  size: number
}
interface getAccountUser {
  current: number
  size: number
}
interface equipmentId {
  equipmentId: string
}
interface accountID {
  id: string
}
interface userId {
  userId: string
}
interface addUserRoles {
  userId: string
  roleIds: string
}
interface upPassWord {
  password: string
  userId: string
}
interface listGroupIdByAccountId {
  accountId: string
  groupType: string
  defaultGroup: number
}
interface getGroups {
  status: number
  type: string
  flag0: number
}
interface getAccountUserList {
  accountId: string
  type?: any
  status: number
}
interface getAuthorityRoleP {
  roleId: string
}
interface getAuthorityOperatorP {
  roleId: string
}
interface addAccountUser {
  accountId: string
  groupId: string
  resourceCode: string
  status: number
  type: string
}
interface grantAuthorityRole {
  authorityIds: string
  expireTime: string
  roleId: string
}
interface grantAuthorityUser {
  authorityIds: string
  expireTime: string
  userId: string
}

interface getAuthorityUser {
  userId: string
}
interface groupExtendInfo {
  type: string
  removeResource: string
  resourceMap: any
}
interface mercaccInfo {
  locIdList?: any
  name?: any
  code?: any
}

export class Role {
  // 查询角色列表
  static getRoleList = (
    params: Irole,
    feedbackType?: string,
  ): Promise<IRes> => {
    return service.request(
      {
        url: '/berserker-base/role',
        method: 'get',
        params: params,
      },
      feedbackType,
    )
  }
  // 添加角色
  static addRole = (
    params: IAddRole,
    feedbackType?: string,
  ): AxiosPromise<IRes> => {
    return service.request(
      {
        url: '/berserker-base/role/add',
        method: 'post',
        data: params,
      },
      feedbackType,
    )
  }

  // 保存角色修改
  static saveRole = (
    params: ISaveRole,
    feedbackType?: string,
  ): AxiosPromise<IRes> => {
    return service.request(
      {
        url: '/berserker-base/role/update',
        method: 'post',
        data: params,
      },
      feedbackType,
    )
  }
  // 删除角色
  static removeRole = (
    params: IRemoveRole,
    feedbackType?: string,
  ): AxiosPromise<IRes> => {
    return service.request(
      {
        url: '/berserker-base/role/remove',
        method: 'post',
        data: params,
      },
      feedbackType,
    )
  }

  // 查询用户列表
  static getUserList = (
    params: Iuser,
    feedbackType?: string,
  ): Promise<IRes> => {
    return service.request(
      {
        url: '/berserker-base/user/page',
        method: 'get',
        params: params,
      },
      feedbackType,
    )
  }

  /**
   * 获取身份列表
   */
  static listIdentity = (feedbackType?: string): Promise<IRes> => {
    return service.request(
      {
        url: '/berserker-base/identity',
        method: 'get',
      },
      feedbackType,
    )
  }
  /**
   * 获取所有角色
   */
  static getAllRoles = (feedbackType?: string): Promise<IRes> => {
    return service.request(
      {
        url: '/berserker-base/role/all',
        method: 'get',
      },
      feedbackType,
    )
  }
  /**
   * 获取对外的访问地址
   */
  static getForeignAddress = (feedbackType?: string): Promise<IRes> => {
    return service.request(
      {
        url: '/berserker-base/file/getForeignAddress',
        method: 'get',
      },
      feedbackType,
    )
  }

  /**
   * 获取人员列表
   */
  static listAccount = (
    params: userAccount,
    feedbackType?: string,
  ): Promise<IRes> => {
    return service.request(
      {
        url: '/berserker-base/account',
        method: 'get',
        params: params,
      },
      feedbackType,
    )
  }

  /**
   * 获取人员列表
   */
  static listSno = (params: userSno, feedbackType?: string): Promise<IRes> => {
    return service.request(
      {
        url: '/berserker-base/account',
        method: 'get',
        params: params,
      },
      feedbackType,
    )
  }

  // 添加用户
  static addUser = (
    params: userAdd,
    feedbackType?: string,
  ): AxiosPromise<IRes> => {
    return service.request(
      {
        url: '/berserker-base/user/add',
        method: 'post',
        data: params,
      },
      feedbackType,
    )
  }

  // 编辑用户
  static updateUser = (
    params: userUpdata,
    feedbackType?: string,
  ): AxiosPromise<IRes> => {
    return service.request(
      {
        url: '/berserker-base/user/update',
        method: 'post',
        data: params,
      },
      feedbackType,
    )
  }
  // 添加用户头像
  static updatePhotoByOperator = (
    params: FormData,
    feedbackType?: string,
  ): AxiosPromise<IRes> => {
    return service.request(
      {
        url: '/berserker-base/user/updatePhotoByOperator',
        method: 'post',
        data: params,
      },
      feedbackType,
    )
  }
  //查校区
  static getCampus = (feedbackType?: string): Promise<IRes> => {
    return service.request(
      {
        url: 'berserker-base/campus',
        method: 'get',
        // params: params,
      },
      feedbackType,
    )
  }
  static getDepartmentCode = (feedbackType?: string): Promise<IRes> => {
    return service.request(
      {
        url: 'berserker-base/basedepartment',
        method: 'get',
        // params: params,
      },
      feedbackType,
    )
  }

  /**
   * 通过用户id查询群组集合
   */
  static listGroupByAccountId = (
    params: accountId,
    feedbackType?: string,
  ): Promise<IRes> => {
    return service.request(
      {
        url: '/berserker-base/group/listGroupByAccountId',
        method: 'get',
        params: params,
      },
      feedbackType,
    )
  }
  /**
   * 给用户分配群组
   */
  static saveGroupExtendInfo = (
    params: groupExtendInfo,
    feedbackType?: string,
  ): Promise<IRes> => {
    return service.request(
      {
        url: '/berserker-base/extendInfo/saveExtendInfo',
        method: 'POST',
        data: params,
      },
      feedbackType,
    )
  }

  /**
   * 通过用户id查询绑定设备查询
   */
  static searchBindEquipmentByUser = (
    params: accountId,
    feedbackType?: string,
  ): Promise<IRes> => {
    return service.request(
      {
        url: '/berserker-base/equipment/searchBindEquipmentByUser',
        method: 'POST',
        data: params,
      },
      feedbackType,
    )
  }

  /**
   * 同步单个用户信息
   * @param id
   *
   */
  static synchronousPhoto = (
    params: synPhoto,
    feedbackType?: string,
  ): AxiosPromise<IRes> => {
    return service.request(
      {
        url: '/berserker-ykt-sync/account/syncUserInfo',
        method: 'post',
        data: params,
      },
      feedbackType,
    )
  }

  /**
   * 照片同步
   */

  static synPhotos = (
    params: synPhotos,
    feedbackType?: string,
  ): AxiosPromise<IRes> => {
    return service.request(
      {
        url: '/berserker-ykt-sync/photo/synchronousPhotos',
        method: 'post',
        data: params,
      },
      feedbackType,
    )
  }

  /**
   * 获取商户绑定分页信息
   */

  static getAccountUser = (
    params: getAccountUser,
    feedbackType?: string,
  ): Promise<IRes> => {
    return service.request(
      {
        url: '/berserker-base/accountuser/page',
        method: 'get',
        params: params,
      },
      feedbackType,
    )
  }

  /**
   * 商户绑定禁用
   */
  static deleteAccountUser = (
    params: accountID,
    feedbackType?: string,
  ): AxiosPromise<IRes> => {
    return service.request(
      {
        url: '/berserker-base/accountuser/delete',
        method: 'post',
        data: params,
      },
      feedbackType,
    )
  }

  /**
   * 商户绑定启用
   */
  static reductionAccountUser = (
    params: accountID,
    feedbackType?: string,
  ): AxiosPromise<IRes> => {
    return service.request(
      {
        url: '/berserker-base/accountuser/reduction',
        method: 'post',
        data: params,
      },
      feedbackType,
    )
  }

  /**
   * 删除人员
   * @param id
   */

  static removeAccount = (
    params: accountID,
    feedbackType?: string,
  ): AxiosPromise<IRes> => {
    return service.request(
      {
        url: '/berserker-base/account/remove',
        method: 'post',
        data: params,
      },
      feedbackType,
    )
  }

  /**
   * 根据人员id解除绑定设备
   * @param equipmentId
   */

  static relieveByUser = (
    params: equipmentId,
    feedbackType?: string,
  ): AxiosPromise<IRes> => {
    return service.request(
      {
        url: '/berserker-base/equipment/relieveByUser',
        method: 'post',
        data: params,
      },
      feedbackType,
    )
  }

  //  export const removeAccount = (id) => {
  //   const data = {
  //     id: id
  //   }
  //   return request({
  //     url: $config.service.base + '/account/remove',
  //     data,
  //     method: 'post'
  //   }, feedbackType)
  // }

  /**
   * 获取用户角色
   * @param userId
   */

  static getUserRoles = (
    params: userId,
    feedbackType?: string,
  ): Promise<IRes> => {
    return service.request(
      {
        url: '/berserker-base/user/roles',
        method: 'get',
        params: params,
      },
      feedbackType,
    )
  }

  /**
   * 分配用户角色
   * @param data
   */
  static addUserRoles = (
    params: addUserRoles,
    feedbackType?: string,
  ): AxiosPromise<IRes> => {
    return service.request(
      {
        url: '/berserker-base/user/roles/add',
        method: 'post',
        data: params,
      },
      feedbackType,
    )
  }
  /**
   * 修改密码
   * @param userId
   * @param oldPassword
   * @param newPassword
   */
  static updatePassword = (
    params: upPassWord,
    feedbackType?: string,
  ): AxiosPromise<IRes> => {
    return service.request(
      {
        url: '/berserker-base/user/user/update/password',
        method: 'post',
        data: params,
      },
      feedbackType,
    )
  }

  /**
   * 通过用户id查询编号集合
   * @param accountId    人员ID
   * @param groupType    群组类型【user：用户；mercacc：商户；visitor：游客】
   * @param defaultGroup 默认群组【0：非默认群组；1：默认群组】
   */
  static listGroupIdByAccountId = (
    params: listGroupIdByAccountId,
    feedbackType?: string,
  ): Promise<IRes> => {
    return service.request(
      {
        url: '/berserker-base/group/listGroupIdByAccountId',
        method: 'get',
        params: params,
      },
      feedbackType,
    )
  }
  /**
   * 商户查询
   * @param page
   * @param limit
   */
  static getMercaccList = (feedbackType?: string): Promise<IRes> => {
    return service.request(
      {
        url: '/berserker-base/mercacc',
        method: 'get',
      },
      feedbackType,
    )
  }
  /**
   * 商户查询
   * @param page
   * @param limit
   */
  static getMercaccListPar = (
    params: mercaccInfo,
    feedbackType?: string,
  ): Promise<IRes> => {
    return service.request(
      {
        url: '/berserker-base/mercacc',
        method: 'get',
        params: params,
      },
      feedbackType,
    )
  }
  /**
   * 商户部门查询
   * @param page
   * @param limit
   */
  static getLocList = (feedbackType?: string): Promise<IRes> => {
    return service.request(
      {
        url: '/berserker-base/loc/getTree',
        method: 'get',
      },
      feedbackType,
    )
  }

  /**
   * 获取群组列表
   * @param page
   * @param limit
   */
  static getGroups = (
    params: getGroups,
    feedbackType?: string,
  ): Promise<IRes> => {
    return service.request(
      {
        url: '/berserker-base/group',
        method: 'get',
        params: params,
      },
      feedbackType,
    )
  }

  /**
   * 获取商户绑定集合信息
   * @param page
   * @param limit
   */

  static getAccountUserList = (
    params: getAccountUserList,
    feedbackType?: string,
  ): Promise<IRes> => {
    return service.request(
      {
        url: '/berserker-base/accountuser',
        method: 'get',
        params: params,
      },
      feedbackType,
    )
  }

  /**
   * 添加商户绑定
   */
  static addAccountUser = (
    params: addAccountUser,
    feedbackType?: string,
  ): AxiosPromise<IRes> => {
    return service.request(
      {
        url: '/berserker-base/accountuser/add',
        method: 'post',
        data: params,
      },
      feedbackType,
    )
  }

  /**
   * 获取菜单和操作权限列表
   * @param serviceId
   */
  static getAuthorityMenu = (feedbackType?: string): Promise<IRes> => {
    return service.request(
      {
        url: '/berserker-base/authority/menu',
        method: 'get',
      },
      feedbackType,
    )
  }

  /**
   * 获取角色已分配权限
   * @param roleId
   */
  static getAuthorityRole = (
    params: getAuthorityRoleP,
    feedbackType?: string,
  ): Promise<IRes> => {
    return service.request(
      {
        url: '/berserker-base/authority/role',
        method: 'get',
        params: params,
      },
      feedbackType,
    )
  }

  /**
   * 获取用户已分配权限
   * @param userId
   */
  static getAuthorityUser = (
    params: getAuthorityUser,
    feedbackType?: string,
  ): Promise<IRes> => {
    return service.request(
      {
        url: '/berserker-base/authority/user',
        method: 'get',
        params: params,
      },
      feedbackType,
    )
  }

  /**
   * 角色授权
   * @param userId
   */
  static grantAuthorityRole = (
    params: grantAuthorityRole,
    feedbackType?: string,
  ): AxiosPromise<IRes> => {
    return service.request(
      {
        url: '/berserker-base/authority/role/grant',
        method: 'post',
        data: params,
      },
      feedbackType,
    )
  }
  /**
   * 用户授权
   * @param userId
   */
  static grantAuthorityUser = (
    params: grantAuthorityUser,
    feedbackType?: string,
  ): AxiosPromise<IRes> => {
    return service.request(
      {
        url: '/berserker-base/authority/user/grant',
        method: 'post',
        data: params,
      },
      feedbackType,
    )
  }

  /**
   *
   * 获取权限树
   *
   */
  static getAuthTree = (feedbackType?: string): Promise<IRes> => {
    return service.request(
      {
        url: '/berserker-tenant/auth/tree',
        method: 'get',
      },
      feedbackType,
    )
  }
  // /berserker-tenant/auth/tree
}

interface MenuControl {
  applicationType?: string
  icon?: string
  menuCode?: string
  menuDesc?: string
  menuId?: number
  menuName?: string
  parentId?: number
  path?: string
  priority?: number
  scheme?: string
  status?: string
  target?: string
  actionDesc?: string
  actionCode?: string
  actionId?: number
  actionName?: string
}

type ExtendInfo = {
  current?: number
  size?: number
  resourceId?: number | string
  type?: string
  value?: boolean
  valueList?: Array<any>
  id?: number | string
  json?: string
  code?: string
  codeList?: Array<any>
  listIndex?: number | string
  param?: any
}
// http://192.168.3.207:8787/berserker-base/menu/all
export class MenuEdits {
  // 获取菜单节点数据
  static menuAll = (feedbackType?: string): AxiosPromise<IRes> => {
    return service.request(
      {
        method: 'get',
        // url: process.env.NODE_ENV == 'development' ? '/berserker-base/menu/all' : '/berserker-base/current/user/menu'
        url: '/berserker-base/current/user/menu',
      },
      feedbackType,
    )
  }
  // 获取所有菜单
  static menuOrg = (feedbackType?: string): AxiosPromise<IRes> => {
    return service.request(
      {
        method: 'get',
        url: '/berserker-base/menu/all',
      },
      feedbackType,
    )
  }

  // 更新菜单
  static menuUpdate = (
    params: MenuControl,
    feedbackType?: string,
  ): AxiosPromise<IRes> => {
    return service.request(
      {
        method: 'post',
        url: '/berserker-base/menu/update',
        data: params,
      },
      feedbackType,
    )
  }

  // 添加菜单
  static menuAdd = (
    params: MenuControl,
    feedbackType?: string,
  ): AxiosPromise<IRes> => {
    return service.request(
      {
        method: 'post',
        url: '/berserker-base/menu/add',
        data: params,
      },
      feedbackType,
    )
  }

  // 删除菜单
  static menuRemove = (
    params: MenuControl,
    feedbackType?: string,
  ): AxiosPromise<IRes> => {
    return service.request(
      {
        method: 'post',
        url: '/berserker-base/menu/remove',
        data: params,
      },
      feedbackType,
    )
  }
  // /berserker-base/menu/action?menuId=9
  static menuAction = (
    params: MenuControl,
    feedbackType?: string,
  ): AxiosPromise<IRes> => {
    return service.request(
      {
        method: 'get',
        url: '/berserker-base/menu/action',
        params: params,
      },
      feedbackType,
    )
  }
  // /berserker-base/action/update
  static actionUpdate = (
    params: MenuControl,
    feedbackType?: string,
  ): AxiosPromise<IRes> => {
    return service.request(
      {
        method: 'post',
        url: '/berserker-base/action/update',
        data: params,
      },
      feedbackType,
    )
  }
  // /berserker-base/action/add
  static actionAdd = (
    params: MenuControl,
    feedbackType?: string,
  ): AxiosPromise<IRes> => {
    return service.request(
      {
        method: 'post',
        url: '/berserker-base/action/add',
        data: params,
      },
      feedbackType,
    )
  }

  // /berserker-base/action/remove
  static actionRemove = (
    params: MenuControl,
    feedbackType?: string,
  ): AxiosPromise<IRes> => {
    return service.request(
      {
        method: 'post',
        url: '/berserker-base/action/remove',
        data: params,
      },
      feedbackType,
    )
  }

  // 保存拓展信息，用于数据权限的接口 /berserker-base/extendInfo/save
  static saveExtendForDataLimit = (
    params: ExtendInfo,
    feedbackType?: string,
  ): Promise<IRes> => {
    return service.request(
      {
        method: 'post',
        url: '/berserker-base/extendInfo/save',
        data: params,
      },
      feedbackType,
    )
  }

  // 获取用户的权限信息 /berserker-base/extendInfo/getOne
  static getExtendForDataLimit = (
    params: ExtendInfo,
    feedbackType?: string,
  ): Promise<IRes> => {
    return service.request(
      {
        method: 'get',
        url: '/berserker-base/extendInfo/getOne',
        params: params,
      },
      feedbackType,
    )
  }

  static getPlatType = (feedbackType?: string): Promise<IRes> => {
    return service.request(
      {
        method: 'get',
        url: '/berserker-base/platType/getTypeByAuth',
      },
      feedbackType,
    )
  }
  getMenu = (feedbackType?: string): Promise<IRes> =>
    service.request(
      {
        url: 'berserker-base/current/user/menu',
        method: 'get',
      },
      feedbackType,
    )
}
interface IroleScS extends Irole {
  descs?: string | any
  ascs?: string | any
}

export const getErrLog = (
  params: IroleScS,
  feedbackType?: string,
): Promise<IRes> =>
  service.request(
    {
      url: '/berserker-log/exception',
      method: 'get',
      params: params,
    },
    feedbackType,
  )

type PushErrMsg = {
  errorFrom?: string
  errorInfo?: string
  address?: string
  remark?: string
  param?: string
  appCode?: string
  cause?: string
  serviceType?: string
  [key: string]: any
}

export const pushErrMsg = (
  params: PushErrMsg | string,
  feedbackType?: string,
): Promise<IRes> => {
  return service.request(
    {
      method: 'post',
      url: '/berserker-log/exception/save',
      data: params,
    },
    feedbackType,
  )
}

//上传系统设置背景logo
export class system {
  static uploadFileByPath = (
    params: FormData,
    feedbackType?: string,
  ): Promise<IRes> => {
    return service.request(
      {
        url: '/berserker-base/file/uploadFileByPath',
        method: 'post',
        data: params,
      },
      feedbackType,
    )
  }
}

// 校区接口
export class Campus {
  // /berserker-self/baseCampus/getPage 分页查询校区
  // 获取所有菜单
  static getCampusPage = (
    params: any,
    feedbackType?: string,
  ): AxiosPromise<IRes> => {
    return service.request(
      {
        method: 'get',
        url: '/berserker-self/baseCampus/getPage',
        params,
      },
      feedbackType,
    )
  }
  // /berserker-self/baseCampus/edit 编辑校区
  static editCampus = (
    params: any,
    feedbackType?: string,
  ): AxiosPromise<IRes> => {
    return service.request(
      {
        method: 'post',
        url: '/berserker-self/baseCampus/edit',
        data: params,
      },
      feedbackType,
    )
  }
  // /berserker-self/baseCampus/delete 删除校区
  static removeCampus = (
    params: any,
    feedbackType?: string,
  ): AxiosPromise<IRes> => {
    return service.request(
      {
        method: 'post',
        url: '/berserker-self/baseCampus/delete',
        data: params,
      },
      feedbackType,
    )
  }
  // /berserker-self/baseCampus/add 添加校区
  static addCampus = (
    params: any,
    feedbackType?: string,
  ): AxiosPromise<IRes> => {
    return service.request(
      {
        method: 'post',
        url: '/berserker-self/baseCampus/add',
        data: params,
      },
      feedbackType,
    )
  }
  //校区分页查询
  static getBaseCampusPage = (
    params: any,
    feedbackType?: string,
  ): AxiosPromise<IRes> => {
    return service.request(
      {
        method: 'get',
        url: '/berserker-base/campus/page',
        params,
      },
      feedbackType,
    )
  }
  //同步校区
  static getBaseCampusRefres = (
    params: any,
    feedbackType?: string,
  ): AxiosPromise<IRes> => {
    return service.request(
      {
        method: 'post',
        url: '/berserker-ykt-sync/campus/refresh',
        data: params,
      },
      feedbackType,
    )
  }
}

export class Identity {
  //身份分页查询
  static getBaseIdentityPage = (
    params: any,
    feedbackType?: string,
  ): AxiosPromise<IRes> => {
    return service.request(
      {
        method: 'get',
        url: '/berserker-base/identity/page',
        params,
      },
      feedbackType,
    )
  }

  //同步身份
  static getBaseIdentityRefres = (
    params: any,
    feedbackType?: string,
  ): AxiosPromise<IRes> => {
    return service.request(
      {
        method: 'post',
        url: '/berserker-ykt-sync/identity/refresh',
        data: params,
      },
      feedbackType,
    )
  }
}
export class Home {
  // /berserker-base/loginUserDetail/page
  static getDetails = (
    params: any,
    feedbackType?: string,
  ): AxiosPromise<IRes> => {
    return service.request(
      {
        method: 'get',
        url: '/berserker-base/loginUserDetail/page',
        params,
      },
      feedbackType,
    )
  }

  static getHomeStatistics = (feedbackType?: string): AxiosPromise<IRes> => {
    return service.request(
      {
        method: 'get',
        url: '/berserker-console/console',
      },
      feedbackType,
    )
  }
}

//区域
export class Subarea {
  //列表查询
  static getSubareaList = (
    params: any,
    feedbackType?: string,
  ): AxiosPromise<IRes> => {
    return service.request(
      {
        method: 'get',
        url: '/berserker-tenant/subarea/list',
        params,
      },
      feedbackType,
    )
  }
}
//渠道商管理
export class Agency {
  //分页查询
  static getAgencyPage = (
    params: any,
    feedbackType?: string,
  ): AxiosPromise<IRes> => {
    return service.request(
      {
        method: 'get',
        url: '/berserker-tenant/agency/page',
        params,
      },
      feedbackType,
    )
  }
  //渠道商授权树状图查询
  static authAgencyTree = (
    params: any,
    feedbackType?: string,
  ): AxiosPromise<IRes> => {
    return service.request(
      {
        method: 'get',
        url: '/berserker-tenant/auth/agency/tree',
        params,
      },
      feedbackType,
    )
  }
  //编辑渠道商
  static editAgency = (
    params: any,
    feedbackType?: string,
  ): AxiosPromise<IRes> => {
    return service.request(
      {
        method: 'post',
        url: '/berserker-tenant/agency/edit',
        data: params,
      },
      feedbackType,
    )
  }
  // 添加渠道商
  static saveAgency = (
    params: any,
    feedbackType?: string,
  ): AxiosPromise<IRes> => {
    return service.request(
      {
        method: 'post',
        url: '/berserker-tenant/agency/save',
        data: params,
      },
      feedbackType,
    )
  }
  // 添加渠道商检查
  static saveAgencyCheck = (
    params: any,
    feedbackType?: string,
  ): AxiosPromise<IRes> => {
    return service.request(
      {
        method: 'post',
        url: '/berserker-tenant/agency/save/check',
        data: params,
      },
      feedbackType,
    )
  }
  //删除渠道商
  static removeAgency = (
    params: any,
    feedbackType?: string,
  ): AxiosPromise<IRes> => {
    return service.request(
      {
        method: 'post',
        url: 'berserker-tenant/agency/remove',
        data: params,
      },
      feedbackType,
    )
  }
  //平台类型
  static getTypeByAuth = (
    params?: any,
    feedbackType?: string,
  ): AxiosPromise<IRes> => {
    return service.request(
      {
        method: 'get',
        url: '/berserker-base/platType/getTypeByAuth',
        params,
      },
      feedbackType,
    )
  }
  //渠道商授权查询
  static getAuthorityRule = (
    params?: any,
    feedbackType?: string,
  ): AxiosPromise<IRes> => {
    return service.request(
      {
        method: 'get',
        url: '/berserker-base/authority/rule/get',
        params,
      },
      feedbackType,
    )
  }
  //查询渠道商的授权
  static getExtendInfoList = (
    params?: any,
    feedbackType?: string,
  ): AxiosPromise<IRes> => {
    return service.request(
      {
        method: 'get',
        url: '/berserker-tenant/agency/auth',
        params,
      },
      feedbackType,
    )
  }
  //保存/编辑授权数据
  static saveOrEditExtendInfo = (
    params?: any,
    feedbackType?: string,
  ): AxiosPromise<IRes> => {
    return service.request({
      method: 'post',
      url: '/berserker-tenant/agency/saveOrEditAuth',
      data: params,
    })
  }
  static saveOrEditExtendInfoForRole = (
    params?: any,
    feedbackType?: string,
  ): AxiosPromise<IRes> => {
    return service.request({
      method: 'post',
      url: '/berserker-base/extendInfo/saveOrEditExtendInfo',
      data: params,
    })
  }
  static getAgencyAll = (
    params: any,
    feedbackType?: string,
  ): AxiosPromise<IRes> => {
    return service.request(
      {
        method: 'get',
        url: '/berserker-tenant/agency/list',
        params,
      },
      feedbackType,
    )
  }
  // 渠道商树形结构
  static getAgencyTree = (
    params?: any,
    feedbackType?: string,
  ): AxiosPromise<IRes> => {
    return service.request(
      {
        method: 'get',
        url: '/berserker-tenant/auth/agency/tree',
        params,
      },
      feedbackType,
    )
  }
  //消息类型
  static getMessageChannelList = (
    params?: any,
    feedbackType?: string,
  ): AxiosPromise<IRes> => {
    return service.request(
      {
        method: 'get',
        url: '/berserker-message/channel',
        params,
      },
      feedbackType,
    )
  }
  //渠道商查租户列表
  static getTenantAuthList = (
    params?: any,
    feedbackType?: string,
  ): AxiosPromise<IRes> => {
    return service.request(
      {
        method: 'get',
        url: '/berserker-tenant/tenant/auth/list',
        params,
      },
      feedbackType,
    )
  }
  //是否为渠道商超管
  static isAdminAgency = (
    params?: any,
    feedbackType?: string,
  ): AxiosPromise<IRes> => {
    return service.request(
      {
        method: 'post',
        url: 'berserker-tenant/agency/isAdmin',
        data: params,
      },
      feedbackType,
    )
  }
  //查询父级渠道商的授权
  static getAgencyParentAuth = (
    params?: any,
    feedbackType?: string,
  ): AxiosPromise<IRes> => {
    return service.request(
      {
        method: 'get',
        url: '/berserker-tenant/agency/auth',
        params,
      },
      feedbackType,
    )
  }
  //通道类型  查询树状图
  static getAgencyChannelTree = (
    params?: any,
    feedbackType?: string,
  ): AxiosPromise<IRes> => {
    return service.request(
      {
        method: 'get',
        url: '/berserker-message/type/tree',
        params,
      },
      feedbackType,
    )
  }
}
interface AreaData {
  id?: number | string
  isDeleted?: string
  name?: string
}
// 区域管理
export class Area {
  // 获取区域列表分页
  static getAreaList = (params: any, feedbackType?: string): Promise<IRes> => {
    return service.request(
      {
        url: '/berserker-tenant/subarea/page',
        method: 'get',
        params,
      },
      feedbackType,
    )
  }
  // 添加区域
  static areaAdd = (
    params: AreaData,
    feedbackType?: string,
  ): AxiosPromise<IRes> => {
    return service.request(
      {
        method: 'post',
        url: '/berserker-tenant/subarea/save',
        data: params,
      },
      feedbackType,
    )
  }
  // 编辑区域
  static areaEdit = (
    params: AreaData,
    feedbackType?: string,
  ): AxiosPromise<IRes> => {
    return service.request(
      {
        method: 'post',
        url: '/berserker-tenant/subarea/edit',
        data: params,
      },
      feedbackType,
    )
  }
  // 删除区域
  static areaDelete = (
    params: AreaData,
    feedbackType?: string,
  ): AxiosPromise<IRes> => {
    return service.request(
      {
        method: 'post',
        url: '/berserker-tenant/subarea/remove',
        data: params,
      },
      feedbackType,
    )
  }
}
interface OperatorData {
  account?: string
  avatar?: string
  email?: string
  name?: string
  password?: string
  phone?: string
  sex?: number
}
// 操作员管理
export class Operator {
  // 获取操作员列表分页
  static getOperatorList = (
    params: any,
    feedbackType?: string,
  ): Promise<IRes> => {
    return service.request(
      {
        url: '/berserker-base/operator/page',
        method: 'get',
        params,
      },
      feedbackType,
    )
  }
  // 添加操作员
  static operatorAdd = (
    params: OperatorData,
    feedbackType?: string,
  ): AxiosPromise<IRes> => {
    return service.request(
      {
        method: 'post',
        url: '/berserker-base/operator/add',
        data: params,
      },
      feedbackType,
    )
  }
  // 编辑操作员
  static operatorEdit = (
    params: OperatorData,
    feedbackType?: string,
  ): AxiosPromise<IRes> => {
    return service.request(
      {
        method: 'post',
        url: '/berserker-base/operator/update',
        data: params,
      },
      feedbackType,
    )
  }
  // 删除操作员
  static operatorDelete = (
    params: any,
    feedbackType?: string,
  ): AxiosPromise<IRes> => {
    return service.request(
      {
        method: 'post',
        url: '/berserker-base/operator/remove_by_id',
        data: params,
      },
      feedbackType,
    )
  }
  // 检查账号唯一性
  static checkByCode = (params: any, feedbackType?: string): Promise<IRes> => {
    return service.request(
      {
        url: '/berserker-base/operator/select_by_code',
        method: 'get',
        params,
      },
      feedbackType,
    )
  }
  /**
   * 获取操作员已分配权限
   * @param userId
   */
  static getAuthorityOperator = (
    params: getAuthorityOperatorP,
    feedbackType?: string,
  ): Promise<IRes> => {
    return service.request(
      {
        url: '/berserker-base/authority/user',
        method: 'get',
        params: params,
      },
      feedbackType,
    )
  }
}
// 获取数据权限配置(可以授权那些)
export const getDataAuthConfig = (feedbackType?: string): Promise<IRes> =>
  service.request(
    {
      url: '/berserker-base/extendInfo/getDataAuthConfig',
      method: 'get',
    },
    feedbackType,
  )

// 获取渠道商列表
export const getAgencyList = (
  params: any,
  feedbackType?: string,
): Promise<IRes> =>
  service.request(
    {
      url: '/berserker-tenant/agency/list',
      method: 'get',
      params,
    },
    feedbackType,
  )
// 获取租户列表
export const getTenantList = (
  params: any,
  feedbackType?: string,
): Promise<IRes> =>
  service.request(
    {
      url: '/berserker-tenant/tenant/auth/list',
      method: 'get',
      params,
    },
    feedbackType,
  )
// 获取区域列表-授权用
export const authorizeSubarea = (feedbackType?: string): Promise<IRes> =>
  service.request(
    {
      url: '/berserker-tenant/auth/subarea',
      method: 'get',
    },
    feedbackType,
  )
// 获取租户列表-授权用
export const authorizeTenant = (feedbackType?: string): Promise<IRes> =>
  service.request(
    {
      url: '/berserker-tenant/auth/tenant',
      method: 'get',
    },
    feedbackType,
  )
// 获取渠道商列表-授权用
export const authorizeAgency = (
  params?: any,
  feedbackType?: string,
): Promise<IRes> =>
  service.request(
    {
      url: '/berserker-tenant/auth/agency',
      method: 'get',
      params,
    },
    feedbackType,
  )
// 保存操作员授权区域、渠道商、租户权限数据
export const saveOrEditExtendInfo = (
  params: any,
  feedbackType?: string,
): AxiosPromise<IRes> => {
  return service.request(
    {
      method: 'post',
      url: '/berserker-base/extendInfo/saveOrEditExtendInfo',
      data: params,
    },
    feedbackType,
  )
}
// 获取已分配的数据权限
export const getListAllExtendInfoByOperator = (
  params: any,
  feedbackType?: string,
): Promise<IRes> =>
  service.request(
    {
      url: '/berserker-base/extendInfo/list',
      method: 'get',
      params,
    },
    feedbackType,
  )

/**
 * 租户相关接口
 */
export class Tenant {
  static getTenantPage = (
    params: any,
    feedbackType?: string,
  ): AxiosPromise<IRes> => {
    return service.request(
      {
        method: 'get',
        // url: process.env.NODE_ENV == 'development' ? '/berserker-base/menu/all' : '/berserker-base/current/user/menu'
        url: '/berserker-tenant/tenant/page',
        params,
      },
      feedbackType,
    )
  }
  static getTenantDetail = (
    params: any,
    feedbackType?: string,
  ): AxiosPromise<IRes> => {
    return service.request(
      {
        method: 'get',
        url: '/berserker-tenant/tenant/detail',
        params,
      },
      feedbackType,
    )
  }
  static deleteTenant = (
    params: any,
    feedbackType?: string,
  ): AxiosPromise<IRes> => {
    return service.request(
      {
        method: 'post',
        url: '/berserker-tenant/tenant/remove',
        data: params,
      },
      feedbackType,
    )
  }
  static editTenant = (
    params: any,
    feedbackType?: string,
  ): AxiosPromise<IRes> => {
    return service.request(
      {
        method: 'post',
        url: '/berserker-tenant/tenant/submit',
        data: params,
      },
      feedbackType,
    )
  }
  static addTenant = (
    params: any,
    feedbackType?: string,
  ): AxiosPromise<IRes> => {
    return service.request(
      {
        method: 'post',
        url: '/berserker-tenant/tenant/submit',
        data: params,
      },
      feedbackType,
    )
  }
  // static uploadFileByPath = (params: FormData, feedbackType?: string ): Promise<IRes> => {
  static uploadFileByPath = (
    params: FormData,
    feedbackType?: string,
  ): Promise<IRes> => {
    return service.request(
      {
        url: '/berserker-base/file/uploadFileToOtherByPath',
        method: 'post',
        data: params,
      },
      feedbackType,
    )
  }
  /**
   * 获取应用列表分页
   * @param feedbackType
   */
  static getAppListPage = (
    params: any,
    feedbackType?: string,
  ): AxiosPromise<IRes> => {
    return service.request(
      {
        method: 'get',
        url: '/berserker-base/zappnew/pageAppByPermission',
        params,
      },
      feedbackType,
    )
  }
  /**
   * 获取应用列表
   * @param feedbackType
   */
  static getAppListALL = (
    params?: any,
    feedbackType?: string,
  ): AxiosPromise<IRes> => {
    return service.request(
      {
        method: 'get',
        url: '/berserker-base/zappnew/listAppByPermission',
        params,
      },
      feedbackType,
    )
  }
  static getAppListGroupPlatform = (
    params?: any,
    feedbackType?: string,
  ): AxiosPromise<IRes> => {
    return service.request(
      {
        method: 'get',
        url: '/berserker-base/zappnew/appListGroupPlatform',
        params,
      },
      feedbackType,
    )
  }
  /**
   * 获取租户切换列表
   * @param feedbackType
   */
  static getTenantExList = (feedbackType?: string): AxiosPromise<IRes> => {
    return service.request(
      {
        method: 'get',
        url: '/berserker-tenant/tenant/toggle',
        // url: 'http://192.168.1.169:8089/berserker-tenant/tenant/toggle',
      },
      feedbackType,
    )
  }
  /**
   * 获取租户token
   * @param params
   * @param feedbackType
   */
  static getTenantToken = (
    params: any,
    feedbackType?: string,
  ): AxiosPromise<IRes> => {
    return service.request(
      {
        method: 'post',
        url: '/berserker-auth/auth/user/operator_access_token_by_token',
        data: params,
      },
      feedbackType,
    )
  }
  /**
   * 租户迁移
   * @param params
   * @param feedbackType
   */
  static transferTenant = (
    params: any,
    feedbackType?: string,
  ): AxiosPromise<IRes> => {
    return service.request(
      {
        method: 'post',
        url: '/berserker-tenant/tenant/transfer',
        data: params,
      },
      feedbackType,
    )
  }
  /**
   * 租户迁移进度
   * @param params
   * @param feedbackType
   */
  static getTransferProgress = (
    params: any,
    feedbackType?: string,
  ): AxiosPromise<IRes> => {
    return service.request(
      {
        method: 'post',
        url: '/berserker-tenant/tenant/getProgress',
        data: params,
      },
      feedbackType,
    )
  }
}
export class Config {
  static getConfig = (
    params: any,
    feedbackType?: string,
  ): AxiosPromise<IRes> => {
    return service.request(
      {
        method: 'get',
        // url: process.env.NODE_ENV == 'development' ? '/berserker-base/menu/all' : '/berserker-base/current/user/menu'
        url: '/berserker-tenant/tenant/config',
        params,
      },
      feedbackType,
    )
  }
  // 获取终端类型 、平台类型
  static getTypeByAuth = (
    params?: any,
    feedbackType?: string,
  ): AxiosPromise<IRes> => {
    return service.request(
      {
        method: 'get',
        url: '/berserker-base/platType/getTypeByAuth',
        params,
      },
      feedbackType,
    )
  }
  // 获取系统参数 deploymentType
  static getSystemConfig = (
    params?: any,
    feedbackType?: string,
  ): AxiosPromise<IRes> => {
    return service.request(
      {
        method: 'get',
        url: '/berserker-base/config/getSystemConfig',
        params,
      },
      feedbackType,
    )
  }
  /**
   * 获取一卡通配置
   * @param feedbackType
   */
  static getYktConfig = (
    params?: any,
    feedbackType?: string,
  ): AxiosPromise<IRes> => {
    return service.request(
      {
        method: 'get',
        url: '/berserker-base/QrCodesysConfigManage/getYktConfig',
        params,
      },
      feedbackType,
    )
  }
  /**
   * 设置一卡通配置
   * @param data
   * @param feedbackType
   * @returns
   */
  static setYktConfig = (
    data: any,
    feedbackType?: string,
  ): AxiosPromise<IRes> => {
    return service.request(
      {
        method: 'post',
        url: '/berserker-base/QrCodesysConfigManage/setYktConfig',
        data,
      },
      feedbackType,
    )
  }
  // 上传脱机码秘钥文件
  static uploadSecretKeyFile = (
    params: any,
    feedbackType?: string,
  ): Promise<IRes> => {
    return service.request(
      {
        method: 'post',
        url: '/berserker-base/QrCodesysConfigManage/uploadSecretKeyFile',
        data: params,
      },
      feedbackType,
    )
  }
}
/**
 * 获取省市区信息
 */
export class City {
  static getAreaParent = (
    params?: any,
    feedbackType?: string,
  ): AxiosPromise<IRes> => {
    return service.request(
      {
        method: 'get',
        url: '/berserker-tenant/area/parent',
        params,
      },
      feedbackType,
    )
  }
  static getAreaChild = (
    params: any,
    feedbackType?: string,
  ): AxiosPromise<IRes> => {
    return service.request(
      {
        method: 'get',
        url: '/berserker-tenant/area/child',
        params,
      },
      feedbackType,
    )
  }
  // /berserker-tenant/area/parent
  //   /berserker-tenant/area/child
}
// /berserker-console/console
export class Message {
  // berserker-message/channel/tree // 通道列表
  // /berserker-message/channel/authority/saveOrEdit/batch // 设置租户配置数据
  // /berserker-message/channel/authority/tree // 查询租户配置数据
  // 通道列表
  static getChannelTree = (
    params?: any,
    feedbackType?: string,
  ): AxiosPromise<IRes> => {
    return service.request(
      {
        method: 'get',
        url: '/berserker-message/type/tree',
        params,
      },
      feedbackType,
    )
  }
  // 设置通道配置数据
  static setChannelAuth = (
    data: any,
    feedbackType?: string,
  ): AxiosPromise<IRes> => {
    return service.request(
      {
        method: 'post',
        url: '/berserker-message/channel/authority/saveOrEdit/batch',
        data,
      },
      feedbackType,
    )
  }
  // 查询通道配置数据
  static getChannelAuth = (
    params?: any,
    feedbackType?: string,
  ): AxiosPromise<IRes> => {
    return service.request(
      {
        method: 'get',
        url: '/berserker-message/channel/authority/tree',
        params,
      },
      feedbackType,
    )
  }
  // /berserker-base/file/uploadFile
  // 上传消息通道设置文件
  static uploadFile = (params: any, feedbackType?: string): Promise<IRes> => {
    return service.request(
      {
        method: 'post',
        url: '/berserker-base/file/uploadFile',
        data: params,
      },
      feedbackType,
    )
  }
}

export class Department {
  // 部门分页查询
  static getDepartmentList = (
    params?: any,
    feedbackType?: string,
  ): AxiosPromise<IRes> => {
    return service.request(
      {
        method: 'get',
        url: '/berserker-base/basedepartment/page',
        params,
      },
      feedbackType,
    )
  }

  // 同步部门
  static syncDepartment = (
    data?: any,
    feedbackType?: string,
  ): AxiosPromise<IRes> => {
    return service.request(
      {
        method: 'post',
        url: '/berserker-ykt-sync/basedepartment/refresh',
        data,
      },
      feedbackType,
    )
  }
}

//统计 statistics
export class Statistics {
  // 日活人数
  static dailyActivity = (
    params?: any,
    feedbackType?: string,
  ): AxiosPromise<IRes> => {
    return service.request(
      {
        method: 'get',
        url: '/berserker-console/console/personnel/dailyActivity',
        params,
      },
      feedbackType,
    )
  }
  // 累计关注
  static cumulative = (
    params?: any,
    feedbackType?: string,
  ): AxiosPromise<IRes> => {
    return service.request(
      {
        method: 'get',
        url: '/berserker-console/console/personnel/cumulative',
        params,
      },
      feedbackType,
    )
  }
  // 新关注人数
  static personnel = (
    params?: any,
    feedbackType?: string,
  ): AxiosPromise<IRes> => {
    return service.request(
      {
        method: 'get',
        url: '/berserker-console/console/personnel',
        params,
      },
      feedbackType,
    )
  }
  // 交易统计
  static consoleOrder = (
    params?: any,
    feedbackType?: string,
  ): AxiosPromise<IRes> => {
    return service.request(
      {
        method: 'get',
        url: '/berserker-console/console/order',
        params,
      },
      feedbackType,
    )
  }
  // 授权信息统计【不根据所选条件变化，是当前登录用户的固有属性】
  static statisticsAuth = (
    params?: any,
    feedbackType?: string,
  ): AxiosPromise<IRes> => {
    return service.request(
      {
        method: 'get',
        url: '/berserker-console/console/statistics/auth',
        params,
      },
      feedbackType,
    )
  }
  // 用户数排名
  static userNumTop = (
    params?: any,
    feedbackType?: string,
  ): AxiosPromise<IRes> => {
    return service.request(
      {
        method: 'get',
        url: '/berserker-console/console/statistics/userNumTop',
        params,
      },
      feedbackType,
    )
  }
  // 身份/设备/终端
  static consoleAccess = (
    params?: any,
    feedbackType?: string,
  ): AxiosPromise<IRes> => {
    return service.request(
      {
        method: 'get',
        url: '/berserker-console/console/access',
        params,
      },
      feedbackType,
    )
  }
  // 广告名称
  static getNoticeByStatistic = (
    params?: any,
    feedbackType?: string,
  ): AxiosPromise<IRes> => {
    return service.request(
      {
        method: 'get',
        url: '/berserker-base/basenoticeNew/getNoticeByStatistic',
        params,
      },
      feedbackType,
    )
  }
  // 广告统计查询接口
  static advertisOrAppStatistics = (
    params?: any,
    feedbackType?: string,
  ): AxiosPromise<IRes> => {
    return service.request(
      {
        method: 'get',
        url: '/berserker-console/console/advertisOrAppStatistics',
        params,
      },
      feedbackType,
    )
  }
  //交易类型
  static turnoverType = (
    params?: any,
    feedbackType?: string,
  ): AxiosPromise<IRes> => {
    return service.request(
      {
        method: 'get',
        url: '/berserker-console/console/turnoverType',
        params,
      },
      feedbackType,
    )
  }
  // 应用名称
  static getAppByStatistic = (
    params?: any,
    feedbackType?: string,
  ): AxiosPromise<IRes> => {
    return service.request(
      {
        method: 'get',
        url: '/berserker-base/zappnew/getAppByStatistic',
        params,
      },
      feedbackType,
    )
  }
  // 解析租户列表
  static getTenantIds = (
    params?: any,
    feedbackType?: string,
  ): AxiosPromise<IRes> => {
    return service.request(
      {
        method: 'get',
        url: '/berserker-console/console/tenantIds',
        params,
      },
      feedbackType,
    )
  }
  // 常用功能
  static userCommonMenu = (
    params?: any,
    feedbackType?: string,
  ): AxiosPromise<IRes> => {
    return service.request(
      {
        method: 'get',
        url: '/berserker-base/current/user/common/menu',
        params,
      },
      feedbackType,
    )
  }
  // 统计公告
  static getBasenoticeNewPage = (
    params?: any,
    feedbackType?: string,
  ): AxiosPromise<IRes> => {
    return service.request(
      {
        method: 'get',
        url: '/berserker-base/basenoticeNew/page',
        params,
      },
      feedbackType,
    )
  }
  // 公告详情
  static getNoticeDetail = (
    params?: any,
    feedbackType?: string,
  ): AxiosPromise<IRes> => {
    return service.request(
      {
        method: 'get',
        url: 'berserker-base/basenoticeNew',
        params,
      },
      feedbackType,
    )
  }
}
// 获取操作员信息
export const getOperatorPc = (feedbackType?: string): Promise<IRes> =>
  service.request(
    {
      url: '/berserker-base/operator/operator-pc',
      method: 'get',
    },
    feedbackType,
  )

/**
 * 统计菜单数量
 * @param data
 * @param feedbackType
 * @returns
 */
export const logSave = (
  data?: any,
  feedbackType?: string,
): AxiosPromise<IRes> => {
  return service.request(
    {
      method: 'post',
      url: '/berserker-log/appClickLogs/save',
      data,
    },
    feedbackType,
  )
}

/**
 * 获取协议
 * @param feedbackType
 * @returns
 */
export const getProtocol = (params: any, feedbackType?: string): Promise<IRes> =>
  service.request(
    {
      url: '/berserker-app/notice/protocol',
      method: 'get',
      params
    },
    feedbackType,
  )