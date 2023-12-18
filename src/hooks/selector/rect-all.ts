import { isFunction } from '@txjs/bool'
import type { UseRect } from './rect'
import type { UseRects } from './rects'

type ExtractTrigger<T> =
  T extends UseRect | UseRects
    ? T['boundingClientRect']
    : T

const rectCallback = <T,>(
  triggers: Function[],
  results: T[],
  callback?: AnyCallback<T[]>
) => {
  const trigger = triggers.pop()!

  trigger((result: T) => {
    results = [...results, result]
    if (triggers.length) {
      rectCallback(triggers, results, callback)
    } else {
      callback?.(results)
    }
  })
}

export const useRectAll = <
  T extends UseRect | UseRects | ExtractTrigger<UseRect | UseRects>,
  F extends ExtractTrigger<T>,
  C extends NonNullable<Parameters<F>[0]>,
  R extends Parameters<C>[0]
>(
  triggers: T[],
  callback: AnyCallback<R[]>
) => {
  const list = triggers
    .reverse()
    .map((trigger) =>
      isFunction(trigger)
        ? trigger
        : trigger.boundingClientRect
    )
  rectCallback(list, [], callback)
}
