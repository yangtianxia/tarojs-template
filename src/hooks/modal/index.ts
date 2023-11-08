import extend from 'extend'
import { showModal } from '@tarojs/taro'
import { isString } from '@txjs/bool'

type BaseShowModalOption = NonNullable<Parameters<typeof showModal>[0]>

interface ShowModalOption extends BaseShowModalOption {
  onOk?(): void
  onCancel?(): void
}

const defaultOption = {
  confirmColor: '#576B95'
} as ShowModalOption

function show(partial: NonNullable<ShowModalOption['content']> | ShowModalOption) {
  const options = { ...defaultOption }

  if (isString(partial)) {
    options.content = partial
  } else if (partial) {
    extend(options, partial)
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

export function useModal (partial: Parameters<typeof show>[0]) {
  show(partial)
}

useModal.info = function (partial: NonNullable<ShowModalOption['content']> | Omit<ShowModalOption, 'showCancel'>) {
  if (isString(partial)) {
    partial = { content: partial }
  }

  show({
    ...partial,
    confirmText: '我知道了',
    showCancel: false
  })
}
