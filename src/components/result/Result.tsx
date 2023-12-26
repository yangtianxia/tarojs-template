// Types
import type { VNode } from '../_utils/types'
import type { ResultCode } from './types'

// Vue
import {
  defineComponent,
  reactive,
  watch,
  onMounted,
  type PropType,
  type ExtractPropTypes
} from 'vue'

// Common
import { shallowMerge, omit } from '@txjs/shared'
import { isPlainObject, isString } from '@txjs/bool'

// Components

// Component utils
import { createVNode } from '../_utils/basic'
import { VNodeProp } from '../_utils/props'
import { resultSharedProps, resultStatusConfig } from './utils'

const [name, bem] = BEM('result')

const resultProps = shallowMerge({}, resultSharedProps, {
  image: VNodeProp,
  title: VNodeProp,
  desc: VNodeProp,
  bottom: Function as PropType<VNode>,
  refresh: Function as PropType<AnyCallback>
})

export type ResultProps = ExtractPropTypes<typeof resultProps>

export default defineComponent({
  name,

  props: resultProps,

  setup(props, { slots }) {
    const option = reactive({
      image: props.image,
      title: props.title,
      bottom: props.bottom,
      desc: props.desc
    })

    const withOption = (status: ResultCode, refresh?: AnyCallback) => {
      const newConfig = resultStatusConfig[status]

      if (newConfig) {
        // 自定义状态不支持设置
        if (refresh && ['error', '500'].includes(status)) {
          option.desc = $t('result.500.desc')
        }

        shallowMerge(option, newConfig)
      }
    }

    const updateOption = () => {
      const currentStatus = props.status
      const currentRefresh = props.refresh
      const newOption = omit(props, ['status', 'refresh'])

      // 重新合并 option
      shallowMerge(option, newOption)

      if (isPlainObject(currentStatus)) {
        const { status, refresh, ...partial } = currentStatus

        if (isString(status)) {
          withOption(status, refresh || currentRefresh)
        }

        shallowMerge(option, partial)
      } else {
        withOption(currentStatus, currentRefresh)
      }
    }

    watch(
      () => props.status,
      updateOption
    )

    onMounted(updateOption)

    const renderImage = () => {
      const image = createVNode(slots.image || option.image, {
        render: (value) => (
          <image src={value} />
        )
      })

      if (image) {
        return (
          <view class={bem('image')}>
            {image}
          </view>
        )
      }
    }

    const renderTitle = () => {
      const title = createVNode(slots.title || option.title)

      if (title) {
        return (
          <view class={bem('title')}>
            {title}
          </view>
        )
      }
    }

    const renderDesc = () => {
      const desc = createVNode(slots.desc || option.desc)

      if (desc) {
        return (
          <view class={bem('desc')}>
            {desc}
          </view>
        )
      }
    }

    const renderBottom = () => {
      const bottom = createVNode(slots.default || option.bottom)

      if (bottom) {
        return (
          <view class={bem('bottom')}>
            {bottom}
          </view>
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
