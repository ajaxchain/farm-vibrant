<script setup lang="ts">
import { onMounted } from "vue";
import AppNavbar from "./components/AppNavbar.vue";
import PoolItem from "./components/PoolItem.vue";
import { useStakingStore } from "./stores/staking";
import { storeToRefs } from "pinia";
import StakingModal from "./components/StakingModal.vue";
import { useStore } from "./stores";

const store = useStore();
const stakingStore = useStakingStore();
const { selectedPool } = storeToRefs(stakingStore);
const { pools } = storeToRefs(store);

onMounted(() => {
  store.init();
});
</script>

<template>
  <main class="flex min-h-screen flex-col">
    <AppNavbar />
    <div
      class="container mx-auto lg:my-24 my-12 w-full lg:rounded-lg bg-[#1E1D20] lg:px-16 px-2 py-12 shadow-lg"
     style="border: 2px solid transparent;
background-image: linear-gradient(157deg,rgb(0, 70, 52) 0%,rgb(59 195 243) 33%,rgb(217 51 137) 89%,rgb(117, 0, 61) 100%);
background-origin: border-box;
box-shadow: inset 0 660px 0 black;
transition: all 0.15s ease-in-out;
border-radius: 7px;">
      <StakingModal v-if="selectedPool" />
      <div>
        <div class="mb-6 flex items-center px-2">
          <div class="h-0.5 w-6 flex-none bg-[#524b63]" />
          <div
            class="w-36 flex-none text-center font-bold uppercase lg:w-44 lg:text-lg"
          >
            Staking Pools
          </div>
          <div class="h-0.5 w-full bg-[#524b63]" />
        </div>

        <div class="flex flex-col gap-2 px-2 text-white lg:gap-4 lg:px-0">
          <div v-for="(item, key) in pools" :key="key">
            <PoolItem :pool="item" />
          </div>
        </div>
      </div>
    </div>
  </main>
</template>
