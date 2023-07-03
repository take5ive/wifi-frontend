import { Layout } from "pages/common/Layout";
import { useValidateInvestQuery } from "./validate-invest-query.service";
import { CurrentTransaction } from "./CurrentTransaction";
import { NextTransactions } from "./NextTransactions";
import { useSigner } from "states/wallet.state";

function InvestTx() {
  const { inputTokenAmounts, invest, manager, currentTask, status, received } =
    useValidateInvestQuery();
  const { signer } = useSigner();
  const run = async () => {
    if (manager && signer) {
      await manager.run(signer);
    }
  };

  return invest && inputTokenAmounts.length > 0 ? (
    <Layout>
      <p className="text-5xl font-bold">
        Invest {inputTokenAmounts.length} Assets to{" "}
        {invest.chainId === 10200 ? "Honeyswap" : invest.protocol}
      </p>
      <div className="mt-6 grid grid-cols-[1fr_2fr] gap-12">
        <CurrentTransaction
          received={received}
          task={currentTask}
          status={status}
          run={run}
        />
        <NextTransactions manager={manager} />
      </div>
    </Layout>
  ) : null;
}

export default InvestTx;
