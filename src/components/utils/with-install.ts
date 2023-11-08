import type { App, Component } from 'vue'
import type { CustomShim } from './types'

import extend from 'extend'
import { camelize } from '@txjs/shared'

type EventShim = CustomShim<{
  onTap?: Callback
}>

export type WithInstall<T, U> = T & U & EventShim & {
  install(app: App): void
}

export const componentCustomOptions = <T, U>(opts: any) => {
  return opts as T & CustomShim<U>
}

export const withInstall = <T extends Component, U extends object>(options: T, additional?: U) => {
  extend(options, additional)

  ;(options as Record<string, unknown>).install = (app: App) => {
    const { name } = options

    if (name) {
      app.component(name, options)
      app.component(camelize(name), options)
    }
  }

  return options as WithInstall<T, Readonly<U>>
}
