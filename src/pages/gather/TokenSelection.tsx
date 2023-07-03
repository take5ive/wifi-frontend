import { CHAINID } from "interfaces/config-data.interface";
import { Chain } from "modules/Chain";
import { Token } from "modules/Token";
import { ChangeEventHandler } from "react";
import { TokenItem } from "./TokenItem";
import { TaskManager } from "modules/taskManager";
import { ExpectedReceipt } from "./ExpectedReceipt";

export interface TokenSelectionProps {
  allChains: Chain[];
  selectedToken: Token | null;
  preferredChain: CHAINID;
  filteredTokens: Token[];
  inputTokensLength: number;
  taskManager: TaskManager | null;
  selectToken: (tokenId: string) => void;
  onChangePreferredChain: ChangeEventHandler<HTMLSelectElement>;
  onClickGather: () => void;
}

export const TokenSelection = (props: TokenSelectionProps) => {
  const {
    allChains,
    selectedToken,
    preferredChain,
    filteredTokens,
    selectToken,
    onChangePreferredChain,
  } = props;

  return (
    <div>
      <div className="flex items-center justify-between">
        <p className="text-2xl font-semibold"> Destination Token</p>
        <div className="flex gap-4 items-end">
          <p className="text-lg">Preferred Chains</p>
          <div className="border px-2 py-0.5 rounded-md">
            <select
              value={preferredChain}
              onChange={onChangePreferredChain}
              className="outline-none"
            >
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

      {/* TOKENS LIST GRID */}
      <div className="grid 2xl:grid-cols-3 grid-cols-2 mt-4 gap-6">
        {filteredTokens.map((token) => (
          <TokenItem
            selected={selectedToken?.id === token.id}
            key={token.id}
            token={token}
            select={selectToken}
          />
        ))}
      </div>
    </div>
  );
};
