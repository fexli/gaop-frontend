<script setup lang="ts">
import draggable from "vuedraggable";

import global_const from "../../../utils/global_const";
import {onMounted, Ref} from "vue";
import SettingSelect from "./SettingSelect.vue";
import Explain from "../../element/Explain.vue";
import StageSelector from "../battleMapEdit/StageSelector.vue";
import {
  BattleParam,
  bTypeDesc,
  parseSingleBattleParam,
  parseSingleBattleParamToStr,
  parseConditionStr,
} from "../../../utils/autoBattleMapProc";
import {useToast} from "../../../hooks/toast";
import CharUpgSelector from "../battleMapEdit/CharUpgSelector.vue";
import {AutoBattleMapAtkSet, AutoBattleMapSumms} from "../../../utils/autoBattleMapSumms";
import SettingTextInput from "./SettingTextInput.vue";
import JsonView from "../../element/JsonView.vue";
import ItemSelector from "../battleMapEdit/ItemSelector.vue";

const {showMessage} = useToast()

const props = defineProps({
  settings: {
    type: Object,
    default: {},
  },
  field: {
    type: String,
    default: "",
  },
  close: {
    type: Function,
    default: () => {
    },
  },
})

const decisionTypeMap = [
  {
    value: 1,
    label: '招募六星干员',
  },
  {
    value: 2,
    label: '招募五星干员',
  },
  {
    value: 4,
    label: '招募机器人',
  },
  {
    value: 8,
    label: '招募四星干员',
  },
] as Record<string, any>[]

const current = ref(0)
const b1 = ref(false)
const b2 = ref(false)
const b3 = ref(false)
const b4 = ref(false)

watch(()=>current.value, (newVal) => {
  b1.value = (newVal & 1) > 0
  b2.value = (newVal & 2) > 0
  b3.value = (newVal & 4) > 0
  b4.value = (newVal & 8) > 0
})

function resetBattleSetting() {
  console.log("setBattleSetting", props.settings[props.field])
  current.value = props.settings[props.field]
}

function switchCurrent(param: number) {
  current.value ^= param
  console.log("switchCurrent", param, current.value)
}

function confirm() {
  props.settings[props.field] = current.value
  props.close()
}

watch(() => props.settings[props.field], (newVal) => {
  current.value = newVal
})

onMounted(() => {
  resetBattleSetting()
})
</script>
<template>
  <div class="w-80 pl-2 pb-2 p-1 rounded-lg bg-base-200 ring-1 ring-primary">
    <div class="flex items-center">
      <div class="text-primary text-lg font-bold">自动公招选项</div>
      <div class="spacer"/>
      <button class="btn btn-ghost btn-xs" @click="close">
        <svg class="w-6 h-6" viewBox="0 0 24 24">
          <path fill="currentColor" :d="global_const.mdiPath['close']"/>
        </svg>
      </button>
    </div>
    <div class="flex flex-col items-center text-center">
      <div>请在以下公招类型中选择需要招募的类型，请注意：若出现以下类型的同时您未选择招募，则<span style="color: #0098dc">该词条会被保留（不会招募、刷新）</span>
      </div>
      <div class="flex w-full px-1">
        <div class="form-control w-1/2">
          <label class="label justify-start cursor-pointer">
            <input type="checkbox" :checked="b1"
                   class="checkbox checkbox-primary" @click="switchCurrent(decisionTypeMap[0].value)"/>
            <span class="pl-1 label-text">{{ decisionTypeMap[0].label }}</span>
          </label>
        </div>
        <div class="form-control w-1/2">
          <label class="label justify-start cursor-pointer">
            <input
                type="checkbox" :checked="b2" class="checkbox checkbox-primary"
                @click="switchCurrent(decisionTypeMap[1].value)"/>
            <span class="pl-1 label-text">{{ decisionTypeMap[1].label }}</span>
          </label>
        </div>
      </div>
      <div class="flex w-full px-1">
        <div class="form-control w-1/2">
          <label class="label justify-start cursor-pointer">
            <input type="checkbox" :checked="b3"
                   class="checkbox checkbox-primary" @click="switchCurrent(decisionTypeMap[2].value)"/>
            <span class="pl-1 label-text">{{ decisionTypeMap[2].label }}</span>
          </label>
        </div>
        <div class="form-control w-1/2">
          <label class="label justify-start cursor-pointer">
            <input type="checkbox" :checked="b4"
                   class="checkbox checkbox-primary" @click="switchCurrent(decisionTypeMap[3].value)"/>
            <span class="pl-1 label-text">{{ decisionTypeMap[3].label }}</span>
          </label>
        </div>
      </div>
      <div class="flex gap-x-3 justify-end">
        <button class="btn btn-sm btn-primary" @click="confirm">确定</button>
        <button @click="close" class="btn btn-sm btn-ghost">取消</button>
      </div>
    </div>
  </div>
</template>
