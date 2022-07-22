<template>
  <aside>

  </aside>
</template>

<script setup lang="ts">
import menuService from "../../../hooks/menu";

const route = useRoute()
const activeIndex = ref<string>("");

watchEffect(() => {
  activeIndex.value = menuService.getCurrentMenu(route) as unknown as string;
})


</script>