import type { Query, RouterQuery } from '@/router/types'
import { isString, isValidString, isPlainObject, isURL } from '@txjs/bool'

function cutQuery(value: string) {
  const foundAt = value.indexOf('?')

  if (foundAt !== -1) {
    return {
      value: value.slice(foundAt + 1),
      extra: value.slice(0, foundAt)
    }
  }
}

function patch(value: string, symbol: string, auto: boolean) {
  return `${auto ? symbol : ''}${value}`
}

function encode(value: string) {
  return isURL(value) ? encodeURIComponent(value) : value
}

export function isAbsolutePath(value: string) {
  return /^\/(?:[^/]+\/)*[^/]+$/i.test(value)
}

export function cutPath(value: string, symbol = '/') {
  let path = ''
  let query = {} as Query

  value = patch(value, symbol, !value.startsWith(symbol))

  if (isAbsolutePath(value)) {
    const result = cutQuery(value)

    if (result) {
      path = result.extra
      query = queryParse(
        result.extra
      )
    } else {
      path = value
    }
  }

  return { path, query }
}

export function queryParse(value?: RouterQuery) {
  if (isPlainObject(value)) {
    return value
  }

  const result = value && cutQuery(value)

  if (!result) {
    return {}
  }

  return result.value
    .split('&')
    .reduce(
      (query, cur) => {
        if (isValidString(cur)) {
          const index = cur.indexOf('=')
          const key = cur.slice(0, index)
          const param = cur.slice(index + 1, cur.length)
          query[key] = param
        }
        return query
      }, {} as Query
    )
}

export function queryStringify(query?: RouterQuery, auto = true, symbol = '?') {
  if (isString(query)) {
    return patch(query, symbol, auto && !query.startsWith(symbol))
  }

  const keys = query && Object.keys(query)

  if (!keys || !keys.length) return

  const result = keys
    .map((key) => `${key}=${encode(query[key])}`)
    .join('&')

  return patch(result, symbol, auto)
}
