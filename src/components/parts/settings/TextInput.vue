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
  <div class="form-control w-fit">
    <label class="label">
      <div class="flex gap-2 items-center cursor-pointer">
        <input
            :onmousewheel="onAsScroll"
            v-model="settings[field]"
            type="text" class="input input-bordered input-primary input-xs"
        />
        <span
            :class="{'text-base-content text-opacity-20':isDisabled}"
            class="label-text text-lg">{{ title }}
        </span>
        <slot name="extra"/>
      </div>
    </label>
  </div>
</template>

