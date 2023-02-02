
// ** Types 
import { useRouter } from 'next/router'

// ** Demo Components Imports
import UserViewPage from 'src/views/apps/user/view/UserViewPage'

const UserView = ( ) => {
  const router = useRouter()  
  
return <UserViewPage id={router.query.id}  /> 
} 

UserView.acl = {
  action: 'manage',
  subject: 'customer-page'
}
 
export default UserView
