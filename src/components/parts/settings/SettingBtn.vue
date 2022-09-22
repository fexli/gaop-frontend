<script setup lang="ts">
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
  titleBtn: {
    type: String,
    default: "",
  },
  clicker: {
    type: Function,
    default: () => {
    },
  },
  disabled: {
    type: Boolean,
    default: undefined,
  },
})

const isDisabled = computed(() => {
  if (props.disabled === undefined) {
    return props.settings[props.field] === undefined
  }
  return props.disabled
})
</script>
<template>
  <div class="flex gap-2 items-center p-1">
    <div class="fe-btn fe-btn_set" @click="clicker">
      {{ titleBtn }}
    </div>
    <span
        :class="{'text-base-content text-opacity-20':isDisabled}"
        class="label-text text-lg"
    >
        {{ title }}
      </span>
    <slot name="extra"/>
  </div>
</template>

