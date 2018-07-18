import * as moment from "moment";
import 'whatwg-fetch';

/**
* 执行服务错误处理级别枚举
*/
export var ServiceErrorLevelEnum = {
    /**
     * 不处理任何异常
     */
    notHandling: 1,
    /**
     * 只处理所有请求过程中的环境异常
     */
    fail: 2,
    /**
     * 只处理所有后端反馈异常
     */
    error: 3,
    /**
     * 处理各种异常
     */
    allError: 4
}

var s_dataSources = {}
var s_controllerCache = {};

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
                && typeof (val.fileName) === "string") {
                return val;
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
        error.status = response.status;
        throw error;
    }
}

async function _getDataSource(id) {
    var idLowerCase = id.toLowerCase();
    var dataSource = s_dataSources[idLowerCase];
    if (dataSource) {
        return dataSource;
    }

    return Service.executeService({
        name: "/api/loadDataSourceConfig",
        params: {
            id: id
        }
    }).then((result) => {
        var data = {
            config: result
        };
        s_dataSources[idLowerCase] = data;
        return data;
    });
}

export class Utility {
    /**
  * 异常处理.如果是"UserException"异常,则会直接弹出异常信息;否则会写入异常日志,并弹出"操作失败，请关闭重试！"
  * @param {Error} ex 异常对象
  */
    static dispose(ex) {
        if (!ex) { return; }
        switch (ex.name) {
            case "PassException":
                return;

            case "BusinessException":
                switch (ex.type) {
                    case "ReferencedDataException":
                        var datas = ex.referencedDatas;
                        if (datas.length > 5) {
                            datas[5] = "等";
                        }
                        //Dialog.showMessageDialog(ex.message, "被使用的数据：" + datas.join("，"), DialogStatusEnum.error);
                        break;
                    default:
                        //Dialog.showMessage(ex.message, DialogStatusEnum.error);
                        break;
                }
                break;

            case "SystemException":
            case "AuthorizationException":
            case "OpenDBConnectionException":
                //Dialog.showMessage(ex.message, DialogStatusEnum.error);
                break;

            default:
                Service.writeLog(ex);
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
        Service.executeService({
            name: "/anonymity/writelog",
            params: {
                data: data
            }
        });
    }
    /**
     * 登录
     * @param {string} corpId
     * @param {string} code
     */
    static async login(corpId, code) {
        return Service.executeService({
            name: "/anonymity/login",
            params: {
                corpId: corpId,
                code: code
            }
        });
    }
    /**
     * 执行指定的服务
     * @param {IServiceInfo} service 要执行的服务
   */
    static async executeService(service) {
        let formData;
        let isFormData;
        let handlingErrorLevel = service.handlingErrorLevel || ServiceErrorLevelEnum.allError;
        if (service.params) {
            if (service.params instanceof FormData) {
                formData = service.params;
                isFormData = true;
            }
            else {
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
                    }
                    else {
                        // reject(ex);
                    }
                    return;
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
        }).then(_ajxResultPreprocessing).then(function (result) {
            if(service.name === "/anonymity/writelog"){
                return;
            }
            var ex = result.ex;
            if (ex) {
                if (ex.name === "BusinessException") {
                    if (handlingErrorLevel >= ServiceErrorLevelEnum.allError) {
                        Utility.dispose(ex);
                        return;
                    }
                }
                else if (handlingErrorLevel >= ServiceErrorLevelEnum.allError) {
                    Utility.dispose(ex);
                    return;
                }
                return ex;
            }
            else {
                return result.data;
            }
        }).catch(function (ex) {
            if(service.name === "/anonymity/writelog"){
                return;
            }
            if (handlingErrorLevel >= ServiceErrorLevelEnum.fail) {
                Utility.dispose(ex);
                return;
            }
            return ex;
        });
    }
}

/**
 * 数据源管理器
 */
