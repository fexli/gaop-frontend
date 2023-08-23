<script setup lang="ts">
import formatter from "../../../utils/formatter";
import global_const from "../../../utils/global_const";
import FeImg from "../../element/FeImg.vue";
import {addGameItemUse, listGameItemUse} from "../../../plugins/axios";
import {ComputedRef, onMounted, Ref} from "vue";
import {accountStore} from "../../../store/account";
import Explain from "../../element/Explain.vue";
import CharAttr from "../charInfo/CharAttr.vue";
import {getTheme} from "../../../plugins/theme";
import {GameInfoParser} from "../../../utils/gameInfoParser";
import TalentTable from "../charInfo/TalentTable.vue";
import SkillTable from "../charInfo/SkillTable.vue";
import CharRangeVision from "../charInfo/CharRangeVision.vue";

const {getAccountItemUse, setAccountItemUse} = accountStore();

const props = defineProps({
  selectItem: {
    type: Object,
    default: {}
  },
})

function formatTime(ts: number) {
  return formatter.formatConsumeTime(ts)
}

const gameParser = new GameInfoParser()


const favors = [0, 8, 16, 28, 40, 56, 72, 92, 112, 137, 162, 192, 222, 255, 288, 325, 362, 404, 446, 491, 536,
  586, 636, 691, 746, 804, 862, 924, 986, 1052, 1118, 1184, 1250, 1316, 1382, 1457, 1532, 1607, 1682, 1757, 1832,
  1917, 2002, 2087, 2172, 2257, 2352, 2447, 2542, 2637, 2732, 2840, 2960, 3080, 3200, 3320, 3450, 3580, 3710, 3840,
  3970, 4110, 4250, 4390, 4530, 4670, 4820, 4970, 5120, 5270, 5420, 5575, 5730, 5885, 6040, 6195, 6350, 6505, 6660,
  6815, 6970, 7125, 7280, 7435, 7590, 7745, 7900, 8055, 8210, 8365, 8520, 8675, 8830, 8985, 9140, 9295, 9450, 9605,
  9760, 9915, 10070, 10225, 10380, 10535, 10690, 10845, 11000, 11155, 11310, 11465, 11620, 11775, 11930, 12085, 12240,
  12395, 12550, 12705, 12860, 13015, 13170, 13325, 13480, 13635, 13790, 13945, 14100, 14255, 14410, 14565, 14720,
  14875, 15030, 15185, 15340, 15495, 15650, 15805, 15960, 16115, 16270, 16425, 16580, 16735, 16890, 17045, 17200,
  17355, 17510, 17665, 17820, 17975, 18130, 18285, 18440, 18595, 18750, 18905, 19060, 19215, 19370, 19525, 19680,
  19835, 19990, 20145, 20300, 20455, 20610, 20765, 20920, 21075, 21230, 21385, 21540, 21695, 21850, 22005, 22160,
  22315, 22470, 22625, 22780, 22935, 23090, 23245, 23400, 23555, 23710, 23865, 24020, 24175, 24330, 24485, 24640,
  24795, 24950, 25105, 25260, 25415, 25570
]

const charData = computed(() => {
  return gameParser.findCharData(props.selectItem)
})
const levelUpCost = computed(() => {
  return global_const.gameData.gameConstData['characterExpMap'][props.selectItem.evolvePhase][props.selectItem.level - 1]
})

const maxLevel = computed(() => {
  return global_const.gameData.gameConstData['maxLevel'][charData.value.rarity][props.selectItem.evolvePhase]
})

const isMaxLevel = computed(() => {
  return maxLevel.value === props.selectItem.level
})

const isMaxEvolvePhase = computed(() => {
  return props.selectItem.evolvePhase === global_const.gameData.gameConstData['maxLevel'][charData.value.rarity].length - 1
})
const isFullpotential = computed(() => {
  return props.selectItem.potentialRank === charData.value.maxPotentialLevel
})

