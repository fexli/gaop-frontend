<script setup lang="ts">
import draggable from "vuedraggable";
import SettingTextInput from "../settings/SettingTextInput.vue";
import SettingToggle from "../settings/SettingToggle.vue";
import global_const from "../../../utils/global_const";
import {Ref} from "vue";
import CharInfo from "./CharInfo.vue";
import {
  ItemBasedCtx,
  ManagedCharTrainingElite,
  ManagedCharTrainingInfo,
  ManagedCharTrainingSkill,
  ManagedSkillTarget
} from "../../../utils/autoBattleMapProc";
import ItemInfo from "./ItemInfo.vue";


const props = defineProps({
  settings: {
    type: Object,
    default: {},
  },
  field: {
    type: String,
    default: "",
  },
  inventory: {
    type: Object,
    default: {},
  },
  status: {
    type: Object,
    default: {},
  }
})

const data = ref({
  filterStr: "",
})

const drag = ref(false)
const canRightPut = ref(true)
const item: Ref<Record<string, any>[]> = ref([])
const list2: Ref<any[]> = ref([])

const dragOptions = computed(() => {
      return {
        animation: 200,
        group: "description",
        disabled: false,
        ghostClass: "ghost"
      };
    }
)

const filterCanShow = computed(() => {
  return [...item.value].filter(item => {
    let filterStr = data.value.filterStr.toLowerCase()
    if (filterStr) {
      return (item.name.includes(filterStr) || item.id.toLowerCase().includes(filterStr))
    }
    return true
  })
})

function log(evt: any) {
  window.console.log(evt);
  uploadChange()
}

function checkStageStart(el: any) {
  console.log("start", el)
  let dragItem = filterCanShow.value[el.oldIndex]
  canRightPut.value = (!list2.value.some((item: any) => item.id === dragItem.id))
}

function checkStageEnd(el: any) {
  canRightPut.value = true
}

function removeFromRight(i: any) {
  list2.value.splice(list2.value.findIndex(item => item.id === i.id), 1)
  uploadChange()
}

function addToRight(i: any) {
  console.log("addToRight", i)
  list2.value.push({...i})
  uploadChange()
}

function uploadChange() {
  console.log("uploadChange", list2.value)
  let chs = [] as Array<ItemBasedCtx>
  for (let i = 0; i < list2.value.length; i++) {
    let item = list2.value[i]
    if (item.cnt && item.cnt > 0) {
      let el = new ItemBasedCtx()
      el.id = item.id
      el.count = item.cnt
      chs.push(el)
    }
  }
  props.settings[props.field] = chs
}

function checkItem(item: Record<string, any>) {
  item.id = item.itemId
  item.cnt = item.cnt == null ? 1 : item.cnt
  return item
}

function initItems() {
  for (let key in global_const.gameData.itemData) {
    let _item = global_const.gameData.itemData[key]
    if (!_item || _item.sortId < 0) {
      continue
    }
    item.value.push(checkItem(_item))
  }
}

function initSelected() {
  let itemData = global_const.gameData.itemData
  if (itemData == null) {
    return
  }
  list2.value = []
  let charMngMap = {} as Record<string, any>
  for (let i = 0; i < (props.settings[props.field] || []).length; i++) {
    console.log("initItems", props.settings[props.field][i])
    let curItem = props.settings[props.field][i]
    if (itemData[curItem.id] == null) {
      continue
    }
    if (charMngMap[curItem.id] == null) {
      charMngMap[curItem.id] = itemData[curItem.id]
      charMngMap[curItem.id].cnt = curItem.count == null ? 1 : curItem.count
    }
    console.log("initItems", curItem)
  }
  console.log("after", charMngMap)
  for (let key in charMngMap) {
    list2.value.push(checkItem(charMngMap[key]))
  }
}

onMounted(() => {
  initItems()
  initSelected()
})
</script>
<template>
  <div class="flex w-full gap-1">
    <div class="ss-map-select">
      <div class="flex items-center mt-0.5">
        <span class="text-primary font-bold">干员列表</span>
        <SettingTextInput placeholder="干员检索..." padding="pl-1" :settings="data" field="filterStr"/>
      </div>
      <draggable
          class="ss-map-inner flex flex-wrap gap-1 content-start pt-1"
          v-if="filterCanShow.length < 30"
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
          <ItemInfo
              :addable="addToRight" :info="element"
              :inventory="inventory"
              :status="status"
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
          class="ss-map-inner space-y-1 pt-1"
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
          <ItemInfo
              :inventory="inventory"
              :status="status"
              detailed :info="element"
              :removable="removeFromRight"
              :apply-change="uploadChange"
          />
        </template>
      </draggable>
    </div>
  </div>
</template>

<style lang="sass">
.cs-outer
  height: calc(100% - 3.25rem)
</style>