<script setup lang="ts">

import JsonView from "../../element/JsonView.vue";
import {Ref} from "vue";
import {accountStore} from "../../../store/account";
import {storeToRefs} from "pinia";
import {useTranslate} from "../../../hooks/translate";
import global_const from "../../../utils/global_const";
import {useToast} from "../../../hooks/toast";
import {getGameInfoGSP, getGameUserCustomAll} from "../../../plugins/axios";
import FileSaver from "file-saver";

const account = accountStore();
const {accountInfo,webUserInfo} = storeToRefs(account)
const {translate} = useTranslate();
const {showMessage} = useToast()
const onGameDataShow: Ref = ref(true)
const gsPosterData = ref({})
const filterJsonStr: Ref = ref("")
const props = defineProps({
  gameUserName: String,
  gamePlatform: Number,
})

function refreshJsonView(show: boolean = false) {
  onGameDataShow.value = false
  nextTick(() => {
    onGameDataShow.value = true
    if (show)
      showMessage("game.anal.action.ref_gd", 2000, "success")
  })
}

function getAllGameDataJson() {
  getGameUserCustomAll(props.gameUserName as string, props.gamePlatform as number).then((res: any) => {
    console.log("getGameUserCustomAll", res)
    account.setAccountInfo(props.gameUserName as string, props.gamePlatform as number, res.data)
    showMessage("game.anal.action.getall_success", 2000, "success")
    refreshJsonView()
  }).catch((err: any) => {
    console.log("getGameUserCustomAll Err", err)
    showMessage("game.anal.action.getall_err", 2000, "danger")
  })
}

function getAllGameServerPosterJson() {
  getGameInfoGSP(props.gameUserName as string, props.gamePlatform as number).then((res: any) => {
    console.log("getAllGameServerPosterJson", res)
    gsPosterData.value = res.data
    showMessage("game.anal.action.getall_success_gsp", 2000, "success")
  }).catch((err: any) => {
    console.log("getAllGameServerPosterJson Err", err)
    showMessage("game.anal.action.getall_err_gsp", 2000, "danger")
  })
}

function saveGameDataJson() {
  const blob = new Blob([JSON.stringify(accountInfo.value[global_const.getUserLogName(props.gameUserName || "", props.gamePlatform as number)])], {type: "application/json;charset=utf-8"})
  FileSaver.saveAs(blob, `userGameData_${props.gameUserName}_${props.gamePlatform}.json`)
}

function saveGameServerPosterJson() {
  const blob = new Blob([JSON.stringify(gsPosterData.value)], {type: "application/json;charset=utf-8"})
  FileSaver.saveAs(blob, `userGameServerPoster_${props.gameUserName}_${props.gamePlatform}.json`)
}

const tryFilterJson = computed(() => {
  let fs = filterJsonStr.value.split(".")
  let gd = accountInfo.value[global_const.getUserLogName(props.gameUserName || "", props.gamePlatform as number)]
  if (filterJsonStr.value.length === 0) {
    return [gd, true] // direct return game data
  }
  let rst: Record<string, any> = {}
  let cur = rst
  let clo: boolean[] = []
  for (let i = 0; i < fs.length; i++) {
    if (gd[fs[i]] === undefined) {
      if (i === 0) {
        return [gd, true]
      }
      cur[fs[i - 1]] = gd
      clo.push(false)
      return [rst, clo]
    }
    if (i >= 1) {
      cur = cur[fs[i - 1]]
      clo.push(false)
    }
    gd = gd[fs[i]]
    if (i === fs.length - 1) {
      cur[fs[i]] = gd
    } else {
      cur[fs[i]] = {} as Record<string, any>
    }
  }
  clo.push(false)
  return [rst, clo]
})
</script>
<template>
  <div>
    <div class="flex card border-primary border w-full mt-2 p-2" v-if="webUserInfo.ul === 3">
      <div class="flex gap-1 justify-center items-center">
        <h1 class="card-title">Game Data/游戏元数据</h1>
        <div class="spacer"></div>
        <fieldset class="space-y-1">
          <div class="relative">
            <span class="absolute inset-y-0 left-0 flex items-center pl-2">
              <button type="button" title="search" class="p-1 transition-all"
                      :class="filterJsonStr === '' ? 'text-primary':'text-violet-400'">
                <svg fill="currentColor" viewBox="0 0 512 512" class="w-4 h-4">
                  <path
                      d="M479.6,399.716l-81.084-81.084-62.368-25.767A175.014,175.014,0,0,0,368,192c0-97.047-78.953-176-176-176S16,94.953,16,192,94.953,368,192,368a175.034,175.034,0,0,0,101.619-32.377l25.7,62.2L400.4,478.911a56,56,0,1,0,79.2-79.195ZM48,192c0-79.4,64.6-144,144-144s144,64.6,144,144S271.4,336,192,336,48,271.4,48,192ZM456.971,456.284a24.028,24.028,0,0,1-33.942,0l-76.572-76.572-23.894-57.835L380.4,345.771l76.573,76.572A24.028,24.028,0,0,1,456.971,456.284Z"></path>
                </svg>
              </button>
            </span>
            <input
                v-model="filterJsonStr" type="search" name="Search" placeholder="路径查询..."
                class="w-32 py-1 pl-10 text-sm rounded-xl sm:w-auto border border-primary focus:outline-none bg-base-200 text-primary focus:text-violet-400 focus:bg-base-300 focus:border-violet-400 transition-all duration-300"
            >
          </div>
        </fieldset>
        <div class="spacer"></div>
        <button @click="refreshJsonView(true)" class="fe-btn fe-btn_dft">{{
            translate("game.anal.btn.refresh")
          }}
        </button>
        <button @click="getAllGameDataJson" class="fe-btn fe-btn_dft">{{ translate("game.anal.btn.get_all") }}</button>
        <button @click="saveGameDataJson" class="fe-btn fe-btn_dft">{{ translate("game.anal.btn.dump") }}</button>
      </div>
      <JsonView
          style="margin-top: 10px"
          v-if="onGameDataShow"
          :json="tryFilterJson[0]"
          :closed="tryFilterJson[1]"
      />
    </div>
    <div class="flex card border-primary border w-full mt-2 p-2" v-if="webUserInfo.ul === 3">
      <div class="flex gap-1 justify-center items-center">
        <h1 class="card-title">Game Server Poster/用户-服务器传递数据</h1>
        <div class="spacer"></div>
        <button @click="getAllGameServerPosterJson" class="fe-btn fe-btn_dft">{{
            translate("game.anal.btn.get")
          }}
        </button>
        <button @click="saveGameServerPosterJson" class="fe-btn fe-btn_dft">{{
            translate("game.anal.btn.dump")
          }}
        </button>
      </div>
      <JsonView style="margin-top: 10px" :json="gsPosterData"/>
    </div>
  </div>
</template>

