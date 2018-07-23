import jsApiList from '@/common/DingTalk/jsApiList';
import { StorageSetParams, GeolocationGetParams, GeolocationResult, GeolocationStartParams, LocateMapParams, MapPOIResult, SearchMapParams, ViewMapParams, PickerParams, PickerResult } from '@/common/DingTalk/statement';
import { DateHelper } from '@/common/Utils';
import HttpService from '@/common/HttpService';

export class DingTalk {
  static corpId = ''
  /**
   * 初始化钉钉容器，配置jsApiList方可有权限使用其中的API
   * @param onSuccess 成功回调函数
   */
  static async init () {
    if (!(window.dd.version === null) && window.location.search.length > 0 ) {
      await DingTalk.config()
      await DingTalk.login()
      return;
    } else {
      return;
    }
  }

  /**
   * JSAPI权限验证配置
   * 需要鉴权的JSAPI必须进行dd.config验证后才能调用
   */
  static config () {
    return new Promise<{}>((resolve, rejct) => {
      try {
        if (!(window.dd.version === null) && window.location.search.length > 0 ) {
          let corpid =  window.location.search;
          corpid = corpid.substring(1).split('&', 1)[0];
          corpid = corpid.split('=')[1];
          DingTalk.corpId = corpid;
          HttpService.config2DingTalk(DingTalk.corpId).then(res => {
            if (res) {
              console.log(res);
              res['jsApiList'] = jsApiList
              window.dd.config(res);
              window.dd.error(error => {
                rejct(error);
                window.baseConfig.development && alert('dd error: ' + JSON.stringify(error));
              });
              resolve()
            }
          }).catch(error => {
            rejct(error);
          })
        } else {
          resolve()
        }
      } catch (error) {
        rejct(error);
      }
    })
  }

  static login () {
    return new Promise<{}>((resolve, rejct) => {
      DingTalk.requestAuthCode().then(res => {
        HttpService.login2DingTalk(DingTalk.corpId, res.code).then(res => {
          resolve()
        }).catch(err => rejct(err))
      }).catch(err => rejct(err))
    })
    
  }

  /**
   * 获取 DingTalk JSAPI实例对象
   * @param api JSAPI 名称
   */
  private static getApi(api: string) {
    return DingTalk._getObjectByApi(api.split(/\./g), window.dd);
  }

  /**
   * 遍历DingTalk JSAPI实例对象
   * @param api JSAPI 名称数组
   * @param object DingTalk 实例
   */
  private static _getObjectByApi(api: string[], object: any) {
    if (api.length > 0) {
        var o = api.shift() || '';
        var newObject = object[o];
        return DingTalk._getObjectByApi(api, newObject);
    }
    return object;
  }

  /**
   * 执行DingTalk JSAPI实例对象并返回自定义类型{T}的Promise对象
   * @param api JSAPI 名称
   * @param params 参数
   * @param noDingTalk 在没有钉钉容器下要这些的操作
   */
  private static execute<T>(api: string, params: any = {}, noDingTalk: () => void = () => {}) {
    return new Promise<T>((resolve, rejct) => {
      try {
        if (!(window.dd.version === null)) {
          params.onSuccess = (result: T) => {
            resolve(result)
          }
          params.onFail = err => {
            window.baseConfig.development &&  alert(api + 'err: ' + JSON.stringify(err));
            rejct(err)
          }
          // console.dir(params)
          window.dd.ready(() => {
            DingTalk.getApi(api)(params);
          });
        } else {
          noDingTalk()
          console.log('请在钉钉容器调用接口:' + api);
        }
      } catch (error) {
        rejct(error);
      }
    })
  }
  
  /**
   * 获取微应用免登授权码
   */
  static requestAuthCode () {
    interface Result {
      /** 授权码，5分钟有效，且只能使用一次 */
      code: string
    }
    return DingTalk.execute<Result>('runtime.permission.requestAuthCode', { corpId: DingTalk.corpId });
  }
  
  /**
   * 获取服务窗免登授权码
   */
  static requestChannelAuthCode () {
    interface Result {
      /** 授权码，5分钟有效，且只能使用一次 */
      code: string
    }
    return DingTalk.execute<Result>('channel.permission.requestAuthCode');
  }

  /**
   * 获取微应用反馈式操作的临时授权码
   * @param agentId 微应用ID，必须与dd.config的一致
   */
  static requestOperateAuthCode (agentId: string) {
    interface Result {
      /** 授权码，5分钟有效，且只能使用一次 */
      code: string
    }
    return DingTalk.execute<Result>('runtime.permission.requestOperateAuthCode', { agentId });
  }

  /**
   * 获取手机基础信息
   */
  static getPhoneInfo () {
    interface Result {
      /** 手机屏幕宽度 */
      screenWidth: number,
      /** 手机屏幕高度 */
      screenHeight: number,
      /** 手机品牌 */
      brand: string,
      /** 手机型号 */
      model: string,
      /** 版本 */
      version: string,
      /** 网络类型: wifi、2g、3g、4g、unknown、none，none表示离线 */
      netInfo: 'wifi' | '4g' | '3g' | '2g' | 'unknown' | 'none', 
      /** 运营商信息 */
      operatorType: string,
      /** 是否有SIM卡 */
      SIMCard: boolean
    }
    return DingTalk.execute<Result>('device.base.getPhoneInfo');
  }

  /**
   * 设置存储信息
   * 每次存储数据不能超过1M,单域名不能超过50M.
   * @param params 参数
   */
  static setStorageItem (params: StorageSetParams) {
    return DingTalk.execute<{}>('util.domainStorage.setItem', params);
  }
  
