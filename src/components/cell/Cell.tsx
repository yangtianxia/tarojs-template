import type { ITouchEvent } from '@tarojs/components'
import { Icon, type IconName } from '../icon'

import {
  defineComponent,
  ref,
  computed,
  type CSSProperties,
  type ExtractPropTypes,
  type ComponentPublicInstance
} from 'vue'

import BEM from '@/shared/bem'
import { isArray, notNil } from '@txjs/bool'
import { shallowMerge } from '@txjs/shared'

import { useParent } from '../composables/parent'
import { useExpose } from '../composables/expose'
import { jumpLinkSharedProps, jumpLink } from '../mixins'
import { addUnit } from '../utils'

import { CELL_GROUP_KEY } from './Group'
import { cellSharedProps } from './utils'

const [name, bem] = BEM('cell')

const callProps = shallowMerge({}, cellSharedProps, jumpLinkSharedProps)

export type CellProps = ExtractPropTypes<typeof callProps>

export type CellProvide = {
  setBorder(value: boolean): void
}

export type CellInstance = ComponentPublicInstance<CellProps, CellProvide>

export default defineComponent({
  name,

  props: callProps,

  setup(props, { slots }) {
    const border = ref(props.border)
    const { parent } = useParent(CELL_GROUP_KEY)

    const titleWidth = computed(() =>
      props.titleWidth || parent?.props.titleWidth
    )

    const titleStyle = () => {
      const style = {} as CSSProperties

      if (titleWidth.value) {
        style.minWidth = addUnit(titleWidth.value)
        style.maxWidth = style.minWidth
      }

      if (props.titleStyle) {
        shallowMerge(style, props.titleStyle)
      }

      return style
    }

    const setBorder = (value: boolean) => {
      border.value = value
    }

    const onTap = (event: ITouchEvent) => {
      props.onTap?.(event)

      if (props.url) {
        jumpLink(
          props.url,
          props.linkQuery,
          props.linkType,
          props.linkBefore
        )
      }
    }

    useExpose({ setBorder })

    const renderLeftIcon = () => {
      if (slots.icon) {
        return slots.icon()
      }

      if (props.icon) {
        return (
          <Icon
            name={props.icon}
            class={bem('left-icon')}
          />
        )
      }
    }

    const renderLabel = () => {
      if (slots.label || notNil(props.label)) {
        return (
          <view class={[bem('label'), props.labelClass]}>
            {slots.label?.() || props.label}
          </view>
        )
      }
    }

    const renderTitle = () => {
      if (slots.title || notNil(props.title)) {
        const titleSlot = slots.title?.()

        if (isArray(titleSlot) && titleSlot.length === 0) return

        return (
          <view
            class={[bem('title'), props.titleClass]}
            style={titleStyle()}
          >
            {titleSlot || <text>{props.title}</text>}
            {renderLabel()}
          </view>
        )
      }
    }

    const renderValue = () => {
      const valueSlot = slots.value ?? slots.default
      const hasValue = valueSlot || notNil(props.value)

      if (hasValue) {
        return (
          <view class={[bem('value'), props.valueClass]}>
            {valueSlot?.() || <text>{props.value}</text>}
          </view>
        )
      }
    }

    const renderRightIcon = () => {
      if (slots['right-icon']) {
        return slots['right-icon']()
      }

      if (props.isLink) {
        const name = props.arrowDirection && props.arrowDirection !== 'right' ? `arrow-${props.arrowDirection}` : 'arrow'
        return (
          <Icon
            name={name as IconName}
            class={bem('right-icon')}
          />
        )
      }
    }

    return () => {
      const { size, center,  shrink, isLink, required } = props
      const clickable = props.clickable ?? isLink

      const classes: Record<string, boolean | undefined> = {
        center,
        required,
        clickable,
        shrink,
        borderless: !border.value
      }

      if (size) {
        classes[size] = !!size
      }

      return (
        <view
          class={bem(classes)}
          hoverClass={bem('hover')}
          hoverStayTime={70}
          role={clickable ? 'button' : undefined}
          onTap={onTap}
        >
          {renderLeftIcon()}
          {renderTitle()}
          {renderValue()}
          {renderRightIcon()}
          {slots.extra?.()}
        </view>
      )
    }
  }
})
