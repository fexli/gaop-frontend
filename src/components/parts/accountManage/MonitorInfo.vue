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
  isSimple: {
    type: Boolean,
    default: false
  },
  startFunc: {
    type: Function,
  },
  stopFunc: {
    type: Function,
  },
  restartFunc: {
    type: Function,
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

const dayTaskColor = computed(() => {
  return defaultColor(props.data?.maxAp, !props.data?.dayTask)
})

const weekTaskColor = computed(() => {
  return defaultColor(props.data?.maxAp, !props.data?.weekTask)
})

const recruitColor = computed(() => {
  return defaultColor(props.data?.maxAp, props.data?.recruitMax - props.data?.recruit > 0)
})
const defaultColor = function (exist: boolean, isOk: boolean): string {
  if (!exist) {
    return "text-gray-400"
  }
  if (isOk) {
    return "text-success"
  } else {
    return "text-error"
  }
}

const defaultClassIsErr = function (checker: string): string {
  return checker === 'text-error' ? 'text-error' : ''
}

</script>
<template>
  <div class="card w-[15.5rem] bg-base-200 p-2 rounded-xl transition-all">
    <div class="flex gap-x-3 items-center">
      <FeImg
          :class="data.maxAp ? 'ring-success':'ring-error'"
          class="hidden md:flex w-16 h-16 ring-2 rounded-md"
          :src="global_const.getAssetServer()+'avatar/'+(data.avatar.type ? data.avatar.type.replace('ICON','DEFAULT') : 'DEFAULT')+'/'+(data.avatar.id ? data.avatar.id.replace('@','_').replace('#','_'): 'avatar_def_01')+'.png'"
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
      <div class="flex relative"
           :class="isSimple ? 'justify-center rounded-md bg-base-100 mb-1 px-1' : 'justify-between'">
        <div v-if="!isSimple">状态</div>
        <div :style="`color: ${global_const.statusType[data.status.toString()]}`">
          {{ data.statusText }}
        </div>
        <template v-if="isSimple">
          <button @click="startFunc && startFunc(data)" v-if="data.status === 0" class="mi-stat-btn">
            <svg class="w-4 h-4" viewBox="0 0 24 24">
              <path fill="currentColor" d="M5,5V19H8V5M10,5V19L21,12"/>
            </svg>
          </button>
          <button @click="stopFunc && stopFunc(data)" v-else-if="data.status === 2" class="mi-stat-btn">
            <svg class="w-4 h-4" viewBox="0 0 24 24">
              <path fill="currentColor" d="M18,18H6V6H18V18Z"/>
            </svg>
          </button>
          <button @click="restartFunc && restartFunc(data)" v-else-if="data.status === 3" class="mi-stat-btn">
            <svg class="w-4 h-4" viewBox="0 0 24 24">
              <path fill="currentColor"
                    d="M12,4C14.1,4 16.1,4.8 17.6,6.3C20.7,9.4 20.7,14.5 17.6,17.6C15.8,19.5 13.3,20.2 10.9,19.9L11.4,17.9C13.1,18.1 14.9,17.5 16.2,16.2C18.5,13.9 18.5,10.1 16.2,7.7C15.1,6.6 13.5,6 12,6V10.6L7,5.6L12,0.6V4M6.3,17.6C3.7,15 3.3,11 5.1,7.9L6.6,9.4C5.5,11.6 5.9,14.4 7.8,16.2C8.3,16.7 8.9,17.1 9.6,17.4L9,19.4C8,19 7.1,18.4 6.3,17.6Z"/>
            </svg>
          </button>
        </template>
      </div>
      <div v-if="isSimple" class="flex flex-wrap gap-1">
        <div class="rounded-md bg-base-100 px-1" :class="defaultClassIsErr(apColor)">
          理智 <span :class="apColor">{{ data.curAp ? data.curAp : '-' }}</span>
        </div>
        <div class="rounded-md bg-base-100 px-1" :class="defaultClassIsErr(dayTaskColor)">
          日常 <span :class="dayTaskColor">
          {{ data.maxAp ? data.dayTask ? '×' : '√' : '-' }}
        </span>
        </div>
        <div class="rounded-md bg-base-100 px-1" :class="defaultClassIsErr(weekTaskColor)">
          周常 <span :class="weekTaskColor">
          {{ data.maxAp ? data.weekTask ? '×' : '√' : '-' }}
        </span>
        </div>
        <div class="rounded-md bg-base-100 px-1" :class="defaultClassIsErr(campColor)">
          剿灭余 <span :class="campColor">{{ data.campMax ? data.campMax - data.campCurrent : '-' }}</span>
        </div>
        <div class="rounded-md bg-base-100 px-1" :class="defaultClassIsErr(recruitColor)">
          公招余 <span :class="recruitColor">{{ data.maxAp ? data.recruit : '-' }}</span>
        </div>
        <template v-for="(i,k) of data.exInfos || []" v-bind:key="k">
          <div class="rounded-md bg-base-100 px-1">
            {{ i.name }} <span class="text-success">{{ i.count >= 0 ? i.count : '-' }}</span>
          </div>
        </template>
      </div>
      <template v-else>
        <div class="flex justify-between">
          <div>当前理智</div>
          <div :class="apColor">
            {{ data.curAp ? data.curAp : '-' }} / {{ data.maxAp ? data.maxAp : '-' }}
          </div>
        </div>
        <div class="flex justify-between">
          <div>剿灭合成玉</div>
          <div :class="campColor">
            {{ data.campCurrent ? data.campCurrent : data.campMax ? '0' : '-' }} / {{
              data.campMax ? data.campMax : '-'
            }}
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
        <template v-for="(i,k) of data.exInfos || []" v-bind:key="k">
          <div class="flex justify-between">
            <div>{{ i.name }}</div>
            <div>
              {{ i.count >= 0 ? i.count : '-' }}
            </div>
          </div>
        </template>
      </template>
    </div>
  </div>
</template>

<style lang="sass">
.mi-stat-btn
  @apply btn btn-ghost btn-circle btn-xs mt-0.5 absolute right-0.5
  padding-left: 0
  padding-right: 0
  max-width: 1.5rem
</style>