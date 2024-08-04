import service, { IRes } from '@/service'
import { AxiosPromise } from 'axios'

export class File {
  /**
   * 文件批量上传
   * @param data
   * @param feedbackType
   * @returns
   */
  static uploadFiles = (
    data: any,
    feedbackType?: string
  ): AxiosPromise<IRes> => {
    return service.request(
      {
        method: 'post',
        url: '/berserker-base/file/uploadFiles',
        data,
      },
      feedbackType
    )
  }
}
