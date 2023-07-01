<script setup lang="ts">
import {isLarge} from "../../plugins/common";
import global_const from "../../utils/global_const";
import {useTranslate} from "../../hooks/translate";
import TransitionOverlay from "./TransitionOverlay.vue";

const {translate} = useTranslate();

const props = defineProps({
  changeTab: {
    type: Function,
    required: true
  },
  infoHeaders: {
    type: Array,
    required: true
  },
  currentTab: {
    type: String,
  },
  currentTabIndex: {
    type: Number,
    required: true
  },
  largeMode: {
    type: Boolean,
    default: false
  }
})

</script>
<template>
  <div class="flex h-full flex-col lg:flex-row">
    <div class="lg:tabs-horizontal tabs-verticle tabs lg:tab-account">
      <div
          v-if="largeMode"
          :style="`transform: translate${largeMode ? 'Y':'X'}(${currentTabIndex}rem)`"
          class="tab-select-back absolute bg-primary w-32 h-8 mx-1 rounded-md transition-all duration-200"
      />
      <template v-for="(i,k) of infoHeaders" v-bind:key="k">
        <div
            @click="changeTab(i,k)" class="tab lg:tab-horizontal tab-verticle"
            :class="{'tab-active':currentTab === i.ref && !largeMode,'text-base-content':currentTab === i.ref}"
        >
          <svg class="w-6 h-6" stroke="currentColor" fill="currentColor" viewBox="0 0 24 24">
            <path stroke-width="0.3" :d="global_const.mdiPath[i.icon]"/>
          </svg>
          <span>{{ translate(i.title) }}</span>
          <Transition name="appear-expand">
            <svg
                v-if="currentTab === i.ref && largeMode"
                class="w-6 h-6"
                stroke="currentColor" fill="currentColor" viewBox="0 0 24 24">
              <path stroke-width="0.3" :d="global_const.mdiPath['chevron-right']"/>
            </svg>
          </Transition>
        </div>
      </template>
    </div>
    <slot name="content"/>
  </div>
</template>

