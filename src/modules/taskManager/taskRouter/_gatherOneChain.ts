import { BridgeDataBase, CHAINID } from "interfaces/config-data.interface";
import { Token } from "modules/Token";
import { TaskBase } from "../tasks/TaskBase";
import { PROTOCOLS } from "data";
import { bundleSwapTasks } from "./bundleSwapTasks";
import { bridgeTasks } from "./bridgeTasks";

export const _gatherOneChain = async (
  fromTokens: Token[],
  dstChainId: CHAINID,
  to: string
) => {
  const tasks: TaskBase<any>[] = [];

  const tokensByChainId = fromTokens.reduce((acc, token) => {
    acc[token.chainId] = acc[token.chainId] || [];
    acc[token.chainId].push(token);
    return acc;
  }, {} as Record<CHAINID, Token[]>);
  tokensByChainId[dstChainId] = tokensByChainId[dstChainId] || [];

  // bridge from external chain to toToken chain
  for (const _chainId in tokensByChainId) {
    const externalChainId = +_chainId;
    // same chain: no need to bridge
    if (externalChainId === dstChainId) continue;

    const bridgeCore = PROTOCOLS.find((p) => {
      if (p.usage !== "bridge") return false;
      const { fromToken, toToken } = p.data as BridgeDataBase;
      return (
        fromToken.chainId === externalChainId && toToken.chainId === dstChainId
      );
    });

    if (!bridgeCore) {
      throw new Error(
        `Bridge not found for chainId ${externalChainId} -> ${dstChainId}`
      );
    }

    const bridgeFromToken = Token.get(
      externalChainId,
      bridgeCore.data.fromToken.address
    )!;

    const swapToBridgeTokenTasks = await bundleSwapTasks(
      tokensByChainId[externalChainId],
      bridgeFromToken,
      to
    );

    tasks.push(...swapToBridgeTokenTasks);

    const bridgingTasks = bridgeTasks(bridgeCore, to);
    tasks.push(...bridgingTasks);

    // destination chain에 bridge의 toToken이 존재하지 않는 경우 추가해준다.
    if (
      tokensByChainId[dstChainId].every(
        (i) => i.address !== bridgeCore.data.toToken.address
      )
    ) {
      const bridgeToToken = Token.get(
        bridgeCore.data.toToken.chainId,
        bridgeCore.data.toToken.address
      )!;
      tokensByChainId[dstChainId].push(bridgeToToken);
    }
  }
  return {
    resultTokens: tokensByChainId[dstChainId],
    tasks,
  };
};
