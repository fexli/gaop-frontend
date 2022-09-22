<script setup lang="ts">
import ItemFrame from "../inventory/ItemFrame.vue";
import {accountStore} from "../../../store/account";
import {storeToRefs} from "pinia";
import global_const from "../../../utils/global_const";
import {getGameUserInventory} from "../../../plugins/axios";
import {Ref} from "vue";

const props = defineProps({
  gameUserName: String,
  gamePlatform: Number,
})

const headers = [
  {text: '物品&数量', width: '150px'},
  {text: '等效源石'},
  {text: '等效合成玉'},
  {text: '等效单抽'},
]
const wealthList: Ref<any[]> = ref([])
const success = ref(false)
const finished = ref(false)
const account = accountStore();
const {accountInfo} = storeToRefs(account)
const computeGetUserStatus = computed(() => {
  let s = global_const.getUserLogName(props.gameUserName || "", props.gamePlatform as number)
  return accountInfo.value[s].status
})

const computeAllWealth = computed(() => {
  let dim = 0
  let shd = 0
  let tkt = 0
  for (let info of wealthList.value) {
    dim += info.as_dim
    shd += info.as_shd
    tkt += info.as_tkt
  }
  dim = Math.round(dim * 1000) / 1000
  shd = Math.round(shd * 1000) / 1000
  tkt = Math.round(tkt * 1000) / 1000
  return {
    dim,
    shd,
    tkt
  }
})

function addItem(item: any, count: number, info: string, type: string) {
  switch (type) {
    case 'DIM':
      wealthList.value.push({
        id: wealthList.value.length,
        item: item,
        count: count,
        info: info,
        as_dim: count,
        as_shd: count * 180,
        as_tkt: count * 0.3
      })
      break
    case 'SHD':
      wealthList.value.push({
        item: item,
        count: count,
        info: info,
        as_dim: Math.round(count * 1000 / 180) / 1000,
        as_shd: count,
        as_tkt: Math.round(count * 1000 / 600) / 1000
      })
      break
    case 'TKT':
      wealthList.value.push({
        item: item,
        count: count,
        info: info,
        as_dim: Math.round(count * 60000 / 18) / 1000,
        as_shd: count * 600,
        as_tkt: count
      })
      break
    case 'TKT10':
      wealthList.value.push({
        item: item,
        count: count,
        info: info,
        as_dim: Math.round(count * 600000 / 18) / 1000,
        as_shd: count * 6000,
        as_tkt: count * 10
      })
      break
  }
}

function calcWealth(data: any) {
  console.log(data)
  // parse status
  if (computeGetUserStatus.value.androidDiamond !== 0) {
    addItem('4002', computeGetUserStatus.value.androidDiamond, '安卓', 'DIM')
  }
  if (computeGetUserStatus.value.iosDiamond !== 0) {
    addItem('4002', computeGetUserStatus.value.iosDiamond, 'IOS', 'DIM')
  }
  if (computeGetUserStatus.value.diamondShard !== 0) {
    addItem('4003', computeGetUserStatus.value.diamondShard, '', 'SHD')
  }
  if (computeGetUserStatus.value.gachaTicket !== 0) {
    addItem('7003', computeGetUserStatus.value.gachaTicket, '', 'TKT')
  }
  if (computeGetUserStatus.value.tenGachaTicket !== 0) {
    addItem('7004', computeGetUserStatus.value.tenGachaTicket, '', 'TKT10')
  }
  // parse inventory
  // parse consumeable
  for (let i in data['consumable']) {
    let itemInfo = global_const.gameData.itemData[i]
    if (itemInfo == null) {
      continue
    }
    let count = 0
    for (let j in data['consumable'][i]) {
      count += data['consumable'][i][j].count
    }
    if (count === 0) {
      continue
    }
    switch (itemInfo.itemType) {
      case 'LIMITED_TKT_GACHA_10':
        wealthList.value.push({
          item: i,
          count: count,
          info: '限定',
          as_dim: count * 600 / 18,
          as_shd: count * 6000,
          as_tkt: count * 10
        })
        break
    }
  }
  console.log("wealth", wealthList.value)
  success.value = true
  finished.value = true
}

onMounted(() => {
  let gameUserID = global_const.getUserLogName(props.gameUserName || "", props.gamePlatform as number)
  if (!accountInfo.value[gameUserID] || !accountInfo.value[gameUserID].inventory) {
    getGameUserInventory(props.gameUserName || "", props.gamePlatform as number).then((res: any) => {
      account.setAccountInfo(props.gameUserName || "", props.gamePlatform as number, res.data)
      calcWealth(res.data)
    }).catch((err) => {
      console.log(err)
      success.value = false
      finished.value = true
    })
  } else {
    calcWealth(accountInfo.value[gameUserID].inventory)
  }
})
</script>
<template>
  <div>
    <div class="alert flex-row shadow-lg text-white p-1 px-3 mt-2 rounded-xl bg-violet-400">
      <div v-if="gameUserName">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
             class="stroke-current flex-shrink-0 w-6 h-6">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
        <span>
          当前账号内总计折算抽数为：
          <span style="font-weight: bold">{{ computeAllWealth.tkt }}抽</span>，距井还有：
          <span style="font-weight: bold">{{ Math.max(0, 180000 - computeAllWealth.shd) }}玉/
            {{ Math.max(0, Math.round(1000 - computeAllWealth.dim + 0.9)) }}石/
            {{ Math.max(0, Math.round(300 - computeAllWealth.tkt + 0.9)) }}抽
          </span>
        </span>
      </div>
    </div>
    <div class="overflow-x-auto w-full">
      <table class="table table-zebra text-center table-fixed w-full">
        <thead>
        <tr>
          <template v-for="i of headers">
            <th :style="i.width ? `width: ${i.width}` : ''">{{ i.text }}</th>
          </template>
        </tr>
        </thead>
        <tbody>
        <template v-for="item of wealthList">
          <tr>
            <th>
              <ItemFrame
                  class="w-28 h-28"
                  :item-id="item.item"
                  :count="item.count"
                  :content="item.info"
              />
            </th>
            <td class="md:text-xl md:font-bold">
              {{ item.as_dim }}
            </td>
            <td class="md:text-xl md:font-bold">
              {{ item.as_shd }}
            </td>
            <th class="md:text-xl md:font-bold">
              {{ item.as_tkt }}
            </th>
          </tr>
        </template>
        </tbody>
        <tfoot>
        <tr>
          <th class="md:text-xl">
            总计
          </th>
          <td class="md:text-xl">
            {{ computeAllWealth.dim }}颗
          </td>
          <td class="md:text-xl">
            {{ computeAllWealth.shd }}玉
          </td>
          <th class="md:text-xl">
            {{ computeAllWealth.tkt }}抽
          </th>
        </tr>
        </tfoot>
      </table>
    </div>
  </div>
</template>

