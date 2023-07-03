import { NumberInput } from "components/NumberInput";
import { TokenIcon } from "components/TokenIcon";
import {
  MdOutlineCheckBox,
  MdOutlineCheckBoxOutlineBlank,
} from "react-icons/md";
import { formatOrfloorTiny } from "utils";
import { TokenHandler } from "./selection.service";
import { createElement } from "react";
import { cn } from "utils";

export const TokenInput = ({
  token,
  balance,
  inputAmount,
  setInputAmount,
}: TokenHandler) => {
  const unSelect = () => {
    if (+inputAmount) setInputAmount("");
  };
  const setMax = () => {
    setInputAmount(balance);
  };
  return (
    <div className="flex pl-4 pr-4 min-h-[84px] ">
      <div className="flex items-center">
        {createElement(
          +inputAmount ? MdOutlineCheckBox : MdOutlineCheckBoxOutlineBlank,
          {
            className: cn(
              "text-2xl mr-2",
              +inputAmount > 0 && "text-primary-400"
            ),
            onClick: unSelect,
          }
        )}
        <TokenIcon token={token} size="lg" />
        <p className="ml-2 font-semibold text-lg">{token.symbol}</p>
      </div>
      <div className="flex flex-1 ml-2 flex-col justify-center space-y-2.5">
        <div className="h-4 -mt-1">
          <p className="-ml-16 text-right leading-none text-sm text-neutral-400">
            Balance: {formatOrfloorTiny(balance)} {token.symbol}
          </p>
        </div>
        <div className="flex items-center mb-1">
          <NumberInput
            className="flex-1 mx-4"
            inputClassName="text-right text-lg font-semibold"
            value={inputAmount}
            onChangeText={setInputAmount}
            decimals={token.decimals}
          />
          <button
            disabled={balance === inputAmount}
            onClick={setMax}
            className="btn-sm btn-secondary"
          >
            Max
          </button>
        </div>
      </div>
    </div>
  );
};
