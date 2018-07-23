/**
 * 控制器请求对象
 */
export class IControllerRequest {
  /**
   * 当前要请求的控制器id
   */
  id;
  /**
   * 调用参数
   */
  params;
}
/**
* 要执行的服务信息
*/
export class IServiceInfo {
  /**
   * 服务名称
   */
  name: string;
  /**
   * 服务参数
   */
  params: any;
  /**
   * 是否采用同步执行，默认为false
   */
  isSynch?: boolean;
  /**
   * 是否自己处理，默认为success
   */
  handlingErrorLevel?: boolean | number;
}

export class IDataInfo {
  /**
   * 数据id(1.系统数据源：系统id/数据源id；2.页面数据源：系统id/模块id/页面id/数据源id)
   */
  id;
  pageMode;
  mode;
  orderby;
  pageSize;
  pageIndex;
  params;
}