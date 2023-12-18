import type { VNode } from '../_utils/types'

export type ResultCode = '500' | '404' | 'error' | 'network' | 'nodata'

export interface ResultOptions {
  status?: ResultCode
  bottom?: VNode
  title?: string | VNode
  image?: string | VNode
  desc?: string | VNode
  refresh?(): void
}

export type ResultStatus = ResultCode | ResultOptions
