import { defineStore } from 'pinia'
import { makeString, makeNumber } from '@txjs/make'
import { setToken, clearToken, getUser, clearUser, isLogin } from '@/shared/auth'

import { getUserInfo } from '@/api/user/user-info'
import { postLogin, type LoginQuery } from '@/api/user/login'
import { postLogout } from '@/api/user/logout'

import type { UserState, UserStateCustom } from './types'

const useUserStore = defineStore('user', {
  state: (): UserState & UserStateCustom => ({
    loading: false,
    // 用户资料
    id: makeNumber(),
    name: makeString(),
    avatar: makeString(),
    nickName: makeString(),
    phone: makeString(),
    email: makeString(),
    introduction: makeString()
  }),

  getters: {
    userInfo(state: UserState): UserState {
      return { ...state }
    }
  },

  actions: {
    /** 初始化登录用户信息 */
    init() {
      const userInfo = getUser()

      if (isLogin()) {
        this.setInfo(userInfo)
      }
    },

    setInfo(partial: Partial<UserState>) {
      this.$patch(partial)
    },

    resetInfo() {
      this.$reset()
    },

    async getUserInfo() {
      const result = await getUserInfo()
      this.setInfo(result)
    },

    async getUserInfoSync() {
      this.loading = true
      try {
        await this.getUserInfo()
      } finally {
        this.loading = false
      }
    },

    async login(loginForm: LoginQuery) {
      try {
        const result = await postLogin(loginForm)
        setToken(result.token)
      } catch (error) {
        clearToken()
        throw error
      }
    },

    logoutCallback() {
      this.resetInfo()
      clearToken()
      clearUser()
    },

    async logout() {
      try {
        await postLogout()
      } finally {
        this.logoutCallback()
      }
    }
  }
})

export default useUserStore
