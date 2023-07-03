import { Signer, constants } from "ethers";
import { TaskBase } from "../TaskBase";
import { AmountsStatus } from "../AmountStatus";
import { Chain } from "modules/Chain";
import { Token } from "modules/Token";
import { TaskStatusEnum } from "interfaces/tasks/task-status.interface";
import { CHAINID } from "interfaces/config-data.interface";
import { InvestPair } from "interfaces/invest-pair.interface";
import { formatEther } from "ethers/lib/utils";
import { substituteWETH } from "./_substituteWETH";

/**
 * Swap all of `fromToken` to `toToken`
 */
export interface UniswapV2PartitionTaskData {
  status: TaskStatusEnum;
  chainId: CHAINID;
  baseTokenAddr: string;
  farmTokenAddr: string;
  amountIn: string | null;
  amountInBase: string | null;
  amountInFarm: string | null;
  receivedLP: string | null;
  to: string;
  pair: InvestPair;
}

export class UniswapV2PartitionTask extends TaskBase<UniswapV2PartitionTaskData> {
  constructor(inputToken: Token, dstPair: InvestPair, to: string) {
    const farmTokenAddr =
      dstPair.token0.address === inputToken.address
        ? dstPair.token1.address
        : dstPair.token0.address;

    super(inputToken.chainId, "Partition", {
      chainId: inputToken.chainId,
      baseTokenAddr: inputToken.address,
      farmTokenAddr,
      amountIn: null,
      amountInBase: null,
      amountInFarm: null,
      receivedLP: null,
      to,
      pair: dstPair,
    });
  }

  private getInfo(amountStatus: AmountsStatus, signer?: Signer) {
    const data = this.getData();
    let funnel = Chain.get(this.chainId).getFunnel();
    if (signer) funnel = funnel.connect(signer);

    const baseToken = Token.getById(`${this.chainId}_${data.baseTokenAddr}`)!;
    const farmToken = Token.getById(`${this.chainId}_${data.farmTokenAddr}`)!;
    const amountIn = amountStatus.get(baseToken)!;
    return { funnel, baseToken, farmToken, amountIn, data };
  }

  async run(
    doneAmountStatus: AmountsStatus,
    signer: Signer
  ): Promise<AmountsStatus> {
    const { funnel, data, baseToken, amountIn } = this.getInfo(
      doneAmountStatus,
      signer
    );

    /** Predict should be preceded */
    const lpToken = new Token({
      chainId: this.chainId,
      address: data.pair.address,
      decimals: 18,
      symbol: "LP",
    });
    const beforeLp = await lpToken.getContract().balanceOf(data.to);

    let value = constants.Zero;
    if (baseToken.isNativeToken()) {
      value = baseToken.parse(amountIn);
    }

    const tx = await funnel.partitionAndAddLiquidity(
      lpToken.address,
      substituteWETH(baseToken).address,
      data.to,
      baseToken.parse(amountIn),
      { value }
    );

    this.changeStatus(TaskStatusEnum.Sent);
    await tx.wait();
    this.changeStatus(TaskStatusEnum.Confirmed);
    const afterLp = await lpToken.getContract().balanceOf(data.to);

    const receivedLP = lpToken.format(afterLp.sub(beforeLp));
    return doneAmountStatus.setZero(baseToken).add(lpToken, receivedLP);
  }

  async predict(predictAmountStatus: AmountsStatus): Promise<AmountsStatus> {
    const { funnel, baseToken, farmToken, amountIn, data } =
      this.getInfo(predictAmountStatus);

    const { swapAmount, swappedAmount, liquidity } =
      await funnel.calculateOptimalRebalanceAmount(
        data.pair.address,
        substituteWETH(baseToken).address,
        baseToken.parse(amountIn),
        "0"
      );

    const amountInBase = baseToken.format(
      baseToken.parse(amountIn).sub(swapAmount)
    );
    const receivedLP = formatEther(liquidity);

    this.changeData({
      amountIn,
      amountInBase,
      amountInFarm: farmToken.format(swappedAmount),
      receivedLP,
    });

    return predictAmountStatus
      .setZero(baseToken)
      .setRaw(this.chainId, data.pair.address, liquidity);
  }
}
