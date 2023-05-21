<script setup lang="ts">
import { computed, ref } from "vue";
import { useStakingStore } from "../stores/staking";
import { storeToRefs } from "pinia";
import config from "../config";
import { useStore } from "../stores";
type Pool = (typeof config.pools)[0];

const props = defineProps<{ pool: Pool }>();

const fixedNumber = (num: number, decimals = 4) =>
  num ? +parseFloat((+num).toFixed(decimals)) : "0.000";

const store = useStore();
const { isConnected, loading } = storeToRefs(store);
const stakingStore = useStakingStore();
const { selectedPool, action } = storeToRefs(stakingStore);
const isActive = ref(false);
const vestingInDays = computed(() => {
  return props.pool?.vesting
    ? Math.floor(props.pool.vesting / (60 * 60 * 24))
    : 0;
});
const toggle = () => (isActive.value = !isActive.value);

const openModal = (_pool: Pool, _action: string) => {
  selectedPool.value = { ..._pool };
  action.value = _action;
};
</script>

<template>
  <div class="relative rounded-lg bg-[#27262C] p-0.5 shadow-lg" style="border: 2px solid transparent;
background-image: linear-gradient(157deg,rgb(0, 70, 52) 0%,rgb(59 195 243) 33%,rgb(217 51 137) 89%,rgb(117, 0, 61) 100%);
background-origin: border-box;
box-shadow: inset 0 1px 0 black;
transition: all 0.15s ease-in-out;
border-radius: 7px;">
    <div
      class="relative flex cursor-pointer gap-4 rounded-xl rounded-t-xl py-3.5 px-4 lg:py-5 lg:px-10"
      @click="toggle"
    >
      <div class="flex-1">
        <div class="flex lg:flex-row flex-col gap-6">
          <div class="flex w-full gap-4 lg:w-1/2">
            <div class="relative flex">
              <img
                src="/images/tokens/LOGO.png"
                alt="bnb"
                class="z-10 h-14"
              />
              <img src="/images/tokens/bnb.png" alt="bnb" class="-ml-5 h-14" />
            </div>
            <div class="flex flex-col font-bold">
              <h5 class="text-xl">
                {{ pool.pair[0].symbol }} - {{ pool.pair[1].symbol }}
              </h5>
              <span class="text-sm text-white-400">{{ pool.platform }}</span>
            </div>
          </div>
          <div class="flex w-full justify-around gap-4 lg:w-1/2">
            <div class="flex flex-col font-bold">
              <span class="text-sm text-white-400">EARNED</span>
              <span class="text-lg"
                >{{ fixedNumber(pool.reward) }}
                {{ pool.rewardToken.symbol }}</span
              >
            </div>
            <!-- <div class="flex flex-col font-bold">
              <span class="text-sm text-white-400">APY</span>
              <span class="text-lg">22 %</span>
            </div> -->
            <div class="flex flex-col font-bold">
              <span class="text-sm text-white-400">Vesting</span>
              <span class="text-lg">
                {{ vestingInDays ? `${vestingInDays} Days` : "None" }}
              </span>
            </div>
          </div>
        </div>
      </div>
      <div :class="['m-auto transition-transform', { 'rotate-180': isActive }]">
        <svg
          class="h-6 w-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M19 9l-7 7-7-7"
          ></path>
        </svg>
      </div>
    </div>
    <div
      :class="`overflow-hidden transition-all duration-300 ${
        isActive ? 'max-h-screen' : 'max-h-0'
      }`"
    >
      <div class="h-0.5 w-full bg-[#524b63]" />
      <div class="flex lg:flex-row flex-col gap-6 py-6">
        <div class="w-full px-4 lg:w-1/3">
          <div class="rounded-xl border border-[#524b63] p-4">
            <div class="flex items-center justify-between gap-2 mb-4">
              <div class="flex flex-col">
                <span class="font-bold text-white-400"
                  >{{ pool.lpToken.symbol }} STAKED</span
                >
                <span class="font-bold text-lg">{{
                  fixedNumber(pool.deposit)
                }}</span>
              </div>
              <div class="flex gap-2">
                <button
                  class="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500 font-bold uppercase transition duration-150 ease-in-out hover:opacity-90 active:bg-cyan-700"
                  @click="openModal(pool, 'withdraw')"
                >
                  -
                </button>

                <button
                  class="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500 font-bold uppercase transition duration-150 ease-in-out hover:opacity-90 active:bg-cyan-700"
                  @click="openModal(pool, 'stake')"
                >
                  +
                </button>
              </div>
            </div>
            <p v-if="pool.vesting" class="text-sm text-white-400">
              After you deposit, you can't withdraw for
              {{ pool.vesting }} days!
            </p>
          </div>
        </div>
        <div class="w-full px-4 lg:w-1/3">
          <div
            class="flex items-center justify-between gap-2 rounded-xl border border-[#524b63] p-4"
          >
            <div class="flex flex-col">
              <span class="font-bold text-white-400"
                >{{ pool.rewardToken.symbol }} EARNED</span
              >
              <span class="font-bold text-lg">
                {{ fixedNumber(pool.pendingReward) }}
              </span>
            </div>
            <div class="flex flex-col justify-around gap-2">
              <button
                class="flex items-center justify-center rounded-xl bg-cyan-500 px-6 py-2 font-bold uppercase transition duration-150 ease-in-out hover:opacity-90 active:bg-cyan-700 disabled:bg-white-500"
                :disabled="!isConnected || loading || !+pool.pendingReward"
                @click="store.harvest(pool)"
              >
                Harvest
              </button>
            </div>
          </div>
        </div>
        <div class="w-full px-4 lg:w-1/3">
          <div
            class="flex flex-col gap-2 rounded-xl border border-[#524b63] p-4"
          >
            <!-- <div class="flex w-full justify-between font-bold">
              <span>Liquidity</span>
              <span>$18736.42</span>
            </div> -->
            <div class="flex w-full justify-between font-bold">
              <span>{{ pool.pair[0].symbol }} Staked</span>
              <span class="text-right">
                {{ fixedNumber(pool.pair[0].stacked) }}
                {{ pool.pair[0].symbol }}
              </span>
            </div>
            <div class="flex w-full justify-between font-bold">
              <span>{{ pool.pair[1].symbol }} Staked</span>
              <span class="text-right">
                {{ fixedNumber(pool.pair[1].stacked) }}
                {{ pool.pair[1].symbol }}
              </span>
            </div>
            <!-- <div class="flex w-full justify-between font-bold">
              <span>APR</span>
              <span>20.42%</span>
            </div> -->
            <a
              class="flex items-center gap-2 font-bold text-cyan-500 transition-all duration-300 hover:opacity-75"
              :href="pool.lpToken.buyUrl"
              target="_blank"
              rel="noopener noreferrer"
            >
              <span>Get {{ pool.lpToken.symbol }}</span>
              <svg
                fill="currentColor"
                class="h-3 w-3"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 512 512"
              >
                <path
                  d="M320 0c-17.7 0-32 14.3-32 32s14.3 32 32 32h82.7L201.4 265.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L448 109.3V192c0 17.7 14.3 32 32 32s32-14.3 32-32V32c0-17.7-14.3-32-32-32H320zM80 32C35.8 32 0 67.8 0 112V432c0 44.2 35.8 80 80 80H400c44.2 0 80-35.8 80-80V320c0-17.7-14.3-32-32-32s-32 14.3-32 32V432c0 8.8-7.2 16-16 16H80c-8.8 0-16-7.2-16-16V112c0-8.8 7.2-16 16-16H192c17.7 0 32-14.3 32-32s-14.3-32-32-32H80z"
                />
              </svg>
            </a>
            <a
              class="flex items-center gap-2 font-bold text-cyan-500 transition-all duration-300 hover:opacity-75"
              :href="`${config.explorerUrl}/address/${pool.address}`"
              target="_blank"
              rel="noopener noreferrer"
            >
              <span>View Contract</span>
              <svg
                fill="currentColor"
                class="h-3 w-3"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 512 512"
              >
                <path
                  d="M320 0c-17.7 0-32 14.3-32 32s14.3 32 32 32h82.7L201.4 265.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L448 109.3V192c0 17.7 14.3 32 32 32s32-14.3 32-32V32c0-17.7-14.3-32-32-32H320zM80 32C35.8 32 0 67.8 0 112V432c0 44.2 35.8 80 80 80H400c44.2 0 80-35.8 80-80V320c0-17.7-14.3-32-32-32s-32 14.3-32 32V432c0 8.8-7.2 16-16 16H80c-8.8 0-16-7.2-16-16V112c0-8.8 7.2-16 16-16H192c17.7 0 32-14.3 32-32s-14.3-32-32-32H80z"
                />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
