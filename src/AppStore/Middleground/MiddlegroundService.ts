import {Service} from '@/common/Service';

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
}