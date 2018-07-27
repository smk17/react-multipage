/**
 * 工具库
 */

export class ConsoleHelper {
  static log(data) {
    if (console) {
      console.log(data);
    }
  }

  static debug(data) {
    if (console) {
      console.debug(data);
    }
  }

  static error(data) {
    if (console) {
      console.error(data);
    }
  }
}

/**
* 日志级别枚举
*/
export enum LoggerLevelEnum {
    /// <summary>
    /// 未定义
    /// </summary>
    None = 0,
    /// <summary>
    /// 一般跟踪日志
    /// </summary>
    Trace = 1,
    /// <summary>
    /// 调试
    /// </summary>
    Debug,
    /// <summary>
    /// 信息
    /// </summary>
    Info,
    /// <summary>
    /// 警告
    /// </summary>
    Warn,
    /// <summary>
    /// 错误
    /// </summary>
    Error,
    /// <summary>
    /// 崩溃
    /// </summary>
    Fatal
}

/**
* 日期部分类型
*/
export enum DatePartEnum {
    /**
        * 年
        */
    year = 1,
    /**
        * 月
        */
    month,
    /**
        * 日
        */
    day,
    /**
        * 周
        */
    week,
    /**
        * 时
        */
    hour,
    /**
        * 分
        */
    minute,
    /**
        * 秒
        */
    second,
}

/**
* 键值对类型
*/
export interface IDictionary<T> {
    [key: string]: T
}

/**
* 排序类型枚举
*/
export enum SortTypeEnum {
    /**
     * 正序
     */
    asc = 1,
    /**
     * 倒序
     */
    desc
}

/**
        * 字符串构建器
        */
export class StringBuilder {
    private _parts: string[] = [];
    /**
        * 往对象后面追加指定的文本
        * @param 要追加的文本
        * @returns 返回StringBuilder对象
        */
    append(...text: any[]): StringBuilder {
        let v;
        for (let i = 0; i < text.length; i++) {
            v = text[i];
            if (v !== null && v !== undefined) {
                if (!TypeHelper.isString(v)) { v = v.toString(); }
                this._parts.push(v);
            }
        }
        return this;
    }

    /**
        * 将指定的 String 中的格式项替换为指定的args实例的值的文本等效项，并添加到字符串缓冲对象中
        * @param format 符合格式字符串
        * @param args 要格式化的对象
        * @returns 返回StringBuilder对象
        */
    appendFormat(format: string, ...args: any[]): StringBuilder {
        this._parts.push(StringHelper.format(format, args));
        return this;
    }

    /**
        * 往对象后面追加一行指定的文本，会在最后加一个制表和换行符
        * @param text 要追加的文本，如果没有指定值，则只追加制表和换行符
        * @returns 返回StringBuilder对象
        */
    appendLine(...text: string[]): StringBuilder {
        let v;
        for (let i = 0; i < text.length; i++) {
            v = text[i];
            if (v !== null && v !== undefined) {
                if (!TypeHelper.isString(v)) { v = v.toString(); }
                this._parts.push(v);
            }
        }
        this._parts.push("\r\n");
        return this;
    }

    /**
        * 清除当前对象中的所有内容
        * @returns 返回StringBuilder对象
        */
    clear(): StringBuilder {
        this._parts = [];
        return this;
    }

    /**
        * 判断当前对象是否为空
        * @returns 如果为空则返回true，否则返回false
        */
    isEmpty() {
        if (this._parts.length === 0) { return true; }
        for (let i = this._parts.length - 1; i >= 0; i--) {
            if (this._parts[i].length > 0) { return false; }
        }
        return true;
    }

    /**
        * 返回当前对象中存储的所有字符串内容
        * @param separator 在每次添加的字符串之间要添加的分隔符
        * @returns 返回的字符串对象
        */
    toString(separator?: string): string {
        return this._parts.join(arguments.length > 0 ? separator : "");
    }
}

/**
* 用于大量Xml字符串拼接，提高拼接时的性能
*/
export class XmlWriter {
    private _sbXml = new StringBuilder();
    private _isOpen = false;
    private _isFirst = true;
    private _elements: any[] = [];

    /**
     * 创建Xml字符串写入对象
     * @param defaultNamespace 默认名字空间.不指定则表示无默认名字空间
     */
    constructor(private defaultNamespace?: string) { }

    /**
     * 写出指定的开始标记
     * @param name 节点名称
     */
    writeStartElement(name) {
        this._close();
        this._sbXml.append("<", name);
        if (this._isFirst && this.defaultNamespace) {
            this._isFirst = false;
            this._sbXml.append(" xmlns=\"");
            this._sbXml.append(EncodeHelper.encodeXmlAttrValue(this.defaultNamespace));
            this._sbXml.append("\"");
        }
        this._elements.push(name);
        this._isOpen = true;
        return this;
    }
    writeAttributeString(name, value) {
        /// <summary>
        /// 写出具有指定值的属性.Ex:InvalidOperationException(当前不存在开口节点,不能写属性!)
        /// </summary>
        /// <param name="name">属性名称</param>
        /// <param name="value" type="String|Number|Boolean|Date>对应的属性值</param>
        /// <returns type="XmlWriter" />
        if (!this._isOpen) {
            throw ErrorHelper.invalidOperation("当前不存在开口节点,不能写属性!");
        }
        this._sbXml.append(" ", name, "=\"");
        this._sbXml.append(this._getValueString(value, true));
        this._sbXml.append("\"");
        return this;
    }
    writeComment(comment) {
        /// <summary>
        /// 写出包含指定文本的注释 <!--...-->
        /// </summary>
        /// <param name="comment">注释信息</param>
        /// <returns type="XmlWriter" />
        this._close();
        this._sbXml.append("<!--", comment, "-->");
        return this;
    }
    writeCData(data) {
        /// <summary>
        /// 写出包含指定文本的 <![CDATA[...]]> 块
        /// </summary>
        /// <param name="data">数据</param>
        /// <returns type="XmlWriter" />
        this._close();
        this._sbXml.append("<![CDATA[", data.replace("]]>", "]]]]><![CDATA[>"), "]]>");
        return this;
    }
    writeText(value) {
        /// <summary>
        /// 写节点字符串值.Ex:InvalidOperationException(当前不存在没有闭合的节点,不能写节点值!)
        /// </summary>
        /// <param name="value" type="String|Number|Boolean|Date">要添加的节点文本</param>
        /// <returns type="XmlWriter" />
        if (this._elements.length === 0) {
            throw ErrorHelper.invalidOperation("当前不存在没有闭合的节点,不能写节点文本。");
        }
        this._close();
        value = this._getValueString(value);
        if (value && value.length > 500) {
            this.writeCData(value);
        }
        else {
            this._sbXml.append(EncodeHelper.encodeXmlText(value));
        }
        return this;
    }
    writeCustomeNodeString(value) {
        /// <summary>
        /// 写自定义节点字符串,本功能为高级功能,会直接拼接当前位置,不会进行任何包装和编码
        /// </summary>
        /// <param name="value" type="String">字符串</param>
        /// <returns type="XmlWriter" />
        this._close();
        this._sbXml.append(value);
        return this;
    }
    writeEndElement() {
        /// <summary>
        /// 关闭一个元素并弹出相应的命名空间范围
        /// </summary>
        /// <returns type="XmlWriter" />
        if (this._elements.length > 0) {
            this._close();
            this._sbXml.append("</", this._elements.pop(), ">");
        }
        return this;
    }
    writeNodeString(name, text) {
        /// <summary>
        /// 写出包含字符串值的节点
        /// </summary>
        /// <param name="name">节点名称</param>
        /// <param name="text">节点文本</param>
        /// <returns type="XmlWriter" />
        this._close();
        this._sbXml.append("<", name);
        if (this._isFirst && this.defaultNamespace) {
            this._isFirst = false;
            this._sbXml.append(" xmlns=\"");
            this._sbXml.append(EncodeHelper.encodeXmlAttrValue(this.defaultNamespace));
            this._sbXml.append("\"");
        }
        this._sbXml.append(">");
        this._writeText(text);
        this._sbXml.append("</", name, ">");
        return this;
    }
    toString() {
        /// <summary>返回当前对象中存储的所有XML字符串内容</summary>
        /// <returns type="String">返回的字符串对象</returns>
        if (this._isOpen) {
            throw ErrorHelper.invalidOperation("当前存在没有闭合的节点,不能输出。");
        }
        return this._sbXml.toString();
    }

