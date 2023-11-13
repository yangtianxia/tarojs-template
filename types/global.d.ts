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

declare type Callback<T = any, U = void> = (...args: T[]) => U

declare type Numeric = number | string

declare type Writeable<T> = {
  -readonly [P in keyof T]: T[P]
}

declare type Promised<T extends Promise<any>> = T extends Promise<infer U> ? U : never

declare type ObjectNonNullable<T> = {
  [p in keyof T]: NonNullable<T[p]>
}

declare type RequiredParams<T> = T extends (...args: infer P) => infer R
  ? (...args: { [K in keyof P]-?: NonNullable<P[K]> }) => R
  : never
