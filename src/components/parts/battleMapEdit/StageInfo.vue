<script setup lang="ts">
import ItemFrame from "../inventory/ItemFrame.vue";
import global_const from "../../../utils/global_const";
import {PropType} from "vue";
import SettingTextInput from "../settings/SettingTextInput.vue";

const props = defineProps({
  info: {
    type: Object as PropType<Record<any, any>>,
    default: {},
  },
  removable: {
    type: Function,
    default: undefined,
  },
  hasLessDrop: {
    type: Boolean,
    default: false,
  },
  addable: {
    type: Function,
    default: undefined,
  },
  withTimes: {
    type: Boolean,
    default: false,
  },
  index: {
    type: Number,
    default: -1,
  },
  settings: {
    type: Object,
    default: [],
  },
  applyChange: {
    type: Function,
    default: () => {
    },
  },
  hasTimes: {
    type: Boolean,
    default: false,
  },
  hasNeedTimes: {
    type: Boolean,
    default: false,
  },
  inventory: {
    type: Object,
    default: {},
  },
})
const minDropCnt = computed(() => {
  return Math.min(...props.info.dropInfo.map((item: any) => {
    if (!item.isMainDrop) return 999999999
    return props.inventory[item.id] == undefined ? 999999999 : Math.max(0, props.inventory[item.id])
  }))
})
watch(() => props.info.times, (value) => {
  props.applyChange()
})
watch(() => props.info.needT, (value) => {
  props.applyChange()
})
</script>
<template>
  <div
      class="relative p-1 rounded-md border-base-content border my-1 w-full h-fit flex bg-base-200 items-center gap-1">
    <div class="font-bold text-xl absolute top-1" v-if="index > -1">[{{ index + 1 }}]</div>
    <div
        class="text-info text-3xl font-bold -rotate-12 si-text"
        :class="(hasTimes || hasNeedTimes || index > -1)? 'pt-4' : ''"
    >{{ info['code'] }}
    </div>
    <SettingTextInput
        v-if="hasTimes"
        :settings="info" field="times" title="次" number-only :number-min="0" padding="p-0"
        class="font-bold text-xl absolute top-1" width="w-10" text-class="-ml-1"
    ></SettingTextInput>
    <SettingTextInput
        v-else-if="hasNeedTimes"
        :settings="info" field="needT" title="次" number-only :number-min="0" padding="p-0"
        class="font-bold text-xl absolute top-1" width="w-10" text-class="-ml-1"
    ></SettingTextInput>
    <!--    <div class="font-bold text-xl absolute top-1" v-if="info['times']">{{ info['times'] }}次</div>-->
    <div class="text-primary text-sm font-bold">
      <div>id：{{ info['id'] }}</div>
      <div>名称：{{ info['name'] }}</div>
      <div>类型：{{ info['stageType'] }}</div>
      <div>理智消耗：{{ info['apCost'] }}</div>
    </div>
    <div
        v-if="hasNeedTimes" class="text-sm absolute bottom-1">(余{{ info.times }}次)
    </div>
    <div class="h-full w-fit absolute right-0 flex items-center">
      <div
          class="w-fit h-fit flex si-box transition-all duration-200 hover:mr-2"
          :class="info.dropInfo.length > 4 ? 'mr-7' : 'mr-5'"
      >
        <template v-for="i of info.dropInfo">
          <ItemFrame
              class="w-16 h-16 si-ctx"
              count-x="0" count-is-left count-y="0"
              font-overlay
              :class="(info.dropInfo.length > 4 ? '-mx-7' : '-mx-5') + (!hasLessDrop || inventory[i.id] === minDropCnt ? '' : ' grayscale opacity-20 hover:opacity-100')"
              :item-id="i.id" :count="inventory[i.id] || -1"
          />
        </template>
      </div>
      <div class="mr-1 flex flex-col h-full py-1 justify-between">
        <div>
          <svg v-if="!info.canAdd" style="width:24px;height:24px" viewBox="0 0 24 24">
            <path fill="currentColor" :d="global_const.mdiPath['lock-alert-outline']"/>
          </svg>
          <svg v-else-if="info.dropInfo.length === 0" style="width:24px;height:24px" viewBox="0 0 24 24">
            <path fill="currentColor" :d="global_const.mdiPath['gift-off-outline']"/>
          </svg>
          <svg v-else-if="!info.info['canBattleReplay']" style="width:24px;height:24px" viewBox="0 0 24 24">
            <path fill="currentColor" :d="global_const.mdiPath['video-off-outline']"/>
          </svg>
        </div>
        <div class="flex flex-col gap-1">
          <button v-if="addable != null" @click="addable(info)" class="btn btn-circle btn-xs btn-outline">
            <svg class="h-6 w-6" viewBox="0 0 24 24">
              <path fill="currentColor" d="M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z"/>
            </svg>
          </button>
          <button v-if="removable != null" @click="removable(info)" class="btn btn-circle btn-xs btn-outline">
            <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="sass">
.si-ctx
  @apply transition-all duration-200

.si-box:hover .si-ctx
  @apply -mx-2

.si-text
  @apply text-center
  min-width: 5rem

</style>