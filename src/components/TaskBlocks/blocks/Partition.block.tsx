import { Chip } from "components/Chip";
import { TokenIcon } from "components/TokenIcon";
import { Token } from "modules/Token";
import { FaArrowRight } from "react-icons/fa";
import { BlockContainer } from "./BlockContainer";
import { formatOrfloorTiny } from "utils";
import { UniswapV2PartitionTaskData } from "modules/taskManager/tasks/invest/UniswapV2PartitionTask";
import { DualTokenIcons } from "components/DualTokenIcons";

export const PartitionBlock = ({
  // status: TaskStatusEnum;
  chainId,
  baseTokenAddr,
  farmTokenAddr,
  amountIn,
  amountInBase,
  amountInFarm,
  receivedLP,
}: // pair,
UniswapV2PartitionTaskData) => {
  const baseToken = Token.get(chainId, baseTokenAddr)!;
  const farmToken = Token.get(chainId, farmTokenAddr)!;
  return (
    <BlockContainer>
      <Chip color="green" className="mx-4 w-28" content="Partition" />
      <TokenIcon token={baseToken} size="lg" />
      <p className="ml-2 text-lg font-bold">{+(amountIn || "0")}</p>
      <p className="ml-2 text-lg font-bold">{baseToken.symbol}</p>

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
