import { RunTaskView } from "components/RunTaskView";
import { TaskStatusEnum } from "interfaces/tasks/task-status.interface";
import { TaskBase } from "modules/taskManager/tasks/TaskBase";
import { useNavigate } from "react-router-dom";
import ROUTES from "router/route-names";

interface CurrentTransactionProps {
  task: TaskBase<any> | null;
  status: TaskStatusEnum;
  received: string | undefined;
  run: () => Promise<void>;
}

export const CurrentTransaction = ({
  task,
  status,
  received,
  run,
}: CurrentTransactionProps) => {
  const nav = useNavigate();
  const goHome = () => nav(ROUTES.HOME);

  return (
    <div className="flex flex-1 flex-col">
      {received ? (
        <>
          <p className="text-2xl font-semibold mb-4">
            All Transactions are done!
          </p>
          <button onClick={goHome} className="btn btn-primary text-lg">
            Go back to main page
          </button>
        </>
      ) : (
        <>
          <p className="text-2xl font-semibold mb-4">Current Transaction</p>
          {task && <RunTaskView status={status} task={task} run={run} />}
        </>
      )}
    </div>
  );
};
