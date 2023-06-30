<script setup lang="ts">
import {accountStore} from "../../../store/account";
import {storeToRefs} from "pinia";
import {onMounted, Ref} from "vue";
import FeImg from "../../element/FeImg.vue";
import global_const from "../../../utils/global_const";
import formatter from "../../../utils/formatter";

const props = defineProps({
  userCard: Object,
  gameUserName: String,
})
const account = accountStore();
const {accountInfo} = storeToRefs(account)
const warnHidden: Ref<Boolean> = ref(false)
const loadComplete: Ref<Boolean> = ref(false)
const bgp:Ref<string> = ref("center")

function setCharPos() {
  let gChar = global_const.gameData.charPosData[props.userCard!['secretary']['skin'] || '']
  console.log("setCharPos", gChar)
  if (gChar) {
    //@ts-ignore
    let x = parseInt(100 * (gChar['pv'][0] + gChar['of'][0] / gChar['sz'][0])) + '%'
    //@ts-ignore
    let y = parseInt(100 * (gChar['pv'][1] + gChar['of'][1] / gChar['sz'][1])) + '%'
    console.log("setCharPos", x, y)
    bgp.value = x + " " + y
  }
}

onMounted(() => {
  global_const.requireAssets(["charpack_pos"], () => {
    setCharPos()
    loadComplete.value = true
  })
})
</script>
<template>
  <div class="outpacker bg-base-100 rounded-xl select-none text-white" v-if="loadComplete">
    <div class="ucard-full-overlay"/>
    <div class="ucard-full-ren"/>
    <FeImg
        class="ucard-full-camplogo ucard-full-item"
        :src="global_const.assetServer+'camplogo/logo_'+userCard['secretary']['camp']+'.png'"
    />
    <FeImg
        :background-position="bgp"
        class="background-image-card-full-thin"
        :src="global_const.assetServer+'charpack/'+userCard['secretary']['skin']+'.png'"
    />
    <div class="ucard-full-overlay__lr ucard-full-item abs-0"></div>
    <div class="ucard-full-overlay__rl ucard-full-item abs-0"></div>
    <div class="ucard-full-reg ucard-full-item flex">
      <div class="ucard-full-reg__register">入职日</div>
      <div class="ucard-full-reg__register-time">
        {{ formatter.formatDate(accountInfo[gameUserName].status.registerTs * 1000, 'yyyy-MM-dd') }}
      </div>
    </div>
    <img src="/static/usercard/decorate_c2.png"
         class="ucard-full-item ucard-full-deco"
         alt="deco1"
         style="top: 55px"/>
    <img src="/static/usercard/decorate_c.png"
         class="ucard-full-item ucard-full-deco"
         alt="deco2"
         style="top: 75px"/>
    <img src="/static/usercard/decorate_x.png"
         class="ucard-full-item ucard-full-deco"
         alt="deco3"
         style="top: 95px"/>
    <div class="ucard-full-ast ucard-full-item flex flex-col">
      <div class="ucard-full-ast__assist-title">助理</div>
      <div class="ucard-full-ast__assist-name ucard-text-shadow">{{ userCard.secretary.name }}</div>
      <div class="ucard-full-ast__assist-name-eng ucard-text-shadow">{{ userCard.secretary.name_en }}</div>
    </div>
    <img
        src="/static/usercard/atk_progress.png"
        class="ucard-full-item ucard-full-deco"
        style="top: 220px;width: 65px;height: 116px"
    />
    <div class="ucard-full-item" style="left: 28px;top:230px;font-size: 20px">作战进度</div>
    <div class="ucard-full-item flex" style="left: 100px;top:257px;font-size: 55px;align-items: center;">
      <div class="ucard-text-shadow">
        {{ userCard.stageP.code }}/
      </div>
      <div style="font-size: 20px" class="ucard-text-shadow">
        / {{ userCard.stageP.name }}
      </div>
    </div>
    <div class="ucard-full-item ucard-text-shadow" style="left: 25px;top: 340px;font-size: 18px">家具保有数</div>
    <div class="ucard-full-item ucard-text-shadow"
         style="left: 25px;top: 362px;font-size: 18px;font-family: 'AEwide', cursive;">
      {{ userCard.furniCnt || 'N+' }}
    </div>
    <FeImg
        class="ucard-full-item"
        style="left: 25px;top: 390px;width: 160px;height: 25px" src="/static/usercard/hr_num_empty.png"
    />
    <div class="ucard-full-item ucard-full-hire-title">雇佣干员数</div>
    <div class="ucard-full-item ucard-full-hire-num">{{ userCard.charNum }}</div>

    <!--玩家头像&等级栏-->
    <div class="ucard-full-item ucard-full-avatar flex">
      <FeImg
          class="hidden md:flex"
          :src="global_const.assetServer+'avatar/'+(userCard.avatar.type ? userCard.avatar.type.replace('ICON','DEFAULT') : 'DEFAULT')+'/'+(userCard.avatar.id ? userCard.avatar.id.replace('@','_').replace('#','_'): 'avatar_def_01')+'.png'"
          style="height: 100px;width: 100px;"
      ></FeImg>
      <div class="flex flex-col" style="padding: 3px;margin-left: 7px;width: 286px">
        <div class="ucard-full-username bg-base-200 bg-opacity-40 rounded-xl px-1">
          {{
            'Dr.' + accountInfo[gameUserName].status.nickName + '#'
            + accountInfo[gameUserName].status.nickNumber
          }}
        </div>
        <div class="ucard-full-usercheck">
          {{ accountInfo[gameUserName].status.resume }}
        </div>
      </div>
    </div>
    <FeImg
        class="ucard-full-item ucard-full-avatar-frame hidden md:flex"
        :src="'/static/usercard/avatar_frame.png'"
        style="height: 100px;width: 100px;"
    ></FeImg>
    <img
        class="ucard-full-item ucard-full-level hidden md:flex"
        src="/static/usercard/level_box1.png"
        alt="level_box"
    />
    <div class="ucard-full-item ucard-full-level__text flex flex-col hidden md:flex">
      <div style="font-size: 20px">{{ accountInfo[gameUserName].status.level }}</div>
    </div>
    <div class="ucard-full-item ucard-full-level-title hidden md:flex">LV</div>
    <div class="ucard-full-overlay ucard-full-item hidden md:flex"></div>
    <div
        class="ucard-full-item ucard-full-warn flex flex-col"
        :class="warnHidden?'hidden':''">
      <div class="ucard-full-warn-content">网站运营不易,且用且珍惜</div>
      <div class="ucard-full-warn-content">为方便您的游戏体验，在您的允许下网站将<span style="color: red">加密保存</span>
      </div>
      <div class="ucard-full-warn-content">您的游戏账号以便在您停止托管后快速重新开启托管</div>
      <div class="ucard-full-warn-content">在您删除账号后网站将<span style="color: red">完全移除</span>您的账号数据
      </div>
      <div class="ucard-full-warn-content text-warning">请勿肆处宣扬本网站,请勿泄露您的任何游戏账号</div>
      <div class="ucard-full-warn-content"><span style="color: cyan">感谢您相信并使用GAOP工程</span>
      </div>
    </div>
    <div
        class="ucard-full-item ucard-full-warn"
        @click="warnHidden = true"
    ></div>
  </div>
