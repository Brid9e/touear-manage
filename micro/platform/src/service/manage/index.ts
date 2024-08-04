import service, { IRes, IResLogin } from '@/service'
import { AxiosPromise } from 'axios'
import qs from 'qs'

interface IData {
  username?: string
  password?: number | string
  grant_type?: string
  scope?: string
  logintype?: string
}

export const getUser = (feedbackType?:string): Promise<IRes> => {
  return service.request({
    url: '/berserker-base/user/user-pc',
    method: 'get'
  }, feedbackType)
}

export const getToken = (params: IData, feedbackType?:string): Promise<IResLogin> => {
  return service.request({
    method: 'post',
    url: '/berserker-auth/oauth/token',
    data: qs.stringify(params),
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: 'Basic bW9iaWxlX3NlcnZpY2VfcGxhdGZvcm06bW9iaWxlX3NlcnZpY2VfcGxhdGZvcm1fc2VjcmV0'
    }
  }, feedbackType)
}

interface Captcha {
  synAccessSource?: string
  data?: any
  codeValue?: string | any
}

//  获取登录验证码
export const getCaptcha = (params: Captcha, feedbackType?:string) => {
  return service.request({
    url: '/berserker-auth/oauth/captcha',
    method: 'get',
    params: params
  }, feedbackType)
}

export const getPlatType = (feedbackType?:string): Promise<IRes> => {
  return service.request({
    url: '/auth/list',
    method: 'get'
  }, feedbackType)
}

// 获取登录二维码状态
// /berserker-base/login/qrCode/login_SsynjonesS_842379402fa249658615fc870440ef0d
export const getQRCodeStatus = (params: Captcha, feedbackType?:string): Promise<IRes> => {
  return service.request({
    url: `/berserker-base/login/qrCode/${params.codeValue}`,
    method: 'post',
    data: params.data
  }, feedbackType)
}

// 获取登录二维码
export const getQRCode = (params: Captcha, feedbackType?:string): Promise<IRes> => {
  return service.request({
    url: '/berserker-base/login/qrCode',
    method: 'get',
    params: params
  }, feedbackType)
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
  id?: string
  sno?: string
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
  type: number
  status: number
}
interface getAuthorityRoleP {
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

export class Role {
  // 查询角色列表
  static getRoleList = (params: Irole, feedbackType?:string): Promise<IRes> => {
    return service.request({
      url: '/berserker-base/role',
      method: 'get',
      params: params
    }, feedbackType)
  }
  // 添加角色
  static addRole = (params: IAddRole, feedbackType?:string): AxiosPromise<IRes> => {
    return service.request({
      url: '/berserker-base/role/add',
      method: 'post',
      data: params
    }, feedbackType)
  }
  // 保存角色修改
  static saveRole = (params: ISaveRole, feedbackType?:string): AxiosPromise<IRes> => {
    return service.request({
      url: '/berserker-base/role/update',
      method: 'post',
      data: params
    }, feedbackType)
  }
  // 删除角色
  static removeRole = (params: IRemoveRole, feedbackType?:string): AxiosPromise<IRes> => {
    return service.request({
      url: '/berserker-base/role/remove',
      method: 'post',
      data: params
    }, feedbackType)
  }

  // 查询用户列表
  static getUserList = (params: Iuser, feedbackType?:string): Promise<IRes> => {
    return service.request({
      url: '/berserker-base/user/page',
      method: 'get',
      params: params
    }, feedbackType)
  }

  /**
   * 获取身份列表
   */
  static listIdentity = ( feedbackType?:string): Promise<IRes> => {
    return service.request({
      url: '/berserker-base/identity',
      method: 'get'
    }, feedbackType)
  }
  /**
   * 获取所有角色
   */
  static getAllRoles = ( feedbackType?:string): Promise<IRes> => {
    return service.request({
      url: '/berserker-base/role/all',
      method: 'get'
    }, feedbackType)
  }
  /**
   * 获取对外的访问地址
   */
  static getForeignAddress = ( feedbackType?:string): Promise<IRes> => {
    return service.request({
      url: '/berserker-base/file/getForeignAddress',
      method: 'get'
    }, feedbackType)
  }

  /**
   * 获取人员列表
   */
  static listAccount = (params: userAccount, feedbackType?:string): Promise<IRes> => {
    return service.request({
      url: '/berserker-base/account',
      method: 'get',
      params: params
    }, feedbackType)
  }

  /**
   * 获取人员列表
   */
  static listSno = (params: userSno, feedbackType?:string): Promise<IRes> => {
    return service.request({
      url: '/berserker-base/account',
      method: 'get',
      params: params
    }, feedbackType)
  }

  // 添加用户
  static addUser = (params: userAdd, feedbackType?:string): AxiosPromise<IRes> => {
    return service.request({
      url: '/berserker-base/user/add',
      method: 'post',
      data: params
    }, feedbackType)
  }

