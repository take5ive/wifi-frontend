import { chainIds } from "data";

export enum CHAINID {
  Ethereum = chainIds.Ethereum,
  Polygon = chainIds.Polygon,
  Gnosis = chainIds.Gnosis,
  // Klaytn = chainIds.Klaytn,
}

export interface ChainData {
  id: CHAINID;
  name: string;
  symbol: string;
  rpcUrl: string;
  imgUrl: string;
  funnelAddress: string;
  wETHAddress: string;
  zeroX: {
    apiBaseUrl: string;
  } | null
}

/**
 * WrappedToken의 name, symbol은 Native token을 기준으로 한다.
 **/
export interface TokenData {
  chainId: CHAINID;
  decimals: number;
  symbol: string;
  address: string;
  name?: string;
  imgUrl?: string;
}

export type ProtocolType = "UniswapV2" | "ConnextBridge" | "WiFiBridge";
export type ProtocolUsage = "swap" | "bridge";

export interface UniswapV2Data {
  factoryAddress: string;
  routerAddress: string;
  wETHAddress: string;
}

export interface BridgeDataBase {
  coreAddress: string;
  fromToken: {
    chainId: CHAINID;
    address: string;
  };
  toToken: {
    chainId: CHAINID;
    address: string;
  };
}

export interface ConnextBridgeData extends BridgeDataBase {
  dstChainIdentifier: number;
  relayerGasFee: string;
  feeBps: number;
}

export interface WiFiBridgeData extends BridgeDataBase {
  feeBps: number;
}

export interface ProtocolData<T extends ProtocolType = any> {
  usage: ProtocolUsage;
  type: ProtocolType;
  name: string;
  chainId: CHAINID;
  data: T extends "UniswapV2"
    ? UniswapV2Data
    : T extends "ConnextBridge"
    ? ConnextBridgeData
    : T extends "WiFiBridge"
    ? WiFiBridgeData
    : any;
}
