<script setup lang="ts">
import {Ref} from "vue";
import {set} from "nprogress";

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  },
  transitionName: {
    type: String,
    default: 'appear-expand'
  },
  duration: {
    type: Number,
    default: 300
  }
})

const isOpen: Ref<Boolean> = ref(false)
const isClosing: Ref<Boolean> = ref(false)

function tryCloseBeforeOpen() {
  if (isClosing.value) {
    isClosing.value = false
    isOpen.value = false
  }
}

watch(() => props.show, (val: boolean) => {
  if (val) {
    isOpen.value = true
    isClosing.value = false
  } else {
    isClosing.value = true
    setTimeout(tryCloseBeforeOpen, props.duration)
  }
})
</script>
<template>
  <div v-show="isOpen">
    <Transition :name="transitionName">
      <slot v-if="show"/>
    </Transition>
  </div>
</template>

