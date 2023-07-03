import { CHAINID } from "interfaces/config-data.interface";
import { Chain } from "modules/Chain";
import { Token } from "modules/Token";
import { ChangeEventHandler, useEffect, useState } from "react";

export const useDestinationToken = () => {
  const allTokens = Token.getAll();
  const allChains = Chain.getAll();

  const [preferredChain, setPreferredChain] = useState<CHAINID>(
    allChains[0].id
  );
  const [selectedTokenId, selectToken] = useState<string | null>(null);

  const onChangePreferredChain: ChangeEventHandler<HTMLSelectElement> = (e) => {
    setPreferredChain(+e.target.value);
  };

  const filteredTokens = allTokens.filter((t) => t.chainId === preferredChain);

  useEffect(() => {
    if (selectedTokenId) {
      const [chainId, _] = selectedTokenId.split("_");
      if (+chainId !== preferredChain) selectToken(null);
    }
  }, [preferredChain]);

  return {
    allChains,
    selectedToken: selectedTokenId ? Token.getById(selectedTokenId) : null,
    preferredChain,
    filteredTokens,
    selectToken,
    onChangePreferredChain,
  };
};
