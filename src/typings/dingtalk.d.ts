declare var dd: DingtalkModule;

interface DingtalkModule {
    /**
     * 获取容器版本号
     */
    version: string;
    android: boolean;
    ios: boolean;
    sdk_version: string;
    ui: UIModule;
    biz: BizModule;
    device: DeviceModule;
    runtime: any;
    internal: any;
    util: any;
    preRelease: any;
    channel: any;
    service; any;

    ready(param: () => void): void;
    error(param: (error: ErrorMessage) => void): void;
    config(param: DingtalkConfig): void;
}

interface DeviceModule{
    notification: NotificationModule;
}

interface BizModule{
    /**
     * 导航栏设置
     */
    navigation: NavigationModule;
    util: UtilModule;
    user: UserModule;
    contact: ContactModule;
    clipboardData: ClipboardDataModule;
}

interface UIModule{
    /**
     * iOS webview弹性效果(仅iOS支持)
     */
    webViewBounce: WebViewBounceModule;
}

interface UserModule{
    get(param: userCallback) : void;
}

interface ContactModule{
    choose(param: chooseContactCallback) : void;
}

interface ClipboardDataModule{
    setData(param: setDataCallback) : void;
}

interface NotificationModule{
    /**
     * 震动
     */
    vibrate(param: vibrateCallback): void;
    /**
     * toast
     */
    toast(param: toastCallback): void;
    alert(param: alertCallback): void;
    showPreloader(param: showPreloaderCallback): void;
    hidePreloader(param: Callback): void;
    actionSheet(param: actionSheetCallback): void;
}

interface NavigationModule{
    /**
     * 设置导航栏标题
     * @param 
     */
    setTitle(param: titleCallback): void;
    setMenu(param: menuCallback): void;
}

interface UtilModule{
    /**
     * 扫描条形码、二维码
     */
    scan(param: scanCallback): void;
    /**
     * 扫描名片
     * @param data结构
     * {
     *   "ADDRESS": "深圳市南山区软件产业基地", 
     *   "COMPANY": "深圳市李乔科技有限公司", 
     *   "NAME": "李乔",
     *   "MPHONE": "861333567890",  
     *   "PHONE": "01087654321", 
     *   "POSITION": "CEO", 
     *   "IMAGE": "http://www.taobao.com/xxx.jpg", 
     *   "dt_tranfer": "BusinessCard", 
     *   "request_id": "20161206144554_efd40582d477a29df2e3bc62c260cdae"
     * }
     */
    scanCard(param: Callback): void;
    /**
     * 分享链接
     */
    share(param: shareCallback): void;
    chosen(param: chosenCallback): void;
    uploadImage(param: uploadImageCallback): void;
    previewImage(param: previewImageCallback): void;
}
interface WebViewBounceModule{
    /**
     * 启用iOS webview弹性效果(仅iOS支持) 0.0.5
     */
    enable(): void;
    /**
     * 禁用iOS webview弹性效果(仅iOS支持) 0.0.5
     */
    disable(): void;
}
interface Callback {
    /**
     * 成功回调
     */
    onSuccess: (result: any) => void;
    /**
     * 失败回调
     */
    onFail: (result: any) => void;
}
interface chooseContactCallback extends Callback{
    startWithDepartmentId: number, // -1表示打开的通讯录从自己所在部门开始展示, 0表示从企业最上层开始，(其他数字表示从该部门开始:暂时不支持)
    multiple: boolean, // 是否多选： true多选 false单选； 默认true
    users: string[], // 默认选中的用户列表，userid；成功回调中应包含该信息
    disabledUsers: string[], // 不能选中的用户列表，员工userid
    corpId: string, //企业id
    max: number, //人数限制，当multiple为true才生效，可选范围1-1500
    limitTips: string, //超过人数限制的提示语可以用这个字段自定义
    isNeedSearch: boolean, // 是否需要搜索功能
    title: string, // 如果你需要修改选人页面的title，可以在这里赋值 
    local?: boolean, // 是否显示本地联系人，默认false
    onSuccess: (result: DingtalkUserInfo[]) => void;
}
interface setDataCallback extends Callback{
    text: string;
}
interface previewImageCallback extends Callback{
    urls: string[];
    current: string;
}
interface uploadImageCallback extends Callback{
    compression: boolean; // (是否压缩，默认为true)
    multiple: boolean; // 是否多选，默认false
    max: number; // 最多可选个数
    quality: number; // 图片压缩质量
    resize: number; // 图片缩放率
    onSuccess: (result: string[]) => void;
}
interface chosenCallback extends Callback{
    source: {key: string, value: string}[];
    selectedKey: string;
}
interface alertCallback extends Callback{
    message: string;
    title: string;
    buttonName: string;
    /**
     * 成功回调
     */
    onSuccess: () => void;
}
interface actionSheetCallback extends Callback{
    title: string,
    cancelButton: string,
    otherButtons: string[],
}
interface shareCallback extends Callback{
    style: number;
    url: string;
}
interface userCallback extends Callback{
    /**
     * 成功回调
     */
    onSuccess: (result: DingtalkUser) => void;
}
interface showPreloaderCallback extends Callback{
    text: string;
    showIcon: boolean;
}
interface toastCallback extends Callback{
    /**
     * icon样式，有success和error，默认为空 0.0.2
     */
    icon?: string;
    /**
     * 提示信息
     */
    text: string;
    /**
     * 显示持续时间，单位秒，默认按系统规范[android只有两种(<=2s >2s)]
     */
    duration: number;
    /**
     * 延迟显示，单位秒，默认0
     */
    delay?: number;
}
interface vibrateCallback extends Callback{
    /**
     * 震动时间，android可配置 iOS忽略
     */
    duration?: number;
}
interface menuCallback extends Callback{
    backgroundColor : string,
    textColor : string,
    items : TitleMenuItem[],
    onSuccess : (result: {id: string}) => void,
}
interface titleCallback extends Callback{
    /**
     * 控制标题文本，空字符串表示显示默认文本
     */
    title: string;
}
interface scanCallback extends Callback{
    /**
     * type 为 all、qrCode、barCode，默认是all。
     */
    type?: string;
    /**
     * 成功回调
     * @data data结构 { 'text': String}
     */
    onSuccess: (data: {'text': string}) => void;
}
interface DingtalkConfig {
    agentId: string;
    corpId: string;
    timeStamp: string;
    nonceStr: string;
    signature: string;
    jsApiList?: string[];
}
interface DingtalkUser {
    emplId?: string;
    avatar?: string;
    corpId?: string;
    id?: string;
    rightLevel?: number;
    isAuth?: boolean;
    isManager?: boolean;
    nickName?: string;
}
interface DingtalkUserInfo {
    emplId: string;
    avatar: string;
    name: string
}
interface ErrorMessage {
    message: string;
    errorCode: string;
}
interface TitleMenuItem {
    id: string;
    iconId?: string;
    text: string;
    url?: string;
}