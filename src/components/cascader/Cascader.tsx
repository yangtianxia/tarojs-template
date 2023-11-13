import { ScrollView } from '@tarojs/components'
import { POPUP_KEY } from '../popup'
import { Icon } from '../icon'

import {
  defineComponent,
  ref,
  computed,
  watch,
  onMounted,
  type PropType,
  type CSSProperties,
  type ExtractPropTypes
} from 'vue'

import BEM from '@/shared/bem'
import { shallowMerge } from '@txjs/shared'
import { useRect, useNextTick } from '@/hooks'

import { useId } from '../composables/id'
import { useParent } from '../composables/parent'
import { truthProp, numericProp, makeArrayProp } from '../utils'
import type { CascaderOption, CascaderTab, CascaderFieldNames } from './types'

const [name, bem] = BEM('cascader')

const cascaderProps = {
  value: numericProp,
  round: truthProp,
  closeable: truthProp,
  closeOnPopstate: truthProp,
  safeAreaInsetBottom: truthProp,
  subTitles: Array as PropType<string[]>,
  options: makeArrayProp<CascaderOption>(),
  fieldNames: Object as PropType<CascaderFieldNames>,
  onClickTab: Function as PropType<(tabIndex: number) => void>,
  onChange: Function as PropType<(params: {
    tabIndex: number
    value: Numeric
    selectedOptions: Array<CascaderOption>
  }) => void>,
  onFinish: Function as PropType<(params: {
    tabIndex: number
    value: Numeric
    selectedOptions: Array<CascaderOption>
  }) => void>,
  'onUpdate:value': Function as PropType<(value: Numeric) => void>
}

export type CascaderProps = ExtractPropTypes<typeof cascaderProps>

const DefaultOptionLabel = '选择选项'

