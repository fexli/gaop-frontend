<script setup lang="ts">
import global_const from "../utils/global_const";


</script>
<template>
  <div class="flex justify-center">
    <div class="container info-shadow text-2xl" style="position: relative;">
      <div class="text-h2 text-center ma-2">Arknights Offline Pro V</div>
      <div class="text-center">v{{ global_const.aopVersion }}</div>
      <div class="text-center">fully designed by fe_x_li</div>
      <div class="text-center">
        #SPECIAL THANKS TO
        <a href="https://github.com/wg138940">Ooooooutdated</a> &
        <a href="https://github.com/skadiD">SkadiD</a> &
        <a href="https://github.com/jackjieYYY">欧皇大佬GK</a>
      </div>
      <div class="ma-2">#0x01 使用说明</div>
      <div class="ma-4">
        ArknightsOfflinePro是基于网页版本的明日方舟游戏托管平台，主要为当前没有时间进行游戏或咸鱼的玩家提供在线版本的自动化托管平台
      </div>

      <div class="ma-2">#0x02 计划任务</div>
      <div class="ma-4">
        [<span style="color: red">M</span>]短期内计划
        [<span style="color: deepskyblue">C</span>]当期计划
        [<span style="color: rosybrown">S</span>]长期计划
        [<span style="color: mediumseagreen">F</span>]未来期望
        [<span style="color: mediumpurple">O</span>]已完成
      </div>
      <div class="flex flex-row">
        <div class="flex flex-col ma-3 w-1/2">
          <div class="mr-3">·> [S] 模拟战斗系统(内测中)</div>
          <div class="mr-3">·> [S] 任务WebUI</div>
          <div class="mr-3">·> [S] 基建WebUI</div>
          <div class="mr-3">·> [S] 任务一键领取</div>
          <div class="mr-3">·> [S] 物品使用</div>
        </div>
        <div class="flex flex-col ma-3">
          <div class="mr-3">·> [F] 背包物品使用</div>
          <div class="mr-3">·> [F] 干员一键升级&精英化</div>
          <div class="mr-3">·> [F] 账号信息修改</div>
        </div>
      </div>
      <div class="ma-2">#0x03 历史版本 TODO</div>
      <!--      <update-history :logs="updateLogs"></update-history>-->
      <div style="height: 1200px"></div>
      <p class="ml-4">人总不可能一直为了追名逐利而生存，追寻自己的所喜所爱亦是一种不错的选择</p>
      <div class="spacer"/>
      <div class="text-right">DFVB Studio</div>
      <p class="text-right">fe_x_li@2022-2023</p>
    </div>
  </div>
</template>

<style lang="sass" scoped>
.info-shadow
  text-shadow: 2px 2px 3px black
</style>