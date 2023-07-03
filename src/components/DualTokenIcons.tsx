import { Token } from "modules/Token";
import { TokenIcon } from "./TokenIcon";
import { CoinIconSize } from "./CoinIcon";

interface DualTokenIconsProps {
  token0: Token;
  token1: Token;
  size: CoinIconSize;
}

export const DualTokenIcons = ({
  token0,
  token1,
  size,
}: DualTokenIconsProps) => {
  return (
    <div className="flex">
      <div className="relative -mr-4 z-20">
        <TokenIcon token={token0} size={size} />
      </div>
      <TokenIcon token={token1} size={size} />
    </div>
  );
};
