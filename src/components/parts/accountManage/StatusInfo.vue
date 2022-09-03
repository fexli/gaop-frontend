<script setup lang="ts">
import {defineProps} from "vue";
import {useTranslate} from "../../../hooks/translate";

const props = defineProps({
  title: {
    type: String,
    default: ""
  },
  content: {
    type: String,
    default: ""
  },
  description: {
    type: String,
    default: ""
  },
})

const {translate} = useTranslate()
</script>
<template>
  <div class="stats bg-base-200 shadow w-fit">
    <div class="stat">
      <div class="stat-figure text-primary">
        <slot name="icon"/>
      </div>
      <div class="stat-title">{{ translate(title) }}</div>
      <div class="stat-value text-primary">{{ content }}</div>
      <div v-if="description !== ''" class="stat-desc">{{ description }}</div>
    </div>
  </div>
</template>

