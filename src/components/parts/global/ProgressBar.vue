<script setup lang="ts">
defineProps({
  width: {
    type: String,
    default: "18rem"
  },
  loading: {
    type: Boolean,
    default: false
  },
  value: {
    type: Number,
    default: 0
  },
  bufValue: {
    type: Number,
    default: 0
  },
  max: {
    type: Number,
    default: 100
  },
})
</script>
<template>
  <div
      class="h-4 flex justify-center"
      :style="`width: ${width}`"
  >
    <progress
        class="progress bg-base-300 progress-info absolute"
        :style="`width: ${width}`"
        :value="loading? 0 : bufValue"
        :max="max"
    />
    <progress
        class="progress progress-primary absolute"
        :style="`width: ${width}`"
        :value="loading? undefined : value"
        :max="max"
    />
  </div>
</template>

