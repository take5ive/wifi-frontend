import { Token } from "modules/Token";

export const substituteWETH = (token: Token) => {
  const WETH = token.getChain().wETHAddress;
  return token.isNativeToken()
    ? new Token({
        chainId: token.chainId,
        decimals: 18,
        symbol: "WETH",
        address: WETH,
        name: "Wrapped Ether",
      })
    : token;
};
