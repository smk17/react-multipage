import React from 'react';

export enum IndexCustomizeType {
  MicroApp,
  Url = 3
}

export interface IndexCustomizeProperty {
  bgImage: string
  name: string
  show: boolean
  url?: string
  agentId?: string
}

export interface IndexCustomizeInfo {
  class: string
  content: string
  height: number
  id: number
  left: number
  property: IndexCustomizeProperty
  script: string
  show: boolean
  style: React.CSSProperties
  top: number
  type: IndexCustomizeType
  width: number
}

export interface InformationInfo {
  content: string
  title: string
}
