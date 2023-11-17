import { Input, Textarea, Label, type InputProps, type ViewProps, type ITouchEvent } from '@tarojs/components'
import { Icon, type IconName } from '../icon'
import { Cell, cellSharedProps } from '../cell'
import { FORM_KEY } from './Form'

import {
  defineComponent,
  ref,
  reactive,
  computed,
  provide,
  watch,
  getCurrentInstance,
  type PropType,
  type ExtractPropTypes
} from 'vue'

import BEM from '@/shared/bem'
import { useReady } from '@tarojs/taro'
import { isNil, isBoolean, isValidString, notNil } from '@txjs/bool'
import { pick, shallowMerge, toArray } from '@txjs/shared'
import { useNextTick } from '@/hooks'

import { useId } from '../composables/id'
import { useExpose } from '../composables/expose'
import { useParent } from '../composables/parent'
import { FIELD_INJECTION_KEY } from '../composables/field-value'
import { addUnit, truthProp, numericProp, makeStringProp, preventDefault } from '../utils'

import type {
  FieldType,
  FieldRule,
  FieldTextAlign,
  FieldRequiredAlign,
  FieldValidateError,
  FieldClearTrigger,
  FieldFormatTrigger,
  FieldAutosizeConfig,
  FieldValidationStatus,
  FieldFormSharedProps,
  FieldValidateTrigger
} from './types'

import {
  cutString,
  getRuleMessage,
  getStringLength,
  isEmptyValue,
  runRuleValidator,
  runSyncRule,
  resizeTextarea,
  formatNumber
} from './utils'

const [name, bem] = BEM('field')

export const fieldSharedProps = {
  id: String,
  name: String,
  clearable: Boolean,
  errorMessage: String,
  showErrorMessage: truthProp,
  limitClass: String,
  showWordLimit: Boolean,
  type: makeStringProp<FieldType>('text'),
  rules: Array as PropType<FieldRule[]>,
  autosize: [Boolean, Object] as PropType<boolean | FieldAutosizeConfig>,
  titleAlign: String as PropType<FieldTextAlign>,
  errorMessageAlign: String as PropType<FieldTextAlign>,
  inputAlign: String as PropType<FieldTextAlign>,
  autoFocus: Boolean as PropType<InputProps['focus']>,
  leftIcon: String as PropType<IconName>,
  rightIcon: String as PropType<IconName>,
  formatter: Function as PropType<(value: string) => string>,
  requiredAlign: String as PropType<FieldRequiredAlign>,
  clearIcon: makeStringProp<IconName>('clear'),
  clearTrigger: makeStringProp<FieldClearTrigger>('focus'),
  formatTrigger: makeStringProp<FieldFormatTrigger>('onChange'),
  onTap: Function as PropType<ViewProps['onTap']>,
  onClickInput: Function as PropType<ViewProps['onTap']>,
  onClickLeftIcon: Function as PropType<ViewProps['onTap']>,
  onClickRightIcon: Function as PropType<ViewProps['onTap']>,
  onClear: Function as PropType<ViewProps['onTap']>,
  onConfirm: Function as PropType<InputProps['onConfirm']>,
  onInput: Function as PropType<(value: string) => void>,
  onFocus: Function as PropType<InputProps['onFocus']>,
  onBlur: Function as PropType<InputProps['onBlur']>,
  onStartValidate: Function as PropType<() => void>,
  onEndValidate: Function as PropType<(error: {
    status: FieldValidationStatus,
    message: string
  }) => void>,
  'onUpdate:value': Function as PropType<(value: unknown) => void>,
  shrink: {
    type: Boolean,
    default: null
  },
  error: {
    type: Boolean,
    default: null
  },
  readonly: {
    type: Boolean,
    default: null
  },
  colon: {
    type: Boolean,
    default: null
  },
  value: {
    type: [String, Number, Array, Object],
    default: ''
  }
}

export const inputSharedProps = {
  password: Boolean,
  placeholder: String,
  placeholderClass: String,
  confirmHold: Boolean,
  placeholderStyle: null as unknown as PropType<string>,
  cursor: numericProp as PropType<InputProps['cursor']>,
  cursorSpacing: numericProp as PropType<InputProps['cursorSpacing']>,
  selectionStart: numericProp as PropType<InputProps['selectionStart']>,
  selectionEnd: numericProp as PropType<InputProps['selectionEnd']>,
  maxlength: numericProp as PropType<InputProps['maxlength']>,
  confirmType: String as PropType<InputProps['confirmType']>,
  disabled: {
    type: Boolean,
    default: null
  }
}

