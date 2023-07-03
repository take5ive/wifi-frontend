import { getDexTopAprs } from "api/getDexTopAprs";
import { CHAINID } from "interfaces/config-data.interface";
import { InvestPair } from "interfaces/invest-pair.interface";
import { Chain } from "modules/Chain";
import { ChangeEventHandler, useEffect, useState } from "react";

export const useDestinationPair = () => {
  const [allPairs, setAllPairs] = useState<InvestPair[]>([]);
  const allChains = Chain.getAll();

  // null means "all chain"
  const [preferredChain, setPreferredChain] = useState<CHAINID | null>(null);
  const onChangePreferredChain: ChangeEventHandler<HTMLSelectElement> = (
    event
  ) => {
    const chainId = parseInt(event.target.value);
    setPreferredChain(chainId === -1 ? null : chainId);
  };
  const [selectedPairId, selectPair] = useState<string | null>(null);
  const selectedPair = allPairs.find((p) => p.id === selectedPairId) ?? null;

  useEffect(() => {
    getDexTopAprs().then(setAllPairs);
  }, []);

  return {
    allChains,
    preferredChain,
    selectedPair,
    selectPair,
    filteredPairs: allPairs.filter((p) => {
      if (preferredChain === null) {
        return true;
      }
      return p.chainId === preferredChain;
    }),
    onChangePreferredChain,
  };
};
