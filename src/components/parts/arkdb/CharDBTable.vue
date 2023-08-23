<script setup lang="ts">

import {onMounted, Ref} from "vue";
import global_const from "../../../utils/global_const";
import FeImg from "../../element/FeImg.vue";
import {GameInfoParser} from "../../../utils/gameInfoParser";
import {useTranslate} from "../../../hooks/translate";

const {translate} = useTranslate()
const router = useRouter();

const isLoading: Ref<boolean> = ref(true)


function getAvatar(id: string, data: Record<string, any>): string {
  return data.phases.length >= 3 ? id + "_2" : id
}

const gameParser = new GameInfoParser()

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


function setFilterStar(i: number) {
  if (filterStar.value === i) {
    filterStar.value = 0
  } else {
    filterStar.value = i
  }
}

function clickChar(charId: string) {
  console.log(charId)
  router.push("/db/char/" + charId)
}

function recomputeTroop() {
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
  for (let charId in global_const.gameData.characterData) {
    let charData = global_const.gameData.characterData[charId]

    if (profEmpty) {
      profKey[charData.profession] = true
    }
    if (starEmpty) {
      starKey[charData.rarity] = true
    }
  }
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
}

const filteredChars = computed(() => {
  let data = []
  for (let charId in global_const.gameData.characterData) {
    let char = {
      charId: charId,
      ...global_const.gameData.characterData[charId]
    }
    data.push(char)
  }
  return data.filter((data: Record<string, any>) => {
    if (filterProf.value === ""){
      return data.profession !== "TRAP" && data.profession !== "TOKEN" && !(filterStar.value !== 0 && data.rarity !== filterStar.value - 1)
    }
    return !(filterStar.value !== 0 && data.rarity !== filterStar.value - 1) &&
        !(filterProf.value !== "" && data.profession !== filterProf.value)
  })
})
onMounted(() => {
  global_const.requireAssets(["character_data", "skill_data", "game_const_data", "uniequip_table"], () => {
    recomputeTroop()
    isLoading.value = false
  })
})

</script>
<template>
  <div class="bg-base-200">
    <div v-if="isLoading">
      Loading...
    </div>
    <template v-else>
      <div class="flex justify-center mb-2">
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
      <div class="mb-3 grid grid-12 gap-1">
        <template v-for="(charData,k) of filteredChars" v-bind:key="k">
          <div
              class="ring-1 ring-primary rounded-md"
              @click="clickChar(charData.charId)"
          >
            <div class="flex">
              <FeImg
                  class="border border-base-content rounded-md w-16 h-16 m-1"
                  :src="global_const.assetServer+'avatar/ASSISTANT/'+getAvatar(charData.charId,charData)+'.png'"
              />
              <div>
                <img :src="'static\\charframe\\star_'+(charData.rarity+1)+'.png'" alt="star" class="mt-1"/>
                <div class="text-primary font-bold text-lg"> {{ charData.name }}</div>
              </div>
            </div>
            <div class="px-1 pb-1">
              <div class=""> {{ global_const.profNick[charData.profession] || charData.profession }} |
                {{ gameParser.position[charData.position] }}
              </div>
              <div>{{ charData.itemUsage || '无描述' }}</div>
            </div>
          </div>
        </template>
      </div>
    </template>
  </div>
</template>


<style>
.grid-12 {
  grid-template-columns: repeat(auto-fill, minmax(18rem, 1fr))
}
</style>