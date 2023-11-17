import { isFunction } from '@txjs/bool'
import type { UseRect } from './rect'
import type { UseRectAll } from './rect-all'

type ExtractTrigger<T> =
  T extends UseRect | UseRectAll
    ? T['triggerBoundingClientRect']
    : T

const rectCallback = <T,>(
  triggers: Function[],
  results: T[],
  callback?: Callback<T[]>
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

export const useRectCallback = <
  T extends UseRect | UseRectAll | ExtractTrigger<UseRect | UseRectAll>,
  F extends ExtractTrigger<T>,
  C extends NonNullable<Parameters<F>[0]>,
  R extends Parameters<C>[0]
>(
  triggers: T[],
  callback: Callback<R[]>
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
