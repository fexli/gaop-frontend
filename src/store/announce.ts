import {defineStore} from "pinia";

export const announceStore = defineStore("announce", {
    state: () => ({
        version: 0,
    }),
    getters: {
        getAnnounceVersion: (state) => {
            return state.version
        }
    },
    actions: {
        setAnnounceVersion(data: any) {
            this.version = data
        }
    },
    persist: {
        enabled: true,
        strategies: [
            {
                key: 'announce',
                storage: localStorage,
            },
        ],
    }
});
