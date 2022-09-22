<script setup lang="ts">

import Select from "../../element/Select.vue";

const props = defineProps({
  settings: {
    type: Object,
    default: {},
  },
  field: {
    type: String,
    default: "",
  },
  list: {
    type: Array,
    default: [],
  },
  title: {
    type: String,
    default: "",
  },
  itemText: {
    type: String,
    default: "key",
  },
  itemValue: {
    type: String,
    default: "value",
  },
  disabled: {
    type: Boolean,
    default: undefined,
  },
  textLeft: {
    type: Boolean,
    default: false,
  }
})

const isDisabled = computed(() => {
  if (props.disabled === undefined) {
    return props.settings[props.field] === undefined
  }
  return props.disabled
})

function changedValue(v: any) {
  props.settings[props.field] = v
}
</script>
<template>
  <div class="form-control w-fit p-1">
    <div class="flex gap-2 items-center cursor-pointer" :class="textLeft ? 'flex-row-reverse' : ''">
      <Select
          :list="list"
          :item-text="itemText"
          :item-value="itemValue"
          :value="settings[field]"
          @valueSelect="changedValue"
      />
      <div class="flex justify-center items-center gap-1">
        <span
            :class="{'text-base-content text-opacity-20':isDisabled}"
            class="text-lg"
        >
          {{ title }}
        </span>
        <slot name="extra"/>
      </div>
    </div>
  </div>
</template>

