import { DualTokenIcons } from "components/DualTokenIcons";
import { TokenIcon } from "components/TokenIcon";
import { Token } from "modules/Token";
import {
  UniswapV2DecomposeTask,
  UniswapV2DecomposeTaskData,
} from "modules/taskManager/tasks/invest/UniswapV2DecomposeTask";
import { useEffect, useState } from "react";
import { FaArrowDown, FaPlus } from "react-icons/fa";

interface DecomposeRunViewProps {
  task: UniswapV2DecomposeTask;
}

export const DecomposeRunView = ({ task }: DecomposeRunViewProps) => {
  const [data, setData] = useState<UniswapV2DecomposeTaskData | null>(null);
  useEffect(() => {
    task.subscribe(setData);
  }, []);
  if (!data) return <></>;
  const baseToken = Token.get(data.chainId, data.baseTokenAddr)!;
  const token0 = Token.get(data.chainId, data.pair.token0.address)!;
  const token1 = Token.get(data.chainId, data.pair.token1.address)!;

  return (
    <div>
      <p className="text-3xl font-bold">
        Add Liquidity to {data.pair.protocol}
      </p>
      <p className="text-xl border-b pb-2 text-neutral-500">
        with Auto-Decomposeing
      </p>
      <div className="flex items-center justify-center mt-4">
        <TokenIcon token={baseToken} size="lg" />
        <p className="font-semibold text-xl ml-2">
          {+data.amountIn!} {baseToken.symbol}
        </p>
      </div>

      <FaArrowDown className="mx-auto my-4" />

      <div className="flex items-center justify-center">
        <div className="flex flex-1 items-center justify-center">
          <TokenIcon token={baseToken} size="lg" />
          <p className="font-semibold text-xl ml-2">
            {+data.amountIn0!} {baseToken.symbol}
          </p>
        </div>
        <FaPlus className="mx-4 text-neutral-500" />
        <div className="flex flex-1 items-center justify-center">
          <TokenIcon token={baseToken} size="lg" />
          <p className="font-semibold text-xl ml-2">
            {+data.amountIn1!} {baseToken.symbol}
          </p>
        </div>
      </div>

      <div className="flex my-4">
        <FaArrowDown className="mx-auto" />
        <FaArrowDown className="mx-auto" />
      </div>

      <div className="flex items-center">
        <div className="flex flex-1 items-center justify-center">
          <TokenIcon token={token0} size="lg" />
          <p className="font-semibold text-xl ml-2">
            {+data.decomposedAmountIn0!} {token0.symbol}
          </p>
        </div>
        <FaPlus className="mx-4 text-neutral-500" />
        <div className="flex flex-1 items-center justify-center">
          <TokenIcon token={token1} size="lg" />
          <p className="font-semibold text-xl ml-2">
            {+data.decomposedAmountIn1!} {token1.symbol}
          </p>
        </div>
      </div>
      <FaArrowDown className="mx-auto my-4" />
      <div className="flex items-center justify-center mb-4">
        <DualTokenIcons token0={token0} token1={token1} size="lg" />
        <p className="font-semibold text-xl ml-2">
          {(+(data.receivedLP ?? 0)).toFixed(12)} &nbsp;({token0.symbol}+
          {token1.symbol}) LP
        </p>
      </div>
    </div>
  );
};
