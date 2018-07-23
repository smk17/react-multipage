export default interface ServiceResult<T> {
  /** 数据 */
  data: T
  /** 第几页 */
  pageIndex: number
  /** 总数 */
  totalCount: number
}