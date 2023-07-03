import { Contract, Signer, constants } from "ethers";
import { AmountsStatus } from "./AmountStatus";
import { TaskBase } from "./TaskBase";
import { TaskStatusEnum } from "interfaces/tasks/task-status.interface";
import { Token } from "modules/Token";
import { WETH9 } from "typechain";
import { formatEther, parseEther } from "ethers/lib/utils";
import WETH_ABI from "abi/common/WETH9.json";

export interface UnwrapTaskData {
  chainId: number;
  status: TaskStatusEnum;
  tokenAddress: string;
  amount: string | null;
}
export class UnwrapTask extends TaskBase<UnwrapTaskData> {
  constructor(chainId: number, tokenAddress: string) {
    super(chainId, "Unwrap", {
      chainId,
      tokenAddress,
      amount: null,
    });
  }

  async run(
    doneAmountStatus: AmountsStatus,
    signer: Signer
  ): Promise<AmountsStatus> {
    const { tokenAddress } = this.getData();
    const wETH = new Token({
      chainId: this.chainId,
      address: this.getData().tokenAddress,
      decimals: 18,
      symbol: "WETH",
    });
    const native = Token.get(this.chainId, constants.AddressZero);

    const wETHContract = new Contract(tokenAddress, WETH_ABI, signer) as WETH9;
    const amount = parseEther(doneAmountStatus.get(wETH!));

    const tx = await wETHContract.withdraw(amount);
    this.changeStatus(TaskStatusEnum.Sent);
    await tx.wait();
    this.changeStatus(TaskStatusEnum.Confirmed);

    return doneAmountStatus.setZero(wETH!).add(native!, formatEther(amount));
  }
  async predict(predictAmountStatus: AmountsStatus): Promise<AmountsStatus> {
    const wETH = new Token({
      chainId: this.chainId,
      address: this.getData().tokenAddress,
      decimals: 18,
      symbol: "WETH",
    });
    const native = Token.get(this.chainId, constants.AddressZero);
    const amount = predictAmountStatus.get(wETH);
    this.changeData({ amount });
    return predictAmountStatus.setZero(wETH).add(native!, amount);
  }
}
