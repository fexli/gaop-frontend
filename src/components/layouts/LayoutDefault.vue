<template>
  <div>
    <div v-if="true">
      <!-- app-drawer侧边栏 -->
      <aside-bar/>
      <!--      <app-drawer class="app&#45;&#45;drawer" ref="drawer"/>-->

      <!-- app-toolbar顶层工具栏 -->
      <nav-bar/>
      <!--      <app-toolbar class="app&#45;&#45;toolbar" @side-icon-click="handleDrawerVisiable"/>-->

      <div class="main">
        <!-- Page Wrapper -->
<!--        <div class="page-wrapper">-->
        <div
            class="w-screen h-screen"
            :style="`background: url('../${background}');background-size: cover;background-position: center;`"
        >
          <router-view
              :style="($route.path !== '/innerreader' && $route.path !== '/about') ? `opacity: ${Math.max(0.4,opacity)}` : ''"/>
        </div>
      </div>
      <!-- Go to top -->
<!--      <app-fab/>-->
    </div>
<!--    <v-overlay-->
<!--        id="ovl"-->
<!--        style="transition: filter 1s linear"-->
<!--        :value="ovl"-->
<!--        color="rgb(43,43,43)"-->
<!--        opacity="1"-->
<!--    >-->
<!--      <div class="ovlc">-->
<!--        <img height="320px" :src="lsrc" alt="loading">-->
<!--        <div class="ovlt">{{ txt }}{{ dot }}</div>-->
<!--        <v-progress-linear-->
<!--            :buffer-value="buf"-->
<!--            style="width: 400px"-->
<!--            color="success"-->
<!--            stream-->
<!--            :value="val"-->
<!--        ></v-progress-linear>-->
<!--      </div>-->
<!--    </v-overlay>-->
  </div>
</template>
<script lang="ts" setup>
import {appStore} from "../../store/app";
import {storeToRefs} from "pinia/dist/pinia";
import NavBar from "./default/NavBar.vue";
import AsideBar from "./default/AsideBar.vue";
import Translate from "./default/nav/Translate.vue";

const _app = appStore()
const {background,opacity} = storeToRefs(_app)

const reloadBG = ref(true);
const fin = ref(false);
const buf = ref(0);
const val = ref(0);
const txt = ref('少女祈祷中');
const dot = ref('');
const ovl = ref(true);
const showDrawer = ref(true);

</script>
<!--<script>-->
<!--import AppDrawer from '@/components/AppDrawer'-->
<!--import AppToolbar from '@/components/AppToolbar'-->
<!--import AppFab from '@/components/AppFab'-->
<!--import {PushableDict} from "@/utils/recruit_planner";-->

