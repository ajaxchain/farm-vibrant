<script lang="ts" setup>
import { storeToRefs } from "pinia";
import { useToast } from "vue-toastification";
import { useStore } from "../stores";
import { useClipboard } from "@vueuse/core";

const store = useStore();
const { isConnected, address } = storeToRefs(store);

const toast = useToast();

const copyAddress = () => {
  const { copy, copied } = useClipboard({ source: address });
  copy();
  if (copied) toast.success("Address copied!");
};
</script>

<template>
  <div class="font-luckiest-guy flex">
    <template v-if="!isConnected">
      <button
        class="inline-flex items-center gap-2 rounded-lg bg-sky-500 px-2 py-2 font-semibold transition duration-150 ease-in-out hover:opacity-90 active:bg-sky-700"
        type="button"
        @click="store.connectWallet()"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="h-6 w-6"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M21 12a2.25 2.25 0 00-2.25-2.25H15a3 3 0 11-6 0H5.25A2.25 2.25 0 003 12m18 0v6a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 18v-6m18 0V9M3 12V9m18 0a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 9m18 0V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v3"
          />
        </svg>

        <span class="hidden lg:inline">Connect Wallet</span>
      </button>
    </template>
    <template v-else>
      <div
        class="inline-flex items-center gap-2 rounded-lg bg-sky-500 px-2 py-2 text-white"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="h-6 w-6"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M21 12a2.25 2.25 0 00-2.25-2.25H15a3 3 0 11-6 0H5.25A2.25 2.25 0 003 12m18 0v6a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 18v-6m18 0V9M3 12V9m18 0a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 9m18 0V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v3"
          />
        </svg>
        <span
          class="hidden cursor-pointer font-semibold hover:opacity-90 lg:inline"
          @click="copyAddress"
        >
          {{ address.slice(0, 6) }}...{{ address.slice(-4) }}
        </span>
        <button
          class="inline-flex items-center rounded-lg bg-red-100 px-2 py-1 text-xs text-red-500 transition duration-150 ease-in-out hover:border-red-200 hover:bg-red-200 active:bg-red-300"
          type="button"
          @click="store.disconnectWallet()"
        >
          disconnect
        </button>
      </div>
    </template>
  </div>
</template>
