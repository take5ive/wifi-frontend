import { Token } from "modules/Token";
import { BlockContainer } from "./BlockContainer";
import { FaArrowRight } from "react-icons/fa";
import { Chip } from "components/Chip";
import { TokenIcon } from "components/TokenIcon";

interface WrapOrUnwrapBlockProps {
  type: "Wrap" | "Unwrap" 
  fromToken: Token;
  toToken: Token;
  amount: number;
}
export const WrapOrUnwrapBlock = ({type, fromToken, toToken, amount}: WrapOrUnwrapBlockProps) => {
  return (
    <BlockContainer>
      <Chip color="gray" className="mx-4 w-28" content={type} />
      <TokenIcon token={fromToken} size="lg" />
      <p className="ml-2 text-lg font-bold">{amount}</p>
      <p className="ml-2 text-lg font-bold">{fromToken.symbol}</p>

      <FaArrowRight className="mx-4" />
      <TokenIcon token={toToken} size="lg" />
      <p className="ml-2 text-lg font-bold">
        {amount}
      </p>
      <p className="ml-2 text-lg font-bold">{toToken.symbol}</p>
    </BlockContainer>
  );
};
