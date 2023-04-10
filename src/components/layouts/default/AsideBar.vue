<script setup lang="ts">
import menuService from "../../../hooks/menu";
import Logo from "./nav/Logo.vue";
import {protectedRoute} from "../../../router/config";
import AsideContent from "./aside/AsideContent.vue";
import BottomEffect from "./aside/BottomEffect.vue";
import {accountStore} from "../../../store/account";

const route = useRoute()
const activeIndex = ref<string>("");
const hiddenFunc = [
  computed(() => {
    const account = accountStore();
    console.log("HF", account)
    return (account.webUserInfo?.al || 0) !== 3;
  }),

]

watchEffect(() => {
  console.log('route.path', route.path)
  activeIndex.value = route.path as unknown as string;
})

const overflowHidden = ref<boolean>(false);
let timeoutId: NodeJS.Timeout;
watch(menuService.close, (target) => {
  if (target) {
    timeoutId = setTimeout(() => {
      overflowHidden.value = true;
    }, 300);
  } else {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    overflowHidden.value = false;
  }
})

const AsideCtx = toRef(menuService.menus.value[1], "children")
</script>

<template>
  <div
      class="sidebar top-[3rem] lg:left-4 left-0 lg:top-[4.2rem] lg:left-4 lg:close aside-cursor"
      @mouseleave="menuService.closeDrawer"
      @mouseenter="menuService.openDrawer"
      :class="{'overflow-hidden':!overflowHidden}"
      :style="`max-height: ${menuService.close.value ? 'calc(100% - 90px)':'0'}`"
  >
    <div class="logo-details">
      <Logo class="logo-icon"/>
      <span class="logo_name">GoArkOffPro</span>
    </div>
    <ul class="nav-links">
      <template v-for="(i,k) of AsideCtx" v-bind:key="k">
        <AsideContent
            :route="i"
            :hidden="i?.props?.hiddenFunc ? hiddenFunc[i?.props?.hiddenFunc-1].value : false"
        />
      </template>
    </ul>
    <BottomEffect/>
  </div>
</template>
