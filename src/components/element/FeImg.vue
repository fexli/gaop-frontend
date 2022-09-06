<script setup lang="ts">
defineProps({
  src: {
    type: String,
    required: true
  },
})
</script>
<template>
  <div
      :style="`background-image: url('${src}');background-size: contain;background-repeat: no-repeat;background-position: center`"
  />
</template>

