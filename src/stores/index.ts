import { acceptHMRUpdate, defineStore } from "pinia";
import { ref } from "vue";

import Web3 from "web3";
import { useToast } from "vue-toastification";
import { web3Modal } from "../walletConnectModal";
import config from "../config";
import tokenAbi from "../abi/token.json";
import stakingAbi from "../abi/staking.json";
import { parseUnits, formatUnits } from "@ethersproject/units";

type Token = (typeof config.pools)[0]["pair"][0];
type Pool = (typeof config.pools)[0];
export const useStore = defineStore("store", () => {
  const web3 = ref<any>(undefined);

  let provider: any = null;

  const address = ref("");
  const toast = useToast();
  const isConnected = ref(false);
  const loading = ref(false);

  const pools = ref(config.pools);

  const fixedNumber = (num: number | undefined, decimals = 6) =>
    num ? +parseFloat((+num).toFixed(decimals)) : 0;

  const switchNetwork = async () => {
    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: web3.value.utils.toHex(config.networkId) }],
      });
    } catch (err: any) {
      // This error code indicates that the chain has not been added to MetaMask
      if (err.code === 4902) {
        await window.ethereum.request({
          method: "wallet_addEthereumChain",
          params: [
            {
              chainName: config.networkName,
              chainId: web3.value.utils.toHex(config.networkId),
              nativeCurrency: {
                name: config.networkMainToken,
                decimals: 18,
                symbol: config.networkMainToken,
              },
              rpcUrls: [config.rpcUrl],
            },
          ],
        });
      } else {
        toast.error(`Please switch to ${config.networkName} Network`);
        return false;
      }
    }
    return true;
  };

  const checkNetwork = async () => {
    const networkId = await web3.value.eth.net.getId();

    if (config.networkId !== networkId) {
      const result = await switchNetwork();
      if (!result) return;
    }

    return true;
  };

  const getBalance = async (_tokenAddress: string, _address: string) => {
    const contract = new web3.value.eth.Contract(tokenAbi, _tokenAddress);
    const balance = await contract.methods.balanceOf(_address).call();
    return balance;
  };

  const loadPoolsDetails = async () => {
    for (const pool of pools.value) {
      const stakingContract = new web3.value.eth.Contract(
        stakingAbi,
        pool.address
      );
      const [userInfo, pendingReward, balance] = await Promise.all([
        stakingContract.methods.userInfo(address.value).call(),
        stakingContract.methods.pendingReward(address.value).call(),
        getBalance(pool.lpToken.address, address.value),
      ]);

      pool.reward = +formatUnits(
        userInfo.rewardDebt,
        pool.rewardToken.decimals
      );
      pool.pendingReward = +formatUnits(
        pendingReward,
        pool.rewardToken.decimals
      );
      pool.deposit = +formatUnits(userInfo.amount, pool.lpToken.decimals);
      pool.lpToken.balance = +formatUnits(balance, pool.lpToken.decimals);

      pool.rewardToken = { ...pool.rewardToken };
      pool.lpToken = { ...pool.lpToken };
    }
    console.log(pools.value[0].reward);
    pools.value = [...pools.value];
  };

  async function getAccount() {
    const accounts = await web3.value.eth.getAccounts();

    if (accounts && accounts.length > 0) address.value = accounts[0];

    if (!(await checkNetwork())) return;

    await loadPoolsDetails();

    loading.value = false;
  }

  const connectWallet = async () => {
    loading.value = true;

    try {
      provider = await web3Modal.connect();
    } catch (e) {
      loading.value = false;
    }

    if (provider) {
      try {
        web3.value = new Web3(provider);

        provider.on("accountsChanged", () => getAccount());

        provider.on("chainChanged", () => getAccount());

        const accounts = await web3.value.eth.getAccounts();

        address.value = accounts[0];

        if (address.value) isConnected.value = true;

        await getAccount();
      } catch (e) {
        console.log(e);
        toast.error("Connect grant failed! Please login again");
      }
    }
  };

  const disconnectWallet = async () => {
    if (provider.close) {
      await provider.close();
      provider = null;
    }

    web3Modal.clearCachedProvider();

    address.value = "";

    isConnected.value = false;
  };

  const harvest = async (pool: Pool) => {
    loading.value = true;

    const stakingContract = new web3.value.eth.Contract(
      stakingAbi,
      pool.address
    );
    try {
      await stakingContract.methods
        .harvest(address.value)
        .send({ from: address.value });

      toast.success("Harvest success");

      loadPoolsDetails();
    } catch (error: any) {
      toast.error(error?.message || "Signing failed, please try again!");
    }

    loading.value = false;
  };

  const checkAllowance = async (
    tokenAddress: string,
    approveAddress: string
  ) => {
    const tokenContract = new web3.value.eth.Contract(tokenAbi, tokenAddress);

    const allowance = await tokenContract.methods
      .allowance(address.value, approveAddress)
      .call();

    if (!Number(allowance)) {
      await tokenContract.methods
        .approve(approveAddress, parseUnits("9999999999999999999"))
        .send({ from: address.value });
      toast.success("Spend approved");
    }
  };

  const deposit = async (pool: Pool, amount: string) => {
    if (!+amount) return;

    loading.value = true;

    const stakingContract = new web3.value.eth.Contract(
      stakingAbi,
      pool.address
    );

    try {
      await checkAllowance(pool.lpToken.address, pool.address);

      await stakingContract.methods
        .deposit(parseUnits(`${amount}`, pool.lpToken.decimals), address.value)
        .send({ from: address.value });

      toast.success("Deposit success");

      loadPoolsDetails();
    } catch (error: any) {
      console.log(error);
      toast.error(error?.message || "Signing failed, please try again!");
    }
    loading.value = false;
  };

  const withdraw = async (pool: Pool, amount: string) => {
    if (!+amount) return;

    loading.value = true;

    const stakingContract = new web3.value.eth.Contract(
      stakingAbi,
      pool.address
    );

    try {
      await stakingContract.methods
        .withdraw(parseUnits(`${amount}`, pool.lpToken.decimals), address.value)
        .send({ from: address.value });

      toast.success("Withdraw success");

      loadPoolsDetails();
    } catch (error: any) {
      toast.error(error?.message || "Signing failed, please try again!");
    }

    loading.value = false;
  };

  const init = async () => {
    loading.value = true;
    try {
      web3.value = new Web3(new Web3.providers.HttpProvider(config.rpcUrl));
      for (const pool of pools.value) {
        const [stackedToken0, stackedToken1] = await Promise.all([
          getBalance(pool.pair[0].address, pool.lpToken.address),
          getBalance(pool.pair[1].address, pool.lpToken.address),
        ]);

        pool.pair[0].stacked = +formatUnits(
          stackedToken0,
          pool.pair[0].decimals
        );
        pool.pair[1].stacked = +formatUnits(
          stackedToken1,
          pool.pair[1].decimals
        );
      }
    } catch (e) {
      toast.error(
        "There's something wrong while fetching data from contract, please try to refresh the page."
      );
    }
    loading.value = false;
  };

  return {
    pools,
    loading,
    address,
    isConnected,
    disconnectWallet,
    connectWallet,
    checkNetwork,
    fixedNumber,
    withdraw,
    deposit,
    harvest,
    init,
  } as const;
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useStore as any, import.meta.hot));
}
