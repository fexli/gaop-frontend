<script setup lang="ts">
import global_const from "../../../utils/global_const";
import ProgressBar from "./ProgressBar.vue";
import {Ref} from "vue";
import {PushableDict} from "../../../utils/recruit_planner";
import {start} from "nprogress";

const overlay: Ref = ref(true);
const text: Ref = ref('少女祈祷中');
const percent: Ref = ref('');
const dot: Ref = ref('');
const buf: Ref = ref(0);
const val: Ref = ref(0);
const tmlVal: Ref = ref(0);
const max: Ref = ref(0);
const loadingFinished: Ref = ref(false);
const loadingSrc = `/static/skaddd/${global_const.loadingGIF[Math.round(Math.random() * (global_const.loadingGIF.length - 1))]}.gif`;

watch(() => val.value, (v) => {
  if (v === max.value) {
    text.value = '数据获取完成';
    percent.value = ''
    overlay.value = false;
    dot.value = '';
    setTimeout(() => {
      loadingFinished.value = true
    }, 1000)
  }
})

function dotRun() {
  if (!overlay.value) {
    return
  }
  switch (dot.value) {
    case "...":
      dot.value = ""
      break
    default:
      dot.value += "."
      break
  }
  setTimeout(dotRun, 500)
}

dotRun()

const load_list: Record<string, any>[] = [
  {
    name: 'item_data',
    title: '物品数据',
    field: 'itemData',
    loc: 'excel/item_table.json',
    parser: (resp: any) => {
      return JSON.parse(resp)['items']
    }
  },
  {
    name: 'character_data',
    title: '干员数据',
    field: "characterData",
    loc: 'excel/character_table.json',
    parser: (resp: any) => {
      let data = JSON.parse(resp)
      let rT = new PushableDict([1, 2, 3, 4, 5, 6])
      for (let entr of Object.values(data)) {
        //@ts-ignore
        rT.push(entr.rarity + 1, entr.name)
      }
      global_const.gameData.charRateTag = rT
      global_const.onGameData("charRateTag")
      return data
    }
  },
  {
    name: 'game_const_data',
    title: '常量数据',
    field: 'gameConstData',
    loc: 'excel/gamedata_const.json',
  },
  {
    name: 'skill_data',
    title: '技能数据',
    field: 'skillData',
    loc: 'excel/skill_table.json',
  },
  {
    name: 'building_data',
    title: '基建数据',
    field: 'buildingData',
    loc: 'excel/building_data.json',
  },
  {
    name: 'uniequip_table',
    title: '模组数据',
    field: 'uniequipTable',
    loc: 'excel/uniequip_table.json',
  },
  {
    name: 'skin_table',
    title: '皮肤数据',
    field: 'skinTable',
    loc: 'excel/skin_table.json',
  },
  {
    name: 'gacha_data',
    title: '卡池数据',
    field: 'gachaData',
    loc: 'excel/gacha_table.json',
    parser: (resp: any) => {
      let data = JSON.parse(resp)
      global_const.gameData.recruitTags = {}
      for (let tags of data.gachaTags) {
        global_const.gameData.recruitTags[tags.tagId.toString()] = tags
      }
      global_const.onGameData("recruitTags")
      global_const.gameData.recruitPool = {}
      for (let Tt of data.recruitPool['recruitTimeTable']) {
        global_const.gameData.recruitPool[Tt['timeLength'].toString()] = Tt
      }
      global_const.onGameData("recruitPool")
      return data
    }
  },
  {
    name: 'recruit_data',
    title: '公招数据',
    field: 'recruitData',
    loc: '/static/recruit/RecruitData.json',
    isStatic: true,
  },
  {
    name: 'stage_table',
    title: '关卡数据',
    field: 'stageTable',
    loc: 'excel/stage_table.json',
  }
]

const config = {
  url: "http://mc.mesord.com:8999/gamedata/"
}

function getLocalFile(url: string, asyncs = false, callback: Function | null = null, method = 'GET', mime = 'application/json') {
  let xhr = new XMLHttpRequest()
  if (asyncs) {
    xhr.onprogress = (e) => {
      if (e.lengthComputable) {
        tmlVal.value = e.loaded / e.total
        percent.value = (e.loaded * 100 / e.total).toFixed(1) + '%'
      }
    }
    xhr.onloadend = () => {
      if (callback) {
        callback(xhr)
      }
    }
  }
  xhr.overrideMimeType(mime)
  xhr.open(method, url, asyncs)
  xhr.send(null)
  if (!asyncs) {
    return xhr.response
  }
}

function startLoadAssets() {
  // reset all param
  val.value = 0
  buf.value = 0
  max.value = load_list.length
  loadNextAsset()
}

function loadNextAsset() {
  for (let task of load_list) {
    if (task.isFinished) {
      continue
    }
    buf.value += 1
    if (!global_const.gameData[task.field]) {
      console.log('try fetch ' + task.name)
      text.value = "获取" + task.title + "中"
      getLocalFile((task.isStatic ? '' : config.url) + task.loc, true, (xhr: any) => {
        if (task.parser !== undefined) {
          try {
            global_const.gameData[task.field] = task.parser(xhr.response)
            global_const.onGameData(task.field)
          } catch (e) {
            console.error(`catch exception at ${task.name} ${e}`)
          }
        } else {
          global_const.gameData[task.field] = JSON.parse(xhr.response)
          global_const.onGameData(task.field)
        }
        task.isFinished = true
        val.value += 1
        tmlVal.value = 0
        text.value = task.title + "获取完成"
        percent.value = ''
        loadNextAsset()
      })
    } else {
      console.log('from cache load' + task.name)
      task.isFinished = true
      val.value += 1
      tmlVal.value = 0
      text.value = task.title + "获取完成"
      percent.value = ''
      loadNextAsset()
    }
    return
  }
}

startLoadAssets()
</script>
<template>
  <div v-if="!loadingFinished" class="overlay bg-base-200 asset-loading" :style="`filter: opacity(${overlay ? '1':'0'})`">
    <div class="flex flex-col items-center">
      <div
          :style="`height: 320px;width: 340px;background-repeat: no-repeat;background-size: contain;background-image: url('${loadingSrc}')`"
      />
      <div class="text-primary text-xl">{{ text }}{{ percent }}{{ dot }}</div>
      <ProgressBar :buf-value="buf" :value="val+tmlVal" :loading="val+tmlVal===0" :max="max"/>
    </div>
  </div>
</template>

