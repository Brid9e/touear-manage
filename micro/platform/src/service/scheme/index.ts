/*
 * @Author       : your name
 * @Date         : 2022-09-13 12:45:16
 * @LastEditTime : 2022-09-15 10:13:51
 * @LastEditors  : Joe
 * @FilePath     : /management/src/service/scheme/index.ts
 */
/*
 * @Author: your name
 * @Date: 2022-02-18 13:23:43
 * @LastEditTime: 2022-06-13 14:42:51
 * @LastEditors: error: git config user.name && git config user.email & please set dead value or install git
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: /scheme-platform-master/src/service/SchemeEdit/index.ts
 */
import service, { IRes } from '@/service'
import { AxiosPromise } from 'axios'

interface SchemeEdit {
  type?: string
  flagIsMobileApp?: number | string
  appUserType?: number | string
  appSchemeId?: number | string
  scheduleId?: number | string
  menuList?: string
  callbackView?: any
  data?: any
}

export class Scheme {
  // //获取菜单列表
  // static getMenuList = (params: SchemeEdit, feedbackType?:string): AxiosPromise<IRes> => {
  //   return service.request({
  //     url: '/berserker-base/zindex/listIndex',
  //     method: 'get',
  //     params: params
  //   }, feedbackType)
  // }

  // // 获取应用列表
  // static getAppList = (params: SchemeEdit, feedbackType?:string): AxiosPromise<IRes> => {
  //   return service.request({
  //     url: '/berserker-base/zapp/listApp',
  //     method: 'get',
  //     params: params
  //   }, feedbackType)
  // }

  // 获取组件列表
  static getComList = (params: SchemeEdit, feedbackType?:string): AxiosPromise<IRes> => {
    return service.request({
      url: '/berserker-base/zcom/listCom',
      method: 'get',
      params: params
    }, feedbackType)
  }
  // 获取方案结构
  static getSchemeDetailInfo = (params: SchemeEdit, feedbackType?:string): AxiosPromise<IRes> => {
    return service.request({
      url: '/berserker-base/scheme/getSingleAppSchemeDetailInfo',
      method: 'get',
      params: params
    }, feedbackType)
  }
  //  增加菜单/组件
  static insertDetailNodeList = (params: SchemeEdit, feedbackType?:string): AxiosPromise<IRes> => {
    return service.request({
      url: '/berserker-base/scheme/insertDetailNodeList',
      method: 'post',
      data: params
    }, feedbackType)
  }

  //  保存方案结构
  static saveDetailNode = (params: SchemeEdit, feedbackType?:string): AxiosPromise<IRes> => {
    return service.request({
      // url: '/berserker-base/scheme/saveDetailNode',
      url: '/berserker-base/scheme/saveDetailNode',
      method: 'post',
      data: params
    }, feedbackType)
  }

  // 获取方案结构
  static getDetailNode = (params: SchemeEdit, feedbackType?:string): AxiosPromise<IRes> => {
    return service.request({
      url: '/berserker-base/scheme/getDetailNode',
      method: 'get',
      params: params
    }, feedbackType)
  }
  // /berserker-base/scheme/insertDetailNodeList
  // /berserker-base/scheme/getSingleAppSchemeDetailInfo
  // /berserker-base/zapp/listApp
  // /berserker-base/zcom/listCom
}
