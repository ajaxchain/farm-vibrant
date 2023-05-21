<script setup lang="ts">
import { storeToRefs } from "pinia";
import { computed, ref } from "vue";
import { useStore } from "../stores";
import { useStakingStore } from "../stores/staking";

const store = useStore();
const { isConnected, loading }: any = storeToRefs(store);

const stakingStore = useStakingStore();
const { selectedPool: pool, action } = storeToRefs(stakingStore);

const modal = ref<HTMLElement>();

const clickOutside = (event: Event): void => {
  const childElement = modal.value;
  if (
    event.target instanceof HTMLElement &&
    !childElement?.contains(event.target)
  ) {
    close();
  }
};

const close = () => {
  if (loading.value) return;
  pool.value = undefined;
};

const amount = ref<any>("");
const actions = ["stake", "withdraw"];
const percentages = [25, 50, 75, 100];

const insufficientBalance = computed(() =>
  action.value === "stake"
    ? pool.value?.lpToken.balance && +amount.value > +pool.value.lpToken.balance
    : pool.value?.deposit && +amount.value > +pool.value.deposit
);

const disableButton = computed(
  () =>
    loading.value ||
    insufficientBalance.value ||
    (isConnected.value && !amount.value)
);

const buttonTitle = computed(() => {
  if (!isConnected.value) return "Connect Wallet";
  else if (insufficientBalance.value) return "Insufficient balance";
  else if (action.value === "stake") return "Stake";
  else return "Withdraw";
});

const setBalance = (percent: any) => {
  if (action.value === "stake")
    amount.value = pool.value?.lpToken.balance
      ? (percent / 100) * pool.value?.lpToken.balance
      : 0;
  else
    amount.value = pool.value?.deposit
      ? (percent / 100) * pool.value?.deposit
      : 0;
};
const submit = async () => {
  if (!pool.value) return;
  if (!isConnected.value) return await store.connectWallet();
  else if (insufficientBalance.value) return;
  else if (action.value === "stake")
    await store.deposit(pool.value, amount.value);
  else await store.withdraw(pool.value, amount.value);
  amount.value = "";
  close();
};
</script>

<template>
  <div
    class="fixed inset-0 flex items-center justify-center backdrop-blur-sm bg-black/60 z-50 w-full p-4 overflow-x-hidden overflow-y-auto"
    @click="clickOutside"
  >
    <div ref="modal" class="relative w-full max-w-lg md:h-auto">
      <!-- Modal content -->
      <div class="relative bg-gradient rounded-xl overflow-hidden shadow-lg">
        <!-- Modal header -->
        <div
          class="bg-[#1E1D20] flex items-start justify-between py-4 px-6 border-b border-[#524b63] rounded-t-xl"
        >
          <h3 class="text-xl font-semibold text-white capitalize">
            {{ action }} LP Tokens
          </h3>
          <button
            type="button"
            class="text-white bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center"
            @click="close"
          >
            <svg
              aria-hidden="true"
              class="w-5 h-5"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill-rule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clip-rule="evenodd"
              ></path>
            </svg>
            <span class="sr-only">Close modal</span>
          </button>
        </div>
        <div class="flex flex-col gap-3 p-6 bg-[#1E1D20]">
          <div class="relative w-full flex items-center justify-center">
            <div
              class="text-sm p-1 gap-1 font-medium text-center bg-[#27262C] rounded-xl shadow-lg flex mb-4"
            >
              <div v-for="item in actions" :key="item" class="w-full">
                <button
                  :class="[
                    'inline-block px-6 py-2 w-full text-white uppercase rounded-xl',
                    { '!bg-purple-500 !text-black': item === action },
                  ]"
                  type="button"
                  @click="action = item"
                >
                  {{ item }}
                </button>
              </div>
            </div>
          </div>
          <form @submit.prevent="submit">
            <div class="flex flex-col mb-8">
              <div class="flex justify-between items-end">
                <div class="flex flex-wrap items-center gap-2">
                  <img
                    :src="`/images/tokens/bnb.png`"
                    :alt="`${pool?.lpToken.symbol} Token logo`"
                    width="32"
                    class="w-8 h-8 object-cover"
                    loading="lazy"
                  />
                  <div class="flex flex-col text-left text-lg">
                    <span class="font-semibold leading-5">LIQ-BNB LP</span>
                  </div>
                </div>
                <span
                  v-if="action === 'stake'"
                  class="text-gray-300 text-sm"
                  :title="`${pool?.lpToken.balance} ${pool?.lpToken.symbol}`"
                >
                  Balance: {{ store.fixedNumber(pool?.lpToken.balance) || 0 }}
                  {{ pool?.lpToken.symbol }}
                </span>
                <span
                  v-else
                  class="text-gray-300 text-sm"
                  :title="`${pool?.deposit} ${pool?.rewardToken.symbol}`"
                >
                  Deposit: {{ store.fixedNumber(pool?.deposit) || 0 }}
                  {{ pool?.rewardToken.symbol }}
                </span>
              </div>
              <input
                v-model="amount"
                type="number"
                placeholder="0.0"
                step="0.000000000000000001"
                required
                class="font-mono bg-transparent border-2 focus-within:border-purple-600 outline-none rounded-2xl my-3 px-5 py-4 font-medium text-xl w-full placeholder:text-slate-200"
              />
              <div class="justify-end items-end w-full flex gap-1 mb-2">
                <button
                  class="border-2 text-sm border-purple-500 hover:bg-purple-500 hover:text-black duration-300 transition-all px-2 font-bold rounded-2xl"
                  type="button"
                  v-for="(item, key) in percentages"
                  :key="key"
                  @click="setBalance(item)"
                >
                  {{ item }}%
                </button>
              </div>
            </div>
            <button
              class="flex gap-2 items-center justify-center button-submit text-black bg-purple-500 hover:opacity-90 active:bg-purple-700 w-full p-4 font-bold rounded-2xl disabled:bg-gray-500 disabled:text-white disabled:cursor-not-allowed"
              type="submit"
              :disabled="disableButton"
            >
              <svg
                v-if="loading"
                class="inline w-6 h-6 text-gray-200 animate-spin fill-gray-600"
                viewBox="0 0 100 101"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                  fill="currentColor"
                />
                <path
                  d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                  fill="currentFill"
                />
              </svg>
              {{ buttonTitle }}
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>
