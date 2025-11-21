import { defineStore } from "pinia";

interface State {
    count: number;
    message: string;
}

export const useMainStore = defineStore("main", {
    state: (): State => ({
        count: 0,
        message: "Hello Pinia",
    }),
    actions: {
        increment() {
            this.count++;
        },
    },
});
