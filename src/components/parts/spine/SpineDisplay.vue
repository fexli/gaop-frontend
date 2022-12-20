<template>
  <div class="card bg-base-300 overflow-visible">
    <div class="card-body flex flex-row">
      <canvas
          @mousedown="canvasMouseDown"
          @mouseup="canvasMouseUp"
          @mousemove="canvasMouseMove"
          :onmousewheel="canvasScroll"
          ref="canvas" width="750" height="750" class="h-80 w-80 ring-1 ring-primary rounded-xl"/>
      <div class="flex flex-col ml-2">
        <Select
            :disabled="recording"
            class="my-0 mr-0 mb-3"
            :value="currentSettings.mode"
            :list="settingMode"
            @valueSelect="(v)=>currentSettings.mode = v"
        />
        <div class="w-full h-[0.075rem] bg-primary mb-3"></div>
        <div v-if="currentSettings.mode === '1'">
          <template v-if="!customSpineSetting.is_loaded">
            <div class="form-control w-full">
              <input type="file" @change="changeCustomSkel" multiple
                     :disabled="recording"
                     class="file-input file-input-xs file-input-primary file-input-bordered w-full"/>
              <label class="label -my-1">
                <span class="label-text-alt">Skel文件</span>
                <span class="label-text-alt">{{ customSkel.status }} {{ customSkel.name }}</span>
              </label>
              <label class="label -my-1">
                <span class="label-text-alt">Atlas文件</span>
                <span class="label-text-alt">{{ customAtlas.status }}{{ customAtlas.name }}</span>
              </label>
              <label class="label -my-1">
                <span class="label-text-alt">Texture文件</span>
                <span class="label-text-alt">{{ customTexture.status }}({{ customTexture.cnt }})</span>
              </label>
            </div>
            <div class="flex mb-3">
              <button @click="loadSpineCustom" class="btn btn-xs btn-primary mr-3">加载</button>
            </div>
          </template>
          <template v-else>
            <div class="mb-3">模型已装载{{ customSkel.name }}</div>
            <Select
                class="my-0 mr-0 mb-3"
                :disabled="recording"
                :value="currentSettings.ani"
                :list="animationsDetail"
                item-text="name"
                item-value="name"
                @valueSelect="onSelectAni"
            />
            <div class="flex mb-3">
              <button
                  @click="unloadSpineCustom" :disabled="recording"
                  class="btn btn-xs btn-primary mr-3">卸载
              </button>
            </div>
          </template>
        </div>
        <div v-else>
          <div class="flex w-full">
            <SettingTextInput
                :disabled="recording"
                :settings="currentSettings"
                placeholder="检索名称"
                field="charSearch"
                width="w-20"
                padding="p-0 -mt-[0.1rem]"
            />
            <Select
                :disabled="recording"
                width="w-[11.5rem]"
                class="my-0 mr-0 mb-3"
                :value="currentSettings.char"
                :list="filterCharIds"
                @valueSelect="onSelectChar"
            />
          </div>
          <Select
              :disabled="recording"
              class="my-0 mr-0 mb-3"
              :value="currentSettings.skin"
              :list="charSkins"
              @valueSelect="onSelectSkin"
          />
          <Select
              :disabled="recording"
              class="my-0 mr-0 mb-3"
              :value="currentSettings.model"
              :list="charModels"
              @valueSelect="onSelectModel"
          />
          <Select
              :disabled="recording"
              class="my-0 mr-0 mb-3"
              :value="currentSettings.ani"
              :list="animationsDetail"
              item-text="name"
              item-value="name"
              @valueSelect="onSelectAni"
          />
        </div>
        <div class="w-full h-[0.075rem] bg-primary mb-3"></div>
        <div class="flex">
          <div title="Change Color" class="dropdown dropdown-right dropdown-top w-20">
            <label tabindex="0" :style="`background-color: ${currentSettings.color}`"
                   class="gap-1 normal-case mr-2 rounded-md p-0.5 px-1" style="font-size: 15px">
              {{ currentSettings.color || "点我设置" }}
            </label>
            <div
                class="dropdown-content bg-base-200 text-base-content rounded-t-box rounded-b-box top-px mt-10 w-36 overflow-visible shadow-lg">
              <ColorPicker
                  @changeColor="onChangeColor"
                  class="fixed -mt-40" :sucker-hide="true" theme="light"
                  :color="currentSettings.color"
              />
            </div>
          </div>
          <SettingToggle
              :disabled="recording"
              :settings="currentSettings"
              enable-text="循环"
              disable-text="单次"
              field="loop"
              padding="p-0 pl-3 pb-3"
              text-class="text-primary"
          />
          <SettingToggle
              :disabled="recording"
              :settings="currentSettings"
              enable-text="调试"
              disable-text="常规"
              field="debug"
              padding="p-0 pl-3 pb-3"
              text-class="text-primary"
          />
        </div>
        <input
            :disabled="recording"
            type="range" :min="0.1" :max="7"
            v-model="currentSettings.scale"
            class="range range-sm range-primary" :step="0.1"
        />
        <div class="w-full flex justify-between text-xs px-2 mb-2">
          <span>播放速度: {{ currentSettings.scale }}x</span>
          <span>|</span>
        </div>
        <div class="flex items-center">
          <button :disabled="recording" @click="record" class="btn btn-xs btn-primary mr-3">导出GIF</button>
          <div class="dropdown dropdown-hover dropdown-left dropdown-top">
            <button :disabled="recording" class="btn btn-xs btn-primary mr-3">查看动画数据</button>
            <div
                class="dropdown-content bg-base-200 text-base-content ring-1 ring-primary rounded-t-box rounded-b-box -mb-5 overflow-visible shadow-lg">
              <table class="m-2 table table-zebra table-compact">
                <thead>
                <tr>
                  <th class="lh-.2">名称</th>
                  <th class="lh-.2">时长</th>
                  <th class="lh-.2">帧数(30fps)</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="ani in animationsDetail" :key="ani.name">
                  <td class="lh-.2">{{ ani.name }}</td>
                  <td class="lh-.2">{{ ani.duration.toFixed(3) }}s</td>
                  <td class="lh-.2">{{ Math.round(ani.duration * 30) }}</td>
                </tr>
                </tbody>
              </table>
            </div>
          </div>
          <button :disabled="recording" @click="resetModel" class="btn btn-xs btn-primary">重置模型</button>
        </div>
      </div>
    </div>
    <div
        v-if="recording"
        class="flex flex-col items-center justify-center left-0 top-0 z-40 absolute w-full h-full bg-base-300 bg-opacity-40 rounded-xl"
    >
      <div v-if="recordLoadAnim" class="loading-spinner mb-8">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
      <div class="ml-5 text-title text-3xl font-mono font-bold">{{ recordInfo }}</div>
    </div>
    <!--    <div>{{ animationsDetail }}</div>-->
    <!--    <div>{{ animations }}</div>-->
  </div>
