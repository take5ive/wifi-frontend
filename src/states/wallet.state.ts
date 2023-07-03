import {
  atom,
  useRecoilState,
  useRecoilValue,
  useResetRecoilState,
} from "recoil";
import { connectMetamask } from "../utils/metamask";
import { CHAINID } from "interfaces/config-data.interface";
import { providers } from "ethers";
import { useNavigate } from "react-router-dom";
import { recoilPersist } from "recoil-persist";
import {useAccount as useWagmiAccount, useNetwork as useWagmiNetwork, useWalletClient} from "wagmi"

const { persistAtom } = recoilPersist();
export const accountAtom = atom<string | null>({
  key: "atom/account",
  default: null,
  effects_UNSTABLE: [persistAtom],
});

export const chainIdAtom = atom<number>({
  key: "atom/chainId",
  default: CHAINID.Ethereum,
  effects_UNSTABLE: [persistAtom],
});

export const useWallet = () => {
  const {address: account} = useWagmiAccount()
  const { chain } = useWagmiNetwork()

  // const account = useRecoilValue(accountAtom);
  // const chainId = useRecoilValue(chainIdAtom);
  return {
    account,
    chainId: chain?.id,
  };
};

export const useConnectWallet = () => {
  const [account, setAccount] = useRecoilState(accountAtom);
  const [chainId, setChainId] = useRecoilState(chainIdAtom);
  const resetChainId = useResetRecoilState(chainIdAtom);
  const nav = useNavigate();

  const connect = async () => {
    const res = await connectMetamask();
    if (!res || !res.ok) return nav("/");

    setAccount(res!.account);
    setChainId(res!.chainId);
  };

  const disconnect = async () => {
    setAccount(null);
    resetChainId();
    localStorage.clear();
  };

  //@ts-ignore
  window.ethereum?.on("accountsChanged", (accounts: string[]) => {
    setAccount(accounts[0] ?? null);
  });
  //@ts-ignore
  window.ethereum?.on("chainChanged", (chainId: string) => {
    setChainId(+chainId);
    // nav("/");
  });

  return {
    account,
    chainId,
    connect,
    disconnect,
  };
};

export const useSigner = () => {
  // const { data: walletClient, isError, isLoading } = useWalletClient()
  // const account = useRecoilValue(accountAtom);
  const {address: account} = useWagmiAccount()

  return {
    signer:
      account && window.ethereum
        ? // @ts-ignore
          new providers.Web3Provider(window.ethereum!).getSigner()
        : null,
    account,
  };
};
