<template>
  <div class="h-full w-full">
    <div
        class="h-full w-full top-0 left-0 -z-50 font-sans"
        :style="`background: url('../${background}');background-size: cover;background-position: center;`"
    >
      <div class="w-full p-2 z-30">
        <router-view :key="$route.path"></router-view>
      </div>
    </div>
    <AssetLoading/>
  </div>
</template>

<script setup lang="ts">
import {appStore} from "../../store/app";
import {storeToRefs} from "pinia/dist/pinia";
import {getCurrentInstance} from "vue";
import AssetLoading from "../parts/global/AssetLoading.vue";

const apps = appStore();
const {background} = storeToRefs(apps);

onMounted(() => {
  console.log(background.value);
  if (background.value == '') {
    apps.setBackground(getCurrentInstance()?.appContext?.config?.globalProperties?.get_rand_bg());
  }
});

</script>

