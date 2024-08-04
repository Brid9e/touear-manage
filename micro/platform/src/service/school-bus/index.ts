/*
 * @Author       : your name
 * @Date         : 2022-09-13 09:15:04
 * @LastEditTime: 2022-10-11 14:29:12
 * @LastEditors: Joe
 * @FilePath: /management/src/service/school-bus/index.ts
 */
import service, { IRes } from '@/service'
import { AxiosPromise } from 'axios'

interface Page {
  current?: number | unknown
  size?: number | unknown
}

interface BusInfo extends Page {
  name?: string | unknown
  inf_name?: string | unknown
  isseats?: number | boolean | string | unknown
  status?: number | string | boolean | unknown
  id?: number | string | unknown
}

export interface AddBusInfo extends BusInfo {
  busCode?: string | unknown
  deviceid?: string | unknown
  imgUrl?: string | unknown
  num?: number | string | unknown
  remark?: string | unknown
  xy?: string | unknown
  coordinate?: string | unknown
  ischange?: string | unknown
}

interface EditBusInfo extends AddBusInfo {
  id?: string | unknown
}

interface BusStatus {
  id?: string | unknown
  status?: number | string | unknown
}

type BusSeat = EditBusInfo

interface BusLine extends BusInfo {
  id?: string | unknown
  operationtime?: string | unknown
  price?: string | unknown
  isBook?: boolean | unknown
  time_info?: any[] | unknown
  site_info?: any[] | unknown
  name?: string | unknown
}

interface BusRule {
  id?: string | unknown
  weekday?: string | unknown
  time_no?: string | unknown
  lineid?: string | unknown
  productid?: (number | string)[] | string | unknown
}

export interface BusSchedule {
  time_no_id: string | unknown
  type: string | unknown
  day: string | unknown
  productid: string | unknown
}

/**
 *
 * @date 2022-10-11 14:25:11
 * @author Joe
 * @description 校车业务相关接口
 *
 */
export class Bus {
  // 车辆信息列表查询
  static getBusInfo = (params: BusInfo, feedbackType?:string): AxiosPromise<IRes> => {
    return service.request({
      url: '/booking-product/product/bus/page',
      method: 'get',
      params: params
    }, feedbackType)
  }

  // 车辆信息新增
  static addBusInfo = (params: AddBusInfo, feedbackType?:string): AxiosPromise<IRes> => {
    return service.request({
      url: '/booking-product/product/bus/add',
      method: 'post',
      data: params
    }, feedbackType)
  }

  // 车辆信息修改
  static editBusInfo = (params: EditBusInfo, feedbackType?:string): AxiosPromise<IRes> => {
    return service.request({
      url: '/booking-product/product/bus/edit',
      method: 'post',
      data: params
    }, feedbackType)
  }

  // 车座信息获取
  static getBusSeat = (params: BusSeat, feedbackType?:string): AxiosPromise<IRes> => {
    return service.request({
      url: '/booking-product/product/bus/getSeats',
      method: 'get',
      params: params
    }, feedbackType)
  }

  // 车座状态更改
  static updateBusStatus = (params: BusStatus, feedbackType?:string): AxiosPromise<IRes> => {
    return service.request({
      url: '/booking-product/product/bus/updateStatus',
      method: 'post',
      data: params
    }, feedbackType)
  }

  // 线路信息列表查询
  static getBusLine = (params: BusLine, feedbackType?:string): AxiosPromise<IRes> => {
    return service.request({
      url: '/booking-product/line/bus/page',
      method: 'get',
      params: params
    }, feedbackType)
  }

  // 线路信息新增
  static addBusLine = (params: BusLine, feedbackType?:string): AxiosPromise<IRes> => {
    return service.request({
      url: '/booking-product/line/bus/add',
      method: 'post',
      data: params
    }, feedbackType)
  }

  //线路信息修改
  static editBusLine = (params: BusLine, feedbackType?:string): AxiosPromise<IRes> => {
    return service.request({
      url: '/booking-product/line/bus/edit',
      method: 'post',
      data: params
    }, feedbackType)
  }

  // 路线状态更改
  static updateBusLineStatus = (params: BusLine, feedbackType?:string): AxiosPromise<IRes> => {
    return service.request({
      url: '/booking-product/line/bus/updateStatus',
      method: 'post',
      data: params
    }, feedbackType)
  }

