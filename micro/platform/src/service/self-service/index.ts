/*
 * @Author: your name
 * @Date: 2022-02-18 13:23:43
 * @LastEditTime: 2022-09-01 15:05:05
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import service, { IRes } from '@/service'
import { AxiosPromise } from 'axios'

interface IEquipmentType {
  current: number
  size: number
}

export class Equipment {
  //分页查询设备类型
  static getEquipmentTypeList = (params: IEquipmentType, feedbackType?:string): Promise<IRes> => {
    return service.request({
      url: '/berserker-base/role',
      method: 'get',
      params: params
    }, feedbackType)
  }
}
