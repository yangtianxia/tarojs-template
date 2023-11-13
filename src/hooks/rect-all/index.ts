import { shallowRef } from 'vue'
import { createSelectorQuery, useReady } from '@tarojs/taro'
import { isFunction } from '@txjs/bool'

import type { RectElement, AllRectOptions  } from '../rect/utils'

function getSelectElement(elements: RectElement[]) {
  return elements
    .reduce(
      (ret, el) => {
        ret.push(isFunction(el) ? el() : el)
        return ret
      }, [] as string[]
    )
    .join(',')
}

export const useRectAll = (
  elements: RectElement[],
  options?: AllRectOptions
) => {
  const {
    target,
    triggerCallback,
    flush = 'pre'
  } = options || {}
  const rects = shallowRef<DOMRect[]>([])
  let run = false

  const triggerCallbackRun = (result: DOMRect[]) => {
    if (triggerCallback && !run) {
      triggerCallback(result)
      run = flush === 'pre'
    }
  }

  const triggerBoundingClientRect = (callback?: Callback<DOMRect[]>) => {
    const query = createSelectorQuery()
    const selectElement = getSelectElement(elements)

    if (target) {
      query.in(target)
    }

    query
      .selectAll(selectElement)
      .boundingClientRect((result: any) => {
        if (result) {
          rects.value = result
          triggerCallbackRun(result)
          callback?.(result)
        }
      })
      .exec()
  }

  useReady(() => triggerBoundingClientRect())

  return {
    rects,
    triggerBoundingClientRect
  }
}

const rectCallback = (
  triggers: Function[],
  results: DOMRect[][],
  callback?: Callback<DOMRect[][]>
) => {
  const trigger = triggers.pop()!
  trigger((result: DOMRect[]) => {
    results = [...results, result]
    if (triggers.length) {
      rectCallback(triggers, results, callback)
    } else {
      callback?.(results)
    }
  })
}

export const useRectAllCallback = (
  triggers: (ReturnType<typeof useRectAll> | Function)[],
  callback: Callback<DOMRect[][]>
) => {
  const list = triggers
    .reverse()
    .map((trigger) =>
      isFunction(trigger)
        ? trigger
        : trigger.triggerBoundingClientRect
    )
  rectCallback(list, [], callback)
}
