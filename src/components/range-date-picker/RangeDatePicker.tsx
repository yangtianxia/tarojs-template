import { PickerView, PickerViewColumn, type ITouchEvent } from '@tarojs/components'
import { POPUP_KEY } from '../popup'
import { Row, Col } from '../grid'
import { Button } from '../button'

import BEM from '@/shared/bem'
import { defineComponent, ref, computed, watch, type PropType, type ExtractPropTypes } from 'vue'
import { isDate, isEqual } from '@txjs/bool'
import { useNextTick } from '@/hooks'

import { useParent } from '../composables/parent'
import { makeNumberProp, makeStringProp, makeArrayProp } from '../utils'

import {
  rangeDatePickerMode,
  rangeDatePickerType,
  genOptions,
  getMonthEndDay,
  formatValueRange,
  formatDate,
  formatValueNumber,
  isEarlierDate,
  isInvalidDate,
  type TimeType,
  type Filter,
  type Formatter,
  type Presets,
  type LabelFormatter,
  type RangeDatePickerOption,
  type RangeDatePickerModeText,
  type RangeDatePickerTypeText
} from './utils'

const [name, bem] = BEM('range-date-picker')

const currentDate = new Date()
const Year = currentDate.getFullYear()

const datePickerProps = {
  autoSearch: Boolean,
  presetsLabel: String,
  presets: makeArrayProp<Presets>(),
  start: makeArrayProp<Numeric>(),
  end: makeArrayProp<Numeric>(),
  separator: makeStringProp('至'),
  confirmText: makeStringProp('确定'),
  cancelText: makeStringProp('取消'),
  indicatorStyle: makeNumberProp(50),
  visibleOptionNum: makeNumberProp(3),
  startLabel: makeStringProp('开始时间'),
  endLabel: makeStringProp('结束时间'),
  mode: {
    type: Array as PropType<RangeDatePickerModeText[]>,
    default: () => [rangeDatePickerMode.YEAR, rangeDatePickerMode.MONTH, rangeDatePickerMode.DAY]
  },
  minDate: {
    type: Date,
    default: () => new Date(Year - 10, 0, 1),
    validator: isDate
  },
  maxDate: {
    type: Date,
    default: () => new Date(Year + 10, 11, 31),
    validator: isDate
  },
  labelFormatter: {
    type: Function as PropType<LabelFormatter>,
    default: (values: TimeType) => values.join('-')
  },
  filter: Function as PropType<Filter>,
  formatter: Function as PropType<Formatter>,
  'onUpdate:start': Function as PropType<(value: TimeType) => void>,
  'onUpdate:end': Function as PropType<(value: TimeType) => void>,
  onChange: Function as PropType<(type: RangeDatePickerTypeText, values: TimeType, selectOptions: RangeDatePickerOption[], colunmIndex: number[]) => void>,
  onCancel: Function as PropType<() => void>,
  onConfirm: Function as PropType<(start: TimeType, end: TimeType) => void>
}

export type DatePickerProps = ExtractPropTypes<typeof datePickerProps>