export class DataSourceManager {
    /**
     * 执行指定的查询服务，获取数据
     * @param id 服务id(系统id/模块id/服务名称)
     * @param params 服务参数
     */
    static async queryData(id, params) {
        var params1;
        if(params){
            params1 = {};
            for(var key in params){
                params1[key] = _toParamString(params[key]);
            }
        }
        return Service.executeService({
            name: "/api/queryData",
            params: {
                id: id,
                params: params1
            }
        });
    }
    /**
     * 获取指定数量的有序id集合
     * @param count 要获取的数量
     */
    static async getIds(count) {
        return Service.executeService({
            name: "/api/getIds",
            params: { count: count }
        });
    }
    /**
     * 获取数据
     * @param {IDataInfo} dataInfo 要获取的数据信息
     */
    static async getData(dataInfo) {
        var id = dataInfo.id;
        if (dataInfo.pageMode) {
            id += '/' + dataInfo.pageMode;
        }
        else {
            id += "/0";
        }
        var dataSource = await _getDataSource(id);
        if (!dataSource) {
            return null;
        }
        if (dataSource.data) {
            return dataSource.data;
        }
        var params = {};
        if (dataInfo.params) {
            for (var key in dataInfo.params) {
                params[key] = _toParamString(dataInfo.params[key]);
            }
        }
        if (dataInfo.pageSize) {
            params.pageSize = dataInfo.pageSize;
        }
        if (dataInfo.pageIndex) {
            params.pageIndex = dataInfo.pageIndex;
        }

        params = {
            params: params,
            id: id,
            dataMode: dataInfo.mode
        };
        
        return Service.executeService({
            name: "/api/getData",
            params: params
        }).then((result) => {
            if (dataSource.config.cache) {
                dataSource.data = result;
            }
            return result;
        });
    }
}

/**
 * 控制器对象
 */
export class Controller {
    /**
     * 创建一个控制器
     * @param {string} id 控制器id
     * @param {string} moduleAdress 当前模块地址,格式：系统id/模块id
     */
    static async create(id, moduleAdress) {
        let fullId = moduleAdress + '/' + id;
        let controller = s_controllerCache[fullId];
        if (controller === null) { return null; }
        if (controller === undefined) {
            var result = await Service.executeService({
                name: "/api/loadController"
                , handlingErrorLevel: ServiceErrorLevelEnum.error
                , params: {
                    id: id,
                    address: moduleAdress
                }
            });

            if (result) {
                switch (result.type) {
                    case "ExecuteService":
                        controller = new ExecuteServiceController(result);
                        break;
                    default: break;
                }
                s_controllerCache[fullId] = controller;
            }
        }
        else {
            if (!controller.hasRights(moduleAdress.pageMode)) {
                return null;
            }
        }

        return controller;
    }

    constructor(initData) {
        this.initData = initData;
    }

    /**
     * 判断当前控制器是否有使用权限
     * @param {number} pageMode 当前页面模式
     */
    hasRights(pageMode) {
        return true;
    }
}

/**
* 执行服务控制器
*/
class ExecuteServiceController extends Controller {
    /**
     * 创建请求对象
     * @param args 附加参数
     */
    createRequest(args) {
        var request = { id: this.initData.id, params: {} };
        //this.page.fillServiceParams(request.params, this.initData.params, args);
        return request;
    }
    /**
     * 执行控制器
     * @param {IControllerRequest} request
     * @param {number} pageMode
     */
    async execute(request, pageMode) {
        var params;
        if (request.params) {
            params = {};
            for (var key in request.params) {
                params[key] = _toParamString(request.params[key]);
            }
        }
        return Service.executeService({
            name: "/api/executeController", params: {
                id: this.initData.id,
                address: this.initData.address + '/' + pageMode,
                params: params
            }
        });
    }
}

// export class NumberHelper{ 
//     /**
//     * 将可以表示为数值的字符串转变成数值对象
//     * @param value 字符串型数值变量
//     */
//     static parse(value) {
//     if (!value) { return 0; }
//     switch (typeof value) {
//         case "number":
//             return <number>value;
//         case "string":
//             value = (<string>value).replace(/,/g, "");
//             if ((<string>value).indexOf(".") >= 0) {
//                 return parseFloat(<string>value);
//             }
//             else {
//                 return parseInt(<string>value, 10);
//             }
//         default:
//             throw ErrorHelper.argument('value', "值必须是字符串或者数值。");
//     }
//         }
// }

