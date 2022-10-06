<template>
  <div class="container mx-auto h-full flex flex-1 justify-center items-center">
    <div class="relative mx-10 sm:max-w-sm w-full">
      <div
          class="card bg-primary shadow-lg w-full h-full rounded-3xl absolute transform -rotate-6"
      ></div>
      <div
          class="card bg-secondary shadow-lg w-full h-full rounded-3xl absolute transform rotate-6"
      ></div>
      <div class="relative w-full rounded-3xl px-6 py-4 bg-gray-100 shadow-md">
        <div class="flex flex-row justify-center items-center">
          <img
              src="/static/logo.png"
              alt="Arknights"
              class="h-12"
          />
          <label for="" class="block text-2xl text-gray-700 text-center font-semibold">
            {{ t("login.title") }}
          </label>
        </div>
        <form class="mt-6" @submit.prevent="onSubmit">
          <div class="relative">
            <input
                v-model="account"
                @input.prevent="usrLabel = false"
                :placeholder="usernameInputText"
                class="fe-input"
            />
            <label class="label">
              <span class="label-text-alt text-error">
                {{ usrLabel ? t("login.error.username_empty") : "" }}
              </span>
            </label>
          </div>

          <div class="mt-4 relative">
            <input
                v-model="password"
                type="password"
                @input.prevent="pswdLabel = false"
                :placeholder="passwordInputText"
                class="fe-input"
            />
            <label class="label">
              <span class="label-text-alt text-error">
                {{ pswdLabel ? t("login.error.password_empty") : "" }}
              </span>
            </label>
          </div>

          <div class="mt-5 flex">
            <div class="w-full text-left" @click="openSwitchServ">
              <span class="underline text-sm text-gray-600 mr-5 hover:text-gray-900 cursor-pointer">
                {{ t("login.switch_serv") }}
              </span>
            </div>
            <div class="w-full text-right">
              <a class="underline text-sm text-gray-600 mr-5 hover:text-gray-900" href="#/auth/register">
                {{ t("login.register") }}
              </a>
              <!--              <a class="underline text-sm text-gray-600 hover:text-gray-900" href="#">-->
              <!--                {{ t("login.forget") }}-->
              <!--              </a>-->
            </div>
          </div>
          <div class="mt-5">
            <button
                :disabled="loading"
                class="bg-blue-500 w-full py-3 rounded-xl text-white shadow-xl hover:shadow-inner focus:outline-none transition duration-500 ease-in-out transform hover:-translate-x hover:scale-105"
            >
              {{ t("login.login") }}
            </button>
          </div>
          <div class="flex items-center text-center">
            <hr class="border-gray-300 border-1 w-1/2 rounded-md"/>
            <label class="mt-2 block font-medium text-sm text-gray-600 w-full">
              {{ t("login.notice_reg") }}
            </label>
            <hr class="border-gray-300 border-1 w-1/2 rounded-md"/>
          </div>
        </form>
      </div>
    </div>
    <div v-if="switchServOvl" class="overlay bg-base-200 bg-opacity-40">
      <div class="max-w-md rounded-xl shadow-md bg-base-200 relative">
        <div class="flex flex-col justify-between p-6 space-y-6">
          <div class="space-y-2">
            <h2 class="text-3xl font-semibold tracking-wide">{{ translate('login.switch_serv') }}</h2>
            <Select
                :list="global_const.servers"
                item-text="name"
                item-value="name"
                :value="serverInfo.name"
                @valueSelect="serverTypeChanged"
            ></Select>
            <template v-if="serverInfo.name === '自定义'">
              <p>
                {{ translate("server.desc_diy") }}
              </p>
              <div class="flex items-center">
                <span>{{ translate('server.server', '') }}</span>
                <SettingTextInput
                    :settings="serverInfo"
                    field="server"
                    padding=""
                />
              </div>
              <div class="flex items-center">
                <span>{{ translate('server.secure', '') }}</span>
                <SettingToggle
                    :settings="serverInfo"
                    field="secure"

                />
              </div>
            </template>
            <template v-else>
              <p>{{ translate('server.server_name', serverInfo.name) }}</p>
              <p>{{ translate('server.server', serverInfo.server) }}</p>
              <p>{{ translate('server.secure', serverInfo.secure ? '√' : '×') }}</p>
            </template>
          </div>
          <button
              type="button"
              class="fe-btn"
              @click="confirmSwitchServ"
          >
            {{ translate('server.confirm') }}
          </button>
        </div>
        <button class="btn btn-circle absolute right-1 top-1 btn-md btn-ghost" @click="switchServOvl=false">
          <svg class="w-6 h-6" viewBox="0 0 24 24">
            <path fill="currentColor" :d="global_const.mdiPath['close']"/>
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {useI18n} from "vue-next-i18n";
import {useRouter} from "vue-router";
import {createToast} from "mosha-vue-toastify";
import {authStore} from "../../store/auth";
import {useLoginPlaceholder} from "../../hooks/computed";
import {useTranslate} from "../../hooks/translate";
import {useToast} from "../../hooks/toast";
import websock from "../../hooks/websock";
import {accountStore} from "../../store/account";
import Select from "../../components/element/Select.vue";
import global_const from "../../utils/global_const";
import {getCurrentInstance, Ref} from "vue";
import {appStore} from "../../store/app";
import {serverStore} from "../../store/server";
import {storeToRefs} from "pinia/dist/pinia";
import SettingTextInput from "../../components/parts/settings/SettingTextInput.vue";
import SettingToggle from "../../components/parts/settings/SettingToggle.vue";

