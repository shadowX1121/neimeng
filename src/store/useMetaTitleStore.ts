import { ref } from "vue";
import { defineStore } from "pinia";
export const useMetaTitleStore = defineStore(
    "metaTitle",
    () => {
        const urlMapTitle = ref<{ [key: string]: string }>({});
        return { urlMapTitle };
    },
    {
        persist: true,
    }
);
