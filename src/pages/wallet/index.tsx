import React, { useState, useEffect, useCallback } from 'react'
import ConnectWalletButton from '../../components/ConnectWalletButton';
import useGlobalState from '../../hooks/useGlobalState';
import { maxCounter } from '../../lib/consts';

export const Home = () => {

  const [countDown, setCountDown] = useState(maxCounter);
  const { provider, web3Provider, chainId, address } = useGlobalState();

  useEffect(() => {
    const interval = setInterval(() => {
      setCountDown(countDown - 1000);
    }, 1000);

    return () => clearInterval(interval);
  })

  const handleMint = useCallback(async () => {      
  }, [provider, web3Provider, chainId, address]); 

  return (
    <div>
      <main className="container mt-16 mx-auto w-full h-full flex flex-col justify-center items-center">
      <ConnectWalletButton />
        <button className={`btn-mint bg-green-500 cursor-pointer px-10 py-2 font-bold rounded-md text-white text-2xl`}  onClick={handleMint}>Mint</button>
        <br/>address: {address}<br/>
        <br/>chainId: {chainId}
      
      </main>
    </div>
  )
}

export default Home
