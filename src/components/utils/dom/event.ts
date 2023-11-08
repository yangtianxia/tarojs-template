import type { ITouchEvent } from '@tarojs/components'

export const stopPropagation = (event: ITouchEvent) => event.stopPropagation()

export const preventDefault = (event: ITouchEvent, isStopPropagation?: boolean) => {
  event.preventDefault()

  if (isStopPropagation) {
    stopPropagation(event)
  }
}
