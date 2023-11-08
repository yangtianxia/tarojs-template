import { Button } from '../button'

import BEM from '@/shared/bem'
import { defineComponent, reactive, watch, unref, onMounted, type PropType, type ExtractPropTypes } from 'vue'
import { pick, shallowMerge } from '@txjs/shared'
import { isPlainObject, isFunction } from '@txjs/bool'

import type { VueSlotVNode } from '../utils'
import type { ResultOption, ResultStatusType } from './types'

const [name, bem] = BEM('result')

export const resultSharedProps = {
  status: {
    type: [String, Object] as PropType<ResultStatusType | ResultOption>,
    default: null
  }
}

const resultProps = shallowMerge({}, resultSharedProps, {
  refresh: Function as PropType<() => void>,
  image: [String, Function] as PropType<string | VueSlotVNode>,
  title: [String, Function] as PropType<string | VueSlotVNode>,
  desc: [String, Function] as PropType<string | VueSlotVNode>,
  bottom: Function as PropType<VueSlotVNode>
})

export type ResultProps = ExtractPropTypes<typeof resultProps>

export default defineComponent({
  name,

  props: resultProps,

  setup(props, { slots }) {
    const state = reactive<ResultOption>({
      status: undefined,
      image: props.image,
      title: props.title,
      bottom: props.bottom,
      desc: props.desc,
      refresh: props.refresh
    })

    const merge = (...args: ResultOption[]) => shallowMerge(state, ...args)

    const getNode = (node?: string | VueSlotVNode | null) => isFunction(node) ? node() : node

    const withStatus = (
      status: string,
      options: ResultOption = {}
    ) => {
      const defaultOptions = {} as ResultOption

      if (state.refresh && ['500', 'error'].includes(status)) {
        defaultOptions.desc = '别紧张，试试看刷新页面~'
        defaultOptions.bottom = () => (
          <Button
            round
            bold={false}
            width={200}
            size="small"
            type="primary"
            onTap={state.refresh}
          >刷新</Button>
        )
      }

      switch (status) {
        case 'nodata':
          shallowMerge(defaultOptions, {
            title: '暂无数据',
            image: require(`./image/no-data.png`)
          })
          break
        case '404':
          shallowMerge(defaultOptions, {
            title: '接口不存在或已删除！',
            image: require(`./image/404.png`)
          })
          break
        case '500':
          shallowMerge(defaultOptions, {
            title: '抱歉，服务器请求异常！',
            image: require(`./image/500.png`)
          })
          break
        case 'network':
          shallowMerge(defaultOptions, {
            title: '网络异常，请检查网络连接！',
            image: require(`./image/no-network.png`)
          })
          break
        case 'error':
        default:
          shallowMerge(defaultOptions, {
            title: '抱歉，页面发生错误！',
            image: require(`./image/error.png`)
          })
      }

      merge(defaultOptions, options)
    }

    const updateStatus = () => {
      const original = props.status

      if (isPlainObject(original)) {
        const { status, ...other } = original

        if (status) {
          withStatus(status, other)
        } else {
          merge(other)
        }
      } else {
        withStatus(original)
      }

      merge(
        pick(unref(props), [
          'image',
          'title',
          'desc',
          'bottom',
          'refresh'
        ], true)
      )
    }

    watch(
      () => props.status,
      updateStatus
    )

    onMounted(updateStatus)

    const renderImage = () => {
      const image = slots.image || state.image
      const node = getNode(image)

      if (node) {
        return (
          <view class={bem('image')}>
            {isFunction(image) ? node : <image src={node as string} />}
          </view>
        )
      }
    }

    const renderTitle = () => {
      const title = getNode(slots.title || state.title)

      if (title) {
        return (
          <view class={bem('title')}>{title}</view>
        )
      }
    }

    const renderDesc = () => {
      const desc = getNode(slots.desc || state.desc)

      if (desc) {
        return (
          <view class={bem('desc')}>{desc}</view>
        )
      }
    }

    const renderBottom = () => {
      const bottom = slots.default || state.bottom

      if (bottom) {
        return (
          <view class={bem('bottom')}>{bottom()}</view>
        )
      }
    }

    return () => (
      <view class={bem()}>
        {renderImage()}
        {renderTitle()}
        {renderDesc()}
        {renderBottom()}
      </view>
    )
  }
})