</template>

<style lang="sass">
.background-image-card-full-thin
  margin: auto
  position: absolute
  height: 150%
  width: 150%
  left: -30%
  top: -7%

.abs-0
  position: absolute
  top: 0
  left: 0
  width: 100%
  height: 100%

.outpacker
  margin: auto
  position: relative
  overflow: hidden
  width: 100%
  height: 600px

.ucard-full-overlay
  background-image: url("/static/usercard/bkensure.png")
  background-repeat: no-repeat
  background-size: cover
  background-position: center
  width: 100%
  height: 100%

  &__lr
    background: -webkit-gradient(linear, 0 0, 40% 0, from(rgba(30, 30, 30, 0.6)), to(rgba(30, 30, 30, 0.1)))

  &__rl
    background: -webkit-gradient(linear, 50% 0, 100% 0, from(rgba(30, 30, 30, 0)), to(rgba(30, 30, 30, 0.5)))

.ucard-full-item
  position: absolute
  font-size: 15px
  margin: 2px

.ucard-full-ren
  right: 20px
  top: 30px
  position: absolute
  height: 537px
  width: 151px
  background-image: url("/static/usercard/ren.png")
  background-repeat: no-repeat
  background-size: cover
  background-position: center

.ucard-full-deco
  left: 25px

.ucard-full-reg
  color: black
  left: 25px
  top: 30px

  &__register
    background-color: rgb(0, 152, 220)
    width: 45px

  &__register-time
    padding-right: 2px
    background-color: white
    width: fit-content
    white-space: nowrap
    font-weight: bold

.ucard-full-ast
  left: 25px
  padding: 0
  top: 120px

  &__assist-title
    background-color: white
    width: 32px
    color: black

  &__assist-name
    font-size: 35px
    height: 39px

  &__assist-name-eng
    font-size: 20px
    margin: 0
    top: -3px

.ucard-full-camplogo
  left: 17%
  top: 0
  width: 200px
  height: 200px

.ucard-full-avatar
  //right: 300px
  right: 0
  top: 50px
  height: 100px

.ucard-full-avatar-frame
  right: 293px
  top: 50px

.ucard-full-username
  font-size: 25px
  width: 280px
  color: white

.ucard-full-hire-title
  left: 29px
  color: black
  top: 391px
  font-size: 17px

.ucard-full-hire-num
  text-shadow: 1px 1px 7px black
  left: 29px
  color: white
  top: 410px
  font-family: 'AEwide'
  height: 75px
  font-size: 60px

.ucard-full-level
  //left: 575px
  right: 370px
  top: 27px

  &__text
    //left: 566px
    right: 360px
    width: 70px
    top: 33px
    text-align: center

.ucard-full-level-title
  font-size: 6px
  //left: 594px
  right: 387.3px
  top: 53px

.ucard-full-usercheck
  padding: 6px 4px
  background-color: rgba(20, 20, 20, 0.5)
  opacity: 0.5
  height: 55px
  border-radius: 15px

.ucard-full-warn
  right: 1px
  top: 478px
  width: 300px
  height: 122px
  font-size: 8px
  padding: 4px

.ucard-full-warn-content
  text-align: right

.ucard-text-shadow
  text-shadow: 1px 1px 7px black
</style>