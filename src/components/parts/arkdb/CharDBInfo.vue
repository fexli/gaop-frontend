<script setup lang="ts">
import global_const from "../../../utils/global_const";
import {ComputedRef, onMounted} from "vue";
import GameCharInfoCard from "../account/GameCharInfoCard.vue";
import SkillTable from "../charInfo/SkillTable.vue";
import {GameInfoParser} from "../../../utils/gameInfoParser";
import CharRangeVision from "../charInfo/CharRangeVision.vue";
import Table from "../../element/Table.vue";

const route = useRoute()

const charId: ComputedRef<string> = computed(() => {
  return route.params.charId.toString()
})
const loadOK = ref(false)
const charInfo = ref<Record<string, any>>({})

const charExist = computed(() => {
  return loadOK.value && global_const.gameData.characterData[charId.value] !== undefined
})
const charData = computed(() => {
  return global_const.gameData.characterData[charId.value]
})
const skillData = computed(() => {
  return global_const.gameData.skillData
})
const gameParser = new GameInfoParser()

const phaseTableHeaders = [
  {

    key: "head",
    name: '',
    width: '7rem',
    textCenter:true,
  },
  {
    key: "ev0",
    name: '精英0 1级',
    textCenter:true,
  },
  {
    key: "ev1",
    name: '精英0 满级',
    textCenter:true,
  },
  {
    key: "ev2",
    name: '精英1 满级',
    textCenter:true,
  },
  {
    key: "ev3",
    name: '精英2 满级',
    textCenter:true,
  },
]
const computedEvData: ComputedRef<Record<string, any>> = computed(() => {
  let data = {
    'maxLevel': {
      head: '等级上限',
      ev0: '-',
      ev1: '-',
      ev2: '-',
      ev3: '-',
    },
    'maxHp': {
      head: '生命上限',
      ev0: '-',
      ev1: '-',
      ev2: '-',
      ev3: '-',
    },
    'atk': {
      head: '攻击',
      ev0: '-',
      ev1: '-',
      ev2: '-',
      ev3: '-',
    },
    'def': {
      head: '防御',
      ev0: '-',
      ev1: '-',
      ev2: '-',
      ev3: '-',
    },
    'magicResistance': {
      head: '法抗',
      ev0: '-',
      ev1: '-',
      ev2: '-',
      ev3: '-',
    },
    'blockCnt': {
      head: '阻挡',
      ev0: '-',
      ev1: '-',
      ev2: '-',
      ev3: '-',
    },
    'cost': {
      head: '部署费用',
      ev0: '-',
      ev1: '-',
      ev2: '-',
      ev3: '-',
    }
  } as Record<string, Record<string, any>>
  let idx = 0
  for (let charPhase of charData.value['phases']) {
    if (idx == 0) {
      // 添加ev0
      data['maxLevel']['ev0'] = "-"
      data['maxHp']['ev0'] = charPhase['attributesKeyFrames'][0]['data']['maxHp']
      data['atk']['ev0'] = charPhase['attributesKeyFrames'][0]['data']['atk']
      data['def']['ev0'] = charPhase['attributesKeyFrames'][0]['data']['def']
      data['magicResistance']['ev0'] = charPhase['attributesKeyFrames'][0]['data']['magicResistance']
      data['blockCnt']['ev0'] = charPhase['attributesKeyFrames'][0]['data']['blockCnt']
      data['cost']['ev0'] = charPhase['attributesKeyFrames'][0]['data']['cost']
    }
    let ev = "ev" + (idx + 1)
    data['maxLevel'][ev] = charPhase['maxLevel']
    data['maxHp'][ev] = charPhase['attributesKeyFrames'][charPhase['attributesKeyFrames'].length-1]['data']['maxHp']
    data['atk'][ev] = charPhase['attributesKeyFrames'][charPhase['attributesKeyFrames'].length-1]['data']['atk']
    data['def'][ev] = charPhase['attributesKeyFrames'][charPhase['attributesKeyFrames'].length-1]['data']['def']
    data['magicResistance'][ev] = charPhase['attributesKeyFrames'][charPhase['attributesKeyFrames'].length-1]['data']['magicResistance']
    data['blockCnt'][ev] = charPhase['attributesKeyFrames'][charPhase['attributesKeyFrames'].length-1]['data']['blockCnt']
    data['cost'][ev] = charPhase['attributesKeyFrames'][charPhase['attributesKeyFrames'].length-1]['data']['cost']
    idx += 1
  }
  return data
})

function makeFakeCharInfo() {
  charInfo.value = {
    "instId": 130,
    "charId": "char_1013_chen2",
    "level": 90,
    "exp": 0,
    "evolvePhase": 2,
    "potentialRank": 0,
    "favorPoint": 25570,
    "mainSkillLvl": 7,
    "gainTime": 1629007103,
    "starMark": 0,
    "currentTmpl": "",
    "tmpl": null,
    "skills": [
      {
        "unlock": true,
        "skillId": "skchr_chen2_1",
        "specializeLevel": 0
      },
      {
        "unlock": true,
        "skillId": "skchr_chen2_2",
        "specializeLevel": 0
      },
      {
        "unlock": true,
        "skillId": "skchr_chen2_3",
        "specializeLevel": 3
      }
    ],
    "defaultSkillIndex": 2,
    "skin": "char_1013_chen2_boc_6",
    "currentEquip": "",
    "equip": {},
    "voiceLan": "JP",
    "sortId": 490,
    "rarity": 6,
    "levelPercent": 0
  }
}

