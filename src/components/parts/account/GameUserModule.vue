<script setup lang="ts">

import {useToast} from "../../../hooks/toast";
import {useTranslate} from "../../../hooks/translate";
import global_const from "../../../utils/global_const";
import {Ref} from "vue";
import {addGameModuleList, getGameModuleList} from "../../../plugins/axios";
import TransitionOverlay from "../../element/TransitionOverlay.vue";
import GameModuleStatus from "../userModule/GameModuleStatus.vue";

const props = defineProps({
  gameUserName: String,
  gamePlatform: Number,
})

const {showMessage} = useToast();

const {translate} = useTranslate();

const userModuleInfo: Ref<Array<any>> = ref([])
const userModuleDetails: Ref<Array<any>> = ref([])
const hasHotUpdate: Ref<boolean> = ref(false)
const enableNewOverlay: Ref<boolean> = ref(false)
const enableNewHash: Ref<string> = ref('')
const loadingEnableNew: Ref<boolean> = ref(false)

function enableNewGameModule() {
  loadingEnableNew.value = true
  let hashes = enableNewHash.value.split("\n")
  console.log("enableNewGameModule", hashes)
  for (let hash of hashes) {
    addGameModuleList(props.gameUserName || '', props.gamePlatform || 0, hash.toLowerCase()).then((res: any) => {
      console.log("addGameModuleList", res)
      showMessage(res.msg, 3000, 'info')
      enableNewOverlay.value = false
      loadingEnableNew.value = false
      fetchGameModuleList()
    }).catch((err: any) => {
      console.log("addGameModuleListErr", err)
      showMessage(err.data.msg, 3000, 'danger')
    })
  }
}

function findModuleDetails(hash: string) {
  for (let module of userModuleDetails.value) {
    if (module.scriptHash === hash) {
      return module
    }
  }
  return null
}


function fetchGameModuleList() {
  getGameModuleList(props.gameUserName || '', props.gamePlatform || 0).then((res: any) => {
    console.log("getGameModuleList", res)
    userModuleInfo.value = res.data.info
    userModuleDetails.value = res.data.details
    hasHotUpdate.value = res.data.hasUpdate
    showMessage(res.msg, 3000, 'success')
  }).catch((err: any) => {
    console.log("getGameModuleListErr", err)
    showMessage(err.data.msg, 3000, 'danger')
  })
}

onMounted(() => {
  fetchGameModuleList()
})
</script>
<template>
  <div>
    <div class="hidden xs:flex shadow-lg h-8 mb-1 rounded-xl bg-warning bg-opacity-80" v-if="hasHotUpdate">
      <div class="w-full flex items-center justify-center ">
        <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current flex-shrink-0 h-6 w-6" fill="none"
             viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
        </svg>
        <div>{{ translate("module.hot_upd") }}</div>
      </div>
    </div>
    <div class="bg-base-200 rounded-xl py-1 px-2">
      <div class="flex items-center bg-base-200 py-2 px-1 font-bold">
        <div class="text-xl ml-2 py-2 nowrap-hidden-ellipsis">{{ translate('module.list_user.title') }}</div>
        <div class="spacer"></div>
        <div class="table-head-btn mr-1" @click="enableNewOverlay = true">
          <svg style="width:24px;height:24px" viewBox="0 0 24 24">
            <path fill="currentColor" :d="global_const.mdiPath['file-document-plus-outline']"/>
          </svg>
          <div class="hidden sm:flex">{{ translate('module.enable_new') }}</div>
        </div>
      </div>
    </div>
    <div v-if="userModuleInfo.length !== 0" class="flex flex-col">
      <template v-for="(i,k) of userModuleInfo" v-bind:key="k">
        <GameModuleStatus
            :game-user-name="gameUserName"
            :game-platform="gamePlatform"
            :module-info="i"
            :module-details="findModuleDetails(i?.scriptHash || '')"
            :fresh="fetchGameModuleList"
            class="mb-1 bg-base-200 py-2 pl-2"
        />
      </template>
    </div>
    <div v-else class="rounded-xl bg-base-200 mt-1 flex justify-center items-center h-16 text-2xl text-secondary">
      这里什么都没有，请先添加模块。
    </div>
    <TransitionOverlay
        :show="enableNewOverlay"
        class="overlay bg-base-200 bg-opacity-50"
    >
      <div class="card w-96 max-w-md rounded-2xl" v-if="enableNewOverlay">
        <div class="absolute right-0 top-0 p-2" @click="enableNewOverlay = false">
          <svg class="w-8 h-8" viewBox="0 0 24 24">
            <path fill="currentColor"
                  d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z"/>
          </svg>
        </div>
        <div class="card-body bg-base-200 rounded-2xl" style="padding: 1rem 2em 2rem 2rem!important;">
          <h2 class="card-title text-primary">{{ translate('module.enable_new') }}</h2>
          <p class="text-primary">{{ translate('module.enable_info') }}</p>

          <div class="relative h-32">
          <textarea
              class="textarea text-neutral textarea-primary bg-gray-100 min-h-[8rem] max-h-32 text-sm w-full px-2 py-1 rounded-xl"
              :placeholder="translate('module.enable_desc')" v-model="enableNewHash"
          ></textarea>
          </div>

          <div class="card-actions flex flex-row justify-center">
            <button @click="enableNewGameModule" :class="loadingEnableNew ? 'loading disabled pl-6':''"
                    class="btn rounded-xl btn-md h-8 btn-primary">
              {{ loadingEnableNew ? '' : translate('module.upload_new') }}
            </button>
          </div>
        </div>
      </div>
    </TransitionOverlay>
  </div>
</template>

