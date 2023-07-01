<script setup lang="ts">
import {isLarge} from "../../../plugins/common";
import {Ref} from "vue";
import global_const from "../../../utils/global_const";
import {useTranslate} from "../../../hooks/translate";
import JsonView from "../../element/JsonView.vue";
import {accountStore} from "../../../store/account";
import {storeToRefs} from "pinia";
import AnalyricsGameData from "../analytics/AnalyricsGameData.vue";
import AnalyricsWealth from "../analytics/AnalyricsWealth.vue";
import Tab from "../../element/Tab.vue";

const account = accountStore();
const {accountInfo} = storeToRefs(account)

const {translate} = useTranslate();

const currentTab: Ref = ref("#gamedata")
const currentTabIndex: Ref = ref(0)

const props = defineProps({
  gameUserName: String,
  gamePlatform: Number,
})

const infoTabHeaders = [
  {
    title: "game.anal.gamedata",
    icon: "database-search-outline",
    ref: "#gamedata",
  },
  {
    title: "game.anal.wealth",
    icon: "gold",
    ref: "#wealth",
  },
  // {
  //   title: "game.anal.gacha",
  //   icon: "account-multiple",
  //   ref: "#gacha",
  // },
  // {
  //   title: "game.anal.building",
  //   icon: "domain",
  //   ref: "#building",
  // },
  // {
  //   title: "game.anal.troop",
  //   icon: "human-queue",
  //   ref: "#troop",
  // },
  // {
  //   title: "game.anal.dungeon",
  //   icon: "map-legend",
  //   ref: "#dungeon",
  // },
  // {
  //   title: "game.anal.about",
  //   icon: "information",
  //   ref: "#about",
  // },
] as Record<string, any>[]

function changeTab(item: any, index: number) {
  currentTab.value = item.ref
  currentTabIndex.value = index * 9 / 4
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
      <div class="w-full lg:ml-[9.25rem] rounded-xl bg-base-200">
        <div class="w-full p-2">
          <div class="alert flex-row shadow-lg text-white p-1 px-3 rounded-xl" :class="gameUserName ? 'bg-info' : 'bg-error'">
            <div v-if="gameUserName">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                   class="stroke-current w-6 h-6">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <span>当前锁定的账号为:{{ gameUserName }} | {{ currentTab }}</span>
            </div>
            <div v-else>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                   class="stroke-current flex-shrink-0 w-6 h-6">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <span>当前没有锁定的账号！</span>
            </div>
          </div>
          <AnalyricsGameData
              :game-user-name="gameUserName"
              :game-platform="gamePlatform"
              v-if="currentTab === '#gamedata'"
          />
          <AnalyricsWealth
              :game-user-name="gameUserName"
              :game-platform="gamePlatform"
              v-if="currentTab === '#wealth'"
          />
        </div>
      </div>
    </template>
  </Tab>
</template>

