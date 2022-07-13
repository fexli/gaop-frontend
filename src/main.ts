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
import {i18n} from "./local";

const app = createApp(App);

const pinia = createPinia();
pinia.use(piniaPluginPersist)

app.use(i18n);

app.use(VueClickAway);
app.config.globalProperties.$axios = service;
app.use(router).use(pinia).mount("#app");
