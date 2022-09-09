<script setup lang="ts">
import menu, {MenuCurrent} from "../../../../hooks/menu";

import {useI18n} from "vue-next-i18n";
import Logo from "./Logo.vue";
import {router} from "../../../../router/router";

const route = useRoute();
const {t} = useI18n();
const currentBread = ref<string>("");
const breadArr = ref<MenuCurrent[]>([]);
watchEffect(() => {
  breadArr.value = menu.getCurrentMenu(route) as MenuCurrent[];
});
</script>

<template>
  <div class="breadcrumbs hidden sm:flex ml-2">
    <ul>
      <li
          class="text-primary hover:text-info transition-all text-lg cursor-pointer"
          v-for="(bread, index) in breadArr"
          :key="index"
          @click="router.push(bread.href)"
      >
        {{
          bread.translatable ? t("menu." + bread.name) : bread.name
        }}
      </li>
    </ul>
  </div>
  <div class="hidden sm:hidden xs:flex text-primary text-lg ml-2">
    {{
      breadArr.length ? breadArr[breadArr.length - 1].translatable ? t(breadArr[breadArr.length - 1].name) : breadArr[breadArr.length - 1].name : ""
    }}
  </div>
</template>