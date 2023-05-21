<script setup lang="ts">
import WalletConnectButton from "./WalletConnectButton.vue";
</script>

<template>
  <header class="container py-4 lg:px-0 px-4">
    <div class="flex items-center justify-between">
      <a href="/">
        <h2 style="font-size: 2rem;font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;font-weight: 600;background: linear-gradient(157deg, rgb(0, 70, 52) 0%, rgb(59, 195, 243) 33%, rgb(217, 51, 137) 89%, rgb(117, 0, 61) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;">VIBRANT BLOCK</h2>
      </a>

      <div class="flex gap-4 items-center">
        <WalletConnectButton />
      </div>
    </div>
  </header>
</template>
