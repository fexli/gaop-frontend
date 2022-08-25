<script setup lang="ts">
import {useTranslate} from "../hooks/translate";
import {authStore} from "../store/auth";
import {storeToRefs} from "pinia/dist/pinia";
import StatusInfo from "../components/parts/accountManage/StatusInfo.vue";
import {accountStore} from "../store/account";

const {translate} = useTranslate();

const auth = authStore();
const {username} = storeToRefs(auth);

const account = accountStore();
const {gameAccountLi, inRunningAccount, webUserInfo} = storeToRefs(account);

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
</script>
<template>
  <div class="hidden xs:flex shadow-lg h-10 mb-2 mt-1 rounded-xl border-primary border-2">
    <div class="w-full flex items-center justify-center">
      <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current flex-shrink-0 h-6 w-6 text-primary" fill="none"
           viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
      </svg>
      <div class="text-primary">{{ translate("account.welcome", username) }}</div>
    </div>
  </div>
  <div class="flex flex-wrap flex-row lg:flex-col">
    <StatusInfo class="mr-1 lg:mr-0" title="account.current" :content="currentAccounts">
      <template v-slot:icon>
        <svg class="w-6 h-6" stroke="currentColor" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
              d="M38 30H10C6.68629 30 4 32.6863 4 36C4 39.3137 6.68629 42 10 42H38C41.3137 42 44 39.3137 44 36C44 32.6863 41.3137 30 38 30Z M36 22C40.4183 22 44 18.4183 44 14C44 9.58172 40.4183 6 36 6C31.5817 6 28 9.58172 28 14C28 18.4183 31.5817 22 36 22Z M4 14L13 5L22 14L13 23L4 14Z"
              fill="none" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </template>
    </StatusInfo>
    <StatusInfo class="mr-1 lg:mr-0" title="account.inrunning" :content="inRunningAccounts">
      <template v-slot:icon>
        <svg class="h-6 w-6" viewBox="0 0 24 24">
          <path fill="currentColor"
                d="M4 6H2V20C2 21.1 2.9 22 4 22H18V20H4V6M20 4V16H8V4H20M20 2H8C6.9 2 6 2.9 6 4V16C6 17.1 6.9 18 8 18H20C21.1 18 22 17.1 22 16V4C22 2.9 21.1 2 20 2M12 14.5V5.5L18 10L12 14.5Z"/>
        </svg>
      </template>
    </StatusInfo>
    <StatusInfo class="mr-1 lg:mr-0" title="account.user_level" :content="userLevel[webUserInfo.ul]">
      <template v-slot:icon>
        <svg class="h-6 w-6" viewBox="0 0 24 24">
          <path fill="currentColor"
                d="M4 6H2V20C2 21.1 2.9 22 4 22H18V20H4V6M20 4V16H8V4H20M20 2H8C6.9 2 6 2.9 6 4V16C6 17.1 6.9 18 8 18H20C21.1 18 22 17.1 22 16V4C22 2.9 21.1 2 20 2M12 14.5V5.5L18 10L12 14.5Z"/>
        </svg>
      </template>
    </StatusInfo>
  </div>
</template>