export default defineComponent({
  name,

  props: datePickerProps,

  setup(props, { emit, slots }) {
    const type = ref<RangeDatePickerTypeText>(rangeDatePickerType.START)
    const modeLength = ref(props.mode.length)

    const currentDateValue = ref(
      formatDate(currentDate, modeLength.value)
    )
    const startValue = ref<TimeType>(
      isInvalidDate(props.start) ? currentDateValue.value : props.start
    )
    const endValue = ref<TimeType>(props.end)
    const columnIndex = ref<number[]>(new Array(modeLength.value).fill(0))
    const updatedByExternalSources = ref(false)

    const indicatorHeight = computed(() =>
      `${props.indicatorStyle}px`
    )
    const startEmpty = computed(() => isInvalidDate(startValue.value))
    const endEmpty = computed(() => isInvalidDate(endValue.value))

    const modelValue = computed(() =>
      type.value === rangeDatePickerType.END ? props.end : props.start
    )
    const currentValue = computed(() => {
      if (type.value === rangeDatePickerType.START) {
        return startEmpty.value ? currentDateValue.value : startValue.value
      }
      return endEmpty.value ? startValue.value : endValue.value
    })

    const { parent: popup } = useParent(POPUP_KEY)

    const updateStart = (values: TimeType = []) => {
      startValue.value = values
      emit('update:start', values)
    }

    const updateEnd = (values: TimeType = []) => {
      endValue.value = values
      emit('update:end', values)
    }

    const formatter = (
      type: RangeDatePickerTypeText,
      mode: RangeDatePickerModeText,
      option: RangeDatePickerOption
    ) => {
      const value = parseInt(option.value!)
      const [year1, month1] = currentValue.value
      const [year, month, day] = type === rangeDatePickerType.START ? endValue.value : startValue.value

      const compared = (valueRight: Numeric) =>
        type === rangeDatePickerType.START ? value > formatValueNumber(valueRight) : value < formatValueNumber(valueRight)

      switch (mode) {
        case rangeDatePickerMode.YEAR:
          option.disabled = compared(year)
          break
        case rangeDatePickerMode.MONTH:
          option.disabled = year === year1 && compared(month)
          break
        case rangeDatePickerMode.DAY:
          option.disabled = isEqual([year, month], [year1, month1]) && compared(day)
          break
      }

      return props.formatter?.(type, mode, option) || option
    }

    const updateDateValue = (values: TimeType) => {
      if (type.value === rangeDatePickerType.END) {
        endValue.value = values
      } else {
        startValue.value = values

        if (isEarlierDate(values, endValue.value)) {
          updateEnd()
        }
      }
    }

    const genYearOptions = () => {
      const minYear = props.minDate.getFullYear()
      const maxYear = props.maxDate.getFullYear()
      return genOptions(
        minYear,
        maxYear,
        type.value,
        rangeDatePickerMode.YEAR,
        formatter,
        props.filter
      )
    }

    const isMinYear = (year: number) => year === props.minDate.getFullYear()
    const isMaxYear = (year: number) => year === props.maxDate.getFullYear()
    const isMinMonth = (month: number) => month === props.minDate.getMonth() + 1
    const isMaxMonth = (month: number) => month === props.maxDate.getMonth() + 1

    const getValue = (type: RangeDatePickerModeText) => {
      const { minDate, mode } = props
      const index = mode.indexOf(type)
      const value = updatedByExternalSources.value ? modelValue.value[index] : currentValue.value[index]

      if (value) {
        return +value
      }

      switch (type) {
        case rangeDatePickerMode.YEAR:
          return minDate.getFullYear()
        case rangeDatePickerMode.MONTH:
          return minDate.getMonth() + 1
        case rangeDatePickerMode.DAY:
          return minDate.getDate()
      }
    }

    const genMonthOptions = () => {
      const year = getValue(rangeDatePickerMode.YEAR)
      const minMonth = isMinYear(year) ? props.minDate.getMonth() + 1 : 1
      const maxMonth = isMaxYear(year) ? props.maxDate.getMonth() + 1 : 12
      return genOptions(
        minMonth,
        maxMonth,
        type.value,
        rangeDatePickerMode.MONTH,
        formatter,
        props.filter
      )
    }

    const genDayOptions = () => {
      const year = getValue(rangeDatePickerMode.YEAR)
      const month = getValue(rangeDatePickerMode.MONTH)
      const minDate = isMinYear(year) && isMinMonth(month) ? props.minDate.getDate() : 1
      const maxDate = isMaxYear(year) && isMaxMonth(month) ? props.maxDate.getDate() : getMonthEndDay(year, month)
      return genOptions(
        minDate,
        maxDate,
        type.value,
        rangeDatePickerMode.DAY,
        formatter,
        props.filter
      )
    }

    const columns = computed(() =>
      props.mode.map((mode) => {
        switch (mode) {
          case rangeDatePickerMode.YEAR:
            return genYearOptions()
          case rangeDatePickerMode.MONTH:
            return genMonthOptions()
          case rangeDatePickerMode.DAY:
            return genDayOptions()
          default:
            if (process.env.NODE_ENV !== 'production') {
              throw new Error(
                `unsupported columns type: ${type.value}`
              )
            }
            return []
        }
      })
    )

    const getAutoIndex = (options: RangeDatePickerOption[], index: number) => {
      const getOptionDisabled = (i: number) => options[i].disabled
      const length = options.length - 1

      if (getOptionDisabled(index)) {
        let i = index
        let found = false

        if (i > 0) {
          while (--i) {
            if (!getOptionDisabled(i)) {
              found = true
              break
            }
          }
        }

        if (!found) {
          i = index
          while (++i < length) {
            if (!getOptionDisabled(i)) {
              found = true
              break
            }
          }
        }

        if (found) {
          return i
        }
      }
    }

    const getColumnIndex = () => {
      columnIndex.value = columns.value.map((item, columnIndex) => {
        const value = currentValue.value[columnIndex]
        const index = Math.max(item.findIndex((child) => formatValueNumber(child.value!) === formatValueNumber(value)), 0)
        return props.autoSearch ? getAutoIndex(item, index) || index : index
      })
    }

    const onInputChange = (text: RangeDatePickerTypeText) => {
      if (type.value === text) return

      if (startEmpty.value) {
        startValue.value = currentDateValue.value
      }

      type.value = text
    }

    const onValuesChange = (indexs: number[]) => {
      const selectOptions = columns.value.map((item, index) => item[indexs[index]])
      const values = selectOptions.map((item) => item.value!)
      const index = selectOptions.findIndex((item) => item.disabled)

      if (index === -1) {
        updateDateValue(values)
        props.onChange?.(type.value, values, selectOptions, indexs)
      } else if (!isEqual(indexs, columnIndex.value)) {
        onValuesChange(columnIndex.value)
      } else {
        getColumnIndex()
      }

      if (type.value === rangeDatePickerType.START && isEarlierDate(values, endValue.value)) {
        endValue.value = []
      }
    }

    const onPresetClick = (start: Date, end: Date) => {
      updateStart(formatDate(start, modeLength.value))
      updateEnd(formatDate(end, modeLength.value))
      onClose()

      useNextTick(() => {
        onInputChange(rangeDatePickerType.END)
        props.onConfirm?.(props.start, props.end)
      })
    }

    const onPickerViewChange = (event: ITouchEvent) => onValuesChange(event.detail.value as number[])

    const onClose = () => popup?.close()

    const onConfirm = () => {
      let start = startValue.value
      let end = endValue.value

      if (startEmpty.value) {
        start = end = formatDate(currentDate, modeLength.value)
      } else if (endEmpty.value) {
        end = startValue.value
      }

      updateStart(start)
      updateEnd(end)
      onClose()

      useNextTick(() => {
        onInputChange(rangeDatePickerType.END)
        props.onConfirm?.(props.start, props.end)
      })
    }

    const onCancel = () => {
      startValue.value = props.start
      endValue.value = props.end
      onClose()

      useNextTick(() => {
        onInputChange(rangeDatePickerType.START)
        props.onCancel?.()
      })
    }

    const onModelValueChange = (type: RangeDatePickerTypeText) => (newValues: TimeType, oldValues: TimeType) => {
      const values = type === rangeDatePickerType.START ? startValue.value : endValue.value

      updatedByExternalSources.value = isEqual(oldValues, values)
      newValues = formatValueRange(newValues, columns.value)

      if (!isEqual(newValues, values)) {
        updateDateValue(newValues)
      } else {
        getColumnIndex()
      }

      updatedByExternalSources.value = false
    }

    watch(
      () => currentValue.value,
      () => {
        getColumnIndex()
      }
    )

    watch(
      () => props.start,
      onModelValueChange(
        rangeDatePickerType.START
      ),
      {
        immediate: true
      }
    )

    watch(
      () => props.end,
      onModelValueChange(
        rangeDatePickerType.END
      ),
      {
        immediate: true
      }
    )

    const renderLabel = (label?: string) => {
      if (label) {
        return (
          <view class={bem('label')}>
            <text>{label}</text>
          </view>
        )
      }
    }

    const renderPreset = () => {
      if (props.presets.length) {
        return (
          <>
            {renderLabel(props.presetsLabel)}
              <view class={bem('preset')}>
                <Row gutter={[8, 8]}>
                  {props.presets.map((item) => (
                    <Col span={8}>
                      <Button
                        block
                        bold={false}
                        size="small"
                        class={bem('preset-option')}
                        onTap={() => onPresetClick(...item.value)}
                      >{item.label}</Button>
                    </Col>
                  ))}
                </Row>
              </view>
            {renderLabel('自定义')}
          </>
        )
      }
    }

    const renderInput = () => {
      const inputList = [
        {
          empty: startEmpty.value,
          type: rangeDatePickerType.START,
          label: props.startLabel,
          values: startValue.value
        },
        {
          empty: endEmpty.value,
          type: rangeDatePickerType.END,
          label: props.endLabel,
          values: endValue.value
        }
      ]

      return (
        <view class={bem('input-container')}>
          {inputList.map((item) => (
            <>
              <view
                class={bem('input', {
                  empty: item.empty,
                  active: item.type === type.value
                })}
                onTap={() => onInputChange(item.type)}
              >
                <text>{item.empty ? item.label : props.labelFormatter(item.values)}</text>
              </view>
              {item.type === rangeDatePickerType.START ? (
                <view class={bem('separator')}>
                  <text>{props.separator}</text>
                </view>
              ) : null}
            </>
          ))}
        </view>
      )
    }

    const renderOption = ({ value, text, disabled }: RangeDatePickerOption) => (
      <view
        key={value}
        class={bem('option', { disabled })}
        style={{ lineHeight: indicatorHeight.value }}
      >
        <text>{text}</text>
      </view>
    )

    const renderAction = () => (
      <view class={bem('action')}>
        <Button
          block
          bold={false}
          size="large"
          class={bem('action-cancel')}
          onTap={onCancel}
        >
          {slots.cancel?.() || props.cancelText}
        </Button>
        <Button
          block
          bold={false}
          size="large"
          type="primary"
          class={bem('action-confirm')}
          onTap={onConfirm}
        >
          {slots.confirm?.() || props.confirmText}
        </Button>
      </view>
    )

    return () => (
      <view class={bem()}>
        {renderPreset()}
        {renderInput()}
        <PickerView
          value={columnIndex.value}
          indicator-style={`height: ${indicatorHeight.value}`}
          style={{ height: `${props.indicatorStyle * props.visibleOptionNum}px` }}
          onChange={onPickerViewChange}
        >
          {columns.value.map((item) => (
            <PickerViewColumn class={bem('column')}>
              {item.map(renderOption)}
            </PickerViewColumn>
          ))}
        </PickerView>
        {renderAction()}
      </view>
    )
  }
})
