<script setup lang="ts">
import formatter from "../../../utils/formatter";
import global_const from "../../../utils/global_const";
import FeImg from "../../element/FeImg.vue";

const props = defineProps({
  selectItem: {
    type: Object,
    default: {}
  },
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
</script>
<template>
  <div class="rounded-xl px-3 py-1 max-w-[40%] min-w-[22.5rem] absolute bg-base-200">
    <div class="font-bold text-sm font-mono">
      -#-ITEM-DETAIL-#- >> {{ global_const.gameData.itemData[selectItem.itemId].iconId }}
    </div>
    <div class="flex">
      <div>
        <div class="text-2xl font-bold mb-1">
          {{ global_const.gameData.itemData[selectItem.itemId].name }} - 库存 {{
            selectItem.count
          }}{{ selectItem.content ? '(' + selectItem.content + ')' : '' }}
        </div>
        <div class="text-sm">
          {{ global_const.gameData.itemData[selectItem.itemId].usage }}
        </div>
        <div class="text-sm text-base-content/70">
          {{ global_const.gameData.itemData[selectItem.itemId].description }}
        </div>
      </div>
      <div class="mx-6 self-center">
        <FeImg
            style="height: 100px;width: 100px;"
            :src="'http://mc.mesord.com:8999/items/'+global_const.gameData.itemData[selectItem.itemId].iconId+'.png'"/>

      </div>
    </div>
    <div class="my-2 flex gap-x-1">
      <div class="badge badge-md badge-outline select-none" style="color: #bb4fff">
        {{
          global_const.itemTypes[global_const.gameData.itemData[selectItem.itemId].itemType] || global_const.gameData.itemData[selectItem.itemId].itemType
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
    </div>
<!--    {{ selectItem }}-->
  </div>
</template>

