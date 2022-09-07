<script setup lang="ts">
const props = defineProps({
  page: {
    type: Number,
    default: 1,
  },
  onPageChange: {
    type: Function,
    default: () => {
    }
  },
  totalPage: {
    type: Number,
    default: 1,
  }
})
const pageList = computed(() => {
  let pl = [] as number[]
  for (let i = 0; i < props.totalPage; i++) {
    pl.push(i + 1)
  }
  return pl
})
function prevPage() {
  if (props.page > 1 && props.page <= props.totalPage && props.onPageChange) {
    props.onPageChange(props.page - 1)
  }
}

function nextPage() {
  if (props.page < props.totalPage && props.page >= 1 && props.onPageChange) {
    props.onPageChange(props.page + 1)
  }
}


</script>
<template>
  <div aria-label="Pagination" class="inline-flex space-x-1 shadow-sm h-8">
    <button
        type="button"
        @click="prevPage"
        class="inline-flex items-center p-1 text-sm font-semibold border rounded-xl border-gray-700"
    >
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5">
        <path
            fill-rule="evenodd"
            d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
            clip-rule="evenodd">
        </path>
      </svg>
    </button>
    <template v-for="(i,k) of pageList" v-bind:key="k">
      <button
          @click="onPageChange && onPageChange(i)"
          type="button"
          class="rounded-xl items-center w-8 text-center text-sm font-semibold border dark:border-gray-700 transition-all"
          :class="{'bg-primary text-gray-900 border-gray-700': i === props.page}"
      >
        {{ i }}
      </button>
    </template>
    <button
        type="button"
        @click="nextPage"
        class="inline-flex items-center p-1 text-sm font-semibold border rounded-xl border-gray-700"
    >
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5">
        <path
            fill-rule="evenodd"
            d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
            clip-rule="evenodd">
        </path>
      </svg>
    </button>
  </div>
</template>

