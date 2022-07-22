import {defineStore} from "pinia";
import {post, get, setAccessToken, apiAuthRegister, apiAuthLogin, apiGetMe} from "../plugins/axios";

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
        async register(username: string, password: string, invitecode: string) {
            return await apiAuthRegister(username, password, invitecode)
        },
        async login(username: string, password: string) {
            return await apiAuthLogin(username, password).then((resp: any) => {
                this.access_token = resp.access_token;
                this.expires_in = resp.expires_in;
                this.username = username;
                setAccessToken(resp.access_token);
                return resp;
            })
        },
        logout() {
            this.$reset()
        },
        fetchProfile() {
            return apiGetMe()
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
