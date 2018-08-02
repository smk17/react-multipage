import {Service} from '@/common/Service';
import HttpService from '@/common/HttpService';
import { TenantParams, UserParams, } from './statement';

export default class MiddlegroundService {
  static oauthLogin (code: string) {
    return Service.executeService<any>({
      name: '/service/dingoauth/oauthlogin',
      params: {code: code}
    })
  }

  static Login (params) {
    return Service.executeService<any>({
      name: '/service/ding/oauthlogin',
      params: params
    })
  }

  /**
   * 更新组合和用户
   * @param tenantParams 需要更新租户数据
   * @param userParams 需要更新用户数据*
   */
  static async saveTenantAndUser (tenantParams: TenantParams, userParams:UserParams) {
    let get = await HttpService.getController<{id?: string, type?: string, params?: object, hasRights?: boolean}>({
      id: 'save',
      pageAddress: { pageMode: 2, pageId: 'Main', moduleId: 'Tenant', systemId: 'MutiTenancy' }
    })
    console.log(get);
    if (get) {
      tenantParams['_dataState'] = 2
      userParams['_dataState'] = 2
      let save = await HttpService.executeController<{id: string}>({
        id: 'save',
        pageAddress: { pageMode: 2, pageId: 'Main', moduleId: 'Tenant', systemId: 'MutiTenancy' },
        params: {
          _param_0: userParams,
          _param_1: tenantParams,
        }
      })
      console.log(save);
      return save ;
    }
    return;
  }
}