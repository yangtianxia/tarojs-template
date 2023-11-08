export interface UserState {
  id?: number
  name?: string
  avatar?: string
  nickName?: string
  phone?: string
  email?: string
  introduction?: string
}

export interface UserStateCustom {
  loading: boolean
}
