// ** React Imports
import { createContext, useEffect, useState, ReactNode } from 'react'

// ** Next Import
import { useRouter } from 'next/router'

// ** Axios
import axios from 'axios'

// ** Config
import authConfig from 'src/configs/auth'
import apiEndpoint from 'src/configs/apiEndpoint'

// ** Types
import { UserValuesUpdateType, ErrCallbackType } from './types'
import { ConsoleLine } from 'mdi-material-ui'


// ** Defaults
const defaultProvider: UserValuesUpdateType = {
  updateUser: () => Promise.resolve(),
}

const UserContext = createContext(defaultProvider)

type Props = {
  children: ReactNode
}

const UserUpdateProvider = ({ children }: Props) => {

  const handleUpdateUser = (params: string, errorCallback?: ErrCallbackType) => {
    const u = window.localStorage.getItem('userData') 
    if (u != null) {
      const user = JSON.parse(u);
      const id = user["_id"];
      const url = process.env.NEXT_PUBLIC_API_HOST + apiEndpoint.userEndpoint + "/" + id;
      axios
        .patch(
          url,
          { token: params },
          {
            headers: {
              Authorization: window.localStorage.getItem(authConfig.storageTokenKeyName)!
            }
          })
        .then(async response => {
          if (response.status == 200) {
          } else {
          }
        })
        .catch((e) => {
          console.log("ERR", e)
        })
    }
  }

  const values = {
    updateUser: handleUpdateUser
  }

  return <UserContext.Provider value={values}>{children}</UserContext.Provider>
}

export { UserContext, UserUpdateProvider }
