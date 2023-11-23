import type { CSSProperties } from 'vue'
import { isNil, isInteger, isArray, isNumeric } from '@txjs/bool'
import { useSystemInfo } from '@/hooks/system-info'

const pixelRatio = Math.floor((750 / useSystemInfo().windowWidth) * 100) / 100

export function addUnit(value?: Numeric) {
  if (isNil(value)) return

  if (isNumeric(value)) {
    return `${Math.round(value * pixelRatio)}rpx`
  }

  return value
}

export function getSizeStyle(originSize?: Numeric | Numeric[]): CSSProperties | undefined {
  if (isNil(originSize)) return

  if (isArray(originSize)) {
    return {
      width: addUnit(originSize[0]),
      height: addUnit(originSize[1])
    }
  }

  const size = addUnit(originSize)

  return {
    width: size,
    height: size
  }
}

export function getZIndexStyle(zIndex?: number | string) {
  const style = {} as CSSProperties

  if (isInteger(zIndex)) {
    style.zIndex = zIndex
  }

  return style
}
