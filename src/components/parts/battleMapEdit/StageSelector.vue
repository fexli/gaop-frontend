<template>
  <div class="flex w-full gap-1">
    <div class="ss-map-select">
      <div class="flex items-center mt-0.5">
        <span class="text-primary font-bold overflow-hidden whitespace-nowrap">关卡列表</span>
        <SettingTextInput width="w-32" placeholder="关卡检索..." padding="pl-1" :settings="data" field="filterStr"/>
        <div class="spacer"/>
        <SettingToggle :settings="data" field="showAll" enable-text="" disable-text="" padding="">
          <template #extra>
            <span class="text-primary font-bold overflow-hidden whitespace-nowrap">{{ data['showAll'] ? '全部' : '可攻' }}</span>
          </template>
        </SettingToggle>
      </div>
      <draggable
          class="ss-map-inner"
          v-if="filterCanShow.length < 200"
          :component-data="{
            type:'transition-group',
          }"
          v-bind="dragOptions"
          :list="filterCanShow"
          :sort="false"
          :group="{ name: 'people', pull:'clone', put: false }"
          @change="log"
          :onStart="checkStageStart"
          :onEnd="checkStageEnd"
          @start="drag = true"
          @end="drag = false"
          item-key="id"
      >
        <template #item="{ element }">
          <StageInfo
              :inventory="inventory"
              :addable="addToRight"
              :info="element"
          />
        </template>
      </draggable>
      <div v-else class="ss-map-inner text-center text-warning flex flex-col justify-center items-center">
        <div>筛选数据量过大(当前：{{ filterCanShow.length }}条）</div>
        <div>请先进行关卡检索</div>
      </div>
    </div>

    <div class="ss-map-select">
      <div class="flex items-center mt-0.5">
        <span class="text-primary font-bold">选择列表</span>
      </div>
      <draggable
          class="ss-map-inner"
          :component-data="{
            type:'transition-group',
          }"
          v-bind="dragOptions"
          :list="list2"
          :group="{name:'people',put:canRightPut}"
          @change="log"
          @start="drag = true"
          @end="drag = false"
          item-key="name"
      >
        <template #item="{ element }">
          <StageInfo
              :inventory="inventory"
              :index="checkRightIndex(element)" :removable="removeFromRight" :info="element"
              :settings="list2" :apply-change="uploadChange" :has-times="hasTimes"
          />
        </template>
      </draggable>
    </div>
  </div>
</template>

<script setup>
import draggable from "vuedraggable";
import global_const from "../../../utils/global_const";
import StageInfo from "./StageInfo.vue";
import SettingTextInput from "../settings/SettingTextInput.vue";
import SettingToggle from "../settings/SettingToggle.vue";
import {BattleMapWithTimes} from "../../../utils/autoBattleMapProc";

defineComponent(draggable)

const dragOptions = computed(() => {
      return {
        animation: 200,
        group: "description",
        disabled: false,
        ghostClass: "ghost"
      };
    }
)

const data = ref({
  filterStr: "",
  showAll: false,
})

const props = defineProps({
  settings: {
    type: Object,
    default: {},
  },
  fieldMap: {
    type: String,
    default: "",
  },
  fieldMapT: {
    type: String,
    default: "",
  },
  hasIndex: {
    type: Boolean,
    default: false,
  },
  hasTimes: {
    type: Boolean,
    default: false,
  },
  needApply: {
    type: Boolean,
    default: false,
  },
  inventory: {
    type: Object,
    default: {},
  },
})
const item = ref([])

const drag = ref(false)
const list2 = ref([])
const canRightPut = ref(true)

const rightIndex = ref(0)
let rightIndexResetTimeout = null;

const stageTypes = {
  MAIN: '主线',
  SUB: '主线S',
  SPECIAL_STORY: '故事',
  ACTIVITY: '活动',
  GUIDE: '教程',
  DAILY: '资源',
  CAMPAIGN: '剿灭',
}
const diffGrpInfo = {
  EASY: "(剧情)",
  NORMAL: "(标准)",
  TOUGH: "(磨难)",
  ALL: "(剧情关)",
  NONE: "",
}

function log(evt) {
  window.console.log(evt);
  uploadChange()
}

const filterCanShow = computed(() => {
  return [...item.value].filter(item => {
    let r = item.canAdd || data.value.showAll
    let filterStr = data.value.filterStr.toLowerCase()
    if (filterStr) {
      return r && (item.name.includes(filterStr) || item.code.toLowerCase().includes(filterStr) || item.id.includes(filterStr) || item.dropInfo.some(drop => drop.name.includes(filterStr)))
    }
    return r
  })
})

