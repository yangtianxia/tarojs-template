import {
  defineComponent,
  ref,
  shallowRef,
  watch,
  onBeforeMount,
  type PropType,
  type ExtractPropTypes
} from 'vue'
import { shallowMerge } from '@txjs/shared'
import { makeArray } from '@txjs/make'
import { isNil, notNil } from '@txjs/bool'
import { useRect, useRectCallback, useScroll, useNextTick } from '@/hooks'

import { ScrollView } from '@tarojs/components'
import { POPUP_KEY } from '../popup'
import { Icon } from '../icon'
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
    const id = useId()
    const cacheScrollTop = new Map<number, number>()
    const containerRect = useRect(`#${id}-container`, {
      useCache: true
    })
    const menuRect = useRect(() => `.${id}-${activeTab.value}`)
    const scroller = useScroll(() => `${id}-${activeTab.value}`)
    const { parent: popup } = useParent(POPUP_KEY)

    const initialized = ref(false)
    const activeTab = ref(0)
    const oldActiveTab = ref(0)
    const tabs = shallowRef(
      makeArray<CascaderTab>([])
    )

    const {
      text: textKey,
      value: valueKey,
      children: childrenKey
    } = shallowMerge({
      text: 'text',
      value: 'value',
      children: 'children'
    }, props.fieldNames)

    const onScrollOldView = (top?: number) => {
      notNil(top) && useNextTick(
        () => scroller.scrollTop(top, `${id}-${oldActiveTab.value}`)
      )
    }

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

      const childrenOption = option[childrenKey]

      if (childrenOption) {
        const nextTab = {
          options: childrenOption,
          selected: null
        }

        if (tabs.value[tabIndex + 1]) {
          tabs.value[tabIndex + 1] = nextTab
        } else {
          tabs.value.push(nextTab)
        }
      }

      triggerScrollTop(childrenOption ? activeTab.value + 1 : activeTab.value, () => {
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

        if (!childrenOption) {
          popup?.close?.()
          props.onFinish?.(params)
        }
      })
    }

    const onClickTab = (tabIndex: number) => {
      activeTab.value = tabIndex
      props.onClickTab?.(tabIndex)

      // 滚动当前scrollView
      const curScrollTop = cacheScrollTop.get(tabIndex)
      if (isNil(curScrollTop)) {
        triggerScrollTop(tabIndex, () => {
          scroller.scrollTop(
            cacheScrollTop.get(tabIndex)!
          )
        })
      } else {
        scroller.scrollTop(curScrollTop)
      }

      // 滚动上一个scrollView
      onScrollOldView(
        cacheScrollTop.get(oldActiveTab.value!)
      )
    }

    const onUpdateTab = () => {
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

          const activeIndex = tabs.value.length - 1

          if (!initialized.value) {
            activeTab.value = activeIndex
          }

          triggerScrollTop(activeIndex, () => {
            useNextTick(() => {
              if (!initialized.value) {
                initialized.value = true
              }
            })
          })
          return
        }
      }

      tabs.value = [{
        options,
        selected: null
      }]
      initialized.value = true
    }

    const triggerScrollTop = (tabIndex: number, callback?: Callback) => {
      const { options, selected } = tabs.value[activeTab.value]

      if (selected) {
        useRectCallback([containerRect, menuRect], ([container, menu]) => {
          const halfHeight = container.height * 0.5
          const optionHeight = menu.height / options.length
          const optionTop = optionHeight * options.findIndex(
            (option) => option[valueKey] === selected[valueKey]
          )
          const expectedPos = optionTop + (optionHeight * 0.5)
          const scrollTop = expectedPos < halfHeight ? 0 : expectedPos - halfHeight
          cacheScrollTop.set(activeTab.value, scrollTop)

          if (activeTab.value !== tabIndex) {
            activeTab.value = tabIndex
          }

          callback?.()
        })
      }
    }

    const onReset = () => {
      tabs.value = []
      activeTab.value = 0
      oldActiveTab.value = 0
      cacheScrollTop.clear()
    }

    watch(
      () => activeTab.value,
      (value, oldValue) => {
        if (notNil(oldValue) && value !== oldValue) {
          oldActiveTab.value = oldValue
        }
      }
    )

    watch(
      () => tabs.value,
      () => {
        cacheScrollTop.clear()
        scroller.clearScrollTop()
      }
    )

    watch(
      () => props.options,
      onUpdateTab
    )

    watch(
      () => props.value,
      (value) => {
        if (value !== undefined) {
          const values = tabs.value.map((tab) => tab.selected?.[valueKey])
          if (!values.includes(value)) {
            onUpdateTab()
          }
        } else {
          onReset()
        }
      }
    )

    onBeforeMount(onUpdateTab)

    const renderTab = ({ selected }: CascaderTab, index: number) => {
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
          <view class={bem('tab-arrow')}>
            <Icon
              name="arrow"
              size={16}
            />
          </view>
        </view>
      )
    }

    const renderOptionsTitle = () => {
      if (props.subTitles && props.subTitles[activeTab.value]) {
        return (
          <view
            disableScroll={true}
            class={bem('options-title')}
          >
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
        scrollTop={scroller.collector(`${id}-${tabIndex}`).value}
        class={bem('options', { active: tabIndex === activeTab.value })}
      >
        <view
          role="menu"
          class={`${id}-${tabIndex}`}
        >
          {options.map((option) => renderOption(option, selectedOption, tabIndex))}
        </view>
      </ScrollView>
    )

    return () => (
      <view class={bem()}>
        <view
          disableScroll={true}
          class={[bem('tabs'), 'hairline--bottom']}
        >
          {tabs.value.map(renderTab)}
        </view>
        {renderOptionsTitle()}
        <view
          id={`${id}-container`}
          class={bem('options-container', { animate: initialized.value })}
          style={{
            width: `${tabs.value.length}00vw`,
            transform: `translateX(${activeTab.value === 0 ? 0 : `-${activeTab.value}00vw`})`
          }}
        >
          {tabs.value.map(({ options, selected }: CascaderTab, tabIndex) => renderOptions(options, selected, tabIndex))}
        </view>
      </view>
    )
  }
})
