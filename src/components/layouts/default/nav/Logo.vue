<script setup lang="ts">
const router = useRouter();
</script>
<template>
  <div class="flex justify-center ml-[-0.1rem] select-none px-2" @click="router.push('/dashboard')">
    <div class="logo-text text-4xl text-primary">G</div>
    <div style="margin-left: -2px">
      <div class="logo-text text-sm text-secondary absolute" style="margin-top: 8px">A</div>
      <div class="logo-text text-sm text-success absolute" style="margin-top: 13px;margin-left: -5px">O</div>
      <div class="logo-text text-sm text-error absolute" style="margin-top: 18px;margin-left: -10px">P</div>
    </div>
  </div>
</template>

