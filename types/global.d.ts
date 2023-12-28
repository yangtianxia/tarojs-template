///<reference types="@mini-types/alipay" />
///<reference types="miniprogram-api-typings" />

declare module '*.png'
declare module '*.gif'
declare module '*.jpg'
declare module '*.jpeg'
declare module '*.svg'
declare module '*.css'
declare module '*.less'
declare module '*.scss'
declare module '*.sass'
declare module '*.styl'
declare module '*.json'

declare const $t: typeof import('../src/shared/locale')['default']
declare const BEM: typeof import('../src/shared/bem')['default']
declare const emitter: typeof import('../src/shared/emitter')['default']
declare const toast: typeof import('../src/shared/toast')['default']
declare const modal: typeof import('../src/shared/modal')['default']
declare const request: typeof import('../src/shared/request')['default']
declare const router: typeof import('../src/router')['default']

declare type Numeric = number | string

declare type TimeoutType = ReturnType<typeof setTimeout> | null

declare type IntervalType = ReturnType<typeof setInterval> | null

declare type AnyCallback<T = any, U = void> = (...args: T[]) => U

declare type Writeable<T> = {
  -readonly [P in keyof T]: T[P]
}

declare type PromiseType<T extends Promise<void>> =
  T extends Promise<infer U>
    ? U
    : never

declare type NonNullableFields<T> = {
  [p in keyof T]: NonNullable<T[p]>
}

declare type NonNullableParams<T> = T extends (...args: infer P) => infer R
  ? (...args: { [K in keyof P]-?: NonNullable<P[K]> }) => R
  : never
