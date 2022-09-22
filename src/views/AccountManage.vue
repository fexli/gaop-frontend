<script setup lang="ts">
import {useTranslate} from "../hooks/translate";
import {authStore} from "../store/auth";
import {storeToRefs} from "pinia/dist/pinia";
import StatusInfo from "../components/parts/accountManage/StatusInfo.vue";
import {accountStore} from "../store/account";
import global_const from "../utils/global_const";
import LogTextCtx from "../components/parts/accountManage/LogTextCtx.vue";
import {gameCreateAccount, gameDeleteAccount, gameStartAccount, gameStopAccount} from "../plugins/axios";
import {useToast} from "../hooks/toast";
import {router} from "../router/router";

const {translate} = useTranslate();
const auth = authStore();
const {username} = storeToRefs(auth);
const {showMessage} = useToast();
const account = accountStore();
const {gameAccountLi, inRunningAccount, webUserInfo} = storeToRefs(account);

const cardLoading = ref(false);
const loadingReload = ref(false); // reload按钮的loading
const loadingStopAll = ref(false); // stopall按钮的loading
const loadingCreateNewAccount = ref(false); // 创建新账号按钮的loading

const createAccountOverlay = ref(false);
const deleteAccountOverlay = ref(false);

const createUserNickname = ref("");
const createUserAccount = ref("");
const createUserPassword = ref("");
const createUserPlatform = ref(1);

const deleteUserAccount = ref("");
let deleteUserInfo = {
  platform: 0,
};

const currentAccounts = computed(() => {
  return gameAccountLi.value.length + "个"
})

const inRunningAccounts = computed(() => {
  return inRunningAccount.value + "个"
})

const userLevel = {
  0: '用户',
  1: '调试',
  2: '管理',
  3: '幽岚',
}
const userLevelPath = {
  0: 'M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M7.07,18.28C7.5,17.38 10.12,16.5 12,16.5C13.88,16.5 16.5,17.38 16.93,18.28C15.57,19.36 13.86,20 12,20C10.14,20 8.43,19.36 7.07,18.28M18.36,16.83C16.93,15.09 13.46,14.5 12,14.5C10.54,14.5 7.07,15.09 5.64,16.83C4.62,15.5 4,13.82 4,12C4,7.59 7.59,4 12,4C16.41,4 20,7.59 20,12C20,13.82 19.38,15.5 18.36,16.83M12,6C10.06,6 8.5,7.56 8.5,9.5C8.5,11.44 10.06,13 12,13C13.94,13 15.5,11.44 15.5,9.5C15.5,7.56 13.94,6 12,6M12,11A1.5,1.5 0 0,1 10.5,9.5A1.5,1.5 0 0,1 12,8A1.5,1.5 0 0,1 13.5,9.5A1.5,1.5 0 0,1 12,11Z',
  1: 'M13.78 15.3L19.78 21.3L21.89 19.14L15.89 13.14L13.78 15.3M17.5 10.1C17.11 10.1 16.69 10.05 16.36 9.91L4.97 21.25L2.86 19.14L10.27 11.74L8.5 9.96L7.78 10.66L6.33 9.25V12.11L5.63 12.81L2.11 9.25L2.81 8.55H5.62L4.22 7.14L7.78 3.58C8.95 2.41 10.83 2.41 12 3.58L9.89 5.74L11.3 7.14L10.59 7.85L12.38 9.63L14.2 7.75C14.06 7.42 14 7 14 6.63C14 4.66 15.56 3.11 17.5 3.11C18.09 3.11 18.61 3.25 19.08 3.53L16.41 6.2L17.91 7.7L20.58 5.03C20.86 5.5 21 6 21 6.63C21 8.55 19.45 10.1 17.5 10.1Z',
  2: 'M11 9.47V11H14.76L13 14.53V13H9.24L11 9.47M13 1L6 15H11V23L18 9H13V1Z',
  3: 'M19,22H5V20H19V22M17,10C15.58,10 14.26,10.77 13.55,12H13V7H16V5H13V2H11V5H8V7H11V12H10.45C9.35,10.09 6.9,9.43 5,10.54C3.07,11.64 2.42,14.09 3.5,16C4.24,17.24 5.57,18 7,18H17A4,4 0 0,0 21,14A4,4 0 0,0 17,10Z'
}

