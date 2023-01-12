<template>
  <div v-if="true">
    <aside-bar/>
    <nav-bar/>
    <div
        class="main"
    >
      <div
          class="h-full w-full fixed top-0 left-0 z-0"
          :style="`background: url('../${background}');background-size: cover;background-position: center;`"
      />
      <div class="w-full mb-7 pt-[4.25rem] px-4 z-30">
        <router-view/>
      </div>
    </div>
  </div>
  <div class="overlay pointer-events-none">
    <TransitionOverlay :show="announceShow">
      <div class="pointer-events-auto card bg-base-300 m-3 rounded-xl">
        <div class="card-title rounded-t-xl px-5 pt-2"
             :style="`background: linear-gradient(135deg,${announce['titleBar']} 0, ${announce['titleBar']} 25%, transparent 25%, transparent 50%,${announce['titleBar']} 50%, ${announce['titleBar']} 75%, transparent 75%, transparent);background-size: 30px 30px;background-position-x: ${annBgX}px`"
        >
          <span class="text-xl">{{ announce.title }}</span>
        </div>
        <div class="text-primary px-5 text-sm">
          [服务器公告 v{{ announce.version }}]
        </div>
        <div class="whitespace-pre-wrap px-5 text-lg max-w-md">
          {{ announce.info }}
        </div>
        <div class="card-actions flex m-3">
          <div class="spacer"/>
          <button class="btn btn-sm btn-primary" @click="close_announce()">确定</button>
        </div>
      </div>
    </TransitionOverlay>
  </div>
  <AssetLoading :finished="onFinished"/>
</template>
<script lang="ts" setup>
import {appStore} from "../../store/app";
import {storeToRefs} from "pinia/dist/pinia";
import NavBar from "./default/NavBar.vue";
import AsideBar from "./default/AsideBar.vue";
import Translate from "./default/nav/Translate.vue";
import AssetLoading from "../parts/global/AssetLoading.vue";
import TransitionOverlay from "../element/TransitionOverlay.vue";
import {apiGetAnnounce} from "../../plugins/axios";
import {announceStore} from "../../store/announce";
import {Ref} from "vue";

const _app = appStore()
const annStore = announceStore()
const {background} = storeToRefs(_app)

const reloadBG = ref(true);
const fin = ref(false);
const buf = ref(0);
const val = ref(0);
const txt = ref('少女祈祷中');
const dot = ref('');
const ovl = ref(true);
const showDrawer = ref(true);


const annBgX = ref(0)
const annBgXTimeout = ref(0)
const announceShow: Ref<boolean> = ref(false)
const announce = ref({
  title: '服务器公告',
  titleBar: '#2890bb',
  version: '1.0.0',
  info: '服务器公告内容'
})

function onFinished() {
  console.log("finished")
  check_announce()
}

function close_announce() {
  if (annBgXTimeout.value !== 0) {
    clearInterval(annBgXTimeout.value)
  }
  announceShow.value = false
}

function show_announce() {
  console.log("show announce by this.announce", announce.value)
  annBgXTimeout.value = Number(setInterval(() => {
    annBgX.value += 1
    if (annBgX.value >= 30) {
      annBgX.value = 0
    }
  }, 75))
  setTimeout(() => {
    announceShow.value = true
  }, 10)
}

function check_announce() {
  apiGetAnnounce().then((res: any) => {
    console.log("check announce res:", res)
    if (res.data != null) {
      if (annStore.version === res.data.version || res.data.version === 0) {
        return
      }
      annStore.setAnnounceVersion(res.data.version)
      announce.value = res.data
      show_announce()
    }
  }).catch(err => {
    console.log("check announce err:", err)
  })
}
</script>

<style lang="sass" scoped>
.page-wrapper
  min-height: calc(100vh - 112px - 48px)

</style>