    private _close() {
        if (this._isOpen) {
            this._sbXml.append(">");
            this._isOpen = false;
        }
    }
    private _getValueString(v: any, isEncode?: boolean) {
        if (v === null || v === undefined) { return ""; }
        else if (TypeHelper.isBoolean(v)) { return (v ? "true" : "false"); }
        else if (TypeHelper.isDate(v)) { return v.toString("yyyy-MM-dd HH:mm:ss"); }
        else { return (isEncode ? EncodeHelper.encodeXmlAttrValue(v.toString()) : v.toString()); }
    }
    private _writeText(v) {
        if (!TypeHelper.isString(v)) { v = v.toString(); }
        if (v.length > 200) {
            this.writeCData(v);
        }
        else {
            this._sbXml.append(EncodeHelper.encodeXmlText(v));
        }
    }
}

export class Utility {
    map(obj: any, callback: (obj: any, key?: number | string) => string): Array<string> {
        let i, result: Array<string> = [];
        if (obj) {
            if (TypeHelper.isArray(obj)) {

                for (i = 0; i < obj.length; i++) {
                    result.push(callback(obj[i], i));
                }
            }
            else {
                for (i in obj) {
                    result.push(callback(obj[i], i));
                }
            }
        }

        return result;
    }
}

/**
* Json辅助工具
* @returns
*/
export class JsonHelper {
    /**
    * 将对象序列化成json字符串
    * @param {any} data 需要进行序列化的对象
    * @returns 返回序列化后的json字符串
    */
    static toJson(data: any): string {
        if (data === null
            || data === undefined) {
            return "null";
        }

        if (data.toJSON) {
            return data.toJSON();
        }
        try {
            return JSON.stringify(data);
        } catch (error) {
            console.log(error);
            return ''
        }
        
    }

    /**
    * 将json字符串反序列化成对象
    * @param {string} json json字符串
    * @returns 返回对应的对象
    */
    static parseJson(json: string): any {
        if (json && json !== "null" && json !== "undefined") {
            try {
                return JSON.parse(json);
            } catch (error) {
                console.log(error);
                return {}
            }
        }
        return null;
    }

    /**
     * 将参数值转换到字符串形式
     * @param value 参数的原始值
     */
    static paramValueToString(value: any): string {
        if (typeof value === "string") {
            return value;
        }
        return JsonHelper.toJson(value);
    }

    /**
     * 将参数值转换到字符串形式
     * @param value 参数的原始值
     */
    static paramsValueConvertToString(paramValues: IDictionary<any>): void {
        if (!paramValues) { return; }
        let value;
        for (let key in paramValues) {
            value = paramValues[key];
            if (value === null || value === undefined) {
                delete paramValues[key];
            }
            else if (typeof value !== "string") {
                paramValues[key] = JsonHelper.toJson(value);
            }
        }
    }
}

/**
         * 编码辅助工具
         */
export class EncodeHelper {
    private static _specialCcharacter = {
        regexp: ['$', '(', ')', '*', '+', '.', '[', ']', '?', '\\', '/', '^', '{', '}']
        , xmlValue: ['&', '<', '>', '\'', '\"', '\r', '\n']
        , xmlValueTran: ["&amp;", "&lt;", "&gt;", "&apos;", "&quot;", "", ""]
        , xmlText: ['&', '<', '>']
        , xmlTextTran: ["&amp;", "&lt;", "&gt;"]
        , js: ['"', '\'', '/', '\\', '\b', '\f', '\n', '\r', '\t']
    }
    private static _regExpSC: RegExp;
    private static _xmlTextSC: RegExp;
    private static _xmlAttrSC: RegExp;

    /**
     * 对字符串进行转义成正则表达式识别的表示型式
     * @param s 要进行转义的字符串
     */
    static encodeRegExpString(s): string {
        if (!s) { return ""; }
        if (!EncodeHelper._regExpSC) {
            EncodeHelper._regExpSC = new RegExp("([\\" + EncodeHelper._specialCcharacter.regexp.join("\\") + "])", "g");
        }
        return s.replace(EncodeHelper._regExpSC, "\\$1");
    }
    /**
     * 按XML属性值格式进行编码
     * @param s 要进行编码的字符串
     */
    static encodeXmlAttrValue(s: string) {
        if (!s) { return ""; }
        if (!EncodeHelper._xmlAttrSC) {
            EncodeHelper._xmlAttrSC = new RegExp(EncodeHelper.encodeRegExpString(EncodeHelper._specialCcharacter.xmlValue.join("")), "g");
        }
        return s.replace(EncodeHelper._xmlAttrSC, EncodeHelper.s_xmlAttrReplate);
    }
    /**
     * 按XML节点文本格式进行编码
     * @param s 要进行编码的字符串
     */
    static encodeXmlText(s: string) {
        if (!s) { return s; }
        if (!EncodeHelper._xmlTextSC) {
            EncodeHelper._xmlTextSC = new RegExp(EncodeHelper.encodeRegExpString(EncodeHelper._specialCcharacter.xmlText.join("")), "g");
        }
        return s.replace(EncodeHelper._xmlTextSC, EncodeHelper.s_xmlTextReplate);
    }

    private static s_xmlAttrReplate(r: string): string {
        return EncodeHelper._specialCcharacter.xmlValueTran[EncodeHelper._specialCcharacter.xmlValue.indexOf(r)];
    }
    private static s_xmlTextReplate(r: string): string {
        return EncodeHelper._specialCcharacter.xmlTextTran[EncodeHelper._specialCcharacter.xmlText.indexOf(r)];
    }
}

export interface IDeferredExecutionOption {
    context?: any;
    data?: any;
    timeout?: number;
}

/**
 * 延迟执行辅助对象
 */
export class DeferredExecution {
    private _timeoutHandle;

    /**
     * 执行一个延迟执行回调，如果上一次回调还没有执行，则会先取消上次回调
     * @param callback 回调函数，默认为延迟0
     * @param options 延迟选项
     */
    execute(callback: Function, options?: IDeferredExecutionOption) {
        if (this._timeoutHandle) {
            clearTimeout(this._timeoutHandle);
        }

        this._timeoutHandle = setTimeout(() => {
            if (options) {
                if (options.context) {
                    callback.call(options.context, options.data);
                    this._timeoutHandle = 0;
                    return;
                }
            }
            callback();
        }, (options && options.timeout && options.timeout > 0) ? options.timeout : 0);
    }
    cancl() {
        if (this._timeoutHandle) {
            clearTimeout(this._timeoutHandle);
        }
    }
}

/**
    * 公式相关
    */
export namespace Formulas {
    interface FormulaValueInfo {
        value: string;
        nextIndex: number;
        symbolValue?: string;
    }

    /**
        * 公式所使用的数据管理对象
        */
    export class DataManager {
        private _data;
        private _addition;

        /**
            * 创建 公式所使用的数据管理对象
            * @param data 原始数据对象
            * @param addition 附加数据
            */
        constructor(data, addition) {
            this._data = data;
            if (addition) {
                this._addition = addition;
            }
        }

        /**
            * 获取指定名称对应的值
            * @param {string} name 要获取的值的名称
            * @returns 返回对应的数值型值
            */
        getValue(name: string): number {
            let val = this._data[name];
            if (val === undefined && this._addition) {
                val = this._addition[name];
            }
            return NumberHelper.parse(val);
        }
    }

    /**
        * 公式对象
        */
    export class Formula {
        private static _formulaRegular = new RegExp("([^a-zA-Z0-9]|^)data.([a-zA-Z0-9_]+)", "g");

