// ** React Imports
import { createContext, useEffect, useState, ReactNode } from 'react'

// ** Next Import
import { useRouter } from 'next/router'

// ** Axios
import axios from 'axios'

// ** Config
import authConfig from 'src/configs/auth'

// ** Types
import { AuthValuesType, RegisterParams, LoginParams, ErrCallbackType, UserDataType, VerifyParams, ResetPwType } from './types'


// ** Defaults
const defaultProvider: AuthValuesType = {
  user: null,
  loading: true,
  setUser: () => null,
  setLoading: () => Boolean,
  isInitialized: false,
  login: () => Promise.resolve(),
  logout: () => Promise.resolve(),
  setIsInitialized: () => Boolean,
  register: () => Promise.resolve(),
  googleLogin: () => Promise.resolve(),
  verifyEmail: () => Promise.resolve(),
  forgetPassword: () => Promise.resolve(),
  resetPassword: () => Promise.resolve(),
}

const AuthContext = createContext(defaultProvider)

type Props = {
  children: ReactNode
}

const AuthProvider = ({ children }: Props) => {
  // ** States
  const [user, setUser] = useState<UserDataType | null>(defaultProvider.user)
  const [loading, setLoading] = useState<boolean>(defaultProvider.loading)
  const [isInitialized, setIsInitialized] = useState<boolean>(defaultProvider.isInitialized)

  // ** Hooks
  const router = useRouter()

  useEffect(() => {
    const initAuth = async (): Promise<void> => {
      setIsInitialized(true)
      const storedToken = window.localStorage.getItem(authConfig.storageTokenKeyName)!
      if (storedToken) {
        setLoading(true)
        const u = window.localStorage.getItem('userData')
        if (u != null) {
          const user = JSON.parse(u);
          setLoading(false)
          setUser(user)
        } else {
          localStorage.removeItem('userData')
          localStorage.removeItem('refreshToken')
          localStorage.removeItem('accessToken')
          setUser(null)
          setLoading(false)
        }
      } else {
        setLoading(false)
      }
    }
    initAuth()
  }, [])


  const handleGoogleLogin = (params: any, errorCallback?: ErrCallbackType) => {
    const url = process.env.NEXT_PUBLIC_API_HOST + authConfig.apiGoogleEndpoint;
    axios
      .post(url, params)
      .then(async res => {
        window.localStorage.setItem(authConfig.storageTokenKeyName, 'Bearer ' + res.data.access_token)
      })
      .then(() => {
        const url = process.env.NEXT_PUBLIC_API_HOST + authConfig.meEndpoint;
        axios
          .get(url, {
            headers: {
              Authorization: window.localStorage.getItem(authConfig.storageTokenKeyName)!
            }
          })
          .then(async response => {
            const returnUrl = router.query.returnUrl
            const u = response.data.data;
            const user = {
              _id: u._id,
              role: u.role,
              email: u.email,
              name: u.name,
              password: u.password,
              avatar: u.avatar,
              history: u.history,
              token: "",
              online: true,
              other: ""
            }
            setUser(user)
            await window.localStorage.setItem('userData', JSON.stringify(user))
            const redirectURL = returnUrl && returnUrl !== '/' ? returnUrl : '/'
            router.replace(redirectURL as string)
          })
      })
      .catch(err => {
        if (errorCallback) errorCallback(err)
      })
  }

  const handleLogin = (params: LoginParams, errorCallback?: ErrCallbackType) => {
    const url = process.env.NEXT_PUBLIC_API_HOST + authConfig.apiLoginEndpoint;
    axios
      .post(url, params)
      .then(async res => {
        window.localStorage.setItem(authConfig.storageTokenKeyName, 'Bearer ' + res.data.access_token)
      })
      .then(() => {
        const url = process.env.NEXT_PUBLIC_API_HOST + authConfig.meEndpoint;
        axios
          .get(url, {
            headers: {
              Authorization: window.localStorage.getItem(authConfig.storageTokenKeyName)!
            }
          })
          .then(async response => {
            const returnUrl = router.query.returnUrl
            const u = response.data.data;
            const user = {
              _id: u._id,
              role: u.role,
              email: u.email,
              name: u.name,
              password: u.password,
              avatar: u.avatar,
              history: u.history,
              token: "",
              online: true,
              other: ""
            }
            setUser(user)
            await window.localStorage.setItem('userData', JSON.stringify(user))
            const redirectURL = returnUrl && returnUrl !== '/' ? returnUrl : '/'
            router.replace(redirectURL as string)
          })
      })
      .catch(err => {
        if (errorCallback) errorCallback(err)
      })
  }

  const handleLogout = () => {
    setUser(null)
    setIsInitialized(false)
    window.localStorage.removeItem('userData')
    window.localStorage.removeItem(authConfig.storageTokenKeyName)
    router.push('/login')
  }

  const handleRegister = (params: RegisterParams, errorCallback?: ErrCallbackType) => {
    const url = process.env.NEXT_PUBLIC_API_HOST + authConfig.apiRegistEndpoint;
    axios
      .post(url, params)
      .then((res) => {
        if (res.data.error) {
          if (errorCallback) errorCallback(res.data.error)
        } else {
          handleLogin({ username: params.email, password: params.password })
        }
      })
      .catch((err: { [key: string]: string }) => (errorCallback ? errorCallback(err) : null))

  }

  const handleVerify = (params: VerifyParams) => {
    const url = process.env.NEXT_PUBLIC_API_HOST + authConfig.apiVerifyEndpoint;
    axios
      .post(url, params)
      .then((r) => {
        return r.data;
      })
  }

  const handleForgetpassword = (email: string) => {
    const url = process.env.NEXT_PUBLIC_API_HOST + authConfig.apiForgetpasswordEndpoint;
    axios
      .post(url, { email })
      .then((r) => {
        return r.data;
      })
  }

  const handleResetpassword = (params: ResetPwType) => {
    const url = process.env.NEXT_PUBLIC_API_HOST + authConfig.apiResetpasswordEndpoint;
    axios
      .post(url,
        {
          password: params.password
        },
        {
          headers: {
            Authorization: params.access_token
          },
        }
      )
      .then((r) => {
        return r.data;
      })
  }

  const values = {
    user,
    loading,
    setUser,
    setLoading,
    isInitialized,
    setIsInitialized,
    login: handleLogin,
    logout: handleLogout,
    register: handleRegister,
    googleLogin: handleGoogleLogin,
    verifyEmail: handleVerify,
    forgetPassword: handleForgetpassword,
    resetPassword: handleResetpassword
  }

  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>
}

export { AuthContext, AuthProvider }
