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
})

const idSplit = computed(() => {
  let spl = props.info.id.split('_')
  if (spl.length <= 2) {
    return spl[spl.length - 1]
  }
  return spl[spl.length - 1] + "[" + spl[spl.length - 2] + "]"
})

function range(i: number): number[] {
  return Array.from({length: i}, (v, k) => k)
}

onMounted(() => {
  if (!props.detailed) {
    return
  }
  console.log("mounted charInfo", props.info.id)
  props.info.elite = props.info.elite || false
  watch(() => props.info.elite, (value) => {
    console.log("watch elite changed", value)
  })
  props.info.eliteLevel = props.info.eliteLevel || 0
  props.info.hasEl = props.info.hasEl || false
  watch(() => props.info.eliteLevel, (value) => {
    console.log("watch eliteLevel changed", value)
    props.info.hasEl = true
    props.applyChange()
  })
  if (props.info.skillInfo?.total) {
    props.info.skill = props.info.skill || false
    props.info.hasSkill = props.info.hasSkill || false
    for (let i = 0; i < props.info.skillInfo.total; i++) {
      props.info['skill_' + i] = props.info['skill_' + i] || 0
      watch(() => props.info['skill_' + i], (val) => {
        console.log("watch skill changed", val)
        props.info.hasSkill = true
        props.applyChange()
      })
    }
  }
})
</script>
<template>
  <div
      :class="detailed ? 'flex flex-row' : 'ci-outer'"
      class="relative rounded-xl border border-base-content h-fit items-center"
  >
    <div class="flex items-center">
      <FeImg
          class="border border-base-content rounded-md w-16 h-16 m-1"
          :src="global_const.assetServer+'avatar/ASSISTANT/'+info.id+'.png'"
      />
      <div
          class="text-primary text-sm font-bold"
          :class="detailed? 'absolute bg-base-200 bg-opacity-70 top-1 left-1':''"
      >
        <div v-if="!detailed">{{ idSplit }}</div>
        <div>{{ info['name'] }}</div>
        <div v-if="!detailed">{{ info['tagList'].join("|") }}</div>
      </div>
    </div>
    <div class="rounded-md w-full h-fit flex" v-if="addable">
      <div class="spacer"/>
      <button class="fe-btn fe-btn_set mr-1 mb-1" @click="addable(info)">添加</button>
    </div>
    <div class="ci-right py-1 space-y-1" v-if="detailed">
      <div class="ci-set justify-between">
        <SettingToggle
            :settings="info" field="elite" title="精英化" padding="p-0"
            text-class="text-primary"
        />
        <div class="w-full flex justify-end">
          <SettingTextInput
              :disabled="!info['elite']" text-class="text-primary"
              number-only :settings="info" field="eliteLevel" title="目标精英化阶段" padding="p-0"
              width="w-12" :number-max="2" :number-min="0"
          />
        </div>
      </div>
      <div class="rounded-md w-full h-fit border border-base-content p-1 space-y-1">
        <SettingToggle
            :settings="info" field="skill" title="技能" padding="p-0"
            text-class="text-primary"
        />
        <template v-for="i in range(info.skillInfo?.total)">
          <div class="w-full flex justify-end">
            <SettingTextInput
                :disabled="!info['skill']" text-class="text-primary"
                number-only
                :settings="info" :field="'skill_'+i"
                :title="['一','二','三'][i]+'技能目标等级'" padding="p-0"
                width="w-12" :number-max="7+info.skillInfo.levels[i]" :number-min="0"
            />
          </div>
        </template>
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