import { Token } from "modules/Token";
import { formatOrfloorTiny } from "utils/formatter";
import { constants } from "ethers";
import { WrapOrUnwrapBlock } from "./WrapOrUnwrap";
import { WrapTaskData } from "modules/taskManager/tasks/WrapTask";

export const WrapBlock = (data: WrapTaskData) => {
  const { chainId, tokenAddress, amount } = data;
  const token = Token.get(chainId, tokenAddress);
  const native = Token.get(chainId, constants.AddressZero);
  return token && native && amount ? (
    <WrapOrUnwrapBlock
      type="Wrap"
      fromToken={native}
      toToken={token}
      amount={+formatOrfloorTiny(amount)}
    />
  ) : (
    <></>
  );
};
