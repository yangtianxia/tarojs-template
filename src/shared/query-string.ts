import { isPlainObject, isValidString, isURL, isNil } from '@txjs/bool'

export type URLParams = Record<string, any>

const PARAMS_CONNECT_SYMBOL = '?'

function cutURL(input: string) {
  const foundAt = input.indexOf(PARAMS_CONNECT_SYMBOL)

  if (foundAt !== -1) {
    return {
      extra: input.slice(0, foundAt),
      value: input.slice(foundAt + 1)
    }
  }
}

function encoded(input: string) {
  return isURL(input) ? encodeURIComponent(input) : input
}

function splicing(input: string, symbol: string, autofill: boolean) {
  if (!autofill) {
    symbol = ''
  }
  return `${symbol}${input}`
}

export function isAbsolutePath(input: string) {
  return /^\/(?:[^/]+\/)*[^/]+$/i.test(input)
}

export function pathParser(input: string) {
  let path = ''
  let params = {} as URLParams

  input = splicing(input, '/', !input.startsWith('/'))

  if (isAbsolutePath(input)) {
    const result = cutURL(input)

    if (result) {
      path = result.extra
      params = queryParser(
        result.value
      )
    } else {
      path = input
    }
  }

  return { path, params }
}

export function queryParser(input?: string | URLParams) {
  if (isPlainObject(input)) {
    return input
  }

  const params = {} as URLParams
  const result = input && cutURL(input)

  if (result) {
    const searchParams = result.value.split('&')

    while (searchParams.length) {
      const param = searchParams.pop()

      if (isValidString(param)) {
        const foundAt = param.indexOf('=')
        const key = param.slice(0, foundAt)
        const value = param.slice(foundAt + 1, param.length)
        params[key] = value
      }
    }
  }

  return params
}

export function queryStringify(input?: string | URLParams, autofill = true) {
  if (isNil(input)) return

  if (isPlainObject(input)) {
    const keys = Object.keys(input)
    const searchParams = [] as string[]

    while (keys.length) {
      const key = keys.pop()!
      const param = input[key]
      searchParams.push(`${key}=${encoded(param)}`)
    }

    input = searchParams.join('&')
  }

  return splicing(input, PARAMS_CONNECT_SYMBOL, autofill && !input.startsWith(PARAMS_CONNECT_SYMBOL))
}
