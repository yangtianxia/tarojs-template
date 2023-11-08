import { createSelectorQuery } from '@tarojs/taro'

/**
 * 在当前页面下选择第一个匹配选择器 `selector` 的节点。返回一个 `NodesRef` 对象实例，可以用于获取节点信息。
 *
 * **selector 语法**
 *
 *
 * selector类似于 CSS 的选择器，但仅支持下列语法。
 *
 * - ID选择器：#the-id
 * - class选择器（可以连续指定多个）：.a-class.another-class
 * - 子元素选择器：.the-parent > .the-child
 * - 后代选择器：.the-ancestor .the-descendant
 * - 跨自定义组件的后代选择器：.the-ancestor >>> .the-descendant
 * - 多选择器的并集：#a-node, .some-other-nodes
 * ```
 */
export const useRect = (selector: string, context?: TaroGeneral.IAnyObject) => {
  return new Promise<Taro.NodesRef.BoundingClientRectCallbackResult>((resolve) => {
    const query = createSelectorQuery()

    if (context) {
      query.in(context)
    }

    query.select(selector).boundingClientRect().exec((rect = []) => resolve(rect[0]))
  })
}

/**
 * 在当前页面下选择匹配选择器 selector 的所有节点。
 *
 * selector 语法
 *
 * selector类似于 CSS 的选择器，但仅支持下列语法。
 *
 * * ID选择器：#the-id
 * * class选择器（可以连续指定多个）：.a-class.another-class
 * * 子元素选择器：.the-parent > .the-child
 * * 后代选择器：.the-ancestor .the-descendant
 * * 跨自定义组件的后代选择器：.the-ancestor >>> .the-descendant
 * * 多选择器的并集：#a-node, .some-other-nodes
 */
export const useRectAll = (selector: string, context?: TaroGeneral.IAnyObject) => {
  return new Promise<Taro.NodesRef.BoundingClientRectCallbackResult[]>((resolve) => {
    const query = createSelectorQuery()

    if (context) {
      query.in(context)
    }

    query.selectAll(selector).boundingClientRect().exec((rect = []) => resolve(rect[0]))
  })
}
