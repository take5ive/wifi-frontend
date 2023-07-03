import { TokenAmount } from "interfaces/token-amount.interface";
import { Token } from "modules/Token";
import { gatherTasks } from "modules/taskManager/taskRouter/gatherTasks";
import { TaskManager } from "modules/taskManager";
import { TaskBase } from "modules/taskManager/tasks/TaskBase";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useWallet } from "states/wallet.state";
import { TaskStatusEnum } from "interfaces/tasks/task-status.interface";
import ROUTES from "router/route-names";

export const useValidateGatherQuery = () => {
  const { search } = useLocation();
  const nav = useNavigate();
  const { account } = useWallet();

  const query = Array.from(new URLSearchParams(search).entries());

  const inputTokenAmounts: TokenAmount[] = [];
  let dstToken: Token | null = null;

  for (const [key, value] of query) {
    try {
      if (key === "destination") {
        dstToken = Token.getById(value)!;
      } else {
        const token = Token.getById(key);
        if (!token) continue;
        if (isNaN(Number(value))) continue;

        inputTokenAmounts.push({
          token,
          amount: value,
        });
      }
    } catch {}
  }

  const [manager, setManager] = useState<TaskManager | null>(null);
  const [status, setStatus] = useState<TaskStatusEnum>(TaskStatusEnum.None);
  const [received, setReceived] = useState<string>();
  const [currentTask, setCurrentTask] = useState<TaskBase<any> | null>(null);

  useEffect(() => {
    if (!account) {
      return nav(ROUTES.HOME, { replace: true });
    }
    if (!dstToken || inputTokenAmounts.length === 0) {
      return nav(ROUTES.GATHER, { replace: true });
    }

    const manager = new TaskManager(inputTokenAmounts);
    gatherTasks(
      inputTokenAmounts.map((t) => t.token),
      dstToken,
      account
    ).then((tasks) => {
      manager.pushTasks(tasks);
      manager.predict().then(() => {
        setManager(manager);
        manager.subscribeStatus(({ currentId, status }) => {
          const task = manager.tasks[currentId];
          setCurrentTask(task ?? null);
          setStatus(status);
          if (currentId >= manager.tasks.length) {
            const received = manager.doneAmountStatus.get(dstToken!);
            setReceived(`${received} ${dstToken!.symbol}`);
          }
        });
      });
    });
  }, []);

  return {
    currentTask,
    status,
    inputTokenAmounts,
    dstToken,
    manager,
    received,
  };
};
