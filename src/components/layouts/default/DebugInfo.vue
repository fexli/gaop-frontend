<script setup lang="ts">
import {globWidth, globHeight, getBreakPoint} from "../../../plugins/common";

const route = useRoute()
const display = ref(true);
</script>
<template>
  <div
      v-if="display"
      class="z-50 fixed left-0 top-0 bg-base-200 bg-opacity-40 px-2 py-1 text-xs flex flex-col select-none pointer-events-none"
  >
    <a class="flex">
      <a>DEBUG INFO</a>
      <a class="spacer"></a>
      <a class="cursor-pointer pointer-events-auto" @click="display = false">[HIDE]</a>
    </a>
    <a>SCR {{ globWidth }}*{{ globHeight }} @{{ getBreakPoint() }}</a>
    <a>ROU {{ $route.path }}</a>
    <a>PRM {{ route.params }}</a>
  </div>
</template>

