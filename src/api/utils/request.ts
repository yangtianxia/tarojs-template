import type { ParamsType } from 'miniprogram-network-utils'
import type { RequestConfig, SuccessParam, XHR } from '@txjs/taro-request'
import type { BaseData, TransformData, ContentType } from './types'

import router from '@/router'
import { REQUEST } from '@txjs/taro-request'
import { pick } from '@txjs/shared'
import { isPlainObject, isNil, isUndefined, notNil } from '@txjs/bool'
import { isLogin, getToken } from '@/shared/auth'
import { EVENT_TYPE } from '@/shared/constants'

const keys = [
  'url',
  'data',
  'headers',
  'baseURL',
  'method'
] as const

const transformData = [] as TransformData[]

const transformResponse = (config: Record<string, any>) => {
  if (isPlainObject(config?.data)) {
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
    config.statusCode = config.status ?? config?.data?.code ?? 500
  }

  return config
}

REQUEST.Defaults.retry = 0
REQUEST.Defaults.baseURL = process.env.BASE_URL
REQUEST.Defaults.transformResponse = (config) => {
  const { statusCode, data } = transformResponse(config)

  if (statusCode === 200 && data.code === 200) {
    return Promise.resolve(data.data)
  } else if (statusCode === 401) {
    router.jumpLogin()
  } else {
    toast.info(data?.msg || '请求失败')
  }

  return Promise.reject(data)
}

REQUEST.Listeners.onSend.push((config) => {
  mitt.trigger(EVENT_TYPE.REQUEST_EVENT, {
    eventName: 'onSend',
    eventLog: config
  })
})

REQUEST.Listeners.onResponse.push((data, config) => {
  mitt.trigger(EVENT_TYPE.REQUEST_EVENT, {
    eventName: 'onResponse',
    eventLog: {
      ...pick(config, keys),
      ...pick(data, ['statusCode', 'data'])
    }
  })
})

REQUEST.Listeners.onRejected.push((data, config) => {
  if (data && data.errMsg?.startsWith('request:fail')) {
    toast.info('请求错误，稍后再试')
  }

  mitt.trigger(EVENT_TYPE.REQUEST_EVENT, {
    eventName: 'onRejected',
    eventLog: {
      ...data,
      ...pick(config, keys)
    }
  })
})

const cleanUndefined = (data?: any) => {
  if (isPlainObject(data)) {
    Object.keys(data).forEach((key) => {
      if (isUndefined(data[key])) {
        data[key] = ''
      }
    })
  }
  return data
}

class Request {
  constructor() {}

  private transformRequestConfig <
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

  private setContentType <
    TReturn = SuccessParam<XHR.RequestOption>,
    TParams = ParamsType
  >(
    config: RequestConfig<TParams, {}, TReturn>,
    type?: ContentType
  ) {
    if (notNil(type)) {
      let value

      switch (type) {
        case 'json':
          value = 'application/json'
          break
        case 'form-data':
          value = 'application/x-www-form-urlencoded'
          break
      }

      config.headers!['Content-Type'] = value
    }

    return config
  }

  private method(method: NonNullable<XHR.RequestOption['method']>) {
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
      config = this.transformRequestConfig(config)!

      let type = config['type']

      if (isNil(type) && method === 'POST') {
        type = 'form-data'
      }

      if (notNil(type)) {
        config = this.setContentType(config, type)
      }

      return REQUEST.request<TReturn>(method, action, cleanUndefined(data), config)
    }
  }

  get = this.method('GET')
  post = this.method('POST')
  delete = this.method('DELETE')
  put = this.method('PUT')
  head = this.method('HEAD')
  trace = this.method('TRACE')
  connect = this.method('CONNECT')
  options = this.method('OPTIONS')
}

export default Request
