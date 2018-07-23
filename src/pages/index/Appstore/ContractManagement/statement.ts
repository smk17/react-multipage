import ServiceResult from "@/common/HttpService/statement";

export interface ContractReceivablesListParams {
  /** 开始日期 */
  beginDate: string
  /** 结束 */
  endDate: string
  /** 责任人Id */
  userId: string
  /** 第几页 */
  pageIndex: number
}

export interface ContractReceivablesListResult extends ServiceResult<ContractReceivablesInfo[]> {}

export interface ContractReceivablesInfo {
  id: string
  /** 账龄(天) */
  agingday: string
  /** 签约客户 */
  customname: string
  /** 合同编号 */
  contractcode: string
  /** 应收责任人 */
  username: string
  /** 款项名称 */
  moneytypename: string
  /** 款项小类 */
  moneytypeclass: string
  /** 应收日期 */
  dccountsDueDate: string
  /** 应收日期修改次数 */
  accountsDueEditTimes: number
  /** 应收金额(元) */
  money: number
  /** 已回款金额(元) */
  useMoney: number
  /** 未开票金额(元) */
  uncollected: number
  /** 已开票金额(元) */
  invoiceMoney: number
  /** 未回款金额(元) */
  uninvoiceMoney: number
  /** 付款条件 */
  accordancename: string
  /** 付款流程 */
  launchname: string
  /** 款项 */
  approvalname: string
}