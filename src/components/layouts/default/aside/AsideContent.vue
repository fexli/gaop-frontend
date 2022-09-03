<script setup lang="ts">
import {RouteRecordRaw} from "vue-router";
import {PropType} from "vue";
import {useI18n} from "vue-next-i18n";

const {t} = useI18n();
const defaultMpath = "M11 15.5H12.5V17H11V15.5M12 6.95C14.7 7.06 15.87 9.78 14.28 11.81C13.86 12.31 13.19 12.64 12.85 13.07C12.5 13.5 12.5 14 12.5 14.5H11C11 13.65 11 12.94 11.35 12.44C11.68 11.94 12.35 11.64 12.77 11.31C14 10.18 13.68 8.59 12 8.46C11.18 8.46 10.5 9.13 10.5 9.97H9C9 8.3 10.35 6.95 12 6.95M12 2C11.5 2 11 2.19 10.59 2.59L2.59 10.59C1.8 11.37 1.8 12.63 2.59 13.41L10.59 21.41C11.37 22.2 12.63 22.2 13.41 21.41L21.41 13.41C22.2 12.63 22.2 11.37 21.41 10.59L13.41 2.59C13 2.19 12.5 2 12 2M12 4L20 12L12 20L4 12Z";
const props = defineProps({
  route: Object as PropType<RouteRecordRaw>,
  activeIndex: String,

});
const showMenu = ref<boolean>(false);

const toggleShowMenu = () => {
  showMenu.value = !showMenu.value;
  console.log("showMenu", showMenu.value)
}
</script>
<template>
  <!--  icon designed from https://materialdesignicons.com/-->
  <li :class="{'current':activeIndex === route.path,'showMenu':showMenu}" v-if="!(route?.meta['hiddenInMenu'])">
    <div class="icon-link">
      <a :href="'#'+route.path">
        <svg class="logo-icon" stroke="currentColor" viewBox="0 0 24 24">
          <path
              stroke-width="0.3"
              :fill="route.meta['icon']?.fill || 'currentColor'"
              :stroke="route.meta['icon']?.stroke || 'currentColor'"
              :d="route.meta['icon']?.d || defaultMpath"
          />
        </svg>
        <span class="link_name">{{ t("menu." + route.meta['title']) }}</span>
      </a>
      <i v-if="route.children?.length" class='arrow w-10 flex justify-center' @click="toggleShowMenu">
        <svg style="width:24px;height:24px" viewBox="0 0 24 24">
          <path fill="currentColor" d="M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z"/>
        </svg>
      </i>
    </div>
    <ul class="sub-menu" :class="{'blank':!route.children?.length}">
      <li><a class="link_name" :href="'#'+route.path">{{ t("menu." + route.meta['title']) }}</a></li>
      <template v-if="route.children?.length">
        <li v-for="child in route.children" :key="child.path" v-if="!child?.meta['hiddenInMenu']">
          <a :href="'#'+child.path">{{
              child.meta['translatable'] ? t("menu." + child.meta['title']) : child.meta['title']
            }}</a>
        </li>
      </template>
    </ul>
  </li>
</template>

