<script setup lang="ts">
import draggable from "vuedraggable";

import global_const from "../../../utils/global_const";
import {onMounted, Ref, PropType} from "vue";
import {useToast} from "../../../hooks/toast";

const {showMessage} = useToast()

class DecisionType {
  value: number;
  label: string;

  constructor() {
    this.value = 0
    this.label = ""
  }

}

const props = defineProps({
  value: {
    type: Number,
    default: {},
  },
  decisionTypeMap: {
    type: Array as PropType<DecisionType[]>,
  },
  confirm: {
    type: Function,
    default: () => {
    },
  },
  close: {
    type: Function,
    default: () => {
    },
  },
})

const data = ref([] as number[])

onMounted(() => {
  resetBattleSetting()
  console.log("data", data)
})

function resetBattleSetting() {
  data.value.splice(0, data.value.length)
  if (props.decisionTypeMap === undefined) {
    return
  }
  for (let i = 0; i < props.decisionTypeMap.length; i++) {
    if ((props.decisionTypeMap[i].value & props.value) !== 0) {
      data.value.push(props.decisionTypeMap[i].value)
    }
  }
}

function confirm() {
  let res = 0
  if (props.decisionTypeMap === undefined) {
    return
  }
  for (let i = 0; i < data.value.length; i++) {
    res |= data.value[i]
  }
  props.confirm(res)
}

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
      <div class="flex flex-wrap w-full px-1">
        <template v-for="(k,v) of decisionTypeMap">
          <div class="form-control w-1/2">
            <label class="label justify-start cursor-pointer">
              <input type="checkbox" :value="k.value" v-model="data"
                     class="checkbox checkbox-primary"/>
              <span class="pl-1 label-text">{{ k.label }}</span>
            </label>
          </div>
        </template>
      </div>
      <div class="flex gap-x-3 justify-end">
        <button class="btn btn-sm btn-primary" @click="confirm">确定</button>
        <button @click="close" class="btn btn-sm btn-ghost">取消</button>
      </div>
    </div>
  </div>
</template>
