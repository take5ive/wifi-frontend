type BaseStrategy = "Swap" | "Bridge"
type Strategy = BaseStrategy 
    | "SplitNLiquidity"     // e.g. Uniswap, Pancakeswap
    | "Liquidity"           // e.g. Curve