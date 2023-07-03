import { DualTokenIcons } from "components/DualTokenIcons";
import { TokenIcon } from "components/TokenIcon";
import { Token } from "modules/Token";
import {
  UniswapV2RebalanceTask,
  UniswapV2RebalanceTaskData,
} from "modules/taskManager/tasks/invest/UniswapV2RebalanceTask";
import { useEffect, useState } from "react";
import { FaArrowDown, FaPlus } from "react-icons/fa";

interface RebalanceRunViewProps {
  task: UniswapV2RebalanceTask;
}

export const RebalanceRunView = ({ task }: RebalanceRunViewProps) => {
  const [data, setData] = useState<UniswapV2RebalanceTaskData | null>(null);
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
        with Auto-Rebalancing
      </p>
      <div className="flex mt-4 items-center">
        <div className="flex items-center justify-center flex-1">
          <TokenIcon token={baseToken} size="lg" />
          <p className="font-semibold text-xl ml-2">
            {+data.amountInBase!} {baseToken.symbol}
          </p>
        </div>
        <FaPlus className="mx-4 text-neutral-500" />
        <div className="flex items-center justify-center flex-1">
          <TokenIcon token={farmToken} size="lg" />
          <p className="font-semibold text-xl ml-2">
            {+data.amountInFarm!} {farmToken.symbol}
          </p>
        </div>
      </div>
      <FaArrowDown className="mx-auto my-3" />
      <div className="flex mt-4 items-center">
        <div className="flex flex-1 items-center">
          <TokenIcon token={baseToken} size="lg" />
          <p className="font-semibold text-xl ml-2">
            {+data.rebalancedAmountInBase!} {baseToken.symbol}
          </p>
        </div>
        <FaPlus className="mx-4 text-neutral-500" />
        <div className="flex flex-1 items-center">
          <TokenIcon token={farmToken} size="lg" />
          <p className="font-semibold text-xl ml-2">
            {+data.rebalancedAmountInFarm!} {farmToken.symbol}
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
