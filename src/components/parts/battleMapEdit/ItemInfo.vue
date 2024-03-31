<script setup lang="ts">
import {PropType} from "vue";
import FeImg from "../../element/FeImg.vue";
import global_const from "../../../utils/global_const";
import SettingToggle from "../settings/SettingToggle.vue";
import SettingTextInput from "../settings/SettingTextInput.vue";
import SettingSlider from "../settings/SettingSlider.vue";

const props = defineProps({
  info: {
    type: Object as PropType<Record<any, any>>,
    default: {},
  },
  removable: {
    type: Function,
    default: undefined,
  },
  addable: {
    type: Function,
    default: undefined,
  },
  detailed: {
    type: Boolean,
    default: false,
  },
  applyChange: {
    type: Function,
    default: () => {
    },
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

function findCnt(id: string) {
  return props.inventory[id] ? props.inventory[id] + '个' : '未拥有'
}

onMounted(() => {
  if (!props.detailed) {
    return
  }
  console.log("mounted itemInfo", props.info.id)
  props.info.cnt = props.info.cnt || 0
  watch(() => props.info.cnt, (value) => {
    console.log("watch elite changed", value)
    props.applyChange()
  })
})
</script>
<template>
  <div
      :class="detailed ? 'flex flex-row' : 'ci-outer'"
      class="relative rounded-xl border border-base-content h-fit items-center"
  >
    <!--    {{ info }}-->
    <div class="flex items-center">
      <FeImg
          class="w-16 h-16 m-1"
          :src="global_const.getAssetServer()+'items/'+info.iconId+'.png'"
      />
      <div
          class="text-primary text-sm font-bold"
          :class="detailed? 'absolute bg-base-200 bg-opacity-70 top-1 left-1':''"
      >
        <div class="text-sm">{{ info.name }}</div>
        <div v-if="!detailed">当前：{{ findCnt(info.id) }}</div>
      </div>
    </div>
    <div class="rounded-md w-full h-fit flex" v-if="addable">
      <div class="spacer"/>
      <button class="fe-btn fe-btn_set mr-1 mb-1" @click="addable(info)">添加</button>
    </div>
    <div class="ci-right py-1 space-y-1" v-if="detailed">
      <div class="ci-set justify-between">
        <div class="w-full flex flex-col items-end">
          <div>{{findCnt(info.id)}} <span class="text-primary label-text ml-1">当前数量</span></div>
          <SettingTextInput
              text-class="text-primary" number-only :settings="info" field="cnt" title="目标数量" padding="p-0"
              width="lg:w-28 w-16" :number-min="0"
          />
        </div>
      </div>
      <div class="rounded-md w-full h-fit flex">
        <div class="spacer"/>
        <button class="fe-btn fe-btn_set" v-if="removable" @click="removable(info)">删除</button>
      </div>
    </div>
  </div>
</template>

<style lang="sass">
.ci-outer
  width: calc(50% - 0.125rem)

.ci-right
  width: calc(100% - 4.75rem)

.ci-set
  @apply rounded-md w-full h-fit p-1 gap-1 border border-base-content
</style>