const gameAccountHeaders = [
  {
    text: computed(() => translate('account.name')),
    value: 'name',
    width: '9%'
  },
  {
    text: computed(() => translate('account.account')),
    value: 'account',
    width: '13%'
  },
  {
    text: computed(() => translate('account.platform')),
    value: 'platform',
    class: 'text-center',
    width: '6%'
  },
  {
    text: computed(() => translate('account.status')),
    value: 'status',
    class: 'text-center',
    width: '11%'
  },
  {
    text: computed(() => translate('account.logger')),
    value: 'finalLog',
    sortable: false,
  },
  {
    text: computed(() => translate('account.operation')),
    value: 'actions',
    sortable: false,
    width: '7.5rem',
  }
]

function syncGameAccounts(silent = false) {
  cardLoading.value = true
  let resp = account.getSyncUserData();
  if (!resp) {
    return
  }
  resp.then((result) => {
    if (result.success) {
      if (!silent)
        showMessage('account.sync_success', 2000, 'info', gameAccountLi.value.length)
      loadingReload.value = false
      cardLoading.value = false
    } else {
      if (result.result === undefined) {
        cardLoading.value = false
      } else if (result.result.status === 400) {
        showMessage(result.result.data.msg)
      }
      loadingReload.value = false
      cardLoading.value = false
    }
  }).catch(() => {
    loadingReload.value = false
    cardLoading.value = false
  })
}

function startAccount(accInfo: any) {
  console.log("startAccount", accInfo)
  gameStartAccount(accInfo.account, accInfo.platform).then(
      (suc: any) => {
        showMessage(suc.msg, 2000, 'success', accInfo.account)
        setTimeout(() => {
          syncGameAccounts(true)
        }, 300)
      }
  ).catch(
      (err: any) => {
        showMessage(err.data.msg, 2000, 'danger', accInfo.account)
      }
  )
}

function stopAccount(accInfo: any, show: boolean = true) {
  console.log("stopAccount", accInfo)
  gameStopAccount(accInfo.account, accInfo.platform).then(
      (suc: any) => {
        if (show)
          showMessage(suc.msg, 2000, 'success', accInfo.account)
        setTimeout(() => {
          syncGameAccounts(true)
        }, 300)
      }
  ).catch(
      (err: any) => {
        showMessage(err.data.msg, 2000, 'danger', accInfo.account)
      }
  )
}

function restartAccount(accInfo: any) {
  console.log("restartAccount", accInfo)
  gameStopAccount(accInfo.account, accInfo.platform).then(
      (suc1: any) => {
        showMessage(suc1.msg, 2000, 'success', accInfo.account)
        account.clearLoggerInfo(accInfo.account, accInfo.platform)
        gameStartAccount(accInfo.account, accInfo.platform).then(
            (suc: any) => {
              showMessage(suc.msg, 2000, 'success', accInfo.account)
              setTimeout(() => {
                syncGameAccounts(true)
              }, 300)
            }
        ).catch(
            (err: any) => {
              showMessage(err.data.msg, 2000, 'danger', accInfo.account)
            }
        )
      }
  ).catch(
      (err: any) => {
        showMessage(err.data.msg, 2000, 'danger', accInfo.account)
      }
  )
}

function deleteAccount(accInfo: any) {
  console.log("deleteAccount", accInfo)
  deleteUserInfo = accInfo
  deleteUserAccount.value = accInfo.account
  deleteAccountOverlay.value = true
}

function confirmDeleteAccount() {
  console.log('CONFIRM DELETE')
  gameDeleteAccount(deleteUserAccount.value, deleteUserInfo.platform).then((success: any) => {
    console.log(success)
    deleteAccountOverlay.value = false
    showMessage(success.msg, 2000, 'success', deleteUserAccount.value)
    syncGameAccounts()
  }).catch(err => {
    console.log(err)
    showMessage(err.data.msg, 2000, 'danger', deleteUserAccount.value)
  })
}

function jumpToConsole(accInfo: any) {
  console.log("jumpToConsole", accInfo)
  router.push({
    path: '/account/dashboard/' + accInfo.platform + '/' + accInfo.account
  })
}

