import extend from 'extend'
import { useReady, getCurrentInstance } from '@tarojs/taro'
import { camelize } from '@txjs/shared'
import { useNextTick } from '../next-tick'

const EventMatch = /^on[A-Z|-](.+)?$/

/**
 * 创建原生组件属性更新方法
 * - 自定义组件与插件使用方法相同
 * - 示例参考插件 [OCR插件](https://fuwu.weixin.qq.com/service/detail/0006eeb6160ce8429fb8cd3995b815)
 *
 * @param componentId 组件节点 id
 * @param props 组件属性
 *
 * @example
 * ```ts
 * useNative('ocr-navigator', {
 *  certificateType: 'idCard',
 *  opposite: true,
 *  onOnSuccess(res) {
 *    console.log(res)
 *  }
 * })
 *
 * <ocr-navigator id="ocr-navigator" />
 *
 * ```
 */
export const useNative = <T extends Record<string, any>>(componentId: string, props: T) => {
  const { page } = getCurrentInstance()
  let nativeComponent: any

  const update = (newProps?: Partial<T>) => {
    if (page) {
      const options = extend(true, props, newProps)
      const $emit = new Map<string, AnyCallback>()

      for (const name in options) {
        if (EventMatch.test(name)) {
          $emit.set(camelize(name), options[name])
          delete options[name]
        }
      }

      useNextTick(() => {
        if (!nativeComponent) {
          nativeComponent = page.selectComponent?.(`#${componentId}`)
          nativeComponent.triggerEvent = function (name: string, eventDetail?: Record<string, any>) {
            const trigger = $emit.get(camelize(`on-${name}`))
            trigger && trigger(eventDetail)
          }
        }
        nativeComponent.setData(options)
      })
    }
  }

  useReady(update)

  return update
}
