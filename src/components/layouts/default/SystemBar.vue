<script setup>
import globals from "../../../utils/global_const";

import {serverStore} from "../../../store/server";
import {storeToRefs} from "pinia";
import {formatDate} from "../../../plugins/function";

const _server = serverStore();
const {serverName} = storeToRefs(_server);

// 初始化 右下角时间
const curTime = ref('---------- --:--');
const curTimeSimp = ref('----------');
const updateTime = () => {
  curTime.value = formatDate((new Date()).getTime() / 1000, true);
  curTimeSimp.value = formatDate((new Date()).getTime() / 1000, false);
  setTimeout(updateTime, 2000);
};
setTimeout(updateTime, 2000);
</script>
<template>
  <div class="w-full fixed bottom-0 left-0 system-bar-under bg-base-100 flex px-1">
    <span>{{ serverName }}</span>
    <!--      <v-spacer/>-->
    <div class="flex-grow"></div>
    <span class="text-right sm:hidden">AOP Project</span>
    <span class="text-right hidden sm:flex">AOP Project v{{ globals.aopVersion }}</span>
    <div class="divider divider-horizontal m-0"></div>
    <span class="text-right hidden sm:flex flex items-center">{{ curTime }}</span>
    <span class="text-right sm:hidden flex items-center">{{ curTimeSimp }}</span>
  </div>
</template>

