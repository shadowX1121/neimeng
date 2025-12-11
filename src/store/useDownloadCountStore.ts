import { ref } from "vue";
import { defineStore } from "pinia";
export const useDownloadCountStore = defineStore(
    "downloadCountStore",
    () => {
        // State
        const count = ref<number>(0);

        return {
            // State
            count,
            // Getters
            // Actions
        };
    },
    {
        persist: {
            storage: sessionStorage,
            key: "download-count-store",
            // 其他配置...
        },
    }
);