const fieldProps = shallowMerge({}, cellSharedProps, fieldSharedProps, inputSharedProps)

export type FieldProps = ExtractPropTypes<typeof fieldProps>

export default defineComponent({
  name,

  props: fieldProps,

  setup(props, { slots, emit }) {
    const inputRef = ref<typeof Input>()
    const customValue = ref<() => unknown>()
    const focused = ref(props.autoFocus)
    const state = reactive({
      status: 'unvalidated' as FieldValidationStatus,
      focused: false,
      validateMessage: ''
    })

    const id = useId()
    const vm = getCurrentInstance()
    const { parent: form } = useParent(FORM_KEY)

    const noInputOrTextarea = computed(() => !!(slots.input || slots.default))

    const formValue = computed(() => {
      if (customValue.value && noInputOrTextarea.value) {
        return customValue.value()
      }
      return props.value
    })

    const showClear = computed(() => {
      const readonly = getProp('readonly')

      if (props.clearable && !readonly) {
        const hasValue = getModelValue() !== ''
        const trigger = props.clearTrigger === 'always' || (props.clearTrigger === 'focus' && state.focused)
        return hasValue && trigger
      }
      return false
    })

    const showError = computed(() => {
      if (isBoolean(props.error)) {
        return props.error
      }

      if (form && form.props.showError && state.status === 'failed') {
        return true
      }

      return false
    })

    const titleStyle = computed(() => {
      const style = props.titleStyle ?? {}
      const titleWidth = getProp('titleWidth')

      if (titleWidth) {
        style.width = addUnit(titleWidth)
      }

      return style
    })

    const requiredAlign = computed(() =>
      props.required ? `required-${getProp('requiredAlign') || 'left'}` : undefined
    )

    const getModelValue = () =>  String(props.value) || ''

    const getProp = <T extends FieldFormSharedProps>(key: T) => {
      if (notNil(props[key])) {
        return props[key]
      }

      if (form && notNil(form.props[key])) {
        return form.props[key]
      }
    }

    const getRules = () => {
      let { name, rules = [] } = props

      if (name && form && form.props.rules?.[name]) {
        rules = rules.concat(form.props.rules[name])
      }

      return rules
    }

    const runRules = (rules: FieldRule[]) =>
      rules.reduce(
        (promise, rule) =>
          promise.then(() => {
            if (state.status === 'failed') return

            let { value } = formValue

            if (rule.formatter) {
              value = rule.formatter(value, rule)
            }

            if (!runSyncRule(value, rule)) {
              state.status = 'failed'
              state.validateMessage = getRuleMessage(value, rule)
              return
            }

            if (rule.validator) {
              if (isEmptyValue(value) && rule.validateEmpty === false) return

              return runRuleValidator(value, rule)
                .then((result) => {
                  if (isValidString(result)) {
                    state.status = 'failed'
                    state.validateMessage = result
                  } else if (result === false) {
                    state.status = 'failed'
                    state.validateMessage = getRuleMessage(value, rule)
                  }
                })
            }
          }),
        Promise.resolve()
      )

    const resetValidation = () => {
      state.status = 'unvalidated'
      state.validateMessage = ''
    }

    const endValidate = () => {
      props.onEndValidate?.({
        status: state.status,
        message: state.validateMessage
      })
    }

    const validate = (rules = getRules()) =>
      new Promise<FieldValidateError | void>((resolve) => {
        resetValidation()

        if (rules) {
          props.onStartValidate?.()

          runRules(rules)
            .then(() => {
              form?.props?.onValidate?.({
                name: props.name!,
                message: state.validateMessage
              })
              if (state.status === 'failed') {
                resolve({
                  name: props.name,
                  message: state.validateMessage
                })
                endValidate()
              } else {
                state.status = 'passed'
                resolve()
                endValidate()
              }
            })
        } else {
          resolve()
        }
      })

    const validateWithTrigger = (trigger: FieldValidateTrigger) => {
      const rules = getRules()

      if (form && rules.length) {
        const { validateTrigger } = form.props
        const defaultTrigger = toArray(validateTrigger).includes(trigger)
        const fieldRules = rules.filter((rule) => {
          if (rule.trigger) {
            return toArray(rule.trigger).includes(trigger)
          }
          return defaultTrigger
        })

        if (fieldRules.length) {
          validate(fieldRules)
        }
      }
    }

    const limitValueLength = (value: string) => {
      const { maxlength } = props

      if(notNil(maxlength) && getStringLength(value) > maxlength) {
        const modelValue = getModelValue()

        if (modelValue && getStringLength(modelValue) === +maxlength) {
          return modelValue
        }

        return cutString(value, +maxlength)
      }

      return value
    }

    const updateValue = (
      value: string,
      trigger: FieldFormatTrigger = 'onChange'
    ) => {
      const { type, formatter, formatTrigger, maxlength, value: modelValue } = props
      value = limitValueLength(value)

      if (type === 'number' || type === 'digit') {
        const isNumber = props.type === 'digit'
        value = formatNumber(value, isNumber, isNumber)
      }

      if (formatter && trigger === formatTrigger) {
        value = formatter(value)

        if(notNil(maxlength) && getStringLength(value) > maxlength) {
          value = cutString(value, +maxlength)
        }
      }

      if (value !== modelValue) {
        emit('update:value', value)
        props.onInput?.(value)
      }
    }

    const onInput = (event: ITouchEvent) => {
      updateValue(event.detail.value)
    }

    const focus = () => {
      focused.value = true
    }

    const blur = () => {
      focused.value = false
    }

    const adjustTextareaSize = () => {
      if (props.type === 'textarea' && props.autosize && inputRef.value) {
        resizeTextarea(inputRef, props.autosize)
      }
    }

    const onFocus = (event: ITouchEvent) => {
      state.focused = true
      focus()
      props.onFocus?.(event)
      useNextTick(adjustTextareaSize)

      if (getProp('readonly')) {
        blur()
      }
    }

    const onBlur = (event: ITouchEvent) => {
      if (getProp('readonly')) return

      state.focused = false
      blur()
      updateValue(getModelValue(), 'onBlur')
      props.onBlur?.(event)
      validateWithTrigger('onBlur')
      useNextTick(adjustTextareaSize)
    }

    const onClear = (event: ITouchEvent) => {
      preventDefault(event, true)
      emit('update:value', '')
      props.onClear?.(event)
    }

    const getInputId = () => props.id || `${id}-input`

    const getValidationStatus = () => state.status

    watch(
      () => props.value,
      () => {
        updateValue(getModelValue())
        resetValidation()
        validateWithTrigger('onChange')
        useNextTick(adjustTextareaSize)
      }
    )

    watch(
      () => props.autoFocus,
      (value) => {
        focused.value = value
      }
    )

    provide(FIELD_INJECTION_KEY,{
      customValue,
      resetValidation,
      validateWithTrigger
    })

    useExpose({
      blur,
      focus,
      validate,
      formValue,
      resetValidation,
      getValidationStatus
    })

    useReady(() => {
      updateValue(getModelValue(), props.formatTrigger)
      useNextTick(() => {
        if (form && isNil(props.name)) {
          form.unlink(vm!)
        }
        adjustTextareaSize()
      })
    })

    const renderInput = () => {
      const controlClass = bem('control', [
        getProp('inputAlign'),
        {
          error: showError.value,
          disabled: getProp('disabled'),
          custom: !!slots.input,
          textarea: props.type === 'textarea'
        }
      ])

      const placeholderClass = [
        bem('placeholder', { error: showError.value }),
        props.placeholderClass
      ]
        .filter(Boolean)
        .join(' ')

      if (noInputOrTextarea.value) {
        return (
          <view
            class={controlClass}
            onTap={props.onClickInput}
          >
            {slots.input?.() || slots.default?.()}
          </view>
        )
      }

      const inputAttrs = {
        ...pick(props, [
          'name',
          'cursor',
          'maxlength',
          'cursorSpacing',
          'selectionStart',
          'selectionEnd',
          'confirmType',
          'placeholder',
          'placeholderStyle',
          'onConfirm'
        ]),
        id: getInputId(),
        ref: inputRef,
        class: controlClass,
        focus: focused.value,
        value: getModelValue(),
        confirmHold: props.confirmHold as any,
        disabled: getProp('disabled') || getProp('readonly'),
        'aria-labelledby': props.label ? `${id}-label` : undefined,
        placeholderClass,
        onBlur,
        onFocus,
        onInput,
        onTap: props.onClickInput
      }

      if (props.type === 'textarea') {
        if (process.env.TARO_ENV === 'weapp') {
          shallowMerge(inputAttrs, { disableDefaultPadding: true })
        } else if (process.env.TARO_ENV === 'alipay') {
          inputAttrs.maxlength = -1
        }

        return (
          <Textarea
            autoHeight={!!props.autosize}
            {...inputAttrs}
          />
        )
      }

      if (process.env.TARO_ENV === 'alipay') {
        shallowMerge(inputAttrs, { enableNative: true })
      }

      if (props.type === 'password') {
        return (
          <>
            <Input
              v-show={props.password}
              password
              {...inputAttrs}
            />
            <Input
              v-show={!props.password}
              type="text"
              {...inputAttrs}
            />
          </>
        )
      }

      return (
        <Input
          type={props.type}
          {...inputAttrs}
        />
      )
    }

    const renderLeftIcon = () => {
      const leftIconSlot = slots['left-icon']

      if (props.leftIcon || leftIconSlot) {
        return (
          <view
            class={bem('left-icon')}
            onTap={props.onClickLeftIcon}
          >
            {leftIconSlot ? leftIconSlot() : (
              <Icon name={props.leftIcon} />
            )}
          </view>
        )
      }
    }

    const renderRightIcon = () => {
      const rightIconSlot = slots['right-icon']

      if (props.rightIcon || rightIconSlot) {
        return (
          <view
            class={bem('right-icon')}
            onTap={props.onClickRightIcon}
          >
            {rightIconSlot ? rightIconSlot() : (
              <Icon name={props.rightIcon} />
            )}
          </view>
        )
      }
    }

    const renderWordLimit = () => {
      if (props.showWordLimit && props.maxlength) {
        const count = getStringLength(getModelValue())
        return (
          <view class={[bem('word-limit'), props.limitClass]}>
            <text class={bem('word-num')}>{count}</text>/{props.maxlength}
          </view>
        )
      }
    }

    const renderMessage = () => {
      if ((form && form.props.showErrorMessage === false) || props.showErrorMessage === false) return

      const message = props.errorMessage || state.validateMessage

      if (message) {
        const slot = slots['error-message']
        const errorMessageAlign = getProp('errorMessageAlign')

        return (
          <view class={bem('error-message', errorMessageAlign)}>
            {slot ? slot({ message }) : message}
          </view>
        )
      }
    }

    const renderTitleWrapper = () => {
      const colon = getProp('colon') ? ':' : ''

      if (slots.title) {
        return [slots.title(), colon]
      }

      if (props.title) {
        return (
          <Label
            id={`${id}-title`}
            for={getInputId()}
          >
            {props.title + colon}
          </Label>
        )
      }
    }

    const renderFieldBody = () => [
      <view class={bem('body', { textarea: props.type === 'textarea' })}>
        {renderInput()}
        {showClear.value ? (
          <view
            class={bem('clear')}
            onTouchstart={onClear}
          >
            <Icon name={props.clearIcon} />
          </view>
        ) : null}
        {renderRightIcon()}
        {slots.button ? (
          <view class={bem('button')}>
            {slots.button()}
          </view>
        ) : null}
      </view>,
      renderWordLimit(),
      renderMessage()
    ]

    return () => {
      const shrink = getProp('shrink')
      const disabled = getProp('disabled')
      const titleAlign = getProp('titleAlign')
      const LeftIcon = renderLeftIcon()

      const renderTitle = () => {
        const Title = renderTitleWrapper()

        if (titleAlign === 'top') {
          return [LeftIcon, Title].filter(Boolean)
        }
        return Title || []
      }

      return (
        <Cell
          {...pick(props, [
            'size',
            'center',
            'border',
            'isLink',
            'clickable',
            'arrowDirection',
            'onTap'
          ])}
          v-slots={{
            icon: LeftIcon && titleAlign !== 'top' ? () => LeftIcon : null,
            title: renderTitle,
            value: renderFieldBody,
            extra: slots.extra
          }}
          class={bem({
            disabled,
            error: showError.value,
            [`label-${titleAlign}`]: titleAlign
          })}
          titleClass={[
            bem('label', [titleAlign, requiredAlign.value]),
            props.labelClass
          ]}
          valueClass={[bem('value'), props.valueClass]}
          shrink={shrink}
          titleStyle={titleAlign !== 'top' ? titleStyle.value : undefined}
        />
      )
    }
  }
})
