import { DualTokenIcons } from "components/DualTokenIcons";
import { TokenIcon } from "components/TokenIcon";
import { Token } from "modules/Token";
import {
  UniswapV2PartitionTask,
  UniswapV2PartitionTaskData,
} from "modules/taskManager/tasks/invest/UniswapV2PartitionTask";
import { useEffect, useState } from "react";
import { FaArrowDown, FaPlus } from "react-icons/fa";

interface PartitionRunViewProps {
  task: UniswapV2PartitionTask;
}

export const PartitionRunView = ({ task }: PartitionRunViewProps) => {
  const [data, setData] = useState<UniswapV2PartitionTaskData | null>(null);
  useEffect(() => {
    task.subscribe(setData);
  }, []);
  if (!data) return <></>;
  const baseToken = Token.get(data.chainId, data.baseTokenAddr)!;
  const farmToken = Token.get(data.chainId, data.farmTokenAddr)!;

  return (
    <div>
      <p className="text-3xl font-bold">
        Add Liquidity to {data.pair.protocol}
      </p>
      <p className="text-xl border-b pb-2 text-neutral-500">
        with Auto-Partitioning
      </p>
      <div className="flex items-center justify-center mt-4">
        <TokenIcon token={baseToken} size="lg" />
        <p className="font-semibold text-xl ml-2">
          {+data.amountIn!} {baseToken.symbol}
        </p>
      </div>
      <FaArrowDown className="mx-auto my-3" />
      <div className="flex items-center">
        <div className="flex flex-1 items-center">
          <TokenIcon token={baseToken} size="lg" />
          <p className="font-semibold text-xl ml-2">
            {+data.amountInBase!} {baseToken.symbol}
          </p>
        </div>
        <FaPlus className="mx-4 text-neutral-500" />
        <div className="flex flex-1 items-center">
          <TokenIcon token={farmToken} size="lg" />
          <p className="font-semibold text-xl ml-2">
            {+data.amountInFarm!} {farmToken.symbol}
          </p>
        </div>
      </div>
      <FaArrowDown className="mx-auto my-3" />
      <div className="flex items-center justify-center mb-4">
        <DualTokenIcons token0={baseToken} token1={farmToken} size="lg" />
        <p className="font-semibold text-xl ml-2">
          {(+(data.receivedLP ?? 0)).toFixed(12)} &nbsp;({baseToken.symbol}+
          {farmToken.symbol}) LP
        </p>
      </div>
    </div>
  );
};
