import {createApp} from "vue";
import {createPinia} from "pinia";
import piniaPluginPersist from "pinia-plugin-persist";
import {router} from "./router/router";
import VueClickAway from "vue3-click-away";
import service from "./plugins/axios";
import App from "./App.vue";
import "mosha-vue-toastify/dist/style.css";
import "./assets/index.css";
import "./assets/style.css";
import "./assets/global.sass";
import "./assets/animate.css";
import "./assets/aside.css";
import {i18n} from "./local";
import global_const from "./utils/global_const";

const app = createApp(App);

const pinia = createPinia();
pinia.use(piniaPluginPersist)
app.use(pinia);

app.use(i18n);

app.use(VueClickAway);
app.config.globalProperties.$axios = service;
app.config.globalProperties.GLOBAL = global_const;
app.config.globalProperties.get_rand_bg = function () {
    let total = global_const.loginBG.bg.length + global_const.loginBG.avgs.length
    let select = Math.round(Math.random() * (total - 1))
    return `${select < global_const.loginBG.bg.length ? 'static/bg' : 'http://mc.mesord.com:8999/avgs'}/${select < global_const.loginBG.bg.length ? global_const.loginBG.bg[select] : global_const.loginBG.avgs[select - global_const.loginBG.bg.length]}`
}
app.use(router).mount("#app");
