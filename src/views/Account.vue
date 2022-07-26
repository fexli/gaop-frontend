<script setup lang="ts">
import {Ref} from "vue";
import NotFound from "./error/NotFound.vue";
import {getGameSortAlert, getGameUserCard} from "../plugins/axios";
import {accountStore} from "../store/account";
import global_const from "../utils/global_const";
import {useToast} from "../hooks/toast";
import {useTranslate} from "../hooks/translate";
import GameAccountInfo from "../components/parts/account/GameAccountInfo.vue";
import GameInventory from "../components/parts/account/GameInventory.vue";
import {isLarge} from "../plugins/common";
import GameItemInfoCard from "../components/parts/account/GameItemInfoCard.vue";
import GameTroop from "../components/parts/account/GameTroop.vue";
import GameAnalytics from "../components/parts/account/GameAnalytics.vue";


const account = accountStore();
const router = useRouter();
const route = useRoute()
const {showMessage} = useToast();
const {translate} = useTranslate();
const isLegalAccount = computed(() => {
  return legalAccount()
});
const gameStart: Ref = ref(false)
const onLoading: Ref = ref(true)
const stopListen: Ref = ref(false)
const contentIsShow: Ref = ref(true)
const currentTab: Ref = ref("#info")
const currentTabIndex: Ref = ref(0)

const itemClicked: Ref = ref({})
const itemCardOverlay: Ref = ref(false)
const itemCardTransition: Ref = ref(false)

const infoTabHeaders = [
  {
    title: "account.tabs.info",
    icon: "home-account",
    ref: "#info",
  },
  {
    title: "account.tabs.inventory",
    icon: "package-variant",
    ref: "#inventory",
  },
  {
    title: "account.tabs.troop",
    icon: "chess-pawn",
    ref: "#troop",
  },
  {
    title: "account.tabs.analytics",
    icon: "chart-bar-stacked",
    ref: "#analytics",
  },
  {
    title: "account.tabs.operation",
    icon: "ghost-outline",
    ref: "#operation",
  },
  {
    title: "account.tabs.schedule",
    icon: "chart-timeline",
    ref: "#schedule",
  },
  {
    title: "account.tabs.logger",
    icon: "comment-text-multiple-outline",
    ref: "#logger",
  },
  {
    title: "account.tabs.setting",
    icon: "cog-outline",
    ref: "#setting",
  },
  {
    title: "account.tabs.terminal",
    icon: "console-line",
    ref: "#terminal",
  },
] as Record<string, any>[]

const infoLoaded: Ref = ref(true)
const inventoryLoaded: Ref = ref(false)
const troopLoaded: Ref = ref(false)
const analyticsLoaded: Ref = ref(false)
const operationLoaded: Ref = ref(false)
const scheduleLoaded: Ref = ref(false)
const loggerLoaded: Ref = ref(false)
const settingLoaded: Ref = ref(false)
const terminalLoaded: Ref = ref(false)

const gameUserName: Ref = ref("")
const gamePlatform: Ref = ref(0)
const userCard: Ref = ref({})


const getAccountAlert = computed(() => {
  return account.getAccountAlert[global_const.getPlatform(gamePlatform.value) + gameUserName.value] || [[], []]
})

function goManage() {
  router.push({path: '/account/manage'})
}

function mergeGameData(userName: string, dataObj: any) {
  account.setAccountInfoById(userName, dataObj)
  console.log("mergeGameData", account.accountInfo)
}

function syncGameData() {
  gameStart.value = false
  onLoading.value = true
  if (gameUserName.value === "") {
    onLoading.value = false
    return
  }
  getGameUserCard(gameUserName.value, gamePlatform.value).then((suc: any) => {
    console.log("gSuc", suc)
    account.addAccountInfo(gameUserName.value, gamePlatform.value, suc.data['baseInfo'])
    mergeGameData(global_const.getPlatform(gamePlatform.value) + gameUserName.value, suc.data['baseInfo'])
    userCard.value = suc.data['userCard']
    getGameSortAlert(gameUserName.value, gamePlatform.value).then((suc: any) => {
      console.log("alerts", suc)
      account.setAccountAlert(gameUserName.value, gamePlatform.value, suc.data.alerts)
      gameStart.value = true
      onLoading.value = false
    }).catch((err: any) => {
      console.log("alertsErr", err)
      gameStart.value = true
      onLoading.value = false
    })
  }).catch((err: any) => {
    console.log("gErr", err)
    onLoading.value = false
    gameStart.value = false
    if (err.data.msg == null) {
      return
    }
    showMessage(err.data.msg, 2000, "info", gameUserName.value)
    //TODO: errCode
  })
}

function legalAccount() {
  for (let x in account.accountsList) {
    if (account.accountsList[x] === global_const.getPlatform(gamePlatform.value) + gameUserName.value) {
      return true
    }
  }
  return false
}

