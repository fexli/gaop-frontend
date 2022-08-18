import {defineStore} from "pinia";
import {setByDarkMode} from "../plugins/theme";

export const appStore = defineStore("app", {
    state: () => ({
        darkMode: true,
        background: 'static/bg/janus.jpg',
        themeColor: '#3f51b5',
        theme: 'indigo',
        language: 'zh_cn',
        opacity: 0.95,
        use_bg: true,
    }),
    getters: {
        getBackground: (state) => {
            return state.background
        },
        getTheme: (state) => {
            return state.theme
        },
        getOpacity: (state) => {
            return state.opacity
        },
        getUseBG: (state) => {
            return state.use_bg
        },
        getThemeColor: (state) => {
            return state.themeColor
        },
        getThemeMode: (state) => {
            return state.darkMode
        },
        getLanguage: (state) => {
            return state.language
        }
    },
    actions: {
        setThemeColor(data: any) {
            this.themeColor = data
        },
        setTheme(data: any) {
            this.theme = data
            // window.document.documentElement.setAttribute("theme",data: any)
        },
        setThemeMode(data: any) {
            this.darkMode = data
            setByDarkMode(data)
        },
        toggleThemeMode() {
            this.darkMode = !this.darkMode
            setByDarkMode(this.darkMode)
        },
        setLanguage(data: any) {
            this.language = data
        },
        setOpacity(data: any) {
            this.opacity = data
        },
        setUseBG(data: any) {
            this.use_bg = data
        },
        setBackground(data: any) {
            this.background = data
        },
    },
    persist: {
        enabled: true,
        strategies: [
            {
                key: 'app',
                storage: localStorage,
            },
        ],
    }
});
