import { Token } from "modules/Token";
import { TaskBase } from "./TaskBase";
import { CHAINID } from "interfaces/config-data.interface";
import { TaskStatusEnum } from "interfaces/tasks/task-status.interface";
import { Signer } from "ethers";
import { AmountsStatus } from "./AmountStatus";

/**
 * Approve all of `Token` to `spender`
 */
export interface ApproveTaskData {
  status: TaskStatusEnum;
  chainId: CHAINID;
  tokenAddr: string;
  spenderAlias: string;
  spender: string;
  amount: string | null;
  alreadyDone: boolean;
}

export class ApproveTask extends TaskBase<ApproveTaskData> {
  constructor(token: Token, spender: string, spenderAlias: string) {
    super(token.chainId, "Approve", {
      chainId: token.chainId,
      tokenAddr: token.address,
      spender,
      spenderAlias,
      amount: null,
      alreadyDone: false,
    });
  }

  async run(
    doneAmountStatus: AmountsStatus,
    signer: Signer
  ): Promise<AmountsStatus> {
    const data = this.getData();
    const token = Token.getById(`${data.chainId}_${data.tokenAddr}`)!;
    const tokenContract = token.getContract().connect(signer);
    const amount = token.parse(doneAmountStatus.get(token));

    if (amount.gt(0)) {
      const allowance = await tokenContract.allowance(
        await signer.getAddress(),
        data.spender
      );
      if (amount.gt(allowance)) {
        const tx = await tokenContract.approve(data.spender, amount);
        this.changeStatus(TaskStatusEnum.Sent);
        await tx.wait();
      } else {
        this.changeData({ alreadyDone: true });
      }
    } else {
      this.changeData({ alreadyDone: true });
    }

    this.changeStatus(TaskStatusEnum.Confirmed);
    return doneAmountStatus;
  }

  async predict(predictAmountStatus: AmountsStatus): Promise<AmountsStatus> {
    const data = this.getData();
    const token = Token.getById(`${this.chainId}_${data.tokenAddr}`)!;
    const amount = predictAmountStatus.get(token);
    this.changeData({ amount });
    return predictAmountStatus;
  }
}
