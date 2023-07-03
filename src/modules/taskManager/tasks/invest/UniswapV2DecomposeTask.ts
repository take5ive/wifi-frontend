import { Signer, ethers } from "ethers";
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
export interface UniswapV2DecomposeTaskData {
  status: TaskStatusEnum;
  chainId: CHAINID;
  baseTokenAddr: string;
  amountIn: string | null;
  amountIn0: string | null;
  amountIn1: string | null;
  decomposedAmountIn0: string | null;
  decomposedAmountIn1: string | null;
  receivedLP: string | null;
  to: string;
  pair: InvestPair;
}

export class UniswapV2DecomposeTask extends TaskBase<UniswapV2DecomposeTaskData> {
  constructor(baseTokenAddr: string, dstPair: InvestPair, to: string) {
    super(dstPair.chainId, "Decompose", {
      chainId: dstPair.chainId,
      baseTokenAddr,
      amountIn: null,
      amountIn0: null,
      amountIn1: null,
      decomposedAmountIn0: null,
      decomposedAmountIn1: null,
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
    const token0 = Token.getById(
      `${this.chainId}_${data.pair.token0.address}`
    )!;
    const token1 = Token.getById(
      `${this.chainId}_${data.pair.token1.address}`
    )!;
    const amountIn = amountStatus.get(baseToken)!;
    return { funnel, baseToken, token0, token1, amountIn, data };
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

    let value = ethers.constants.Zero;
    if (baseToken.isNativeToken()) {
      value = baseToken.parse(amountIn);
    }

    const tx = await funnel.decomposeAndAddLiquidity(
      substituteWETH(baseToken).address,
      lpToken.address,
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
    const { funnel, baseToken, token0, token1, amountIn, data } =
      this.getInfo(predictAmountStatus);

    const {
      swapAmount0,
      swapAmount1,
      farmAmount0,
      farmAmount1,
      liquidity,
      // remainedBaseAmount,
    } = await funnel.calculateOptimalDecomposeAmount(
      substituteWETH(baseToken).address,
      data.pair.address,
      baseToken.parse(amountIn)
    );

    const receivedLP = formatEther(liquidity);

    this.changeData({
      amountIn,
      amountIn0: baseToken.format(swapAmount0),
      amountIn1: baseToken.format(swapAmount1),
      decomposedAmountIn0: token0.format(farmAmount0),
      decomposedAmountIn1: token1.format(farmAmount1),
      receivedLP,
    });

    return (
      predictAmountStatus
        .setZero(baseToken)
        // .add(baseToken, baseToken.format(remainedBaseAmount))
        .setRaw(this.chainId, data.pair.address, liquidity)
    );
  }
}
