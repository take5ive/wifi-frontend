import { FC } from "react";
import { ApproveRunView } from "./Approve.runview";
import { UniswapV2SwapRunView } from "./UniswapV2Swap.runview";
import { PartitionRunView } from "./Partition.runview";
import { RebalanceRunView } from "./Rebalance.runview";
import { DecomposeRunView } from "./Decompose.runview";
import { WiFiBridgeRunView } from "./Bridge.runview";
import { WrapOrUnwrapRunView } from "./WrapOrUnwrap.runview";
import { ZeroXSwapRunView } from "./ZeroXSwap.runview";

export const getRunTaskViewRouter = (taskName: string): FC<{ task: any }> => {
  switch (taskName) {
    case "Approve":
      return ApproveRunView;
    case "Bridge":
      return WiFiBridgeRunView;
    case "Decompose":
      return DecomposeRunView;
    case "Partition":
      return PartitionRunView;
    case "Rebalance":
      return RebalanceRunView;
    case "Swap":
      return UniswapV2SwapRunView;
    case "ZeroXSwap":
      return ZeroXSwapRunView;
    case "Wrap":
    case "Unwrap":
      return WrapOrUnwrapRunView;
    default:
      return () => <div></div>;
  }
};
