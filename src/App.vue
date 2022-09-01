<template>
  <router-view v-slot="{ Component }">
    <keep-alive>
      <component :is="Component"/>
    </keep-alive>
  </router-view>
  <SystemBar/>
  <div class="overlay bg-base-200 bg-opacity-50" v-show="geetest.captchaOverlay.value">
    <div class="card max-w-sm shadow-lg rounded-xl"
         :style="`background-image: url('static/im/captcha.jpg');background-repeat: no-repeat;background-size: cover;background-position: center`">
      <div class="bg-white bg-opacity-40 p-8">
        <h2 class="text-xl text-neutral font-bold">{{ translate('captcha.title') }}</h2>
        <p class="text-neutral pt-4 pb-1">{{ translate('captcha.desc') }}</p>
        <div id="geetest" style="height: 45px"></div>
        <p class="text-neutral pt-1">{{ translate('captcha.status', geetest.captchaType.value) }}</p>
      </div>
    </div>
  </div>
  <DebugInfo/>
</template>
<script setup>
import {loadTheme} from "./plugins/theme";
import {calcWidth} from "./plugins/common";
import {getCurrentInstance, onMounted} from "vue";
import {storeToRefs} from "pinia/dist/pinia";
import {authStore} from "./store/auth";
import {serverStore} from "./store/server";
import websock from "./hooks/websock";
import {loadLanguage} from "./plugins/language";
import global_const from "./utils/global_const";
import {useToast} from "./hooks/toast";
import {accountStore} from "./store/account";
import SystemBar from "./components/layouts/default/SystemBar.vue";
import DebugInfo from "./components/layouts/default/DebugInfo.vue";
import geetest from "./plugins/geetest";
import {useTranslate} from "./hooks/translate";

loadTheme(); // LOAD THEME
loadLanguage(); // LOAD LANGUAGE
const _auth = authStore();
const {access_token} = storeToRefs(_auth);
const {translate} = useTranslate();
const $axios =
    getCurrentInstance().appContext.config.globalProperties.$axios.defaults;

if (access_token.value !== '') {
  $axios.headers["Authorization"] = access_token.value;
}

const {showMessage} = useToast()

// 服务器数据检查
const _server = serverStore();
if (_server.getServerName !== "自定义") {
  console.log("Check server name: " + _server.getServerName);
  for (let i of global_const.servers) {
    if (i.name === _server.getServerName) {
      if (_server.getServer !== i.server || _server.getSecure !== i.secure) {
        console.log("serv missmatch", i);
        _server.setServer(i);
        showMessage("server.force_switch", 5000, "info", i.name, i.secure ? "https" : "http", i.server);
      }
    }
  }
}
$axios.baseURL = `http${_server.getSecure ? 's' : ''}://${_server.getServer}/`

// captcha
// geetest.setup();


// 初始化 websocket
websock.setup();


// 如果没有登录，停止后续初始化操作
if (access_token.value !== '') {
  websock.initWebSocket()
  const account = accountStore()
  account.getSyncUserData()
  account.getHistoryLog()
}


onMounted(() => {
  calcWidth();
  window.onresize = () => {
    calcWidth();
  };
});
</script>
