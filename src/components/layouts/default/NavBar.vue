<script setup lang="ts">
import Drawer from "./nav/Drawer.vue";
import DarkMode from "./nav/DarkMode.vue";
import FullScreen from "./nav/FullScreen.vue";
import Translate from "./nav/Translate.vue";
</script>

<template>
  <div
      class="z-50 nav-h-lim h-12 lg:m-4 lg:rounded-xl bg-base-200 shadow-lg fixed navbar top-0 inset-x-0
      w-screen transition-all lg:transition-none lg:w-auto">
    <div class="nav-flex-cc">
      <Drawer/>
    </div>
    <div class="spacer"/>
    <div class="nav-flex-cc text-right">
      <Translate/>
      <FullScreen/>
      <DarkMode/>
    </div>
  </div>
</template>
