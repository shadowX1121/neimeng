import { ref } from "vue";
import { defineStore } from "pinia";
export const useOrgDetailStore = defineStore(
    "orgDetail",
    () => {
        const id = ref("");
        const name = ref("");
        return { id, name };
    },
    {
        persist: true,
    }
);
