import { Chip } from "components/Chip";
import { TokenIcon } from "components/TokenIcon";
import { Token } from "modules/Token";
import {
  ZeroXSwapTask,
  ZeroXSwapTaskData,
} from "modules/taskManager/tasks/move/ZeroXSwapTask";
import { useEffect, useState } from "react";
import { FaArrowRight } from "react-icons/fa";
import { formatOrfloorTiny } from "utils";

interface ZeroXSwapRunViewProps {
  task: ZeroXSwapTask;
}

export const ZeroXSwapRunView = ({ task }: ZeroXSwapRunViewProps) => {
  const [data, setData] = useState<ZeroXSwapTaskData | null>(null);
  useEffect(() => {
    task.subscribe(setData);
  }, []);

  if (!data) return <></>;
  const fromToken = Token.get(data.chainId, data.fromTokenAddr)!;
  const toToken = Token.get(data.chainId, data.toTokenAddr)!;

  return (
    <div>
      <p className="text-3xl border-b pb-2">Swap with 0x protocol</p>
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
      <hr className="my-4" />
      <p className="font-semibold text-lg">Detail Orders</p>
      {data.sources
        .filter((s) => +s.proportion > 0)
        .map((s, i) => (
          <div key={i} className="flex mt-1">
            <p className="mr-1 text-neutral-500">
              ({100 * +s.proportion}%){" "}
              <b className=" font-bold text-neutral-800">
                {formatOrfloorTiny(+(data.amountIn || 0) * +s.proportion)}{" "}
                {fromToken.symbol}{" "}
              </b>
              will be swapped via
            </p>
            <Chip
              size="sm"
              content={s.name.split("_").join(" ")}
              color="random"
            />
          </div>
        ))}
      <div className="h-4" />
      {/* <TokenIcon token={toToken} size="md" /> */}
    </div>
  );
};
