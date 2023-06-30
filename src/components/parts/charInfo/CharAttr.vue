<script setup lang="ts">
const props = defineProps({
  icon: {
    type: String,
    default: ""
  },
  value: {
    type: Number,
    default: 100
  },
  max: {
    type: Number,
    default: 100
  },
  text: {
    type: [String, Number],
    default: ""
  },
})
</script>
<template>
  <div class="opacity-80 bg-gray-100 flex flex-row">
    <div
        class="h-6 w-6 bg-black"
        :style="`background-image: url('/static/charframe/char-sort/${icon}.png');
              background-position: center;background-repeat: no-repeat;background-size: contain`"/>
    <div class="w-32 -mb-2 relative">
      <progress
          style="--rounded-box: 0"
          :value="value" :max="max"
          class="progress bg-gray-100 opacity-70 h-6"
      />
      <div class="absolute left-1 top-0 -mt-[0.25rem] text-lg font-aewide text-shadow text-content">
        {{ text }}
      </div>
    </div>
  </div>
</template>

