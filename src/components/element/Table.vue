<script setup lang="ts">
const props = defineProps({
  widthClass: {
    type: String,
    default: "w-[40rem]"
  },
  tableHeaders:{
    type: Array,
    default: () => []
  },
  data: {
    type: Array,
    default: () => []
  },
})
</script>
<template>
  <div>
    <table class="table table-zebra table-compact" :class="widthClass">
      <thead>
      <tr>
        <template v-for="k of tableHeaders">
          <th
              :style="`width: ${k.width};white-space: break-spaces!important;`"
              class="lh-.8"
              :class="{'text-center':k['textCenter']}"
          >
            {{ k.name }}
          </th>
        </template>
      </tr>
      </thead>
      <tbody>
      <template v-for="(dataCol,i) in data">

        <tr>
          <template v-for="k of tableHeaders">
            <td
                style="white-space: break-spaces!important;"
                class="lh-.8"
                :class="{'text-center':k['textCenter']}"
            >
              {{ k.translate ? k.translate(dataCol[k.key]) : dataCol[k.key] }}
            </td>
          </template>
        </tr>
      </template>
      </tbody>
    </table>
  </div>
</template>

