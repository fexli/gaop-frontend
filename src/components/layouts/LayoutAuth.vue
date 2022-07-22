<template>
  <div
      class="h-screen font-sans"
      :style="`background: url('../${background}');background-size: cover;background-position: center;`"
  >
    <router-view :key="$route.path"></router-view>
  </div>
</template>

<script setup lang="ts">
import {appStore} from "../../store/app";
import {storeToRefs} from "pinia/dist/pinia";
import {getCurrentInstance} from "vue";

const apps = appStore();
const {background} = storeToRefs(apps);

onMounted(() => {
  console.log(background.value);
  if (background.value == '') {
    apps.setBackground(getCurrentInstance()?.appContext?.config?.globalProperties?.get_rand_bg());
  }
});

</script>

<style lang="sass" scoped>
.layout-auth
  height: 100%
  width: 100%
  position: absolute
  top: 0
  left: 0
  content: ""
  z-index: 0
</style>
