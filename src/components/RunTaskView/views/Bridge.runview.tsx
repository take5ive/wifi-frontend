import { TokenIcon } from "components/TokenIcon";
import { Token } from "modules/Token";
import {
  WiFiBridgeTask,
  WiFiBridgeTaskData,
} from "modules/taskManager/tasks/move/WiFiBridgeTask";
import { useEffect, useState } from "react";
import { FaArrowDown } from "react-icons/fa";

interface WiFiBridgeRunViewProps {
  task: WiFiBridgeTask;
}

export const WiFiBridgeRunView = ({ task }: WiFiBridgeRunViewProps) => {
  const [data, setData] = useState<WiFiBridgeTaskData | null>(null);
  useEffect(() => {
    task.subscribe(setData);
  }, []);

  if (!data) return <></>;
  const fromToken = Token.get(
    data.protocol.data.fromToken.chainId,
    data.protocol.data.fromToken.address
  )!;
  const toToken = Token.get(
    data.protocol.data.toToken.chainId,
    data.protocol.data.toToken.address
  )!;

  return (
    <div>
      <p className="text-3xl border-b pb-2">Bridge at {data.protocol.name}</p>
      <div className="flex items-center justify-center mt-4">
        <TokenIcon token={fromToken} size="lg" />
        <p className="font-semibold text-xl ml-2">
          {+data.amountIn!} {fromToken.symbol} in&nbsp;
          <b className="font-bold">{fromToken.getChain().name}</b>
        </p>
      </div>
      <FaArrowDown className="my-4 mx-auto" />
      <div className="flex items-center justify-center mb-4">
        <TokenIcon token={toToken} size="lg" />
        <p className="font-semibold text-xl ml-2">
          {+data.amountOut!} {toToken.symbol} in&nbsp;
          <b className="font-bold">{toToken.getChain().name}</b>
        </p>
      </div>
    </div>
  );
};
