<script setup lang="ts">
import global_const from "../../utils/global_const";

defineProps({
  onTop: {
    type: Boolean,
    default: false
  }
})
</script>
<template>
  <div class="dropdown dropdown-right dropdown-hover pr-2" :class="onTop ? 'dropdown-top' : ''">
    <label tabindex="0" class="cursor-pointer">
      <svg class="w-6 h-6" viewBox="0 0 24 24">
        <path fill="currentColor" :d="global_const.mdiPath['help-circle-outline']"/>
      </svg>
    </label>
    <div style="width: 400px" :style="onTop ? 'bottom:0;':''"
         class="delay-200 transition-all card bg-base-100 p-1 px-2 rounded-xl border-primary border dropdown-content">
      <slot name="explain"/>
    </div>
  </div>
</template>

