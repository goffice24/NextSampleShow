// ** Types
import { ThemeColor } from 'src/@core/layouts/types'

export type UserLayoutType = {
  id: string | undefined
}

export type UsersType = {
  _id: string
  role: string
  email: string 
  avatar: string 
  history: string[] 
  name: string 
  online: boolean
  other: string
  avatarColor?: ThemeColor
}
