<template>
  <div class="container mx-auto h-full flex flex-1 justify-center items-center">
    <div class="relative mx-10 sm:max-w-sm w-full">
      <div
          class="card bg-blue-400 shadow-lg w-full h-full rounded-3xl absolute transform -rotate-6"
      ></div>
      <div
          class="card bg-red-400 shadow-lg w-full h-full rounded-3xl absolute transform rotate-6"
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
                class="mt-1 pl-2 block w-full border-none bg-gray-100 h-11 rounded-xl shadow-lg hover:bg-blue-100 focus:bg-blue-100 focus:ring-0"
            />
            <label class="label">
              <span class="label-text-alt text-error">
                {{ usrLabel ? t("login.error.username_empty") : "" }}
              </span>
            </label>
          </div>

          <div class="mt-4relative">
            <input
                v-model="password"
                type="password"
                @input.prevent="pswdLabel = false"
                :placeholder="passwordInputText"
                class="mt-1 pl-2 block w-full border-none bg-gray-100 h-11 rounded-xl shadow-lg hover:bg-blue-100 focus:bg-blue-100 focus:ring-0"
            />
            <label class="label">
              <span class="label-text-alt text-error">
                {{ pswdLabel ? t("login.error.password_empty") : "" }}
              </span>
            </label>
          </div>

          <div class="mt-5 flex">
            <div class="w-full text-left">
              <a class="underline text-sm text-gray-600 mr-5 hover:text-gray-900" href="#">
                {{ t("login.switch_serv") }}
              </a>
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

const {translate} = useTranslate();
const router = useRouter();
const auth = authStore();
const {t} = useI18n();
const {showMessage} = useToast()
const {passwordInputText, usernameInputText} = useLoginPlaceholder();

const loading = ref(false);

const usrLabel = ref(false);
const pswdLabel = ref(false);


const account = ref("");
const password = ref("");

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
</script>

<style lang="sass" scoped>
.page-login
  //&__card
  max-width: 600px
  margin: 0 auto
</style>
