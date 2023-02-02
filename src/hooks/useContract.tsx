import { useContext } from 'react' 
import { UserContext } from 'src/context/UserContext'
export const useContract = () => useContext(UserContext)
