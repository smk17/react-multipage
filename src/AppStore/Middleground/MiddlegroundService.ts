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

  static hasLoginInfo () {
    var userId= sessionStorage.getItem("userId");
    var tenantId= sessionStorage.getItem("tenantId");
    var appId= sessionStorage.getItem("appId");
    if(!userId && !tenantId && !appId){
      window.location.href="login.html";
    }
  }

  static handleLoginOut (key:any) {
    sessionStorage.setItem("userId",'');
    sessionStorage.setItem("tenantId",'');
    sessionStorage.setItem("appId",'');  
    window.location.href="login.html";
  }

    /** 获取租户信息 */
    static getTenant () {
      // let filter: any[] = []
      // filter.push({ dataType: 6, left: 'id', op: 1, title: '租户ID', right: sessionStorage.getItem("tenantId")})
      // return HttpService.getPageData<{username: string, id: string}[]>({
      //   id: '租户',
      //   pageAddress: { pageMode: 0, pageId: 'Main', moduleId: 'Tenant', systemId: 'MutiTenancy' },
      //   mode: 0,
      //   attachParams: {
      //     filter: {
      //       type: 1,
      //       expressions: filter
      //     }
      //   }
      // });
      return {
        id: sessionStorage.getItem("tenantId"),
        name:'测试公司',
        conpanyname:'测试公司',
        area:'XX',
        contact:'21313131321',
      };
    }

    /** 获取管理员信息 */
    static getUser () {
      // let filter: any[] = []
      // filter.push({ dataType: 6, left: 'id', op: 1, title: '管理员ID', right: sessionStorage.getItem("userId")})
      // return HttpService.getPageData<{username: string, id: string}[]>({
      //   id: '管理员',
      //   pageAddress: { pageMode: 0, pageId: 'Main', moduleId: 'Tenant', systemId: 'MutiTenancy' },
      //   mode: 0,
      //   attachParams: {
      //     filter: {
      //       type: 1,
      //       expressions: filter
      //     }
      //   }
      // });
      return {
        id: sessionStorage.getItem("userId"),
        name:'张三',
        email:'1@1.com',
        mobile:'12345678901',
      };
    }

    /** 获取管理员登陆信息 */
    static getUserPassword () {
      // let filter: any[] = []
      // filter.push({ dataType: 6, left: 'id', op: 1, title: '管理员ID', right: sessionStorage.getItem("userId")})
      // return HttpService.getPageData<{username: string, id: string}[]>({
      //   id: '管理员密码',
      //   pageAddress: { pageMode: 0, pageId: 'Main', moduleId: 'Tenant', systemId: 'MutiTenancy' },
      //   mode: 0,
      //   attachParams: {
      //     filter: {
      //       type: 1,
      //       expressions: filter
      //     }
      //   }
      // });
      return {
        id: sessionStorage.getItem("userId"),
        code:'test',
        password:'123456',
      };
    }

  /**
   * 更新租户信息
   * @param params 需要更新租户数据
   */
  static async saveTenant (params: TenantParams) {
    // let get = await HttpService.getController<{id?: string, type?: string, params?: object, hasRights?: boolean}>({
    //   id: 'save',
    //   pageAddress: { pageMode: 2, pageId: 'Main', moduleId: 'Tenant', systemId: 'MutiTenancy' }
    // })
    // if (get) {
    //   params['_dataState'] = 2
    //   let save = await HttpService.executeController<{id: string}>({
    //     id: 'save',
    //     pageAddress: { pageMode: 2, pageId: 'Main', moduleId: 'Tenant', systemId: 'MutiTenancy' },
    //     params: {
    //       _param_0: params,
    //     }
    //   })
    //   return save;
    // }
      return true ;
  }

    /**
   * 更新管理员信息
   * @param userParams 需要更新管理员数据
   */
  static async saveUser (params: UserParams) {
    // let get = await HttpService.getController<{id?: string, type?: string, params?: object, hasRights?: boolean}>({
    //   id: 'save',
    //   pageAddress: { pageMode: 2, pageId: 'Main', moduleId: 'Tenant', systemId: 'MutiTenancy' }
    // })
    // if (get) {
    //   params['_dataState'] = 2
    //   let save = await HttpService.executeController<{id: string}>({
    //     id: 'save',
    //     pageAddress: { pageMode: 2, pageId: 'Main', moduleId: 'Tenant', systemId: 'MutiTenancy' },
    //     params: {
    //       _param_0: params,
    //     }
    //   })
    //   return save;
    // }
    return true ;
  }

  /**
   * 更新租户信息
   * @param userPasswordParams 需要更新管理员登陆名和密码数据
   */
  static async saveUserPassword (params: UserPasswordParams) {
    // let get = await HttpService.getController<{id?: string, type?: string, params?: object, hasRights?: boolean}>({
    //   id: 'save',
    //   pageAddress: { pageMode: 2, pageId: 'Main', moduleId: 'Tenant', systemId: 'MutiTenancy' }
    // })
    // if (get) {
    //   params['_dataState'] = 2
    //   let save = await HttpService.executeController<{id: string}>({
    //     id: 'save',
    //     pageAddress: { pageMode: 2, pageId: 'Main', moduleId: 'Tenant', systemId: 'MutiTenancy' },
    //     params: {
    //       _param_0: params,
    //     }
    //   })
    //   return save;
    // }
    return true ;
  } 
}