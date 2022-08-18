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
  <div class="breadcrumbs hidden sm:flex">
    <ul>
      <li class="text-primary" v-for="(bread, index) in breadArr" :key="index">
        <Logo v-if="bread === 'home'"/>
        <template v-else>
          {{
            t("menu." + bread)
          }}
        </template>
      </li>
    </ul>
  </div>
  <Logo class="sm:hidden"/>
</template>

<style lang="scss" scoped>
@media screen and(max-width: 768px) {
  .breadcrumb {
    display: none;
  }
}
</style>
