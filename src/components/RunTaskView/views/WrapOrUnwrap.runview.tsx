import { Token } from "modules/Token";
import { useEffect, useState } from "react";
import { constants } from "ethers";
import { formatOrfloorTiny } from "utils/formatter";
import { WrapTask, WrapTaskData } from "modules/taskManager/tasks/WrapTask";
import { TokenIcon } from "components/TokenIcon";

interface WrapOrUnwrapRunViewProps {
  task: WrapTask;
}

export const WrapOrUnwrapRunView = ({ task }: WrapOrUnwrapRunViewProps) => {
  const [data, setData] = useState<WrapTaskData | null>(null);
  useEffect(() => {
    task.subscribe(setData);
  }, []);

  const token = Token.get(data?.chainId ?? 0, data?.tokenAddress ?? "");
  const native = Token.get(data?.chainId ?? 0, constants.AddressZero);

  return data && token && native ? (
    <div>
      <p className="text-3xl border-b pb-2">{task.name}</p>
      <div className="flex items-end my-4">
        <TokenIcon token={task.name === "Wrap" ? native : token} size="lg" />
        <p className="font-semibold text-xl ml-2">
          {task.name === "Wrap"
            ? `Wrap ${+formatOrfloorTiny(data.amount!)} ${native.symbol} to ${
                token.symbol
              }`
            : `Unwrap ${+formatOrfloorTiny(data.amount!)} ${token.symbol} to ${
                native.symbol
              }`}
        </p>
      </div>
    </div>
  ) : (
    <></>
  );
};
