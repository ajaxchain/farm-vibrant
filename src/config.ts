export default {
  title: "PLS",
  logo: "/images/tokens/LOGO.png",
  meta: {
    title: "Buy Placeholder Tokens",
    description: "Buy Placeholder Tokens",
  },
  telegramUrl: "https://t.me/vibrantblock",

  // networkName: "Goerli test network",
  // networkMainToken: "ETH",
  // networkId: 5,
  // rpcUrl: "https://goerli.infura.io/v3/b1b81dd74995434795184b19dbfb9048",

  networkName: "Ethereum Mainnet",
  networkMainToken: "ETH",
  networkId: 1,
  rpcUrl: "https://eth.llamarpc.com",
  explorerUrl: "https://etherscan.io",

  ZERO_ADDRESS: "0x0000000000000000000000000000000000000000",
  TOKEN_DECIMAL: 18,

  pools: [
    {
      address: "#",
      lpToken: {
        address: "#",
        name: "Vibrant-WETH LP",
        symbol: "Vibrant-WETH LP",
        decimals: 18,
        buyUrl:
          "#",
        balance: 0,
      },
      pair: [
        {
          symbol: "Vibrant",
          name: "Vibrant",
          image: "/images/tokens/LOGO.png",
          address: "#",
          decimals: 9,
          stacked: 0,
        },
        {
          symbol: "WETH",
          name: "WETH",
          image: "/images/tokens/bnb.png",
          address: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
          decimals: 18,
          stacked: 0,
        },
      ],
      rewardToken: {
        symbol: "Vibrant",
        name: "Vibrant",
        image: "/images/tokens/LOGO.png",
        address: "#",
        decimals: 9,
      },
      platform: "Ethereum Mainnet",
      vesting: 0,
      reward: 0,
      pendingReward: 0,
      deposit: 0,
    },
  ],
};