function procSkillMaxLevelData(skillId: string) {
  let ski = skillData.value[skillId]
  if (!ski) {
    return {}
  }
  return ski["levels"][ski["levels"].length - 1]
}

onMounted(() => {
  global_const.requireAssets([
    "game_const_data",
    "character_data",
    "char_patch_table",
    "range_table",
    "charpack_pos",
    "uniequip_table",
    "skill_data"
  ], () => {
    makeFakeCharInfo()
    console.log("requireAssets Finished")
    loadOK.value = true
  })
})

</script>
<template>
  <div v-if="charExist" class="flex">
    <div class="w-full">
      <GameCharInfoCard style="width: 100%!important;" class="relative ring-1 ring-primary rounded-md"
                        :select-item="charInfo"/>
      <template v-for="(evData,i) of charData['phases']">
        <div class="bg-base-200 rounded-md ring-1 ring-primary w-full mt-1">
          精英化阶段数据{{ evData }}
        </div>
      </template>
      <Table
          width-class="w-full"
          :table-headers="phaseTableHeaders"
          :data="computedEvData"
      ></Table>
      <div class="bg-base-200 rounded-md ring-1 ring-primary w-full mt-1">
        天赋数据
      </div>
      <div class="bg-base-200 rounded-md ring-1 ring-primary w-full mt-1">
        潜能数据
      </div>
      <div class="bg-base-200 rounded-md ring-1 ring-primary w-full mt-1">
        后勤数据？后勤图标？
      </div>
      <div class="bg-base-200 rounded-md ring-1 ring-primary w-full mt-1">
        材料消耗（精英化，技能升级）
      </div>
    </div>
    <div class="gap-y-1 ml-1">
      <template
          v-for="(k,v) of gameParser.parseSkillCurrent(charData,skillData,charInfo)"
          v-bind:key="v">
        <div class="w-[40.5rem] bg-base-200 rounded-md p-1 mb-1 ring-1 ring-primary">
          <div class="flex">
            <div :class="k.skill.levels[k.current - 1]['rangeId'] ? 'w-[80%]' : 'w-full'">
              <div class="h-16 w-full pt-1 flex">
                <div
                    class="h-14 w-16"
                    :style="`background-image: url('${global_const.getAssetServer()+'skills/skill_icon_'+(global_const.gameData.skillData[k.skillId]['iconId'] || k.skillId)+'.png'}');
                  background-position: center;background-repeat: no-repeat;background-size: contain`"
                />
                <div>
                  <div>技能{{ v + 1 }} | {{ gameParser.parseUnlockCondSkill(charData.skills[v]) }}</div>
                  <div class="flex items-center gap-x-2">
                    <div class="text-primary font-bold text-2xl">{{ k.skill.levels[k.current - 1].name }}</div>
                    <div class="text-sm px-1 rounded-md font-bold"
                         :style="`background-color: ${gameParser.parseSpTypeColor(k.skill.levels[k.current - 1]['spData']['spType'])}`">
                      {{ gameParser.parseSpType(k.skill.levels[k.current - 1]['spData']['spType']) }}
                    </div>
                    <div class="text-sm px-1 rounded-md"
                         :style="`background-color: ${gameParser.parseSkillTypeColor(k.skill.levels[k.current - 1]['skillType'])}`">
                      {{ gameParser.parseSkillType(k.skill.levels[k.current - 1]['skillType']) }}
                    </div>
                  </div>
                </div>
              </div>
              <div
                  class="mx-1"
                  v-html="'满级效果：'+gameParser.compileSkillBlackboard(gameParser.compileDescRichText(k.skill.levels[k.current-1].description,'',true),k.skill.levels[k.current-1].blackboard)"
              />
            </div>
            <div class="divider divider-horizontal mx-0.5 w-0.5" v-if="k.skill.levels[k.current - 1]['rangeId']"/>
            <div class="w-[20%] flex justify-center flex-col-reverse" v-if="k.skill.levels[k.current - 1]['rangeId']">
              <div class="bottom-1 w-full text-center">
                攻击范围({{ k.skill.levels[k.current - 1]['rangeId'] }})
              </div>
              <div class="w-full text-center flex items-center justify-center">
                <CharRangeVision
                    :max-width-px="128"
                    :max-height-px="120"
                    :range-data="gameParser.getRangeData(k.skill.levels[k.current - 1]['rangeId'])"
                />
              </div>
            </div>
          </div>
          <SkillTable
              class="mt-0 mb-1"
              :game-parser="gameParser"
              :skill-obj="k"
              detailed
              no-description
              with-detail
          />
        </div>
      </template>
    </div>
  </div>
  <div v-else class="w-full h-full text-3xl font-bold text-warning flex items-center content-center">
    <svg class="w-12 h-12" viewBox="0 0 24 24">
      <path fill="currentColor" :d="global_const.mdiPath['alert-octagon-outline']"/>
    </svg>
    干员不存在：{{ charId }}
  </div>
</template>

