import extend from 'extend'
import { useReady, getCurrentInstance } from '@tarojs/taro'
import { camelize } from '@txjs/shared'

import { useNextTick } from '../next-tick'

export const useCustomComponent = <T extends Record<string, any>>(componentId: string, props: T) => {
  const { page } = getCurrentInstance()
  let ctx: any

  const setData = (newProps?: Partial<T>) => {
    if (page) {
      const options = extend(true, props, newProps)
      const bus = new Map<string, Callback>()

      for (const name in options) {
        if (/^on[A-Z|-](.+)?$/.test(name)) {
          bus.set(camelize(name), options[name])
          delete options[name]
        }
      }

      useNextTick(() => {
        if (!ctx) {
          ctx = page.selectComponent?.(`#${componentId}`)
          ctx.triggerEvent = function (name: string, eventDetail?: Record<string, any>) {
            const trigger = bus.get(camelize(`on-${name}`))
            trigger && trigger(eventDetail)
          }
        }
        ctx.setData(options)
      })
    }
  }

  useReady(setData)

  return setData
}
