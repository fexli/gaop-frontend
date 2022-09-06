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
  clicker: Function
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
</script>
<template>
  <div class="card bg-base-200 rounded-xl" v-if="count !== 0 && global_const.gameData.itemData[itemId].sortId >= -10">
    <FeImg :src="global_const.assetServer+'items/'+global_const.gameData.itemData[itemId].iconId+'.png'"
           class="item-image"
           @click="handleClicker"/>
    <p class="item-content" v-if="content != null">{{ content }}</p>
    <p class="item-count">{{ count }}</p>
    <p class="item-time" v-if="ts !== -1">{{ formatter.formatConsumeTime(ts) }}</p>
  </div>
</template>

<style lang="sass">
.item-image
  position: relative
  width: 120px
  height: 120px

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
  pointer-events: none !important

.item-content
  color: white
  position: absolute
  right: 12px
  bottom: 40px
  background-color: rgba(0, 0, 0, .6)
  padding: 2.5px 5px
  margin: 0
  pointer-events: none !important

.item-time
  color: white
  position: absolute
  left: 0
  bottom: 12px
  background-color: rgba(0, 0, 0, .6)
  padding: 2.5px 5px
  margin: 0
  pointer-events: none !important
</style>
