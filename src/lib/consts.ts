import WalletConnectProvider from '@walletconnect/web3-provider';
import WalletLink from 'walletlink';

export const providerOptions = {
  walletconnect: {
    package: WalletConnectProvider, // required
    options: {
      infuraId: process.env.NEXT_PUBLIC_INFURA_ID, // required
    },
  },
  'custom-walletlink': {
    display: {
      logo: 'https://play-lh.googleusercontent.com/PjoJoG27miSglVBXoXrxBSLveV6e3EeBPpNY55aiUUBM9Q1RCETKCOqdOkX2ZydqVf0',
      name: 'Coinbase',
      description: 'Connect to Coinbase Wallet (not Coinbase App)',
    },
    options: {
      appName: 'Coinbase', // Your app name
      networkUrl: `https://mainnet.infura.io/v3/${process.env.NEXT_PUBLIC_INFURA_ID}`,
      chainId: 1,
    },
    package: WalletLink,
    connector: async (_: any, options: any) => {
      const { appName, networkUrl, chainId } = options;
      const walletLink = new WalletLink({
        appName,
      });
      const provider = walletLink.makeWeb3Provider(networkUrl, chainId);
      await provider.enable();

      return provider;
    },
  },
};


export const passNFT_address = '0xa3DDAf083e491ecd5CbdCbd7DcC504cA7c0f2408';
export const maxCounter = 1 * 60 * 1000;

export const busd_address = "0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56";
export const spin_busd_address = "0x7919d8f40Ad0C6480969113A4447EeA14cE35E99";
export const flip_busd_address = "0x661A1c25f878bf17Aadb9b9276076699c270505a"
export const luck_busd_address = "0xf3dFbB65733FD1E80735c27313316c65D79C4d5a"

export const spinAmount = 50
export const filpAmount = 50
export const luckTeamAmount = 50

export const busd_test_address = "0xeD24FC36d5Ee211Ea25A80239Fb8C4Cfd80f12Ee";
export const spin_test_busd_address = "0xF4f4BBeea2ba6E8dF0f3388dd22EC0CdC15d2977";
export const flip_test_busd_address = "0xa9192eD8ef621f1c349F04Bb45E29e6F9C8139B0"
export const luck_test_busd_address = "0xB9b04fF76B5292bf1af1d1B462AB2360DB8EAFCe"


