import SelectInputAssets from "components/SelectInputAssets";
import { IoIosAirplane } from "react-icons/io";
import { useEffect, useState } from "react";
import { TokenAmount } from "interfaces/token-amount.interface";
import { TaskManager } from "modules/taskManager";
import { useWallet } from "states/wallet.state";
import { Layout } from "pages/common/Layout";
import { PairSelection } from "./PairSelection";
import { useDestinationPair } from "./dst-pair.service";
import { investTasks } from "modules/taskManager/taskRouter/investTasks";
import { useNavigate } from "react-router-dom";
import { Menus } from "pages/common/Menus";

export function Invest() {
  const { account } = useWallet();
  const nav = useNavigate();
  const [inputTokenAmounts, setInputTokenAmounts] = useState<TokenAmount[]>([]);

  const [manager, setManager] = useState<TaskManager | null>(null);
  const dstPairProps = useDestinationPair();

  const onClickInvest = () => {
    if (!dstPairProps.selectedPair) return;
    nav(
      `/invest/tx?${inputTokenAmounts
        .map((t) => `${t.token.id}=${t.amount}&`)
        .join("")}invest=${dstPairProps.selectedPair.id}`
    );
  };

  useEffect(() => {
    if (
      !account ||
      !dstPairProps.selectedPair ||
      inputTokenAmounts.length === 0
    ) {
      setManager(null);
    } else {
      const manager = new TaskManager(inputTokenAmounts);

      investTasks(
        inputTokenAmounts.map((t) => t.token),
        dstPairProps.selectedPair,
        account
      ).then((tasks) => {
        manager.pushTasks(tasks);
        manager.predict().then(() => {
          setManager(manager);
        });
      })
    }
  }, [inputTokenAmounts, dstPairProps.selectedPair?.id]);
  return (
    <Layout>
      <div className="flex items-start justify-between">
        <p className="text-5xl font-bold">Invest to DeFi Pools</p>
        <Menus
          menus={[
            { name: "Home", path: "/" },
            { name: "Gather", path: "/gather" },
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
          <PairSelection
            inputTokensLength={inputTokenAmounts.length}
            taskManager={manager}
            onClickInvest={onClickInvest}
            {...dstPairProps}
          />
        </div>
      </div>
    </Layout>
  );
}
