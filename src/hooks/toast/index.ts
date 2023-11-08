import extend from 'extend'
import { showToast, hideToast } from '@tarojs/taro'
import { isString } from '@txjs/bool'
import { useLoading } from '../loading'

type ShowToastOption = NonNullable<Parameters<typeof showToast>[0]>

let visible = false
let closeTimer: ReturnType<typeof setTimeout> | null = null

const defaultOption = {
  title: '',
  icon: 'none',
  mask: true,
  duration: 1500
} as ShowToastOption

function show(partial: ShowToastOption['title'] | ShowToastOption) {
  const options = { ...defaultOption }

  if (isString(partial)) {
    options.title = partial
  } else {
    extend(options, partial)
  }

  const { success, fail, duration } = options

  options.success = (res) => {
    visible = true
    clearTimeout(closeTimer!)
    closeTimer = setTimeout(
      () => visible = false,
      duration
    )
    success?.(res)
  }

  options.fail = (err) => {
    visible = false
    fail?.(err)
  }

  showToast(options)
}

function createToast(icon: ShowToastOption['icon']) {
  return function (partial: ShowToastOption['title'] | Omit<ShowToastOption, 'icon'>) {
    if (isString(partial)) {
      partial = { title: partial }
    }

    useToast({
      ...partial,
      icon
    })
  }
}

export function useToast(partial: Parameters<typeof show>[0]) {
  if (useLoading.useCheck()) {
    useLoading.hide(() => show(partial))
  } else {
    show(partial)
  }
}

useToast.success = createToast('success')
useToast.error = createToast('error')
useToast.loading = createToast('loading')

useToast.hide = function () {
  hideToast({
    noConflict: true,
    complete: () => {
      visible = false
    }
  })
}

useToast.useCheck = function () {
  return visible
}
