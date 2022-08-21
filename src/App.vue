<template>
  <div>
    <router-view v-slot="{ Component }">
      <keep-alive>
        <component :is="Component"/>
      </keep-alive>
    </router-view>
    <div class="w-full absolute bottom-0 left-0 system-bar-under bg-base-100 flex px-1">
      <span>{{ serverName }}</span>
      <!--      <v-spacer/>-->
      <div class="flex-grow"></div>
      <span class="text-right sm:hidden">AOP Project</span>
      <span class="text-right hidden sm:flex">AOP Project v{{ globals.aopVersion }}</span>
      <div class="divider divider-horizontal m-0"></div>
      <span class="text-right hidden sm:flex flex items-center">{{ curTime }}</span>
      <span class="text-right sm:hidden flex items-center">{{ curTimeSimp }}</span>
    </div>
  </div>
</template>
<script setup>
import {loadTheme} from "./plugins/theme";
import {calcWidth} from "./plugins/common";
import {getCurrentInstance, onMounted} from "vue";
import {storeToRefs} from "pinia/dist/pinia";
import {authStore} from "./store/auth";
import {serverStore} from "./store/server";
import globals from "./utils/global_const";
import {formatDate} from "./plugins/function";
import websock from "./hooks/websock";
import {loadLanguage} from "./plugins/language";
import global_const from "./utils/global_const";
import {useToast} from "./hooks/toast";
import {accountStore} from "./store/account";

loadTheme(); // LOAD THEME
loadLanguage(); // LOAD LANGUAGE
const _auth = authStore();
const {access_token} = storeToRefs(_auth);

const $axios =
    getCurrentInstance().appContext.config.globalProperties.$axios.defaults;

if (access_token.value !== '') {
  $axios.headers["Authorization"] = access_token.value;
}

const {showMessage} = useToast()

// 服务器数据检查
const _server = serverStore();
const {serverName} = storeToRefs(_server);
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

// 初始化 右下角时间
const curTime = ref('---------- --:--');
const curTimeSimp = ref('----------');
const updateTime = () => {
  curTime.value = formatDate((new Date()).getTime() / 1000, true);
  curTimeSimp.value = formatDate((new Date()).getTime() / 1000, false);
  setTimeout(updateTime, 2000);
};
setTimeout(updateTime, 2000);

// 初始化 websocket
websock.setup()

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