</template>
<script setup lang="ts">
import {computed, onMounted, ref} from 'vue'
import {Spine} from "../../../utils/spine";
import global_const, {getXHR} from "../../../utils/global_const";
import Select from "../../element/Select.vue";
import SettingToggle from "../settings/SettingToggle.vue";
import {ColorPicker} from "vue-color-kit";
import SettingTextInput from "../settings/SettingTextInput.vue";

interface States {
  skel: string
  pngs: string[]
  atlas: string[]
}

const props = defineProps({
  prefix: String,
  name: String,
})

const canvas = ref<HTMLCanvasElement>()
let spineRef: { spine?: Spine } = {}
const spineSumms = ref<Record<string, Record<string, Record<string, States>>>>({})
const charIds = ref<{ key: any, value: string }[]>([])
const filterCharIds = computed(() => {
  return charIds.value.filter((item) => {
    return item.key.includes(currentSettings.value.charSearch)
  })
})
const onSkinLoad = ref(false)
const charSkins = computed(() => {
  return Object.keys(spineSumms.value[currentSettings.value.char] || {}).map((key) => {
    return onSkinLoad.value ? {
      key: findSkinName(key),
      value: key
    } : {key, value: key}
  })
})

const findSkinName = (key: string) => {
  let refName = ""
  let realName = ""
  if (key.startsWith('build')) {
    refName = "[基建]"
    key = key.replace('build_', '')
  }
  key = key.replace("#", '_').replace('@', '_')
  for (let skin in global_const.gameData.skinTable.charSkins) {
    if (skin.replace("#", '_').replace('@', '_') === key) {
      realName = global_const.gameData.skinTable.charSkins[skin]?.displaySkin.skinName || findTokenName(key) || skin.substring(skin.lastIndexOf('_') + 1)
    }
  }
  if (realName === "") {
    if (key == currentSettings.value.char) {
      return refName + "默认"
    }
    realName = key
  }
  return refName + realName
}

