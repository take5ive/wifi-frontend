import { UniswapV2Router } from "typechain";
import { Signer, constants, ethers } from "ethers";
import { TaskBase } from "../TaskBase";
import { AmountsStatus } from "../AmountStatus";
import { Chain } from "modules/Chain";
import { Token } from "modules/Token";
import { TaskStatusEnum } from "interfaces/tasks/task-status.interface";
import { CHAINID, ProtocolData } from "interfaces/config-data.interface";
import UniswapV2Router_ABI from "abi/uniswapV2/UniswapV2Router.json";

/**
 * Swap all of `fromToken` to `toToken`
 */
export interface UniswapV2SwapTaskData {
  status: TaskStatusEnum;
  chainId: CHAINID;
  fromTokenAddr: string;
  toTokenAddr: string;
  amountIn: string | null;
  amountOut: string | null;
  path: string[];
  to: string;
  protocol: ProtocolData;
}

export class UniswapV2SwapTask extends TaskBase<UniswapV2SwapTaskData> {
  constructor(
    chainId: CHAINID,
    fromToken: Token,
    toToken: Token,
    protocol: ProtocolData<"UniswapV2">,
    to: string
  ) {
    const adjustedPath = [fromToken.address, toToken.address].map((addr) =>
      addr === constants.AddressZero ? protocol.data.wETHAddress : addr
    );
    super(chainId, "Swap", {
      chainId: chainId,
      fromTokenAddr: fromToken.address,
      toTokenAddr: toToken.address,
      amountIn: null,
      amountOut: null,
      path: adjustedPath,
      protocol,
      to,
    });
  }

  private async getInfo(amountStatus: AmountsStatus, signer?: Signer) {
    const data = this.getData();

    let router = new ethers.Contract(
      data.protocol.data.routerAddress,
      UniswapV2Router_ABI,
      Chain.get(this.chainId).getProvider()
    ) as UniswapV2Router;

    if (signer) {
      router = router.connect(signer);
    }

    const fromToken = Token.getById(`${this.chainId}_${data.fromTokenAddr}`)!;
    const toToken = Token.getById(`${this.chainId}_${data.toTokenAddr}`)!;
    const amountIn = amountStatus.get(fromToken);
    const amountInBN = fromToken.parse(amountIn);
    const amountsOut = await router.getAmountsOut(amountInBN, data.path);
    const amountOutBN = amountsOut[amountsOut.length - 1];
    const amountOut = toToken.format(amountOutBN);

    return {
      fromToken,
      toToken,
      amountIn,
      amountOut,
      amountInBN,
      amountOutBN,
      router,
      data,
    };
  }

  /** Predict should be preceded */
  async run(
    doneAmountStatus: AmountsStatus,
    signer: Signer
  ): Promise<AmountsStatus> {
    const {
      router,
      data,
      fromToken,
      toToken,
      amountIn,
      amountInBN,
      amountOut,
      amountOutBN,
    } = await this.getInfo(doneAmountStatus, signer);

    let tx: ethers.ContractTransaction;
    if (fromToken.isNativeToken()) {
      tx = await router.swapExactETHForTokens(
        amountOutBN,
        data.path,
        data.to,
        constants.MaxUint256,
        { value: amountInBN }
      );
    } else {
      tx = await router[
        toToken.isNativeToken()
          ? "swapExactTokensForETH"
          : "swapExactTokensForTokens"
      ](amountInBN, amountOutBN, data.path, data.to, constants.MaxUint256);
    }
    this.changeStatus(TaskStatusEnum.Sent);
    await tx.wait();
    this.changeStatus(TaskStatusEnum.Confirmed);

    // TODO: amountOut should be calculated from tx.receipt.logs
    return doneAmountStatus.sub(fromToken, amountIn).add(toToken, amountOut);
  }

  async predict(predictAmountStatus: AmountsStatus): Promise<AmountsStatus> {
    const { fromToken, toToken, amountIn, amountOut } = await this.getInfo(
      predictAmountStatus
    );
    this.changeData({ amountIn, amountOut });
    return predictAmountStatus.setZero(fromToken).add(toToken, amountOut);
  }
}
