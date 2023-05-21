import { acceptHMRUpdate, defineStore } from "pinia";
import { ref } from "vue";
import config from "../config";

type Pool = (typeof config.pools)[0];
export const useStakingStore = defineStore("staking", () => {
  const selectedPool = ref<Pool | undefined>(undefined);
  const action = ref<string>("stake");
  return {
    selectedPool,
    action,
  } as const;
});

if (import.meta.hot) {
  import.meta.hot.accept(
    acceptHMRUpdate(useStakingStore as any, import.meta.hot)
  );
}