const findTokenName = (key: string) => {
  if (!key.startsWith('token')) {
    return ""
  }
  for (let skin in global_const.gameData.skinTable.charSkins) {
    for (let token of (global_const.gameData.skinTable.charSkins[skin].tokenSkinMap || [])) {
      if (token.tokenSkinId.replace("#", '_').replace('@', '_') === key) {
        return global_const.gameData.skinTable.charSkins[skin]?.displaySkin.skinName
      }
    }
  }
}
const modelNamed: Record<string, any> = {
  Spine: "模型",
  Front: "正面",
  Back: "背面",
}
const charModels = computed(() => {
  return Object.keys((spineSumms.value[currentSettings.value.char] || {})[currentSettings.value.skin] || {}).map((key) => {
    return {
      key: modelNamed[key] || key,
      value: key
    }
  })
})
const customSpineSetting = ref({
  latest_name: '',
  is_loaded: false,
})
const customSkel = ref({
  blob: "",
  name: "",
  status: "未选定",
  ok: false,
})
const customAtlas = ref({
  blob: "",
  name: "",
  status: "未选定",
  ok: false,
})
const customTexture = ref({
  blob: "",
  name: "",
  status: "未加载",
  cnt: 0,
  ok: false,
})
const changeCustomSkel = (e: any) => {
  for (let i = 0; i < e.target.files.length; i++) {
    let file = e.target.files[i];
    // create a blob URL representing the file's data
    let url = URL.createObjectURL(file);
    spineRef.spine?.setURI(file.name, url)
    console.log("changeCustomSkel", file, url)
    if (file.name.endsWith(".skel")) {
      customSkel.value.blob = file
      customSkel.value.name = file.name
      customSkel.value.status = "已选定"
      customSkel.value.ok = true
      continue
    }
    if (file.name.endsWith(".atlas") || file.name.endsWith(".atlas.txt")) {
      customAtlas.value.blob = url
      customAtlas.value.name = file.name
      customAtlas.value.status = "已选定"
      customAtlas.value.ok = true
      continue
    }
    if (file.name.endsWith(".png") || file.name.endsWith(".jpg")) {
      customTexture.value.blob = url
      customTexture.value.name = file.name
      customTexture.value.status = "已加载"
      customTexture.value.cnt += 1
      customTexture.value.ok = true
      continue
    }
  }
}
const unloadSpineCustom = () => {
  spineRef.spine?.play("")
  customSpineSetting.value.is_loaded = false
}

async function loadSpineCustom() {
  if (!customSkel.value.ok || !customAtlas.value.ok || !customTexture.value.ok) {
    return
  }
  customSpineSetting.value.latest_name = `custom-${customSkel.value.name}-${customTexture.value.name}-${new Date().getTime()}`
  const {skeleton, state: animationState} = await spineRef.spine!.load(
      customSpineSetting.value.latest_name,
      customSkel.value.name,
      customAtlas.value.name,
      {
        x: canvasTrans.value.x,
        y: canvasTrans.value.y,
        scale: canvasTrans.value.scale,
      },
  )
  const names = (animations.value = skeleton.data.animations.map(
      (v: any) => v.name,
  ))
  animationsDetail.value = skeleton.data.animations.map((v: any) => ({
    name: v.name,
    duration: v.duration,
  }))
  spineRef.spine!.play(customSpineSetting.value.latest_name)
  animationState.setAnimation(0, names[0], currentSettings.value.loop)
  currentSettings.value.ani = names[0]
  animationState.timeScale = currentSettings.value.scale
  customSpineSetting.value.is_loaded = true

}

