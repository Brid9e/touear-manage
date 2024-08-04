/*
 * @Author: your name
 * @Date: 2021-10-13 11:02:17
 * @LastEditTime: 2021-11-30 10:19:43
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /management/src/service/health-run/index.ts
 */
import service, { IRes, IResLogin } from '@/service'
import { AxiosPromise } from 'axios'
import { exportFile } from '@/assets/scripts/utils'

interface RunGroupControl {
  route?: any
  startDateTime?: string
  endDateTime?: string
  sno?: string | number
  memberId?: string | number
  dateUnit?: string
  current?: number
  size?: number
  total?: number
  pages?: number
  searchCount?: boolean
  ruleId?: number | string
  ruleDetail?: any
  academicYear?: number | string
  startTime?: string
  endTime?: string
  semesterName?: string
  id?: number | string
  semesterId?: number
  semesterGoalId?: number
  className?: string
  departmentName?: string
  conditionString?: string
}
export class HealthRun {
  //  添加新路线
  static addNewRoute = (
    params: RunGroupControl,
    feedbackType?: string
  ): AxiosPromise<IRes> => {
    return service.request({
      url: '/berserker-run-app/route/insertRouteBasicInfo',
      method: 'post',
      data: params,
    }, feedbackType)
  }
  // 获取综合统计信息列表
  static getMultiList = (
    params: RunGroupControl,
    feedbackType?: string
  ): AxiosPromise<IRes> => {
    return service.request(
      {
        url: '/berserker-run-app/record/admin/getAllRecordStatisticalInfo',
        method: 'get',
        params: params,
      },
      feedbackType
    )
  }
  // 获取个人统计信息列表
  static getUserList = (
    params: RunGroupControl,
    feedbackType?: string
  ): AxiosPromise<IRes> => {
    return service.request(
      {
        url: '/berserker-run-app/record/admin/getRecordStatisticalInfo',
        method: 'get',
        params: params,
      },
      feedbackType
    )
  }
  // 分页获取运动规则
  static getRules = (
    params: RunGroupControl,
    feedbackType?: string
  ): AxiosPromise<IRes> => {
    return service.request(
      {
        url: '/berserker-run-app/rule/getPageRuleInfoList',
        method: 'get',
        params: params,
      },
      feedbackType
    )
  }

  // 更新运动规则
  static updateRules = (
    params: RunGroupControl,
    feedbackType?: string
  ): AxiosPromise<IRes> => {
    return service.request({
      url: '/berserker-run-app/rule/updateRule',
      method: 'post',
      data: params,
    }, feedbackType)
  }

  // 获取记录列表
  static getRecordList = (
    params: RunGroupControl,
    feedbackType?: string
  ): AxiosPromise<IRes> => {
    return service.request(
      {
        url: '/berserker-run-app/record/admin/getPageRecordList',
        method: 'get',
        params: params,
      },
      feedbackType
    )
  }

  //  新增学期信息
  static createSemester = (
    params: RunGroupControl,
    feedbackType?: string
  ): AxiosPromise<IRes> => {
    return service.request({
      url: '/berserker-run-app/semester/createSemester',
      method: 'post',
      data: params,
    }, feedbackType)
  }

  //  更新学期信息
  static updateSemester = (
    params: RunGroupControl,
    feedbackType?: string
  ): AxiosPromise<IRes> => {
    return service.request({
      url: '/berserker-run-app/semester/updateSemester',
      method: 'post',
      data: params,
    }, feedbackType)
  }

  //  删除学期信息
  static deleteSemester = (
    params: RunGroupControl,
    feedbackType?: string
  ): AxiosPromise<IRes> => {
    return service.request(
      {
        url: '/berserker-run-app/semester/deleteSemester',
        method: 'get',
        params: params,
      },
      feedbackType
    )
  }

