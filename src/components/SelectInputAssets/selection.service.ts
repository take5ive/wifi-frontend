import { useState, Dispatch } from "react";
import { TokenAmount } from "interfaces/token-amount.interface";
import { Token } from "modules/Token";
import { useBalanceList } from "states/balances.state";

interface TokenWithBalance {
  token: Token;
  balance: string;
}

interface NoBalanceTokens {
  [chainId: number]: Token[];
}
export interface TokenHandler {
  token: Token;
  balance: string;
  inputAmount: string;
  setInputAmount: (amount: string) => void;
}

export const useSelectInputAssets = (
  setTokenAmounts: Dispatch<React.SetStateAction<TokenAmount[]>>
) => {
  const tokens = Token.getAll();
  const balances = useBalanceList(tokens);
  const isLoading = balances.every((b) => b === "");

  // balance가 0 이상으로, 투자 가능한 토큰들의 모임
  // balance가 0이라서 투자할 수 없는 토큰들의 모임
  let [tokenWithBalances, noBalanceTokens] = tokens.reduce(
    ([tokenWithBalances, noBalanceTokens], token, i) => {
      if (+balances[i] > 0) {
        tokenWithBalances.push({ token, balance: balances[i] });
      } else {
        noBalanceTokens[token.chainId] = noBalanceTokens[token.chainId] || [];
        noBalanceTokens[token.chainId].push(token);
      }
      return [tokenWithBalances, noBalanceTokens];
    },
    [[], {}] as [TokenWithBalance[], NoBalanceTokens]
  );

  tokenWithBalances = tokenWithBalances.sort((a, b) => +b.balance - +a.balance);

  const [amounts, setAmounts] = useState<string[]>(
    Array(tokens.length).fill("")
  );

  const setInputAmount = (index: number) => (amount: string) => {
    setAmounts((prev) => {
      const next = [...prev];
      next[index] = amount;
      return next;
    });
    setTokenAmounts((prev) => {
      const next = [...prev];
      const { token } = tokenWithBalances[index];
      const i = prev.findIndex((t) => t.token.id === token.id);
      if (i !== -1) {
        if (+amount > 0) {
          next[i].amount = amount;
        } else {
          next.splice(i, 1);
        }
      } else if (+amount > 0) {
        next.push({ token, amount });
      }
      return next;
    });
  };

  const tokenHandlers = tokenWithBalances.map<TokenHandler>(
    ({ token, balance }, i) => ({
      token,
      balance,
      inputAmount: amounts[i],
      setInputAmount: setInputAmount(i),
    })
  );

  return {
    isLoading,
    tokenHandlers,
    noBalanceTokens: Object.entries(noBalanceTokens),
  };
};
