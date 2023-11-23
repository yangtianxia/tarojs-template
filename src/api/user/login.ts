import request from '../utils'

interface LoginReturn {
  token: string
}

export interface LoginQuery {}

export function postLogin(data: LoginQuery) {
  return request.post<LoginReturn>('/loginBySms', data, {
    baseURL: 'https://test-api-system.weiqiatong.cn'
  })
}
