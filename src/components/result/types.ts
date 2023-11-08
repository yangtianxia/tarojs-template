import type { VueSlotVNode } from '../utils'

export type ResultCode = '500' | '404' | 'error' | 'network' | 'search' | 'nodata'

export interface ResultOption {
  status?: ResultCode
  bottom?: VueSlotVNode | null
  title?: string | VueSlotVNode | null
  image?: string | VueSlotVNode | null
  desc?: string | VueSlotVNode | null
  refresh?(): void
}

export type ResultStatusType = ResultCode | ResultOption
