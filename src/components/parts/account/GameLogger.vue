<script setup lang="ts">
import {accountStore} from "../../../store/account";
import {storeToRefs} from "pinia";
import global_const from "../../../utils/global_const";
import formatter from "../../../utils/formatter";
import LogTextCtx from "../accountManage/LogTextCtx.vue";
import {Ref} from "vue";

const account = accountStore();
const {loggerStore} = storeToRefs(account)
const props = defineProps({
  gameUserName: String,
  gamePlatform: Number,
})

const filterLogStr: Ref = ref("")
const filterLevel: Ref = ref(0)

const gameUserID = computed(() => {
  return global_const.getUserLogName(props.gameUserName as string, props.gamePlatform as number)
})

function asDisplay(log: any) {
  let result = ""
  if (!log) {
    return result
  }
  if (log.log !== "") {
    result += log.log
  }
  if (log.inner && log.inner.length) {
    result += log.inner.map((i: any) => {
      return asDisplay(i)
    }).join("")
  }
  return result
}

const computeLogInfo = computed(() => {
  let data = [...loggerStore.value[gameUserID.value]['logs']] as any[]
  data = data.filter((item) => {
    return filterLevel.value === 0 || item.level === filterLevel.value
  })
  if (filterLogStr.value !== "") {
    data = data.filter((item: any) => {
      return asDisplay(item.info).includes(filterLogStr.value)
    })
  }
  return data.reverse()
})
</script>
<template>
  <div class="rounded-xl bg-base-200 w-full p-2">
    <div class="flex gap-2 h-8">
      <select v-model="filterLevel" class="fe-select h-7 mt-[1px]">
        <option :value="0" :selected="'' === filterLevel.value">不过滤</option>
        <template v-for="(i,k) of global_const.loggerLvlType">
          <option :value="parseInt(k)" :selected="i.name === filterLevel.value">{{
              i.name_cn
            }}
          </option>
        </template>
      </select>
      <fieldset class="space-y-1">
        <div class="relative">
            <span class="absolute inset-y-0 left-0 flex items-center pl-2">
              <button type="button" title="search" class="p-1 transition-all"
                      :class="filterLogStr === '' ? 'text-primary':'text-violet-400'">
                <svg fill="currentColor" viewBox="0 0 512 512" class="w-4 h-4">
                  <path
                      d="M479.6,399.716l-81.084-81.084-62.368-25.767A175.014,175.014,0,0,0,368,192c0-97.047-78.953-176-176-176S16,94.953,16,192,94.953,368,192,368a175.034,175.034,0,0,0,101.619-32.377l25.7,62.2L400.4,478.911a56,56,0,1,0,79.2-79.195ZM48,192c0-79.4,64.6-144,144-144s144,64.6,144,144S271.4,336,192,336,48,271.4,48,192ZM456.971,456.284a24.028,24.028,0,0,1-33.942,0l-76.572-76.572-23.894-57.835L380.4,345.771l76.573,76.572A24.028,24.028,0,0,1,456.971,456.284Z"></path>
                </svg>
              </button>
            </span>
          <input
              v-model="filterLogStr" type="search" name="Search" placeholder="日志查询..."
              class="w-32 py-1 pl-10 text-sm rounded-xl sm:w-auto border border-primary focus:outline-none bg-base-200 text-primary focus:text-violet-400 focus:bg-base-300 focus:border-violet-400 transition-all duration-300"
          >
        </div>
      </fieldset>
      <div class="spacer"/>
      <!--      <button @click="saveLogs" class="fe-btn">导出日志</button>-->
    </div>
    <template v-for="(i,k) of computeLogInfo">
      <div class="flex">
        <span class="text-blue-500 font-sans whitespace-nowrap">[{{
            formatter.formatDate(i['ts'] * 1000, "MM-dd HH:mm:ss")
          }}]</span>
        <span class="ml-1 flex font-sans whitespace-nowrap"
              :style="'color: '+global_const.loggerLvlType[i.level].color">
          [
          <svg class="w-5 h-5 -mx-0.5 mt-[0.2rem]" stroke="currentColor" fill="currentColor" viewBox="0 0 24 24">
            <path stroke-width="0.3" :d="global_const.mdiPath[global_const.loggerLvlType[i.level].icon]"/>
          </svg>
          ]
        </span>
        <LogTextCtx
            class="ml-1"
            v-if="i.info"
            :color="i.info.color"
            :log="i.info.log"
            :inner="i.info.inner"
            :prev-color="i.info.color"
        />
      </div>
    </template>
  </div>
</template>