export default defineComponent({
  name,

  props: cascaderProps,

  setup(props, { slots, emit }) {
    const menuId = useId()
    const menuRect = useRect(`#${menuId}-container`, {
      refs: ['height']
    })
    const optionRect = useRect(() => `.${menuId}-${activeTab.value}`)
    const { parent: popup } = useParent(POPUP_KEY)

    const initialized = ref(false)
    const scrollTop = ref(0)
    const activeTab = ref(0)
    const tabs = ref<CascaderTab[]>([])

    const optionStyle = computed(() => {
      const style = {
        width: `${tabs.value.length}00vw`
      } as CSSProperties

      if (activeTab.value > 0) {
        style.transform = `translateX(-${activeTab.value}00vw)`
      }

      if (!initialized.value) {
        style.transition = 'none'
      }

      return style
    })

    const {
      text: textKey,
      value: valueKey,
      children: childrenKey
    } = shallowMerge({
      text: 'text',
      value: 'value',
      children: 'children'
    }, props.fieldNames)

    const getSelectedOptionsByValue = (
      options: CascaderOption[],
      value: Numeric
    ): CascaderOption[] | undefined => {
      for (const option of options) {
        if (option[valueKey] === value) {
          return [option]
        }

        if (option[childrenKey]) {
          const selectedOptions = getSelectedOptionsByValue(
            option[childrenKey],
            value
          )

          if (selectedOptions) {
            return [option, ...selectedOptions]
          }
        }
      }
    }

    const onSelectOption = (
      option: CascaderOption,
      tabIndex: number
    ) => {
      if (option.disabled) return

      tabs.value[tabIndex].selected = option

      if (tabs.value.length > tabIndex + 1) {
        tabs.value = tabs.value.slice(0, tabIndex + 1)
      }

      if (option[childrenKey]) {
        const nextTab = {
          options: option[childrenKey],
          selected: null
        }

        if (tabs.value[tabIndex + 1]) {
          tabs.value[tabIndex + 1] = nextTab
        } else {
          tabs.value.push(nextTab)
        }

        useNextTick(() => activeTab.value++)
      }

      triggerScrollTop(() => {
        const selectedOptions = tabs.value
          .map((tab) => tab.selected!)
          .filter(Boolean)
        const params = {
          tabIndex,
          selectedOptions,
          value: option[valueKey]
        }

        emit('update:value', option[valueKey])
        props.onChange?.(params)

        if (!option[childrenKey]) {
          popup?.close?.()
          props.onFinish?.(params)
        }
      })
    }

    const onClickTab = (tabIndex: number) => {
      activeTab.value = tabIndex
      triggerScrollTop()
      props.onClickTab?.(tabIndex)
    }

    const onReset = () => {
      tabs.value = []
      scrollTop.value = 0
      activeTab.value = 0
    }

    const triggerTabChange = () => {
      const { options, value } = props

      if (value !== undefined) {
        const selectedOptions = getSelectedOptionsByValue(options, value)

        if (selectedOptions) {
          let optionsCursor = options
          tabs.value = selectedOptions.map((option) => {
            const tab = {
              options: optionsCursor,
              selected: option,
            }
            const next = optionsCursor.find(
              (item) => item[valueKey] === option[valueKey]
            )
            if (next) {
              optionsCursor = next[childrenKey]
            }
            return tab
          })

          if (optionsCursor) {
            tabs.value.push({
              options: optionsCursor,
              selected: null
            })
          }

          activeTab.value = tabs.value.length - 1
          triggerScrollTop()
          return
        }
      }

      tabs.value = [{
        options,
        selected: null
      }]
    }

    const triggerScrollTop = (callback?: Callback) => {
      const { options, selected } = tabs.value[activeTab.value]

      if (selected) {
        optionRect.triggerBoundingClientRect((rect) => {
          const menuHeight = menuRect.height.value
          const optionsHeight = rect.height
          const optionHeight = optionsHeight / options.length
          const halfHeight = menuHeight * 0.5
          const curHeight = optionHeight * options.findIndex(
            (option) => option[valueKey] === selected[valueKey]
          )
          scrollTop.value = curHeight + optionHeight - (
            optionsHeight - curHeight < halfHeight
              ? menuHeight
              : halfHeight
          )
          callback?.()
        })
      }
    }

    watch(
      () => props.options,
      triggerTabChange
    )

    watch(
      () => props.value,
      (value) => {
        if (value !== undefined) {
          const values = tabs.value.map((tab) => tab.selected?.[valueKey])
          if (!values.includes(value)) {
            triggerTabChange()
          }
        } else {
          onReset()
        }
      }
    )

    onMounted(triggerTabChange)

    const renderTab = (tab: CascaderTab, index: number) => {
      const { selected } = tab
      const title = selected ? selected[textKey] : DefaultOptionLabel
      const active = !!selected
      const last = tabs.value.length - 1 === index

      return (
        <view
          class={bem('tab')}
          onTap={() => onClickTab(index)}
        >
          <view class={bem('tab-dot', { active, last })} />
          <view class={bem('tab-label', { active: index === activeTab.value })}>
            <text>{title}</text>
          </view>
          <Icon
            name="arrow"
            size={16}
            class={bem('tab-arrow')}
          />
        </view>
      )
    }

    const renderOptionsTitle = () => {
      if (props.subTitles && props.subTitles[activeTab.value]) {
        return (
          <view class={bem('options-title')}>
            {props.subTitles[activeTab.value]}
          </view>
        )
      }
    }

    const renderOption = (
      option: CascaderOption,
      selectedOption: CascaderOption | null,
      tabIndex: number
    ) => {
      const { disabled } = option
      const selected = !!(selectedOption && option[valueKey] === selectedOption[valueKey])

      return (
        <view
          key={option[valueKey]}
          role="menuitemradio"
          class={[bem('option', { selected, disabled }), option.className]}
          aria-checked={selected}
          aria-disabled={disabled || undefined}
          onTap={() => onSelectOption(option, tabIndex)}
        >
          {slots.option ? slots.option({ option, selected }): (
            <text>{option[textKey]}</text>
          )}
          {selected ? (
            <view class={bem('selected-icon')} />
          ) : null}
        </view>
      )
    }

    const renderOptions = (
      options: CascaderOption[],
      selectedOption: CascaderOption | null,
      tabIndex: number
    ) => (
      <ScrollView
        scrollY
        enhanced
        bounces
        // @ts-ignore
        enablePassive
        fastDeceleration
        scrollTop={tabIndex === activeTab.value ? scrollTop.value : 0}
        class={bem('options')}
      >
        <view
          role="menu"
          class={`${menuId}-${tabIndex}`}
        >
          {options.map((option) => renderOption(option, selectedOption, tabIndex))}
        </view>
      </ScrollView>
    )

    return () => (
      <view class={bem()}>
        <view class={[bem('tabs'), 'hairline--bottom']}>
          {tabs.value.map(renderTab)}
        </view>
        {renderOptionsTitle()}
        <view
          class={bem('options-container')}
          id={`${menuId}-container`}
          style={optionStyle.value}
        >
          {tabs.value.map(({ options, selected }: CascaderTab, tabIndex) => renderOptions(options, selected, tabIndex))}
        </view>
      </view>
    )
  }
})
