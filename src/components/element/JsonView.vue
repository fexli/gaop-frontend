<template>
  <div class="bgView">
    <div :class="['json-view', length ? 'closeable' : '']"
         :style="'font-size:' + fontSize+'px; line-height:'+lineHeight+'px'">
    <span @click="toggleClose" :class="['angle', innerclosed ? 'closed' : '']" v-if="length">
    </span>
      <div class="content-wrap">
        <p class="first-line">
          <span v-if="jsonKey" class="json-key">"{{ jsonKey }}": </span>
          <span v-if="length">
          {{ prefix }}
          {{ innerclosed ? ('...' + subfix) : '' }}
          <span class="json-note">
           {{ innerclosed ? (' // count: ' + length) : '' }}
          </span>
        </span>
          <span v-if="!length">{{ isArray ? '[]' : '{}' }}</span>
        </p>
        <div v-if="!innerclosed && length" class="json-body">
          <template v-for="(item, index) in items">
            <JsonView
                :closed="childClosed"
                v-if="item.isJSON"
                :key="index"
                :json="item.value"
                :jsonKey="item.key"
                :isLast="index === items.length - 1"
            ></JsonView>
            <p class="json-item" v-else>
              <span class="json-key">
                  {{ (isArray ? '' : '"' + item.key + '"') }}
              </span>
              :
              <span :class="isString(item.value)?'text-secondary':'text-success'">
              {{ item.value }}
              </span>
              {{ index === items.length - 1 ? '' : ',' }}
            </p>
          </template>
          <span v-show="!innerclosed" class="body-line"></span>
        </div>
        <p v-if="!innerclosed && length" class="last-line">
          <span>{{ subfix }}</span>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  json: [Object, Array],
  jsonKey: {
    type: String,
    default: ''
  },
  closed: {
    type: [Boolean, Array],
    default: true
  },
  isLast: {
    type: Boolean,
    default: true
  },
  fontSize: {
    type: Number,
    default: 15
  },
  lineHeight: {
    type: Number,
    default: 6
  },
})

const innerclosed = ref(true);

function checkClose() {
  if (Array.isArray(props.closed) && props.closed.length) {
    innerclosed.value = props.closed[0]
  } else {
    innerclosed.value = props.closed as boolean;
  }
}

const childClosed = computed(() => {
  if (Array.isArray(props.closed) && props.closed.length) {
    return props.closed.slice(1)
  } else {
    return props.closed as boolean;
  }
})
onMounted(() => {
  checkClose()
  watch(() => props.closed, () => {
    checkClose()
  })
})

function isObjectOrArray(source: any) {
  const type = Object.prototype.toString.call(source)
  return type === '[object Array]' || type === '[object Object]'
}

function isString(source: string) {
  return source[0] === "\"" && source[source.length - 1] === "\""
}

function toggleClose() {
  innerclosed.value = !innerclosed.value;
}

const isArray = computed(() => {
  return Object.prototype.toString.call(props.json) === '[object Array]'
})

const length = computed(() => {
  return isArray.value ? props.json?.length : Object.keys(props.json as any).length
})

const subfix = computed(() => {
  return (isArray.value ? ']' : '}') + (props.isLast ? '' : ',')
})

const prefix = computed(() => {
  return isArray.value ? '[' : '{'
})

const items = computed(() => {
  if (isArray.value) {
    return props.json?.map((item: any) => {
      const isJSON = isObjectOrArray(item)
      return {
        value: isJSON ? item : JSON.stringify(item),
        isJSON,
        key: ''
      }
    })
  }
  const json = props.json as any
  return Object.keys(json).map(key => {
    const item = json[key]
    const isJSON = isObjectOrArray(item)
    return {
      value: isJSON ? item : JSON.stringify(item),
      isJSON,
      key
    }
  })
})
</script>

<style>
/*.bgView {*/
/*  background-color: #fafafa;*/
/*}*/

.json-view {
  position: relative;
  display: block;
  width: 100%;
  height: 100%;
  white-space: nowrap;
  padding-left: 20px;
  box-sizing: border-box;
  font-weight: bold;
}

.json-note {
  @apply text-gray-600
}

.json-key {
  @apply text-primary
}

.json-item {
  margin: 0;
  padding-left: 20px;
  height: 16px;
}

.first-line {
  padding: 0;
  margin: 0;
  height: 16px;
}

.json-body {
  position: relative;
  padding: 0;
  margin: 0;
}

.json-body .body-line {
  position: absolute;
  height: 100%;
  width: 0;
  border-left: dashed 1px #bbb;
  top: 0;
  left: 2px;
}

.last-line {
  padding: 0;
  margin: 0;
  height: 16px;
}

.angle {
  position: absolute;
  display: block;
  cursor: pointer;
  float: left;
  width: 20px;
  text-align: center;
  left: 0;
}

.angle::after {
  content: "";
  display: inline-block;
  width: 0;
  height: 0;
  vertical-align: middle;
  border-top: solid 4px;
  border-left: solid 6px transparent;
  border-right: solid 6px transparent;
}

.angle.closed::after {
  border-left: solid 4px;
  border-top: solid 6px transparent;
  border-bottom: solid 6px transparent;
}
</style>