        private static _getFormulaValue(formula, start, priority): FormulaValueInfo {
            let c, i, l = formula.length, bracketCount = 0, value = "", bracketStart = -1, valueInfo, quotation;
            for (i = start; i < l; i++) {
                c = formula.charAt(i);
                if (quotation) {
                    if (quotation === c) { quotation = null; }
                    continue;
                }
                switch (c) {
                    case "(":
                        bracketCount++;
                        if (bracketCount === 1) {
                            bracketStart = i;
                            value += formula.substring(start, i + 1);
                        }
                        break;
                    case ")":
                        bracketCount--;
                        if (bracketCount < 0) { throw ErrorHelper.create("FormulaInvalid", "当前提供的公式字符串无效。"); }
                        else if (bracketCount === 0) {
                            value += Formula._replaceSymbel(formula.substring(bracketStart + 1, i)) + ")";
                            start = i + 1;
                        }
                        break;
                    case "+":
                    case "-":
                        if (bracketCount === 0) {
                            if (start < i) { value += formula.substring(start, i); }
                            return { value: value.trim(), nextIndex: i + 1, symbolValue: c };
                        }
                        break;
                    case "*":
                    case "/":
                        if (bracketCount === 0) {
                            if (start < i) { value += formula.substring(start, i); }
                            if (priority === 1) {
                                return { value: value.trim(), nextIndex: i + 1, symbolValue: c };
                            }
                            else {
                                valueInfo = Formula._getFormulaValue(formula, i + 1, 1);
                                value = "NumberHelper.calculate(" + value.trim() + "," + valueInfo.value + ",'" + c + "')";
                                return { value: value.trim(), nextIndex: valueInfo.nextIndex, symbolValue: valueInfo.symbol };
                            }
                        }
                        break;
                    case ",":
                        if (bracketCount === 0) {
                            if (start < i) { value += formula.substring(start, i); }
                            return { value: value.trim(), nextIndex: i + 1, symbolValue: c };
                        }
                        break;
                    case '"':
                    case "'":
                        quotation = c;
                        break;
                    case " ":
                        if (start === i) {
                            start++;
                        }
                        break;
                }
            }
            if (start < l) {
                value += formula.substr(start);
            }
            return { value: value.trim(), nextIndex: l };
        }

        private static _replaceSymbel(formula) {
            formula = formula.trim();
            if (!formula) { return ""; }
            let l = formula.length, valueInfo = Formula._getFormulaValue(formula, 0, 1), symbolValue, newFormula;
            if (valueInfo.nextIndex === l) { return valueInfo.value; }
            newFormula = valueInfo.value;
            do {
                symbolValue = valueInfo.symbolValue;
                if (symbolValue === ",") {
                    return newFormula + "," + Formula._replaceSymbel(formula.substr(valueInfo.nextIndex));
                }
                else {
                    valueInfo = Formula._getFormulaValue(formula, valueInfo.nextIndex, (symbolValue === "+" || symbolValue === "-") ? 0 : 1);
                    newFormula = "NumberHelper.calculate(" + newFormula + ",";
                    newFormula += valueInfo.value + ",'" + symbolValue + "')";
                }
            }
            while (valueInfo.nextIndex < l)
            return newFormula;
        }

        private _fn: Function;
        private _partake: string[];
        /**
            * 公式对象
            * @param formula 字符串形式的公式表达式
            * @param decimal 计算后的保留位
            */
        constructor(formula: string, decimal: number = 2) {
            let partake: any[] = [];

            if (!TypeHelper.isNumber(decimal)) { decimal = 2; }
            else if (decimal < 0) { decimal = 0; }

            this._fn = new Function("data", "return NumberHelper.round("
                + Formula._replaceSymbel(formula).replace(Formula._formulaRegular, function (s, v1, v2) {
                    if (partake.indexOf(v2) < 0) { partake.push(v2); }
                    return v1 ? v1 + 'data.getValue("' + v2 + '")' : 'data.getValue("' + v2 + '")';
                }) + "," + decimal + ")");
            this._partake = partake;
        }

        /**
            * 用指定的数据进行公式计算
            * @param data 主要数据
            * @param addition 附加数据。当主要数据中不存在指定的数据时，从附加数据中获取
            * @returns 返回计算结果
            */
        calc(data, addition?: any): number {
            return this._fn(new DataManager(data, addition));
        }

        /**
            * 获取依赖信息
            */
        getPartake(): string[] {
            return this._partake;
        }
    }
}

/**
     * 环境对象
     */
export class Environment {
    private static s_data = {
        tierFadeTime: 200,
        isDebug: false,
        loggerLevel: 6,
        location: "zh-cn"
    };
    private static s_globalErrorCallback(ex) {
        if (Environment.isDebug) {
            //UI.Dialogs.error(ex.message, ErrorHelper.__printException(ex));
            ConsoleHelper.error({ message: ex.message, stack: ErrorHelper.__printException(ex) });
        }
        else {
            //UI.Dialogs.error("当前操作失败，请联系系统管理员。" + (ex.no ? "操作编号：" + ex.no : ""));
            ConsoleHelper.error("当前操作失败，请联系系统管理员。" + (ex.no ? "操作编号：" + ex.no : ""));
        }
    }

    /**
        * 初始化，由平台统一调用
        * @param data 初始数据
        */
    static initialize(data: any) {
        Environment.s_data = data;
    }

    /**
     * 弹出层淡出淡入时间
     * @returns
     */
    static get tierFadeTime() {
        return Environment.s_data.tierFadeTime;
    }

    /**
     * 当前是否为调试模式
     */
    static get isDebug() {
        return Environment.s_data.isDebug;;
    }

    /**
     * 获取写日志的级别
     */
    static get loggerLevel() {
        return Environment.s_data.loggerLevel;
    }

    /**
     * 获取当前显示的本地化信息
     */
    static get location() {
        return Environment.s_data.location;
    }

    /**
    * 写日志
    * @param loggerLevel 日志级别
    * @param logInfo 日志信息
    */
    static writeLog(loggerLevel: LoggerLevelEnum, logInfo: any) {
        if (loggerLevel >= Environment.loggerLevel) {
            if (logInfo) {
                let data: IDictionary<any> = { isException: TypeHelper.isType(logInfo, Error), loggerLevel: loggerLevel, url: window.location.href };
                if (TypeHelper.isString(logInfo)) {
                    data.message = logInfo;
                }
                else {
                    let additionData: IDictionary<any> = {}, value;
                    if (TypeHelper.isError(logInfo)) {
                        additionData["message"] = logInfo.message;
                        additionData["stack"] = logInfo.stack;
                    }
                    for (let key in logInfo) {
                        value = logInfo[key];
                        if (typeof value !== "string") {
                            value = JsonHelper.toJson(value);
                        }
                        additionData[key] = value;
                    }
                    data.additionData = additionData;
                }
                // 调用服务写日志
                //ServiceHelper.service({ type: "common", name: "log", params: { data: data } });
            }
        }
    }

    /**
     * 复位全局异常处理
     */
    static resetGlobalErrorCallback() {
        Environment.globalErrorCallback = Environment.s_globalErrorCallback;
    }

    /**
     * 处理捕获到的全局异常
     * @param ex 异常对象
     */
    static __processError(ex) {
        if (Environment.globalErrorCallback) {
            Environment.globalErrorCallback(ex);
        }
    }

    /**
     * 指定自定义的全局异常回调处理
     * @param {type} ex
     * @returns
     */
    static globalErrorCallback: (ex) => void = Environment.s_globalErrorCallback;
}

/**
     * 本地化
     */
export class Localize {

    /**
        * 将开发语言转换成本地语言
        * @param key 开发语言
        * @param args 替换参数
        * @returns 返回本地化语言
        */
    static platformTo(key: string, ...args: any[]): string {
        if (args.length > 0) {
            return StringHelper.format(key, args);
        }
        else {
            return key;
        }

        //if (!this._data) {
        //    this._loadData();
        //}
        //let s: string = this._data["platform"][key];
        //if (args.length > 0) {
        //    return StringHelper.format(s, args);
        //}
        //return s;
    }

