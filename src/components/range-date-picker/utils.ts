import { notNil, isNil, isNumber } from '@txjs/bool'
import { padZero, clamp } from '@txjs/shared'

export type TimeType = Numeric[]

export const rangeDatePickerMode = {
  YEAR: 'year',
  MONTH: 'month',
  DAY: 'day'
} as const

export type RangeDatePickerModeText = typeof rangeDatePickerMode[keyof typeof rangeDatePickerMode]

export const rangeDatePickerType = {
  START: 'start',
  END: 'end'
} as const

export type RangeDatePickerTypeText = typeof rangeDatePickerType[keyof typeof rangeDatePickerType]

export type RangeDatePickerOption = {
  text?: string
  value?: string
  disabled?: boolean
  className?: unknown
  children?: RangeDatePickerColumn
  [key: PropertyKey]: any
}

export type RangeDatePickerColumn = RangeDatePickerOption[]

export type Filter = (
  type: RangeDatePickerTypeText,
  mode: RangeDatePickerModeText,
  options: RangeDatePickerOption[]
) => RangeDatePickerOption[]

export type TimeFilter = RequiredParams<Filter>

export type Formatter = (
  type: RangeDatePickerTypeText,
  mode: RangeDatePickerModeText,
  option: RangeDatePickerOption
) => RangeDatePickerOption

export type LabelFormatter = (values: TimeType) => string

export type Presets = {
  label: string
  value: [Date, Date]
}

export function times<T>(n: number, iteratee: (index: number) => T) {
  if (n < 0) {
    return []
  }

  const result: T[] = Array(n)

  let index = -1
  while (++index < n) {
    result[index] = iteratee(index)
  }

  return result
}

function formatDateLabel(mode: RangeDatePickerModeText) {
  switch (mode) {
    case rangeDatePickerMode.YEAR:
      return '年'
    case rangeDatePickerMode.MONTH:
      return '月'
    case rangeDatePickerMode.DAY:
      return '日'
    default:
      return ''
  }
}

export const genOptions = <T extends RangeDatePickerTypeText, U extends RangeDatePickerModeText>(
  min: number,
  max: number,
  type: T,
  mode: U,
  formatter: Formatter,
  filter?: Filter | TimeFilter
) => {
  const options = times(max - min + 1, (index) => {
    const value = padZero(min + index)
    return formatter(type, mode, {
      value,
      text: `${value}${formatDateLabel(mode)}`
    })
  })
  return filter ? filter(type, mode, options) : options
}

export const getMonthEndDay = (year: number, month: number) => 32 - new Date(year, month - 1, 32).getDate()

export const formatValueRange = (values: TimeType, columns: RangeDatePickerOption[][]) =>
  values.map((value, index) => {
    const column = columns[index]
    if (column.length) {
      const minValue = +column[0].value!
      const maxValue = +column[column.length - 1].value!
      return padZero(clamp(+value, minValue, maxValue))
    }
    return value
  })

export function formatValueNumber(value: Numeric) {
  if (isNumber(value)) {
    return value
  }

  return parseInt(value)
}

const formatNumber = (values: TimeType) => values.map((value) => formatValueNumber(value))

export const isEarlierDate = (values: TimeType, valueRights: TimeType) => {
  values = values.filter(notNil)
  valueRights = valueRights.filter(notNil)

  if (values.length && valueRights.length) {
    const [year, month, day] = formatNumber(values)
    const [year1, month1, day1] = formatNumber(valueRights)
    return +new Date(year, month, day) > +new Date(year1, month1, day1)
  }

  return false
}

export const isInvalidDate = (values: TimeType) =>
  values.length === 0 || values.every(isNil)

export const formatDate = (date: Date, slice: number) =>
  [date.getFullYear(), padZero(date.getMonth() + 1), padZero(date.getDate())].slice(0, slice)
