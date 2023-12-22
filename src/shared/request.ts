import type { ParamsType } from 'miniprogram-network-utils'
import { REQUEST, type RequestConfig, type SuccessParam, type XHR } from '@txjs/taro-request'
import { pick } from '@txjs/shared'
import { isPlainObject, isNil, isUndefined, notNil } from '@txjs/bool'
import { jumpLogin } from '@/shared/jump-login'
import { isLogin, getToken } from '@/shared/auth'
import { EVENT_TYPE } from '@/shared/constants'

type ContentType = 'json' | 'form-data'

type BaseData = string | object | ArrayBuffer | undefined

type TransformData<T = object> = (data: T) => T

const LogKeys = [
  'url',
  'data',
  'headers',
  'baseURL',
  'method'
] as const

const transformData = [] as TransformData[]

const transformResponse = (config: Record<string, any>) => {
  if (isPlainObject(config.data)) {
    config.data = transformData.reduce(
      (ret, transform) => transform(ret), config.data
    )
  } else if (process.env.TARO_ENV === 'alipay' && config.error) {
    config.data = {
      code: config.error,
      msg: config.data || config.errorMessage,
      data: null
    }
  }

  if (process.env.TARO_ENV === 'alipay') {
    config.statusCode = config.status ?? config.data?.code ?? 500
  }

  return config
}

// 重试次数
REQUEST.Defaults.retry = 0
// 请求URL
REQUEST.Defaults.baseURL = process.env.BASE_URL

REQUEST.Defaults.transformResponse = (config) => {
  const { statusCode, data } = transformResponse(config)

  if (statusCode === 200 && data.code === 200) {
    return Promise.resolve(data.data)
  } else if (statusCode === 401) {
    jumpLogin()
  } else {
    toast.info(data?.msg || '请求失败')
  }

  return Promise.reject(data)
}

REQUEST.Listeners.onSend.push((config) => {
  emitter.trigger(EVENT_TYPE.REQUEST_EVENT, {
    eventName: 'onRequest',
    eventLog: config
  })
})

REQUEST.Listeners.onResponse.push((data, config) => {
  emitter.trigger(EVENT_TYPE.REQUEST_EVENT, {
    eventName: 'onResponse',
    eventLog: {
      ...pick(config, LogKeys),
      ...pick(data, ['statusCode', 'data'])
    }
  })
})

REQUEST.Listeners.onRejected.push((data, config) => {
  if (data && data.errMsg?.startsWith('request:fail')) {
    toast.info('请求错误')
  }

  emitter.trigger(EVENT_TYPE.REQUEST_EVENT, {
    eventName: 'onRejected',
    eventLog: {
      ...data,
      ...pick(config, LogKeys)
    }
  })
})

class Request {
  #contentType: ContentType = 'json'

  constructor() {}

  #cleanParams(data?: any) {
    if (isPlainObject(data)) {
      Object.keys(data).forEach((key) => {
        if (isUndefined(data[key])) {
          data[key] = ''
        }
      })
    }
    return data
  }

  #transformRequestConfig <
    TReturn = SuccessParam<XHR.RequestOption>,
    TParams = ParamsType
  >(config?: RequestConfig<TParams, {}, TReturn>) {
    config ??= {}
    config.headers ??= {}
    config.timeout = 30000

    if (isLogin()) {
      config.headers['Authorization'] = `Bearer ${getToken()}`
    }

    return config
  }

  #getContentType(type: ContentType) {
    switch (type) {
      case 'json':
        return 'application/json'
      case 'form-data':
        return 'application/x-www-form-urlencoded'
    }
  }

  #method(method: NonNullable<XHR.RequestOption['method']>) {
    return <
      TReturn = SuccessParam<XHR.RequestOption>,
      TData extends BaseData = BaseData,
      TParams = ParamsType
    >(
      action: string,
      data?: TData,
      config?: RequestConfig<TParams, {}, TReturn> & {
        type?: ContentType
      }
    ) => {
      config = this.#transformRequestConfig(config)!

      if (isNil(config.type) && method === 'POST') {
        config.type = this.#contentType
      }

      if (notNil(config.type)) {
        config.headers!['Content-Type'] = this.#getContentType(config.type)
      }

      return REQUEST.request<TReturn>(method, action, this.#cleanParams(data), config)
    }
  }

  get = this.#method('GET')
  post = this.#method('POST')
  delete = this.#method('DELETE')
  put = this.#method('PUT')
  head = this.#method('HEAD')
  trace = this.#method('TRACE')
  connect = this.#method('CONNECT')
  options = this.#method('OPTIONS')
}

export { Request }
export default new Request()
