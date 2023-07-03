import { TaskStatusEnum } from "interfaces/tasks/task-status.interface";
import { TaskBase } from "../TaskBase";
import {
  ConnextBridgeData,
  ProtocolData,
} from "interfaces/config-data.interface";
import { BigNumber, Contract, Signer } from "ethers";
import { AmountsStatus } from "../AmountStatus";
import { Token } from "modules/Token";
import { ConnextBridge } from "typechain";
import CONNEXT_BRIDGE_ABI from "abi/connext/ConnextBridge.json";
import { sleep } from "utils/sleep";

export interface ConnextBridgeTaskData {
  status: TaskStatusEnum;
  amountIn: string | null;
  amountOut: string | null;
  feeAmount: string | null;
  to: string;
  phase: "none" | "from-sent" | "from-confirmed" | "done";
  protocol: ProtocolData<"ConnextBridge">;
}

export class ConnextBridgeTask extends TaskBase<ConnextBridgeTaskData> {
  constructor(protocol: ProtocolData<"ConnextBridge">, to: string) {
    super(protocol.chainId, "Bridge", {
      amountIn: null,
      amountOut: null,
      feeAmount: null,
      to,
      protocol,
      phase: "none",
    });
  }

  private _getTokenAndAmounts(
    data: ConnextBridgeData,
    amountStatus: AmountsStatus
  ) {
    const fromToken = Token.get(
      data.fromToken.chainId,
      data.fromToken.address
    )!;
    const toToken = Token.get(data.toToken.chainId, data.toToken.address)!;

    const amountIn = amountStatus.get(fromToken);

    // fee: fromToken
    const feeAmount = fromToken.parse(amountIn).mul(data.feeBps).div(1e4);
    const amountOut = toToken.format(
      fromToken.parse(amountIn).sub(feeAmount).sub(data.relayerGasFee)
    );

    return { fromToken, toToken, amountIn, amountOut, feeAmount };
  }

  async run(
    doneAmountStatus: AmountsStatus,
    signer: Signer
  ): Promise<AmountsStatus> {
    const {
      protocol: { data },
      to,
    } = this.getData();

    const { fromToken, toToken, amountIn, feeAmount } =
      this._getTokenAndAmounts(data, doneAmountStatus);


    const core = new Contract(
      data.coreAddress,
      CONNEXT_BRIDGE_ABI,
      signer
    ) as ConnextBridge;

    const fromTx = await core.xcall(
      data.dstChainIdentifier,
      to,
      data.fromToken.address,
      to,
      fromToken.parse(amountIn),
      300,
      "0x",
      data.relayerGasFee
    );

    this.changeStatus(TaskStatusEnum.Sent);
    this.changeData({ phase: "from-sent" });
    const beforeBridgeToAmount = await toToken.getContract().balanceOf(to);


    await fromTx.wait();
    this.changeData({ phase: "from-confirmed" });

    await sleep(60 * 1000);
    let elapsedTime = 60;
    let realAmountOut: string = "";

    while (true) {
      await sleep(5000);
      elapsedTime += 5;
      console.log('elapsedTime', elapsedTime)
      const currToAmount = await toToken.getContract().balanceOf(to);
      if (currToAmount.gt(beforeBridgeToAmount)) {
        realAmountOut = toToken.format(currToAmount.sub(beforeBridgeToAmount));
        break;
      }
      if (elapsedTime > 600) {
        throw Error("Too much time elapsed");
      }
    }
    this.changeData({
      phase: "done",
      amountOut: realAmountOut,
      feeAmount: fromToken.format(feeAmount.add(data.relayerGasFee)),
    });
    this.changeStatus(TaskStatusEnum.Confirmed);

    return doneAmountStatus.setZero(fromToken).add(toToken, realAmountOut);
  }

  async predict(predictAmountStatus: AmountsStatus): Promise<AmountsStatus> {
    const {
      protocol: { data },
    } = this.getData();

    const { fromToken, toToken, amountIn, amountOut, feeAmount } =
      this._getTokenAndAmounts(data, predictAmountStatus);

    if (
      fromToken
        .parse(amountIn)
        .lt(BigNumber.from(data.relayerGasFee).add(feeAmount))
    ) {
      throw new Error("Insufficient amount to pay fee");
    }

    this.changeData({
      amountIn,
      amountOut,
      feeAmount: fromToken.format(feeAmount.add(data.relayerGasFee)),
    });

    return predictAmountStatus.setZero(fromToken).add(toToken, amountOut);
  }
}