function changeAccountSetting(accInfo: any) {
  console.log("changeAccountSetting", accInfo) // TODO
}

function changeMinotorType() {
  console.log("changeMinotorType") // TODO
}

function reloadGameAccount() {
  console.log("reloadGameAccount")
  loadingReload.value = true
  syncGameAccounts()
}

function addGameAccount() {
  console.log("addGameAccount")
  createAccountOverlay.value = true
}

function addNewGameAccount() {
  console.log("addNewGameAccount")
  loadingCreateNewAccount.value = true
  if (createUserAccount.value === '' || createUserNickname.value === '' || createUserPassword.value === '') {
    let infos = ""
    if (createUserAccount.value === '') {
      infos += translate('login.username') + " "
    }
    if (createUserNickname.value === '') {
      infos += translate('login.nickname') + " "
    }
    if (createUserPassword.value === '') {
      infos += translate('login.password') + " "
    }
    showMessage('account.create_account_empty', 2000, 'danger', infos)
    closeCreateAccount()
    return
  }
  gameCreateAccount(createUserAccount.value, createUserPassword.value, createUserNickname.value, createUserPlatform.value).then(
      (suc: any) => {
        showMessage(suc.msg, 2000, 'success', createUserAccount.value)
        loadingCreateNewAccount.value = false
        createAccountOverlay.value = false
        setTimeout(() => {
          syncGameAccounts(true)
        }, 300)
      }
  ).catch(
      (err: any) => {
        showMessage(err.data.msg, 2000, 'danger', createUserAccount.value)
        loadingCreateNewAccount.value = false
      }
  )
}

function stopAllAccount() {
  console.log("stopAllAccount")
  loadingStopAll.value = true
  let len = 0;
  let has = false;
  for (let acc of gameAccountLi.value) {
    if (acc.status > 0) {
      console.log("stopAccount Acc:", acc)
      len++
      has = true
      gameStopAccount(acc.account, acc.platform).then(
          (suc: any) => {
            len--
            showMessage(suc.msg, 2000, 'success', acc.account)
            if (len === 0) {
              syncGameAccounts(true)
              loadingStopAll.value = false
              showMessage("account.stop_all_account_success", 2000, 'success', acc.account)
            }
            setTimeout(() => {
              account.clearLoggerInfo(acc.account, acc.platform)
            }, 300)
          }
      ).catch(
          (err: any) => {
            len--
            showMessage(err.data.msg, 2000, 'danger', acc.account)
          }
      )
    }
  }
  if (!has) {
    loadingStopAll.value = false
  }
}