const canvasMouseDown = (e: MouseEvent) => {
  canvasTrans.value.dragging = true
  canvasTrans.value.prevX = e.clientX
  canvasTrans.value.prevY = e.clientY
}
const canvasMouseUp = (e: MouseEvent) => {
  canvasTrans.value.dragging = false
}
const canvasMouseMove = (e: MouseEvent) => {
  if (canvasTrans.value.dragging) {
    let revoke_x = e.clientX - canvasTrans.value.prevX
    let revoke_y = e.clientY - canvasTrans.value.prevY
    canvasTrans.value.prevX = e.clientX
    canvasTrans.value.prevY = e.clientY
    canvasTrans.value.x -= (revoke_x * (75 / 32) * (1 / canvasTrans.value.scale))
    canvasTrans.value.y += (revoke_y * (75 / 32) * (1 / canvasTrans.value.scale))
    spineRef.spine?.move(canvasTrans.value.x, canvasTrans.value.y)

  }
}

const canvasScroll = function (e: any) {
  console.log("canvasScroll", e)
  e.preventDefault()
  if (e.deltaY < 0) {
    canvasTrans.value.scale += 0.1
  } else {
    canvasTrans.value.scale -= 0.1
  }
  spineRef.spine?.scale(canvasTrans.value.scale)
}
const resetModel = () => {
  canvasTrans.value.x = -380
  canvasTrans.value.y = -150
  canvasTrans.value.scale = 1
  spineRef.spine?.transform(-380, -150, 1)
}

const canvasTrans = ref({
  dragging: false,
  prevX: 0,
  prevY: 0,
  x: -300,
  y: -150,
  scale: 1,
})

const isLoading = ref(true)
const recordLoadAnim = ref(false)
const recordInfo = ref("")
const currentSettings = ref({
  mode: '0', // 0=model 1=custom
  debug: false,
  charSearch: '',
  char: '',
  skin: '',
  model: '',
  ani: '',
  loop: false,
  color: '#00000000',
  scale: 1,
})

const settingMode = [
  {key: "干员模型", value: '0'},
  {key: "自定义模型", value: '1'},
]

const animations = ref<string[]>([])
const animationsDetail = ref<{ name: string; duration: number }[]>([])

async function load() {
  isLoading.value = true
  const path = global_const.assetServer + 'spine/' + currentSettings.value.char + '/' + currentSettings.value.skin + '/' + currentSettings.value.model
  let skelData = ((spineSumms.value[currentSettings.value.char] || {})[currentSettings.value.skin] || {})[currentSettings.value.model]
  if (!skelData) {
    console.log("load", "skelData not found")
    return
  }
  console.log("load path", path)
  const {skeleton, state: animationState} = await spineRef.spine!.load(
      `${currentSettings.value.char}-${currentSettings.value.skin}-${currentSettings.value.model}`,
      `${path}/${skelData.skel}`,
      `${path}/${skelData.atlas[0]}`,
      {
        x: canvasTrans.value.x,
        y: canvasTrans.value.y,
        scale: canvasTrans.value.scale,
      },
  )
  const names = (animations.value = skeleton.data.animations.map(
      (v: any) => v.name,
  ))
  animationsDetail.value = skeleton.data.animations.map((v: any) => ({
    name: v.name,
    duration: v.duration,
  }))
  isLoading.value = false
  spineRef.spine!.play(`${currentSettings.value.char}-${currentSettings.value.skin}-${currentSettings.value.model}`)
  animationState.setAnimation(0, names[0], currentSettings.value.loop)
  currentSettings.value.ani = names[0]
  animationState.timeScale = currentSettings.value.scale
}

watch(() => currentSettings.value.char, (val) => {
  if (!val.startsWith("token"))
    currentSettings.value.skin = val
})

watch(() => currentSettings.value.skin, (val) => {
  currentSettings.value.model = Object.keys((spineSumms.value[currentSettings.value.char] || {})[val] || {})[0]
})


