import { Service } from "@/common/Service";

export default class HttpService {
  
  /** 获取页面数据 */
  static getPageData<T> (params) {
    return Service.executeService<T>({
      name: '/service/data/getpagedata?_ajax=1',
      params
    })
  }

  /** 保存页面数据 */
  static executeController<T> (params) {
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