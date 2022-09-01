<script setup lang="ts">
import {accountStore} from "../../../../store/account";
import {storeToRefs} from "pinia/dist/pinia";
import {useTranslate} from "../../../../hooks/translate";
import {authStore} from "../../../../store/auth";
import {router} from "../../../../router/router";
import websock from "../../../../hooks/websock";
import {useToast} from "../../../../hooks/toast";

const account = accountStore();
const {webUserInfo, accountsList} = storeToRefs(account);

const auth = authStore();
const {translate} = useTranslate();

const {showMessage} = useToast();
const logout = () => {
  if (window.confirm('Are you sure to logout?')) {
    auth.logout()
    if (websock.wsInstance){
      websock.wsInstance.close()
      console.log("websocket closed")
    }

    showMessage('logout', 2000, 'success')
    setTimeout(() => {
      router.push("/auth/login");
    }, 100)
  }
}

</script>
<template>
  <div class="dropdown dropdown-end dropdown-hover">
    <label tabindex="0" class="mt-3 btn btn-ghost btn-circle avatar">
      <div class="avatar">
        <div class="w-9 rounded-full">
          <img :src="webUserInfo['avatar']" alt="avatar"/>
          {{ webUserInfo }}
        </div>
      </div>
    </label>
    <ul tabindex="0" class="menu menu-compact dropdown-content -mt-2 p-2 shadow bg-base-100 rounded-box w-40">
      <li>
        <a href="#/account/manage" class="flex justify-between text-left">
          {{ translate('setting.account_mng') }}
          <span class="badge">{{ accountsList.length }}</span>
        </a>
      </li>
      <li><a href="#/settings">{{ translate('setting.settings') }}</a></li>
      <li><a @click="logout">{{ translate('setting.logout') }}</a></li>
    </ul>
  </div>
</template>

