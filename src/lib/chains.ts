import { IChainData } from './types'

export const CHAIN_ID_ETHEREUM = 1;
export const CHAIN_ID_ETHEREUM_HEX = '0x1';
export const CHAIN_ID_BSC_TESTNET = 97;
export const CHAIN_ID_BSC_TESTNET_HEX = '0x61';

export const DEFAULT_CHAIN_ID = CHAIN_ID_ETHEREUM;
export const DEFAULT_CHAIN_ID_HEX = CHAIN_ID_ETHEREUM_HEX;

const supportedChains: IChainData[] = [
  {
    name: 'Ethereum Mainnet',
    short_name: 'eth',
    chain: 'ETH',
    network: 'mainnet',
    chain_id: CHAIN_ID_ETHEREUM,
    network_id: 1,
    rpc_url: `https://mainnet.infura.io/v3/${process.env.NEXT_PUBLIC_INFURA_ID}`,
    native_currency: {
      symbol: 'ETH',
      name: 'Ethereum',
      decimals: '18',
      contractAddress: '',
      balance: '',
    },
  },
  {
    name: 'Ethereum Ropsten',
    short_name: 'rop',
    chain: 'ETH',
    network: 'ropsten',
    chain_id: 3,
    network_id: 3,
    rpc_url: `https://ropsten.infura.io/v3/${process.env.NEXT_PUBLIC_INFURA_ID}`,
    native_currency: {
      symbol: 'ETH',
      name: 'Ethereum',
      decimals: '18',
      contractAddress: '',
      balance: '',
    },
  },
  {
    name: 'Ethereum Rinkeby',
    short_name: 'rin',
    chain: 'ETH',
    network: 'rinkeby',
    chain_id: 4,
    network_id: 4,
    rpc_url: `https://rinkeby.infura.io/v3/${process.env.NEXT_PUBLIC_INFURA_ID}`,
    native_currency: {
      symbol: 'ETH',
      name: 'Ethereum',
      decimals: '18',
      contractAddress: '',
      balance: '',
    },
  },
  {
    name: 'Binance Smart Chain',
    short_name: 'bsc',
    chain: 'smartchain',
    network: 'mainnet',
    chain_id: 56,
    network_id: 56,
    rpc_url: 'https://bsc-dataseed1.defibit.io/',
    native_currency: {
      symbol: 'BNB',
      name: 'BNB',
      decimals: '18',
      contractAddress: '',
      balance: '',
    },
  },
]

export default supportedChains
