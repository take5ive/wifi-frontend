import { TokenIcon } from "components/TokenIcon";
import { Token } from "modules/Token";
import { BiCopy } from "react-icons/bi";
import { cn, ellipsisAddress } from "utils";
import { copyClipboard } from "utils/copyClipboard";

interface TokenItemProps {
  token: Token;
  select: (tokenId: string) => void;
  selected: boolean;
}

export const TokenItem = ({ token, select, selected }: TokenItemProps) => {
  const copyAddress = () => copyClipboard(token.address);
  const onClick = () => select(token.id);

  return (
    <button
      onClick={onClick}
      className={cn(
        "flex flex-col p-4 rounded-lg hover:bg-neutral-50",
        selected ? "border-primary-400 border-2" : "border-2"
      )}
    >
      <div className="flex items-center">
        <TokenIcon token={token} size="xxl" />
        <p className="mx-4 text-xl font-bold text-neutral-800">
          {token.symbol}
        </p>
      </div>
      <div className="flex flex-col gap-2 mt-4 w-full">
        <div className="grid grid-cols-[1fr_3fr] gap-3">
          <p className="font-semibold text-center">Network</p>
          <p className="text-neutral-600 text-left">{token.getChain().name}</p>
        </div>
        <div className="grid grid-cols-[1fr_3fr] gap-3">
          <p className="font-semibold text-center">Address</p>
          <div className="flex justify-between items-center mr-1">
            <p className="text-neutral-600 text-left flex-1">
              {token.isNativeToken()
                ? "Native Token"
                : ellipsisAddress(token.address, 8, 4)}
            </p>
            {!token.isNativeToken() && (
              <BiCopy
                onClick={copyAddress}
                className="cursor-pointer"
                size={18}
              />
            )}
          </div>
        </div>
      </div>
    </button>
  );
};
