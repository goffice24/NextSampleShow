// ** React Imports
import { useState, useEffect } from 'react'

// ** Next Import
import Link from 'next/link'

// ** MUI Imports
import Grid from '@mui/material/Grid'
import Alert from '@mui/material/Alert'

// ** Third Party Components
import axios from 'axios'

// ** Types
// import { InvoiceType } from 'src/types/apps/invoiceTypes'
// import { UserLayoutType, UsersType } from 'src/types/apps/userTypes'

// ** Demo Components Imports
import UserViewLeft from 'src/views/apps/user/view/UserViewLeft'
import UserViewRight from 'src/views/apps/user/view/UserViewRight'

// ** Config
import authConfig from 'src/configs/auth'

// ** Hooks
import { useAuth } from 'src/hooks/useAuth'
import { UsersType } from 'src/types/apps/userTypes'

// ** Types 
// import { useRouter } from 'next/router'

 

const UserView = ({ id }: any) => {

  const auth = useAuth()  
  
  // ** State
  const [error, setError] = useState<boolean>(false)
  const [data, setData] = useState<null | UsersType>(null)

  useEffect(() => {  
    const url = process.env.NEXT_PUBLIC_API_HOST + "/api/users/" + id 
    axios
      .get(url, { headers: { Authorization: window.localStorage.getItem(authConfig.storageTokenKeyName)! } })
      .then(response => { 
        const d = response.data;
        const u = {
          _id: d._id,
          role: d.role,
          email: d.email, 
          avatar: d.avatar, 
          history: d.history, 
          name: d.name, 
          online: d.online,
          other: d.other 
        }
        setData(u)
        setError(false)
      })
      .catch((e) => { 
        if(e.response.status == 401){
          auth.logout();
        }
        setData(null)
        setError(true)
        
      })
  }, [id, auth])

  if (data) {
    return (
      <Grid container spacing={6}>
        <Grid item xs={12} md={5} lg={4}>
          <UserViewLeft data={data} />
        </Grid>
        <Grid item xs={12} md={7} lg={8}>
          <UserViewRight />
        </Grid>
      </Grid>
    )
  } else if (error) {
    return (
      <Grid container spacing={6}>
        <Grid item xs={12}>
          <Alert severity='error'>
            User with the id: {id} does not exist. Please check the list of users:{' '}
            <Link href='/apps/user/list'>User List</Link>
          </Alert>
        </Grid>
      </Grid>
    )
  } else {
    return null
  } 
  
}

export default UserView
