import { TaskStatusEnum } from "interfaces/tasks/task-status.interface";
import { TaskBase } from "../TaskBase";
import { WiFiBridgeData, ProtocolData } from "interfaces/config-data.interface";
import { Contract, Signer } from "ethers";
import { AmountsStatus } from "../AmountStatus";
import { Token } from "modules/Token";
import { WiFiBridge } from "typechain";
import { bridgeApi } from "api/bridgeApi";
import WIFI_BRIDGE_ABI from "abi/wifi/WiFiBridge.json";

export interface WiFiBridgeTaskData {
  status: TaskStatusEnum;
  amountIn: string | null;
  amountOut: string | null;
  feeAmount: string | null;
  to: string;
  phase: "none" | "from-sent" | "from-confirmed" | "done";
  protocol: ProtocolData<"WiFiBridge">;
}

export class WiFiBridgeTask extends TaskBase<WiFiBridgeTaskData> {
  constructor(protocol: ProtocolData<"WiFiBridge">, to: string) {
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
    data: WiFiBridgeData,
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
    const amountOut = toToken.format(fromToken.parse(amountIn).sub(feeAmount));

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

    const { fromToken, toToken, amountIn, amountOut, feeAmount } =
      this._getTokenAndAmounts(data, doneAmountStatus);

    const core = new Contract(
      data.coreAddress,
      WIFI_BRIDGE_ABI,
      signer
    ) as WiFiBridge;

    const fromTx = await core.sendTo(
      toToken.chainId,
      to,
      fromToken.parse(amountIn)
    );

    this.changeStatus(TaskStatusEnum.Sent);
    this.changeData({ phase: "from-sent" });
    await fromTx.wait();
    this.changeData({ phase: "from-confirmed" });

    const txHash = await bridgeApi
      .get<{ txHash: string }>(
        `?fromChainId=${fromToken.chainId}&chainId=${toToken.chainId}&amount=${amountIn}&to=${to}`
      )
      .then((res) => {
        return res.data.txHash;
      });
    const tx = await toToken.getProvider().getTransaction(txHash);
    await tx.wait();

    this.changeData({
      phase: "done",
      amountOut,
      feeAmount: fromToken.format(feeAmount),
    });
    this.changeStatus(TaskStatusEnum.Confirmed);

    return doneAmountStatus.setZero(fromToken).add(toToken, amountOut);
  }

  async predict(predictAmountStatus: AmountsStatus): Promise<AmountsStatus> {
    const {
      protocol: { data },
    } = this.getData();

    const { fromToken, toToken, amountIn, amountOut, feeAmount } =
      this._getTokenAndAmounts(data, predictAmountStatus);

    if (fromToken.parse(amountIn).lt(feeAmount)) {
      throw new Error("Insufficient amount to pay fee");
    }

    this.changeData({
      amountIn,
      amountOut,
      feeAmount: fromToken.format(feeAmount),
    });

    return predictAmountStatus.setZero(fromToken).add(toToken, amountOut);
  }
}
