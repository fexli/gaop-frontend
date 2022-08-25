<script setup lang="ts">
import menu from "../../../../hooks/menu";

import {useI18n} from "vue-next-i18n";
import Logo from "./Logo.vue";

const route = useRoute();
const {t} = useI18n();
const currentBread = ref<string>("");
const breadArr = ref<string[]>([]);

watchEffect(() => {
  currentBread.value = menu.getCurrentMenu(route) as unknown as string;
  breadArr.value = currentBread.value?.split("-");
});
</script>

<template>
  <div class="breadcrumbs hidden sm:flex ml-2">
    <ul>
      <li class="text-primary text-lg" v-for="(bread, index) in breadArr" :key="index">
        {{
          t("menu." + bread)
        }}
      </li>
    </ul>
  </div>
  <div class="hidden sm:hidden xs:flex text-primary text-lg ml-2">
    {{ breadArr.length ? t('menu.' + breadArr[breadArr.length - 1]) : "" }}
  </div>
</template>

<style lang="scss" scoped>
@media screen and(max-width: 768px) {
  .breadcrumb {
    display: none;
  }
}
</style>
