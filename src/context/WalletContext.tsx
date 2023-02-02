import { useReducer, createContext, useState, useEffect, type Dispatch } from 'react';
import { ActionType, StateType } from '../lib/types';
import { useApi } from 'src/hooks/useApi';

const initialState: StateType = {
  provider: null,
  web3Provider: null,
  address: null,
  chainId: null,
}

function reducer(state: StateType, action: ActionType): StateType {
 
  
  switch (action.type) {
    case 'SET_WEB3_PROVIDER': 
      return {
        ...state,
        provider: action.provider,
        web3Provider: action.web3Provider,
        address: action.address,
        chainId: action.chainId,
      }
    case 'SET_ADDRESS':
      return {
        ...state,
        address: action.address,
      }
    case 'SET_CHAIN_ID':
      return {
        ...state,
        chainId: action.chainId,
      }
    case 'RESET_WEB3_PROVIDER':
      return initialState
    default:
      throw new Error()
  }
}

export const StateContext = createContext({ state: initialState, dispatch: ((action) => reducer(initialState, action)) as Dispatch<any> });

export const StateContextProvider = ({ children }: any) => {
  // ** Hooks
  const useAPI = useApi() 
  const [state, dispatch] = useReducer(reducer, initialState)

  useEffect(() => { 
    if(state['address'] != null){
      useAPI.updateUser(state['address'], () => { })
    } 
  },[state])

  return <StateContext.Provider value={{ state, dispatch }}>{children}</StateContext.Provider>
}
