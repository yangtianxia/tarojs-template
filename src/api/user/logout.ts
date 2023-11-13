import request from '../utils'

export function postLogout() {
  return request.post('/logout')
}
