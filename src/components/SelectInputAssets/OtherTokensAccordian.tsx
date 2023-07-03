import { ChainIcon } from "components/ChainIcon";
import { TokenIcon } from "components/TokenIcon";
import { CHAINID } from "interfaces/config-data.interface";
import { Chain } from "modules/Chain";
import { Token } from "modules/Token";
import { useState } from "react";
import { IoChevronDown, IoChevronUp } from "react-icons/io5";
import { cn } from "utils";

interface OtherTokensAccordianProps {
  chainId: CHAINID;
  tokens: Token[];
}

export const OtherTokensAccordian = ({
  chainId,
  tokens,
}: OtherTokensAccordianProps) => {
  const chain = Chain.get(chainId);
  const [isToggleOpen, setToggleOpen] = useState(false);
  const toggle = () => setToggleOpen((p) => !p);
  return (
    <div>
      <button
        onClick={toggle}
        className={cn(
          "flex bg-neutral-50 hover:bg-neutral-100 w-full justify-between items-center h-14 p-4",
          "first:rounded-t-lg",
          "last:rounded-b-lg"
        )}
      >
        <ChainIcon chain={chain} size="lg" />
        <p className="flex-1 text-lg ml-2">{chain.name}</p>
        {isToggleOpen ? <IoChevronUp /> : <IoChevronDown />}
      </button>
      {isToggleOpen &&
        tokens.map((token) => (
          <div key={token.id} className="flex p-4 border-t">
            <TokenIcon token={token} size="md" />
            <p className="mx-4 text-neutral-500">{token.symbol}</p>
          </div>
        ))}
    </div>
  );
};
