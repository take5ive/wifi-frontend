import SelectInputAssets from "components/SelectInputAssets";
import { IoIosAirplane } from "react-icons/io";
import { TokenSelection } from "./TokenSelection";
import { useDestinationToken } from "./dst-token.service";
import { useEffect, useState } from "react";
import { TokenAmount } from "interfaces/token-amount.interface";
import { TaskManager } from "modules/taskManager";
import { useWallet } from "states/wallet.state";
import { gatherTasks } from "modules/taskManager/taskRouter/gatherTasks";
import { Layout } from "pages/common/Layout";
import { useNavigate } from "react-router-dom";
import { Menus } from "pages/common/Menus";

export function Gather() {
  const { account } = useWallet();
  const [inputTokenAmounts, setInputTokenAmounts] = useState<TokenAmount[]>([]);
  const destTokenProps = useDestinationToken();
  const nav = useNavigate();

  const [manager, setManager] = useState<TaskManager | null>(null);
  useEffect(() => {
    if (
      !account ||
      !destTokenProps.selectedToken ||
      inputTokenAmounts.length === 0
    ) {
      setManager(null);
    } else {
      const manager = new TaskManager(inputTokenAmounts);

      gatherTasks(
        inputTokenAmounts.map((t) => t.token),
        destTokenProps.selectedToken,
        account
      ).then(tasks => {
        manager.pushTasks(tasks);
        manager.predict().then(() => {
          setManager(manager);
        });
      })
    }
  }, [inputTokenAmounts, destTokenProps.selectedToken?.id]);

  const onClickGather = () => {
    if (!destTokenProps.selectedToken) return;
    nav(
      `/gather/tx?${inputTokenAmounts
        .map((t) => `${t.token.id}=${t.amount}&`)
        .join("")}destination=${destTokenProps.selectedToken.id}`
    );
  };

  return (
    <Layout>
      <div className="flex items-start justify-between">
        <p className="text-5xl font-bold">Gather Multichain Assets</p>
        <Menus
          menus={[
            { name: "Home", path: "/" },
            { name: "Invest", path: "/invest" },
            { name: "Withdraw", path: "/withdraw" },
          ]}
        />
      </div>
      <div className="flex mt-6">
        <div>
          <p className="text-2xl font-semibold mb-4"> Input Assets</p>
          <SelectInputAssets setTokenAmounts={setInputTokenAmounts} />
        </div>
        <div className="flex mx-12 h-[600px] items-center justify-center">
          <IoIosAirplane size={40} className="text-primary-500" />
        </div>

        <div className="flex-1">
          <TokenSelection
            inputTokensLength={inputTokenAmounts.length}
            taskManager={manager}
            onClickGather={onClickGather}
            {...destTokenProps}
          />
        </div>
      </div>
    </Layout>
  );
}
