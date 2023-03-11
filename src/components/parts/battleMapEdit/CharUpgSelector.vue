<script setup lang="ts">
import draggable from "vuedraggable";
import SettingTextInput from "../settings/SettingTextInput.vue";
import SettingToggle from "../settings/SettingToggle.vue";
import global_const from "../../../utils/global_const";
import {Ref} from "vue";
import CharInfo from "./CharInfo.vue";
import {
  ManagedCharTrainingElite,
  ManagedCharTrainingInfo,
  ManagedCharTrainingSkill,
  ManagedSkillTarget
} from "../../../utils/autoBattleMapProc";


const props = defineProps({
  settings: {
    type: Object,
    default: {},
  },
  field: {
    type: String,
    default: "",
  },
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
      return (item.name.includes(filterStr) || item.id.toLowerCase().includes(filterStr) || item.tagList.some((info: string) => info.includes(filterStr)))
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
  list2.value.push({...i})
  uploadChange()
}

function uploadChange() {
  console.log("uploadChange", list2.value)
  let chs = [] as Array<ManagedCharTrainingInfo>
  for (let i = 0; i < list2.value.length; i++) {
    let item = list2.value[i]
    if (item.hasEl && item.eliteLevel > 0 && item.elite) {
      let el = new ManagedCharTrainingInfo()
      el.charId = item.id
      el.trainType = ManagedCharTrainingElite
      el.eliteTo = item.eliteLevel
      chs.push(el)
    }
    if (item.hasSkill && item.skill) {
      let el = new ManagedCharTrainingInfo()
      el.charId = item.id
      el.trainType = ManagedCharTrainingSkill
      for (let j = 0; j < item.skillInfo.total; j++) {
        if (item['skill_' + j]) {
          let el2 = new ManagedSkillTarget()
          el2.skillId = j
          el2.target = item['skill_' + j]
          el.skillTarg.push(el2)
        }
      }
      if (el.skillTarg.length > 0) {
        chs.push(el)
      }
    }
  }
  props.settings[props.field] = chs
}

function checkChar(charId: string, char: any) {
  return {
    id: charId,
    name: char.name,
    tagList: char.tagList,
    profession: global_const.profNick[char.profession] || char.profession,
    skillInfo: {
      total: char.skills.length,
      levels: char.skills.map((skill: any) => skill.levelUpCostCond.length),
    }
  }
}

function initChar() {
  for (let key in global_const.gameData.characterData) {
    let char = global_const.gameData.characterData[key]
    if (!char || char.isNotObtainable || char.profession === 'TRAP' || char.profession === 'TOKEN') {
      continue
    }
    item.value.push(checkChar(key, char))
  }
}

function initSelected() {
  let charData = global_const.gameData.characterData
  if (charData == null) {
    return
  }
  list2.value = []
  let charMngMap = {} as Record<string, any>
  for (let i = 0; i < (props.settings[props.field] || []).length; i++) {
    console.log("initCHar", props.settings[props.field][i])
    let curChar = props.settings[props.field][i]
    if (charData[curChar.charId] == null) {
      continue
    }
    if (charMngMap[curChar.charId] == null) {
      charMngMap[curChar.charId] = checkChar(curChar.charId, charData[curChar.charId])
    }
    console.log("initCHar", curChar)
    switch (curChar.trainType) {
      case ManagedCharTrainingElite:
        charMngMap[curChar.charId].elite = true
        charMngMap[curChar.charId].hasEl = true
        charMngMap[curChar.charId].eliteLevel = curChar.eliteTo
        console.log("initCHar E", curChar.charId, charMngMap)
        break
      case ManagedCharTrainingSkill:
        charMngMap[curChar.charId].skill = true
        charMngMap[curChar.charId].hasSkill = true
        for (let j = 0; j < curChar.skillTarg.length; j++) {
          charMngMap[curChar.charId]['skill_' + (curChar.skillTarg[j].skillId)] = curChar.skillTarg[j].target
        }
        break
    }
  }
  console.log("after", charMngMap)
  for (let key in charMngMap) {
    list2.value.push(charMngMap[key])
  }
}

onMounted(() => {
  initChar()
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
          <CharInfo :addable="addToRight" :info="element"/>
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
          <CharInfo
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