function listenCtxUpdate() {
  if (stopListen.value) {
    return
  }
  if (route.params.user !== gameUserName.value) {
    gameUserName.value = route.params.user
    gamePlatform.value = Number(route.params.platform)
    syncGameData()
  }
  if (account.loggerStoreUpdate) {
    console.log('content updated.')
    contentIsShow.value = false
    nextTick(() => {
      contentIsShow.value = true
    })
    account.loggerStoreUpdate = false
  }
  setTimeout(listenCtxUpdate, 100)
}

function changeTab(item: any, index: number) {
  currentTab.value = item.ref
  currentTabIndex.value = index * 9 / 4
  switch (item.ref) {
    case "#info":
      infoLoaded.value = true
      break
    case "#inventory":
      inventoryLoaded.value = true
      break
    case "#troop":
      troopLoaded.value = true
      break
    case "#analytics":
      analyticsLoaded.value = true
      break
    case "#operation":
      operationLoaded.value = true
      break
    case "#schedule":
      scheduleLoaded.value = true
      break
    case "#logger":
      loggerLoaded.value = true
      break
    case "#setting":
      settingLoaded.value = true
      break
    case "#terminal":
      terminalLoaded.value = true
      break
  }
}

function showItemInfo(item: any) {
  console.log("showItemInfo", item)
  itemClicked.value = item
  itemCardOverlay.value = true
  setTimeout(() => {
    itemCardTransition.value = true
  }, 100)
}

function hideItemCard() {
  itemCardTransition.value = false
  setTimeout(() => {
    itemCardOverlay.value = false
    itemClicked.value = {}
  }, 100)
}

onMounted(() => {
  listenCtxUpdate()
  console.log("Mounted")
})
onUnmounted(() => {
  console.log("Unmounted")
  stopListen.value = true
})
</script>
<template>
  <div v-if="gameStart">
    <div class="flex h-full">
      <div class="tabs-horizontal tabs lg:tab-account">
        <div
            :style="`transform: translate${isLarge ? 'Y':'X'}(${currentTabIndex}rem)`"
            class="tab-select-back absolute bg-primary w-32 h-8 mx-1 rounded-xl transition-all duration-200"
        />
        <template v-for="(i,k) of infoTabHeaders" v-bind:key="k">
          <div
              @click="changeTab(i,k)" class="tab tab-horizontal"
              :class="currentTab === i.ref ? 'tab-active' : ''"
          >
            <svg class="w-6 h-6" stroke="currentColor" fill="currentColor" viewBox="0 0 24 24">
              <path stroke-width="0.3" :d="global_const.mdiPath[i.icon]"/>
            </svg>
            <span>{{ translate(i.title) }}</span>
          </div>
        </template>
      </div>
      <div class="w-full lg:tab-content">
        <GameAccountInfo
            v-if="infoLoaded"
            v-show="currentTab === '#info'"
            :user-card="userCard"
            :alerts="getAccountAlert"
            :game-user-name="global_const.getPlatform(gamePlatform) + gameUserName"
        />
        <GameInventory
            v-if="inventoryLoaded"
            v-show="currentTab === '#inventory'"
            :game-user-name="gameUserName"
            :game-platform="gamePlatform"
            :clicker="showItemInfo"
        />
        <GameTroop
            v-if="troopLoaded"
            v-show="currentTab === '#troop'"
            :game-user-name="gameUserName"
            :game-platform="gamePlatform"
            :clicker="showItemInfo"
        />
        <GameAnalytics
            v-if="analyticsLoaded"
            v-show="currentTab === '#analytics'"
            :game-user-name="gameUserName"
            :game-platform="gamePlatform"
        />
      </div>
    </div>
  </div>
  <div v-else-if="isLegalAccount" class="rounded-xl bg-base-200 bg-opacity-80 mt-1">
    <NotFound
        class="md:py-5"
        title="error.account_not_start_title" translate-title
        content="error.account_not_start" translate-content
        btn="go_account_manage" translate-btn
        :back="goManage"
    />
  </div>
  <div v-else class="rounded-xl bg-base-200 bg-opacity-80 mt-1">
    <NotFound
        class="md:py-5"
        title="error.account_not_found_title" translate-title
        content="error.account_not_found" translate-content
        btn="go_account_manage" translate-btn
        :back="goManage"
    />
  </div>
  <div class="overlay bg-base-200 bg-opacity-40" v-if="itemCardOverlay">
    <div class="fixed w-full h-full left-0 top-0" @click="hideItemCard"/>
    <GameItemInfoCard
        v-show="itemCardTransition"
        class="transform fixed top-1/4 right-1"
        :select-item="itemClicked"
    />
  </div>
</template>

