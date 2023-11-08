import extend from 'extend'
import { showLoading, hideLoading } from '@tarojs/taro'
import { isString } from '@txjs/bool'

import { useToast } from '../toast'

type ShowLoadingOption = NonNullable<Parameters<typeof showLoading>[0]>

let visible = false

const defaultOption = {
  mask: true,
  title: '加载中'
} as ShowLoadingOption

function hide(complete?: Callback) {
  hideLoading({
    noConflict: true,
    complete: () => {
      visible = false
      complete?.()
    }
  })
}

export function useLoading(partial?: ShowLoadingOption['title'] | ShowLoadingOption) {
  if (useToast.useCheck()) {
    useToast.hide()
  }

  const options = { ...defaultOption }

  if (isString(partial)) {
    options.title = partial
  } else if (partial) {
    extend(options, partial || {})
  }

  const { success, fail } = options

  options.success = (res) => {
    visible = true
    success?.(res)
  }

  options.fail = (err) => {
    visible = false
    fail?.(err)
  }

  showLoading(options)
}

useLoading.hide = function (complete?: Callback) {
  if (visible) {
    hide(complete)
  } else {
    setTimeout(() => {
      if (visible) {
        hide(complete)
      }
    }, 30)
  }
}

useLoading.useCheck = function () {
  return visible
}

useLoading.setVisible = function (value: boolean) {
  visible = value
}
