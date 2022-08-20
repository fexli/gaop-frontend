<script setup lang="ts">
const genRandAsr = (k: number): string => {
  let result = ""
  let offset = 0.5
  for (let i = 0; i < k; i++) {
    if (Math.random() > offset) {
      result += "-"
      offset += 0.1
    } else {
      result += '·'
      offset -= 0.1
    }
  }
  return result
}
const getRandDelay = (): string => {
  return ''
  // return 'animation-delay: ' + ((Math.random() * 10) - 5).toFixed(1) + 's'
}
</script>
<template>
  <div class="overflow-hidden h-5 rounded-b-xl pointer-events-none select-none">
    <div class="aside-bottom pl-[2rem]">
      <span class="aside-shining" :style="getRandDelay()" v-for="i of genRandAsr(4)">{{ i }}</span>
    </div>
    <div class="aside-bottom pl-[2.2rem]">
      <span class="aside-shining" :style="getRandDelay()" v-for="i of genRandAsr(7)">{{ i }}</span>
    </div>
    <div class="aside-bottom pl-[2.8rem]">
      <span class="aside-shining" :style="getRandDelay()" v-for="i of genRandAsr(8)">{{ i }}</span>
    </div>
    <div class="aside-bottom pl-[4rem]">
      <span class="aside-shining" :style="getRandDelay()" v-for="i of genRandAsr(6)">{{ i }}</span>
    </div>
  </div>
</template>

