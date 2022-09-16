<script setup lang="ts">
import draggable from "vuedraggable";
import SettingTextInput from "../settings/SettingTextInput.vue";
import SettingToggle from "../settings/SettingToggle.vue";
import global_const from "../../../utils/global_const";
import {Ref} from "vue";
import CharInfo from "./CharInfo.vue";
import {ManagedCharTrainingInfo, ManagedSkillTarget} from "../../../utils/autoBattleMapProc";


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
    if (item.hasEl && item.eliteLevel > 0) {
      let el = new ManagedCharTrainingInfo()
      el.CharId = item.id
      el.TrainType = 'e'
      el.EliteTo = item.eliteLevel
      chs.push(el)
    }
    if (item.hasSkill) {
      let el = new ManagedCharTrainingInfo()
      el.CharId = item.id
      el.TrainType = 's'
      for (let j = 0; j < item.skillInfo.total; j++) {
        if (item['skill_' + j]) {
          let el2 = new ManagedSkillTarget()
          el2.SkillId = j + 1
          el2.Target = item['skill_' + j]
          el.SkillTarget.push(el2)
        }
      }
      if (el.SkillTarget.length > 0) {
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
  for (let i = 0; i < props.settings[props.field].length; i++) {
    let curChar = props.settings[props.field][i]
    if (charData[curChar.CharId] == null) {
      continue
    }
    if (charMngMap[curChar.CharId] == null) {
      charMngMap[curChar.CharId] = checkChar(curChar.CharId, charData[curChar.CharId])
    }
    console.log("initCHar", curChar)
    switch (curChar.TrainType) {
      case 'e':
        charMngMap[curChar.CharId].elite = true
        charMngMap[curChar.CharId].hasEl = true
        charMngMap[curChar.CharId].eliteLevel = curChar.EliteTo
        console.log("initCHar E", curChar.CharId, charMngMap)
        break
      case 's':
        charMngMap[curChar.CharId].skill = true
        charMngMap[curChar.CharId].hasSkill = true
        for (let j = 0; j < curChar.SkillTarget.length; j++) {
          charMngMap[curChar.CharId]['skill_' + (curChar.SkillTarget[j].SkillId - 1)] = curChar.SkillTarget[j].Target
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