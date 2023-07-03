import TESTNET_CHAINID from "./chainIds.testnet";
import { ChainData } from "interfaces/config-data.interface";

const TESTNET_CHAINS: { [chainId: number]: ChainData } = {
  [TESTNET_CHAINID.Ethereum]: {
    id: TESTNET_CHAINID.Ethereum,
    name: "Goerli",
    symbol: "ETH",
    rpcUrl: "https://rpc.ankr.com/eth_goerli",
    imgUrl: "/icons/chain/ethereum.png",
    funnelAddress: "0x875F627F19fA1846AE0eD05548b53b677891b559",
    wETHAddress: "0x227A02c6617f02a40a28570E8F272b528aC42cfB",
    zeroX:{
      apiBaseUrl: "https://goerli.api.0x.org",
    }
  },
  [TESTNET_CHAINID.Polygon]: {
    id: TESTNET_CHAINID.Polygon,
    name: "Polygon",
    symbol: "MATIC",
    rpcUrl: "https://rpc.ankr.com/polygon_mumbai",
    imgUrl: "/icons/chain/polygon.png",
    funnelAddress: "0x4044C8f6c35567a033396679BDAAEbc9B95ddCe0",
    wETHAddress: "0x3a4E2BB60048Efe94cbCB8092651fbFDD2FBF595",
    zeroX:{
      apiBaseUrl: "https://mumbai.api.0x.org",
    }
  },
  // [TESTNET_CHAINID.Binance]: {
  //   id: TESTNET_CHAINID.Binance,
  //   name: "Binance",
  //   symbol: "BNB",
  //   rpcUrl: "https://data-seed-prebsc-1-s1.binance.org:8545",
  //   imgUrl: "/icons/chain/binance.png",
  //   funnelAddress: "0x41dDC4b63c24d8E2892C7f7bA6DaabF9B36f6290",
  //   wETHAddress: ""
  // },
  // [TESTNET_CHAINID.Klaytn]: {
  //   id: TESTNET_CHAINID.Klaytn,
  //   name: "Klaytn",
  //   symbol: "KLAY",
  //   rpcUrl: "https://public-node-api.klaytnapi.com/v1/baobab",
  //   imgUrl: "/icons/chain/klaytn.png",
  //   funnelAddress: "0x0000000000000000000000000000000000000001",
  //   wETHAddress: "",
  // },
  [TESTNET_CHAINID.Gnosis]: {
    id: TESTNET_CHAINID.Gnosis,
    name: "Chiado",
    symbol: "xDAI",
    rpcUrl: "https://rpc.chiadochain.net",
    imgUrl: "https://docs.gnosischain.com/img/tokens/chiado-xdai.png",
    funnelAddress: "0x9f65d8E5c6947a4D6B11B3059e174C48F9b8c516",
    wETHAddress: "0x42A7ddC4C5814eDD824353BD9CbdCB4D2f1AAdce",
    zeroX: null
  },
  // [TESTNET_CHAINID.Aurora]: {
  //   id: TESTNET_CHAINID.Aurora,
  //   name: "Aurora",
  //   symbol: "ETH",
  //   rpcUrl: "https://testnet.aurora.dev",
  //   imgUrl: "/icons/chain/aurora.png",
  //   funnelAddress: "0x9f65d8E5c6947a4D6B11B3059e174C48F9b8c516",
  //   wETHAddress: "0x8B2Fc15A64b0e3c0950E10D3FeD032BC2D409cB6",
  // },
};

export default TESTNET_CHAINS;
