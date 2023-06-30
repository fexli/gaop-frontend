<link rel="stylesheet" href="../../../assets/fonts/aewide/aewide.css">
<script setup lang="ts">
import global_const from "../../../utils/global_const";

defineProps({
  rarity: {
    type: [Number, String]
  },
  charId: String,
  equip: String,
  skinId: String,
  skillId: String,
  potential: {
    type: [Number, String]
  },
  evolve: {
    type: [Number, String]
  },
  level: {
    type: [Number, String]
  },
  levelPercent: {
    type: [Number, String]
  },
  clicker: Function,
  inst: {
    type: [Number, String]
  },
})

function findEquip(eq: string) {
  return eq ? global_const.gameData.uniequipTable['equipDict'][eq] : null
}

</script>
<template>
  <div style="width: 12vw;height: 23vw" class="card m-1">
    <!--    <img-->
    <!--        :src="'static\\charframe\\frame.png'"-->
    <!--        alt="frame" class="char-image"-->
    <!--        @click="handleClicker"/>-->
    <img
        :src="'static\\charframe\\bgrd_'+Math.max(3,rarity)+'.png'"
        alt="bgrd"
        class="char-image char-image__bgrd"/>
    <img
        :src="'static\\charframe\\upper_'+rarity+'.png'"
        alt="uprarity"
        class="char-image char-image__upper"/>
    <img :src="'static\\charframe\\upper_shadow.png'"
         alt="upshadow"
         class="char-image char-image__upper-shadow"/>
    <img :src="global_const.assetServer+'charpor/'+skinId+'.png'"
         alt="skin"
         class="char-image char-image__skin"
         @click="clicker && clicker(inst)"/>
    <img
        :src="'static\\charframe\\light_'+rarity+'.png'"
        alt="ltrarity"
        class="char-image char-image__light"/>
    <img
        :src="'static\\charframe\\light_bottom.png'"
        alt="ltbot"
        class="char-image char-image__light-bottom"/>
    <img
        :src="'static\\charframe\\shadow_'+Math.max(3,rarity)+'.png'"
        alt="shadowrarity"
        class="char-image char-image__shadow"/>
    <img
        :src="'static\\charframe\\icon_profession_'+global_const.gameData.characterData[charId]['profession'].toLowerCase()+'.png'"
        alt="prof"
        class="char-image char-image__profession"/>
    <img
        :src="'static\\charframe\\star_'+rarity+'.png'"
        alt="star"
        class="char-image char-image__star"/>
    <img
        v-if="evolve !== 0"
        :src="'static\\charframe\\ev_'+evolve+'.png'"
        alt="ev"
        class="char-image char-image__ev"/>
    <div class="char-image">
      <img
          :src="'static\\charframe\\exp_empty_lb.png'"
          alt="exp"
          class="char-image char-image__exp"
      />
      <!--      <v-progress-circular-->
      <!--          :rotate="-90"-->
      <!--          :size="size"-->
      <!--          :width="swidth"-->
      <!--          :value="levelPercent"-->
      <!--          color="rgb(253,213,47)"-->
      <!--          class="proc-level"-->
      <!--      />-->
    </div>
    <div class="flex char-image char-image__level">
      {{ level }}
    </div>
    <img
        v-if="potential !== 0"
        :src="'static\\charframe\\potential_frame.png'"
        alt="potframe"
        class="char-image char-image__potential"/>
    <img
        v-if="potential !== 0"
        :src="'static\\charframe\\potential_'+potential+'.png'"
        alt="pot"
        class="char-image char-image__potential"/>
    <img
        :src="global_const.assetServer+'skills/skill_icon_'+skillId+'.png'"
        alt="skico"
        class="char-image char-image__skill"/>
    <div
        v-if="equip" class="char-image char-image__equip"
        :class="findEquip(equip)['typeIcon'] === 'original' ? 'scale-[.6] mt-1' : ''"
        style="background-repeat: no-repeat;background-position: center;background-size: contain"
        :style="`background-image: url('${global_const.assetServer+'equiptc/'+findEquip(equip)['typeIcon']+'.png'}');`"
    />
    <div class="char-image char-image__name">{{ global_const.gameData.characterData[charId].name }}</div>
    <div style="position:absolute;width: 100%;height: 100%" @click="clicker && clicker(inst)"></div>
  </div>
</template>

<style lang="sass">
.char-image
  color: white
  position: absolute
  border-radius: 0 !important

  &__bgrd
    width: 11.09vw
    left: 0.32vw
    top: 1.55vw

  &__skin
    width: 11.01vw
    left: 0.40vw
    top: 0.47vw

  &__upper
    left: 0.16vw
    width: 6.2vw
    height: 2.95vw

  &__upper-shadow
    left: -0.61vw
    top: 0.16vw
    width: 7.6vw
    height: 4.5vw

  &__light
    width: 11.09vw
    height: 9.69vw
    left: 0.32vw
    top: 10.85vw

  &__light-bottom
    width: 11.09vw
    height: 9.69vw
    left: 0.32vw
    top: 12.87vw

  &__shadow
    left: -0.38vw
    top: 14.19vw
    width: 12.02vw
    height: 8.84vw

  &__profession
    width: 2.33vw
    height: 2.33vw
    left: 0.4vw
    top: 0.23vw

  &__star
    left: 2.57vw
    height: 2.02vw

  &__ev
    left: 0.63vw
    top: 12.17vw
    width: 4.88vw
    height: 4.88vw

  &__exp
    @apply relative
    left: 0
    top: 16.51vw
    width: 5.89vw
    height: 5.58vw

  &__potential
    right: 1vw
    top: 14.75vw
    width: 2.1vw
    background-color: rgba(0, 0, 0, 0.2)


  &__level
    @apply text-center justify-center
    font-family: 'AEwide', serif
    left: 1.2vw
    width: 3.63vw
    top: 17.28vw
    padding: 0
    font-size: 2.79vw

  &__skill
    width: 3.18vw
    left: 7.84vw
    top: 17.13vw

  &__name
    right: 1.2vw
    top: 20.31vw
    font-size: 1.63vw

  &__equip
    right: 3.3vw
    top: 17vw
    width: 4vw
    height: 4vw

.proc-level
  position: absolute
  FILTER: opacity(0.6)
  //-webkit-box-reflect: below 0 linear-gradient(rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 1) 100%)
  left: 0.47vw
  top: 16.9vw
</style>
