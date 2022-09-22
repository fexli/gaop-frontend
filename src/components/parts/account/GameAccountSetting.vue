<script setup lang="ts">
import {getGameSettings, getGameUserBuilding, resetGameSettings, setGameSettings} from "../../../plugins/axios";
import {accountStore} from "../../../store/account";
import {storeToRefs} from "pinia";
import {Ref} from "vue";
import {useToast} from "../../../hooks/toast";
import global_const from "../../../utils/global_const";
import Toggle from "../settings/SettingToggle.vue";
import Explain from "../../element/Explain.vue";
import Slider from "../settings/SettingSlider.vue";
import TextInput from "../settings/SettingTextInput.vue";
import {useTranslate} from "../../../hooks/translate";
import Select from "../settings/SettingSelect.vue";
import SettingBtn from "../settings/SettingBtn.vue";
import AutoBattleMapEdit from "../settings/AutoBattleMapEdit.vue";
import {parseSingleBattleParamToStr} from "../../../utils/autoBattleMapProc";

const account = accountStore();
const {gameAccountLi} = storeToRefs(account)
const {translate} = useTranslate()
const {showMessage} = useToast();
const props = defineProps({
  gameUserName: String,
  gamePlatform: Number,
})

const getSuccess: Ref = ref(false) // 获取数据成功
const getFinished: Ref = ref(false) // 获取数据完成
const accEnable: Ref = ref(false) // 基建控制中心等级大于3级 允许开启加速
const maxLaborValue: Ref = ref(200) // 最大基建无人机默认值
const maxApValue: Ref = ref(140) // 最大理智默认值
const buildingAccelerateData: Ref = ref([]) // 基建加速slot
const stageItems: Ref = ref([]); // 全部关卡列表
const valuedSettings: Ref = ref({}) // 服务器返回数据+前端修改，与backed用于判断是否有修改
const backedSettings: Ref = ref({}) // 服务器返回的设置数据的备份

const resetOverlay: Ref = ref(false) // 重置确认弹窗
const autoBattleOverlay: Ref = ref(false) // 自动战斗地图设置弹窗

const defaultSettings: Ref = ref({
  "accelerateSlot": null,
  "apOverflowBuildingCost": null, // TODO
  "apOverflowCheck": null, // TODO
  "apReserve": null,
  "autoBattleMap": null, // TODO
  "autoCheckInOnly": null,
  "autoDailyCheckIn": null,
  "autoGridOnlyV2": null,
  "autoLoginOnly": null,
  "autoPrayOnly": null,
  "autoSendClueToFriend": null,
  "autoStartCommunicate": null,
  "autoSwichDiamManufact": null,
  "buildingKeepDrone": null,
  "commForceDate": null,
  "commGetAll": null,
  "commTouchNoOther": null,
  "commTouchUnget": null,
  "drawLimGachaDailyFree": null,
  "enableAutoBattle": null,
  "noticedQQ": null,
  "pauseMapAttack": null,
  "receiveMail": null,
  "recruitAutoFull": null,
  "recruitIgnoreRobot": null,
  "recruitReserve": null,
  "refreshRecruit": null,
  "sencClueListIsBlock": null,
  "sencClueUidList": null, // TODO
  "takeDownInUse": null,
  "useApSupply": null,
  "useApSupplyBefore": null,
  "useDiamondSupplyCnt": null,
  "useSweep": null
})


const bTypeIdents = { // [0, 1, 2, 3]=>[开放，开启关卡选择器，开启MAPT，开启MNG-CHR]
  AUTO: [true, false, false, false],
  RANDOM: [true, true, false, false],
  FIRST: [true, true, false, false],
  MANAGED: [true, false, true, false],
  MAPARG: [true, false, false, true],
}

const isOffline = computed(() => {
  for (let i = 0; i < gameAccountLi.value.length; i++) {
    if (gameAccountLi.value[i].account === props.gameUserName && gameAccountLi.value[i].platform === props.gamePlatform) {
      return gameAccountLi.value[i].status <= 0
    }
  }
  return true
})

const parseBattleMap = computed(() => {
  return valuedSettings.value['autoBattleMap']
})

function showAutoBattle() {
  autoBattleOverlay.value = true
}

function closeAutoBattleOverlay() {
  autoBattleOverlay.value = false
}

