import Modal from "components/Modal";
import { useEffect } from "react";
import { useConnectWallet } from "states/wallet.state";
import { ellipsisAddress } from "utils";

interface ConnectWalletModalProps {
  closeModal: () => void;
  title?: string;
}

function ConnectWalletModal({ closeModal }: ConnectWalletModalProps) {
  const { connect, account } = useConnectWallet();
  useEffect(() => {
    if (account) closeModal();
  }, [account]);
  return (
    <Modal closeModal={closeModal} title="Connect Wallet" size="md">
      <div className="flex flex-col p-4">
        <p className="text-sm text-neutral-400 mb-3">
          Please connect your wallet to continue
        </p>
        {account ? (
          <div className="btn border border-primary-400 text-primary-500">
            &#10004; Connected to {ellipsisAddress(account)}
          </div>
        ) : (
          <button onClick={connect} className="btn bg-primary-500 text-white">
            Connect Metamask
          </button>
        )}
      </div>
    </Modal>
  );
}

export default ConnectWalletModal;
