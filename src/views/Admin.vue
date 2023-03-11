<script setup lang="ts">

import {apiGetConfig, apiGetAnnounce, apiPostAnnounce, apiSetConfig} from "../plugins/axios";
import {ColorPicker} from "vue-color-kit";
import {useToast} from "../hooks/toast";
import SettingToggle from "../components/parts/settings/SettingToggle.vue";
import {useTranslate} from "../hooks/translate";

const {translate} = useTranslate()
const {showMessage} = useToast()
const announce = ref({
  title: '服务器公告',
  titleBar: '#8837FC9E',
  version: '1.0.0',
  info: '服务器公告内容'
})
const config = ref({
  login: true,
  battle: true,
  ap_supply: true,
  penguin_report_err: true,
  battle_need_ss: false,
})


function onConfigChange() {
  console.log("onConfigChange", config.value)
  saveConfig()
}

function saveConfig() {
  apiSetConfig(config.value).then((res: any) => {
    console.log("saveConfig res:", res)
    // showMessage("admin_panel.conf_success", 2000, "success")
  }).catch(err => {
    console.log("saveConfig err:", err)
    showMessage("admin_panel.conf_error", 2000, "danger", err.msg)
  })
}

onMounted(() => {
  apiGetAnnounce().then((res: any) => {
    console.log("check announce res:", res)
    if (res.data != null) {
      announce.value = res.data
    }
  }).catch(err => {
    console.log("check announce err:", err)
  })
  apiGetConfig().then((res: any) => {
    console.log("check config res:", res)
    if (res.data != null) {
      config.value = res.data
    }
  }).catch(err => {
    console.log("check config err:", err)
  })
})

function changeRemarkColor(c: any) {
  announce.value.titleBar = c.hex
}

function updateAnnounce() {
  console.log("updateAnnounce", announce.value)
  apiPostAnnounce(announce.value.title, announce.value.titleBar, announce.value.info).then((res: any) => {
    console.log("updateAnnounce res:", res)
    announce.value = res.data
    showMessage("admin_panel.ann_success", 2000, "success")
  }).catch(err => {
    console.log("updateAnnounce err:", err)
    showMessage("admin_panel.ann_error", 2000, "danger", err.msg)
  })
}

</script>
<template>
  <div>
    <div class="w-full flex flex-col md:flex-row gap-1">
      <div class="rounded-xl md:w-1/2 card bg-base-300 bg-opacity-80 px-4 py-2">
        <div class="card-title text-primary">公告修改</div>
        <input
            type="text" placeholder="公告标题" v-model="announce.title"
            class="mt-2 input input-sm input-ghost focus:input-bordered w-full text-2xl"
        />
        <div class="form-control">
          <label class="label">
            <span class="label-text-alt"></span>
            <span class="label-text-alt">当前版本号 Ver.{{ announce.version }}</span>
          </label>
          <textarea
              class="textarea textarea-ghost focus:textarea-bordered h-52 text-xl"
              placeholder="公告内容" v-model="announce.info"
          ></textarea>
        </div>
        <div class="flex items-center gap-2 h-7 mt-2">
          <div>自定义标签颜色</div>
          <div title="Change Color" class="dropdown dropdown-right dropdown-top w-24">
            <label tabindex="0" :style="`background-color: ${announce.titleBar}`"
                   class="gap-1 normal-case mr-2 rounded-md p-0.5 px-1">
              {{ announce.titleBar || "点我设置" }}
            </label>
            <div
                class="dropdown-content bg-base-200 text-base-content rounded-t-box rounded-b-box top-px mt-10 w-36 overflow-visible shadow-lg">
              <ColorPicker
                  class="fixed -mt-40" :sucker-hide="true" theme="light"
                  @changeColor="changeRemarkColor"
                  :color="announce.titleBar"
              />
            </div>
          </div>
          <div class="spacer"/>
          <button @click="updateAnnounce" class="btn btn-sm btn-primary">更新公告</button>
        </div>
      </div>
      <div class="rounded-xl md:w-1/2 bg-base-300 bg-opacity-80 px-4 py-2">
        <div class="card-title text-primary">全局设置（自动保存）</div>
        <SettingToggle
            :settings="config"
            field="login"
            :title="translate('admin_panel.login')"
            @change="onConfigChange"
        />
        <SettingToggle
            :settings="config"
            field="battle"
            :title="translate('admin_panel.battle')"
            @change="onConfigChange"
        />
        <SettingToggle
            :settings="config"
            field="ap_supply"
            :title="translate('admin_panel.ap_supply')"
            @change="onConfigChange"
        />
        <SettingToggle
            :settings="config"
            field="penguin_report_err"
            :title="translate('admin_panel.penguin_report_err')"
            @change="onConfigChange"
        />
        <SettingToggle
            :settings="config"
            field="battle_need_ss"
            :title="translate('admin_panel.battle_ss')"
            @change="onConfigChange"
        />
      </div>
    </div>
    <div class="rounded-xl mt-1 md:w-full bg-base-300 bg-opacity-80 px-4 py-2">
      <h1>Glob HotUpd Here</h1>
    </div>
  </div>
</template>

