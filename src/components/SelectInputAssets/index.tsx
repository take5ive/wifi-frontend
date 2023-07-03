import { Dispatch, SetStateAction } from "react";
import { useSelectInputAssets } from "./selection.service";
import { IoClose } from "react-icons/io5";
import { TokenInput } from "./TokenInput";
import { OtherTokensAccordian } from "./OtherTokensAccordian";
import { TokenAmount } from "interfaces/token-amount.interface";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

interface SelectInputAssetsProps {
  setTokenAmounts: Dispatch<SetStateAction<TokenAmount[]>>;
}

function SelectInputAssets({ setTokenAmounts }: SelectInputAssetsProps) {
  const { isLoading, tokenHandlers, noBalanceTokens } =
    useSelectInputAssets(setTokenAmounts);

  return (
    <div className="flex flex-col w-[380px]">
      <p className="text-neutral-400 mb-2">My Tokens</p>
      {tokenHandlers.length > 0 ? (
        <div className="flex flex-col divide-y max-h-[400px] overflow-y-scroll border rounded-lg">
          {tokenHandlers.map((tokenHandler, i) => (
            <TokenInput key={i} {...tokenHandler} />
          ))}
        </div>
      ) : (
        <div className="border rounded-lg p-6 flex items-center justify-center">
          {isLoading ? (
            <>
              <AiOutlineLoading3Quarters
                className="text-neutral-300 animate-spin"
                size={24}
              />
              <p className="ml-4 text-neutral-300 mr-6">Loading...</p>
            </>
          ) : (
            <>
              <IoClose className="text-neutral-300" size={24} />
              <p className="ml-4 text-neutral-300 mr-6">No Token</p>
            </>
          )}
        </div>
      )}

      {/* Other tokens  */}
      {!isLoading && tokenHandlers.length > 0 && (
        <>
          <p className="text-neutral-400 mt-6 mb-2">Other Tokens</p>
          <div className="border rounded-lg">
            {noBalanceTokens.map(([chainId, tokens]) => (
              <OtherTokensAccordian
                key={chainId}
                chainId={+chainId}
                tokens={tokens}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default SelectInputAssets;
