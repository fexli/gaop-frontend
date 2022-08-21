<script setup lang="ts">
import menuService from "../../../hooks/menu";
import Logo from "./nav/Logo.vue";
import {protectedRoute} from "../../../router/config";
import AsideContent from "./aside/AsideContent.vue";
import BottomEffect from "./aside/BottomEffect.vue";

const route = useRoute()
const activeIndex = ref<string>("");

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

// onMounted(() => {
//   let arrow = document.querySelectorAll(".arrow");
//   for (let i = 0; i < arrow.length; i++) {
//     arrow[i].addEventListener("click", (e) => {
//       console.log("arrow click");
//       let arrowParent = (e?.target as unknown as Document).parentElement?.parentElement;
//       console.log(arrowParent);
//       if (arrowParent) {
//         arrowParent.classList.toggle("showMenu");
//       }
//     });
//   }
// })
</script>

<template>
  <div
      class="sidebar lg:close aside-cursor"
      @mouseleave="menuService.closeDrawer"
      @mouseenter="menuService.openDrawer"
      :class="{'overflow-hidden':!overflowHidden}"
      :style="`max-height: ${menuService.close.value ? 'calc(100% - 90px)':'0'}`"
  >
    <div class="logo-details">
      <Logo class="logo-icon"/>
      <span class="logo_name">GoArkOffProxy</span>
    </div>
    <ul class="nav-links">
      <template v-for="(i,k) of menuService.menus.value[1].children" v-bind:key="k">
        <AsideContent :route="i"/>
      </template>
    </ul>
    <BottomEffect/>
  </div>
</template>
