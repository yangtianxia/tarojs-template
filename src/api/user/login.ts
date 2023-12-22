interface LoginReturn {
  token: string
}

export interface LoginQuery {}

export function postLogin(data: LoginQuery) {
  return request.post<LoginReturn>('/login', data)
}
