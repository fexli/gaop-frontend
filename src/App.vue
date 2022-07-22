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
      <span class="text-right sm:text-base text-2xs flex items-center">{{ curTime }}</span>
    </div>
  </div>
</template>
<script setup>
import {load} from "./plugins/theme";
import {isLarge} from "./plugins/common";
import {getCurrentInstance, onMounted} from "vue";
import {storeToRefs} from "pinia/dist/pinia";
import {authStore} from "./store/auth";
import {serverStore} from "./store/server";
import globals from "./utils/global_const";
import {formatDate} from "./plugins/function";

load(); // LOAD THEME
const _auth = authStore();
const {access_token} = storeToRefs(_auth);

const _server = serverStore();
const {serverName, server} = storeToRefs(_server);

const curTime = ref('---------- --:--');
const updateTime = () => {
  curTime.value = formatDate((new Date()).getTime() / 1000, true);
  setTimeout(updateTime, 2000);
};
setTimeout(updateTime, 2000);
const $axios =
    getCurrentInstance().appContext.config.globalProperties.$axios.defaults;

if (access_token.value !== '') {
  $axios.headers["Authorization"] = access_token.value;
}

onMounted(() => {
  isLarge.value = document.documentElement.clientWidth >= 1024;
  window.onresize = () => {
    isLarge.value = document.documentElement.clientWidth >= 1024;
  };
});
</script>
