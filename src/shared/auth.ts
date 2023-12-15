import extend from 'extend'
import { getStorageSync, setStorageSync, removeStorageSync } from '@tarojs/taro'
import { notNil } from '@txjs/bool'
import { makeString } from '@txjs/make'
import type { UserState } from '@/store/modules/user/types'

const TOKEN_KEY = 'token'
const USER_KEY = 'userinfo'

let currentToken = makeString()
let currentUserInfo = null as UserState | null

export const getToken = (): typeof currentToken => {
  if (notNil(currentToken)) {
    return currentToken
  }

  try {
    const value = getStorageSync(TOKEN_KEY)
    if (value == '') {
      throw new Error('token is empty')
    }
    currentToken = value
    return value
  } catch {
    return undefined
  }
}

export const setToken = (value: string) => {
  setStorageSync(TOKEN_KEY, value)
  currentToken = value
}

export const clearToken = () => {
  removeStorageSync(TOKEN_KEY)
  currentToken = undefined
}

export const getUser = (): typeof currentUserInfo => {
  if (notNil(currentUserInfo)) {
    return currentUserInfo
  }

  try {
    const value = getStorageSync(USER_KEY)
    if (value == '') {
      throw new Error('user info is empty')
    }
    currentUserInfo = value
    return value
  } catch {
    return null
  }
}

export const setUser = (partial: Partial<UserState>) => {
  // 更新用户信息前
  // 预先读取一次本地以更新缓存
  getUser()
  currentUserInfo = extend(true, currentUserInfo, partial)
  setStorageSync(USER_KEY, currentUserInfo)
}

export const clearUser = () => {
  removeStorageSync(USER_KEY)
  currentUserInfo = null
}

export const isLogin = () => {
  return notNil(getToken()) && notNil(getUser())
}
