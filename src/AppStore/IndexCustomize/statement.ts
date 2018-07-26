import React from 'react';

export enum IndexCustomizeType {
  MicroApp,
  Url = 3
}

export interface IndexCustomizeInfo {
  class: string
  content: string
  height: number
  id: number
  left: number
  property: object
  script: string
  show: boolean
  style: React.CSSProperties
  top: number
  type: IndexCustomizeType
  width: number
}