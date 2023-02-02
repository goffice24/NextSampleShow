import { useContext } from 'react';
import { StateContext } from '../context/WalletContext';

const useDispatch = () => {
  const stateContext = useContext(StateContext);
  if (stateContext === undefined) {
    throw new Error('Global context undefined');
  }
  return stateContext.dispatch;                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              
}

export default useDispatch;