const isMaxSkill = computed(() => {
  return props.selectItem.skills.every((v: any) => {
    let sk = charData.value.skills.filter((k: Record<string, any>) => {
      if (k.skillId === v.skillId) return k
    })
    return sk.length > 0 && sk[0].levelUpCostCond.length === v.specializeLevel
  })
})
const computeCharTmpl = computed(() => {
  return props.selectItem['currentTmpl'] ? props.selectItem['tmpl'][props.selectItem['currentTmpl']] : props.selectItem
})

const getTalentCurrent = computed(() => {
  return gameParser.parseTalentCurrent(charData.value, props.selectItem)
})

function skillSpCost(skillId: string, currentLevel: number): number {
  let spc = global_const.gameData.skillData[skillId]['levels'][currentLevel - 1]['spData']['spCost']
  return spc === 0 ? '-' : spc
}

function skillInitSp(skillId: string, currentLevel: number): number {
  return global_const.gameData.skillData[skillId]['levels'][currentLevel - 1]['spData']['initSp']
}

function findEquip(eq: string) {
  return eq ? global_const.gameData.uniequipTable['equipDict'][eq] : null
}

function findEquipName(eq: string) {
  let eqn = findEquip(eq)
  if (!eqn) {
    return 'NONE'
  }
  let name = eqn['typeName1']
  if (eqn['typeName2']) {
    name += '-' + eqn['typeName2']
  }
  return name
}

function findSubProf(prof: string) {
  return prof ? global_const.gameData.uniequipTable['subProfDict'][prof] : null
}

function getFavorPercent(pt: number) {
  if (pt >= 25570) {
    return 200
  }
  for (let v in favors) {
    if (favors[v] >= pt) {
      if (pt === favors[v]) {
        return v
      }
      return parseInt(v) - 1
    }
  }
}

function getFavorAttrFrame() {
  let data = charData.value
  if (data == null) {
    return {}
  }
  //@ts-ignore
  let favorPrc = Math.min(parseInt(getFavorPercent(props.selectItem.favorPoint) / 2), 50)
  let favorLevelDist = data["favorKeyFrames"][1].level - data["favorKeyFrames"][0].level
  let ret = {} as Record<string, any>
  for (let arr in data["favorKeyFrames"][1].data) {
    if (data["favorKeyFrames"][1].data[arr] instanceof Boolean) {
      continue
    }
    let dist = data["favorKeyFrames"][0].data[arr] + (data["favorKeyFrames"][1].data[arr] - data["favorKeyFrames"][0].data[arr]) / favorLevelDist * favorPrc
    if (dist === 0) {
      continue
    }
    if (arr === "maxHp" || arr === "atk" || arr === "def") {
      ret[arr] = Math.round(dist)
    } else {
      ret[arr] = dist
    }
  }
  return ret
}

const getCharAttrFrame: ComputedRef<Record<string, number>> = computed(() => {
  let data = charData.value
  if (data == null) {
    return {}
  }
  let base = data.phases[props.selectItem.evolvePhase]
  let frameRange = [{
    level: 0,
    data: [],
  }, {
    level: 0,
    data: [],
  }]
  for (let keyFrame of base["attributesKeyFrames"]) {
    if (keyFrame.level <= props.selectItem.level) {
      frameRange[0] = keyFrame
    }
    if (keyFrame.level >= props.selectItem.level) {
      frameRange[1] = keyFrame
    }
  }
  let levelDist = Math.max(frameRange[1].level - frameRange[0].level, 1)
  //@ts-ignore
  let favorPrc = Math.min(parseInt(getFavorPercent(props.selectItem.favorPoint) / 2), 50)
  let favorLevelDist = data["favorKeyFrames"][1].level - data["favorKeyFrames"][0].level
  let ret = {} as Record<string, any>
  for (let arr in frameRange[0].data) {
    if (data["favorKeyFrames"][1].data[arr] instanceof Boolean) {
      ret[arr] = data["favorKeyFrames"][1].data[arr]
      continue
    }
    let favorDist = data["favorKeyFrames"][0].data[arr] + (data["favorKeyFrames"][1].data[arr] - data["favorKeyFrames"][0].data[arr]) / favorLevelDist * favorPrc
    let charDist = frameRange[0].data[arr] + ((frameRange[1].data[arr] - frameRange[0].data[arr]) / levelDist) * (props.selectItem.level - 1)
    if (arr === "maxHp" || arr === "atk" || arr === "def") {
      ret[arr] = Math.round(favorDist) + Math.round(charDist)
    } else {
      ret[arr] = favorDist + charDist
    }
  }
  return ret
})

