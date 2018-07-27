import 'whatwg-fetch';
import moment from "moment"
import { IServiceInfo } from "./statement";
import { DingTalk } from '@/common/DingTalk';
import { JsonHelper } from '@/common/Utils';

/**
* 执行服务错误处理级别枚举
*/
export enum ServiceErrorLevelEnum {
    /**
     * 不处理任何异常
     */
    notHandling = 1,
    /**
     * 只处理所有请求过程中的环境异常
     */
    fail = 2,
    /**
     * 只处理所有后端反馈异常
     */
    error = 3,
    /**
     * 处理各种异常
     */
    allError = 4
}
function _toParamString(val) {
    if (val === null || val === undefined) {
        return null;
    }
    switch (typeof val) {
        case "string":
            return val;
        case "boolean":
            return val ? "true" : "false";
        case "number":
            return val.toString();
        default:
            if (moment.isDate(val)) {
                return moment(val).format("yyyy-MM-dd HH:mm:ss");
            }
            if (val.data && val.data instanceof Blob
                && typeof (val.fileName) == "string") {
                return val;
            }
            if (typeof val === "object") {
              for (var key in val) {
                typeof val[key] === "object" && (val[key] = JsonHelper.toJson(val[key]))
              }
            }
            return JsonHelper.toJson(val);
    }
}
function _ajxResultPreprocessing(response) {
    if (response.status >= 200 && response.status < 300) {
      window.baseConfig.development && console.log(response);
      return response.json();
    }
    else {
        var error = new Error(response.statusText);
        error.name = "RequestServiceException";
        error['status'] = response.status;
        throw error;
    }
}
export class Utility {
  /**
  * 异常处理.如果是"UserException"异常,则会直接弹出异常信息;否则会写入异常日志,并弹出"操作失败，请关闭重试！"
  * @param ex 异常对象
  */
  static dispose(ex) {
    if (!ex) { return; }
    switch (ex.name) {
      case "PassException":
        return;
      case "BusinessException":
        switch (ex.type) {
          case "ReferencedDataException":
            {
              var datas = ex.referencedDatas;
              if (datas.length > 5) {
                datas[5] = "等";
              }
              DingTalk.alert("被使用的数据：" + datas.join("，"), ex.message)
            }
            break;
          default:
            DingTalk.alert(ex.message)
            break;
        }
        break;
      case "SystemException":
      case "AuthorizationException":
      case "ClientDisposeException":
      case "OpenDBConnectionException":
        DingTalk.alert(ex.message)
        break;
      default:
        // Service.writeLog(ex);
        break;
    }
  }
}
export class Service {
    /**
     * 写日志
     * @param data 日志数据
     */
    static async writeLog(data) {
        // Service.executeService({
        //     name: "/anonymity/writelog",
        //     params: {
        //         data: data
        //     }
        // });
        // console.log(data);
        // window.alert(JsonHelper.toJson(data))
    }
    /**
     * 执行指定的服务
     * @param service 要执行的服务
   */
    static executeService<T>(service: IServiceInfo) {
      return new Promise<T>((resolve, rejct) => {
        let formData;
        let isFormData = false;
        let handlingErrorLevel = service.handlingErrorLevel || ServiceErrorLevelEnum.allError;
        if (service.params) {
          if (service.params instanceof FormData) {
            formData = service.params;
            isFormData = true;
          }else {
            try {
              formData = "";
              for (var key in service.params) {
                if (formData) {
                    formData += "&";
                }
                formData += key + '=' + _toParamString(service.params[key]);
              }
            }
            catch (ex) {
              if (handlingErrorLevel >= ServiceErrorLevelEnum.fail) {
                Utility.dispose(ex);
                console.error('FormData format error: ' + ex);
              } else {
                rejct(ex);
              }
            }
          }
        }
        var headers = {
          'Content-Type': 'application/x-www-form-urlencoded',
          Accept: 'application/json'
        };
        if (!isFormData) {
          headers['Content-Type'] = 'application/x-www-form-urlencoded';
        }
        return fetch(window.baseConfig.host + service.name, {
          method: "POST",
          cache: "no-cache",
          credentials: "include",
          headers: headers,
          body: formData
        }).then(_ajxResultPreprocessing).then((result) => {
            if(service.name === "/anonymity/writelog"){
              return;
            }
            var ex = result.e;
            if (ex) {
              if (ex.name === "BusinessException") {
                if (handlingErrorLevel >= ServiceErrorLevelEnum.allError) {
                  Utility.dispose(ex);
                }
              }
              else if (handlingErrorLevel >= ServiceErrorLevelEnum.allError) {
                Utility.dispose(ex);
              }
              rejct(ex);
            }
            else {
              resolve(result.data);
            }
        }).catch(ex => {
            if(service.name === "/anonymity/writelog"){
              return;
            }
            if (handlingErrorLevel >= ServiceErrorLevelEnum.fail) {
              Utility.dispose(ex);
              console.error('response.json() FormData error: ' + ex);
            }
            rejct(ex);
        });
      })
    }
}