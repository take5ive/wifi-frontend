import TaskBlockListView from "components/TaskBlocks";
import { TaskManager } from "modules/taskManager";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

interface NextTransactionsProps {
  manager: TaskManager | null;
}

export const NextTransactions = ({ manager }: NextTransactionsProps) => {
  return manager ? (
    <div className="flex-1">
      <p className="text-2xl font-semibold mb-4">Next Transactions</p>
      {manager && (
        <div className="mt-4">
          <TaskBlockListView manager={manager} />
        </div>
      )}
    </div>
  ) : (
    <div className="flex items-center justify-center">
      <AiOutlineLoading3Quarters size={40} className="animate-spin" />
      <p className="ml-8">Loading...</p>
    </div>
  );
};
