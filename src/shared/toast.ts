import { showToast, hideToast, showLoading, hideLoading } from '@tarojs/taro'
import { shallowMerge } from '@txjs/shared'
import { makeString } from '@txjs/make'
import { isString } from '@txjs/bool'

type ShowToastOption = NonNullable<Parameters<typeof showToast>[0]>

type ShowLoadingOption = NonNullable<Parameters<typeof showLoading>[0]>

class Toast {
  #timer: TimeoutType = null
  #type = makeString()
  #visible = false
  #locked = false
  #config = {
    title: '',
    icon: 'none',
    mask: true,
    duration: 1500
  } as ShowToastOption

  constructor (options?: Partial<ShowToastOption>) {
    this.setConfig(options || {})
  }

  #setStatus(type?: string, visible?: boolean) {
    this.#type = type || void 0
    this.#visible = visible || false
  }

  #method(icon: ShowToastOption['icon']) {
    return (partial: ShowToastOption['title'] | Omit<ShowToastOption, 'icon'>) => {
      if (isString(partial)) {
        partial = { title: partial }
      }

      this.info({
        ...partial,
        icon
      })
    }
  }

  #showToast(partial: ShowToastOption['title'] | ShowToastOption) {
    const options = { ...this.#config }

    if (isString(partial)) {
      options.title = partial
    } else {
      shallowMerge(options, partial)
    }

    const { success, fail, duration } = options

    options.success = (res) => {
      this.#setStatus('toast', true)
      clearTimeout(this.#timer!)
      this.#timer = setTimeout(() => {
        this.#setStatus()
      }, duration)
      success?.(res)
    }

    options.fail = (err) => {
      this.#setStatus()
      fail?.(err)
    }

    showToast(options)
  }

  #hideToast(complete?: UnknownCallback) {
    try {
      hideToast({
        noConflict: true,
        complete: () => {
          this.#locked = false
          this.#setStatus()
          complete?.()
        }
      })
    } catch (err) {
      console.log('[toast]: 异常调用hideToast方法', err)
    }
  }

  #showLoading(partial?: ShowLoadingOption['title'] | ShowLoadingOption) {
    const options = {
      ...this.#config,
      title: '加载中'
    }

    if (isString(partial)) {
      options.title = partial
    } else if (partial) {
      shallowMerge(options, partial)
    }

    const { success, fail } = options

    options.success = (res) => {
      this.#setStatus('loading', true)
      success?.(res)
    }

    options.fail = (err) => {
      this.#setStatus()
      fail?.(err)
    }

    showLoading(options)
  }

  #hideLoading(complete?: UnknownCallback) {
    try {
      hideLoading({
        noConflict: true,
        complete: () => {
          this.#locked = false
          this.#setStatus()
          complete?.()
        }
      })
    }  catch (err) {
      console.log('[toast]: 异常调用hideLoading方法', err)
    }
  }

  #hide(complete?: UnknownCallback) {
    if (this.#type === 'toast') {
      this.#hideToast(complete)
    } else if (this.#type === 'loading') {
      this.#hideLoading(complete)
    }
  }

  error = this.#method('error')

  success = this.#method('success')

  info(partial: ShowToastOption['title'] | ShowToastOption) {
    if (this.#visible) {
      this.hide()
      this.#showToast(partial)
    } else {
      this.#showToast(partial)
    }
  }

  loading(partial?: ShowLoadingOption['title'] | ShowLoadingOption) {
    if (this.#visible) {
      this.hide()
      this.#showLoading(partial)
    } else {
      this.#showLoading(partial)
    }
  }

  hide(complete?: UnknownCallback) {
    if (this.#visible && !this.#locked) {
      this.#locked = true
      this.#hide(complete)
    }
  }

  setConfig(options: Partial<ShowToastOption>) {
    shallowMerge(this.#config, options)
  }
}

export { Toast }
export default new Toast()
