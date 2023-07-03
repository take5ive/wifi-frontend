import { CHAINID } from "interfaces/config-data.interface";
import api from "./api";
import { DexPairDto } from "interfaces/dto/pair.dto";
import { InvestPair, PairToken } from "interfaces/invest-pair.interface";
import { Token } from "modules/Token";
import { ethers } from "ethers";
import { TOKENS } from "data";

const wethToNative = (chainId: CHAINID, t: PairToken) => {
  const allTokens = Token.getAll();
  const native = allTokens.find(
    (a) => a.chainId === chainId && a.address === ethers.constants.AddressZero
  )!;

  return t.symbol === "WETH"
    ? {
        symbol: native.symbol,
        decimals: 18,
        address: native.address,
      }
    : {
        symbol: t.symbol,
        decimals: t.decimals,
        address: ethers.utils.getAddress(t.address),
      };
};

export const getDexTopAprs = async () => {
  return api.get<DexPairDto>("dex/topAprs").then((res) =>
    res.data.pairSnapshots
      .map<InvestPair>((d) => {
        return {
          id: d.pairId,
          chainId: d.chainId,
          address: d.address,
          protocol: d.protocol,
          apr: d.apr,
          apy: d.apy,
          token0: wethToNative(d.chainId, d.token0),
          token1: wethToNative(d.chainId, d.token1),
        };
      })
      .filter(
        (t) =>
          TOKENS.find((tt) => tt.chainId === t.chainId && tt.address === t.token0.address) &&
          TOKENS.find((tt) => tt.chainId === t.chainId && tt.address === t.token1.address)
      )
  );
};
