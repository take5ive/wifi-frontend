import { InvestPair } from "interfaces/invest-pair.interface";
import { TokenAmount } from "interfaces/token-amount.interface";
import { bundleSwapTasks } from "./bundleSwapTasks";
import { TaskManager } from "..";
import { Token } from "modules/Token";

export const taskRouter = async (
  inputAssets: TokenAmount[],
  dstPair: InvestPair,
  to: string
) => {
  const taskManager = new TaskManager(inputAssets);
  const dstToken = Token.get(dstPair.chainId, dstPair.token0.address)!;

  taskManager.pushTasks(
    await bundleSwapTasks(
      inputAssets.map((i) => i.token),
      dstToken,
      to
    )
  );

  return taskManager;
};
