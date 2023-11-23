import { shallowRef } from 'vue'
import { createSelectorQuery, useReady } from '@tarojs/taro'

import { getSelectorElement } from './utils'
import type { SelectorElement, AllRectOptions  } from './types'

export type UseRectAll = ReturnType<typeof useRectAll>

function getSelectElements(elements: SelectorElement[]) {
  return elements
    .reduce(
      (ret, el) => {
        ret.push(getSelectorElement(el))
        return ret
      }, [] as string[]
    )
    .join(',')
}

export const useRectAll = (
  elements: SelectorElement[],
  options?: AllRectOptions
) => {
  const {
    target,
    useCache,
    callback,
    flush = 'pre',
    immediate = true
  } = options || {}
  const rects = shallowRef<DOMRect[]>([])
  let canRun = false
  let cached = false

  const triggerCallbackRun = (result: DOMRect[]) => {
    if (callback && !canRun) {
      callback(result)
      canRun = flush === 'pre'
    }
  }

  const boundingClientRect = (callback?: Callback<DOMRect[]>) => {
    if (useCache && cached) {
      callback?.(rects.value)
      return
    }

    const query = createSelectorQuery()
    const selectElement = getSelectElements(elements)

    if (target) {
      query.in(target)
    }

    query
      .selectAll(selectElement)
      .boundingClientRect()
      // exec兼容性更好
      .exec((results = []) => {
        const result = results[0]
        if (result) {
          cached = true
          rects.value = result
          triggerCallbackRun(result)
          callback?.(result)
        }
      })
  }

  if (immediate) {
    useReady(() => boundingClientRect())
  }

  return {
    rects,
    boundingClientRect
  }
}
