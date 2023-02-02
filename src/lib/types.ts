export interface IAssetData {
  symbol: string
  name: string
  decimals: string
  contractAddress: string
  balance?: string
}

export interface IChainData {
  name: string
  short_name: string
  chain: string
  network: string
  chain_id: number
  network_id: number
  rpc_url: string
  native_currency: IAssetData
}

export type StateType = {
  provider?: any
  web3Provider?: any
  address?: any
  chainId?: any
}

export type ActionType =
  | {
    type: 'SET_WEB3_PROVIDER'
    provider?: StateType['provider']
    web3Provider?: StateType['web3Provider']
    address?: StateType['address']
    chainId?: StateType['chainId']
  }
  | {
    type: 'SET_ADDRESS'
    address?: StateType['address']
  }
  | {
    type: 'SET_CHAIN_ID'
    chainId?: StateType['chainId']
  }
  | {
    type: 'RESET_WEB3_PROVIDER'
  }
