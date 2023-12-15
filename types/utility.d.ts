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
