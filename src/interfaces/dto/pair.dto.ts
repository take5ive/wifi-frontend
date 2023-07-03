interface TokenDto {
  address: string;
  symbol: string;
  decimals: number;
}

interface PairSnapshotDto {
  chainId: 10200;
  pairId: string;
  token0: TokenDto;
  token1: TokenDto;
  address: string;
  snapshotTimestamp: number;
  reserveUSD: number;
  volumeUSD: number;
  apr: number;
  apy: number;
  protocol: string;
}

export interface DexPairDto {
  pairSnapshots: PairSnapshotDto[];
}