function closeCreateAccount(withReset: boolean = true) {
  console.log("closeCreateAccount")
  createAccountOverlay.value = false
  if (withReset) {
    createUserAccount.value = ''
    createUserNickname.value = ''
    createUserPassword.value = ''
    createUserPlatform.value = 1
  }
  loadingCreateNewAccount.value = false
}
</script>
<template>
  <div class="hidden xs:flex shadow-lg h-10 rounded-xl bg-base-200 bg-opacity-80">
    <div class="w-full flex items-center justify-center">
      <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current flex-shrink-0 h-6 w-6 text-primary" fill="none"
           viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
      </svg>
      <div class="text-primary">{{ translate("account.welcome", username) }}</div>
    </div>
  </div>
  <div class="flex flex-col lg:flex-row overflow-hidden">
    <div class="flex flex-wrap flex-row lg:flex-col">
      <StatusInfo class="mr-1 lg:mr-0 mt-1" title="account.current" :content="currentAccounts">
        <template v-slot:icon>
          <svg class="w-6 h-6" stroke="currentColor" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
                d="M38 30H10C6.68629 30 4 32.6863 4 36C4 39.3137 6.68629 42 10 42H38C41.3137 42 44 39.3137 44 36C44 32.6863 41.3137 30 38 30Z M36 22C40.4183 22 44 18.4183 44 14C44 9.58172 40.4183 6 36 6C31.5817 6 28 9.58172 28 14C28 18.4183 31.5817 22 36 22Z M4 14L13 5L22 14L13 23L4 14Z"
                fill="none" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </template>
      </StatusInfo>
      <StatusInfo class="mr-1 lg:mr-0 mt-1" title="account.inrunning" :content="inRunningAccounts">
        <template v-slot:icon>
          <svg class="h-6 w-6" viewBox="0 0 24 24">
            <path fill="currentColor"
                  d="M4 6H2V20C2 21.1 2.9 22 4 22H18V20H4V6M20 4V16H8V4H20M20 2H8C6.9 2 6 2.9 6 4V16C6 17.1 6.9 18 8 18H20C21.1 18 22 17.1 22 16V4C22 2.9 21.1 2 20 2M12 14.5V5.5L18 10L12 14.5Z"/>
          </svg>
        </template>
      </StatusInfo>
      <StatusInfo class="mr-1 lg:mr-0 mt-1" title="account.user_level" :content="userLevel[webUserInfo.ul]">
        <template v-slot:icon>
          <svg class="h-6 w-6" viewBox="0 0 24 24">
            <path fill="currentColor"
                  :d="userLevelPath[webUserInfo.ul]"/>
          </svg>
        </template>
      </StatusInfo>
    </div>
    <div class="ml-0 lg:ml-1 mt-1">
      <div class="overflow-hidden rounded-xl">
        <div class="flex items-center bg-base-200 py-2 px-1 font-bold">
          <div class="text-xl ml-2 py-2 nowrap-hidden-ellipsis">{{ translate('account.game_account') }}</div>
          <div class="spacer"></div>
          <div class="table-head-btn" @click="changeMinotorType">
            <svg style="width:24px;height:24px" viewBox="0 0 24 24">
              <path fill="currentColor"
                    d="M3 4V16H21V4H3M3 2H21C22.1 2 23 2.89 23 4V16C23 16.53 22.79 17.04 22.41 17.41C22.04 17.79 21.53 18 21 18H14V20H16V22H8V20H10V18H3C2.47 18 1.96 17.79 1.59 17.41C1.21 17.04 1 16.53 1 16V4C1 2.89 1.89 2 3 2M10.84 8.93C11.15 8.63 11.57 8.45 12 8.45C12.43 8.46 12.85 8.63 13.16 8.94C13.46 9.24 13.64 9.66 13.64 10.09C13.64 10.53 13.46 10.94 13.16 11.25C12.85 11.56 12.43 11.73 12 11.73C11.57 11.73 11.15 11.55 10.84 11.25C10.54 10.94 10.36 10.53 10.36 10.09C10.36 9.66 10.54 9.24 10.84 8.93M10.07 12C10.58 12.53 11.28 12.82 12 12.82C12.72 12.82 13.42 12.53 13.93 12C14.44 11.5 14.73 10.81 14.73 10.09C14.73 9.37 14.44 8.67 13.93 8.16C13.42 7.65 12.72 7.36 12 7.36C11.28 7.36 10.58 7.65 10.07 8.16C9.56 8.67 9.27 9.37 9.27 10.09C9.27 10.81 9.56 11.5 10.07 12M6 10.09C6.94 7.7 9.27 6 12 6C14.73 6 17.06 7.7 18 10.09C17.06 12.5 14.73 14.18 12 14.18C9.27 14.18 6.94 12.5 6 10.09Z"/>
            </svg>
            <div class="hidden md:flex">{{ translate('account.change_type') }}</div>
          </div>
          <div class="table-head-btn" :class="loadingReload ? 'loading disabled' : ''" @click="reloadGameAccount">
            <svg v-show="!loadingReload" style="width:24px;height:24px" viewBox="0 0 24 24">
              <path fill="currentColor"
                    d="M21.5 9H16.5L18.36 7.14C16.9 5.23 14.59 4 12 4C7.58 4 4 7.58 4 12C4 13.83 4.61 15.5 5.64 16.85C6.86 15.45 9.15 14.5 12 14.5C14.85 14.5 17.15 15.45 18.36 16.85C19.39 15.5 20 13.83 20 12H22C22 17.5 17.5 22 12 22C6.5 22 2 17.5 2 12C2 6.5 6.5 2 12 2C15.14 2 17.95 3.45 19.78 5.72L21.5 4V9M12 7C13.66 7 15 8.34 15 10C15 11.66 13.66 13 12 13C10.34 13 9 11.66 9 10C9 8.34 10.34 7 12 7Z"/>
            </svg>
            <div class="hidden sm:flex">{{ translate('account.reload_account') }}</div>
          </div>
          <div class="table-head-btn" @click="addGameAccount">
            <svg style="width:24px;height:24px" viewBox="0 0 24 24">
              <path fill="currentColor"
                    d="M15,14C12.33,14 7,15.33 7,18V20H23V18C23,15.33 17.67,14 15,14M6,10V7H4V10H1V12H4V15H6V12H9V10M15,12A4,4 0 0,0 19,8A4,4 0 0,0 15,4A4,4 0 0,0 11,8A4,4 0 0,0 15,12Z"/>
            </svg>
            <div class="hidden sm:flex">{{ translate('account.create_account') }}</div>
          </div>
          <div class="table-head-btn mr-1" :class="loadingStopAll ? 'loading disabled' : ''" @click="stopAllAccount">
            <svg v-show="!loadingStopAll" style="width:24px;height:24px" viewBox="0 0 24 24">
              <path fill="currentColor"
                    d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,4C16.41,4 20,7.59 20,12C20,16.41 16.41,20 12,20C7.59,20 4,16.41 4,12C4,7.59 7.59,4 12,4M9,9V15H15V9"/>
            </svg>
            <div class="hidden sm:flex">{{ translate('account.stop_all_account') }}</div>
          </div>
        </div>
        <div class="px-1 bg-base-200 overflow-x-auto">
          <table class="text-left table-fixed w-full text-sm table-compact">
            <thead>
            <tr>
              <template v-for="(i,k) of gameAccountHeaders" v-bind:key="k">
                <th :style="'width: '+i['width']" :class="i['class']">{{ i.text.value }}</th>
              </template>
            </tr>
            </thead>
            <tbody>
            <template v-for="(i,k) of account.getGameAccounList" v-bind:key="k">
              <tr class="hover:bg-base-300 transition-all">
                <td>{{ i.name }}</td>
                <td>{{ i.account }}</td>
                <td class="text-center">{{ global_const.platformSelector[i.platform]?.text || '未知' }}</td>
                <td class="no-hidden text-center" style="white-space: break-spaces!important;padding: 0!important;word-break: keep-all;"
                    :style="`color: ${global_const.statusType[i.status.toString()]}`">{{ i.statusText }}
                </td>
                <td>
                  <h4 v-if="i.finalLog === null">-</h4>
                  <h4 v-else class="nowrap-hidden-ellipsis">
                    <span>[</span>
                    <span
                        :style="'color:'+ global_const.loggerLvlType[i.finalLog.level].color">{{
                        global_const.loggerLvlType[i.finalLog.level].name
                      }}</span>
                    <span>]</span>
                    <LogTextCtx
                        v-if="i.finalLog.info"
                        :color="i.finalLog.info.color"
                        :log="i.finalLog.info.log"
                        :inner="i.finalLog.info.inner"
                        :prev-color="i.finalLog.info.color"
                    />
                  </h4>
                </td>
                <td class="no-hidden">
                  <button v-show="i.status <= 0" class="btn btn-ghost btn-circle btn-xs mr-1" @click="startAccount(i)">
                    <svg class="w-4 h-4" viewBox="0 0 24 24">
                      <path fill="currentColor" d="M5,5V19H8V5M10,5V19L21,12"/>
                    </svg>
                  </button>
                  <button v-show="i.status > 0" class="btn btn-ghost btn-circle btn-xs mr-1" @click="stopAccount(i)">
                    <svg class="w-4 h-4" viewBox="0 0 24 24">
                      <path fill="currentColor" d="M18,18H6V6H18V18Z"/>
                    </svg>
                  </button>
                  <button v-show="i.status > 0" class="btn btn-ghost btn-circle btn-xs mr-1" @click="restartAccount(i)">
                    <svg class="w-4 h-4" viewBox="0 0 24 24">
                      <path fill="currentColor"
                            d="M12,4C14.1,4 16.1,4.8 17.6,6.3C20.7,9.4 20.7,14.5 17.6,17.6C15.8,19.5 13.3,20.2 10.9,19.9L11.4,17.9C13.1,18.1 14.9,17.5 16.2,16.2C18.5,13.9 18.5,10.1 16.2,7.7C15.1,6.6 13.5,6 12,6V10.6L7,5.6L12,0.6V4M6.3,17.6C3.7,15 3.3,11 5.1,7.9L6.6,9.4C5.5,11.6 5.9,14.4 7.8,16.2C8.3,16.7 8.9,17.1 9.6,17.4L9,19.4C8,19 7.1,18.4 6.3,17.6Z"/>
                    </svg>
                  </button>
                  <button v-show="i.status <= 0" class="btn btn-ghost btn-circle btn-xs mr-1" @click="deleteAccount(i)">
                    <svg class="w-4 h-4" viewBox="0 0 24 24">
                      <path fill="currentColor"
                            d="M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19M8.46,11.88L9.87,10.47L12,12.59L14.12,10.47L15.53,11.88L13.41,14L15.53,16.12L14.12,17.53L12,15.41L9.88,17.53L8.47,16.12L10.59,14L8.46,11.88M15.5,4L14.5,3H9.5L8.5,4H5V6H19V4H15.5Z"/>
                    </svg>
                  </button>
                  <button :class="i.status <= 0 ? 'btn-disabled bg-opacity-0' : ''"
                          class="btn btn-ghost btn-circle btn-xs mr-1" @click="jumpToConsole(i)">
                    <svg class="w-4 h-4" viewBox="0 0 24 24">
                      <path fill="currentColor"
                            d="M2,3H22C23.05,3 24,3.95 24,5V19C24,20.05 23.05,21 22,21H2C0.95,21 0,20.05 0,19V5C0,3.95 0.95,3 2,3M14,6V7H22V6H14M14,8V9H21.5L22,9V8H14M14,10V11H21V10H14M8,13.91C6,13.91 2,15 2,17V18H14V17C14,15 10,13.91 8,13.91M8,6A3,3 0 0,0 5,9A3,3 0 0,0 8,12A3,3 0 0,0 11,9A3,3 0 0,0 8,6Z"/>
                    </svg>
                  </button>
                  <button class="btn btn-ghost btn-circle btn-xs" @click="changeAccountSetting(i)">
                    <svg class="w-4 h-4" viewBox="0 0 24 24">
                      <path fill="currentColor"
                            d="M12,8A4,4 0 0,1 16,12A4,4 0 0,1 12,16A4,4 0 0,1 8,12A4,4 0 0,1 12,8M12,10A2,2 0 0,0 10,12A2,2 0 0,0 12,14A2,2 0 0,0 14,12A2,2 0 0,0 12,10M10,22C9.75,22 9.54,21.82 9.5,21.58L9.13,18.93C8.5,18.68 7.96,18.34 7.44,17.94L4.95,18.95C4.73,19.03 4.46,18.95 4.34,18.73L2.34,15.27C2.21,15.05 2.27,14.78 2.46,14.63L4.57,12.97L4.5,12L4.57,11L2.46,9.37C2.27,9.22 2.21,8.95 2.34,8.73L4.34,5.27C4.46,5.05 4.73,4.96 4.95,5.05L7.44,6.05C7.96,5.66 8.5,5.32 9.13,5.07L9.5,2.42C9.54,2.18 9.75,2 10,2H14C14.25,2 14.46,2.18 14.5,2.42L14.87,5.07C15.5,5.32 16.04,5.66 16.56,6.05L19.05,5.05C19.27,4.96 19.54,5.05 19.66,5.27L21.66,8.73C21.79,8.95 21.73,9.22 21.54,9.37L19.43,11L19.5,12L19.43,13L21.54,14.63C21.73,14.78 21.79,15.05 21.66,15.27L19.66,18.73C19.54,18.95 19.27,19.04 19.05,18.95L16.56,17.95C16.04,18.34 15.5,18.68 14.87,18.93L14.5,21.58C14.46,21.82 14.25,22 14,22H10M11.25,4L10.88,6.61C9.68,6.86 8.62,7.5 7.85,8.39L5.44,7.35L4.69,8.65L6.8,10.2C6.4,11.37 6.4,12.64 6.8,13.8L4.68,15.36L5.43,16.66L7.86,15.62C8.63,16.5 9.68,17.14 10.87,17.38L11.24,20H12.76L13.13,17.39C14.32,17.14 15.37,16.5 16.14,15.62L18.57,16.66L19.32,15.36L17.2,13.81C17.6,12.64 17.6,11.37 17.2,10.2L19.31,8.65L18.56,7.35L16.15,8.39C15.38,7.5 14.32,6.86 13.12,6.62L12.75,4H11.25Z"/>
                    </svg>
                  </button>
                </td>
              </tr>
            </template>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
  <div class="overlay bg-base-200 bg-opacity-50" v-show="deleteAccountOverlay">
    <div class="card w-96 bg-neutral text-neutral-content">
      <div class="card-body items-center text-center">
        <div class="flex gap-1 items-center">
          <svg class="text-warning w-6 h-6" viewBox="0 0 24 24">
            <path fill="currentColor"
                  d="M8.27,3L3,8.27V15.73L8.27,21H15.73C17.5,19.24 21,15.73 21,15.73V8.27L15.73,3M9.1,5H14.9L19,9.1V14.9L14.9,19H9.1L5,14.9V9.1M11,15H13V17H11V15M11,7H13V13H11V7"/>
          </svg>
          <h2 class="card-title text-warning">{{ translate('account.delete_title', deleteUserAccount) }}</h2>
        </div>
        <p class="text-warning">{{ translate('account.delete_confirm') }}</p>
        <div class="card-actions justify-end">
          <button class="btn btn-primary" @click="confirmDeleteAccount">{{ translate('account.delete_btn') }}</button>
          <button class="btn btn-ghost" @click="deleteAccountOverlay = false">{{
              translate('account.delete_deny')
            }}
          </button>
        </div>
      </div>
    </div>
  </div>
  <div class="overlay bg-base-200 bg-opacity-50" v-show="createAccountOverlay">
    <div class="card w-96 max-w-md glass">
      <figure class="select-none"><img :src="`static/im/create_user.jpg`" alt="welcome"></figure>
      <div class="absolute right-0 top-0 p-2" @click="closeCreateAccount">
        <svg class="w-8 h-8" viewBox="0 0 24 24">
          <path fill="currentColor"
                d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z"/>
        </svg>
      </div>
      <div class="create-user-card-body">
        <h2 class="card-title text-neutral">{{ translate('account.create_btn') }}</h2>
        <p class="text-neutral">{{ translate('account.create_welcome') }}</p>

        <div class="relative  h-16">
          <input
              v-model="createUserNickname"
              :placeholder="translate('login.nickname')"
              class="fe-input"
          />
          <label class="label mt-[-0.1rem]">
              <span class="label-text-alt text-error">
                {{ createUserNickname === '' ? translate("login.error.nickname_empty") : "" }}
              </span>
          </label>
        </div>

        <div class="relative h-16">
          <input
              v-model="createUserAccount"
              :placeholder="translate('login.username')"
              class="fe-input"
          />
          <label class="label mt-[-0.1rem]">
              <span class="label-text-alt text-error">
                {{ createUserAccount === '' ? translate("login.error.username_empty") : "" }}
              </span>
          </label>
        </div>

        <div class="relative h-16">
          <input
              v-model="createUserPassword"
              type="password"
              :placeholder="translate('login.password')"
              class="fe-input"
          >
          <label class="label mt-[-0.1rem]">
              <span class="label-text-alt text-error">
                {{ createUserPassword === '' ? translate("login.error.password_empty") : "" }}
              </span>
          </label>
        </div>
        <div class="card-actions flex flex-row">
          <select v-model="createUserPlatform" class="mt-1 pl-2 fe-select h-11 w-1/2">
            <!--            <option disabled>{{ translate('account.platform') }}</option>-->
            <template v-for="i of global_const.platformSelector">
              <option :disabled="i.disabled" :value="i.value" :selected="i.value === createUserPlatform.value">{{
                  i.text
                }}
              </option>
            </template>
          </select>
          <div class="spacer"></div>
          <button @click="addNewGameAccount" :class="loadingCreateNewAccount ? 'loading disabled pl-6':''"
                  class="btn rounded-xl btn-md h-8 btn-primary">
            {{ loadingCreateNewAccount ? '' : translate('account.create_btn') }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

