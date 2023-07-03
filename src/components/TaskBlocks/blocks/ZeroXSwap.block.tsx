import { Chip } from "components/Chip";
import { TokenIcon } from "components/TokenIcon";
import { Token } from "modules/Token";
import { FaArrowRight } from "react-icons/fa";
import { BlockContainer } from "./BlockContainer";
import { formatOrfloorTiny } from "utils";
import { ZeroXSwapTaskData } from "modules/taskManager/tasks/move/ZeroXSwapTask";

export const ZeroXSwapBlock = ({
  chainId,
  fromTokenAddr,
  toTokenAddr,
  amountIn,
  amountOut,
  sources,
}: ZeroXSwapTaskData) => {
  const fromToken = Token.get(chainId, fromTokenAddr)!;
  const toToken = Token.get(chainId, toTokenAddr)!;
  return (
    <BlockContainer>
      <Chip color="fuchsia" className="mx-4 w-28" content={"0x Swap"} />
      <TokenIcon token={fromToken} size="lg" />
      <p className="ml-2 text-lg font-bold">{amountIn}</p>
      <p className="ml-2 text-lg font-bold">{fromToken.symbol}</p>

      <FaArrowRight className="mx-4" />
      <TokenIcon token={toToken} size="lg" />
      <p className="ml-2 text-lg font-bold">
        {formatOrfloorTiny(amountOut ?? "")}
      </p>
      <p className="ml-2 text-lg font-bold">{toToken.symbol}</p>

      <div className="border-l pl-4 ml-4 flex">
        <Chip color="gray" size="sm" content="via" />
        <p className="ml-2 font-semibold text-fuchsia-600">0x</p>
        <p className="ml-1 font-semibold text-fuchsia-600">
          (
          {sources
            .filter((s) => +s.proportion > 0)
            .map((s) => s.name.split("_").join(" "))
            .join(", ")}
          )
        </p>
      </div>
    </BlockContainer>
  );
};
