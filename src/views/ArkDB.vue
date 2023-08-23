<script setup lang="ts">

import {useTranslate} from "../hooks/translate";
import {Ref} from "vue";
import {isLarge} from "../plugins/common";
import Tab from "../components/element/Tab.vue";
import CharDBTable from "../components/parts/arkdb/CharDBTable.vue";


const {translate} = useTranslate();

const currentTab: Ref = ref("#char")
const currentTabIndex: Ref = ref(0)

const charLoaded: Ref = ref(true)
const enemyLoaded: Ref = ref(false)
const itemLoaded: Ref = ref(false)

const infoTabHeaders = [
  {
    title: "arkdb.title.char",
    icon: "badge-account-horizontal-outline",
    ref: "#char",
  },
  {
    title: "arkdb.title.enemy",
    icon: "shield-sword-outline",
    ref: "#enemy",
  },
  {
    title: "arkdb.title.item",
    icon: "gold",
    ref: "#item",
  },
] as Record<string, any>[]

function changeTab(item: any, index: number) {
  currentTab.value = item.ref
  currentTabIndex.value = index * 9 / 4
  switch (item.ref) {
    case "#char":
      charLoaded.value = true
      break
    case "#enemy":
      enemyLoaded.value = true
      break
    case "#item":
      itemLoaded.value = true
      break
  }
}

</script>
<template>
  <Tab
      :large-mode="isLarge"
      :info-headers="infoTabHeaders"
      :current-tab-index="currentTabIndex"
      :current-tab="currentTab"
      :change-tab="changeTab"
  >
    <template #content>
      <div class="w-full lg:ml-[9.25rem] rounded-xl bg-base-200 z-10">
        <div class="w-full p-2">
          <CharDBTable
              v-if="charLoaded"
              v-show="currentTab === '#char'"
          />
        </div>
      </div>
    </template>
  </Tab>
</template>

