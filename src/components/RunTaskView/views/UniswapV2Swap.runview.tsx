import { TokenIcon } from "components/TokenIcon";
import { Token } from "modules/Token";
import {
  UniswapV2SwapTask,
  UniswapV2SwapTaskData,
} from "modules/taskManager/tasks/move/UniswapV2SwapTask";
import { useEffect, useState } from "react";
import { FaArrowRight } from "react-icons/fa";

interface UniswapV2SwapRunViewProps {
  task: UniswapV2SwapTask;
}

export const UniswapV2SwapRunView = ({ task }: UniswapV2SwapRunViewProps) => {
  const [data, setData] = useState<UniswapV2SwapTaskData | null>(null);
  useEffect(() => {
    task.subscribe(setData);
  }, []);

  if (!data) return <></>;
  const fromToken = Token.get(data.chainId, data.fromTokenAddr)!;
  const toToken = Token.get(data.chainId, data.toTokenAddr)!;

  return (
    <div>
      <p className="text-3xl border-b pb-2">Swap at {data.protocol.name}</p>
      <div className="flex items-center my-4">
        <div className="flex items-end">
          <TokenIcon token={fromToken} size="lg" />
          <p className="font-semibold text-xl ml-2">
            {+data.amountIn!} {fromToken.symbol}
          </p>
        </div>
        <FaArrowRight className="mx-4" />
        <div className="flex items-end">
          <TokenIcon token={toToken} size="lg" />
          <p className="font-semibold text-xl ml-2">
            {+data.amountOut!} {toToken.symbol}
          </p>
        </div>
      </div>
    </div>
  );
};
