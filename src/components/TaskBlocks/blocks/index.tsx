import { ApproveBlock } from "./Approve.block";
import { BridgeBlock } from "./Bridge.block";
import { DecomposeBlock } from "./Decompose.block";
import { PartitionBlock } from "./Partition.block";
import { RebalanceBlock } from "./Rebalance.block";
import { SwapBlock } from "./Swap.block";
import { ZeroXSwapBlock } from "./ZeroXSwap.block";

export const getTaskBlock = (taskName: string) => {
  switch (taskName) {
    case "Approve":
      return ApproveBlock;
    case "Bridge":
      return BridgeBlock;
    case "Decompose":
      return DecomposeBlock;
    case "Partition":
      return PartitionBlock;
    case "Rebalance":
      return RebalanceBlock;
    case "Swap":
      return SwapBlock;
    case "ZeroXSwap":
      return ZeroXSwapBlock;
    default:
      return () => <div></div>;
  }
};