function getSetting() {
  getGameSettings(props.gameUserName as string, props.gamePlatform as number).then((res: any) => {
    console.log("getGameSettings", res)
    for (let entr of Object.entries(res.data)) {
      valuedSettings.value[entr[0]] = entr[1]
      backedSettings.value[entr[0]] = entr[1]
    }
    if (isOffline.value) {
      // 直接返回预定数据，不调用接口
      valuedSettings.value['accelerateSlot'] = undefined
      backedSettings.value['accelerateSlot'] = undefined
      getSuccess.value = true
      getFinished.value = true
      return
    }
    getGameUserBuilding(props.gameUserName as string, props.gamePlatform as number).then((suc2: any) => {
      console.log('build', suc2)
      if (!suc2.data.building) {
        getFinished.value = true
        return
      }
      account.setAccountInfo(props.gameUserName as string, props.gamePlatform as number, suc2.data)
      mergeBuildingAcc(suc2.data.building)
      maxLaborValue.value = suc2.data.building.status.labor.maxValue
      getSuccess.value = true
      getFinished.value = true
    }).catch((err) => {
      console.log('builderr', err)
      getFinished.value = true
    })
  }).catch((err) => {
    console.log("getGameSettings err", err)
    getFinished.value = true
  })
}

function confirmResetSettings() {
  resetGameSettings(props.gameUserName as string, props.gamePlatform as number).then((res: any) => {
    console.log("resetGameSettings", res)
    showMessage(res.msg, 2000, "success", props.gameUserName as string)
    for (let entry of Object.entries(defaultSettings.value)) {
      valuedSettings.value[entry[0]] = entry[1]
    }
    getSetting()
  }).catch((err: any) => {
    showMessage(err.msg, 2000, "danger", props.gameUserName as string)
  })
}

function submitSetting() {
  console.log("submitSetting", valuedSettings.value)
  let data = {} as Record<string, any>
  let enc = false
  console.log('bakced', backedSettings.value)
  for (let entr of Object.entries(backedSettings.value)) {
    if (valuedSettings.value[entr[0]] !== entr[1]) {
      data[entr[0]] = valuedSettings.value[entr[0]]
      enc = true
    }
  }
  console.log('submit data', data)
  if (!enc) return
  setGameSettings(props.gameUserName as string, props.gamePlatform as number, data).then(
      (suc: any) => {
        showMessage(suc.msg, 2000, 'success', props.gameUserName)
        for (let entr of Object.entries(data)) {
          backedSettings.value[entr[0]] = entr[1]
        }
        console.log(suc)
      }
  ).catch(
      (err) => {
        console.log(err)
      }
  )
}

function findFormula(fId: number) {
  try {
    return global_const.gameData.itemData[global_const.gameData.buildingData.manufactFormulas[fId].itemId].name
  } catch (e) {
    console.log(e)
    return `formulaId::${fId}`
  }
}

function findTrading(stra: string) {
  switch (stra) {
    case "O_GOLD":
      return '贸易:赤金'
    case "O_DIAMOND":
      return '贸易:合成玉'
    case 'O_COMPOUND':
      return '贸易:赤金/合成玉'
    default:
      return stra
  }
}

