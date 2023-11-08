import { isRef } from 'vue'
import { isArray, isPromise, isFunction, isPlainObject, } from '@txjs/bool'

import { addUnit } from '../utils'
import type { FieldRule, FieldAutosizeConfig } from './types'

export const isEmptyValue = (value: any) => {
  if (isArray(value)) {
    return !value.length
  }

  if (value === 0) {
    return false
  }

  return !value
}

export const runSyncRule = (value: unknown, rule: FieldRule) => {
  if (isEmptyValue(value)) {
    if (rule.required) {
      return false
    }

    if (rule.validateEmpty === false) {
      return true
    }
  }

  if (rule.pattern && !rule.pattern.test(String(value))) {
    return false
  }

  return true
}

export const runRuleValidator = (value: unknown, rule: FieldRule) => {
  return new Promise((resolve) => {
    const returnVal = rule.validator?.(value, rule)

    if (isPromise(returnVal)) {
      returnVal.then(resolve)
      return
    }

    resolve(returnVal)
  })
}

export const getRuleMessage = (value: unknown, rule: FieldRule) => {
  const { message } = rule

  if (isFunction(message)) {
    return message(value, rule)
  }

  if (isRef<Error>(message)) {
    return message.value?.message
  }

  return message || ''
}

export const resizeTextarea = (
  input: any,
  autosize: true | FieldAutosizeConfig
) => {
  if (isPlainObject(autosize)) {
    const { maxHeight, minHeight } = autosize
    input.value.style.height = 'auto'
    input.value.style.maxHeight = addUnit(maxHeight)
    input.value.style.minHeight = addUnit(minHeight)
  }
}

export const getStringLength = (str: string) => {
  return [...str].length
}

export const cutString = (str: string, maxlength: number) => {
  return [...str].slice(0, maxlength).join('')
}

function trimExtraChar(
  value: string,
  char: string,
  regExp: RegExp
) {
  const index = value.indexOf(char)

  if (index === -1) {
    return value
  }

  if (char === '-' && index !== 0) {
    return value.slice(0, index)
  }

  return value.slice(0, index + 1) + value.slice(index).replace(regExp, '')
}

export function formatNumber(
  value: string,
  allowDot = true,
  allowMinus = true
) {
  if (allowDot) {
    value = trimExtraChar(value, '.', /\./g)
  } else {
    value = value.split('.')[0]
  }

  if (allowMinus) {
    value = trimExtraChar(value, '-', /-/g)
  } else {
    value = value.replace(/-/, '')
  }

  const regExp = allowDot ? /[^-0-9.]/g : /[^-0-9]/g

  return value.replace(regExp, '')
}
