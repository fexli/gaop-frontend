import {defineStore} from "pinia";
import {post, get} from "../plugins/axios";

export const authStore = defineStore("auth", {
    state: () => ({
        access_token: "" as string | null,
        accept_analytic: false,
        accept_battle: false,
        expires_in: -1,
        username: "" as string | null,
    }),
    getters: {
        getAccessToken: (state) => {
            return state.access_token
        },
        getUsername: (state) => state.username,
    },
    actions: {
        async login(username: string, password: string) {
            return await post(
                '/auth/login',
                {
                    username,
                    password
                }).then((resp: any) => {
                this.access_token = resp.access_token;
                this.expires_in = resp.expires_in;
                this.username = username;
            })
        },
        logout() {
            this.$reset()
        },
        fetchProfile() {
            return get("/account/me")
        }
    },
    persist: {
        enabled: true,
        strategies: [
            {
                key: 'auth',
                storage: localStorage,
            },
        ],
    }
});
