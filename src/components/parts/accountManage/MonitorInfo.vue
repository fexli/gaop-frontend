<script setup lang="ts">

import {defineProps} from "vue";
import global_const from "../../../utils/global_const";
import FeImg from "../../element/FeImg.vue";
import LogTextCtx from "./LogTextCtx.vue";
import formatter from "../../../utils/formatter";

const props = defineProps({
  data: {
    type: Object,
  },
})

const apColor = computed(() => {
  if (!props.data?.maxAp) {
    return "text-gray-400"
  }
  let maxAp = (props.data?.maxAp) as number
  if ((props.data?.curAp || 0) < maxAp * .5) {
    return "text-success"
  } else if ((props.data?.curAp || 0) < maxAp * .8) {
    return "text-warning"
  } else {
    return "text-error"
  }
})

const campColor = computed(() => {
  if (!props.data?.campMax) {
    return "text-gray-400"
  }
  let maxCamp = (props.data?.campMax) as number
  if (maxCamp - (props.data?.campCurrent || 0) < 200) {
    return "text-success"
  } else if (props.data?.campCurrent) {
    return "text-warning"
  } else {
    return "text-error"
  }
})
</script>
<template>
  <div class="card w-60 bg-base-200 p-2 rounded-xl">
    <div class="flex gap-x-3 items-center">
      <FeImg
          :class="data.maxAp ? 'ring-success':'ring-error'"
          class="hidden md:flex w-16 h-16 ring-2 rounded-md"
          :src="global_const.assetServer+'avatar/'+(data.avatar.type ? data.avatar.type.replace('ICON','DEFAULT') : 'DEFAULT')+'/'+(data.avatar.id ? data.avatar.id.replace('@','_').replace('#','_'): 'avatar_def_01')+'.png'"
      />
      <div>
        <div
            class="text-2xl overflow-hidden h-8 whitespace-nowrap overflow-ellipsis w-36 font-bold"
            :class="data.nick ? '' : 'text-gray-600'"
        >
          {{ data.nick ? 'Dr.' + data.nick : data.name }}
        </div>
        <div class="text-sm text-gray-500 overflow-hidden h-6 whitespace-nowrap overflow-ellipsis w-36 -mt-1">
          {{ data.name }}
          / {{ data.account }}
        </div>
        <div class="text-sm text-gray-500 overflow-hidden h-6 whitespace-nowrap overflow-ellipsis w-36 -mt-2">
          {{ global_const.platformSelector.find((e) => e.value === data.platform)?.text || '未知' }}
          / LV.{{ data.level }}
        </div>
      </div>
    </div>
    <div class="mt-1 text-xl">
      <div class="flex justify-between">
        <div>状态</div>
        <div :style="`color: ${global_const.statusType[data.status.toString()]}`">
          {{ data.statusText }}
        </div>
      </div>
      <div class="flex justify-between">
        <div>当前理智</div>
        <div :class="apColor">
          {{ data.curAp ? data.curAp : '-' }} / {{ data.maxAp ? data.maxAp : '-' }}
        </div>
      </div>
      <div class="flex justify-between">
        <div>剿灭合成玉</div>
        <div :class="campColor">
          {{ data.campCurrent ? data.campCurrent : data.campMax ? '0' : '-' }} / {{ data.campMax ? data.campMax : '-' }}
        </div>
      </div>
      <div class="flex justify-between">
        <div>日常任务</div>
        <div :class="data.maxAp ? data.dayTask ? 'text-warning':'text-success':'text-gray-600'">
          {{ data.maxAp ? data.dayTask ? '未完成' : '已完成' : '-' }}
        </div>
      </div>
      <div class="flex justify-between">
        <div>周常任务</div>
        <div :class="data.maxAp ? data.weekTask ? 'text-warning':'text-success':'text-gray-600'">
          {{ data.maxAp ? data.weekTask ? '未完成' : '已完成' : '-' }}
        </div>
      </div>
      <div class="flex justify-between">
        <div>公招可刷新</div>
        <div :class="data.maxAp ? data.recruit ? 'text-warning':'text-success':'text-gray-600'">
          {{ data.maxAp ? data.recruit + '次' : '-' }}
        </div>
      </div>
    </div>
  </div>
</template>

