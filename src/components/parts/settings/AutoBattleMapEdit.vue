<script setup lang="ts">
import draggable from "vuedraggable";

import global_const from "../../../utils/global_const";
import {Ref} from "vue";
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
  inventory: {
    type: Object,
    default: {},
  },
  status: {
    type: Object,
    default: {},
  },
  close: {
    type: Function,
    default: () => {
    },
  },
})

const autoBattleMapSetting: Ref<AutoBattleMapSumms> = ref(new AutoBattleMapSumms({})) // 解析后的设置
const currentIndex: Ref<number> = ref(-1) // 当前的index
const selectAttackSettings: Ref<BattleParam> = ref(new BattleParam()) // 当前选择的解析的进攻设置
const needRefreshed: Ref<boolean> = ref(false) // 是否需要刷新
const onDelete: Ref<boolean> = ref(false)

const drag = ref(false)

const inDrag = ref(false)

function atksRemapStart(el: any) {

}

function atksRemapEnd(el: any) {
  console.log("drag end, change index", el.newIndex, el.oldIndex)
  if (el.newIndex === el.oldIndex) {
    return
  }
  // 先将数据序列化？
  inDrag.value = true
  // TODO:change index
  let minOf = Math.min(el.newIndex, el.oldIndex)
  let maxOf = Math.max(el.newIndex, el.oldIndex)
  let isSub = el.newIndex < el.oldIndex
  if (currentIndex.value < minOf || currentIndex.value > maxOf) {
    inDrag.value = false
    return
  }
  if (isSub) {
    currentIndex.value = currentIndex.value === maxOf ? minOf : currentIndex.value + 1
  } else {
    currentIndex.value = currentIndex.value === minOf ? maxOf : currentIndex.value - 1
  }
}

function trySaveCurrentBattleMapSet(index: number) {
  console.log("enter trySaveCurrentBattleMapSet", index)
  if (index !== -1) {
    if ((autoBattleMapSetting.value?.atks?.length || 0) <= index) {
      return
    }
    // 保存index设置
    console.log("trySaveCurrentBattleMapSet", index, selectAttackSettings.value)
    autoBattleMapSetting.value.atks[index].mapSetting = selectAttackSettings.value
  }
}

function deleteAtkMap(index: number) {
  if (index !== -1) {
    console.log("deleteAtkMap", index)
    if ((autoBattleMapSetting.value?.atks?.length || 0) <= index) {
      return
    }
    // 保存index设置
    autoBattleMapSetting.value.atks.splice(index, 1)
    onDelete.value = true
    if (currentIndex.value === index && index === 0) {
      currentIndex.value = -1
      selectAttackSettings.value = new BattleParam()
    } else if (currentIndex.value >= index) {
      currentIndex.value = currentIndex.value - 1
    }
  }
}

function loadByIndex(index: number) {
  console.log("load index", index, autoBattleMapSetting.value.atks[index].mapSetting)
  selectAttackSettings.value = autoBattleMapSetting.value.atks[index].mapSetting
  needRefreshed.value = true
  nextTick(() => {
    needRefreshed.value = false
  })
}

watch(() => currentIndex.value, (index: number, old: number) => { // 监听index变化（点击切换）
  console.log("currentIndex", "old=", old, "new=", index)
  if (autoBattleMapSetting.value.atks[index] == undefined) {
    console.log("index not exist, ignore")
    if (index >= 0) {
      currentIndex.value = old
    }
    onDelete.value = false
    return;
  }
  if (onDelete.value) {
    console.log("in delete, ignore")
    if (currentIndex.value > old) {
      console.log("in delete and sub index, reset and return")
      currentIndex.value = old
      return;
    }
    if (currentIndex.value < old) {
      console.log("in delete and hum index, reset and return")
      loadByIndex(index)
    }
    onDelete.value = false
    return
  }
  if (inDrag.value) {
    console.log("in drag, ignore")
    inDrag.value = false
    return
  }
  trySaveCurrentBattleMapSet(old)
  if (index !== -1) {
    // 加载index设置
    loadByIndex(index)
  }
})


function resetBattleSetting() {
  // TODO: 提示确认，然后重置成setting的设置
  tryLoadBattleSetting()
  // selectAttackSettings.value = parseSingleBattleParam(props.settings[props.field])
}

const data = ref({
  needApply: false,
})

function tryLoadBattleSetting() {
  autoBattleMapSetting.value = new AutoBattleMapSumms(JSON.parse(props.settings[props.field]))
  console.log("tryLoad", autoBattleMapSetting.value)
  if (autoBattleMapSetting.value.atks.length > 0) {
    currentIndex.value = 0
  }
}

