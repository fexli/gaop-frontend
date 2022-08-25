<script setup lang="ts">
import Drawer from "./nav/Drawer.vue";
import DarkMode from "./nav/DarkMode.vue";
import FullScreen from "./nav/FullScreen.vue";
import Translate from "./nav/Translate.vue";
import WebSocket from "./nav/WebSocket.vue";
import BreadCrumb from "./nav/BreadCrumb.vue";
import Avatar from "./nav/Avatar.vue";

</script>

<template>
  <div class="z-40 nav-h-lim h-12 lg:m-4 lg:rounded-xl bg-base-200 bg-opacity-80 backdrop-blur shadow-lg fixed navbar top-0 inset-x-0
      w-full fixed transition-all lg:w-auto">
    <div class="nav-flex-cc">
      <Drawer/>
      <BreadCrumb/>
    </div>
    <div class="spacer"/>
    <div class="nav-flex-cc text-right">
      <WebSocket/>
      <Translate/>
      <FullScreen/>
      <DarkMode/>
      <Avatar/>
    </div>
  </div>
</template>
