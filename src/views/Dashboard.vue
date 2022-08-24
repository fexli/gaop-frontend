<template>
  <div class="w-full h-full fixed left-0 top-0 text-center flex flex-col justify-center select-none">
    <div class="w-full text-primary text-dash" :style="`opacity: ${Math.min(t1o/40,1)}`">{{ t1l[t1t] }}</div>
    <div @click="$router.push('/account/manage')" class="w-full text-primary text-dash"
         :style="`opacity: ${Math.min(t1o/40,1)}`">{{ t2l[t1t] }}
    </div>
  </div>
</template>

<script setup lang="ts">
import {onMounted} from "vue";

let tiv: NodeJS.Timer;
const t1t = ref(0)
const t1o = ref(99)
const t1v = ref(-1)
const t1l = [
  "Welcome To Project AoP",
  "欢迎来到方舟离线协议工程",
  "AoPプロジェクトへようこそ",
  // "AoP 프로젝트에 오신 것을 환영합니다",
]
const t2l = [
  "Please Go To 'Account Manager' Page To Continue",
  "请进入“账号管理”页面以继续",
  "アカウント管理ページに移動してください",
  // "계정 관리 페이지로 이동하십시오.",
]
onMounted(() => {
  tiv = setInterval(() => {
    if (t1o.value === 0 || t1o.value === 100) {
      if (t1v.value < 0) {
        t1t.value++
        if (t1t.value >= t1l.length) {
          t1t.value = 0
        }
      }
      t1v.value = -t1v.value
    }
    t1o.value += t1v.value
  }, 25);
  onDeactivated(() => {
    clearInterval(tiv)
  });
})
</script>
