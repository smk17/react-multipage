export interface StorageSetParams {
  /** 存储信息的key值 */
  name: string,
  /** 存储信息的Value值 */
  value: string
}

export interface PickerResult {
  /** 返回选择的文本 */
  key: string,
  /** 返回选择的值 */
  value: string
}

export interface PickerParams {
  source: PickerResult[],
  selectedKey: string
}

export interface AlertParams {
  /** 消息内容 */
  message: string
  /** 弹窗标题 */
  title?: string
  /** 按钮名称 */
  buttonName?: string
}

export interface DatePickerParams {
  /** format只支持android系统规范，即2015-03-31格式为yyyy-MM-dd */
  format: string
  /** 默认显示日期 */
  value: string
}

export interface LocateMapParams {
  /** 非必须字段，需要和longitude组合成合法经纬度，高德坐标 */
  latitude?: number,
  /** 非必须字段，需要和latitude组合成合法经纬度，高德坐标 */
  longitude?: number
}

export interface SearchMapParams extends LocateMapParams{
  /** 搜索范围，建议不要设置过低，否则可能搜索不到POI */
  scope: number
}

export interface ViewMapParams {
  /** 需要和longitude组合成合法经纬度，高德坐标 */
  latitude: number,
  /** 需要和latitude组合成合法经纬度，高德坐标 */
  longitude: number
  /**
   * 地址/POI名称
   * 在地图锚点气泡显示的文案
   */
  title: string
}

export interface GeolocationGetParams {
  /**
   * 期望定位精度半径（单位米），定位结果尽量满足该参数要求，但是不一定能保证小于该误差，开发者需要读取返回结果的 accuracy 字段校验坐标精度；
   * 建议按照业务需求设置定位精度，推荐采用200m，可获得较好的精度和较短的响应时长；
   */
  targetAccuracy: number,
  /**
   * 1：获取高德坐标， 0：获取标准坐标；推荐使用高德坐标；标准坐标没有address字段
   */
  coordinate: 1 | 0,
  /**
   * 是否需要带有逆地理编码信息；该功能需要网络请求，请更具自己的业务场景使用
   */
  withReGeocode: boolean,
  /**
   * 是否缓存地理位置信息。默认是true。如果true，客户端会对定位的地理位置信息缓存，在缓存期内（2分钟）再次定位会返回旧的定位
   */
  useCache?: boolean
}

export interface GeolocationStartParams {
  /**
   * 期望定位精度半径（单位米），定位结果尽量满足该参数要求，但是不一定能保证小于该误差，开发者需要读取返回结果的 accuracy 字段校验坐标精度；
   * 建议按照业务需求设置定位精度，推荐采用200m，可获得较好的精度和较短的响应时长；
   */
  targetAccuracy: number,
  /**
   * 是否需要带有逆地理编码信息；该功能需要网络请求，请更具自己的业务场景使用
   */
  withReGeocode: boolean,
  /**
   * 是否缓存地理位置信息。默认是true。如果true，客户端会对定位的地理位置信息缓存，在缓存期内（2分钟）再次定位会返回旧的定位
   */
  useCache?: boolean
  /** iOS端位置变更敏感度，单位为m，此值会影响iOS端callback回调速率 */
  iOSDistanceFilter: number,
  /** 数据回传最小时间间隔，单位ms */
  callBackInterval: number,
  /** 定位场景id，对于同一id的，不可连续start，否则会报错。不同scenceId的互不影响 */
  sceneId: string
}

export interface GeolocationResult  {
  location?: GeolocationResult,
  /** 经度 */
  longitude : number,
  /** 纬度 */
  latitude : number,
  /** 实际的定位精度半径（单位米） */
  accuracy : number,
  /** 格式化地址，如：北京市朝阳区南磨房镇北京国家广告产业园区 */
  address : string,
  /** 省份，如：北京市 */
  province : string,
  /** 城市，直辖市会返回空 */
  city : string,
  /** 行政区，如：朝阳区 */
  district : string,
  /** 街道，如：西大望路甲12-2号楼 */
  road : string,
  /** 当前设备网络类型，如：wifi、3g等 */
  netType : string,
  /** 当前设备使用移动运营商，如：CMCC等 */
  operatorType : string,
  /** 对错误码的描述 */
  errorMessage : string,
  /** 错误码；若errorCode=13，表示持续定位已开启，非业务异常，不影响正常使用 */
  errorCode : number,
  /** 仅Android支持，wifi设置是否开启，不保证已连接上 */
  isWifiEnabled : boolean,
  /** 仅Android支持，gps设置是否开启，不保证已经连接上 */
  isGpsEnabled : boolean,
  /** 仅Android支持，定位返回的经纬度是否是模拟的结果 */
  isFromMock : boolean,
  /** 仅Android支持，我们使用的是混合定位，具体定位提供者有wifi/lbs/gps" 这三种 */
  provider : 'wifi'|'lbs'|'gps',
  /** 仅Android支持，移动网络是设置是否开启，不保证已经连接上 */
  isMobileEnabled : boolean
}

export interface MapPOIResult {
  /** POI所在省会 */
  province: string,
  /** POI所在省会编码 */
  provinceCode: string,
  /** POI所在城市 */
  city: string,
  /** POI所在城市 */
  cityCode: string,
  /** POI所在区名称 */
  adName: string,
  /** POI所在区编码 */
  adCode: string,
  /** POI与设备位置的距离 */
  distance: string,
  /** POI的邮编 */
  postCode: string,
  /** POI的街道地址 */
  snippet: string,
  /** POI的名称 */
  title: string,
  /** POI的纬度 */
  latitude: number,
  /** POI的经度 */
  longitude: number,
}