function checkStageStart(el) {
  console.log("start", el)
  let dragItem = filterCanShow.value[el.oldIndex]
  // 如果右边已经有了，就不允许放置
  canRightPut.value = (!list2.value.some(item => item.id === dragItem.id)) // && dragItem.canAdd
}

function addToRight(i) {
  console.log("addToRight", i)
  if (list2.value.some(item => item.id === i.id)) {
    return
  }
  if (!i.canAdd) {
    return
  }
  let newItem = {...i}
  newItem.times = 1
  if (rightIndexResetTimeout != null) {
    console.log("not Null", rightIndex.value)
    clearTimeout(rightIndexResetTimeout)
    // split
    list2.value = [...list2.value.splice(0, rightIndex.value), newItem, ...list2.value]
    rightIndex.value++
    rightIndexResetTimeout = setTimeout(() => {
      rightIndexResetTimeout = null
      rightIndex.value = 0
    }, 5000)
  } else {
    list2.value = [newItem, ...list2.value]
    rightIndex.value = 1
    rightIndexResetTimeout = setTimeout(() => {
      rightIndexResetTimeout = null
      rightIndex.value = 0
    }, 5000)
  }
  uploadChange()
}

function removeFromRight(i) {
  console.log("removeFromRight", i)
  list2.value.splice(list2.value.findIndex(item => item.id === i.id), 1)
  uploadChange()
}

function checkStageEnd(el) {
  canRightPut.value = true
}

function checkRightIndex(el) {
  if (props.hasIndex) {
    return list2.value.findIndex(item => item.id === el.id)
  }
  return -1
}

function checkStage(stageInfo, stageId) {
  if (stageId == null || stageInfo[stageId] == null) {
    return undefined
  }
  let isHard = false
  if (stageId.indexOf('#f#') !== -1) {
    isHard = true
  }
  let items = []

  for (let it of stageInfo[stageId]['stageDropInfo']['displayRewards']) {
    if (it['dropType'] === 2 || it['dropType'] === 3) {
      items.push({
        id: it.id,
        name: (global_const.gameData.itemData[it.id] && global_const.gameData.itemData[it.id].name) || ""
      })
    }
  }
  return {
    id: stageId,
    info: stageInfo[stageId],
    dropInfo: items.reverse(),
    code: (isHard ? '突袭' : '') + stageInfo[stageId].code,
    stageType: (stageTypes[stageInfo[stageId].stageType] || stageInfo[stageId].stageType) + (stageInfo[stageId].stageType === 'MAIN' ? diffGrpInfo[stageInfo[stageId]['diffGroup']] || "" : ""),
    apCost: stageInfo[stageId].apCost || 0,
    name: stageInfo[stageId].name || '*未知关卡代号*',
    isHard: isHard,
    canAdd: !isHard && !(stageInfo[stageId].stageType === 'GUIDE') && !(stageInfo[stageId].stageType === 'CAMPAIGN') && ((stageInfo[stageId].apCost || 0) > 0),
    times: 1
  }
}

function initStage() {
  let stageInfo = global_const.gameData.stageTable['stages']
  if (stageInfo == null) {
    return
  }
  for (let stageId in stageInfo) {
    // eslint-disable-next-line no-prototype-builtins
    if (!stageInfo.hasOwnProperty(stageId)) {
      continue
    }
    item.value.push(checkStage(stageInfo, stageId))
  }
}

function initSelected(v) {
  let stageInfo = global_const.gameData.stageTable['stages']
  if (stageInfo == null) {
    return
  }
  list2.value = []
  for (let i = 0; i < v.length; i++) {
    let et
    if (props.hasTimes) {
      et = checkStage(stageInfo, v[i].Map)
      if (!et) {
        continue
      }
      et.times = v[i].Times
    } else {
      et = checkStage(stageInfo, v[i])
      if (!et) {
        continue
      }
    }
    list2.value.push(et)
  }
}

function uploadChange() {
  if (props.hasTimes) {
    props.settings[props.fieldMapT] = list2.value.map(item => {
      let r = new BattleMapWithTimes()
      r.Map = item.id
      r.Times = item.times || 1
      return r
    })
  } else {
    props.settings[props.fieldMap] = list2.value.map(item => item.id)
  }
}

onMounted(() => {
  initStage() // 初始化关卡列表
  initSelected(props.settings[props.hasTimes ? props.fieldMapT : props.fieldMap]) // 初始化已选关卡
  watch(() => props.hasTimes, (v) => {
    initSelected(v ? props.settings[props.fieldMapT] : props.settings[props.fieldMap])
  })
})
</script>
<style lang="sass">
.ss-map-select
  @apply border border-base-content w-1/2 px-1 py-0.5 rounded-md
  max-height: 28.25rem
  height: 28.25rem

.ss-map-inner
  @apply overflow-auto overflow-x-hidden
  height: calc(100% - 1.5rem)
</style>