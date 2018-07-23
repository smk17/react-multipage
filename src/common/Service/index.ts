import 'whatwg-fetch';
import moment from "moment"
import { IServiceInfo } from "./statement";

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
                typeof val[key] === "object" && (val[key] = JSON.stringify(val[key]))
              }
            }
            return JSON.stringify(val);
    }
}
function _ajxResultPreprocessing(response) {
    if (response.status >= 200 && response.status < 300) {
        return response.json();
    }
    else {
        var error = new Error(response.statusText);
        error.name = "RequestServiceException";
        error['status'] = response.status;
        throw error;
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
        console.log(data);
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
                rejct(ex);
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
                  rejct(ex);
                  return;
                }
              }
              else if (handlingErrorLevel >= ServiceErrorLevelEnum.allError) {
                rejct(ex);
                return;
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
              rejct(ex);
              return;
            }
            rejct(ex);
        });
      })
    }
}