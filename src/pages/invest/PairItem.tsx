import { DualTokenIcons } from "components/DualTokenIcons";
import { InvestPair } from "interfaces/invest-pair.interface";
import { Chain } from "modules/Chain";
import { Token } from "modules/Token";
import { BiCopy } from "react-icons/bi";
import { cn, ellipsisAddress } from "utils";
import { copyClipboard } from "utils/copyClipboard";

interface PairItemProps {
  investPair: InvestPair;
  selected: boolean;
  select: (pairId: string) => void;
}

const txtColor = (apy: number) => {
  if (apy > 60) return "text-red-700";
  else if (apy > 40) return "text-red-600";
  else if (apy > 20) return "text-orange-700";
  else if (apy > 10) return "text-orange-500";
  return "text-neutral-900";
};

export const PairItem = ({
  investPair: { id, chainId, token0, token1, address, apy, apr },
  selected,
  select,
}: PairItemProps) => {
  const copyAddress = () => copyClipboard(address);
  const onClick = () => select(id);

  const chain = Chain.get(chainId);
  const t0 = Token.get(chainId, token0.address)!;
  const t1 = Token.get(chainId, token1.address)!;
  const color = txtColor(apy);
  
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex flex-col p-4 rounded-lg hover:bg-neutral-50",
        selected ? "border-primary-400 border-2" : "border-2"
      )}
    >
      <div className="flex items-center">
        <DualTokenIcons token0={t0} token1={t1} size="xl" />
        <p className="mx-4 text-xl font-bold text-neutral-800">
          {t0.symbol}+{t1.symbol}
        </p>
      </div>
      <div className="flex flex-col gap-2 w-full">
        <div className="flex justify-evenly gap-3 py-2 border-b">
          <p className={cn(color, "font-extrabold text-center")}>APY</p>
          <p className={cn(color, "font-semibold text-left")}>
            {apy.toFixed(2)}%
          </p>
          <p className="text-center">APR</p>
          <p className="text-neutral-600 text-left">{apr.toFixed(2)}%</p>
        </div>
        <div className="grid grid-cols-[1fr_3fr] gap-3">
          <p className="font-semibold text-center">Network</p>
          <p className="text-neutral-600 text-left">{chain.name}</p>
        </div>
        <div className="grid grid-cols-[1fr_3fr] gap-3">
          <p className="font-semibold text-center">Address</p>
          <div className="flex justify-between items-center mr-1">
            <p className="text-neutral-600 text-left flex-1">
              {ellipsisAddress(address, 8, 4)}
            </p>
            <BiCopy
              onClick={copyAddress}
              className="cursor-pointer"
              size={18}
            />
          </div>
        </div>
      </div>
    </button>
  );
};
