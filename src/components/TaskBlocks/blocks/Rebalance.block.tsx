import { Chip } from "components/Chip";
import { Token } from "modules/Token";
import { FaArrowRight } from "react-icons/fa";
import { BlockContainer } from "./BlockContainer";
import { UniswapV2RebalanceTaskData } from "modules/taskManager/tasks/invest/UniswapV2RebalanceTask";
import { DualTokenIcons } from "components/DualTokenIcons";
import { formatOrfloorTiny } from "utils";

export const RebalanceBlock = ({
  chainId,
  baseTokenAddr,
  farmTokenAddr,
  amountInBase,
  amountInFarm,
  rebalancedAmountInBase,
  rebalancedAmountInFarm,
  receivedLP,
}: // to,
// pair,
UniswapV2RebalanceTaskData) => {
  const baseToken = Token.get(chainId, baseTokenAddr)!;
  const farmToken = Token.get(chainId, farmTokenAddr)!;

  return (
    <BlockContainer>
      <Chip color="green" className="mx-4 w-28" content="Rebalance" />

      <DualTokenIcons token0={baseToken} token1={farmToken} size="lg" />
      <div className="flex flex-col ml-2 -my-2">
        <p>
          {formatOrfloorTiny(rebalancedAmountInBase ?? "")} {"  "}
          {baseToken.symbol}
        </p>
        <p className="-mt-1">
          {formatOrfloorTiny(rebalancedAmountInFarm ?? "")} {"  "}{" "}
          {farmToken.symbol}
        </p>
      </div>

      <FaArrowRight className="mx-3" />
      <DualTokenIcons token0={baseToken} token1={farmToken} size="lg" />
      <div className="flex flex-col ml-2 -my-2">
        <p>
          {formatOrfloorTiny(amountInBase ?? "")} {"  "}
          {baseToken.symbol}
        </p>
        <p className="-mt-1">
          {formatOrfloorTiny(amountInFarm ?? "")} {"  "} {farmToken.symbol}
        </p>
      </div>

      <FaArrowRight className="mx-3" />
      <DualTokenIcons token0={baseToken} token1={farmToken} size="lg" />
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