function getRespawnDesc(t: number) {
  if (t < 20) {
    return "快"
  } else if (t >= 20 && t <= 63) {
    return "中等"
  } else if (t > 63 && t <= 100) {
    return "慢"
  } else {
    return "非常慢"
  }
}

function calcAttackSpeed(atkSpd: number, baseAtkTs: number) {
  let realAtkTs = baseAtkTs / (Math.min(Math.max(atkSpd, 20), 600) / 100)
  let ts = `(${realAtkTs.toFixed(2)}秒)`
  if (realAtkTs <= 0.8) {
    return "非常快" + ts
  } else if (realAtkTs > 0.8 && realAtkTs <= 1.0) {
    return "快" + ts
  } else if (realAtkTs > 1.0 && realAtkTs <= 1.2) {
    return "中等" + ts
  } else if (realAtkTs > 1.2 && realAtkTs <= 1.6) {
    return "较慢" + ts
  } else if (realAtkTs > 1.6) {
    return "慢" + ts
  }
  return ts
}

const bgCharLeft: Ref<number> = ref(-25)
const bgCharTop: Ref<number> = ref(-25)
const bgCharScale: Ref<number> = ref(150)

function setCharPos() {
  let gChar = global_const.gameData.charPosData[props.selectItem.skin || '']
  console.log("setCharPos", gChar)
  if (gChar) {
    //@ts-ignore
    bgCharScale.value = parseInt(200 * gChar['sz'][0] / 2048)
    //@ts-ignore
    bgCharLeft.value = (parseInt(100 * (gChar['pv'][0] - 0.5 + (gChar['of'][0] / gChar['sz'][0]))) - ((bgCharScale.value - 100) / 2))
    //@ts-ignore
    bgCharTop.value = (parseInt(100 * (gChar['pv'][1] - 0.5 - (gChar['of'][1] / gChar['sz'][1]))) - ((bgCharScale.value - 100) / 2))
    console.log("setCharPos", bgCharLeft.value, bgCharTop.value, bgCharScale.value)
  }
}

onMounted(() => {
  setCharPos()
})

