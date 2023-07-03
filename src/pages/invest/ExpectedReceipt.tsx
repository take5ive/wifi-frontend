import { PairSelectionProps } from "./PairSelection";
import { Token } from "modules/Token";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

export const ExpectedReceipt = ({
  selectedPair,
  taskManager,
  inputTokensLength,
  onClickInvest,
}: PairSelectionProps) => {
  const expectedAmount =
    taskManager && selectedPair
      ? taskManager.predictedAmountStatus.get(
          new Token({
            chainId: selectedPair?.chainId,
            address: selectedPair?.address,
            decimals: 18,
            symbol: "LP",
          })
        )
      : "";

  return (
    <div className="mt-4 flex h-[120px]">
      {inputTokensLength === 0 ? (
        <div className="flex flex-1 border-2 rounded-xl border-dashed items-center justify-center mb-6">
          <p className="text-lg text-neutral-400">Select input tokens first.</p>
        </div>
      ) : !selectedPair ? (
        <div className="flex flex-1 border-2 rounded-xl border-dashed items-center justify-center mb-6">
          <p className="text-lg text-neutral-400">Select Invest Pair</p>
        </div>
      ) : (
        <div className="flex flex-1 gap-8 items-center border-t">
          {/* Expected Receipt */}
          {taskManager ? (
            <>
              <div className="flex flex-1 items-center">
                <button
                  onClick={onClickInvest}
                  className="btn-primary-o flex items-center justify-center bg-white shadow-lg py-4 px-12 border rounded-xl"
                >
                  {/* <TokenIcon token={selectedToken} size="lg" /> */}
                  <p className="ml-1.5 text-2xl font-bold -mt-0.5">
                    Invest to {selectedPair.protocol} &nbsp; 🚀
                  </p>
                </button>
              </div>
              <div className="flex flex-1 flex-col">
                <p className="font-semibold text-2xl">Expected Result</p>
                <div className="flex text-xl justify-between mt-2">
                  <p className="font-medium text-neutral-600">
                    You will receive&nbsp;
                    <b className="font-bold underline text-neutral-900">
                      {+(+expectedAmount ?? 0).toFixed(12)} LP
                    </b>
                    &nbsp;&nbsp;with&nbsp;&nbsp;
                    <b className="font-bold underline text-neutral-900">
                      {taskManager.tasks.length} transactions
                    </b>
                  </p>
                </div>
              </div>
            </>
          ) : (
            <div className="flex flex-1 items-center justify-center">
              <AiOutlineLoading3Quarters className="animate-spin text-2xl" />
              <p className="text-2xl ml-4">Optimizing process...</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
