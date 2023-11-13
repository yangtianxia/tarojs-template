import { reactive, toRef, type Ref } from 'vue'
import { createSelectorQuery, useReady } from '@tarojs/taro'
import { shallowMerge } from '@txjs/shared'
import { isFunction } from '@txjs/bool'

import {
  makeDOMRect,
  type DOMRect,
  type RectElement,
  type DOMRectKey,
  type SingleRectOptions
} from './utils'

function getToRefs<K extends DOMRectKey>(rect: DOMRect, refs: K[]) {
  return refs.reduce(
    (ret, key) => {
      ret[key] = toRef(rect, key)
      return ret
    }, {} as Record<K, Ref<number>>
  )
}

export const useRect = <K extends DOMRectKey>(
  element: RectElement,
  options?: SingleRectOptions<K>
) => {
  const {
    target,
    triggerCallback,
    flush = 'pre',
    refs = []
  } = options || {}
  const rect = reactive(
    makeDOMRect()
  )
  let run = false

  const triggerCallbackRun = (result: DOMRect) => {
    if (triggerCallback && !run) {
      triggerCallback(result)
      run = flush === 'pre'
    }
  }

  const triggerBoundingClientRect = (callback?: Callback<DOMRect>) => {
    const query = createSelectorQuery()
    const selectElement = isFunction(element) ? element() : element

    if (target) {
      query.in(target)
    }

    query
      .select(selectElement)
      .boundingClientRect((result: any) => {
        if (result) {
          shallowMerge(rect, result)
          triggerCallbackRun(result)
          callback?.(result)
        }
      })
      .exec()
  }

  useReady(() => triggerBoundingClientRect())

  return {
    rect,
    triggerBoundingClientRect,
    ...getToRefs(rect, refs)
  }
}

const rectCallback = (
  triggers: Function[],
  results: DOMRect[],
  callback?: Callback<DOMRect[]>
) => {
  const trigger = triggers.pop()!
  trigger((result: DOMRect) => {
    results = [...results, result]
    if (triggers.length) {
      rectCallback(triggers, results, callback)
    } else {
      callback?.(results)
    }
  })
}

export const useRectCallback = (
  triggers: (ReturnType<typeof useRect<any>> | Function)[],
  callback: Callback<DOMRect[]>
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
