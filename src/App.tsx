import Router from "router";
import { WagmiConfig, configureChains, createConfig } from "wagmi";
// @ts-ignore
import { ConnectKitProvider, getDefaultConfig } from "connectkit";
import { gnosisChiado, goerli, polygonMumbai } from "wagmi/chains";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { publicProvider } from "wagmi/providers/public";

const { chains } = configureChains(
  [goerli, polygonMumbai, gnosisChiado],
  [alchemyProvider({ apiKey: import.meta.env.VITE_ALCHEMY_ID }), publicProvider()],
)

const config = createConfig(
  getDefaultConfig({
    chains,
    // Required API Keys
    // alchemyId: process.env.ALCHEMY_ID, 
    alchemyId: import.meta.env.VITE_ALCHEMY_ID,
    walletConnectProjectId: import.meta.env.VITE_WALLET_CONNECT_PROJECT_ID,

    // Required
    appName: "Wi-Fi",

    // Optional
    appDescription: "Wi-Fi is a DeFi onboarding app for everyone.",
    appUrl: "https://family.co", // your app's url
    appIcon: "https://family.co/logo.png", // your app's icon, no bigger than 1024x1024px (max. 1MB)
  })
);


function App() {
  return (
    <WagmiConfig config={config}>
      <ConnectKitProvider theme="default" mode="dark">
        <Router />
      </ConnectKitProvider>
    </WagmiConfig>
  );
}

export default App;
