import Web3Modal from 'web3modal';
import { providerOptions } from '../lib/consts';
import { useCallback, useEffect } from 'react'; 
import { ethers } from 'ethers';
import useGlobalState from '../hooks/useGlobalState';
import useDispatch from '../hooks/useDispatch';
import { DEFAULT_CHAIN_ID, DEFAULT_CHAIN_ID_HEX } from '../lib/chains';
import toast from 'react-hot-toast'
import AccountBalanceWalletOutlinedIcon from '@mui/icons-material/AccountBalanceWalletOutlined';
import WalletOutlinedIcon from '@mui/icons-material/WalletOutlined';

// ** Hooks 
import { useApi } from 'src/hooks/useApi'
import { IconButton } from '@mui/material'; 

let web3Modal: any;
if (typeof window !== 'undefined') {
  web3Modal = new Web3Modal({
    network: 'mainnet', // optional
    cacheProvider: true,
    providerOptions, // required
  });
}

function ConnectWalletButton() {
  const { provider, web3Provider, chainId } = useGlobalState()
  const dispatch = useDispatch()

  // ** Hooks
  const useAPI = useApi()

  const connect = useCallback(async function () {

    if (window && !window.ethereum) {
      toast.error("Please install metamask first.");
    }

    try {
      const provider = await web3Modal.connect()
      const web3Provider = new ethers.providers.Web3Provider(provider)
      const signer = web3Provider.getSigner()
      const address = await signer.getAddress()
      const network = await web3Provider.getNetwork()

      dispatch({
        type: 'SET_WEB3_PROVIDER',
        provider,
        web3Provider,
        address,
        chainId: network.chainId,
      })
    } catch (e) {
      // throw new Error("error");
      console.log(">>>>error", e)
    }

  }, [dispatch])

  useEffect(() => {
    if (provider && chainId !== DEFAULT_CHAIN_ID) {
      if (window && window.ethereum) {
        window.ethereum.request({ method: 'wallet_switchEthereumChain', params: [{ chainId: DEFAULT_CHAIN_ID_HEX }] });
      }
    }
  }, [])

  const disconnect = useCallback(
    async function () {
      await web3Modal.clearCachedProvider()
      if (provider?.disconnect && typeof provider.disconnect === 'function') {
        await provider.disconnect()
      }
      dispatch({
        type: 'RESET_WEB3_PROVIDER',
      })
    },
    [provider]
  )

  // Auto connect to the cached provider
  useEffect(() => {
    if (web3Modal.cachedProvider) {
      connect()
    }
  }, [connect])

  // A `provider` should come with EIP-1193 events. We'll listen for those events
  // here so that when a user switches accounts or networks, we can update the
  // local React state with that new information.
  useEffect(() => {
    if (provider?.on) {
      const handleAccountsChanged = (accounts: string[]) => {
        // eslint-disable-next-line no-console
        console.log('accountsChanged', accounts)
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        useAPI.updateUser(accounts[0], () => { })
        dispatch({
          type: 'SET_ADDRESS',
          address: accounts[0],
        })
      }

      // https://docs.ethers.io/v5/concepts/best-practices/#best-practices--network-changes
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const handleChainChanged = (_hexChainId: string) => {
        window.location.reload()
      }

      const handleDisconnect = (error: { code: number; message: string }) => {
        // eslint-disable-next-line no-console
        console.log('disconnect', error)
        disconnect()
      }

      provider.on('accountsChanged', handleAccountsChanged)
      provider.on('chainChanged', handleChainChanged)
      provider.on('disconnect', handleDisconnect)

      // Subscription Cleanup
      return () => {
        if (provider.removeListener) {
          provider.removeListener('accountsChanged', handleAccountsChanged)
          provider.removeListener('chainChanged', handleChainChanged)
          provider.removeListener('disconnect', handleDisconnect)
        }
      }
    }
  }, [provider, disconnect, dispatch])

  return web3Provider ? (
    <IconButton aria-label="upload picture" component="span" onClick={disconnect}>
      <WalletOutlinedIcon style={{ color: 'd1d1e7' }} />
    </IconButton>
  ) : (
    <>
      {/* <Button fullWidth variant='contained' onClick={connect}>Co </Button> */}
      <IconButton aria-label="upload picture" component="span" onClick={connect}>
        < AccountBalanceWalletOutlinedIcon style={{ color: 'd1d1e7' }} />
      </IconButton>

    </>
  )
}

export default ConnectWalletButton;
