<script setup lang="ts">
const props = defineProps({
  rangeData: {
    type: Object,
    default: () => {
    }
  },
  maxWidthPx: {
    type: Number,
    default: 100
  },
  maxHeightPx: {
    type: Number,
    default: 100
  },
})

const rows = computed(() => {
  let _rows = props.rangeData.grids.reduce((acc: any[], innerArr: Record<string, any>) => acc.concat(innerArr.row), [] as any[])
  return {
    min: Math.min(0, ..._rows),
    max: Math.max(0, ..._rows)
  }
})

const cols = computed(() => {
  let _cols = props.rangeData.grids.reduce((acc: any[], innerArr: Record<string, any>) => acc.concat(innerArr.col), [] as any[])
  return {
    min: Math.min(0, ..._cols),
    max: Math.max(0, ..._cols)
  }
})

const shape = computed(() => {
  let w = 26 * (cols.value.max - cols.value.min + 1)
  let h = 26 * (rows.value.max - rows.value.min + 1)
  //@ts-ignore
  let zoom = Math.min(parseInt(Math.min(props.maxWidthPx / w, props.maxHeightPx / h) * 100), 100)
  return {
    w,
    h,
    zoom
  }
})
</script>
<template>
  <div :style="`zoom:${shape.zoom}%;display:inline-block;`">
    <svg
        xmlns="http://www.w3.org/2000/svg"
        :viewBox="`0 0 ${shape.w} ${shape.h}`"
        :style="`vertical-align:top;width:${shape.w}px!important;height:${shape.h}px!important`">
      <defs>
        <rect id="1" fill="#27a6f3" width="22" height="22"></rect>
        <rect id="2" fill="none" stroke="gray" stroke-width="2" width="20" height="20"></rect>
      </defs>
      <use xlink:href="#1" :x="2+26*(-cols.min)" :y="2+26*(-rows.min)"/>
      <template v-for="(i,k) of rangeData['grids']" v-bind:key="k">
        <use
            v-if="i['row'] !== 0 || i['col'] !== 0"
            xlink:href="#2"
            :x="(i['row'] !== 0 || i['col'] !== 0 ? 1:0)+2+26*(i['col']-cols.min)"
            :y="(i['row'] !== 0 || i['col'] !== 0 ? 1:0)+2+26*(i['row']-rows.min)"
        />
      </template>
    </svg>
  </div>
</template>