<!--export default {-->
<!--  data() {-->
<!--    return {-->
<!--      lsrc: `/static/skaddd/${this.GLOBAL.loadingGIF[Math.round(Math.random() * (this.GLOBAL.loadingGIF.length - 1))]}.gif`,-->
<!--    }-->
<!--  },-->
<!--  watch: {-->
<!--    val(v) {-->
<!--      if (v <= 99) return 0-->
<!--      setTimeout(() => {-->
<!--        this.fin = true-->
<!--        let d = document.getElementById('ovl')-->
<!--        if (!d) return -1-->
<!--        d.style.filter = 'opacity(0)'-->
<!--        setTimeout(() => {-->
<!--          this.ovl = false-->
<!--        }, 1000)-->
<!--      }, 200)-->
<!--    }-->
<!--  },-->
<!--  created() {-->
<!--    console.log("created", this.$store.getters.getBackground)-->
<!--    if (this.$store.getters.getBackground === '') {-->
<!--      this.$store.commit("setBackground", this.get_rand_bg())-->
<!--    }-->
<!--    // console.log("this.$refs.drawer.$el.offsetHeight:", this.$refs.drawer.$el.offsetHeight)-->

<!--    // setTimeout(() => {-->
<!--    //   console.log("window.getComputedStyle(this.$refs.drawer.$el).height:", window.getComputedStyle(this.$refs.drawer.$el).height)-->
<!--    // }, 1000)-->
<!--  },-->
<!--  methods: {-->
<!--    do_reload() {-->
<!--      const that = this-->
<!--      this.reloadBG = false-->
<!--      this.$nextTick(() => {-->
<!--        that.reloadBG = true-->
<!--      })-->
<!--    },-->
<!--    dot_run() {-->
<!--      switch (this.dot) {-->
<!--        case "...":-->
<!--          this.dot = ""-->
<!--          break-->
<!--        default:-->
<!--          this.dot += "."-->
<!--          break-->
<!--      }-->
<!--      if (this.fin) {-->
<!--        return-->
<!--      }-->
<!--      setTimeout(() => {-->
<!--        this.dot_run()-->
<!--      }, 400)-->
<!--    },-->
<!--    handleDrawerVisiable() {-->
<!--      this.$refs.drawer.toggleDrawer()-->
<!--    },-->
<!--    getLocalFile(url, asyncs = false, callback = null, method = 'GET', mime = 'application/json') {-->
<!--      let xhr = new XMLHttpRequest()-->
<!--      if (asyncs) {-->
<!--        xhr.onloadend = () => {-->
<!--          if (callback) {-->
<!--            callback(xhr)-->
<!--          }-->
<!--        }-->
<!--      }-->
<!--      xhr.overrideMimeType(mime)-->
<!--      xhr.open(method, url, asyncs)-->
<!--      xhr.send(null)-->
<!--      if (!asyncs) {-->
<!--        return xhr.response-->
<!--      }-->
<!--    }-->
<!--  },-->
<!--  activated() {-->
<!--    const that = this-->
<!--    window.changeBg = function (bg) {-->
<!--      if (bg) {-->
<!--        that.$store.commit("setBackground", bg)-->
<!--        that.do_reload()-->
<!--      } else {-->
<!--        that.$store.commit("setBackground", that.get_rand_bg())-->
<!--      }-->
<!--    }-->
<!--    this.dot_run()-->
<!--    const load_list = [-->
<!--      {-->
<!--        name: 'item_data',-->
<!--        title: '物品数据',-->
<!--        field: 'itemData',-->
<!--        loc: '/static/gamedata/excel/item_table.json',-->
<!--        parser: (resp) => {-->
<!--          return JSON.parse(resp)['items']-->
<!--        }-->
<!--      },-->
<!--      {-->
<!--        name: 'character_data',-->
<!--        title: '干员数据',-->
<!--        field: "characterData",-->
<!--        loc: '/static/gamedata/excel/character_table.json',-->
<!--        parser: (resp) => {-->
<!--          let data = JSON.parse(resp)-->
<!--          let rT = new PushableDict([1, 2, 3, 4, 5, 6])-->
<!--          for (let entr of Object.values(data)) {-->
<!--            rT.push(entr.rarity + 1, entr.name)-->
<!--          }-->
<!--          that.GLOBAL.charRateTag = rT-->
<!--          return data-->
<!--        }-->
<!--      },-->
<!--      {-->
<!--        name: 'game_const_data',-->
<!--        title: '常量数据',-->
<!--        field: 'gameConstData',-->
<!--        loc: '/static/gamedata/excel/gamedata_const.json',-->
<!--      },-->
<!--      {-->
<!--        name: 'skill_data',-->
<!--        title: '技能数据',-->
<!--        field: 'skillData',-->
<!--        loc: '/static/gamedata/excel/skill_table.json',-->
<!--      },-->
<!--      {-->
<!--        name: 'building_data',-->
<!--        title: '基建数据',-->
<!--        field: 'buildingData',-->
<!--        loc: '/static/gamedata/excel/building_data.json',-->
<!--      },-->
<!--      {-->
<!--        name: 'uniequip_table',-->
<!--        title: '模组数据',-->
<!--        field: 'uniequipTable',-->
<!--        loc: '/static/gamedata/excel/uniequip_table.json',-->
<!--      },-->
<!--      {-->
<!--        name: 'gacha_data',-->
<!--        title: '卡池数据',-->
<!--        field: 'gachaData',-->
<!--        loc: '/static/gamedata/excel/gacha_table.json',-->
<!--        parser: (resp) => {-->
<!--          let data = JSON.parse(resp)-->
<!--          that.GLOBAL.recruitTags = {}-->
<!--          for (let tags of data.gachaTags) {-->
<!--            that.GLOBAL.recruitTags[tags.tagId.toString()] = tags-->
<!--          }-->
<!--          that.GLOBAL.recruitPool = {}-->
<!--          for (let Tt of data.recruitPool['recruitTimeTable']) {-->
<!--            that.GLOBAL.recruitPool[Tt['timeLength'].toString()] = Tt-->
<!--          }-->
<!--          return data-->
<!--        }-->
<!--      },-->
<!--      {-->
<!--        name: 'recruit_data',-->
<!--        title: '公招数据',-->
<!--        field: 'recruitData',-->
<!--        loc: '/static/recruit/RecruitData.json',-->
<!--      },-->
<!--      {-->
<!--        name: 'stage_table',-->
<!--        title: '关卡数据',-->
<!--        field: 'stageTable',-->
<!--        loc: '/static/gamedata/excel/stage_table.json',-->
<!--      }-->
<!--    ]-->
<!--    for (let task of load_list) {-->
<!--      this.buf += 100 / load_list.length-->
<!--      if (!this.GLOBAL[task.field]) {-->
<!--        console.log('try fetch ' + task.name)-->
<!--        this.txt = "获取" + task.title + "中"-->
<!--        this.getLocalFile(task.loc, true, (xhr) => {-->
<!--          if (task.parser !== undefined) {-->
<!--            try {-->
<!--              that.GLOBAL[task.field] = task.parser(xhr.response)-->
<!--            } catch (e) {-->
<!--              console.error(`catch exception at ${task.name} ${e}`)-->
<!--            }-->
<!--          } else {-->
<!--            this.GLOBAL[task.field] = JSON.parse(xhr.response)-->
<!--          }-->
<!--          that.val += 100 / load_list.length-->
<!--        })-->
<!--      } else {-->
<!--        console.log('from cache load' + task.name)-->
<!--        that.val += 100 / load_list.length-->
<!--      }-->
<!--    }-->
<!--  },-->
<!--}-->
<!--</script>-->

<style lang="sass" scoped>
.page-wrapper
  min-height: calc(100vh - 112px - 48px)

.ovlt
  font-size: 25px

.ovlc
  display: flex
  flex-direction: column
  align-items: center

.layout-default
  height: 100%
  width: 100%
  position: fixed
  top: 0
  left: 0
  content: ""
  z-index: 0
</style>