function mergeBuildingAcc(data: Record<any, any>) {
  if (!data) return
  for (let entr of Object.entries(data.roomSlots)) {
    if ((entr[1] as Record<any, any>).roomId === 'CONTROL' && (entr[1] as Record<any, any>).level >= 3) {
      accEnable.value = true
      break
    }
  }
  console.log('accEnable', accEnable.value)
  if (!accEnable.value) return
  // TODO:自动加速，以及指定类型的加速
  // BuildingAccelerateTypeManuExp  = "manu_exp"
  // BuildingAccelerateTypeManuLmb  = "manu_lmb"
  // BuildingAccelerateTypeManuDiam = "manu_diam"
  // BuildingAccelerateTypeTradLmb  = "trad_lmb"
  // BuildingAccelerateTypeTradDiam = "trad_diam"
  buildingAccelerateData.value.push({
    slot: 'manu_exp',
    text: `自动:制造站-经验`,
    type: 'AUTO',
    value: 'aaa',
    data: ''
  })
  buildingAccelerateData.value.push({
    slot: 'manu_lmb',
    text: `自动:制造站-赤金`,
    type: 'AUTO',
    value: 'aaa',
    data: ''
  })
  buildingAccelerateData.value.push({
    slot: 'manu_diam',
    text: `自动:制造站-合成玉`,
    type: 'AUTO',
    value: 'aaa',
    data: ''
  })
  buildingAccelerateData.value.push({
    slot: 'trad_lmb',
    text: `自动:贸易站-赤金`,
    type: 'AUTO',
    value: 'aaa',
    data: ''
  })
  buildingAccelerateData.value.push({
    slot: 'trad_diam',
    text: `自动:贸易站-合成玉`,
    type: 'AUTO',
    value: 'aaa',
    data: ''
  })
  for (let entr of Object.entries(data.rooms)) {
    switch (entr[0]) {
      case "MANUFACTURE": {
        for (let ro of Object.entries(entr[1] as Record<any, any>)) {
          let data = `制造:${findFormula(ro[1].formulaId)}`
          buildingAccelerateData.value.push({
            slot: ro[0],
            text: `指定房间(${ro[0].replace("slot_", "")}):${data}`,
            type: 'MANUF',
            value: 'aab',
            data: data
          })
        }
        break
      }
      case "TRADING": {
        for (let ro of Object.entries(entr[1] as Record<any, any>)) {
          let data = findTrading(ro[1].strategy)
          buildingAccelerateData.value.push({
            slot: ro[0],
            text: `指定房间:${data}`,
            type: 'TRADING',
            value: 'aabc',
            data: data,
          })
        }
        break
      }
      default:
        break
    }
  }
}

function showResetOverlay() {
  resetOverlay.value = true
}

