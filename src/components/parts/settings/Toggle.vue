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
  enableText: {
    type: String,
    default: "启用",
  },
  disableText: {
    type: String,
    default: "禁用",
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
  <div class="form-control w-fit">
    <label class="label">
      <div class="flex gap-2 items-center cursor-pointer">
        <input :disabled="isDisabled" v-model="settings[field]" type="checkbox"
               class="toggle toggle-primary"/>
        <span
            :class="{'text-base-content text-opacity-20':isDisabled}"
            class="label-text text-lg">{{ title }}:{{ settings[field] ? enableText : disableText }}
        </span>
        <slot name="extra"/>
      </div>
    </label>
  </div>
</template>

