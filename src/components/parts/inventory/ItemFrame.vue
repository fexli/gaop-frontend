<script setup lang="ts">
import global_const from "../../../utils/global_const";
import formatter from "../../../utils/formatter";
import FeImg from "../../element/FeImg.vue";

const props = defineProps({
  itemId: String,
  count: {
    type: [Number, String],
    default: 0
  },
  content: String,
  ts: {
    type: Number,
    default: -1
  },
  consume: Boolean,
  clicker: Function,
  fontSize: {
    type: [Number, String],
    default: "0.875rem"
  },
  fontOverlay: {
    type: Boolean,
    default: false
  },
})

function handleClicker() {
  console.log("handleClicker", props)
  if (props.clicker != undefined) {
    props.clicker({
      itemId: props.itemId,
      count: props.count,
      content: props.content,
      consume: props.consume,
      ts: props.ts
    })
  }
}
const isValid = computed(()=>{
  return global_const.gameData.itemData[props.itemId || ""] != null
})
</script>
<template>
  <div class="card rounded-xl" v-if="isValid && count !== 0 && global_const.gameData.itemData[itemId].sortId >= -10">
    <FeImg
        :src="global_const.assetServer+'items/'+global_const.gameData.itemData[itemId]['iconId']+'.png'"
        class="item-image"
    />
    <p class="item-content" v-if="content != null">{{ content }}</p>
    <p class="item-count" v-if="count > 0">{{ count }}</p>
    <p class="item-time" v-if="ts !== -1">{{ formatter.formatConsumeTime(ts) }}</p>
    <div
        :style="`font-size: ${fontSize};`"
        :class="fontOverlay ? 'bg-base-200 bg-opacity-40' : ''"
        class="select-none px-3 w-full h-full z-10 transition-opacity opacity-0 hover:opacity-100 flex absolute left-0 top-0 justify-center items-center text-center"
        @click="handleClicker"
    >
      {{ global_const.gameData.itemData[itemId].name }}
    </div>
  </div>
</template>

<style lang="sass">
.item-image
  position: relative
  width: 100%
  height: 100%

//.item-clicker
//  position: absolute
//  width: 120px
//  height: 120px

.item-count
  color: white
  position: absolute
  right: 12px
  bottom: 12px
  background-color: rgba(0, 0, 0, .6)
  padding: 2.5px 5px
  margin: 0

.item-content
  color: white
  position: absolute
  right: 12px
  bottom: 40px
  background-color: rgba(0, 0, 0, .6)
  padding: 2.5px 5px
  margin: 0

.item-time
  color: white
  position: absolute
  left: 0
  bottom: 12px
  background-color: rgba(0, 0, 0, .6)
  padding: 2.5px 5px
  margin: 0
</style>
