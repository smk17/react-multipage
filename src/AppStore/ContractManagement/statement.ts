import {ServiceResult} from "@/common/HttpService/statement";

export interface ContractListParams {
  /** 第几页 */
  pageIndex: number
  /** 签署公司Id */
  CompanyId: string
}

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
export interface ContractCollectionListResult extends ServiceResult<ContractCollectionInfo[]> {}
export interface ContractListResult extends ServiceResult<ContractInfo[]> {}

/** 合同 */
export interface ContractInfo {
  code: string
  contractClassId: string
  contractClassName: string
  contractSubClassId: string
  contractSubClassName: string
  contractname: string
  createBy: string
  createOn: string
  customId: string
  customName: string
  date: string
  deleted: number
  deptId: string
  id: string
  implementerId: string
  implementerName: string
  money: number
  moneydaxie: string
  name: string
  namepinyin: string
  parenname: string
  parentId: string
  parentcount: string
  productname: string
  signingCompanyId: string
  signingCompanyName: string
  userId: string
  userName: string
}

/** 合同回款 */
export interface ContractCollectionInfo {
  id: string
  /** 签署公司 */
  companyName: string
}

/** 合同应收款 */
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
  predictDccountsDueDate: string
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
  /** 付款条件 */
  isAccordance: number
  /** 款项 */
  isApproval: number
  /** 付款流程 */
  isLaunch: number
}