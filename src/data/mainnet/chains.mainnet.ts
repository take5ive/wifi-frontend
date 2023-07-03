import MAINNET_CHAINID from "./chainIds.mainnet";
import { ChainData } from "interfaces/config-data.interface";

const MAINNET_CHAINS: { [chainId: number]: ChainData } = {
  [MAINNET_CHAINID.Ethereum]: {
    id: MAINNET_CHAINID.Ethereum,
    name: "Ethereum",
    symbol: "ETH",
    rpcUrl: "https://eth.llamarpc.com",
    imgUrl: "/icons/chain/ethereum.png",
    funnelAddress: "0x0000000000000000000000000000000000000001",
    wETHAddress: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
    zeroX: {
      apiBaseUrl: "https://api.0x.org",
    }    
  },
  [MAINNET_CHAINID.Polygon]: {
    id: MAINNET_CHAINID.Polygon,
    name: "Polygon",
    symbol: "MATIC",
    rpcUrl: "https://polygon.llamarpc.com",
    imgUrl: "/icons/chain/polygon.png",
    funnelAddress: "0x0000000000000000000000000000000000000001",
    wETHAddress: "0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270",
    zeroX: {
      apiBaseUrl: "https://polygon.api.0x.org/",
    }
  },
  [MAINNET_CHAINID.Gnosis]: {
    id: MAINNET_CHAINID.Gnosis,
    name: "Gnosis",
    symbol: "xDAI",
    rpcUrl: "https://rpc.ankr.com/gnosis",
    imgUrl: "https://docs.gnosischain.com/img/tokens/xdai.png",
    wETHAddress: "0x0000000000000000000000000000000000000001",
    funnelAddress: "0x0000000000000000000000000000000000000001",
    zeroX: null
  },
};

export default MAINNET_CHAINS;
