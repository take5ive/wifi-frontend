import CHAINS from "data/testnet/chains.testnet";
import UniswapV2Funnel_ABI from "abi/uniswapV2/UniswapV2Funnel.json";
import { Contract, providers } from "ethers";
import { CHAINID, ChainData } from "interfaces/config-data.interface";
import { UniswapV2Funnel } from "typechain";

export class Chain implements ChainData {
  id!: CHAINID;
  name!: string;
  symbol!: string;
  rpcUrl!: string;
  imgUrl!: string;
  funnelAddress!: string;
  wETHAddress!: string;
  zeroX!: { apiBaseUrl: string } | null;

  constructor(chainData: ChainData) {
    Object.assign(this, chainData);
  }

  getProvider() {
    return new providers.JsonRpcProvider(this.rpcUrl);
  }

  static get(chainId: CHAINID): Chain {
    return new Chain(CHAINS[chainId]);
  }

  static getAll(): Chain[] {
    return Object.values(CHAINS).map((c) => new Chain(c));
  }

  getFunnel(): UniswapV2Funnel {
    return new Contract(
      this.funnelAddress,
      UniswapV2Funnel_ABI,
      this.getProvider()
    ) as UniswapV2Funnel;
  }
}
