import { CHAINID } from "interfaces/config-data.interface";
import { TaskStatusEnum } from "interfaces/tasks/task-status.interface";
import { TaskBase } from "../TaskBase";
import { Token } from "modules/Token";
import { AmountsStatus } from "../AmountStatus";
import { Signer, constants } from "ethers";
import { Chain } from "modules/Chain";
import { ZeroXQuoteDto } from "interfaces/dto/zeroX.quote.dto";
import axios from "axios";

interface ZeroXOrder {
  // fill: {
  //   input: string;
  //   output: string;
  //   adjustedOutput: string;
  //   gas: number;
  // };
  fillData: {
    tokenAddressPath: string[];
    router: string[];
  };
  makerAmount: string;
  makerToken: string;
  source: string;
  takerAmount: string;
  takerToken: string;
  type: number;
}

interface ZeroXSource {
  name: string
  proportion: string
  intermediateToken?: "0x11fe4b6ae13d2a6055c8d9cf65c55bac32b5d844";
  hops?: string[];
}

export interface ZeroXSwapTaskData {
  status: TaskStatusEnum;
  chainId: CHAINID;
  fromTokenAddr: string;
  toTokenAddr: string;
  amountIn: string | null;
  amountOut: string | null;
  to: string;
  orders: ZeroXOrder[];
  sources: ZeroXSource[];
}

const ETH = "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE";

export class ZeroXSwapTask extends TaskBase<ZeroXSwapTaskData> {
  constructor(
    chainId: CHAINID,
    fromTokenAddr: string,
    toTokenAddr: string,
    to: string
  ) {
    // assert from token and to token are supported by 0x

    const chain = Chain.get(chainId);
    if (!chain.zeroX) throw Error("ZeroXSwapTask: chain.zeroX is undefined");

    super(chainId, "ZeroXSwap", {
      chainId: chainId,
      fromTokenAddr,
      toTokenAddr,
      amountIn: null,
      amountOut: null,
      to,
      orders: [],
      sources: [],
    });
  }

  private substIfETH(addr: string) {
    return addr === constants.AddressZero ? ETH : addr;
  }
  private async getInfo(amountStatus: AmountsStatus, skipValidation: boolean) {
    const data = this.getData();

    const chain = Chain.get(this.chainId);
    const fromToken = Token.getById(`${this.chainId}_${data.fromTokenAddr}`)!;
    const toToken = Token.getById(`${this.chainId}_${data.toTokenAddr}`)!;

    const amountIn = amountStatus.get(fromToken);
    const amountInBN = fromToken.parse(amountIn);

    const zeroXApi = axios.create({
      baseURL: chain.zeroX!.apiBaseUrl,
    });

    const { data: quoteData } = await zeroXApi.get<ZeroXQuoteDto>(
      `swap/v1/quote`,
      {
        params: {
          sellToken: this.substIfETH(data.fromTokenAddr),
          buyToken: this.substIfETH(data.toTokenAddr),
          sellAmount: amountInBN.toString(),
          takerAddress: data.to,
          skipValidation
        },
      }
    );

    const amountOutBN = quoteData.buyAmount;
    const amountOut = toToken.format(amountOutBN);

    return {
      fromToken,
      toToken,
      amountIn,
      amountInBN,
      zeroXApi,
      amountOut,
      amountOutBN,
      data,
      quoteData,
    };
  }

  /** Predict should be preceded */
  async run(
    doneAmountStatus: AmountsStatus,
    signer: Signer
  ): Promise<AmountsStatus> {
    const { fromToken, toToken, amountIn, amountOut, quoteData } =
      await this.getInfo(doneAmountStatus, false);

    const tx = await signer.sendTransaction({
      gasLimit: quoteData.gas,
      gasPrice: quoteData.gasPrice,
      to: quoteData.to,
      data: quoteData.data,
      value: quoteData.value,
      chainId: quoteData.chainId
    });

    this.changeStatus(TaskStatusEnum.Sent);
    await tx.wait();
    this.changeStatus(TaskStatusEnum.Confirmed);

    // TODO: amountOut should be calculated from tx.receipt.logs
    return doneAmountStatus.sub(fromToken, amountIn).add(toToken, amountOut);
  }

  async predict(predictAmountStatus: AmountsStatus): Promise<AmountsStatus> {
    const { fromToken, toToken, amountIn, amountOut, quoteData } =
      await this.getInfo(predictAmountStatus, true);
    this.changeData({
      amountIn,
      amountOut,
      orders: quoteData.orders,
      sources: quoteData.sources,
    });
    return predictAmountStatus.setZero(fromToken).add(toToken, amountOut);
  }
}