onMounted(() => {
  //@ts-ignore
  HTMLCanvasElement.prototype.getContext = function (origFn) {
    return function (type, attributes) {
      if (type === 'webgl' || type === 'webgl2') {
        attributes = Object.assign({}, attributes, {
          preserveDrawingBuffer: true,
        });
      }
      //@ts-ignore
      return origFn.call(this, type, attributes);
    };
  }(HTMLCanvasElement.prototype.getContext);
  console.warn('canvas', canvas.value)
  if (!canvas.value) {
    return
  }
  spineRef.spine = new Spine(canvas.value)
  getXHR(global_const.assetServer + "spine/summary.json").then((res: any) => {
    console.log("XHR", res)
    spineSumms.value = res
    global_const.onGameDataLoaded("characterData", () => {
      charIds.value = (Object.keys(res).map((v) => {
        let chr = global_const.gameData.characterData[v]
        if (chr == null) {
          return {
            key: v,
            value: v,
          }
        } else {
          return {
            key: `${chr.rarity + 1}星|${global_const.profNick[chr.profession] || '未知'}|${chr.name}`,
            sortId: -chr.rarity,
            value: v,
          }
        }

      }) || []).sort((a, b) => {
        if (a.sortId == null) {
          return 1
        }
        if (b.sortId == null) {
          return -1
        }
        return a.sortId - b.sortId
      })
      currentSettings.value.char = charIds.value[0].value
      currentSettings.value.skin = currentSettings.value.char
      currentSettings.value.model = Object.keys(res[currentSettings.value.char][currentSettings.value.char])[0]
      load()
    })
    global_const.onGameDataLoaded("skinTable", () => {
      onSkinLoad.value = true
    })
  })
  watch(() => charSkins.value, (val) => {
    if (currentSettings.value.char.startsWith("token"))
      onSelectSkin(val[0].value)
  })
})

function onSelectChar(e: string) {
  currentSettings.value.char = e
  console.log("onSelectChar", e)
  setTimeout(() => {
    load()
  }, 400)
}

function onSelectSkin(e: string) {
  currentSettings.value.skin = e
  console.log("onSelectSkin", e)
  setTimeout(() => {
    load()
  }, 400)
}

function onSelectModel(e: string) {
  currentSettings.value.model = e
  console.log("onSelectModel", e)
  setTimeout(() => {
    load()
  }, 400)
}

function onSelectAni(e: string) {
  currentSettings.value.ani = e
  const cur = spineRef.spine?.getCurrent()
  if (cur) {
    console.log('ani change', cur)
    cur.state.setAnimation(0, e, currentSettings.value.loop)
    cur.state.timeScale = currentSettings.value.scale
  }
}

watch(() => currentSettings.value.loop, (val) => {
  const state = spineRef.spine?.getCurrent()?.state
  if (!state) {
    return
  }
  state.setAnimation(0, state.tracks[0]?.animation?.name || '', val)
})

watch(() => currentSettings.value.debug, (val) => {
  if (spineRef.spine) {
    spineRef.spine.debug = val
  }
})

function onChangeColor(e: any) {
  currentSettings.value.color = e.hex
  if (!spineRef.spine) {
    return
  }
  console.log(e)
  spineRef.spine.bg = [
    e.rgba.r / 255,
    e.rgba.g / 255,
    e.rgba.b / 255,
    e.rgba.a,
  ]
}

watch(() => currentSettings.value.scale, (val) => {
  const state = spineRef.spine?.getCurrent()?.state
  if (!state) {
    return
  }
  state.timeScale = val
})

function reset() {
  spineRef.spine?.transform(-500, -200, 1)
}

const recording = ref(false)

async function record() {
  if (!spineRef.spine || recording.value) {
    return
  }
  recording.value = true
  if (currentSettings.value.mode === '0') {
    await spineRef.spine.record(
        currentSettings.value.ani,
        `${currentSettings.value.char}-${currentSettings.value.skin}-${currentSettings.value.model}.gif`,
        recordInfo, recordLoadAnim
    )
  } else if (currentSettings.value.mode === '1') {
    await spineRef.spine.record(
        currentSettings.value.ani,
        `${customSkel.value.name.replace('.skel', '')}-${currentSettings.value.ani}.gif`,
        recordInfo, recordLoadAnim
    )
  }
  setTimeout(() => {
    recording.value = false
    recordLoadAnim.value = false
  }, 1000)
}
</script>
<style lang="sass">
.lh-\.2
  line-height: .2rem
</style>