    /**
        * 将开发语言转换成本地语言
        * @param key 开发语言
        * @param args 替换参数
        * @returns 返回本地化语言
        */
    static to(key: string, ...args: any[]): string {
        if (args.length > 0) {
            return StringHelper.format(key, args);
        }
        else {
            return key;
        }

        //if (!this._data) {
        //    this._loadData();
        //}
        //let s: string = this._data["client"][key];
        //if (args.length > 0) {
        //    return StringHelper.format(s, args);
        //}
        //return s;
    }
}

/**
    * 类型辅助工具
    */
export class TypeHelper {
    /**
        * 判断指定的值是否为数值型对象
        * @param obj 进行判断的值对象
        * @returns 如果是数值型，返回true；否则返回false。
        */
    static isNumber(obj: any): boolean {
        return typeof obj === "number";
    }

    /**
        * 判断指定的值是否为数值型对象
        * @param obj 进行判断的值对象
        * @returns 如果是数值型，返回true；否则返回false。
        */
       static isArray(obj: any): boolean {
        return require('jquery').isArray(obj);
    }

    /**
        * 判断指定变量是否为整型型
        * @param obj 进行判断的值对象
        * @returns 如果是整数型，返回true；否则返回false。
        */
    static isInteger(obj: any): boolean {
        return (typeof obj === "number") && (obj % 1 === 0);
    }

    /**
        * 判断指定变量是否为布尔型
        * @param obj 进行判断的变量
        * @returns 如果是布尔型，返回true；否则返回false。
        */
    static isBoolean(obj): boolean {
        return typeof obj === "boolean";
    }

    /**
        * 判断指定的值是否为字符串对象
        * @param obj 进行判断的值对象
        * @returns 如果是字符串型，返回true；否则返回false。
        */
    static isString(obj: any): boolean {
        return typeof obj === "string";
    }

    /**
        * 判断指定变量是否为函数或自定义类型
        * @param obj 进行判断的变量
        * @returns 如果是函数，返回true；否则返回false。
        */
    static isFunction(obj: any): boolean {
        return typeof obj === "function";
    }

    /**
        * 判断指定变量是否为日期类型
        * @param obj 进行判断的值对象
        * @returns 如果是日期型，返回true；否则返回false。
        */
    static isDate(obj: any): boolean {
        return obj && (obj.constructor === Date);
    }

    /**
        * 判断当前指定变量是否为Error类型
        * @param obj 进行判断的值对象
        * @returns 如果是Error，返回true；否则返回false。
        */
    static isError(obj: any): boolean {
        return obj && (obj.constructor === Error);
    }

    /**
     * 判断指定的对象是否由指定的类型构造
     * @param obj
     * @param type
     * @returns 如果是从指定类型构造，返回true；否则返回false。
     */
    static isType(obj: any, type: any) {
        if (obj === null || obj === undefined) { return true; }
        switch (typeof obj) {
            case "function":
                return type === Function;
            case "boolean":
                return type === Boolean;
            case "string":
                return type === String;
            case "number":
                return type === Number;
            case "symbol":
                return type === Symbol;
            default:
                return (obj instanceof type);
        }
    }

    /**
        * 判断指定的对象是否为文档元素
        * @param obj 进行判断的值对象
        * @returns 如果是Dom对象，返回true；否则返回false。
        */
    static isDomElement(obj: any): boolean {
        if (!obj) { return false; }
        let val = false;
        if (typeof (obj.nodeType) !== 'number') {
            let doc = obj.ownerDocument || obj.document || obj;
            if (doc !== obj) {
                let w = doc.defaultView || doc.parentWindow;
                val = (w !== obj);
            }
            else {
                val = !doc.body || !TypeHelper.isDomElement(doc.body);
            }
        }
        return !val;
    }

    /**
        * 深度克隆
        * @param obj
        */
    static clone(obj: any): any {
        if (obj) {
            if (obj.clone) {
                return obj.clone();
            }

            switch (typeof obj) {
                case "number":
                case "string":
                case "boolean":
                case "function":
                case "symbol":
                    return obj;
                default:
                    {
                        let result = {}, na;
                        for (na in obj) {
                            result[na] = TypeHelper.clone(obj[na]);
                        }
                        return result;
                    }
            }
        }

        return obj;
    }
}

/**
    * 字符串帮助对象
    */
export class StringHelper {
    static __format(format: string, args: any[]): string {
        let i = 0, result = '', l = format.length, open, close, argNumber, arg;
        if (arguments.length === 1) {
            return format;
        }
        while (i < l) {
            open = format.indexOf('{', i);
            close = format.indexOf('}', i);
            if (open < 0) {
                if (close < 0) {
                    result += format.slice(i);
                    break;
                }
                if (format.charAt(close + 1) !== '}') {
                    throw ErrorHelper.argument('format', "字符串格式存在孤立的'{'或'}'符号。");
                }
                result += format.substring(i, close + 1);
                i = close + 2;
                continue;
            }
            if (format.charAt(open + 1) === '{') {
                result += format.substring(i, open + 1);
                i = open + 2;
                continue;
            }
            if (close < 0) {
                throw ErrorHelper.argument('format', "字符串格式存在孤立的'{'或'}'符号。");
            }
            if (open > close) {
                if (format.charAt(close + 1) !== '}') {
                    throw ErrorHelper.argument('format', "字符串格式存在孤立的'{'或'}'符号。");
                }
                result += format.substring(i, close + 1);
                i = close + 2;
                continue;
            }
            if (open + 1 === close) {
                throw ErrorHelper.argument('format', "字符串格式存在孤立的'{'或'}'符号。");
            }
            argNumber = parseInt(format.substring(open + 1, close), 10);
            if (isNaN(argNumber)) {
                throw ErrorHelper.argument('format', "字符串格式'{'与'}'之间包含的字符不是数字。");
            }
            if (open > i) {
                result += format.substring(i, open);
            }
            arg = args[argNumber];
            if (arg !== undefined && arg !== null) {
                result += arg.toString();
            }
            i = close + 1;
        }

        return result;
    }

    /**
        * 将指定的 String 中的格式项替换为指定的args实例的值的文本等效项
        * @param format 符合格式字符串
        * @param args 要替换的参数值
        * @returns format 的一个副本，其中的第一个格式项已替换为 args 的 String 等效项
        */
    static format(format: string, ...args: any[]): string {
        return StringHelper.__format(format, args);
    }
}

/**
* 数值帮助类
*/
export class NumberHelper {
    /**
        * 将可以表示为数值的字符串转变成数值对象
        * @param value 字符串型数值变量
        */
    static parse(value: number | string): number {
        if (!value) { return 0; }
        switch (typeof value) {
            case "number":
                return <number>value;
            case "string":
                value = (<string>value).replace(/,/g, "");
                if ((<string>value).indexOf(".") >= 0) {
                    return parseFloat(<string>value);
                }
                else {
                    return parseInt(<string>value, 10);
                }
            default:
                throw ErrorHelper.argument('value', "值必须是字符串或者数值。");
        }
    }

