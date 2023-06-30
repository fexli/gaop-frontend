<script setup lang="ts">
import {useTranslate} from "../../hooks/translate";

defineProps({
  value: {
    type: [String, Number],
    default: '',
  },
  description: {
    type: String,
    default: '',
  },
  translateDescription: {
    type: Boolean,
    default: false,
  },
  fontSize: {
    type: String,
    default: "2.3rem"
  },
  icon: String,
})
const {translate} = useTranslate()
</script>
<template>
  <div class="card w-52 mr-1 bg-base-100 shadow-xl p-0 overflow-hidden">
    <div class="m-2 ml-5">
      <h2 :style="`font-size: ${fontSize};font-weight: bold`">{{ value }}</h2>
      <p class="-mt-2">{{ translateDescription ? translate(description) : description }}</p>
    </div>
    <img class="absolute -bottom-5 right-0 w-36 opacity-5 pointer-events-none" :src="'/static/icon/'+icon+'.png'"
         :alt="icon"/>
  </div>
</template>

