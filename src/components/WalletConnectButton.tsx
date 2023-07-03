import { Chain } from "modules/Chain";
import { useConnectWallet } from "states/wallet.state";
import { ChainIcon } from "./ChainIcon";
import { cn, ellipsisAddress } from "utils";

interface WalletConnectButtonProps {
  className?: string;
}

export const WalletConnectButton = ({
  className,
}: WalletConnectButtonProps) => {
  const { connect, account, chainId, disconnect } = useConnectWallet();
  const chain = Chain.get(chainId);

  return account ? (
    <button
      onClick={disconnect}
      className={cn(
        "btn-left-icon btn-primary-o flex justify-center items-center",
        className
      )}
    >
      <ChainIcon chain={chain} size="lg" />
      <p className="text-xl ml-4">
        Connected to {ellipsisAddress(account, 12, 8)}
      </p>
    </button>
  ) : (
    <button
      onClick={connect}
      className={cn(
        "flex justify-center items-center font-medium rounded-lg leading-none btn-primary text-xl py-4",
        className
      )}
    >
      Connect Wallet
    </button>
  );
};
