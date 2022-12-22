<script setup lang="ts">


import {Ref} from "vue";
import {useTranslate} from "../../../hooks/translate";
import {getGameUserTroop} from "../../../plugins/axios";
import {accountStore} from "../../../store/account";
import {storeToRefs} from "pinia";
import global_const from "../../../utils/global_const";
import FePagination from "../../element/FePagination.vue";
import CharacterFrame from "../troop/CharacterFrame.vue";

const {translate} = useTranslate();
const account = accountStore();
const {accountInfo} = storeToRefs(account)

const isLoading: Ref = ref(true)
const hasError: Ref = ref(false)
const errItem: Ref = ref([])

const chars: Ref = ref([])
const finRefresh: Ref = ref(true)
const page: Ref = ref(1)

const filterStar: Ref = ref(0)
const filterStarStr = computed(() => {
  return filterStar.value === 0 ? '未筛选' : (filterStar.value) + "☆"
})
// dynamic get list
const rarityList: Ref = ref([])
const profList: Ref = ref([])


const filterProf: Ref = ref("");
const filterProfStr = computed(() => {
  return global_const.profNick[filterProf.value] || filterProf.value || "无"
})

const props = defineProps({
  gameUserName: String,
  gamePlatform: Number,
  clicker: Function,
})
const gameUserID = computed(() => {
  return global_const.getPlatform(props.gamePlatform as number) + props.gameUserName
})

function refreshTroop() {
  finRefresh.value = false
  nextTick(() => {
    finRefresh.value = true
  })
}

function recomputeTroop() {
  chars.value.splice(0)
  errItem.value.splice(0)
  let profEmpty = profList.value.length === 0
  let profKey: Record<string, any> = {}

  let starEmpty = rarityList.value.length === 0
  let starKey: Record<string, any> = {}

  if (profEmpty) {
    profList.value.push("") // empty filter
  }
  if (starEmpty) {
    rarityList.value.push(0) // empty filter
  }
  console.log(accountInfo.value[gameUserID.value].troop.chars)

  for (let char in accountInfo.value[gameUserID.value].troop.chars) {
    let simpChar = accountInfo.value[gameUserID.value].troop.chars[char]
    if (global_const.gameData.characterData[simpChar.charId] == null) {
      hasError.value = true
      errItem.value.push(simpChar.charId)
      continue
    }
    if (profEmpty) {
      profKey[global_const.gameData.characterData[simpChar.charId].profession] = true
    }
    if (starEmpty) {
      starKey[global_const.gameData.characterData[simpChar.charId].rarity] = true
    }
    if (filterStar.value !== 0) {
      if (global_const.gameData.characterData[simpChar.charId].rarity !== filterStar.value - 1) {
        continue
      }
    }
    if (filterProf.value !== '') {
      if (global_const.gameData.characterData[simpChar.charId].profession !== filterProf.value) {
        continue
      }
    }
    simpChar.sortId = simpChar.evolvePhase * 200 + simpChar.level
    if (simpChar['currentTmpl']) {
      simpChar.skin = simpChar['tmpl'][simpChar['currentTmpl']].skinId.replace('#', '_').replace('@', '_')

    } else {
      simpChar.skin = simpChar.skin.replace('#', '_').replace('@', '_')
    }
    simpChar.rarity = global_const.gameData.characterData[simpChar.charId].rarity + 1
    simpChar.levelPercent = Math.round(simpChar.exp * 100 / global_const.gameData.gameConstData.characterExpMap[simpChar.evolvePhase][simpChar.level - 1])
    chars.value.push(simpChar)
  }
  chars.value.sort(function (a: any, b: any) {
    return ((a.sortId < b.sortId) ? 1 : ((a.sortId > b.sortId) ? -1 : 0))
  })
  if (profEmpty) {
    for (let prof in profKey) {
      profList.value.push(prof)
    }
  }
  if (starEmpty) {
    for (let star in starKey) {
      rarityList.value.push(Number(star) + 1)
    }
  }
  refreshTroop()
}

