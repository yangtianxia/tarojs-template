import { showModal } from '@tarojs/taro'
import { shallowMerge } from '@txjs/shared'
import { isString } from '@txjs/bool'

type BaseShowModalOption = NonNullable<Parameters<typeof showModal>[0]>

interface ShowModalOption extends BaseShowModalOption {
  onOk?(): void
  onCancel?(): void
}

class Modal {
  #config = {
    confirmColor: '#576B95'
  } as ShowModalOption

  constructor (options?: Partial<BaseShowModalOption>) {
    this.setConfig(options || {})
  }

  #show(partial: NonNullable<ShowModalOption['content']> | ShowModalOption) {
    const options = { ...this.#config }

    if (isString(partial)) {
      options.content = partial
    } else if (partial) {
      shallowMerge(options, partial)
    }

    const { onOk, onCancel, ...extra } = options

    extra.success = (res) => {
      const { confirm, cancel } = res
      if (confirm) {
        onOk?.()
      } else if (cancel) {
        onCancel?.()
      }
      options.success?.(res)
    }

    showModal(extra)
  }

  confirm(partial: NonNullable<ShowModalOption['content']> | ShowModalOption) {
    this.#show(partial)
  }

  info(partial: NonNullable<ShowModalOption['content']> | Omit<ShowModalOption, 'showCancel'>) {
    if (isString(partial)) {
      partial = { content: partial }
    }

    this.#show({
      ...partial,
      confirmText: '我知道了',
      showCancel: false
    })
  }

  setConfig(options: Partial<BaseShowModalOption>) {
    shallowMerge(this.#config, options)
  }
}

export { Modal }
export default new Modal()
