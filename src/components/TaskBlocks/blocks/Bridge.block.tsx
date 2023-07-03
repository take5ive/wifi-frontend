import { Chip } from "components/Chip";
import { TokenIcon } from "components/TokenIcon";
import { Token } from "modules/Token";
import { FaArrowRight } from "react-icons/fa";
import { BlockContainer } from "./BlockContainer";
import { formatOrfloorTiny } from "utils";
import { ConnextBridgeTaskData } from "modules/taskManager/tasks/move/ConnextBridgeTask";

export const BridgeBlock = (props: ConnextBridgeTaskData) => {
  const {
    protocol: {
      name,
      data: { fromToken: _from, toToken: _to },
    },
    amountIn,
    amountOut,
    feeAmount,
  } = props;
  const fromToken = Token.get(_from.chainId, _from.address)!;
  const toToken = Token.get(_to.chainId, _to.address)!;
  return (
    <BlockContainer>
      <Chip color="pink" className="mx-4 w-28" content="Bridge" />
      <TokenIcon token={fromToken} size="lg" />
      <p className="ml-2 text-lg font-bold">
        {formatOrfloorTiny(amountIn ?? "")}
      </p>
      <p className="ml-2 text-lg font-bold">{fromToken.symbol}</p>

      <FaArrowRight className="mx-4" />
      <TokenIcon token={toToken} size="lg" />
      <p className="ml-2 text-lg font-bold">
        {formatOrfloorTiny(amountOut ?? "")}
      </p>
      <p className="ml-2 text-lg font-bold">{toToken.symbol}</p>
      <div className="border-l pl-4 ml-4 flex">
        <Chip color="gray" size="sm" content="via" />
        <p className="ml-2 font-semibold">{name}</p>
      </div>
      <div className="border-l pl-4 ml-4 flex">
        <Chip color="gray" size="sm" content="fee" />
        <p className="ml-2 font-semibold">
          {formatOrfloorTiny(feeAmount ?? "")} {fromToken.symbol}
        </p>
      </div>
    </BlockContainer>
  );
};
