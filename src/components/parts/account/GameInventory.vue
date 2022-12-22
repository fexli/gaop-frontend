<script setup lang="ts">

import {Ref} from "vue";
import {accountStore} from "../../../store/account";
import {storeToRefs} from "pinia";
import global_const from "../../../utils/global_const";
import {getGameUserInventory} from "../../../plugins/axios";
import {useTranslate} from "../../../hooks/translate";
import ItemFrame from "../inventory/ItemFrame.vue";

const {translate} = useTranslate();

const isLoading: Ref = ref(true)
const hasError: Ref = ref(false)
const errItem: Ref = ref([])

const props = defineProps({
  gameUserName: String,
  gamePlatform: Number,
  clicker: Function,
})

const gameUserID = computed(() => {
  return global_const.getPlatform(props.gamePlatform as number) + props.gameUserName
})
const account = accountStore();
const {accountInfo} = storeToRefs(account)

const computeGetUserInventory = computed(() => {
  // return store.dispatch('getUserInventory')[this.gameUserName]
  // this.getUserInventory(true)
  let inv = []
  for (let key in (accountInfo.value[gameUserID.value].inventory || {})) {
    if (global_const.gameData.itemData[key] == null) {
      hasError.value = true
      errItem.value.push(key)
      continue
    }
    inv.push({
      key: key,
      value: accountInfo.value[gameUserID.value].inventory[key],
      sortId: global_const.gameData.itemData[key].sortId,
      consume: false,
    })
  }
  for (let key in (accountInfo.value[gameUserID.value].consumable || {})) {
    for (let item in accountInfo.value[gameUserID.value].consumable[key]) {
      if (global_const.gameData.itemData[key] == null) {
        hasError.value = true
        errItem.value.push(key)
        continue
      }
      inv.push({
        key: key,
        value: accountInfo.value[gameUserID.value].consumable[key][item].count,
        sortId: global_const.gameData.itemData[key].sortId,
        ts: accountInfo.value[gameUserID.value].consumable[key][item].ts,
        sortKey: key + item,
        consume: true,
      })
    }
  }
  return inv.sort(function (a, b) {
    return ((a.sortId < b.sortId) ? -1 : ((a.sortId > b.sortId) ? 1 : 0))
  })
})

const computeGetUserStatus = computed(() => {
  return accountInfo.value[gameUserID.value].status
})

function computeNumToStr(c: number) {
  if (c > 10000) {
    return (Math.floor(c / 1000) / 10).toString() + '万'
  } else {
    return c.toString()
  }
}

function getUserInventory(force: boolean = false) {
  let userName = props.gameUserName
  let platform = props.gamePlatform
  if (accountInfo.value[gameUserID.value] && accountInfo.value[gameUserID.value].inventory && !force) {
    isLoading.value = false
    return
  }
  getGameUserInventory(props.gameUserName as string, props.gamePlatform as number).then((suc: any) => {
    console.log("getUserInventory", suc)
    account.setAccountInfoById(gameUserID.value, suc.data)
    isLoading.value = false
  }).catch((err: any) => {
    console.log("getUserInventoryErr", err)
    isLoading.value = false
  })
}

onMounted(() => {
  global_const.requireAsset("item_data", () => {
    getUserInventory()
  })
})
</script>
<template>
  <div class="text-center flex justify-center bg-base-200 rounded-xl" v-if="isLoading">
    <p>LOADING...</p>
  </div>
  <div v-else class="bg-base-200 rounded-xl">
    <div v-if="hasError" class="p-2">
      <div class="alert alert-warning shadow-lg text-white p-1 px-3 rounded-xl">
        <div>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
               class="stroke-current flex-shrink-0 w-6 h-6">
            <path
                stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            ></path>
          </svg>
          <span>{{ translate("error.data_not_up_to_date", errItem.join(", ")) }}</span>
        </div>
      </div>
    </div>

    <div class="mb-3 grid ark-grid">
      <!--基础物品+养成材料-->
      <ItemFrame font-size="1.25rem" font-overlay class="w-32 h-32 bg-base-200" item-id="4002"
                 :count="computeGetUserStatus['androidDiamond']" content="安卓" :clicker="clicker"/>
      <ItemFrame font-size="1.25rem" font-overlay class="w-32 h-32 bg-base-200" item-id="4002"
                 :count="computeGetUserStatus['iosDiamond']" content="IOS" :clicker="clicker"/>
      <ItemFrame font-size="1.25rem" font-overlay class="w-32 h-32 bg-base-200" item-id="4003"
                 :count="computeNumToStr(computeGetUserStatus['diamondShard'])" :clicker="clicker"/>
      <ItemFrame font-size="1.25rem" font-overlay class="w-32 h-32 bg-base-200" item-id="4001"
                 :count="computeNumToStr(computeGetUserStatus['gold'])" :clicker="clicker"/>
      <ItemFrame font-size="1.25rem" font-overlay class="w-32 h-32 bg-base-200" item-id="4004"
                 :count="computeNumToStr(computeGetUserStatus['hggShard'])" :clicker="clicker"/>
      <ItemFrame font-size="1.25rem" font-overlay class="w-32 h-32 bg-base-200" item-id="4005"
                 :count="computeNumToStr(computeGetUserStatus['lggShard'])" :clicker="clicker"/>
      <ItemFrame font-size="1.25rem" font-overlay class="w-32 h-32 bg-base-200" item-id="7003"
                 :count="computeGetUserStatus['gachaTicket']" :clicker="clicker"/>
      <ItemFrame font-size="1.25rem" font-overlay class="w-32 h-32 bg-base-200" item-id="7004"
                 :count="computeGetUserStatus['tenGachaTicket']" :clicker="clicker"/>
      <ItemFrame font-size="1.25rem" font-overlay class="w-32 h-32 bg-base-200" item-id="7001"
                 :count="computeGetUserStatus['recruitLicense']" :clicker="clicker"/>
      <ItemFrame font-size="1.25rem" font-overlay class="w-32 h-32 bg-base-200" item-id="7002"
                 :count="computeGetUserStatus['instantFinishTicket']" :clicker="clicker"/>
      <!--插入消耗品-->
      <template v-for="item in computeGetUserInventory" :key="item.sortKey || item.key">
        <ItemFrame font-size="1.25rem" font-overlay class="w-32 h-32 bg-base-200" :item-id="item.key"
                   :ts="item.ts || -1" :count="item.value" :consume="item.consume"
                   :clicker="clicker"/>
      </template>
    </div>
  </div>
</template>

<style>
.ark-grid {
  grid-template-columns: repeat(auto-fill, minmax(8rem, 1fr))
}
</style>