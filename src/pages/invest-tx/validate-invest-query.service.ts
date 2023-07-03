import { TokenAmount } from "interfaces/token-amount.interface";
import { Token } from "modules/Token";
import { TaskManager } from "modules/taskManager";
import { TaskBase } from "modules/taskManager/tasks/TaskBase";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useWallet } from "states/wallet.state";
import { TaskStatusEnum } from "interfaces/tasks/task-status.interface";
import ROUTES from "router/route-names";
import { getDexTopAprs } from "api/getDexTopAprs";
import { investTasks } from "modules/taskManager/taskRouter/investTasks";
import { InvestPair } from "interfaces/invest-pair.interface";

export const useValidateInvestQuery = () => {
  const { search } = useLocation();
  const nav = useNavigate();
  const { account } = useWallet();

  const inputTokenAmounts: TokenAmount[] = [];
  let investId: string | null = null;
  for (const [key, value] of new URLSearchParams(search).entries()) {
    try {
      if (key === "invest") {
        investId = value;
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

  const [invest, setInvest] = useState<InvestPair | null>(null);
  const [manager, setManager] = useState<TaskManager | null>(null);
  const [status, setStatus] = useState<TaskStatusEnum>(TaskStatusEnum.None);
  const [received, setReceived] = useState<string>();
  const [currentTask, setCurrentTask] = useState<TaskBase<any> | null>(null);

  const initInvest = async () => {
    if (!account) {
      return nav(ROUTES.HOME, { replace: true });
    }
    if (!investId || inputTokenAmounts.length === 0) {
      return nav(ROUTES.INVEST, { replace: true });
    }

    const invests = await getDexTopAprs();
    const invest = invests.find((i) => i.id === investId);
    if (!invest) {
      return nav(ROUTES.INVEST, { replace: true });
    }
    setInvest(invest);

    const manager = new TaskManager(inputTokenAmounts);
    investTasks(
      inputTokenAmounts.map((t) => t.token),
      invest,
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
            const received = manager.doneAmountStatus.get(
              new Token({
                chainId: invest.chainId,
                address: invest.address,
                decimals: 18,
                symbol: "LP",
              })
            );
            setReceived(`${received} LP in ${invest.protocol}`);
          }
        });
      });
    });
  };

  useEffect(() => {
    initInvest();
  }, []);

  return {
    currentTask,
    status,
    inputTokenAmounts,
    invest,
    manager,
    received,
  };
};
