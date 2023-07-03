import { TaskBase } from "modules/taskManager/tasks/TaskBase";
import { getRunTaskViewRouter } from "./views";
import { useCallback, useEffect, useState } from "react";
import { TaskStatusEnum } from "interfaces/tasks/task-status.interface";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { Chain } from "modules/Chain";
import { useWallet } from "states/wallet.state";
import { useNavigate } from "react-router-dom";
import ROUTES from "router/route-names";

interface RunTaskViewProps {
  task: TaskBase<any>;
  status: TaskStatusEnum;
  run: () => void;
}

export const RunTaskView = ({ task, status, run }: RunTaskViewProps) => {
  const RunView = useCallback(getRunTaskViewRouter(task.name), [
    task.name,
    task.chainId,
  ]);
  const { account } = useWallet();
  const [isEnoughGas, setIsEnoughGas] = useState<boolean>(true);
  const nav = useNavigate();

  const toGather = () => nav(ROUTES.GATHER);
  const chain = Chain.get(task.chainId);

  useEffect(() => {
    if (!account) return;
    const checkGas = async () => {
      const gas = await chain.getProvider().getBalance(account);
      setIsEnoughGas(gas.gt(0));
    };
    checkGas();
  }, []);

  return (
    <section className="flex flex-col border rounded-lg px-6 pt-4 pb-6">
      <div className="flex-1 mb-2">
        <RunView task={task} />
      </div>
      {status === TaskStatusEnum.Pending ? (
        isEnoughGas ? (
          <button onClick={run} className="btn btn-primary py-4">
            Run
          </button>
        ) : (
          <>
            <button
              disabled
              className="btn cursor-not-allowed bg-red-500 text-white py-4"
            >
              Insufficient Gas
            </button>
            <button
              onClick={toGather}
              className="btn border border-neutral-900 mt-4 py-4"
            >
              Get {chain.symbol} on Gather page
            </button>
          </>
        )
      ) : [TaskStatusEnum.Signed, TaskStatusEnum.Sent].includes(status) ? (
        <div className="btn text-neutral-400 border-[1.5px] border-neutral-400 py-4">
          <AiOutlineLoading3Quarters className="animate-spin" />
          <p className="ml-4 mr-6">
            {status === TaskStatusEnum.Signed
              ? "Transaction Signed"
              : "Waiting for the transaction to be confirmed."}
          </p>
        </div>
      ) : status === TaskStatusEnum.Predicting ? (
        <div className="btn text-primary-500/80 border-[1.5px] border-primary-500/80 py-4">
          <AiOutlineLoading3Quarters className="animate-spin" />
          <p className="ml-4 mr-6">Transaction Done!</p>
        </div>
      ) : (
        <></>
      )}
    </section>
  );
};
