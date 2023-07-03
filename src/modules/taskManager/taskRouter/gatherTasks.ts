import { Token } from "modules/Token";
import { bundleSwapTasks } from "./bundleSwapTasks";
import { _gatherOneChain } from "./_gatherOneChain";

export const gatherTasks = async (
  fromTokens: Token[],
  toToken: Token,
  to: string
) => {
  const { tasks, resultTokens } = await _gatherOneChain(
    fromTokens,
    toToken.chainId,
    to
  );

  // destination chain 내에서 BundleSwap
  const sameChainTasks = await bundleSwapTasks(resultTokens, toToken, to);
  tasks.push(...sameChainTasks);

  return tasks;
};
