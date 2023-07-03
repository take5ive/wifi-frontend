import { Chain } from "modules/Chain";
import { InvestPair } from "interfaces/invest-pair.interface";
import { CHAINID } from "interfaces/config-data.interface";
import { TaskManager } from "modules/taskManager";
import { ChangeEventHandler } from "react";
import { ExpectedReceipt } from "./ExpectedReceipt";
import { PairItem } from "./PairItem";

export interface PairSelectionProps {
  allChains: Chain[];
  selectedPair: InvestPair | null;
  preferredChain: CHAINID | null;
  filteredPairs: InvestPair[];
  inputTokensLength: number;
  taskManager: TaskManager | null;
  selectPair: (tokenId: string) => void;
  onChangePreferredChain: ChangeEventHandler<HTMLSelectElement>;
  onClickInvest: () => void;
}

export const PairSelection = (props: PairSelectionProps) => {
  const {
    allChains,
    preferredChain,
    filteredPairs,
    selectedPair,
    selectPair,
    onChangePreferredChain,
  } = props;
  return (
    <div>
      <div className="flex items-center justify-between">
        <p className="text-2xl font-semibold"> Hot Products 🔥 </p>
        <div className="flex gap-4 items-end">
          <p className="text-lg">Preferred Chains</p>
          <div className="border px-2 py-0.5 rounded-md">
            <select
              value={preferredChain ?? -1}
              onChange={onChangePreferredChain}
              className="outline-none"
            >
              <option value={-1}>All</option>
              {allChains.map((chain) => (
                <option key={chain.id} value={chain.id}>
                  {Chain.get(chain.id).name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
      {/* Selected Token */}
      <ExpectedReceipt {...props} />

      <hr className="mb-6" />

      {/* PAIRS LIST GRID */}
      <div className="grid 2xl:grid-cols-3 grid-cols-2 mt-4 gap-6">
        {filteredPairs.map((pair) => (
          <PairItem
            key={pair.id}
            investPair={pair}
            selected={selectedPair?.id === pair.id}
            select={selectPair}
          />
        ))}
      </div>
    </div>
  );
};
