interface MenuDataSubItem {
  name: string;
  path: string;
  key: string;
}

interface MenuDataItem {
  name: string;
  icon: string;
  path?: string;
  key: string;
  children?: MenuDataSubItem[];
}

interface BaseConfig {
  host: string,
  development: boolean
  menu?: MenuDataItem[]
}

declare module '*.svg'
declare module '*.png'
declare module '*.gif'
declare module '*.jpg'
declare module '*.less'
declare module '*.json'

interface Window {
  baseConfig: BaseConfig
}

interface AppStateTypes {
  load: boolean,
  width: number,
  height: number
}