    private static _eRegExp = /^(e)(\d*)$/i;
    private static _clearRegExp = /[^0#]/g;
    private static _zeroRegex = /(,)|([0|.]*$)/g;

    private static _isNumberFormat(format) {
        return format.indexOf("0") !== -1 || format.indexOf("#") !== -1;
    }

    private static _getNumberFormat(format) {
        if (!format) return null;
        let begin = format.indexOf("0");
        let begin2 = format.indexOf("#");
        if (begin === -1 || (begin2 !== -1 && begin2 < begin)) begin = begin2;
        if (begin < 0) { return null; }

        let end = format.lastIndexOf("0");
        let end2 = format.lastIndexOf("#");
        if (end === -1 || (end2 !== -1 && end2 > end)) end = end2;

        let digits = format.lastIndexOf(".");
        if (digits > 0) { digits = (end === end2 ? 6 : end - digits); }
        else { digits = 0; }

        return { begin: begin, end: end, digits: digits, format: format.substring(begin, end + 1) };
    }

    private static _pad(value: string, digits: number, end?: boolean) {
        let n = digits - value.length;
        if (n > 0) {
            let zeros = "";
            while (n) {
                n -= 1;
                zeros += "0";
            }
            return end ? value + zeros : zeros + value;
        }

        return value;
    }

    private static _doFormatNumber(value, format) {
        value = Math.abs(value);

        let isGroup = format.indexOf(",") !== -1,
            formats = format.split("."),
            format0 = (formats[0] || "").replace(NumberHelper._clearRegExp, ""),
            format1 = (formats[1] || "").replace(NumberHelper._clearRegExp, ""),
            result = "";

        let index = format0.indexOf("0");
        format0 = index === -1 ? "0" : (format0.substr(index) || "0");

        let decimals = format1.length;
        let decimalPlaces = format1.substr(0, format1.lastIndexOf("0") + 1).length;
        value = NumberHelper.round(value, decimals);
        let values = String(value).split("."), value0 = values[0], value1 = values[1] || "";
        if (value0) {
            value0 = NumberHelper._pad(value0, format0.length);

            if (isGroup) {
                for (let i = 0; i < Math.floor((value0.length - (1 + i)) / 3); i++) {
                    value0 = value0.substring(0, value0.length - (4 * i + 3)) + "," + value0.substring(value0.length - (4 * i + 3));
                }
            }
            result += value0;
        }

        if (decimals > 0) {
            result += ".";
            result += NumberHelper._pad(value1.substr(0, decimals), decimalPlaces, true);
        }

        return result;
    }

    /**
        * 对指定的数值型四舍五入到指定的精度范围内
        * @param value 要进行精度处理的数值
        * @param decimal 要保留的精度值(小数位).默认为0
        * @returns 返回处理后的值
        */
    static round(value: number, decimal: number = 0): number {
        if (isNaN(value)) { return 0; }
        if (!TypeHelper.isNumber(decimal)) { decimal = 0; }
        else if (decimal < 0) { decimal = 0; }
        let negative;
        if (value < 0) {
            negative = true;
            value = 0 - value;
        }
        if (decimal === 0) { value = Math.round(value); }
        else {
            let rate = Math.pow(10, decimal);
            value *= rate;
            value = Math.round(value);
            value /= rate;
        }
        return negative ? 0 - value : value;
    }

    /**
        * 对指定的数值型保留到指定的精度范围内，且不进行四舍五入
        * @param value 要进行精度处理的数值
        * @param decimal 要保留的精度值(小数位).默认为0
        * @returns 返回处理后的值
        */
    static unround(value: number, decimal: number = 0): number {
        let index;
        if (isNaN(value)) { return 0; }
        decimal = decimal || 0;
        if (value === 0) { return 0; }
        else {
            let sVal = value.toString();
            index = sVal.indexOf(".");
            if (decimal + index < sVal.length) {
                return value;
            }
            else {
                return parseFloat(sVal.substr(0, index + decimal));
            }
        }
    }

    /**
        * 对指定的2个数进行指定的算术运算
        * @param left 左操作数
        * @param right 右操作数
        * @param op 运算类型。可以是('+','-','*','/')其中的一个
        * @param decimal 要保留的小数位。可以是0－6范围内的整型，含0和6。默认为6
        * @returns 返回计算后的值
        */
    static calculate(left: number | string, right: number | string, op: string, decimal: number = 2): number {
        if (!decimal && decimal !== 0) { decimal = 6; }
        if (left) {
            if ("number" === typeof (left)) { left = left.toString(); }
            else { left = left.replace(NumberHelper._zeroRegex, ""); }
        }
        else { left = 0; }
        if (right) {
            if ("number" === typeof (right)) { right = right.toString(); }
            else { right = right.replace(NumberHelper._zeroRegex, ""); }
        }
        else { right = 0; }
        if (!left || !right) {
            switch (op) {
                case "+":
                    return NumberHelper.parse(left || right);
                case "-":
                    return left ? NumberHelper.parse(left) : 0 - NumberHelper.parse(right);
                default:
                    return 0;
            }
        }

        let index = (<string>left).indexOf("."), leftDec, rightDec, zoom, value;
        if (index > 0) { leftDec = (<string>left).length - index - 1; left = (<string>left).replace(".", ""); }
        else { leftDec = 0; }
        index = (<string>right).indexOf(".");
        if (index > 0) { rightDec = (<string>right).length - index - 1; right = (<string>right).replace(".", ""); }
        else { rightDec = 0; }

        left = parseInt(<string>left, 10);
        right = parseInt(<string>right, 10);
        if (op === "+" || op === "-") {
            // 放大到相同倍数
            zoom = leftDec - rightDec;
            if (zoom < 0) {
                left *= Math.pow(10, 0 - zoom);
                zoom = rightDec;
            }
            else if (zoom > 0) {
                right *= Math.pow(10, zoom);
                zoom = leftDec;
            }
            else {
                zoom = leftDec;
            }
            if (op === "+") { value = left + right; }
            else { value = left - right; }
            if (zoom > decimal) { value = Math.round(value / Math.pow(10, zoom - decimal)); }
            else { decimal = zoom; }
        }
        else {
            // 将各自放到到整数
            if (op === "*") {
                zoom = leftDec + rightDec;
                value = left * right;
                value = Math.round(value / Math.pow(10, zoom - decimal));
            }
            else {
                if (leftDec > (rightDec + decimal)) {
                    value = Math.round(left / right / Math.pow(10, leftDec - rightDec - decimal));
                }
                else if (leftDec < (rightDec + decimal)) {
                    value = Math.round(left * Math.pow(10, rightDec + decimal - leftDec) / right);
                }
                else {
                    value = Math.round(left / right);
                }
            }
        }

        return decimal === 0 ? value : value / Math.pow(10, decimal);
    }

    /**
        * 格式化数值对象到指定的格式
        * @param value 一个数值对象或者可以转换成数值对象的字符串
        * @param format 格式信息('#'表示可选占位符;'0'表示固定占位符;'.'表示小数点,只能出现一次;','表示千分号,且只能出现一次;其它符号只能出现在2端,如:￥#,##0.00%).特别说明虽然最后加了'%',但是不会对数值进行*100处理
        * @returns 返回格式化后的字符串形式
        */
    static format(value: number | string, format: string): string {
        if (TypeHelper.isNumber(value) === false) {
            if (!value) { return ""; }
            if (!format) { return <string>value; }
            value = NumberHelper.parse(value);
        }
        if (!format) { return value.toString(); }

        let formats = format.split(";"), isNegative = value < 0;
        format = formats[0];
        if (isNegative && formats.length >= 2) format = formats[1];
        if (value === 0 && formats.length >= 3) format = formats[2];

        let isPercent = format.indexOf("%") !== -1,
            isFormat = NumberHelper._isNumberFormat(format);
        value = isPercent ? <number>value * 100 : <number>value;

        let ms = NumberHelper._eRegExp.exec(format);
        if (ms) {
            let decimals = parseInt(ms[2], 10);
            return isNaN(decimals) ? value.toExponential() : value.toExponential(decimals);
        }

        if (!isFormat) return format;

        let result = "", nf = NumberHelper._getNumberFormat(format);
        if (nf !== null) {
            result = NumberHelper._doFormatNumber(value, nf.format);
            if (isNegative) {
                result = "-" + result;
            }
            result = format.substr(0, nf.begin) + result + format.substr(nf.end + 1);
        } else {
            result = format;
        }

        return result;
    }
}

window["NumberHelper"] = NumberHelper;

Date.prototype.toJSON = function () {
    return DateHelper.format(this, "yyyy-MM-dd HH:mm:ss");
}

/**
 * 日期格式类型枚举
 */
export enum DatetimeFormatEnum {
    /**
     * 未定义
     */
    None = 0,
    /** 
     *  年份
     */
    Year = 1,
    /** 
     *  月份
     */
    Month,
    /** 
     *  日期
     */
    Date,
    /** 
     *  日期时间
     */
    Datetime,
    /** 
     *  时间
     */
    Time
}

/**
* 日期帮助类
*/
export class DateHelper {
    private static _dateFormatExp = /^([0-9]{4})([0-9]{2})([0-9]{2})$/;
    private static _dateFormatExp2 = /^([0-9]{4}).([0-9]*)$/;
    private static _dateFormatExp3 = /^\d+(\.\d+)?$/;
    private static _isoDateFormatExp = /^([0-9]{4})([-\/]([0-9]{1,2})([-\/]([0-9]{1,2})([T ]([0-9]{1,2}):([0-9]{1,2})(:([0-9]{1,2})(\.([0-9]+))?)?(Z|(([-+])([0-9]{2})(:?([0-9]{2}))?))?)?)?)?$/;
    private static _isoDateFormatExp2 = /^([0-9]{4})[-\/]([0-9]{2})[-\/]([0-9]{2})[T ]([0-9]{1,2})/;
    private static _isoDateFormatExp3 = /^([0-9]{4}).([0-9]*)/;
    private static _isoDateFormatExp4 = /^([0-9]{4}).([0-9]*).([0-9]*)/;
    private static _isoDateFormatExp5 = /^([0-9]{2})-([0-9]{2})-([0-9]{4})$/;

