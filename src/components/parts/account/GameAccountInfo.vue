<script setup lang="ts">

import {useTranslate} from "../../../hooks/translate";
import {accountStore} from "../../../store/account";
import {storeToRefs} from "pinia/dist/pinia";
import DataCard from "../../element/DataCard.vue";
import GameInfoCard from "./GameInfoCard.vue";

const account = accountStore();
const {accountInfo} = storeToRefs(account)
const {translate} = useTranslate();
const props = defineProps({
  gameUserName: String, // IGB+?
  userCard: Object,
  alerts: Array,
})
const alertTypeCvt = {
  'info': "M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
  'warning': "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z",
  'error': "M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z",
} as Record<string, any>
const currentAp = computed(() => {
  //@ts-ignore
  return translate('game.info.current_ap') + accountInfo.value[props.gameUserName].status.maxAp.toString() + ')'
})
</script>
<template>
  <div>
    <div class="flex flex-col">
      <div class="px-1" v-for="(item,index) in alerts[0]" v-bind:key="10+index">
        <div class="alert shadow-lg text-white p-1 px-3 mt-1 rounded-xl" :style="`background-color:${item.color}`">
          <div>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                 class="stroke-current flex-shrink-0 w-6 h-6">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    :d="alertTypeCvt[item.type]"></path>
            </svg>
            <span>{{ translate(item['msg'], ...(item.args || [])) }}</span>
          </div>
        </div>
      </div>
      <div v-if="alerts && alerts[0].length" class="divider m-0"></div>
      <div class="flex justify-center mt-1 overflow-hidden">
        <div class="base-info">
          <div class="base-info-icon"
               :style="`background-image: url('static/icon/CASH.png');background-size: contain;background-repeat: no-repeat;background-position: center`"/>
          <div> {{ accountInfo[gameUserName].status['gold'] }}</div>
        </div>
        <div class="base-info">
          <div class="base-info-icon"
               :style="`background-image: url('static/icon/STONE.png');background-size: contain;background-repeat: no-repeat;background-position: center`"/>
          <div v-if="$route.params.platform === '1'">
            {{ accountInfo[gameUserName].status['androidDiamond'] }}+{{
              accountInfo[gameUserName].status['iosDiamond']
            }}
          </div>
          <div v-else> {{
              accountInfo[gameUserName].status['androidDiamond'] + accountInfo[gameUserName].status['iosDiamond']
            }}
          </div>
        </div>
        <div class="base-info">
          <div class="base-info-icon"
               :style="`background-image: url('static/icon/DIAMOND.png');background-size: contain;background-repeat: no-repeat;background-position: center`"/>
          <div> {{ accountInfo[gameUserName].status['diamondShard'] }}</div>
        </div>
      </div>
      <div class="divider m-0"></div>
      <div class="flex flex-row flex-wrap justify-center">
        <DataCard
            :description="currentAp"
            :value="userCard.ap"
            icon="AP_GAMEPLAY"
        />
        <DataCard
            :description="translate('game.info.campagn')"
            :value="userCard['campaignUnget'] || '已完成'"
            icon="DIAMOND_SHD"
        />
        <DataCard
            :description="translate('game.info.info_share')"
            :value="userCard['infoShare']"
            icon="MEETING"
        />
        <DataCard
            :description="translate('game.info.recruit_inuse')"
            :value="userCard.recruit"
            icon="RECRUIT"
        />
      </div>
      <div class="divider m-0"></div>
      <GameInfoCard
          :user-card="userCard"
          :game-user-name="gameUserName"
      />
      <div class="divider m-0"></div>
      <div class="px-1" v-for="(item,index) in alerts[1]" v-bind:key="index">
        <div class="alert shadow-lg text-white p-1 px-3 rounded-xl" :style="`background-color:${item.color}`">
          <div>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                 class="stroke-current flex-shrink-0 w-6 h-6">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    :d="alertTypeCvt[item.type]"></path>
            </svg>
            <span>{{ translate(item['msg'], ...item.args) }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

