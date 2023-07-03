# Wi-Fi

For `Decreasing Frictions in DeFi` Hackathon

## Description

우리 프로덕트 설명

## 0x Swap API

We used `0x Swap API` to gather several tokens into one token
Since 0x api supports few token swap pair (only ETH-USDC) on Göerli testnet, our service used 0x api only for pairs within 0x-supported tokens, and if not, we had to proceed with swapping in UniswapV2 contracts distributed by our team.

The code below is to verify that 0x api supports swap paths.
On `src/modules/taskManager/taskRouter/bundleSwapTasks.ts`,

```typescript
async function isZeroXSupported(
  chain: Chain,
  fromToken: Token,
  toToken: Token
) {
  if (!chain.zeroX) return null; // 0x unsupported chain
  const zeroXApi = axios.create({
    baseURL: chain.zeroX.apiBaseUrl,
  });

  const amountIn = fromToken.parse("0.1"); // mock amount for check 0x swap route

  try {
    const ETH = "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE";
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
          skipValidation: true,
        },
      }
    );

    return quoteData;
  } catch (error) {
    return null;
  }
}
```

Once the swap path is confirmed, use the code below to run the swap.
On `src/modules/taskManager/tasks/move/ZeroXSwapTask.ts`,

```typescript
const { fromToken, toToken, amountIn, amountOut, quoteData } =
  await this.getInfo(doneAmountStatus, false);

const tx = await signer.sendTransaction({
  gasLimit: quoteData.gas,
  gasPrice: quoteData.gasPrice,
  to: quoteData.to,
  data: quoteData.data,
  value: quoteData.value,
  chainId: quoteData.chainId,
});
```

## ConnectKit

It was really easy to link connectkit to our service.  
With this hackathon, I think I will use connectkit often in the future.
On `src/App.tsx`,

```typescript
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
```
