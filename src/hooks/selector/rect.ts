import debounce from 'debounce'
import { reactive, toRef, type Ref, onUnmounted } from 'vue'
import { createSelectorQuery, useReady, useUnload } from '@tarojs/taro'
import { shallowMerge } from '@txjs/shared'
import { isString, notNil } from '@txjs/bool'

import { makeDOMRect, getSelectorElement, type DOMRect } from './utils'
import type { SelectorElement, SingleRectOptions } from './types'

type DOMRectKey = keyof DOMRect

export type UseRect = ReturnType<typeof useRect>

function getToRefs<K extends DOMRectKey>(rect: DOMRect, refs: K[]) {
  return refs.reduce(
    (ret, key) => {
      ret[key] = toRef(rect, key)
      return ret
    }, {} as Record<K, Ref<number>>
  )
}

export const useRect = <K extends DOMRectKey>(
  element: SelectorElement,
  options?: SingleRectOptions<K>
) => {
  const {
    target,
    observe,
    useCache,
    callback,
    flush = 'pre',
    immediate = true,
    refs = []
  } = options || {}
  const hasObserve = notNil(observe) && isString(element)
  const rect = reactive(
    makeDOMRect()
  )
  let observer: MutationObserver
  let canRun = false
  let cached = false

  const triggerCallback = (result: DOMRect) => {
    if (callback && !canRun) {
      callback(result)
      canRun = flush === 'pre'
    }
  }

  const triggerBoundingClientRect = (callback?: Callback<DOMRect>) => {
    const query = createSelectorQuery()
    const selectElement = getSelectorElement(element)

    if (target) {
      query.in(target)
    }

    query
      .select(selectElement)
      .boundingClientRect()
      // exec兼容性更好
      .exec((results = []) => {
        const result = results[0]
        if (result) {
          cached = true
          shallowMerge(rect, result)
          triggerCallback(result)
          callback?.(result)
        }
      })
  }

  const boundingClientRect = (callback?: Callback<DOMRect>) => {
    if (useCache && cached) {
      callback?.(rect)
      return
    }

    if (hasObserve && !observer) {
      createObserver()
    }

    triggerBoundingClientRect(callback)
  }

  const createObserver = () => {
    const observeEl = isString(observe) ? observe : element as string

    if (observeEl.startsWith('#')) {
      const el = document.getElementById(observeEl.slice(1))

      if (el) {
        const lazy = debounce(() => triggerBoundingClientRect(), 30, true)
        observer = new MutationObserver(lazy)
        observer.observe(el, {
          childList: true
        })
      }
    }
  }

  const unObserver = () => {
    if (observer) {
      observer.takeRecords()
      observer.disconnect()
    }
  }

  onUnmounted(unObserver)
  useUnload(unObserver)

  if (immediate) {
    useReady(() => boundingClientRect())
  }

  return {
    rect,
    boundingClientRect,
    ...getToRefs(rect, refs)
  }
}
