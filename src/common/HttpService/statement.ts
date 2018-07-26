export interface ServiceResult<T> {
  /** 数据 */
  data: T
  /** 第几页 */
  pageIndex: number
  /** 总数 */
  totalCount: number
}

export interface ServiceParams {
  id: string
  pageAddress: {
    pageMode: number
    pageId: string
    moduleId: string
    systemId: string
  }
}

export interface GetServiceParams extends ServiceParams {
  mode: number
  attachParams?: object
}

export interface SaveServiceParams extends ServiceParams {
  params: object
}