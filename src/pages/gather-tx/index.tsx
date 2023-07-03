import { Layout } from "pages/common/Layout";
import { useValidateGatherQuery } from "./validate-gather-query.service";
import { CurrentTransaction } from "./CurrentTransaction";
import { NextTransactions } from "./NextTransactions";
import { useSigner } from "states/wallet.state";

function GatherTx() {
  const { inputTokenAmounts, dstToken, manager, currentTask, status, received } =
    useValidateGatherQuery();
  const { signer } = useSigner();
  const run = async () => {
    if (manager && signer) {
      await manager.run(signer);
    }
  };

  return dstToken && inputTokenAmounts.length > 0 ? (
    <Layout>
      <p className="text-5xl font-bold">
        Gather {inputTokenAmounts.length} Assets Into {dstToken.symbol}
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

export default GatherTx;
