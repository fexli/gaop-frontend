<script setup lang="ts">
import {defineProps, Ref} from "vue";
import {getMonitorInfos} from "../../../plugins/axios";
import MonitorInfo from "./MonitorInfo.vue";
import formatter from "../../../utils/formatter";

const props = defineProps({
  watching: {
    type: Boolean,
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

const currentData: Ref<Array<any>> = ref([])
const isError: Ref<boolean> = ref(false)

const lastSyncTs: Ref<number> = ref(0)
const autoFreshTimeout: Ref<any> = ref(null)
const keepingBgGrTimeout: Ref<any> = ref(null)
const keepingBgGrPct: Ref<number> = ref(0)

function calcNext() {
  keepingBgGrPct.value = ((Date.now() - lastSyncTs.value) / 300000) * 100
  if (keepingBgGrTimeout.value) {
    clearTimeout(keepingBgGrTimeout.value)
  }
  keepingBgGrTimeout.value = setTimeout(() => {
    calcNext()
  }, 100)
}

function tryRefreshData() {
  if (props.watching) {
    refreshData()
  }
}

function refreshData() {
  getMonitorInfos().then((suc: any) => {
    console.log("getMonitorInfos refreshData", suc)
    currentData.value = suc.msg
    isError.value = false
    lastSyncTs.value = Date.now()
    // calcNext()
  }).catch((err: any) => {
    console.log("getMonitorInfos refreshData Err", err)
    isError.value = true
  })
  if (autoFreshTimeout.value) {
    clearTimeout(autoFreshTimeout.value)
  }
  autoFreshTimeout.value = setTimeout(() => {
    tryRefreshData()
  }, 1000 * 60 * 5)
}

watch(() => props.watching, (val) => {
  console.log("watching", val)
  if (!val) {
    return
  }
  refreshData()
})
onMounted(() => {
  console.log("mounted")
  refreshData()
})
onUnmounted(() => {
  console.log("unmounted")
})
</script>
<template>
  <div>
    <div
        :style="`background-image: linear-gradient(to right, hsl(var(--p)) ${keepingBgGrPct-2}%, hsl(var(--b2)) ${keepingBgGrPct+2}%);`"
        class="alert shadow-lg text-white p-1 px-3 rounded-xl transition-all mt-1"
    >
      <div>
        <svg
            xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
            class="stroke-current flex-shrink-0 w-6 h-6 text-info"
        >
          <path
              stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          ></path>
        </svg>
        <span>上次刷新时间为{{ formatter.formatDate(lastSyncTs) }}</span>
      </div>
    </div>
    <div class="w-full h-fit flex flex-wrap justify-between gap-y-1 mt-1">
      <template v-for="(i,k) of currentData" v-bind:key="k">
        <MonitorInfo
            :data="i"
            :is-simple="isSimple"
            :start-func="startFunc"
            :stop-func="stopFunc"
            :restart-func="restartFunc"
        />
      </template>
    </div>
  </div>
</template>

