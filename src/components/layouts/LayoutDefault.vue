<template>
  <div v-if="true">
    <aside-bar/>
    <nav-bar/>
    <div
        class="main"
    >
      <div
          class="h-full w-full fixed top-0 left-0 z-0"
          :style="`background: url('../${background}');background-size: cover;background-position: center;`"
      />
      <div class="w-full mb-7 pt-[4.2rem] px-4 z-30">
        <router-view/>
      </div>
    </div>
  </div>
  <AssetLoading/>
</template>
<script lang="ts" setup>
import {appStore} from "../../store/app";
import {storeToRefs} from "pinia/dist/pinia";
import NavBar from "./default/NavBar.vue";
import AsideBar from "./default/AsideBar.vue";
import Translate from "./default/nav/Translate.vue";
import AssetLoading from "../parts/global/AssetLoading.vue";

const _app = appStore()
const {background} = storeToRefs(_app)

const reloadBG = ref(true);
const fin = ref(false);
const buf = ref(0);
const val = ref(0);
const txt = ref('少女祈祷中');
const dot = ref('');
const ovl = ref(true);
const showDrawer = ref(true);

</script>

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

<style lang="sass" scoped>
.page-wrapper
  min-height: calc(100vh - 112px - 48px)

</style>