  // 编辑用户
  static updateUser = (params: userUpdata, feedbackType?:string): AxiosPromise<IRes> => {
    return service.request({
      url: '/berserker-base/user/update',
      method: 'post',
      data: params
    }, feedbackType)
  }

  /**
   * 通过用户id查询群组集合
   */
  static listGroupByAccountId = (params: accountId, feedbackType?:string): Promise<IRes> => {
    return service.request({
      url: '/berserker-base/group/listGroupByAccountId',
      method: 'get',
      params: params
    }, feedbackType)
  }

  /**
   * 通过用户id查询绑定设备查询
   */
  static searchBindEquipmentByUser = (params: accountId, feedbackType?:string): Promise<IRes> => {
    return service.request({
      url: '/berserker-base/equipment/searchBindEquipmentByUser',
      method: 'POST',
      data: params
    }, feedbackType)
  }

  /**
   * 照片同步
   * @param id
   *
   */
  static synchronousPhoto = (params: synPhoto, feedbackType?:string): AxiosPromise<IRes> => {
    return service.request({
      url: '/berserker-base/user/synchronousPhoto',
      method: 'post',
      data: params
    }, feedbackType)
  }

  /**
   * 照片同步
   */

  static synPhotos = (params: synPhotos, feedbackType?:string): AxiosPromise<IRes> => {
    return service.request({
      url: '/berserker-ykt-sync/photo/synchronousPhotos',
      method: 'post',
      data: params
    }, feedbackType)
  }

  /**
   * 获取商户绑定分页信息
   */

  static getAccountUser = (params: getAccountUser, feedbackType?:string): Promise<IRes> => {
    return service.request({
      url: '/berserker-base/accountuser/page',
      method: 'get',
      params: params
    }, feedbackType)
  }

  /**
   * 商户绑定禁用
   */
  static deleteAccountUser = (params: accountID, feedbackType?:string): AxiosPromise<IRes> => {
    return service.request({
      url: '/berserker-base/accountuser/delete',
      method: 'post',
      data: params
    }, feedbackType)
  }

  /**
   * 商户绑定启用
   */
  static reductionAccountUser = (params: accountID, feedbackType?:string): AxiosPromise<IRes> => {
    return service.request({
      url: '/berserker-base/accountuser/reduction',
      method: 'post',
      data: params
    }, feedbackType)
  }

  /**
   * 删除人员
   * @param id
   */

  static removeAccount = (params: accountID, feedbackType?:string): AxiosPromise<IRes> => {
    return service.request({
      url: '/berserker-base/account/remove',
      method: 'post',
      data: params
    }, feedbackType)
  }

  /**
   * 根据人员id解除绑定设备
   * @param equipmentId
   */

