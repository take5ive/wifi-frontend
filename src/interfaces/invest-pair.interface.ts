export interface PairToken {
  symbol: string;
  decimals: number;
  address: string;
}
export interface InvestPair {
  id: string;
  chainId: number;
  address: string;
  protocol: string;
  apr: number;
  apy: number;
  token0: PairToken;
  token1: PairToken;
}
