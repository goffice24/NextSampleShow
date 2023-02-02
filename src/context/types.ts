export type ErrCallbackType = (err: { [key: string]: string }) => void

export type LoginParams = {
  username: string
  password: string
}

export type RegisterParams = {
  name: string
  email: string
  avatar: string
  password: string
  history: string[]
  token: string
  role: string
  online: boolean
  other: string
}

export type VerifyParams = {
  email: string
  token: number
}

export type UserDataType = {
  _id: string
  role: string
  email: string
  name: string
  password: string
  avatar?: string | null
  history: string[]
  online: boolean
  other: string
  token: string
}

export type ResetPwType = {
  password: string
  access_token: string
}


export type AuthValuesType = {
  [x: string]: any
  loading: boolean
  setLoading: (value: boolean) => void
  logout: () => void
  isInitialized: boolean
  user: UserDataType | null
  setUser: (value: UserDataType | null) => void
  setIsInitialized: (value: boolean) => void
  login: (params: LoginParams, errorCallback?: ErrCallbackType) => void
  register: (params: RegisterParams, errorCallback?: ErrCallbackType) => void
  googleLogin: (params: any, errorCallback?: ErrCallbackType) => void
  verifyEmail: (params: VerifyParams, errorCallback?: ErrCallbackType) => void
  forgetPassword: (email: string, errorCallback?: ErrCallbackType) => void
  resetPassword: (params: ResetPwType, errorCallback?: ErrCallbackType) => void
}

export type UserValuesUpdateType = {
  updateUser: (params: string, errorCallback?: ErrCallbackType) => void
}

export type ContractValueType = {

}