import { Chip } from "components/Chip";
import { TokenIcon } from "components/TokenIcon";
import { Token } from "modules/Token";
import { FaArrowRight } from "react-icons/fa";
import { BlockContainer } from "./BlockContainer";
import { formatOrfloorTiny } from "utils";
import { UniswapV2DecomposeTaskData } from "modules/taskManager/tasks/invest/UniswapV2DecomposeTask";
import { DualTokenIcons } from "components/DualTokenIcons";

export const DecomposeBlock = ({
  // status,
  chainId,
  baseTokenAddr,
  amountIn,
  // amountIn0,
  // amountIn1,
  decomposedAmountIn0,
  decomposedAmountIn1,
  receivedLP,
  // to,
  pair,
}: UniswapV2DecomposeTaskData) => {
  const baseToken = Token.get(chainId, baseTokenAddr)!;
  const farmToken0 = Token.get(chainId, pair.token0.address)!;
  const farmToken1 = Token.get(chainId, pair.token1.address)!;
  return (
    <BlockContainer>
      <Chip color="green" className="mx-4 w-28" content="Decompose" />
      <TokenIcon token={baseToken} size="lg" />
      <p className="ml-2 text-lg font-bold">{formatOrfloorTiny(amountIn ?? "")}</p>
      <p className="ml-2 text-lg font-bold">{baseToken.symbol}</p>

      <FaArrowRight className="mx-3" />
      <DualTokenIcons token0={farmToken0} token1={farmToken1} size="lg" />
      <div className="flex flex-col ml-2 -my-2">
        <p>
          {formatOrfloorTiny(decomposedAmountIn0 ?? "")} {"  "}
          {farmToken0.symbol}
        </p>
        <p className="-mt-1">
          {formatOrfloorTiny(decomposedAmountIn1 ?? "")} {"  "}{" "}
          {farmToken1.symbol}
        </p>
      </div>

      <FaArrowRight className="mx-3" />
      <DualTokenIcons token0={farmToken0} token1={farmToken1} size="lg" />
      <p className="ml-1.5">
        {formatOrfloorTiny(receivedLP ?? "")} {"  LP"}
      </p>

      <div className="border-l pl-4 ml-4 flex">
        <Chip color="gray" size="sm" content="via" />
        <p className="ml-2 text-primary-500 font-bold">
          {baseToken.getChain().name} Funnel
        </p>
      </div>
    </BlockContainer>
  );
};
