import service, { IRes } from '@/service'
// import { ArticleData } from '@/service/manage/type'
import { AxiosPromise } from 'axios'

// [多媒体信息] 相关接口
interface IInformationControl {
  current?: number
  size?: number
  type?: number
  id?: number
  parentId?: number
  title?: string
  publishDepartmentCode?: string
  contentType?: string
  content?: string
  typeNumber?: number
}

export class Media {
  // 获取多媒体列表
  static getMediaList = (
    params: IInformationControl,
    feedbackType?: string,
  ): AxiosPromise<IRes> => {
    return service.request(
      {
        method: 'get',
        url: '/berserker-base-new/basenoticeNew/page',
        params: params,
      },
      feedbackType,
    )
  }
  // 获取多媒体类型
  static getMediaType = (
    params: IInformationControl,
    feedbackType?: string,
  ): AxiosPromise<IRes> => {
    return service.request(
      {
        method: 'get',
        url: '/berserker-base-new/basenoticeNew/tree',
        params: params,
      },
      feedbackType,
    )
  }
  // 获取文章详情
  static getMediaInfo = (
    params: IInformationControl,
    feedbackType?: string,
  ): AxiosPromise<IRes> => {
    return service.request(
      {
        method: 'get',
        url: '/berserker-base-new/basenotice',
        params: params,
      },
      feedbackType,
    )
  }

  // 删除多媒体信息
  static deleteMedia = (
    params: IInformationControl,
    feedbackType?: string,
  ): AxiosPromise<IRes> => {
    return service.request(
      {
        method: 'post',
        url: '/berserker-base-new/basenoticeNew/delete',
        data: params,
      },
      feedbackType,
    )
  }
  // 添加文章
  static addMediaArticle = (
    params: IInformationControl,
    feedbackType?: string,
  ): AxiosPromise<IRes> => {
    return service.request(
      {
        method: 'post',
        url: '/berserker-base-new/basenoticeNew/add',
        data: params,
      },
      feedbackType,
    )
  }
  // 添加文件
  static uploadFile = (
    params: FormData,
    feedbackType?: string,
  ): AxiosPromise<IRes> => {
    return service.request(
      {
        method: 'post',
        url: '/berserker-base/file/uploadFiles',
        data: params,
      },
      feedbackType,
    )
  }
  // 编辑文章
  static editMediaArticle = (
    params: IInformationControl,
    feedbackType?: string,
  ): AxiosPromise<IRes> => {
    return service.request(
      {
        method: 'post',
        url: '/berserker-base-new/basenoticeNew/edit',
        data: params,
      },
      feedbackType,
    )
  }
  // 立即发布
  static toPublish = (
    params: IInformationControl,
    feedbackType?: string,
  ): AxiosPromise<IRes> => {
    return service.request(
      {
        method: 'post',
        url: '/berserker-base-new/basenotice/publish',
        data: params,
      },
      feedbackType,
    )
  }
}
// [信息查询]
export class Info {
  // 获取身份列表
  static getIdentityList = (feedbackType?: string): AxiosPromise<IRes> => {
    return service.request({
      method: 'get',
      url: '/berserker-base-new/identity',
    })
  }
  // 获取部门列表
  static getBasedepartmentList = (
    feedbackType?: string,
  ): AxiosPromise<IRes> => {
    return service.request({
      method: 'get',
      url: '/berserker-base-new/basedepartment',
    })
  }
  // 获取分组列表
  static getGroupList = (feedbackType?: string): AxiosPromise<IRes> => {
    return service.request({
      method: 'get',
      url: '/berserker-base/group',
    })
  }
}
// [类型管理] 相关接口
interface IInformationTypeControl {
  current?: number
  size?: number
  parentId?: number
  isTree?: any
  id?: number
  isSend?: string
  supportRecipient?: string
  contentMoreType?: string
}

export class Type {
  // 获取多媒体类型列表
  static getMediaType = (
    params: IInformationTypeControl,
    feedbackType?: string,
  ): AxiosPromise<IRes> => {
    return service.request(
      {
        method: 'get',
        url: '/berserker-base-new/baseNoticeTypeNew/tree',
        params: params,
      },
      feedbackType,
    )
  }
  // 获取多媒体类型信息
  static getTypeInfo = (
    params: IInformationTypeControl,
    feedbackType?: string,
  ): AxiosPromise<IRes> => {
    return service.request(
      {
        method: 'get',
        url: '/berserker-base-new/baseNoticeTypeNew',
        params: params,
      },
      feedbackType,
    )
  }

  // 获取多媒体子类型
  static getMediaTypeTree = (
    params: IInformationTypeControl,
    feedbackType?: string,
  ): AxiosPromise<IRes> => {
    return service.request(
      {
        method: 'get',
        url: '/berserker-base-new/baseNoticeType',
        params: params,
      },
      feedbackType,
    )
  }
  // 获取类型分页
  static getMediaTypePage = (
    params: IInformationTypeControl,
    feedbackType?: string,
  ): AxiosPromise<IRes> => {
    return service.request(
      {
        method: 'get',
        url: '/berserker-base-new/baseNoticeTypeNew/page',
        params: params,
      },
      feedbackType,
    )
  }

  // 添加类型
  static addMediaType = (
    params: IInformationTypeControl,
    feedbackType?: string,
  ): AxiosPromise<IRes> => {
    return service.request(
      {
        method: 'post',
        url: 'berserker-base-new/baseNoticeTypeNew/add',
        data: params,
      },
      feedbackType,
    )
  }
  // 编辑类型
  static editMediaType = (
    params: IInformationTypeControl,
    feedbackType?: string,
  ): AxiosPromise<IRes> => {
    return service.request(
      {
        method: 'post',
        url: 'berserker-base-new/baseNoticeTypeNew/edit',
        data: params,
      },
      feedbackType,
    )
  }
  // 删除类型
  static deleteMediaType = (
    params: IInformationTypeControl,
    feedbackType?: string,
  ): AxiosPromise<IRes> => {
    return service.request(
      {
        method: 'post',
        url: 'berserker-base-new/baseNoticeTypeNew/delete',
        data: params,
      },
      feedbackType,
    )
  }
  // 修改类型可设置属性
  static setType = (
    params: IInformationTypeControl,
    feedbackType?: string,
  ): AxiosPromise<IRes> => {
    return service.request(
      {
        method: 'post',
        url: 'berserker-base-new/baseNoticeTypeNew/set',
        data: params,
      },
      feedbackType,
    )
  }
}
// [广告管理] 相关接口
interface IAdvertControl {
  current?: number
  size?: number
  likeSelectName?: boolean
  adType?: number
  effect?: number
  userType?: string
  app?: number
}

export class Advert {
  // 获取广告列表
  static getAdvertList = (
    params: IAdvertControl,
    feedbackType?: string,
  ): Promise<IRes> => {
    return service.request(
      {
        method: 'get',
        url: 'berserker-advertising/advertising/page',
        params: params,
      },
      feedbackType,
    )
  }
}
/**
 * 权限树列表查询
 * @param feedbackType
 */
export const getAuthTree = (feedbackType?: string): Promise<IRes> =>
  service.request(
    {
      url: '/berserker-tenant/auth/tree',
      method: 'get',
    },
    feedbackType,
  )
