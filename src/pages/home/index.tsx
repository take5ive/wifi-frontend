import ROUTES from "router/route-names";
import { MenuItem } from "./MenuItem";
import { AiOutlineStock } from "react-icons/ai";
import { FaCompressArrowsAlt } from "react-icons/fa";
import { RiHandCoinLine } from "react-icons/ri";
// import { WalletConnectButton } from "components/WalletConnectButton";
// @ts-ignore
import { ConnectKitButton } from "connectkit";

export function Home() {
  return (
    <div className="w-screen h-screen flex items-center p-20 pb-32">
      <div className="flex flex-[2] flex-col">
        <p className="text-5xl">Start DeFi Onboarding with</p>
        <p className="-mt-8 text-6xl font-bold text-primary-500">Wi.Fi</p>
        <div className="flex flex-col gap-4">
          {/* <WalletConnectButton className="flex-1 py-4" /> */}
          <div className="flex items-center justify-center">
            <ConnectKitButton />
          </div>
        </div>
      </div>
      <div className="flex flex-[3] flex-col ml-20 space-y-12">
        <MenuItem
          title="Invest"
          linkTo={ROUTES.INVEST}
          Icon={AiOutlineStock}
          iconSize={64}
          descriptions={[
            "New to DeFi investments and not sure where to start?",
            "Give Funnel a try and explore step by step!",
          ]}
        />
        <MenuItem
          title="Gather Multichain Assets (via swaps, bridges)"
          linkTo={ROUTES.GATHER}
          Icon={FaCompressArrowsAlt}
          iconSize={64}
          descriptions={[
            "Bring all your assets from different blockchains together effortlessly with Funnel",
            "while saving on costs!",
          ]}
        />
        <MenuItem
          title="Withdraw"
          linkTo={ROUTES.WITHDRAW}
          Icon={RiHandCoinLine}
          iconSize={64}
          descriptions={[
            "Have you already experienced DeFi investments?",
            "If so, reclaim your investment assets and realize profits!",
          ]}
        />
      </div>
    </div>
  );
}