const {translate} = useTranslate();
const router = useRouter();
const auth = authStore();
const serverStore1 = serverStore();
const {t} = useI18n();
const {showMessage} = useToast()
const {passwordInputText, usernameInputText} = useLoginPlaceholder();
const $axios = getCurrentInstance()?.appContext.config.globalProperties.$axios.defaults;

const loading = ref(false);

const usrLabel = ref(false);
const pswdLabel = ref(false);


const account = ref("");
const password = ref("");

const switchServOvl = ref(false);
const serverInfo: Ref<Record<any, any>> = ref({
  name: serverStore1.serverName,
  server: serverStore1.server,
  secure: serverStore1.secure,
});

watch(() => serverInfo.value.name, (v: any) => {
  if (v !== '自定义') {
    const server = global_const.servers.find((s: any) => s.name === v);
    serverInfo.value.server = server?.server || '';
    serverInfo.value.secure = server?.secure || false;
  }
})

function serverTypeChanged(v: any) {
  console.log("serverTypeChanged", v);
  serverInfo.value.name = v;
}

function confirmSwitchServ() {
  console.log("confirmSwitchServ", serverInfo.value);
  serverStore1.setServer(serverInfo.value);
  showMessage(translate("server.switch_suc"), 2000, 'success')

  $axios.baseURL = `http${serverStore1.getSecure ? 's' : ''}://${serverStore1.getServer}/`
  switchServOvl.value = false;
}

const onSubmit = async (values: any) => {
  console.log(values);
  loading.value = true;
  let ok = true;
  usrLabel.value = pswdLabel.value = false;
  if (password.value == "") {
    ok = false;
    pswdLabel.value = true;
  }
  if (account.value == "") {
    ok = false;
    usrLabel.value = true;
  }
  if (!ok) {
    loading.value = false;
    return;
  }
  await auth.login(
      account.value,
      password.value,
  ).then(() => {
    loading.value = false;
    router.push("/dashboard");
    showMessage("login.success", 4000, "success", account.value);
    websock.initWebSocket()
    const _account = accountStore()
    _account.getSyncUserData()
    _account.getHistoryLog()
  }).catch((err) => {
    loading.value = false;
    console.log(err)
    console.log(err.data.msg)
    showMessage(err.data.msg, 4000, "danger")
  });
}

function openSwitchServ() {
  serverInfo.value = {
    name: serverStore1.serverName,
    server: serverStore1.server,
    secure: serverStore1.secure,
  };
  switchServOvl.value = true;
}
</script>

<style lang="sass" scoped>
.page-login
  //&__card
  max-width: 600px
  margin: 0 auto
</style>
