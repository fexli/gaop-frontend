<script setup lang="ts">
import menuService from "../../../../hooks/menu"
import {AnyNode} from "postcss";

const findParentNodes = (node: Element): boolean => {
  if (!node || !node.classList) {
    return false;
  }
  if (node?.classList?.contains("aside-cursor")) {
    return true;
  }
  if (node.parentNode) {
    return findParentNodes(node.parentNode as Element)
  }
  return false
}

// document.addEventListener("click", function (e) {
//   // @ts-ignore
//   console.log("findParentNodes", findParentNodes(e.target))
//
//   if (!menuService.close.value) {
//     return
//   }
//   // @ts-ignore
//   if (!findParentNodes(e.target)) {
//     e.stopPropagation()
//     e.stopImmediatePropagation()
//     console.log("close")
//     menuService.close.value = false
//   }
// })
</script>

<template>
  <div
      class="cursor-pointer aside-cursor"
      @mouseenter="menuService.openDrawer"
      @mouseleave="menuService.closeDrawerDelay"
  >
    <div
        class="duration-300 mx-2 w-6 h-6 pointer-events-none"
        style="font-size: 1.5em"
        :class="{ 'rotate-90': menuService.close.value }"
    >
      <svg class="w-6 h-6 absolute transition-opacity" :style="`opacity:${menuService.close.value ? '1':'0'}`"
           fill="none" stroke="currentColor"
           viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
      </svg>
      <svg class="w-6 h-6 absolute transition-opacity" :style="`opacity:${menuService.close.value ? '0':'1'}`"
           fill="none" stroke="currentColor"
           viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 10h16M4 14h16M4 18h16"
        />
      </svg>
    </div>
  </div>
</template>

<style scoped></style>
