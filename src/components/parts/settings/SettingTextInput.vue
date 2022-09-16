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
  disabled: {
    type: Boolean,
    default: undefined,
  },
  numberOnly: {
    type: Boolean,
    default: false,
  },
  numberMax: {
    type: Number,
    default: undefined,
  },
  numberMin: {
    type: Number,
    default: undefined,
  },
  placeholder: {
    type: String,
    default: "",
  },
  padding: {
    type: String,
    default: 'p-1 py-2'
  },
  textClass: {
    type: String,
    default: 'text-lg'
  },
  width: {
    type: String,
    default: 'w-fit'
  },
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
  if (!props.numberOnly) {
    props.settings[props.field] = value
    return
  }
  let v = parseInt(value)
  if (isNaN(v)) {
    v = 0
  }
  if (props.numberMax !== undefined && v > props.numberMax) {
    v = props.numberMax
  }
  if (props.numberMin !== undefined && v < props.numberMin) {
    v = props.numberMin
  }
  inputValue.value = v
  props.settings[props.field] = v
})

function onAsScroll(e: WheelEvent) {
  if (isDisabled.value) {
    return
  }
  if (!props.numberOnly) {
    return
  }
  e.preventDefault()
  if (e.deltaX > 0) {
    inputValue.value = inputValue.value - 1
  } else if (e.deltaX < 0) {
    inputValue.value = inputValue.value + 1
  }
  if (e.deltaY > 0) {
    inputValue.value = inputValue.value - 1
  } else if (e.deltaY < 0) {
    inputValue.value = inputValue.value + 1
  }
}
</script>
<template>
  <div class="form-control" :class="padding">
    <div class="flex gap-2 items-center">
      <input
          :placeholder="placeholder"
          :onmousewheel="onAsScroll"
          v-model="settings[field]"
          :disabled="isDisabled"
          type="text" class="input input-bordered input-primary input-xs px-1"
          :class="width"
      />
      <span
          :class="(isDisabled ? 'text-base-content text-opacity-20 ': ' ') + textClass"
          class="label-text">{{ title }}
        </span>
      <slot name="extra"/>
    </div>
  </div>
</template>

