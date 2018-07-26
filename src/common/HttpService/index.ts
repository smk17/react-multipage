import { Service } from "@/common/Service";
import { ServiceParams, GetServiceParams, SaveServiceParams } from "@/common/HttpService/statement";

export default class HttpService {

  /** 获取权限 */
  static getController<T> (params: ServiceParams) {
    return Service.executeService<T>({
      name: '/service/controller/GetController?_ajax=1',
      params
    })
  }

  static GetIds () {
    return Service.executeService<string[]>({
      name: '/service/data/GetIds?_ajax=1',
      params: {count: 1}
    })
  }
  
  /** 获取页面数据 */
  static getPageData<T> (params: GetServiceParams) {
    return Service.executeService<T>({
      name: '/service/data/getpagedata?_ajax=1',
      params
    })
  }

  /** 保存页面数据 */
  static executeController<T> (params: SaveServiceParams) {
    return Service.executeService<T>({
      name: '/service/controller/execute?_ajax=1',
      params
    })
  }
  
  static config2DingTalk (corpId: string) {
    return Service.executeService<DingtalkConfig>({
      name: '/service/ding/config',
      params: {
        corpId: corpId,
        // url:  window.location.href
        url: encodeURIComponent(window.location.href)
      }
    })
  }

  static login2DingTalk (corpId: string, code: string) {
    return Service.executeService({
      name: '/service/ding/login',
      params: {
        corpId: corpId,
        code: code
      }
    })
  }
}