/*
 * @Author       : your name
 * @Date         : 2022-02-18 13:23:43
 * @LastEditTime : 2022-08-26 09:40:10
 * @LastEditors  : Joe
 * @FilePath     : /management/src/service/scheme/index.ts
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
  callbackView?: {
    menuList?: any[]
    comList?: any[]
    view?: any[]
  }
}

export class Scheme {
  // //获取菜单列表
  // static getMenuList = (params: SchemeEdit, feedbackType?: string): AxiosPromise<IRes> => {
  //   return service.request({
  //     url: '/berserker-base-new/zindex/listIndex',
  //     method: 'get',
  //     params: params
  //   })
  // }

  // // 获取应用列表
  // static getAppList = (params: SchemeEdit, feedbackType?: string): AxiosPromise<IRes> => {
  //   return service.request({
  //     url: '/berserker-base-new/zapp/listApp',
  //     method: 'get',
  //     params: params
  //   })
  // }

  // 获取组件列表
  static getComList = (params: SchemeEdit, feedbackType?: string): AxiosPromise<IRes> => {
    return service.request({
      url: '/berserker-base-new/zcom/listCom',
      method: 'get',
      params: params
    }, feedbackType)
  }
  // 获取方案结构
  static getSchemeDetailInfo = (params: SchemeEdit, feedbackType?: string): AxiosPromise<IRes> => {
    return service.request({
      url: '/berserker-base-new/scheme/getSingleAppSchemeDetailInfo',
      method: 'get',
      params: params
    }, feedbackType)
  }
  //  增加菜单/组件
  static insertDetailNodeList = (params: SchemeEdit, feedbackType?: string): AxiosPromise<IRes> => {
    return service.request({
      url: '/berserker-base-new/scheme/insertDetailNodeList',
      method: 'post',
      data: params
    }, feedbackType)
  }

  //  保存方案结构
  static saveDetailNode = (params: SchemeEdit, feedbackType?: string): AxiosPromise<IRes> => {
    return service.request({
      // url: '/berserker-base-new/scheme/saveDetailNode',
      url: '/berserker-base-new/scheme/saveDetailNode',
      method: 'post',
      data: params
    }, feedbackType)
  }

  // 获取方案结构
  static getDetailNode = (params: SchemeEdit, feedbackType?: string): AxiosPromise<IRes> => {
    return service.request({
      url: '/berserker-base-new/scheme/getDetailNode',
      method: 'get',
      params: params
    }, feedbackType)
  }
  // /berserker-base-new/scheme/insertDetailNodeList
  // /berserker-base-new/scheme/getSingleAppSchemeDetailInfo
  // /berserker-base-new/zapp/listApp
  // /berserker-base-new/zcom/listCom
}