const settingParsed = computed(() => {
  return props.settings[props.field]
}) // 当前选中的攻击设置

watch(() => settingParsed.value, (val) => {
  tryLoadBattleSetting()
})

function addNewAtks() {
  let mSet = new BattleParam()
  mSet.type = "AUTO"
  let data = new AutoBattleMapAtkSet({
    mapSetting: mSet,
    conditions: {type: 1, value: 1},
  })
  autoBattleMapSetting.value.atks.push(data)
}

function applyBattleSetting() {
  trySaveCurrentBattleMapSet(currentIndex.value)
  console.log(selectAttackSettings)
  // NOTE: 在apply前通知各模块进行数据汇报
  data.value.needApply = true
  let infoStr = JSON.stringify(autoBattleMapSetting.value)
  props.settings[props.field] = infoStr
  console.log("applyBattleSetting To", infoStr)
  showMessage("进攻关卡设置已更新！请注意保存设置")
  props.close()
}

function findBType(type: string): Record<string, any> {
  let s = bTypeDesc.find((item) => {
    if (item.type === type) {
      return item
    }
  })
  if (s) {
    return s
  }
  return {text: "未知", type: "UNKNOWN", icon: "help"}
}

onMounted(() => {
  tryLoadBattleSetting()
})
</script>
<template>
  <div class="ab-outer">
    <div class="basis-3/4 border-base-content border rounded-l-lg px-1">
      <div class="flex items-center">
        <div class="text-primary text-lg font-bold">进攻设置</div>
        <div class="spacer"/>
        <div class="font-bold">AutoBattleMapEditor V0.4α</div>
      </div>
      <div class="ab-sets" v-if="!needRefreshed">
        <SettingSelect
            class="px-2"
            :settings="selectAttackSettings"
            field="type" title="关卡攻略模式" text-left
            :list="bTypeDesc" item-text="text" item-value="type"
        >
          <template #extra>
            <svg class="w-6 h-6 text-info" viewBox="0 0 24 24">
              <path fill="currentColor" :d="global_const.mdiPath[findBType(selectAttackSettings['type']).icon]"/>
            </svg>
            <div></div>
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
          {{ bTypeDesc.find(i => i.type === selectAttackSettings.type)?.text }}
        </div>
        <div class="text-primary text-sm font-bold ml-1 px-1">>
          {{ bTypeDesc.find(i => i.type === selectAttackSettings.type)?.desc }}
        </div>
        <!--        这里开始就是Type对应的SettingArea        -->
        <div
            v-if="currentIndex < 0"
            class="bg-base-200 rounded-md bg-opacity-90 absolute left-0 top-0 w-full h-full flex items-center justify-center text-primary select-none"
        >
          <svg class="w-16 h-16 animate-bounce mt-4" viewBox="0 0 24 24">
            <path fill="currentColor" :d="global_const.mdiPath['alert-octagon-outline']"/>
          </svg>
          <div>
            <div>请先在右侧选择一个</div>
            <div>需要进行设置的攻略分组</div>
            <div>或点击创建分组进行设置</div>
          </div>
        </div>
        <template v-else>
          <div v-if="selectAttackSettings['type'] === 'AUTO'" class="ab-inner"></div>
          <div
              v-else-if="['FIRST','RANDOM','MAPARG','MAPARGRST','MAPLESD'].some(i => i === selectAttackSettings['type'])"
              class="ab-inner">
            <StageSelector
                :inventory="inventory"
                :has-index="selectAttackSettings['type'] === 'FIRST'"
                :has-times="selectAttackSettings['type'] === 'MAPARG'"
                :has-less-drop="selectAttackSettings['type'] === 'MAPLESD'"
                :has-need-times="selectAttackSettings['type'] === 'MAPARGRST'"
                :settings="selectAttackSettings" field-map="maps" field-map-t="mapt"
            />
          </div>
          <div v-else-if="selectAttackSettings['type'] === 'MANAGED'" class="ab-inner">
            <CharUpgSelector
                :settings="selectAttackSettings" field="mng"
            />
          </div>
          <div v-else-if="selectAttackSettings['type'] === 'ITEMBASE'" class="ab-inner">
            <ItemSelector
                :settings="selectAttackSettings" field="items"
                :inventory="inventory"
                :status="status"
            />
          </div>
        </template>
      </div>
    </div>
    <div class="basis-1/4 border-base-content border rounded-r-lg px-1 flex flex-col max-w-[30%]">
      <div class="flex items-center">
        <div class="text-primary text-lg font-bold">差分综合控制</div>
        <div class="spacer"/>
        <button class="btn btn-ghost btn-xs" @click="close">
          <svg class="w-6 h-6" viewBox="0 0 24 24">
            <path fill="currentColor" :d="global_const.mdiPath['close']"/>
          </svg>
        </button>
      </div>
      <div class="h-full mb-1 border border-base-content rounded-md relative flex flex-col">
        <!--        <div class="p-1 text-xs text-info">[D]当前选择：{{-->
        <!--            parseSingleBattleParamToStr(selectAttackSettings.Marshal())-->
        <!--          }}-->
        <!--        </div>-->

        <div class="flex px-1 pt-1">
          <div class="px-1 -mb-1 text-sm">进攻组合参数</div>
          <div class="spacer"/>
          <div class="fe-btn fe-btn_absr" @click="addNewAtks">新增</div>
        </div>
        <div style="width: calc(100% - 0.5rem)"
             class="relative m-1 rounded-md border border-base-content h-64 overflow-x-hidden">
          <draggable
              class="w-full absolute flex flex-col gap-y-1"
              :component-data="{
                      type:'transition-group',
                    }"
              :list="autoBattleMapSetting?.atks || []"
              :group="{name:'maps',put:false}"
              @start="drag = true"
              @end="drag = false"
              :onEnd="atksRemapEnd"
              :onStart="atksRemapStart"
              item-key="name"
          >
            <template #item="{ element,index }">
              <div
                  @click="currentIndex = index"
                  class="ring-1 ring-base-content text-sm hover:bg-base-100 transition-all"
              >
                <div class="flex gap-1 items-center h-full px-0.5">
                  <div class="text-primary font-bold">
                    {{ index + 1 }}
                  </div>
                  <div class="flex flex-col">
                    <div class="break-all">
                      {{ parseSingleBattleParamToStr(element.mapSetting || {}) }}
                      <span class="text-success">{{ element.isComplete ? ' √ 搞定了' : '' }}</span>
                    </div>
                    <div class="spacer-line-w bg-secondary my-0.5"></div>
                    <div class="flex mb-0.5">
                      条件：{{ parseConditionStr(element.conditions) }}
                      <div class="spacer"/>
                      <button class="fe-btn fe-btn_absr" disabled>编辑</button>
                    </div>
                  </div>
                  <div class="spacer"/>
                  <button class="btn btn-ghost btn-circle btn-xs btn-primary" @click="deleteAtkMap(index)">
                    <svg class="w-4 h-4" viewBox="0 0 24 24">
                      <path fill="currentColor" :d="global_const.mdiPath['close']"/>
                    </svg>
                  </button>
                </div>
              </div>
            </template>
          </draggable>
        </div>

        <div class="p-1 bottom-0 break-all text-xs max-h-[10.5rem] overflow-auto whitespace-pre-wrap">
          <!--          {{ JSON.stringify(autoBattleMapSetting,null,2) }}-->
          <JsonView
              style="margin-top: 10px"
              :font-size="12"
              :line-height="13"
              :indent="13"
              :json="autoBattleMapSetting"
              :closed="false"
          />
        </div>
        <!--        <SettingTextInput :settings="autoBattleMapSetting" field="fbid" title="默认关卡" width="w-20"/>-->
        <!--        <div class="w-full h-44">-->
        <!--          <draggable-->
        <!--              class="ss-map-inner"-->
        <!--              :component-data="{-->
        <!--            type:'transition-group',-->
        <!--          }"-->
        <!--              :list="list2"-->
        <!--              :group="{name:'people',put:true}"-->
        <!--              @start="drag = true"-->
        <!--              @end="drag = false"-->
        <!--              item-key="name"-->
        <!--          >-->
        <!--            <template #item="{ element }">-->
        <!--              <div>{{ element }}</div>-->
        <!--            </template>-->
        <!--          </draggable>-->
        <!--        </div>-->

        <div class="spacer"/>
        <div class="flex px-1">
          <div class="text-xs text-gray-500">参数版本:{{ autoBattleMapSetting?.ver }}</div>
          <div class="spacer"/>
          <div class="text-xs text-gray-500">配置时间:{{ autoBattleMapSetting?.ts }}</div>
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
  @apply w-full border border-base-content rounded-md relative
  height: calc(100% - 2rem)

.ab-inner
  @apply w-full overflow-auto px-1
  height: calc(100% - 2.75rem)

.ab-btn
  @apply rounded-md

.ab-btn-rst
  @apply rounded-md text-info hover:btn-info hover:text-base-200
</style>