</script>
<template>
  <div class="rounded-xl px-2 py-2 w-[56.25rem] h-[37.5rem] absolute bg-base-200 overflow-hidden">
    <FeImg
        src="/static/charframe/bg_img.png" class="w-full h-full absolute left-0 top-0"
        background-size="cover"
    />
    <div
        class="m-auto absolute rounded-xl"
        :style="`background-image: url('${global_const.assetServer+'charpack/'+selectItem.skin+'.png'}');
        left: ${bgCharLeft}%;top: ${bgCharTop}%;height: ${bgCharScale > 130 ? bgCharScale : 130}%;width: ${bgCharScale}%;
        background-position: center;background-repeat: no-repeat;background-size: contain`"
    ></div>
    <!--      左上角Title-->
    <div class="absolute ml-2 font-bold text-sm font-mono text-shadow">
      -#-{{ selectItem['charId'] }}-#- >> {{ charData.name }}
    </div>
    <!--    <div class="absolute ml-2 mt-4">-->
    <!--      -#-获取日期-#- >> {{ formatTime(selectItem.gainTime * 1000) }}-->
    <!--    </div>-->
    <!--      右上角右侧内容-->
    <div class="absolute right-0 top-0 m-3">
      <div class="flex flex-row items-center">
        <div>
          <div
              class="radial-progress absolute"
              style="--value:100; --size:75px; --thickness: 3px;color: rgb(90,90,90);"
          >
          </div>
          <div
              class="radial-progress flex flex-col items-center text-shadow"
              :style="`--value:${isMaxLevel ? 100 : parseInt(selectItem['exp']*100/levelUpCost)};`"
              style="--size:75px; --thickness: 3px;color: rgb(253, 213, 47);"
          >
            <div class="text-content text-xs font-aewide -mt-1">LV</div>
            <div class="text-content text-xs font-aewide -mt-1">{{ isMaxLevel ? 'MAX' : '' }}</div>
            <div class="text-content text-4xl font-aewide -mt-2">{{ selectItem['level'] }}</div>
          </div>
        </div>
        <div class="ml-1 text-content">
          <div class="text-lg flex items-center h-9 w-[13.25rem] mb-1 bg-base-100 shadow-md">
            <span class="text-sm px-2">EXP </span>
            <span style="color: rgb(253, 213, 47);">{{
                levelUpCost === -1 || isMaxLevel ? '-' : selectItem['exp']
              }}</span>/{{
              levelUpCost === -1 || isMaxLevel ? '-' : levelUpCost
            }}
            <div class="spacer"></div>
            <svg class="w-6 h-6" stroke="currentColor" fill="currentColor" viewBox="0 0 24 24">
              <path stroke-width="0.3" :d="global_const.mdiPath['plus']"/>
            </svg>
          </div>
          <div class="text-sm absolute font-aewide -mt-2 -ml-1 text-shadow">/{{ maxLevel }}</div>
        </div>
      </div>

      <div class="flex flex-row mt-8">
        <div class="text-lg flex justify-between mr-1 items-center h-11 w-36 mb-1 bg-base-100 shadow-md">
          <div
              class="h-20 w-20 -mt-7 ml-1 rounded-xl"
              :style="`background-image: url('/static/charframe/elite/elite_${selectItem['evolvePhase']}_large.png');
              background-position: center;background-repeat: no-repeat;background-size: contain`"/>
          <div class="flex flex-col items-end">
            <span class="text-sm mr-1">精英化</span>
            <svg v-if="!isMaxEvolvePhase" class="w-5 h-5" stroke="currentColor" fill="currentColor" viewBox="0 0 24 24">
              <path stroke-width="0.3" :d="global_const.mdiPath['plus']"/>
            </svg>
            <div v-else class="text-sm mr-1 font-aewide -mt-1">MAX</div>
          </div>
        </div>
        <div class="text-lg flex justify-between items-center h-11 w-36 mb-1 bg-base-100 shadow-md">
          <div
              class="h-20 w-20 -mt-7 ml-1 rounded-xl"
              :style="`background-image: url('/static/charframe/potential/potential_${selectItem['potentialRank']}.png');
              background-position: center;background-repeat: no-repeat;background-size: contain`"/>
          <div class="flex flex-col items-end">
            <span class="text-sm mr-1">潜能</span>
            <svg v-if="!isFullpotential" class="w-5 h-5" stroke="currentColor" fill="currentColor" viewBox="0 0 24 24">
              <path stroke-width="0.3" :d="global_const.mdiPath['plus']"/>
            </svg>
            <div v-else class="text-sm mr-1 font-aewide -mt-1">MAX</div>
          </div>
        </div>
      </div>
      <div class="mt-6 flex flex-col items-start">
        <div class="flex mr-1 items-center justify-center w-16 h-8 mb-1 bg-base-100 shadow-md">
          <span class="text-xs font-aewide mr-0.5">RANK</span>
          <span class="text-2xl font-aewide">{{ selectItem['mainSkillLvl'] }}</span>
        </div>
        <div class="flex items-center justify-start w-[18.25rem] h-16 mb-1 bg-base-100 shadow-md">
          <div class="flex flex-col w-[4.25rem] ml-2">
            <span class="text-sm mr-1">技能升级</span>
            <svg v-if="!isMaxSkill" class="w-5 h-5" stroke="currentColor" fill="currentColor" viewBox="0 0 24 24">
              <path stroke-width="0.3" :d="global_const.mdiPath['plus']"/>
            </svg>
            <div v-else class="text-sm mr-1 font-aewide -mt-1">MAX</div>
          </div>
          <!--            skills-->
          <template
              v-for="(k,v) of gameParser.parseSkillCurrent(charData,global_const.gameData.skillData,props.selectItem)"
              v-bind:key="v">
            <div class="dropdown dropdown-left dropdown-top dropdown-hover w-[4.5rem]" v-if="k.isUnlock">
              <div class="w-[4.5rem] h-[5.75rem] -mt-9">
                <div
                    class="h-14 w-16 absolute"
                    :style="`background-image: url('${global_const.assetServer+'skills/skill_icon_'+(global_const.gameData.skillData[k.skillId]['iconId'] || k.skillId)+'.png'}');
                  background-position: center;background-repeat: no-repeat;background-size: contain`"
                />
                <div class="absolute text-center w-16 h-8 mt-[3.875rem] text-skill flex items-center justify-center">
                  {{
                    global_const.gameData.skillData[k.skillId]['levels'][k.current - 1].name
                  }}
                </div>
                <img
                    class="absolute -mt-1 p-0.5"
                    style="background-color: #303030;height: 16px;width: 18px"
                    :src="`/static/charframe/specialized/specialized_tiny_${k.specializeLevel}.png`"
                    alt="sp"
                />

                <div
                    v-if="skillSpCost(k.skillId, k.current) !== 0 && global_const.gameData.skillData[k.skillId]['levels'][k.current - 1]['skillType'] !== 0"
                    class="absolute ml-8 mt-10"
                    style="height: 22px;width: 36px"
                    :style="`background-image: url('/static/charframe/charcommon/image_sp_cost_bkg.png');
                  background-position: center;background-repeat: no-repeat;background-size: contain`"
                />
                <div
                    v-if="skillSpCost(k.skillId, k.current) !== 0 && global_const.gameData.skillData[k.skillId]['levels'][k.current - 1]['skillType'] !== 0"
                    :class="skillSpCost(k.skillId,k.current) >= 100 ? 'scale-75' : ''"
                    class="h-[1.375rem] mt-10 ml-[1.375rem] text-sknum font-aewide">
                  {{ skillSpCost(k.skillId, k.current) }}
                </div>

                <div
                    v-if="skillInitSp(k.skillId, k.current) !== 0 && global_const.gameData.skillData[k.skillId]['levels'][k.current - 1]['skillType'] !== 0"
                    class="absolute ml-0.5 mt-10"
                    style="height: 22px;width: 36px"
                    :style="`background-image: url('/static/charframe/charcommon/image_sp_start_bkg.png');
                  background-position: center;background-repeat: no-repeat;background-size: contain`"
                />
                <div
                    v-if="skillInitSp(k.skillId, k.current) !== 0 && global_const.gameData.skillData[k.skillId]['levels'][k.current - 1]['skillType'] !== 0"
                    :class="skillInitSp(k.skillId,k.current) >= 100 ? 'scale-75' : ''"
                    class="h-[1.375rem] mt-10 -ml-[0.5rem] text-sknum font-aewide">
                  {{ skillInitSp(k.skillId, k.current) }}
                </div>

                <div
                    v-if="global_const.gameData.skillData[k.skillId]['levels'][k.current - 1]['skillType'] === 0"
                    class="absolute ml-8 mt-10"
                    style="height: 22px;width: 36px"
                    :style="`background-image: url('/static/charframe/charcommon/image_sp_keep_bkg.png');
                  background-position: center;background-repeat: no-repeat;background-size: contain`"
                />
                <div
                    v-if="global_const.gameData.skillData[k.skillId]['levels'][k.current - 1]['skillType'] === 0"
                    :class="gameParser.skillDuration(k.skillId,k.current).length >= 2 ? 'scale-75' : ''"
                    class="h-[1.375rem] mt-10 ml-[1.475rem] text-sknum font-aewide">
                  {{ gameParser.skillDuration(k.skillId, k.current) }}
                </div>
              </div>
              <div
                  style="top:-12.5rem;"
                  class="delay-200 transition-all p-1 px-2 dropdown-content flex flex-col items-end"
              >
                <div
                    class="card bg-base-100 rounded-md p-0.5 px-2 ring-primary ring-1"
                    v-html="gameParser.compileSkillBlackboard(gameParser.compileDescRichText(k.skill.levels[k.current-1].description,'',true),k.skill.levels[k.current-1].blackboard)"
                />
                <SkillTable
                    class="card bg-base-100 rounded-md mt-1 w-[40rem] ring-primary ring-1 flex items-end"
                    :game-parser="gameParser"
                    :skill-obj="k"
                />
              </div>
            </div>
          </template>
        </div>
      </div>
      <div class="flex flex-col mt-5 items-center justify-center w-[18.25rem] h-36 mb-1 bg-base-100 shadow-md">
        <div class="flex justify-start">
          <div
              style="height: 50px;width: 50px;background-color: #3b3b3b;margin: 10px"
              :style="`background-image: url('static/charframe/sub-prof/sub_${charData['subProfessionId']}_icon.png');
                  background-position: center;background-repeat: no-repeat;background-size: contain`"
          />
          <div class="flex flex-col justify-center w-12">
            <div style="color: gray">分支</div>
            <div
                :class="findSubProf(charData['subProfessionId'])['subProfessionName'].length >=4 ? 'text-xs' : ''"
                class="text-content">{{ findSubProf(charData['subProfessionId'])['subProfessionName'] }}
            </div>
          </div>
          <div class=" h-full w-1 divider divider-horizontal py-2"></div>
          <div style="color: gray;padding-top: 11px" class="sp-tx mx-2">模组</div>
          <div
              class="-mt-4"
              style="height: 80px;width: 80px"
              :style="`background-image: url('/static/charframe/equip/holder_weapon.png');
                  background-position: center;background-repeat: no-repeat;background-size: contain`"
          />
          <div
              v-if="computeCharTmpl['currentEquip']" style="filter: blur(0.5rem);height: 20px;width: 20px;"
              class="absolute left-[14.875rem] mt-1 opacity-70"
              :style="`background-image: linear-gradient(${findEquip(computeCharTmpl['currentEquip'])['equipShiningColor']},${findEquip(computeCharTmpl['currentEquip'])['equipShiningColor']})`"
          />
          <div
              v-if="computeCharTmpl['currentEquip']" class="sk-im"
              :style="`background-image: url('${global_const.assetServer+'equipt/'+findEquip(computeCharTmpl['currentEquip'])['typeIcon']+'.png'}');`"
          />
          <div class="text-xs w-20 absolute left-52 mt-7 text-center">
            {{ computeCharTmpl['currentEquip'] ? findEquipName(computeCharTmpl['currentEquip']) : 'NONE' }}
          </div>
        </div>
        <div class="h-1 w-full divider px-4 my-1"></div>
        <div class="flex flex-row w-full my-2">
          <div class="flex flex-col items-start w-12 ml-4">
            <span style="color: gray">天赋</span>
            <svg class="w-6 h-6" stroke="currentColor" fill="currentColor" viewBox="0 0 24 24">
              <path stroke-width="0.3" :d="global_const.mdiPath['dots-horizontal']"/>
            </svg>
          </div>
          <div class="flex flex-col items-start">
            <template v-for="(k,v) of getTalentCurrent" v-bind:key="v">
              <div class="dropdown dropdown-left dropdown-top dropdown-hover pr-2">
                <label
                    :class="k.isUnlock ? 'bg-base-content/40' : 'bg-error/40'"
                    tabindex="0" class="cursor-pointer text-sm px-1 rounded-xl"
                >
                  {{ k.talent[k.current].name }}
                </label>
                <div
                    style="width: 30rem;bottom:0;"
                    class="delay-200 transition-all p-1 px-2 dropdown-content flex flex-col items-end"
                >
                  <div
                      v-if="!k.isUnlock"
                      class="card bg-base-100 text-warning rounded-md p-0.5 px-2 ring-primary ring-1 mb-1 flex flex-row items-center"
                  >
                    <svg class="w-5 h-5" stroke="currentColor" fill="currentColor" viewBox="0 0 24 24">
                      <path stroke-width="0.3" :d="global_const.mdiPath['alert-octagon-outline']"/>
                    </svg>
                    当前天赋还未解锁，至少需要：{{ gameParser.parseUnlockCond(k.talent[0]) }}
                  </div>
                  <div
                      class="card bg-base-100 rounded-md p-0.5 px-2 ring-primary ring-1"
                      v-html="gameParser.compileDescRichText(k.talent[k.current].description,'',true)"
                  />
                  <TalentTable
                      :game-parser="gameParser"
                      :talent-obj="k"
                  />
                  <div class="card bg-base-100 rounded-md p-0.5 px-2 ring-primary ring-1">模组信息在这里添加/覆写</div>
                </div>
              </div>
            </template>
          </div>
        </div>
      </div>
      <!--      <v-btn class="mt-2" @click="showJson">查看元数据</v-btn>-->
    </div>
    <!--      左下角左侧内容-->
    <div class="absolute flex flex-col-reverse left-2.5 bottom-2.5 ma-3">
      <div class="flex flex-row">
        <div class="outrd opacity-70">
          <img
              class="h-[4.5rem] w-[4.5rem]"
              :style="`filter: invert(${getTheme() ? '0' : '1'})`"
              :src="'/static/charframe/prof-large/icon_profession_'+charData['profession'].toLowerCase()+'_large.png'"
              alt="prof"
          />
        </div>
        <div class="ml-2 h-[4.5rem] w-[7.5rem] flex flex-col-reverse outrd opacity-90">
          <div class="bottom-1 w-full text-center">
            攻击范围({{gameParser.getRangeData(charData['phases'][selectItem['evolvePhase']]['rangeId']).id}})
          </div>
          <div class="w-full text-center -mb-1 h-16 flex items-center justify-center">
            <CharRangeVision
                :max-width-px="120"
                :max-height-px="46"
                :range-data="gameParser.getRangeData(charData['phases'][selectItem['evolvePhase']]['rangeId'])"
            />
          </div>
        </div>
        <div class="ml-2 opacity-90" style="font-size: 15px">
          <div class="outrd h-5 w-[7.5rem] text-center">
            {{ gameParser.position[charData.position] }}
          </div>
          <div class="outrd mt-2 h-11 w-[7.5rem] text-center flex flex-wrap flex-auto justify-center content-center">
            <div
                v-for="(k,v) of charData.tagList"
                v-bind:key="v"
                :class="k.length > 2 ? 'w-full' : 'w-1/2'"
            >{{ k }}
            </div>
          </div>
        </div>
      </div>
      <div class="text-7xl text-white my-1" :style="`text-shadow: 0 0 4px black`">{{ charData.name }}</div>
      <div class="text-3xl text-white -my-1" :style="`text-shadow: 0 0 3px black`">{{ charData["appellation"] }}</div>
      <div
          class="h-9 -m-1"
          :style="`background-image: url('/static/charframe/rarity/rarity_left_${charData.rarity}.png');
              background-position: left;background-repeat: no-repeat;background-size: contain`"/>
      <div class="dropdown dropdown-bottom dropdown-hover">
        <div class="py-1 bg-base-100 text-content w-[20.5rem]">
          <div class="mx-1 flex flex-row">
            <div
                class="h-5 w-5"
                :style="`background-image: url('/static/charframe/char-sort/icon_sort_favorup.png');
              background-position: center;background-repeat: no-repeat;background-size: contain;
              filter: invert(${getTheme() ? '0' : '1'})`"/>
            信赖值
            <svg class="w-5 h-5" stroke="currentColor" fill="currentColor" viewBox="0 0 24 24">
              <path stroke-width="0.3" :d="global_const.mdiPath['fast-forward']"/>
            </svg>
            <div class="spacer"/>
            {{ getFavorPercent(selectItem['favorPoint']) }}%({{ selectItem['favorPoint'] }}/25570)
          </div>
          <div class="mx-1 -my-1 -mt-3">
            <progress
                style="height: 0.25rem"
                class="progress progress-warning bg-gray-200"
                :value="getFavorPercent(selectItem['favorPoint'])" max="200"
            />
          </div>
        </div>
        <div style="bottom:0;" class="delay-200 transition-all dropdown-content pt-0.5 w-[20.5rem]">
          <div class="bg-base-100 text-warning p-0.5 px-2 flex flex-col items-center">
            <div v-for="(k,v) of getFavorAttrFrame()" v-bind:key="v" class="flex flex-row w-full px-4">
              {{ gameParser.charAttrKeyNames[v] || v }}
              <div class="spacer"/>
              {{ k > 0 ? '+' : '' }}{{ k }}
              <div class="spacer"/>
            </div>
          </div>
        </div>
      </div>

      <div class="flex flex-row mb-1">
        <CharAttr
            icon="icon_sort_res_def"
            :value="getCharAttrFrame['magicResistance']"
            :text="getCharAttrFrame['magicResistance']"
        />
        <CharAttr
            class="ml-1"
            icon="icon_sort_atkspeed"
            :text="calcAttackSpeed(getCharAttrFrame['attackSpeed'], getCharAttrFrame['baseAttackTime'])"
        />
      </div>

      <div class="flex flex-row mb-1">
        <CharAttr
            icon="icon_sort_def"
            :value="getCharAttrFrame['def']/7"
            :text="getCharAttrFrame['def']"
        />
        <CharAttr
            class="ml-1"
            icon="icon_sort_block"
            :text="getCharAttrFrame['blockCnt']"
        />
      </div>

      <div class="flex flex-row mb-1">
        <CharAttr
            icon="icon_sort_atk"
            :value="getCharAttrFrame['atk']/10"
            :text="getCharAttrFrame['atk']"
        />
        <CharAttr
            class="ml-1"
            icon="icon_sort_cost"
            :text="getCharAttrFrame['cost']+'费'"
        />
      </div>

      <div class="flex flex-row mb-1">
        <CharAttr
            icon="icon_sort_hp"
            :value="getCharAttrFrame['maxHp']/40"
            :text="getCharAttrFrame['maxHp']"
        />
        <CharAttr
            class="ml-1"
            icon="icon_sort_respawn"
            :text="getRespawnDesc(getCharAttrFrame['respawnTime']) + '(' + getCharAttrFrame['respawnTime'] + '秒)'"
        />
      </div>

      <div class="flex mb-1 px-1.5 w-full opacity-80 text-content attr-fd">
        属性
        <svg class="w-5 h-5" stroke="currentColor" fill="currentColor" viewBox="0 0 24 24">
          <path stroke-width="0.3" :d="global_const.mdiPath['fast-forward']"/>
        </svg>
      </div>
    </div>

    <!--    {{ selectItem }}-->
    <!--    {{ charData }}-->
  </div>
</template>

<style lang="sass">
.text-skill
  font-size: 0.875rem
  line-height: 1rem

.text-sknum
  @apply z-10 flex items-center justify-center absolute text-center w-16
  font-size: 0.625rem
  line-height: 0.875rem

.lh-\.8
  font-size: 0.15rem
  line-height: 0.8rem

.sk-im
  height: 30px
  width: 45px
  margin: -0.125rem 0 0 13.75rem
  position: absolute
  background-size: contain
  background-repeat: no-repeat
  background-position: center center

.outrd
  @apply bg-base-100
  outline: #333333 double

.attr-fd
  background-image: linear-gradient(to right, rgba(177, 177, 177, 1), rgba(177, 177, 177, 0))
  background-image: -o-linear-gradient(to right, rgba(177, 177, 177, 1), rgba(177, 177, 177, 0))
  background-image: -moz-linear-gradient(to right, rgba(177, 177, 177, 1), rgba(177, 177, 177, 0))
  background-image: -webkit-linear-gradient(to right, rgba(177, 177, 177, 1), rgba(177, 177, 177, 0))
</style>