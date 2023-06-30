<script setup lang="ts">
defineProps({
  src: {
    type: String,
    required: true
  },
  backgroundPosition: {
    type: String,
    default: 'center'
  },
  backgroundSize: {
    type: String,
    default: 'contain'
  }
})
</script>
<template>
  <div
      :style="`background-image: url('${src}');background-size: ${backgroundSize};background-repeat: no-repeat;background-position: ${backgroundPosition}`"
  />
</template>

