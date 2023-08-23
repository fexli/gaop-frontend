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
import GameLogger from "../components/parts/account/GameLogger.vue";
import GameAccountSetting from "../components/parts/account/GameAccountSetting.vue";
import GameUserModule from "../components/parts/account/GameUserModule.vue";
import TransitionOverlay from "../components/element/TransitionOverlay.vue";
import {storeToRefs} from "pinia";
import GameCharInfoCard from "../components/parts/account/GameCharInfoCard.vue";
import Tab from "../components/element/Tab.vue";


const account = accountStore();

const {accountInfo} = storeToRefs(account)

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

const charClicked: Ref = ref({})
const charCardOverlay: Ref = ref(false)
const charCardTransition: Ref = ref(false)

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
    title: "account.tabs.module",
    icon: "script-text-play-outline",
    ref: "#module",
  },
  // {
  //   title: "account.tabs.operation",
  //   icon: "ghost-outline",
  //   ref: "#operation",
  // },
  // {
  //   title: "account.tabs.schedule",
  //   icon: "chart-timeline",
  //   ref: "#schedule",
  // },
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
  // {
  //   title: "account.tabs.terminal",
  //   icon: "console-line",
  //   ref: "#terminal",
  // },
] as Record<string, any>[]

const infoLoaded: Ref = ref(true)
const inventoryLoaded: Ref = ref(false)
const troopLoaded: Ref = ref(false)
const analyticsLoaded: Ref = ref(false)
const moduleLoaded: Ref = ref(false)
const operationLoaded: Ref = ref(false)
const scheduleLoaded: Ref = ref(false)
const loggerLoaded: Ref = ref(false)
const settingLoaded: Ref = ref(false)
const terminalLoaded: Ref = ref(false)

const gameUserName: Ref = ref("")
const gamePlatform: Ref = ref(0)
const userCard: Ref = ref({})

const gameUserID = computed(() => {
  return global_const.getPlatform(gamePlatform.value) + gameUserName.value
})

const getAccountAlert = computed(() => {
  return account.getAccountAlert[gameUserID.value] || [[], []]
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
    mergeGameData(gameUserID.value, suc.data['baseInfo'])
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
    if (account.accountsList[x] === gameUserID.value) {
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
    // console.log('content updated.')
    contentIsShow.value = false
    nextTick(() => {
      contentIsShow.value = true
    })
    account.loggerStoreUpdate = false
  }
  setTimeout(listenCtxUpdate, 100)
}

function changeTab(item: any, index: number) {
  console.log("changeTab", item, index)
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
    case "#module":
      moduleLoaded.value = true
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

function findCharByInst(inst: number) {
  for (let x in accountInfo.value[gameUserID.value].troop.chars) {
    if (accountInfo.value[gameUserID.value].troop.chars[x].instId === inst) {
      return accountInfo.value[gameUserID.value].troop.chars[x]
    }
  }
  return null
}

function showCharInfo(charInst: number) {
  let char = findCharByInst(charInst)
  if (char == null) {
    console.log("showItemInfoNotFound", charInst)
    return
  }
  console.log("showCharInfo", char)
  charClicked.value = char
  charCardOverlay.value = true
  setTimeout(() => {
    charCardTransition.value = true
  }, 100)
}

function hideItemCard() {
  itemCardTransition.value = false
  setTimeout(() => {
    itemCardOverlay.value = false
    itemClicked.value = {}
  }, 100)
}

function hideCharInfo() {
  charCardTransition.value = false
  setTimeout(() => {
    charCardOverlay.value = false
    charClicked.value = {}
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
    <Tab
        :change-tab="changeTab"
        :current-tab="currentTab"
        :current-tab-index="currentTabIndex"
        :info-headers="infoTabHeaders"
        :large-mode="isLarge"
    >
      <template #content>
        <div class="w-full lg:ml-[9.25rem]">
          <GameAccountInfo
              v-if="infoLoaded"
              v-show="currentTab === '#info'"
              :user-card="userCard"
              :alerts="getAccountAlert"
              :game-user-name="gameUserID"
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
              :clicker="showCharInfo"
          />
          <GameAnalytics
              v-if="analyticsLoaded"
              v-show="currentTab === '#analytics'"
              :game-user-name="gameUserName"
              :game-platform="gamePlatform"
          />
          <GameUserModule
              v-if="moduleLoaded"
              v-show="currentTab === '#module'"
              :game-user-name="gameUserName"
              :game-platform="gamePlatform"
          />
          <GameLogger
              v-if="loggerLoaded"
              v-show="currentTab === '#logger'"
              :game-user-name="gameUserName"
              :game-platform="gamePlatform"
          />
          <GameAccountSetting
              class="w-full"
              v-if="settingLoaded"
              v-show="currentTab === '#setting'"
              :game-user-name="gameUserName"
              :game-platform="gamePlatform"
          />
        </div>
      </template>
    </Tab>
  </div>
  <div v-else-if="isLegalAccount" class="rounded-xl bg-base-200 bg-opacity-80">
    <NotFound
        class="md:py-5"
        title="error.account_not_start_title" translate-title
        content="error.account_not_start" translate-content
        btn="go_account_manage" translate-btn
        :back="goManage"
    />
  </div>
  <div v-else class="rounded-xl bg-base-200 bg-opacity-80">
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
    <TransitionOverlay
        :show="itemCardTransition"
        transition-name="slide-left-to-right"
    >
      <GameItemInfoCard
          class="transform fixed top-[4.25rem] right-4 ring-1 ring-secondary"
          :select-item="itemClicked"
          :game-user-name="gameUserName"
          :game-platform="gamePlatform"
      />
    </TransitionOverlay>
  </div>
  <div class="overlay bg-base-200 bg-opacity-40" v-if="charCardOverlay">
    <div class="fixed w-full h-full left-0 top-0" @click="hideCharInfo"/>
    <TransitionOverlay
        :show="charCardTransition"
        transition-name="slide-left-to-right"
    >
      <GameCharInfoCard
          class="transform fixed top-[4.25rem] right-4 ring-1 ring-secondary"
          :select-item="charClicked"
      />
    </TransitionOverlay>
  </div>
</template>

