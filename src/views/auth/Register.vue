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
            {{ t("register.title") }}
          </label>
        </div>
        <div class="alert alert-info shadow-lg">
          <div>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                 class="stroke-current flex-shrink-0 w-6 h-6">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <span>{{ t("register.notice") }}</span>
          </div>
        </div>
        <form class="mt-6" @submit.prevent="onSubmit">
          <div class="relative">
            <input
                v-model="account"
                @input.prevent="usrLabel = false"
                :placeholder="regUserInputText"
                class="mt-1 pl-2 block w-full border-none bg-gray-100 h-11 rounded-xl shadow-lg hover:bg-blue-100 focus:bg-blue-100 focus:ring-0"
            />
            <label class="label">
              <span class="label-text-alt text-error">
                {{ usrLabel ? t("register.error.username_empty") : "" }}
              </span>
            </label>
          </div>

          <div class="mt-4relative">
            <input
                v-model="password"
                type="password"
                @input.prevent="pswdLabel = false"
                :placeholder="regPassInputText"
                class="mt-1 pl-2 block w-full border-none bg-gray-100 h-11 rounded-xl shadow-lg hover:bg-blue-100 focus:bg-blue-100 focus:ring-0"
            />
            <label class="label">
              <span class="label-text-alt text-error">
                {{ pswdLabel ? t("register.error.password_empty") : "" }}
              </span>
            </label>
          </div>

          <div class="mt-4relative">
            <input
                v-model="invite"
                @input.prevent="inviteLabel = false"
                :placeholder="regInviteInputText"
                class="mt-1 pl-2 block w-full border-none bg-gray-100 h-11 rounded-xl shadow-lg hover:bg-blue-100 focus:bg-blue-100 focus:ring-0"
            />
            <label class="label">
              <span class="label-text-alt text-error">
                {{ inviteLabel ? t("register.error.invite_empty") : "" }}
              </span>
            </label>
          </div>

          <div class="mt-5 flex">
            <div class="w-full text-left">
              <a class="underline text-sm text-gray-600 mr-5 hover:text-gray-900" href="/auth/login">
                {{ t("register.back_login") }}
              </a>
            </div>
          </div>

          <div class="mt-5">
            <button
                :disabled="loading"
                class="bg-blue-500 w-full py-3 rounded-xl text-white shadow-xl hover:shadow-inner focus:outline-none transition duration-500 ease-in-out transform hover:-translate-x hover:scale-105"
            >
              {{ t("register.register") }}
            </button>
          </div>

          <div class="flex items-center text-center">
            <hr class="border-gray-300 border-1 w-1/2 rounded-md"/>
            <label class="mt-2 block font-medium text-sm text-gray-600 w-full">
              {{ t("login.notice_reg") }}
            </label>
            <hr class="border-gray-300 border-1 w-1/2 rounded-md"/>
          </div>

          <!--          <div class="flex mt-7 justify-center w-full">-->
          <!--            <div-->
          <!--                class="mr-5 flex justify-center items-center bg-blue-500 border-none px-4 py-2 rounded-xl cursor-pointer text-white shadow-xl hover:shadow-inner transition duration-500 ease-in-out transform hover:-translate-x hover:scale-105"-->
          <!--            >-->
          <!--              <i-mdi-qqchat style="font-size: 1em; color: #fff"/>-->
          <!--              <span class="ml-1">{{ t("page.common.login.form.link.btn.qq") }}</span>-->
          <!--            </div>-->
          <!--            <div-->
          <!--                class="flex justify-center items-center bg-green-600 border-none px-4 py-2 rounded-xl cursor-pointer text-white shadow-xl hover:shadow-inner transition duration-500 ease-in-out transform hover:-translate-x hover:scale-105"-->
          <!--            >-->
          <!--              <i-mdi-wechat style="font-size: 1.2em; color: #fff"/>-->
          <!--              <span class="ml-1">{{ t("page.common.login.form.link.btn.wechat") }}</span>-->
          <!--            </div>-->
          <!--          </div>-->
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {useRouter} from "vue-router";
import {authStore} from "../../store/auth";
import {useLoginPlaceholder} from "../../hooks/computed";
import {useToast} from "../../hooks/toast";


const router = useRouter();
const auth = authStore();
const {regUserInputText, regPassInputText, regInviteInputText} = useLoginPlaceholder();
const {showMessage} = useToast()

const loading = ref(false);

const usrLabel = ref(false);
const pswdLabel = ref(false);
const inviteLabel = ref(false);


const account = ref("");
const password = ref("");
const invite = ref("");

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
  if (invite.value == "") {
    ok = false;
    inviteLabel.value = true;
  }
  if (!ok) {
    loading.value = false;
    return;
  }
  await auth.register(
      account.value,
      password.value,
      invite.value
  ).then(() => {
    loading.value = false;
    showMessage("register.success", 4000, "success")
    router.push("/auth/login");
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
