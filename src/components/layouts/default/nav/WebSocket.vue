<script setup lang="ts">
import websock from "../../../../hooks/websock";
</script>
<template>
  <div
      class="nav-flex-cc px-2 py-0.5 rounded-2xl transition-colors select-none text-sm cursor-pointer"
      :class="websock.isActive.value ? 'btn-success':'btn-error'"
      @click="websock.tempT"
  >
    <div class="w-6 h-6">
      <svg stroke="currentColor" class="w-6 h-6 absolute transition-opacity"
           :class="{'opacity-0':websock.isActive.value}" viewBox="0 0 48 48" fill="none"
           xmlns="http://www.w3.org/2000/svg">
        <path d="M27 14H42C43.1046 14 44 14.8954 44 16V30C44 31.1046 43.1046 32 42 32H38" stroke-width="4"
              stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M11 14H6C4.89543 14 4 14.8954 4 16V30C4 31.1046 4.89543 32 6 32H21" stroke-width="4"
              stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M14 6L34 40" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M32 23H36" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M12 23H16" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
      <svg stroke="currentColor" class="w-6 h-6 absolute transition-opacity"
           :class="{'opacity-0':!websock.isActive.value}" viewBox="0 0 48 48" fill="none"
           xmlns="http://www.w3.org/2000/svg">
        <path d="M18 24H31" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
        <path
            d="M4 17C4 15.8954 4.89543 15 6 15H42C43.1046 15 44 15.8954 44 17V31C44 32.1046 43.1046 33 42 33H6C4.89543 33 4 32.1046 4 31V17Z"
            stroke-width="4"/>
      </svg>
    </div>
    <span class="pl-1 text-sm hidden sm:flex">WS已{{ websock.isActive.value ? '连接' : '断开' }}</span>
  </div>
</template>