  // 排班左侧时间信息与可视表数据信息
  static getBusRuleNoInfo = (params: BusRule, feedbackType?:string): AxiosPromise<IRes> => {
    return service.request({
      url: '/booking-stock/rule/bus/getTimeNoInfo',
      method: 'get',
      params: params
    }, feedbackType)
  }

  // 排班车辆查询
  static getFreeBus = (params: BusRule, feedbackType?:string): AxiosPromise<IRes> => {
    return service.request({
      url: '/booking-stock/rule/bus/getfreebus',
      method: 'get',
      params: params
    }, feedbackType)
  }

  // 排班保存
  static addBusRuleNoInfo = (params: BusSchedule, feedbackType?:string): AxiosPromise<IRes> => {
    return service.request({
      url: '/booking-stock/rule/bus/add',
      method: 'post',
      data: params
    }, feedbackType)
  }

  // 获取站点列表
  static getBusStation = (params: BusInfo, feedbackType?:string): AxiosPromise<IRes> => {
    return service.request({
      url: '/booking-product/site/bus/page',
      method: 'get',
      params: params
    }, feedbackType)
  }
  // 新增站点
  static addBusStation = (params: AddBusInfo, feedbackType?:string): AxiosPromise<IRes> => {
    return service.request({
      url: '/booking-product/site/bus/add',
      method: 'post',
      data: params
    }, feedbackType)
  }
  // 修改站点信息
  static updateBusStation = (params: EditBusInfo, feedbackType?:string): AxiosPromise<IRes> => {
    return service.request({
      url: '/booking-product/site/bus/edit',
      method: 'post',
      data: params
    }, feedbackType)
  }
  // 膝盖站点状态
  static updateBusStationStatus = (params: BusStatus, feedbackType?:string): AxiosPromise<IRes> => {
    return service.request({
      url: '/booking-product/site/bus/updateStatus',
      method: 'post',
      data: params
    }, feedbackType)
  }
  // /booking-product/line/bus/show
  // 线路时间和站点详情
  static getLineTimeStationInfo = (params: BusInfo, feedbackType?:string): AxiosPromise<IRes> => {
    return service.request({
      url: '/booking-product/line/bus/show',
      method: 'get',
      params: params
    }, feedbackType)
  }
}

/**
 *
 * @date 2022-10-11 14:24:51
 * @author Joe
 * @description 首页展示面板数据接口
 *
 */
export class BusDashboard {
  // 今日数据
  static getTodaydata = (params: BusInfo, feedbackType?:string): AxiosPromise<IRes> => {
    return service.request({
      url: '/booking-search/statistics/bus/todaydata',
      method: 'get',
      params: params
    }, feedbackType)
  }
  // 车辆运营总计
  static getOperationalStatistics = (params: BusInfo, feedbackType?:string): AxiosPromise<IRes> => {
    return service.request({
      url: '/booking-search/statistics/bus/operationalStatistics',
      method: 'get',
      params: params
    }, feedbackType)
  }
  // 用户评价总计
  static getUserCommentStatistics = (params: BusInfo, feedbackType?:string): AxiosPromise<IRes> => {
    return service.request({
      url: '/booking-search/statistics/bus/userCommentStatistics',
      method: 'get',
      params: params
    }, feedbackType)
  }
  // 乘车用户总计
  static getPassenger = (params: BusInfo, feedbackType?:string): AxiosPromise<IRes> => {
    return service.request({
      url: '/booking-search/statistics/bus/passenger',
      method: 'get',
      params: params
    }, feedbackType)
  }
  // 车辆在线时长总计
  static getBusOnline = (params: BusInfo, feedbackType?:string): AxiosPromise<IRes> => {
    return service.request({
      url: '/booking-search/statistics/bus/busOnline',
      method: 'get',
      params: params
    }, feedbackType)
  }
  // 上车站点排行
  // /booking-search/statistics/bus/boardingStation
  static getBoardingStation = (params: BusInfo, feedbackType?:string): AxiosPromise<IRes> => {
    return service.request({
      url: '/booking-search/statistics/bus/boardingStation',
      method: 'get',
      params: params
    }, feedbackType)
  }
}