  /**
   * 获取存储信息
   * @param name 存储信息的key值
   */
  static getStorageItem (name: string) {
    interface Result {
      /** name对应的存储信息 */
      value: string
    }
    return DingTalk.execute<Result>('util.domainStorage.getItem', { name });
  }

  /**
   * 删除相应存储信息
   * @param name 存储信息的key值
   */
  static removeStorageItem (name: string) {
    return DingTalk.execute<{}>('util.domainStorage.removeItem', { name });
  }

  /**
   * 获取当前地理位置(单次定位)
   * Android客户端返回坐标是高德坐标，iOS客户端2.7.6及以后版本支持返回高德坐标；IOS客户端低于2.7.6版本仅支持返回标准坐标
   * 文档说明：https://open-doc.dingtalk.com/docs/doc.htm?spm=a219a.7629140.0.0.WSEhK7&treeId=171&articleId=104917&docType=1
   * 钉钉Android客户端2.1及之前版本返回的数据结构比iOS客户端多嵌套一层location字段，2.2及之后版本返回的数据结构与钉钉iOS客户端一致，建议对返回的数据先判断存在location，做向后兼容处理。
   * @param params 参数
   */
  static getGeolocation (params: GeolocationGetParams) {
    return DingTalk.execute<GeolocationResult>('device.geolocation.get', params);
  }

  /**
   * 连续获取当前地理位置信息(持续定位)
   * 开始连续定位
   * @param params 参数
   */
  static startGeolocation (params: GeolocationStartParams) {
    return DingTalk.execute<GeolocationResult>('device.geolocation.start', params);
  }

  /**
   * 停止连续定位
   * @param sceneId 
   */
  static stopGeolocation (sceneId: string) {
    interface Result {
      /** 停止的定位场景id，当该场景没有开始定位时，返回null */
      sceneId: string | null
    }
    return DingTalk.execute<Result>('device.geolocation.stop', {sceneId});
  }

  /**
   * 批量连续定位状态
   * @param sceneIds 需要查询定位场景id列表
   */
  static statusGeolocation (sceneIds: string[]) {
    /** 场景id以及对应的开启状态，1 表示正在持续定位， 0 表示未开始持续 */
    type Result = { [key: string] : 0 | 1}[]
    return DingTalk.execute<Result>('device.geolocation.status', {sceneIds});
  }

  /**
   * 地图定位
   * 唤起地图页面，获取设备位置及设备附近的POI信息；若传入的合法经纬度则显示出入的位置信息及其附近的POI信息。
   * @param params 参数
   */
  static locateMap (params: LocateMapParams) {
    return DingTalk.execute<MapPOIResult>('biz.map.locate', params);
  }

  /**
   * POI搜索
   * 唤起地图页面，根据设备位置或者传入的经纬度搜索POI。
   * @param params 参数
   */
  static searchMap (params: SearchMapParams) {
    return DingTalk.execute<MapPOIResult>('biz.map.search', params);
  }

  /**
   * 展示位置
   * 唤起地图页面，展示传入的经纬度位置。
   * @param params 参数
   */
  static viewMap (params: ViewMapParams) {
    return DingTalk.execute<{}>('biz.map.view', params);
  }

  /**
   * 下拉控件
   * @param params 测试
   */
  static chosenPicker (params: PickerParams) {
    return DingTalk.execute<PickerResult>('biz.util.chosen', params);
  }

  /**
   * 日期选择器
   * 注意：format只支持android系统规范，即2015-03-31格式为yyyy-MM-dd
   * @param value 默认显示日期 
   * @param format format只支持android系统规范，即2015-03-31格式为yyyy-MM-dd 
   */
  static chosenDatePicker (value: string = DateHelper.format(new Date()), format = 'yyyy-MM-dd') {
    interface Result {
      /** 返回选择的日期 */
      value: string
    }
    return DingTalk.execute<Result>('biz.util.datepicker', { value, format });
  }

  /**
   * 
   * @param message 消息内容
   * @param title 弹窗标题
   * @param buttonName 按钮名称
   */
  static alert (message: string, title: string = '提示', buttonName: string = '好的') {
    return DingTalk.execute<{}>('device.notification.alert', { message, title, buttonName }, () => {
      console.log(JSON.stringify(message))
    });
  }

  /**
   * 在新窗口上打开链接
   * @param url 要打开链接的地址
   */
  static openLink (url: string) {
    return DingTalk.execute<{}>('biz.util.openLink', { url }, () => { window.location.href = url });
  }

  /**
   * 打开应用内页面
   * @param url 内部页面名称
   * @param params 需要传递的参数，格式：&id=1&userid=10000
   */
  static open (url: string, params: string = '') {
    return DingTalk.openLink(`${window.location.origin}/${url}.html${window.location.search}${params}`)
  }

  /**
   * 设置当前页面的标题
   * @param title 控制标题文本，空字符串表示显示默认文本
   */
  static setTitle (title: string) {
    return DingTalk.execute<{}>('biz.navigation.setTitle', { title }, () => {
      document.title = title
        var iframe = document.createElement('iframe');
        iframe.style.visibility = 'hidden';
        iframe.style.width = '1px';
        iframe.style.height = '1px';
        iframe.onload = function () {
            setTimeout(function () {
                document.body.removeChild(iframe);
            }, 0);
        };
        document.body.appendChild(iframe);
    });
  }
}