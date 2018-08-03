
export interface TenantParams {
  /** 租户id **/
  id?: string | null
  /** 租户名称 **/
  name?: string
  /** 企业名称 **/
  conpanyname?: string
  /** 地区 **/
  area?: string
  /** 联系方式 **/
  contact?: string
}

export interface UserParams {
  /** 用户id **/
  id?: string | null
  /** 姓名 **/
  name?: string
  /** 邮箱 **/
  email?: string
  /** 手机 **/
  mobile?: string
}

export interface UserPasswordParams {
  /** 用户id **/
  id?: string | null
  /** 登陆名 **/
  code?: string
  /** 密码 **/
  password?: string
}

/** 应用 */
export interface AppInfo {
  /** 应用id **/
  id?: string | null
  /** 应用编码 **/
  appCode?: string
  /**  应用姓名 **/
  name?: string
  /**  应用类型 **/
  type?: number
  /**  应用图标 **/
  icon?: string
  /**  应用简介 **/
  info?: string
  /**  应用介绍 **/
  remark?: string
  /**  申请状态 **/
  applyState?: number
  /**  申请状态显示名称 **/
  applyStateName?: string
}

/** 应用申请 */
export interface TenantAppApplyInfo {
  /** 租户ID **/
  tenantId?: string | null
  /** 应用ID **/
  appId?: string | null
  /**  申请时间 **/
  applyOn?: Date
  /**  申请人 **/
  applyBy?: string| null
  /**  申请使用时长 **/
  useTo?: number
}