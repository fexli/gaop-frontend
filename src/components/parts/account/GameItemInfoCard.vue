<script setup lang="ts">
import formatter from "../../../utils/formatter";
import global_const from "../../../utils/global_const";
import FeImg from "../../element/FeImg.vue";
import {addGameItemUse, listGameItemUse} from "../../../plugins/axios";
import {onMounted} from "vue";
import {accountStore} from "../../../store/account";

const {getAccountItemUse, setAccountItemUse} = accountStore();

const props = defineProps({
  selectItem: {
    type: Object,
    default: {}
  },
  gameUserName: String,
  gamePlatform: Number,
})

function formatTime(ts: number) {
  return formatter.formatConsumeTime(ts)
}

function calculateitemIdTags(item: Record<string, any>) {
  let edata = global_const.gameData.itemTable.apSupplies[item.itemId]
  if (edata) {
    return [{id: 1, color: 'khaki', text: '理智+' + edata.ap}]
  }
}

function checkTs(ts: number) {
  let remainTs = (ts - new Date().getTime() / 1000) / 86400
  if (remainTs > 7)
    return 'green'
  if (remainTs > 4)
    return 'yellow'
  if (remainTs > 2)
    return 'orange'
  return 'red'
}

const itemData = computed(() => {
  return global_const.gameData.itemData[props.selectItem.itemId] || {} as Record<string, any>
})

const itemCanUse = computed(() => {
  if (!props.selectItem.consume || (consumableUser[itemData.value.itemType] || {}).cantUse) {
    return {
      text: "无法使用",
      disabled: true,
      click: undefined
    }
  }
  if (consumableUser[itemData.value.itemType]) {
    return {
      text: "使用",
      disabled: false,
      click: () => consumableUser[itemData.value.itemType].use(props.selectItem)
    }
  }
  return {
    text: "使用(未完成)",
    disabled: true,
    click: undefined,
  }
})

const consumableUser = {
  AP_SUPPLY: {
    field: 'apSupply',
    use: function (item: Record<string, any>) {
      console.log("use ap supply", item)
      addGameItemUse(
          props.gameUserName as string, props.gamePlatform as number,
          item.itemId, item.itemInst, 1, ""
      ).then((suc)=>{
        console.log("addGameItemUse", suc)
        listUserItemUse()
      }).catch((err)=>{
        console.log("addGameItemUseErr", err)
      })
    }
  },
  EXTERMINATION_AGENT: {
    cantUse: true,
  }
} as Record<string, any>

const itemUseInfo = computed(() => {
  return getAccountItemUse(props.gameUserName as string, props.gamePlatform as number) || {} as Record<string, any>
})

function listUserItemUse(force: boolean = true) {
  if (getAccountItemUse(props.gameUserName as string, props.gamePlatform as number) && !force) {
    console.log("onMounted - has cache")
    return
  }
  listGameItemUse(props.gameUserName as string, props.gamePlatform as number).then((suc: any) => {
    console.log("listGameItemUse", suc)
    setAccountItemUse(props.gameUserName as string, props.gamePlatform as number, suc.data)
  }).catch((err: any) => {
    console.log("listGameItemUseErr", err)
  })
}

onMounted(() => {
  listUserItemUse(false)
})
</script>
<template>
  <div class="rounded-xl px-3 py-1 max-w-[40%] min-w-[22.5rem] absolute bg-base-200">
    <div class="font-bold text-sm font-mono">
      -#-ITEM-DETAIL-#- >> {{ itemData.iconId }}
    </div>
    <div class="flex">
      <div>
        <div class="text-2xl font-bold mb-1">
          {{ itemData?.name || 'UNKNOWN' }} - 库存 {{
            selectItem.count
          }}{{ selectItem.content ? '(' + selectItem.content + ')' : '' }}
        </div>
        <div class="text-sm">
          {{ itemData?.usage || 'UNKNOWN' }}
        </div>
        <div class="text-sm text-base-content/70">
          {{ itemData?.description || 'UNKNOWN' }}
        </div>
      </div>
      <div class="mx-6 self-center">
        <FeImg
            style="height: 100px;width: 100px;"
            :src="'http://mc.mesord.com:8999/items/'+(itemData?.iconId || 'missing')+'.png'"/>

      </div>
    </div>
    <div class="my-2 flex gap-x-1 items-center">
      <div class="badge badge-md badge-outline select-none" style="color: #bb4fff">
        {{
          global_const.itemTypes[itemData?.itemType || ''] || itemData?.itemType || 'MISSING'
        }}
      </div>
      <div v-if="selectItem.consume" class="badge badge-md badge-outline select-none" style="color: dodgerblue">
        消耗品
      </div>
      <template v-for="item in calculateitemIdTags(selectItem)"
                v-bind:key="item.id">
        <div v-if="selectItem.consume" class="badge badge-md badge-outline select-none" :style="`color: ${item.color}`">
          {{ item.text }}
        </div>
      </template>
      <div v-if="selectItem.ts !== -1" class="badge badge-md badge-outline select-none"
           :style="`color: ${checkTs(selectItem.ts)}`">
        {{ formatTime(selectItem.ts) }}
      </div>
      <div class="spacer"/>
      <button
          @click="itemCanUse.click"
          class="fe-btn fe-btn_iic"
          :disabled="itemCanUse.disabled">
        {{ itemCanUse.text }}
      </button>
    </div>
    <!--    {{ selectItem }}-->
    <!--    {{ itemData }}-->
    {{ itemUseInfo }}
  </div>
</template>

