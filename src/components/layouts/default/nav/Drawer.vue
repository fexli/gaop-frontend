<script setup lang="ts">
import menuService from "../../../../hooks/menu"
</script>

<template>
  <div class="cursor-pointer" @click="menuService.toggleState">
    <div
        class="duration-300 mx-2 w-6 h-6"
        style="font-size: 1.5em"
        :class="{ 'rotate-90': menuService.close.value }"
    >
      <svg class="w-6 h-6 absolute transition-opacity" :style="`opacity:${menuService.close.value ? '1':'0'}`" fill="none" stroke="currentColor"
           viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
      </svg>
      <svg class="w-6 h-6 absolute transition-opacity" :style="`opacity:${menuService.close.value ? '0':'1'}`" fill="none" stroke="currentColor"
           viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 10h16M4 14h16M4 18h16"
        />
      </svg>
    </div>
  </div>
</template>

<style scoped></style>
