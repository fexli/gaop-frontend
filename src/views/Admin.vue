<script setup lang="ts">

import {apiGetAnnounce, apiPostAnnounce} from "../plugins/axios";
import {ColorPicker} from "vue-color-kit";
import {useToast} from "../hooks/toast";

const {showMessage} = useToast()
const announce = ref({
  title: '服务器公告',
  titleBar: '#8837FC9E',
  version: '1.0.0',
  info: '服务器公告内容'
})

onMounted(() => {
  apiGetAnnounce().then((res: any) => {
    console.log("check announce res:", res)
    if (res.data != null) {
      announce.value = res.data
    }
  }).catch(err => {
    console.log("check announce err:", err)
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
    showMessage("admin.announce.success", 2000, "success")

  }).catch(err => {
    console.log("updateAnnounce err:", err)
    showMessage("admin.announce.error", 2000, "danger", err.msg)
  })
}
</script>
<template>
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
      <h1>Admin</h1>
    </div>
  </div>
</template>

