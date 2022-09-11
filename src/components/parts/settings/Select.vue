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
  }
})

const isDisabled = computed(() => {
  if (props.disabled === undefined) {
    return props.settings[props.field] === undefined
  }
  return props.disabled
})

</script>
<template>
  <div class="form-control w-fit my-2 ml-1">
    <div class="flex gap-2 items-center cursor-pointer">
      <select v-model="settings[field]" class="select select-primary select-xs w-fit max-w-xs">
        <template v-for="i of list">
          <option :value="i[itemValue]">{{ i[itemText] }}</option>
        </template>
      </select>
      <span
          :class="{'text-base-content text-opacity-20':isDisabled}"
          class="text-lg"
      >
        {{ title }}
        </span>
      <slot name="extra"/>
    </div>
  </div>
</template>

