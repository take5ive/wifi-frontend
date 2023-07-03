export interface ZeroXQuoteDto {
  chainId: number;
  price: string;
  guaranteedPrice: string;
  estimatedPriceImpact: string;
  to: string;
  data: string;
  value: string;
  gas: string;
  estimatedGas: string;
  gasPrice: string;
  protocolFee: string;
  minimumProtocolFee: string;
  buyTokenAddress: string;
  sellTokenAddress: string;
  buyAmount: string;
  sellAmount: string;
  sources: {
    name: string;
    proportion: string;
  }[];
  orders: {
    makerToken: string;
    takerToken: string;
    makerAmount: string;
    takerAmount: string;
    fillData: {
      tokenAddressPath: string[];
      router: string[];
    };
    source: string;
    sourcePathId: string;
    type: number;
  }[];
  allowanceTarget: string;
  sellTokenToEthRate: string;
  buyTokenToEthRate: string;
  fees: {
    zeroExFee: null;
  };
  grossPrice: string;
  grossBuyAmount: string;
  grossSellAmount: string;
}