onMounted(() => {
  getSetting()
})
onUnmounted(() => {
  console.log('GameAccountSetting Unmounted')
})
</script>
<template>
  <div>
    <div class="rounded-xl bg-base-200 p-2">
      <div v-if="isOffline" class="alert flex-row shadow-lg text-white p-1 px-3 rounded-xl bg-warning">
        <div>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
               class="stroke-current flex-shrink-0 w-6 h-6">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
          </svg>
          <span>请注意：当前正处于离线状态，部分设置可能无法修改。</span>
        </div>
      </div>
      <div v-if="getFinished">
        <div v-if="getSuccess">
          <div class="divider m-0">
            <h1 class="text-2xl ml-1">登录设置</h1>
          </div>
          <Toggle :settings="valuedSettings" field="forceLogin" title="强制登录">
            <template #extra>
              <Explain>
                <template #explain>
                  当出现异地登录时强制登录允许对账号重新进行登录
                  <span style="color:darkred">警告：这有可能会造成您的登录被打断</span>
                  <span style="color:red">强制登录已被禁用</span>
                </template>
              </Explain>
            </template>
          </Toggle>
          <Toggle :settings="valuedSettings" field="autoDailyCheckIn" title="每日登陆签到">
            <template #extra>
              <Explain>
                <template #explain>
                  是否在每日进行登录签到(默认时间为早7点前后)
                </template>
              </Explain>
            </template>
          </Toggle>
          <Toggle :settings="valuedSettings" field="autoCheckInOnly" title="自动活动签到">
            <template #extra>
              <Explain>
                <template #explain>
                  活动期间自动领取活动签到奖励
                </template>
              </Explain>
            </template>
          </Toggle>
          <Toggle :settings="valuedSettings" field="autoLoginOnly" title="领取登录赠送奖励">
            <template #extra>
              <Explain>
                <template #explain>
                  领取活动登录赠送奖励(e.g.限定卡池十连抽)
                </template>
              </Explain>
            </template>
          </Toggle>
          <Toggle :settings="valuedSettings" field="autoPrayOnly" title="自动活动祈愿墙">
            <template #extra>
              <Explain>
                <template #explain>
                  随机选择并领取活动祈愿墙合成玉
                </template>
              </Explain>
            </template>
          </Toggle>
          <Toggle :settings="valuedSettings" field="drawLimGachaDailyFree" title="自动限定池每日一抽">
            <template #extra>
              <Explain>
                <template #explain>
                  在当日限定池存在每日免费一抽时进行每日一抽
                </template>
              </Explain>
            </template>
          </Toggle>
          <Toggle :settings="valuedSettings" field="autoGridOnlyV2" title="自动完成矿区挖矿">
            <template #extra>
              <Explain>
                <template #explain>
                  在有矿区挖矿任务时自动完成每日矿区挖矿
                </template>
              </Explain>
            </template>
          </Toggle>
          <div class="divider m-0">
            <h1 class="text-2xl ml-1">战斗设置</h1>
          </div>
          <Toggle :settings="valuedSettings" field="enableAutoBattle" title="自动作战">
            <template #extra>
              <Explain>
                <template #explain>
                  是否开启自动作战（若重新开启请在开启后手动重启代理）
                </template>
              </Explain>
            </template>
          </Toggle>
          <Toggle
              :disabled="valuedSettings['pauseMapAttack'] == null || !valuedSettings['enableAutoBattle']"
              :settings="valuedSettings" field="pauseMapAttack" title="暂停当前作战"
              enable-text="已暂停" disable-text="不暂停"
          >
            <template #extra>
              <Explain>
                <template #explain>
                  是否暂停当前作战（在开启作战的情况下可实时恢复）
                </template>
              </Explain>
            </template>
          </Toggle>
          <Toggle
              :disabled="valuedSettings['useSweep'] == null || !valuedSettings['enableAutoBattle']"
              :settings="valuedSettings" field="useSweep" title="自动剿灭扫荡"
          >
            <template #extra>
              <Explain>
                <template #explain>
                  是否允许自动剿灭扫荡（需要开启作战，工作日每日扫荡一次）
                </template>
              </Explain>
            </template>
          </Toggle>
          <Slider
              :disabled="valuedSettings['apReserve'] == null || !valuedSettings['enableAutoBattle']"
              :settings="valuedSettings" field="apReserve" title="保留理智数量"
              :max="maxApValue"
          >
            <template #extra>
              <Explain>
                <template #explain>
                  最少保留理智的数量，当理智不足时自动停止作战
                  <span class="text-info">提示：可通过滚轮在数值上滚动调整大小</span>
                </template>
              </Explain>
            </template>
          </Slider>
          <Toggle
              :disabled="valuedSettings['useApSupply'] == null || !valuedSettings['enableAutoBattle']"
              :settings="valuedSettings" field="useApSupply" title="使用理智药恢复理智"
          >
            <template #extra>
              <Explain>
                <template #explain>
                  是否使用理智药恢复理智
                </template>
              </Explain>
            </template>
          </Toggle>
          <Slider
              :disabled="valuedSettings['useApSupplyBefore'] == null || !valuedSettings['useApSupply'] || !valuedSettings['enableAutoBattle']"
              :settings="valuedSettings" field="useApSupplyBefore" title="使用几日内到期的理智药"
              :max="30"
          >
            <template #extra>
              <Explain>
                <template #explain>
                  使用几日内到期的理智药
                  <span class="text-info">提示：可通过滚轮在数值上滚动调整大小</span>
                </template>
              </Explain>
            </template>
          </Slider>
          <TextInput number-only :settings="valuedSettings" field="useDiamondSupplyCnt" title="可碎石数量">
            <template #extra>
              <Explain on-top>
                <template #explain>
                  碎石兑换理智数量，在理智不足时自动使用源石兑换理智
                  <span
                      class="text-warning">只会在没有理智时申请碎石，每次只会碎1块，该设置会动态减少，请在保存设置前注意源石使用量！</span>
                </template>
              </Explain>
            </template>
          </TextInput>
          <SettingBtn
              :settings="valuedSettings" field="autoBattleMap"
              :disabled="!valuedSettings['enableAutoBattle'] || valuedSettings['autoBattleMap'] == null"
              title="进攻关卡设置" :title-btn="parseSingleBattleParamToStr(parseBattleMap)" :clicker="showAutoBattle"
          >
            <template #extra>
              <Explain>
                <template #explain>
                  进攻关卡设置
                </template>
              </Explain>
            </template>
          </SettingBtn>
          <div class="divider m-0">
            <h1 class="text-2xl ml-1">基建设置</h1>
          </div>
          <h1 v-if="!accEnable" class="text-error">禁用：基建控制中心等级小于3级，无法开启无人机加速</h1>
          <Select
              :settings="valuedSettings"
              field="accelerateSlot" item-value="slot" item-text="text"
              :disabled="!accEnable || valuedSettings['accelerateSlot'] == null"
              title="加速房间"
              :list="buildingAccelerateData"
          >
            <template #extra>
              <Explain>
                <template #explain>
                  使用无人机加速的房间
                </template>
              </Explain>
            </template>
          </Select>
          <Slider
              :disabled="!accEnable || maxLaborValue === 0 || valuedSettings['buildingKeepDrone'] == null"
              :settings="valuedSettings" field="buildingKeepDrone" title="保留无人机数量"
              :max="maxApValue"
          >
            <template #extra>
              <Explain>
                <template #explain>
                  加速后保留无人机的数量，当无人机数量不足时自动停止加速(为升级基建/加速芯片而保留)
                  <span class="text-info">提示：可通过滚轮在数值上滚动调整大小</span>
                </template>
              </Explain>
            </template>
          </Slider>
          <Toggle :settings="valuedSettings" field="autoSwichDiamManufact" title="切换搓玉材料">
            <template #extra>
              <Explain>
                <template #explain>
                  是否让搓玉制造站材料消耗空后自动在固源岩与装置间切换
                  <span class="text-warning">警告：装置搓玉很亏，慎开</span>
                </template>
              </Explain>
            </template>
          </Toggle>
          <Toggle :settings="valuedSettings" field="commGetAll" title="收取全部好友线索">
            <template #extra>
              <Explain>
                <template #explain>
                  每日登陆时收取全部好友赠送的线索
                  <span class="text-warning">不建议开，建议按需获取</span>
                </template>
              </Explain>
            </template>
          </Toggle>
          <Toggle
              :disabled="valuedSettings['commGetAll'] || valuedSettings['commTouchUnget'] == null"
              :settings="valuedSettings" field="commTouchUnget" title="收取好友线索中自己没有的线索"
          >
            <template #extra>
              <Explain>
                <template #explain>
                  收取好友线索中自己没有的线索
                </template>
              </Explain>
            </template>
          </Toggle>
          <Toggle
              :disabled="valuedSettings['commGetAll'] || valuedSettings['commTouchNoOther'] == null"
              :settings="valuedSettings" field="commTouchNoOther" title="收取无赠送的线索"
          >
            <template #extra>
              <Explain>
                <template #explain>
                  收取自己已经收集到，但是没有好友赠送的好友线索
                  <span class="text-info">此选项目的在于优先使用好友带有时间限制的线索而非自己收集的线索</span>
                  <span
                      class="text-primary">例：自己收集到了N个`线索7`，但是没有收集到好友赠送的`线索7`，此时如果有好友送`线索7`则会收取</span>
                </template>
              </Explain>
            </template>
          </Toggle>
          <Slider
              :disabled="valuedSettings['commGetAll'] || valuedSettings['commForceDate'] == null"
              :settings="valuedSettings" field="commForceDate" title="收取低于指定天数的好友赠送线索"
              :max="9"
          >
            <template #extra>
              <Explain>
                <template #explain>
                  收取低于指定天数的好友赠送线索
                  <span class="text-info">提示：可通过滚轮在数值上滚动调整大小</span>
                </template>
              </Explain>
            </template>
          </Slider>
          <Toggle :settings="valuedSettings" field="autoSendClueToFriend" title="赠送线索给好友">
            <template #extra>
              <Explain>
                <template #explain>
                  线索满时自动赠送给好友
                </template>
              </Explain>
            </template>
          </Toggle>
          <Toggle
              :settings="valuedSettings" field="takeDownInUse" title="赠送时摘下线索"
              :disabled="!valuedSettings['autoSendClueToFriend'] || valuedSettings['takeDownInUse'] == null"
          >
            <template #extra>
              <Explain>
                <template #explain>
                  赠送线索时自动摘下使用中的线索
                  <span class="text-warning">如果不摘下且没有同类型的线索将会取消赠送</span>
                </template>
              </Explain>
            </template>
          </Toggle>
          <Toggle
              :settings="valuedSettings" field="sencClueListIsBlock" title="赠送线索模式"
              enable-text="黑名单" disable-text="白名单"
              :disabled="!valuedSettings['autoSendClueToFriend'] || valuedSettings['sencClueListIsBlock'] == null"
          >
            <template #extra>
              <Explain>
                <template #explain>
                  赠送线索时选择好友的模式，默认为黑名单模式。
                  <span class="text-info">黑名单模式：赠送给`名单`以外的任意好友（适用于大号不送小号）</span>
                  <span class="text-info">白名单模式：只赠送给`名单`中的任选一名好友（适用于小号只送大号）</span>
                  <span class="text-primary">可以设置为“黑名单模式，置空名单”来给任意好友赠送（适用于单号）</span>
                  <span class="text-warning">如果没有合适/匹配到的赠送对象将会取消赠送</span>
                </template>
              </Explain>
            </template>
          </Toggle>
          <h1 class="text-info">~~~~~~~~~这里是赠送名单设置~~~~~~</h1>
          <div class="divider m-0">
            <h1 class="text-2xl ml-1">公招设置</h1>
          </div>
          <Toggle :settings="valuedSettings" field="refreshRecruit" title="自动刷新公招">
            <template #extra>
              <Explain>
                <template #explain>
                  存在公招刷新次数时自动刷新低于4x的公招
                </template>
              </Explain>
            </template>
          </Toggle>
          <Toggle :settings="valuedSettings" field="recruitAutoFull" title="自动使用所有公招">
            <template #extra>
              <Explain>
                <template #explain>
                  自动使用未使用的公招槽(优先4星9H或机器人3H50M，若无则留空7H40M，保留五星和六星组合)
                </template>
              </Explain>
            </template>
          </Toggle>
          <Toggle
              :disabled="!valuedSettings['recruitAutoFull'] || valuedSettings['recruitIgnoreRobot'] == null"
              :settings="valuedSettings" field="recruitIgnoreRobot" title="招募机器人词条">
            <template #extra>
              <Explain>
                <template #explain>
                  公招是否招募机器人
                </template>
              </Explain>
            </template>
          </Toggle>
          <Slider
              :disabled="!valuedSettings['recruitAutoFull'] || valuedSettings['recruitReserve'] == null"
              :settings="valuedSettings" field="recruitReserve" title="至少保留公招券数量"
              :max="300"
          >
            <template #extra>
              <Explain>
                <template #explain>
                  至少保留公招券数量，低于此数量时将停止自动公招，仅刷新。
                  <span class="text-info">提示：可通过滚轮在数值上滚动调整大小</span>
                </template>
              </Explain>
            </template>
          </Slider>
          <div class="divider m-0">
            <h1 class="text-2xl ml-1">账号设置</h1>
          </div>
          <Toggle
              :settings="valuedSettings" field="receiveMail" title="收取邮件">
            <template #extra>
              <Explain>
                <template #explain>
                  在有新邮件时是否进行自动收取
                </template>
              </Explain>
            </template>
          </Toggle>
          <Toggle
              :settings="valuedSettings" field="autoStartCommunicate" title="自动开启线索交流">
            <template #extra>
              <Explain>
                <template #explain>
                  登录后检查是否能够开启线索交流，若能则自动开启
                </template>
              </Explain>
            </template>
          </Toggle>
          <TextInput number-only :settings="valuedSettings" field="noticedQQ" title="发送消息提醒QQ（内测中）">
            <template #extra>
              <Explain on-top>
                <template #explain>
                  发送消息提醒QQ，0为不设置提醒QQ
                  <span class="text-warning">该功能正在内测中，后续将进行跟进开发，请先添加QQ：1513682704作为好友</span>
                </template>
              </Explain>
            </template>
          </TextInput>
          <div class="flex gap-2">
            <div class="spacer"/>
            <div class="fe-btn" @click="showResetOverlay">还原设置</div>
            <div class="fe-btn" @click="submitSetting">保存设置</div>
          </div>
        </div>
        <h1 class="text-center w-full text-error" v-else>账号设置信息获取失败，请重试</h1>
      </div>
      <div class="text-center w-full" v-else>Loading...</div>
    </div>
    <div class="overlay bg-base-200 bg-opacity-40" v-show="resetOverlay">
      <div class="card w-96 bg-base-100 shadow-xl">
        <div class="card-body">
          <h2 class="card-title text-warning">{{ translate('game.setting.reset_title') }}</h2>
          <p class="text-warning">{{ translate('game.setting.reset_confirm') }}</p>
          <div class="card-actions justify-end">
            <button class="btn btn-primary" @click="confirmResetSettings">
              {{ translate('game.setting.reset_btn', gameUserName) }}
            </button>
          </div>
        </div>
      </div>
    </div>
    <div class="overlay bg-base-200 bg-opacity-40" v-if="autoBattleOverlay">
      <AutoBattleMapEdit :close="closeAutoBattleOverlay" :settings="valuedSettings" field="autoBattleMap"/>
    </div>
  </div>
</template>