  static relieveByUser = (params: equipmentId, feedbackType?:string): AxiosPromise<IRes> => {
    return service.request({
      url: '/berserker-base/equipment/relieveByUser',
      method: 'post',
      data: params
    }, feedbackType)
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

  static getUserRoles = (params: userId, feedbackType?:string): Promise<IRes> => {
    return service.request({
      url: '/berserker-base/user/roles',
      method: 'get',
      params: params
    }, feedbackType)
  }

  /**
   * 分配用户角色
   * @param data
   */
  static addUserRoles = (params: addUserRoles, feedbackType?:string): AxiosPromise<IRes> => {
    return service.request({
      url: '/berserker-base/user/roles/add',
      method: 'post',
      data: params
    }, feedbackType)
  }
  /**
   * 修改密码
   * @param userId
   * @param oldPassword
   * @param newPassword
   */
  static updatePassword = (params: upPassWord, feedbackType?:string): AxiosPromise<IRes> => {
    return service.request({
      url: '/berserker-base/user/user/update/password',
      method: 'post',
      data: params
    }, feedbackType)
  }

  /**
   * 通过用户id查询编号集合
   * @param accountId    人员ID
   * @param groupType    群组类型【user：用户；mercacc：商户；visitor：游客】
   * @param defaultGroup 默认群组【0：非默认群组；1：默认群组】
   */
  static listGroupIdByAccountId = (params: listGroupIdByAccountId, feedbackType?:string): Promise<IRes> => {
    return service.request({
      url: '/berserker-base/group/listGroupIdByAccountId',
      method: 'get',
      params: params
    }, feedbackType)
  }
  /**
   * 商户查询
   * @param page
   * @param limit
   */
  static getMercaccList = ( feedbackType?:string): Promise<IRes> => {
    return service.request({
      url: '/berserker-base/mercacc',
      method: 'get'
    }, feedbackType)
  }

  /**
   * 获取群组列表
   * @param page
   * @param limit
   */
  static getGroups = (params: getGroups, feedbackType?:string): Promise<IRes> => {
    return service.request({
      url: '/berserker-base/group',
      method: 'get',
      params: params
    }, feedbackType)
  }

  /**
   * 获取商户绑定集合信息
   * @param page
   * @param limit
   */

  static getAccountUserList = (params: getAccountUserList, feedbackType?:string): Promise<IRes> => {
    return service.request({
      url: '/berserker-base/accountuser',
      method: 'get',
      params: params
    }, feedbackType)
  }

  /**
   * 添加商户绑定
   */
  static addAccountUser = (params: addAccountUser, feedbackType?:string): AxiosPromise<IRes> => {
    return service.request({
      url: '/berserker-base/accountuser/add',
      method: 'post',
      data: params
    }, feedbackType)
  }

  /**
   * 获取菜单和操作权限列表
   * @param serviceId
   */
  static getAuthorityMenu = ( feedbackType?:string): Promise<IRes> => {
    return service.request({
      url: '/berserker-base/authority/menu',
      method: 'get'
    }, feedbackType)
  }

  /**
   * 获取角色已分配权限
   * @param roleId
   */
  static getAuthorityRole = (params: getAuthorityRoleP, feedbackType?:string): Promise<IRes> => {
    return service.request({
      url: '/berserker-base/authority/role',
      method: 'get',
      params: params
    }, feedbackType)
  }

  /**
   * 获取用户已分配权限
   * @param userId
   */
  static getAuthorityUser = (params: getAuthorityUser, feedbackType?:string): Promise<IRes> => {
    return service.request({
      url: '/berserker-base/authority/user',
      method: 'get',
      params: params
    }, feedbackType)
  }

  /**
   * 角色授权
   * @param userId
   */
  static grantAuthorityRole = (params: grantAuthorityRole, feedbackType?:string): AxiosPromise<IRes> => {
    return service.request({
      url: '/berserker-base/authority/role/grant',
      method: 'post',
      data: params
    }, feedbackType)
  }
  /**
   * 用户授权
   * @param userId
   */
  static grantAuthorityUser = (params: grantAuthorityUser, feedbackType?:string): AxiosPromise<IRes> => {
    return service.request({
      url: '/berserker-base/authority/user/grant',
      method: 'post',
      data: params
    }, feedbackType)
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
// http://192.168.3.207:8787/berserker-base/menu/all
export class MenuEdits {
  // 获取菜单节点数据
  static menuAll = (feedbackType?:string): AxiosPromise<IRes> => {
    return service.request({
      method: 'get',
      url: process.env.NODE_ENV === 'development' ? '/berserker-base/menu/all' : '/berserker-base/current/user/menu'
    }, feedbackType)
  }

  // 更新菜单
  static menuUpdate = (params: MenuControl, feedbackType?:string): AxiosPromise<IRes> => {
    return service.request({
      method: 'post',
      url: '/berserker-base/menu/update',
      data: params
    }, feedbackType)
  }

  // 添加菜单
  static menuAdd = (params: MenuControl, feedbackType?:string): AxiosPromise<IRes> => {
    return service.request({
      method: 'post',
      url: '/berserker-base/menu/add',
      data: params
    }, feedbackType)
  }

  // 删除菜单
  static menuRemove = (params: MenuControl, feedbackType?:string): AxiosPromise<IRes> => {
    return service.request({
      method: 'post',
      url: '/berserker-base/menu/remove',
      data: params
    }, feedbackType)
  }
  // /berserker-base/menu/action?menuId=9
  static menuAction = (params: MenuControl, feedbackType?:string): AxiosPromise<IRes> => {
    return service.request({
      method: 'get',
      url: '/berserker-base/menu/action',
      params: params
    }, feedbackType)
  }
  // /berserker-base/action/update
  static actionUpdate = (params: MenuControl, feedbackType?:string): AxiosPromise<IRes> => {
    return service.request({
      method: 'post',
      url: '/berserker-base/action/update',
      data: params
    }, feedbackType)
  }
  // /berserker-base/action/add
  static actionAdd = (params: MenuControl, feedbackType?:string): AxiosPromise<IRes> => {
    return service.request({
      method: 'post',
      url: '/berserker-base/action/add',
      data: params
    }, feedbackType)
  }
  // /berserker-base/action/remove
  static actionRemove = (params: MenuControl, feedbackType?:string): AxiosPromise<IRes> => {
    return service.request({
      method: 'post',
      url: '/berserker-base/action/remove',
      data: params
    }, feedbackType)
  }
}

export const getMenu = ( feedbackType?:string): Promise<IRes> =>
  service.request({
    url: 'berserker-base/current/user/menu',
    method: 'get'
  }, feedbackType)

//上传系统设置背景logo
export class system {
  static uploadFileByPath = (params: FormData, feedbackType?:string): Promise<IRes> => {
    return service.request({
      url: '/berserker-base/file/uploadFileByPath',
      method: 'post',
      data: params
    }, feedbackType)
  }
}
