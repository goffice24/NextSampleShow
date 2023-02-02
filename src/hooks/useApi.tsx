import { useContext } from 'react' 
import { UserContext } from 'src/context/UserContext'
export const useApi = () => useContext(UserContext)