    static _fixDate(d: Date, check: Date) {
        if (+d) {
            while (d.getDate() !== check.getDate()) {
                d.setTime(+d + (d < check ? 1 : -1) * 3600000);
            }
        }
    }

    static parseISO8601(value: string): Date | null {
        let m = value.match(DateHelper._isoDateFormatExp);
        if (!m) {

            m = value.match(DateHelper._isoDateFormatExp2);
            if (m) {
                let date = new Date(parseInt(m[1], 10), parseInt(m[2], 10) - 1, parseInt(m[3], 10), parseInt(m[4], 10));
                return date;
            }

            m = value.match(DateHelper._isoDateFormatExp3);
            if (m) {
                let date = new Date(parseInt(m[1], 10), parseInt(m[2], 10) - 1);
                return date;
            }

            m = value.match(DateHelper._isoDateFormatExp4);
            if (m) {
                let date = new Date(parseInt(m[1], 10), parseInt(m[2], 10) - 1, parseInt(m[3], 10));
                return date;
            }

            m = value.match(DateHelper._isoDateFormatExp5);
            if (!m) return null;
            else {
                let date = new Date(parseInt(m[3], 10), parseInt(m[1], 10) - 1, parseInt(m[2], 10));
                return date;
            }
        }
        let num = parseInt(m[1], 10);
        let date = new Date(num, 0, 1);
        if (!m[14]) {
            let check = new Date(num, 0, 1, 9, 0);
            if (m[3]) {
                num = parseInt(m[3], 10);
                date.setMonth(num - 1);
                check.setMonth(num - 1);
            }
            if (m[5]) {
                num = parseInt(m[5], 10);
                date.setDate(num);
                check.setDate(num);
            }
            DateHelper._fixDate(date, check);
            if (m[7]) {
                date.setHours(parseInt(m[7], 10));
            }
            if (m[8]) {
                date.setMinutes(parseInt(m[8], 10));
            }
            if (m[10]) {
                date.setSeconds(parseInt(m[10], 10));
            }
            if (m[12]) {
                date.setMilliseconds(Number("0." + m[12]) * 1000);
            }
            DateHelper._fixDate(date, check);
        } else {
            num = parseInt(m[3], 10);
            date.setUTCFullYear(
                parseInt(m[1], 10),
                num ? num - 1 : 0,
                parseInt(m[5], 10) || 1
            );
            date.setUTCHours(
                parseInt(m[7], 10) || 0,
                parseInt(m[8], 10) || 0,
                parseInt(m[10], 10) || 0,
                parseInt(m[12], 10) ? Number("0." + m[12]) * 1000 : 0
            );
            num = parseInt(m[18], 10);
            let offset = parseInt(m[16], 10) * 60 + (num ? num : 0);
            offset *= m[15] === '-' ? 1 : -1;
            date = new Date(+date + (offset * 60 * 1000));
        }
        return date;
    }

    /**
        * 将一个日期字符串转换成一个日期对象
        * @param value 受支持的日期字符串，格式为：yyyy-MM-dd HH:mm:ss
        * @returns 一个日期对象
        */
    static parse(value: Date | number | string): Date| null {
        if (!value) { return null; }
        let d: Date;
        switch (typeof value) {
            case "number":
                d = new Date(<number>value * 1000);
                if (d.getTime() !== value) { return null; }
                return d;
            case "string":
                let m = (<string>value).match(DateHelper._dateFormatExp);
                if (m) {
                    let date = new Date(parseInt(m[1], 10), parseInt(m[2], 10) - 1, parseInt(m[3]));
                    return date;
                }

                m = (<string>value).match(DateHelper._dateFormatExp2);
                if (m) {
                    let date = new Date(parseInt(m[1], 10), parseInt(m[2], 10) - 1);
                    return date;
                }

                if ((<string>value).match(DateHelper._dateFormatExp3)) {
                    let num = parseInt(<string>value, 10);
                    d = new Date(num * 1000);
                    if (d.getTime() !== num) { return null; }
                    return d;
                }
                return DateHelper.parseISO8601(<string>value) || (value ? new Date(<string>value) : null);
            default:
                if ((<Date>value).getFullYear) { return <Date>value; }
                return null;
        }
    }

