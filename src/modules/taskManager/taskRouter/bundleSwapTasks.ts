import { Token } from "modules/Token";
import { ApproveTask } from "../tasks/ApproveTask";
import { UniswapV2SwapTask } from "../tasks/move/UniswapV2SwapTask";
import { TaskBase } from "../tasks/TaskBase";
import { constants } from "ethers";
import { PROTOCOLS } from "data";
import { Chain } from "modules/Chain";
import { ZeroXQuoteDto } from "interfaces/dto/zeroX.quote.dto";
import { ZeroXSwapTask } from "../tasks/move/ZeroXSwapTask";
import axios from "axios";

export const bundleSwapTasks = async (
  fromTokens: Token[],
  toToken: Token,
  to: string
): Promise<TaskBase<any>[]> => {
  const chainId = toToken.chainId;
  if (fromTokens.some((token) => token.chainId !== chainId)) {
    throw new Error("All tokens must be on the same chain");
  }
  const protocol = PROTOCOLS.find(
    (p) => p.chainId === chainId && p.usage === "swap"
  );
  if (!protocol) {
    throw new Error(`Protocol not found for chainId ${chainId}`);
  }

  const chain = Chain.get(chainId);

  return Promise.all(
    fromTokens.map(async (fromToken) => {
      if (fromToken.address === toToken.address) return [];
      const res: TaskBase<any>[] = [];

      // first, check if 0x protocol is available
      const zeroXSupported = await isZeroXSupported(chain, fromToken, toToken);
      if (zeroXSupported) {
        if (fromToken.address !== constants.AddressZero) {
          res.push(
            new ApproveTask(
              fromToken,
              zeroXSupported.allowanceTarget,
              `0x Exchange`
            )
          );
        }

        res.push(new ZeroXSwapTask(chainId, fromToken.address, toToken.address, to))
      }
      // 0x not supported
      else {
        if (fromToken.address !== constants.AddressZero) {
          res.push(
            new ApproveTask(
              fromToken,
              protocol.data.routerAddress,
              `${protocol.name} Router`
            )
          );
        }
  
        res.push(
          new UniswapV2SwapTask(chainId, fromToken, toToken, protocol, to)
        );
      }

      return res;
    })
  ).then((tasks) => tasks.flat());
};

async function isZeroXSupported(
  chain: Chain,
  fromToken: Token,
  toToken: Token
) {
  if (!chain.zeroX) return null;
  const zeroXApi = axios.create({
    baseURL: chain.zeroX.apiBaseUrl,
  });

  const amountIn = fromToken.parse("0.1"); // mock amount

  try {
    const ETH = "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE"
    const sellToken =
      fromToken.address === constants.AddressZero ? ETH : fromToken.address;
    const buyToken =
      toToken.address === constants.AddressZero ? ETH : toToken.address;

    const { data: quoteData } = await zeroXApi.get<ZeroXQuoteDto>(
      `swap/v1/quote`,
      {
        params: {
          sellToken,
          buyToken,
          sellAmount: amountIn.toString(),
          skipValidation: true
        },
      }
    );

    return quoteData;
  } catch (error) {
    return null;
  }
}