function getTroops(force = false) {
  let userName = props.gameUserName
  let platform = props.gamePlatform
  if (!isLoading.value || force) {
    isLoading.value = true
    getGameUserTroop(userName as string, platform as number).then(
        (suc: any) => {
          console.log(suc)
          account.setAccountInfo(userName || '', platform as number, suc.data)

          recomputeTroop()
          isLoading.value = false
        }
    ).catch(
        (err) => {
          console.log(err)
        }
    )
  }
}

function setFilterStar(i: number) {
  if (filterStar.value === i) {
    filterStar.value = 0
  } else {
    filterStar.value = i
  }
}

function getSkillId(item: any) {
  if (item['currentTmpl']) {
    let tmpl = item['tmpl'][item['currentTmpl']]
    console.log("tmpl ct", tmpl)
    return global_const.gameData.skillData[tmpl.skills[tmpl.defaultSkillIndex].skillId].iconId || 'skchr_empty'
  }
  if (item.defaultSkillIndex === -1)
    return 'skchr_empty'
  return global_const.gameData.skillData[item.skills[item.defaultSkillIndex].skillId].iconId || item.skills[item.defaultSkillIndex].skillId
}

function doShowChar(char: any) {
  console.log("show char", char) // TODO
}

watch(() => filterStar.value, () => {
  page.value = 1
  recomputeTroop()
})
watch(() => filterProf.value, () => {
  page.value = 1
  recomputeTroop()
})

onMounted(() => {
  global_const.requireAssets(["character_data", "skill_data"], () => {
    isLoading.value = false
    getTroops()
  })
})
</script>
<template>
  <div class="text-center flex justify-center bg-base-200 rounded-xl" v-if="isLoading">
    <p>LOADING...</p>
  </div>
  <div v-else class="bg-base-200 rounded-xl">
    <div v-if="hasError" class="p-2">
      <div class="alert alert-warning shadow-lg text-white p-1 px-3 rounded-xl">
        <div>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
               class="stroke-current flex-shrink-0 w-6 h-6">
            <path
                stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            ></path>
          </svg>
          <span>{{ translate("error.data_not_up_to_date", errItem.join(", ")) }}</span>
        </div>
      </div>
    </div>
    <div class="flex justify-center">
      <div class="bg-base-100 px-2 py-1 rounded-xl">
        <p class="text-primary">{{ translate('game.troop.filter_star') }}: {{ filterStarStr }}</p>
        <div class="rating">
          <template v-for="i of rarityList" v-bind:key="i">
            <input v-if="i !== 0" @click="setFilterStar(i)" :checked="filterStar === i" type="radio" name="rating-2"
                   class="mask mask-star-2 bg-primary"/>
          </template>
        </div>
      </div>
      <div class="bg-base-100 px-2 py-1 rounded-xl">
        <p class="text-primary">{{ translate('game.troop.filter_prof') }}: {{ filterProfStr }}</p>
        <select v-model="filterProf" class="mt-1 pl-2 fe-select h-6 w-full max-w-xs">
          <template v-for="i of profList" v-bind:key="i">
            <option :value="i" :selected="filterProf === i">{{ global_const.profNick[i] || i }}</option>
          </template>
        </select>
      </div>
    </div>
    <div class="m-2 flex-col flex items-center">
      <FePagination :total-page="parseInt((chars.length+19)/20)" :page="page" :on-page-change="i=>{page = i}"/>
      <div v-if="finRefresh" class="flex flex-row justify-center flex-wrap">
        <CharacterFrame
            v-for="item in chars.slice((page-1)*20,page*20)" :key="item['instId']"
            :level="item.level"
            :evolve="item.evolvePhase"
            :skill-id="getSkillId(item)"
            :skin-id="item.skin"
            :char-id="item.charId"
            :potential="item.potentialRank"
            :rarity="item.rarity"
            :inst="item.instId"
            :level-percent="item.levelPercent"
            :clicker="doShowChar"
        />
      </div>
      <FePagination :total-page="parseInt((chars.length+19)/20)" :page="page" :on-page-change="i=>{page = i}"/>
    </div>
  </div>
</template>

