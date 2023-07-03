import { TokenIcon } from "components/TokenIcon";
import { Token } from "modules/Token";
import {
  ApproveTask,
  ApproveTaskData,
} from "modules/taskManager/tasks/ApproveTask";
import { useEffect, useState } from "react";

interface ApproveRunViewProps {
  task: ApproveTask;
}

export const ApproveRunView = ({ task }: ApproveRunViewProps) => {
  const [data, setData] = useState<ApproveTaskData | null>(null);
  useEffect(() => {
    task.subscribe(setData);
  }, []);
  if (!data) return <></>;

  const token = Token.get(task.chainId, data.tokenAddr)!;
  return (
    <div>
      <p className="text-3xl border-b pb-2">
        Approve
      </p>
      <div className="flex items-end my-4">
        <TokenIcon token={token} size="lg" />
        <p className="font-semibold text-xl ml-2">
          {+data.amount!} {token.symbol} for {data.spenderAlias}
        </p>
      </div>
    </div>
  );
};
