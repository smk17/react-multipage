import {Service} from '@/common/Service';
import HttpService from '@/common/HttpService';
import { TenantParams, UserParams,UserPasswordParams } from './statement';

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
   * 更新租户信息
   * @param tenantParams 需要更新租户数据
   */
  static async saveTenant (tenantParams: TenantParams) {
      return true ;
  }

    /**
   * 更新管理员信息
   * @param userParams 需要更新管理员数据
   */
  static async saveUser (userParams: UserParams) {
    return true ;
  }

  /**
   * 更新租户信息
   * @param userPasswordParams 需要更新管理员登陆名和密码数据
   */
  static async saveUserPassword (userPasswordParams: UserPasswordParams) {
    return true ;
  } 
}