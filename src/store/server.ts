import {defineStore} from "pinia";
import {post, get} from "../plugins/axios";

export const serverStore = defineStore("server", {
    state: () => ({
        secure: false,
        server: "mc.mesord.com:8082",
        serverName: "稳定服",
    }),
    getters: {
        getServer: (state) => {
            return state.server
        },
        getSecure: (state) => {
            return state.secure
        },
        getServerName: (state) => {
            return state.serverName
        },
    },
    actions: {
        setServer(data: any) {
            this.secure = data.secure
            this.server = data.server
            this.serverName = data.name
        }
    },
    persist: {
        enabled: true,
        strategies: [
            {
                key: 'server',
                storage: localStorage,
            },
        ],
    }
});
