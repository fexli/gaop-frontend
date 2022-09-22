<script setup lang="ts">
import global_const from "../../../utils/global_const";
import {Ref} from "vue";
import SettingSelect from "./SettingSelect.vue";
import Explain from "../../element/Explain.vue";
import StageSelector from "../battleMapEdit/StageSelector.vue";
import {BattleParam, bTypeDesc, parseSingleBattleParam} from "../../../utils/autoBattleMapProc";
import {useToast} from "../../../hooks/toast";
import CharUpgSelector from "../battleMapEdit/CharUpgSelector.vue";

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


const bTypeIcons = {
  AUTO: 'dice-multiple-outline',
  RANDOM: 'format-list-bulleted-type',
  FIRST: 'format-list-numbered',
  MAPARG: 'timetable',
  MANAGED: 'account-arrow-up-outline',
} as Record<string, string>

const selectAttackSettings: Ref<BattleParam> = ref(new BattleParam())
const settingParsed = computed(() => {
  return parseSingleBattleParam(props.settings[props.field])
}) // 当前选中的攻击设置

watch(() => settingParsed.value, (val) => {
  selectAttackSettings.value = val
})

function resetBattleSetting() {
  selectAttackSettings.value = parseSingleBattleParam(props.settings[props.field])
}

const data = ref({
  needApply: false,
})

function applyBattleSetting() {
  console.log(selectAttackSettings)
  // NOTE: 在apply前通知各模块进行数据汇报
  data.value.needApply = true
  props.settings[props.field] = selectAttackSettings.value.Marshal()
  showMessage("进攻关卡设置已更新！请注意保存设置")
  props.close()
}

onMounted(() => {
  resetBattleSetting()
})
</script>
<template>
  <div class="ab-outer">
    <div class="basis-3/4 border-base-content border rounded-l-lg px-1">
      <div class="flex items-center">
        <div class="text-primary text-lg font-bold">进攻设置</div>
        <div class="spacer"/>
        <div class="font-bold">AutoBattleMapEditor V0.1</div>
      </div>
      <div class="ab-sets">
        <SettingSelect
            class="px-2"
            :settings="selectAttackSettings"
            field="Type" title="关卡攻略模式" text-left
            :list="bTypeDesc" item-text="text" item-value="type"
        >
          <template #extra>
            <svg class="w-6 h-6 text-info" viewBox="0 0 24 24">
              <path fill="currentColor" :d="global_const.mdiPath[bTypeIcons[selectAttackSettings['Type']]]"/>
            </svg>
            <Explain class="-mr-2">
              <template #explain>
                <div v-for="i of bTypeDesc">
                  <span class="text-info">{{ i.text }}</span>
                  :
                  <span class="text-primary">{{ i.desc }}</span>
                </div>
              </template>
            </Explain>
          </template>
        </SettingSelect>
        <div class="text-primary text-lg font-bold px-1">>
          {{ bTypeDesc.find(i => i.type === selectAttackSettings.Type)?.text }}
        </div>
        <div class="text-primary text-sm font-bold ml-1 px-1">>
          {{ bTypeDesc.find(i => i.type === selectAttackSettings.Type)?.desc }}
        </div>
        <div v-if="selectAttackSettings['Type'] === 'AUTO'" class="ab-inner"></div>
        <div v-else-if="['FIRST','RANDOM','MAPARG'].some(i => i === selectAttackSettings['Type'])"
             class="ab-inner">
          <StageSelector
              :has-index="selectAttackSettings['Type'] === 'FIRST'"
              :has-times="selectAttackSettings['Type'] === 'MAPARG'"
              :settings="selectAttackSettings" field-map="Map" field-map-t="MapT"
          />
        </div>
        <div v-else-if="selectAttackSettings['Type'] === 'MANAGED'" class="ab-inner">
          <CharUpgSelector
              :settings="selectAttackSettings" field="Managed"
          />
        </div>
      </div>
    </div>
    <div class="basis-1/4 border-base-content border rounded-r-lg px-1 flex flex-col">
      <div class="flex items-center">
        <div class="text-primary text-lg font-bold">差分综合控制</div>
        <div class="spacer"/>
        <button class="btn btn-ghost btn-xs" @click="close">
          <svg class="w-6 h-6" viewBox="0 0 24 24">
            <path fill="currentColor" :d="global_const.mdiPath['close']"/>
          </svg>
        </button>
      </div>
      <div class="w-full h-full mb-1 border border-base-content rounded-md relative">
        <div class="absolute p-1 text-xs">{{ selectAttackSettings }}</div>
        <div class="absolute p-1 bottom-0 break-all text-xs">{{ settings[field] }}</div>
        <div class="bg-base-200 bg-opacity-40 relative w-full h-full flex items-center justify-center text-primary text-opacity-60 select-none">
          <svg class="w-16 h-16 animate-spin-slow-2x" viewBox="0 0 24 24">
            <path fill="currentColor" :d="global_const.mdiPath['cog-outline']"/>
          </svg>
          <div>
            <div>开发中</div>
            <div>敬请期待</div>
          </div>
        </div>
      </div>
      <button @click="resetBattleSetting" type="button" class="fe-btn ab-btn-rst rounded-md w-full text-primary mb-1">
        重置
      </button>
      <button @click="applyBattleSetting" type="button" class="fe-btn ab-btn rounded-md w-full text-primary mb-1">
        确认
      </button>
    </div>
  </div>
</template>

<style lang="sass">
.ab-outer
  @apply card bg-base-200 p-2 rounded-xl flex-row gap-1
  width: 80%
  min-width: 300px
  height: 600px
  max-height: 80%

.ab-sets
  @apply w-full border border-base-content rounded-md
  height: calc(100% - 2rem)

.ab-inner
  @apply w-full overflow-auto px-1
  height: calc(100% - 2.75rem)

.ab-btn
  @apply rounded-md

.ab-btn-rst
  @apply rounded-md text-info hover:btn-info hover:text-base-200
</style>