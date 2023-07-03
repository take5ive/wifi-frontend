import { Chip } from "components/Chip";
import { TokenIcon } from "components/TokenIcon";
import { Token } from "modules/Token";
import { BlockContainer } from "./BlockContainer";
import { cn } from "utils";
import { ApproveTaskData } from "modules/taskManager/tasks/ApproveTask";

export const ApproveBlock = (data: ApproveTaskData) => {
  const { chainId, tokenAddr, amount, spenderAlias } = data;
  const token = Token.get(chainId, tokenAddr)!;
  const isForFunnel = spenderAlias.includes("Funnel");
  const isFor0x = spenderAlias === "0x Exchange";
  return (
    <BlockContainer>
      <Chip color="yellow" className="mx-4 w-28" content={"Approve"} />
      <TokenIcon token={token} size="lg" />
      <p className="ml-2 text-lg font-bold">{+(amount ?? '')}</p>
      <p className="ml-2 text-lg font-bold">{token.symbol}</p>

      <div className="border-l pl-4 ml-4 flex">
        <Chip color="gray" size="sm" content="for" />
        <p
          className={cn(
            "ml-2 font-semibold",
            isForFunnel && "text-primary-500 font-bold",
            isFor0x && "text-fuchsia-600 font-bold",
          )}
        >
          {spenderAlias}
        </p>
      </div>
    </BlockContainer>
  );
};
