interface BaseConfig {
  host: string,
  development: boolean
}

declare module '*.svg'
declare module '*.png'
declare module '*.gif'
declare module '*.jpg'
declare module '*.less'

interface Window {
  baseConfig: BaseConfig
}

interface AppStateTypes {
  load: boolean,
  width: number,
  height: number
}