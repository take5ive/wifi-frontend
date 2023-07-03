import ConnectWalletModal from "components/ConnectWalletModal";
import { IconType } from "react-icons";
import { useNavigate } from "react-router-dom";
import { useWallet } from "states/wallet.state";
import { useModal } from "utils";

interface MenuItemProps {
  Icon: IconType;
  iconSize: number;
  title: string;
  descriptions: string[];
  linkTo: string;
}
export const MenuItem = ({
  linkTo,
  Icon,
  iconSize,
  title,
  descriptions,
}: MenuItemProps) => {
  const nav = useNavigate();
  const { account } = useWallet();
  const [isModalOpen, openModal, _closeModal] = useModal(false);

  const onClick = () => {
    if (account) {
      nav(linkTo);
    } else {
      openModal();
    }
  };

  const closeModal = () => {
    if (account) nav(linkTo);
    _closeModal();
  };
  return (
    <>
      <div className="group cursor-pointer" onClick={onClick}>
        {/* for lifting animation */}
        <div className="group-hover:-mb-3" />

        <div className="flex items-center border rounded-xl pl-10 pr-6 h-44 group-hover:border-primary-500 group-hover:border-2 group-hover:shadow-lg group-hover:mb-3">
          <div>
            <Icon size={iconSize} className="group-hover:text-primary-500" />
          </div>
          <div className="flex flex-col ml-10">
            <p className="text-2xl font-bold mb-2 group-hover:text-primary-700">
              {title}
            </p>
            {descriptions.map((description, i) => (
              <p
                key={i}
                className="text-lg text-neutral-500 leading-6 group-hover:text-primary-500"
              >
                {description}
              </p>
            ))}
          </div>
        </div>
      </div>
      {isModalOpen && <ConnectWalletModal closeModal={closeModal} />}
    </>
  );
};
