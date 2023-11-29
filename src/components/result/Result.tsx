import {
  defineComponent,
  reactive,
  watch,
  onMounted,
  type PropType,
  type ExtractPropTypes
} from 'vue'
import { shallowMerge, omit } from '@txjs/shared'
import { isPlainObject, isString } from '@txjs/bool'

import type { ResultCode } from './types'

import { Button } from '../button'
import { vnodeProp, genVNode, type VNode } from '../utils'
import { resultSharedProps, resultStatusConfig } from './utils'

const [name, bem] = BEM('result')

const resultProps = shallowMerge({}, resultSharedProps, {
  image: vnodeProp,
  title: vnodeProp,
  desc: vnodeProp,
  bottom: Function as PropType<VNode>,
  refresh: Function as PropType<() => void>
})

export type ResultProps = ExtractPropTypes<typeof resultProps>

export default defineComponent({
  name,

  props: resultProps,

  setup(props, { slots }) {
    const state = reactive({
      image: props.image,
      title: props.title,
      bottom: props.bottom,
      desc: props.desc
    })

    const withState = (status?: ResultCode, refresh?: Callback) => {
      const statusConfig = resultStatusConfig[status!]

      if (statusConfig) {
        // 自定义状态不支持设置
        if (refresh && (status === 'error' || status === '500')) {
          state.desc = '别紧张，试试看刷新页面',
          state.bottom = () => (
            <Button
              round
              bold={false}
              width={96}
              size="small"
              type="primary"
              onTap={refresh}
            >刷新</Button>
          )
        }

        shallowMerge(state, statusConfig)
      }
    }

    const updateState = () => {
      const currentStatus = props.status
      const currentRefresh = props.refresh

      // 重置组件内容
      shallowMerge(state, omit(props, ['status', 'refresh']))

      if (isPlainObject(currentStatus)) {
        const { status, refresh, ...partial } = currentStatus

        if (isString(status)) {
          withState(status, refresh || currentRefresh)
        }

        shallowMerge(state, partial)
      } else {
        withState(currentStatus, currentRefresh)
      }
    }

    watch(
      () => props.status,
      () => updateState()
    )

    onMounted(updateState)

    const renderImage = () => {
      const image = genVNode(slots.image || state.image, {
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
      const title = genVNode(slots.title || state.title)
      if (title) {
        return (
          <view class={bem('title')}>
            {title}
          </view>
        )
      }
    }

    const renderDesc = () => {
      const desc = genVNode(slots.desc || state.desc)
      if (desc) {
        return (
          <view class={bem('desc')}>
            {desc}
          </view>
        )
      }
    }

    const renderBottom = () => {
      const bottom = genVNode(slots.default || state.bottom)
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