  //  分页获取学期信息
  static listSemester = (
    params: RunGroupControl,
    feedbackType?: string
  ): AxiosPromise<IRes> => {
    return service.request(
      {
        url: '/berserker-run-app/semester/listSemester',
        method: 'get',
        params: params,
      },
      feedbackType
    )
  }

  //  新增学期目标
  static createSemesterGoal = (
    params: RunGroupControl,
    feedbackType?: string
  ): AxiosPromise<IRes> => {
    return service.request({
      url: '/berserker-run-app/semester/goal/createSemesterGoal',
      method: 'post',
      data: params,
    }, feedbackType)
  }

  //  更新学期目标
  static updateSemesterGoal = (
    params: RunGroupControl,
    feedbackType?: string
  ): AxiosPromise<IRes> => {
    return service.request({
      url: '/berserker-run-app/semester/goal/updateSemesterGoal',
      method: 'post',
      data: params,
    }, feedbackType)
  }

  //  删除学期目标
  static deleteSemesterGoal = (
    params: RunGroupControl,
    feedbackType?: string
  ): AxiosPromise<IRes> => {
    return service.request(
      {
        url: '/berserker-run-app/semester/goal/deleteSemesterGoal',
        method: 'get',
        params: params,
      },
      feedbackType
    )
  }

  // /semester/listSemesterGoal
  //  分页获取学期目标信息
  static listSemesterGoal = (
    params: RunGroupControl,
    feedbackType?: string
  ): AxiosPromise<IRes> => {
    return service.request(
      {
        url: '/berserker-run-app/semester/listSemesterGoal',
        method: 'get',
        params: params,
      },
      feedbackType
    )
  }

  // /semester/semesterGoalResultSummary
  //  获取学期目标统计结果
  static semesterGoalResultSummary = (
    params?: RunGroupControl,
    feedbackType?: string
  ): AxiosPromise<IRes> => {
    return service.request(
      {
        url: '/berserker-run-app/semester/semesterGoalResultSummary',
        method: 'get',
        params: params,
      },
      feedbackType
    )
  }

  // 获取排名
  // /semester/getRecordRankInfo conditionString 传为下载 不传为查询
  static getRecordRankInfo = (
    params: RunGroupControl,
    feedbackType?: string
  ): AxiosPromise<IRes> => {
    return service.request(
      {
        url: '/berserker-run-app/semester/getRecordRankInfo',
        method: 'get',
        params: params,
      },
      feedbackType
    )
  }

  // 获取学年列表
  // /semester/getRecordRankInfo
  static getAcademicYearTimeInfo = (
    feedbackType?: string
  ): AxiosPromise<IRes> => {
    return service.request({
      url: '/berserker-run-app/semester/academicYearTimeInfo',
      method: 'get',
    }, feedbackType)
  }

  // 下载学期目标统计结果
  // /semester/downloadSemesterGoalResultSummary
  static downloadSemesterGoalResultSummary = (
    params: RunGroupControl,
    fileName: any,
    feedbackType?: string
  ): any => {
    return service
      .request(
        {
          url: '/berserker-run-app/semester/downloadSemesterGoalResultSummary',
          method: 'get',
          responseType: 'blob',
          params: params,
        },
        feedbackType
      )
      .then((res) => {
        res.headers = {
          'content-disposition': `attachment;filename=${fileName}.xlsx`,
        }
        exportFile(res)
      })
  }

  // 下载排名运动结果
  // /semester/downloadSemesterGoalResultSummary
  static downloadRecordRankInfo = (
    params: RunGroupControl,
    fileName: any,
    feedbackType?: string
  ): any => {
    return service
      .request({
        url: '/berserker-run-app/semester/downloadRecordRankInfo',
        method: 'get',
        responseType: 'blob',
        params: params,
      }, feedbackType)
      .then((res) => {
        res.headers = {
          'content-disposition': `attachment;filename=${fileName}.xlsx`,
        }
        exportFile(res)
      })
  }
}
