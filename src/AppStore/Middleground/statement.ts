
export interface TenantParams {
  /** 租户id */
  id?: string | null
  /** 公司名称 */
  name?: string
}

export interface UserParams {
  /** 用户id */
  id?: string | null
  /** 登陆名 */
  code?: string
  /** 密码 */
  password?: string
  /** 姓名 */
  name?: string
  /** 邮箱 */
  email?: string
  /** 手机 */
  mobile?: string
}

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