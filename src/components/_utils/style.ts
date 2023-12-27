import type { CSSProperties } from 'vue'
import { isInteger, isArray, isNumeric } from '@txjs/bool'
import { useSystemInfo } from '@/hooks/system-info'

const { dpr } = useSystemInfo()

export function addUnit(input?: Numeric, unit = 'rpx') {
  if (isNumeric(input)) {
    if (unit === 'rpx') {
      input = Math.round(input * dpr)
    }
    return `${input}${unit}`
  }

  return input
}

export function getSizeStyle(originSize?: Numeric | Numeric[]): CSSProperties | undefined {
  const style = {} as CSSProperties

  if (isArray(originSize)) {
    style.width = addUnit(originSize[0])
    style.height = addUnit(originSize[1])
  } else if (isNumeric(originSize)) {
    const size = addUnit(originSize)
    style.width = size
    style.height = size
  }

  return style
}

export function getZIndexStyle(zIndex?: number | string) {
  const style = {} as CSSProperties

  if (isInteger(zIndex)) {
    style.zIndex = zIndex
  }

  return style
}
