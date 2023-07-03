import { InvestPair } from "interfaces/invest-pair.interface";
import { Token } from "modules/Token";
import { _gatherOneChain } from "./_gatherOneChain";
import { bundleSwapTasks } from "./bundleSwapTasks";
import { UniswapV2PartitionTask } from "../tasks/invest/UniswapV2PartitionTask";
import { ApproveTask } from "../tasks/ApproveTask";
import { Chain } from "modules/Chain";
import { UniswapV2RebalanceTask } from "../tasks/invest/UniswapV2RebalanceTask";
import { UniswapV2DecomposeTask } from "../tasks/invest/UniswapV2DecomposeTask";

export const investTasks = async (
  fromTokens: Token[],
  pair: InvestPair,
  to: string
) => {
  const { tasks, resultTokens } = await _gatherOneChain(fromTokens, pair.chainId, to);

  const dstToken0 = Token.get(pair.chainId, pair.token0.address)!;
  const dstToken1 = Token.get(pair.chainId, pair.token1.address)!;
  const chain = Chain.get(pair.chainId);

  if (resultTokens.length === 1) {
    const resultToken = resultTokens[0];
    // approve resultToken
    if(!resultToken.isNativeToken()){
      tasks.push(
        new ApproveTask(resultToken, chain.funnelAddress, `${chain.name} Funnel`)
      );
    }

    if (resultToken.id === dstToken0.id || resultToken.id === dstToken1.id) {
      // partition
      tasks.push(new UniswapV2PartitionTask(resultToken, pair, to));
    } else {
      // Decompose
      tasks.push(new UniswapV2DecomposeTask(resultToken.address, pair, to));
    }

    return tasks;
  } else {
    const [dstTokens, notDstTokens] = resultTokens.reduce(
      (acc, token) => {
        if (token.id === dstToken0.id || token.id === dstToken1.id) {
          acc[0].push(token);
        } else {
          acc[1].push(token);
        }
        return acc;
      },
      [[], []] as [Token[], Token[]]
    );

    if (dstTokens.length > 1) {
      const gatherTo = dstTokens[0].id === dstToken0.id ? dstToken1 : dstToken0;
      const gatherTasks = await bundleSwapTasks(notDstTokens, gatherTo, to);
      tasks.push(...gatherTasks);

      // rebalance
      if (!dstToken0.isNativeToken()) {
        tasks.push(
          new ApproveTask(
            dstToken0,
            chain.funnelAddress,
            `${chain.name} Funnel`
          )
        );
      }
      if (!dstToken1.isNativeToken()) {
        tasks.push(
          new ApproveTask(
            dstToken1,
            chain.funnelAddress,
            `${chain.name} Funnel`
          )
        );
      }
      const rebalanceTasks = new UniswapV2RebalanceTask(
        dstToken0.address,
        dstToken1.address,
        pair,
        to
      );
      tasks.push(rebalanceTasks);
    } else {
      if (notDstTokens.length > 1) {
        const gatherTo = notDstTokens[0];
        const gatherTasks = await bundleSwapTasks(
          notDstTokens.slice(1),
          gatherTo,
          to
        );
        tasks.push(...gatherTasks);
      }
      // decompose notDstTokens[0]
      if (!notDstTokens[0].isNativeToken()) {
        tasks.push(
          new ApproveTask(
            notDstTokens[0],
            chain.funnelAddress,
            `${chain.name} Funnel`
          )
        );
      }
      tasks.push(new UniswapV2DecomposeTask(notDstTokens[0].address, pair, to));

    }

    return tasks;
  }
};