    /**
    * 格式化日期对象
    * @param date 日期对象
    * @param format 格式
    * @returns 返回格式化后的字符串
    */
    static format(date: Date | number | string | null, format: string = "yyyy-MM-dd"): string {
        if (!date) { return ""; }
        switch (typeof (date)) {
            case "string":
                date = DateHelper.parse(date);
                break;
            case "number":
                let newDate = new Date(<number>date * 1000);
                if (newDate.getTime() !== <number>date) { return ""; }
                break;
            case "object":
                if (!(<Date>date).getFullYear) { return <string>date; }
                break;
            default:
                return <string>date;
        }

        let year = (<Date>date).getFullYear();
        let month = (<Date>date).getMonth();
        let day = (<Date>date).getDate();
        let strMonth: string, strDay: string, strHours: string, strMinutes: string, strMilliseconds: string;

        switch (format) {
            case "yyyy-MM-dd":
            case "yyyy-mm-dd":
                strMonth = (month + 1).toString();
                if (strMonth.length === 1) { strMonth = '0' + strMonth; }
                strDay = day.toString();
                if (strDay.length === 1) { strDay = '0' + strDay; }
                return year + "-" + strMonth + "-" + strDay;
            
            case "MM-dd":
            case "mm-dd":
                strMonth = (month + 1).toString();
                if (strMonth.length === 1) { strMonth = '0' + strMonth; }
                strDay = day.toString();
                if (strDay.length === 1) { strDay = '0' + strDay; }
                return strMonth + "-" + strDay;

            case "yyyy-MM-dd HH:mm":
            case "yyyy-mm-dd hh:ii":
                strMonth = (month + 1).toString();
                if (strMonth.length === 1) { strMonth = '0' + strMonth; }
                strDay = day.toString();
                if (strDay.length === 1) { strDay = '0' + strDay; }
                strHours = (<Date>date).getHours().toString();
                if (strHours.length === 1) { strHours = '0' + strHours; }
                strMinutes = (<Date>date).getMinutes().toString();
                if (strMinutes.length === 1) { strMinutes = '0' + strMinutes; }
                return year + "-" + strMonth + "-" + strDay + " " + strHours + ":" + strMinutes;

            case "yyyy-MM":
            case "yyyy-mm":
                strMonth = (month + 1).toString();
                if (strMonth.length === 1) { strMonth = '0' + strMonth; }
                return year + "-" + strMonth;

            case "yyyy":
                return year.toString();

            case "HH:mm:ss":
            case "hh:ii:ss":
                strHours = (<Date>date).getHours().toString();
                if (strHours.length === 1) { strHours = '0' + strHours; }
                strMinutes = (<Date>date).getMinutes().toString();
                if (strMinutes.length === 1) { strMinutes = '0' + strMinutes; }
                strMilliseconds = (<Date>date).getSeconds().toString();
                if (strMilliseconds.length === 1) { strMilliseconds = '0' + strMilliseconds; }
                return strHours + ":" + strMinutes + ":" + strMilliseconds;

            case "MM-dd HH:mm:ss":
            case "mm-dd hh:ii:ss":
                strMonth = (month + 1).toString();
                if (strMonth.length === 1) { strMonth = '0' + strMonth; }
                strDay = day.toString();
                if (strDay.length === 1) { strDay = '0' + strDay; }
                strHours = (<Date>date).getHours().toString();
                if (strHours.length === 1) { strHours = '0' + strHours; }
                strMinutes = (<Date>date).getMinutes().toString();
                if (strMinutes.length === 1) { strMinutes = '0' + strMinutes; }
                strMilliseconds = (<Date>date).getSeconds().toString();
                if (strMilliseconds.length === 1) { strMilliseconds = '0' + strMilliseconds; }
                return strMonth + "-" + strDay + " " + strHours + ":" + strMinutes + ":" + strMilliseconds;

            case "yyyy-MM-dd HH:mm:ss":
            case "yyyy-mm-dd hh:ii:ss":
                strMonth = (month + 1).toString();
                if (strMonth.length === 1) { strMonth = '0' + strMonth; }
                strDay = day.toString();
                if (strDay.length === 1) { strDay = '0' + strDay; }
                strHours = (<Date>date).getHours().toString();
                if (strHours.length === 1) { strHours = '0' + strHours; }
                strMinutes = (<Date>date).getMinutes().toString();
                if (strMinutes.length === 1) { strMinutes = '0' + strMinutes; }
                strMilliseconds = (<Date>date).getSeconds().toString();
                if (strMilliseconds.length === 1) { strMilliseconds = '0' + strMilliseconds; }
                return year + "-" + strMonth + "-" + strDay + " " + strHours + ":" + strMinutes + ":" + strMilliseconds;
            
            case "yyyy/MM/dd HH:mm:ss":
            case "yyyy/mm/dd hh:ii:ss":
                strMonth = (month + 1).toString();
                if (strMonth.length === 1) { strMonth = '0' + strMonth; }
                strDay = day.toString();
                if (strDay.length === 1) { strDay = '0' + strDay; }
                strHours = (<Date>date).getHours().toString();
                if (strHours.length === 1) { strHours = '0' + strHours; }
                strMinutes = (<Date>date).getMinutes().toString();
                if (strMinutes.length === 1) { strMinutes = '0' + strMinutes; }
                strMilliseconds = (<Date>date).getSeconds().toString();
                if (strMilliseconds.length === 1) { strMilliseconds = '0' + strMilliseconds; }
                return year + "/" + strMonth + "/" + strDay + " " + strHours + ":" + strMinutes + ":" + strMilliseconds;

            case "MM/dd HH:mm":
            case "mm/dd hh:ii":
                strMonth = (month + 1).toString();
                if (strMonth.length === 1) { strMonth = '0' + strMonth; }
                strDay = day.toString();
                if (strDay.length === 1) { strDay = '0' + strDay; }
                strHours = (<Date>date).getHours().toString();
                if (strHours.length === 1) { strHours = '0' + strHours; }
                strMinutes = (<Date>date).getMinutes().toString();
                if (strMinutes.length === 1) { strMinutes = '0' + strMinutes; }
                strMilliseconds = (<Date>date).getSeconds().toString();
                if (strMilliseconds.length === 1) { strMilliseconds = '0' + strMilliseconds; }
                return strMonth + "/" + strDay + " " + strHours + ":" + strMinutes;
        }
        return ''
    }

    /**
     * 格式化日期对象，判断是否是今年，返回对应字符串
     */
    static formatDate(value: Date | number | string) {
        if (!value) return value
        value = value.toString()
        value = value.replace(/-/g, '/')
        const now = new Date()
        let time = new Date(value)
        let timeStr = DateHelper.format(time, 'MM-dd')
        if (time.getFullYear() !== now.getFullYear()) {
            timeStr = DateHelper.format(time, 'yyyy-MM-dd')
        }
        return timeStr
    }

    static formatDateTime(value: Date | number | string) {
        if (!value) return value
        value = value.toString()
        value = value.replace(/-/g, '/')
        const now = new Date()
        let time = new Date(value)
        const gap = Number(now) - Number(time)
        let timeStr = '刚刚'
        if (gap < 60 * 1000) {
            timeStr = '刚刚'
        } else if (60 * 1000 <= gap && gap < 60 * 60 * 1000) {
            timeStr = Math.ceil(gap / (60 * 1000)) + '分钟前'
        } else if (60 * 60 * 1000 <= gap && gap < 24 * 60 * 60 * 1000) {
            timeStr = Math.ceil(gap / (60 * 60 * 1000)) + '小时前'
        } else if (time.getFullYear() < now.getFullYear()) {
            timeStr = DateHelper.format(time, 'yyyy-MM-dd HH:mm:ss')
        } else if (time.getDate() === now.getDate() && time.getMonth() === now.getMonth()) {
            timeStr = DateHelper.format(time, 'HH:mm:ss')
        } else {
            timeStr = DateHelper.format(time, 'MM-dd HH:mm:ss')
        }
        return timeStr
    }

    /**
    * 计算两个日期之间的间隔
    * @param left 左值
    * @param right 右值
    * @param datepart 计算类型
    * @returns 返回间隔数
    */
    static diff(left: Date | string | number, right: Date | string | number, datepart: DatePartEnum): number {
        let leftDate = DateHelper.parse(left), rightDate = DateHelper.parse(right);
        if (!leftDate) { throw ErrorHelper.argumentNull("left", "参数值必须是一个日期对象或者是一个可以转换成日期对象的数值或字符串。"); }
        if (!rightDate) { throw ErrorHelper.argumentNull("right", "参数值必须是一个日期对象或者是一个可以转换成日期对象的数值或字符串。"); }

        switch (datepart) {
            case DatePartEnum.year:
                return rightDate.getFullYear() - leftDate.getFullYear();
            case DatePartEnum.month:
                return (rightDate.getFullYear() - leftDate.getFullYear()) * 12 + rightDate.getMonth() - leftDate.getMonth();
            default:
                {
                    let interval = (rightDate.getTime() - leftDate.getTime()) / 1000; //相差秒
                    switch (datepart) {
                        case DatePartEnum.week:
                            interval = interval / 60 / 60 / 24 / 7;
                            break;
                        case DatePartEnum.day:
                            interval = interval / 60 / 60 / 24;
                            break;
                        case DatePartEnum.hour:
                            interval = interval / 60 / 60;
                            break;
                        case DatePartEnum.minute:
                            interval = interval / 60;
                            break;
                    }
                    return NumberHelper.unround(interval);
                }
        }
    }

    /**
    * 在日期中添加或减去指定的时间间隔
    * @param date 要进行处理的日期对象或可以转换成日期的字符串
    * @param datepart 计算类型
    * @param interval 间隔
    * @returns 返回日期对象
    */
    static add(value: Date | string | number, datepart: DatePartEnum, interval: number) {
        let date = DateHelper.parse(value);
        if (!date) { throw ErrorHelper.argumentNull("left", "参数值必须是一个日期对象或者是一个可以转换成日期对象的数值或字符串。"); }

        switch (datepart) {
            case DatePartEnum.year: return new Date(date.getFullYear() + interval, date.getMonth(), date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds());
            case DatePartEnum.month: return new Date(date.getFullYear(), date.getMonth() + interval, date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds());
            case DatePartEnum.day: return new Date(date.getTime() + 86400000 * interval);
            case DatePartEnum.week: return new Date(date.getTime() + 604800000 * interval);
            case DatePartEnum.hour: return new Date(date.getTime() + 3600000 * interval);
            case DatePartEnum.minute: return new Date(date.getTime() + 60000 * interval);
            case DatePartEnum.second: return new Date(date.getTime() + 1000 * interval);
        }
        return null;
    }
}

/**
        * 异常错误对象
        */
export class ErrorHelper {
    private static __printExceptionTo(e: Error, sb: StringBuilder) {
        /// <summary>
        /// 打印异常信息
        /// </summary>
        /// <param name="e">服务端异常对象</param>
        sb.appendLine("异常类型：", e.name).appendLine("异常消息：", e.message);
        if (e.stack) {
            sb.appendLine("堆栈信息：").appendLine(e.stack);
        }
        if (e['data']) {
            sb.appendLine("异常数据：").appendLine(JsonHelper.toJson(e['data']));
        }
        if (e['innerException']) {
            sb.append("内部异常：");
            ErrorHelper.__printExceptionTo(e['innerException'], sb);
        }
    }

