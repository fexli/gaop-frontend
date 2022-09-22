<script setup lang="ts">
import {Ref} from "vue";

const props = defineProps({
  settings: {
    type: Object,
    default: {},
  },
  field: {
    type: String,
    default: "",
  },
  title: {
    type: String,
    default: "",
  },
  min: {
    type: Number,
    default: 0,
  },
  max: {
    type: Number,
    default: 100,
  },
  disabled: {
    type: Boolean,
    default: undefined,
  }
})

const isDisabled = computed(() => {
  if (props.disabled === undefined) {
    return props.settings[props.field] === undefined
  }
  return props.disabled
})
const inputValue: Ref = ref(props.settings[props.field] || 0)
watch(() => props.settings[props.field], (value) => {
  inputValue.value = value
})
watch(() => inputValue.value, (value) => {
  let v = parseInt(value)
  if (isNaN(v)) {
    inputValue.value = 0
  }
  if (v < props.min) {
    v = props.min
  }
  if (v > props.max) {
    v = props.max
  }
  inputValue.value = v
  props.settings[props.field] = v
})

function onAsScroll(e: WheelEvent) {
  if (isDisabled.value) {
    return
  }
  e.preventDefault()
  if (e.deltaX > 0) {
    inputValue.value = Math.max(inputValue.value - 1, props.min)
  } else if (e.deltaX < 0) {
    inputValue.value = Math.min(inputValue.value + 1, props.max)
  }
  if (e.deltaY > 0) {
    inputValue.value = Math.max(inputValue.value - 1, props.min)
  } else if (e.deltaY < 0) {
    inputValue.value = Math.min(inputValue.value + 1, props.max)
  }
}
</script>
<template>
  <div class="p-1">
    <div class="flex gap-2 items-center">
      <input
          :disabled="isDisabled"
          :onmousewheel="onAsScroll"
          v-model="settings[field]" type="range" :min="min" :max="max"
          class="range range-primary max-w-[10rem]"
      />
      <span
          :class="{'text-base-content text-opacity-20':isDisabled}"
          class="label-text text-lg"
      >
        {{ title }}:
      </span>
      <input
          :disabled="isDisabled"
          v-model="inputValue" type="text"
          :onmousewheel="onAsScroll"
          :class="{'text-base-content text-opacity-20':isDisabled}"
          class="-m-1.5 focus:m-0 input input-xs hover:outline-primary bg-base-200 text-lg transition-all w-10 p-0"
      />
      <slot name="extra"/>
    </div>
  </div>
</template>

