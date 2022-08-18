<script setup lang="ts">
import fullscreen from "../../../../hooks/fullscreen";

</script>

<template>
  <div @click="fullscreen.toggleFullScreen">
    <svg v-show="!fullscreen.isFullScreen.value" stroke="currentColor" class="full-screen boom-out w-6 h-6" viewBox="0 0 48 48"
         fill="none">
      <path d="M33 6H42V15" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M42 33V42H33" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M15 42H6V33" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M6 15V6H15" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
    <svg v-show="fullscreen.isFullScreen.value" stroke="currentColor" class="full-screen boom-in w-6 h-6" viewBox="0 0 48 48"
         fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M33 6V15H42" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M15 6V15H6" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M15 42V33H6" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M33 42V33H41.8995" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  </div>
</template>

