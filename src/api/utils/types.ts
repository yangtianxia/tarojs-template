export type BaseData = string | object | ArrayBuffer | undefined

export type TransformData<T = Record<string, any>> = (data: T) => T

export type ContentType = 'json' | 'form-data'
