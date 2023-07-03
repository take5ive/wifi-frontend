import { Chip } from "components/Chip";
import { TokenIcon } from "components/TokenIcon";
import { Token } from "modules/Token";
import { FaArrowRight } from "react-icons/fa";
import { BlockContainer } from "./BlockContainer";
import { formatOrfloorTiny } from "utils";
import { UniswapV2SwapTaskData } from "modules/taskManager/tasks/move/UniswapV2SwapTask";

export const SwapBlock = ({
  chainId,
  fromTokenAddr,
  toTokenAddr,
  amountIn,
  amountOut,
  protocol,
}: UniswapV2SwapTaskData) => {
  const fromToken = Token.get(chainId, fromTokenAddr)!;
  const toToken = Token.get(chainId, toTokenAddr)!;
  return (
    <BlockContainer>
      <Chip color="orange" className="mx-4 w-28" content={"Swap"} />
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
        <p className="ml-2 font-semibold">{protocol.name}</p>
      </div>
    </BlockContainer>
  );
};