    static __printException(e: Error) {
        /// <summary>
        /// 打印异常信息
        /// </summary>
        /// <param name="e">服务端异常对象</param>
        if (e.name === "BusinessException") { return e.message; }
        let sb = new StringBuilder();
        ErrorHelper.__printExceptionTo(e, sb);
        return sb.toString();
    }

    /**
        * 创建参数异常对象
        * @param kind 参数异常类型
        * @param paramName 参数名称
        * @param message 异常消息
        * @returns 返回Error对象
        */
    private static _errorArgument(kind, paramName, message): Error {
        /// <summary>创建参数异常对象</summary>
        /// <param name="kind" type="String">参数异常类型</param>
        /// <param name="paramName" type="String" mayBeNull="true" optional="true">参数名称</param>
        /// <param name="message" type="String" mayBeNull="true" optional="true">异常消息</param>
        /// <returns type="Error">返回Error对象</returns>
        let name = "Argument" + kind + "Exception";
        if (paramName) {
            message += "\n" + Localize.to("参数名：{0}。", paramName);
        }
        return ErrorHelper.create(name, message, '', null, { paramName: paramName });
    }

    /**
        * 创建异常对象
        * @param kind 异常类型
        * @param message 异常消息
        * @returns 返回Error对象
        */
    private static _error(kind, message) {
        return ErrorHelper.create(kind + "Exception", message, '');
    }

    /**
        * 创建一个Error对象
        * @param name 异常名称
        * @param message 错误消息
        * @param stack 堆栈信息
        * @param innerException 内部错误对象
        * @param data 错误的具体信息.默认为null
        * @returns 返回Error对象
        */
    static create(name: string, message: string, stack?: string, innerException?: any, data?: any): Error {
        let err = new Error();
        err.name = name;
        err.message = message;
        if (stack) { err.stack = stack; }
        if (innerException) { err['innerException'] = innerException; }
        if (data) { err['data'] = data; }
        return err;
    }

    /**
        * 创建一个参数错误异常
        * @param paramName 参数名称
        * @param message 异常消息
        * @returns 返回一个ArgumentException异常对象
        */
    static argument(paramName: string, message?: string): Error {
        return ErrorHelper._errorArgument("", paramName, message || "值并不在预期的范围内。");
    }

    /**
        * 创建一个空值参数异常对象
        * @param paramName 参数名称
        * @param message 异常消息
        * @returns 返回一个ArgumentNullException异常对象
        */
    static argumentNull(paramName: string, message?: string): Error {
        return ErrorHelper._errorArgument("Null", paramName, message || "值不能为null。");
    }

    /**
        * 创建一个参数值超出运行范围的异常对象
        * @param paramName 参数名称
        * @param actualValue 该参数的实际值.默认为null
        * @param message 异常具体消息
        * @returns 返回一个ArgumentOutOfRangeException异常对
        */
    static argumentOutOfRange(paramName: string, actualValue?: any, message?: string): Error {
        let displayMessage = (message || "值在有效范围之外。");
        if (paramName) {
            displayMessage += "\n" + StringHelper.format("参数名：{0}。", paramName);
        }
        if (typeof (actualValue) !== "undefined" && actualValue !== null) {
            displayMessage += "\n" + StringHelper.format("实际值是：{0}。", actualValue);
        }
        return ErrorHelper.create("ArgumentOutOfRangeException"
            , displayMessage
            , ''
            , null
            , { paramName: paramName, actualValue: actualValue });
    }

    /**
        * 创建一个参数未定义的异常
        * @param paramName 参数名称
        * @param message 错误的消息
        * @returns 返回一个ArgumentUndefinedException异常对象
        */
    static argumentUndefined(paramName: string, message?: string): Error {
        return ErrorHelper._errorArgument("Undefined", paramName, message || "值不能为未定义。");
    }

    /**
        * 创建一个格式错误的异常
        * @param message 错误的消息
        * @returns 返回一个FormatException异常对象
        */
    static format(message?: string): Error {
        return ErrorHelper._error("Format", message || "一个无效的格式。");
    }

    /**
        * 创建无效操作异常
        * @param message 错误的消息
        * @returns 返回一个InvalidOperationException异常对象
        */
    static invalidOperation(message?: string): Error {
        return ErrorHelper._error("InvalidOperation", message || "一个无效的操作。");
    }

    /**
        * 创建一个没有实现的异常
        * @param message 错误的消息
        * @returns 返回一个NotImplementedException异常对象
        */
    static notImplemented(message?: string): Error {
        return ErrorHelper._error("NotImplemented", message || "当前方法或操作没有实现。");
    }

    /**
        * 创建一个没有实现的异常
        * @param message 错误的消息
        * @returns 返回一个NotImplementedException异常对象
        */
    static notSupported(message?: string): Error {
        return ErrorHelper._error("NotSupported", message || "不支持当前操作。");
    }

    /**
        * 创建一个参数个数异常
        * @param message 错误的消息
        * @returns 返回一个ParameterCountException异常对象
        */
    static parameterCount(message?: string): Error {
        return ErrorHelper._error("ParameterCount", message || "参数个数不匹配。");
    }

    /**
        * 创建一个配置异常
        * @param message 错误的消息
        * @returns 返回一个ConfigException异常对象
        */
    static configException(message?: string): Error {
        return ErrorHelper._error("Config", message || "配置异常。");
    }

    /**
        * 创建一个配置异常
        * @returns 返回一个SystemException异常对象
        */
    static systemException(message?: string): Error {
        return ErrorHelper._error("System", message || "操作失败，请联系系统管理员！");
    }

    /**
        * 创建一个用户提示异常
        * @returns 返回一个UserException异常对象
        */
    static userException(message: string): Error {
        return ErrorHelper._error("User", message);
    }

    /**
        * 创建一个忽略后续操作异常
        * @returns 返回一个PassException异常对象
        */
    static passException(): Error {
        return ErrorHelper._error("Pass", "用于终止后面的操作。");
    }

    /**
        * 判断一个异常对象是否为一个pass异常
        * @param ex 需要判断的异常
        */
    static isPassException(ex: Error): boolean {
        return (ex && ex.constructor === Error && ex.name === "PassException");
    }

    /**
        * 捕获所有的异常,并抛出pass异常
        * @param ex 需要捕获的异常
        */
    static disposeThrowPass(ex: Error) {
        if (ex.name === "PassException") {
            throw ex;
        }
        ErrorHelper.dispose(ex);
        throw ErrorHelper.passException();
    }

    /**
        * 异常处理.如果是"UserException"异常,则会直接弹出异常信息;否则会写入异常日志,并弹出"操作失败，请关闭重试！"
        * @param ex 异常对象
        */
    static dispose(ex: Error) {
        if (!ex) { return; }
        switch (ex.name) {
            case "PassException":
                return;

            case "BusinessException":
            case "UserException":
                switch ((<any>ex).type) {
                    case "ReferencedDataException":
                        {
                            let datas = (<any>ex).referencedDatas;
                            if (datas.length > 5) {
                                datas[5] = "等";
                            }
                            ConsoleHelper.error(ex.message + "-被使用的数据：" + datas.join("，"));
                        }
                        break;
                    default:
                        //UI.Dialogs.warn(ex.message);
                        ConsoleHelper.log(ex.message);
                        break;
                }
                break;

            case "ClientDisposeException":
                //UI.Dialogs.warn(ex.message);
                ConsoleHelper.log(ex.message);
                if (ex["logout"]) {
                    window.location.href = "/commonPage/login";
                }
                break;

            case "SystemException":
            case "AuthorizationException":
            case "OpenDBConnectionException":
                //UI.Dialogs.error(ex.message);
                ConsoleHelper.error(ex.message);
                break;

            case "Exception":
                Environment.__processError(ex);
                break;

            default:
                Environment.writeLog(LoggerLevelEnum.Error, ex);
                Environment.__processError(ex);
                break;
        }
    }
}
