import { validator, type Rule } from '@txjs/vant-validator'

export function useValidator(options: Parameters<typeof validator>[number]) {
  return validator(options)
}

useValidator.telNumber = (label?: string): Rule => ({
  label: label || '手机号',
  required: {
    value: true,
    message: '请输入 [0]'
  },
  telephone: {
    value: true,
    trigger: 'onBlur',
    message: '[0] 无效'
  }
})
