import { TokenIcon } from "components/TokenIcon";
import { TokenSelectionProps } from "./TokenSelection";
import { formatOrfloorTiny } from "utils";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

export const ExpectedReceipt = ({
  selectedToken,
  taskManager,
  inputTokensLength,
  onClickGather,
}: TokenSelectionProps) => {
  const expectedAmount =
    taskManager && selectedToken
      ? taskManager.predictedAmountStatus.get(selectedToken)
      : "0";

  return (
    <div className="mt-4 flex h-[120px]">
      {inputTokensLength === 0 ? (
        <div className="flex flex-1 border-2 rounded-xl border-dashed items-center justify-center mb-8">
          <p className="text-lg text-neutral-400">Select input tokens first.</p>
        </div>
      ) : !selectedToken ? (
        <div className="flex flex-1 border-2 rounded-xl border-dashed items-center justify-center mb-8">
          <p className="text-lg text-neutral-400">Select Destination Token</p>
        </div>
      ) : (
        //   <div className="flex flex-col flex-1 border rounded-xl p-4">
        <div className="flex flex-1 gap-8 items-center border-t">
          {/* Expected Receipt */}
          {taskManager ? (
            <>
              <div className="flex items-center">
                <button
                  onClick={onClickGather}
                  className="btn-primary-o flex items-center justify-center bg-white shadow-lg py-4 px-12 border rounded-xl"
                >
                  <TokenIcon token={selectedToken} size="lg" />
                  <p className="ml-1.5 text-2xl font-bold -mt-0.5">
                    Gather {inputTokensLength} Assets into{" "}
                    {selectedToken.symbol}
                  </p>
                </button>
              </div>
              <div className="flex flex-1 flex-col">
                <p className="font-semibold text-2xl">Expected Result</p>
                <div className="flex text-xl justify-between mt-2">
                  <p className="font-medium text-neutral-600">
                    You will receive&nbsp;
                    <b className="font-bold underline text-neutral-900">
                      {formatOrfloorTiny(expectedAmount)} {selectedToken.symbol}
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
