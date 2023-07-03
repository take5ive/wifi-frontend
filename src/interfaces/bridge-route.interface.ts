export interface BridgeRoute {
  srcChain: number;
  srcAddr: string;
  srcDecimals: number;
  srcSymbol: string;
  dstChain: number;
  dstAddr: string;
  dstDecimals: number;
  dstSymbol: string;
  bridge: string;
}
