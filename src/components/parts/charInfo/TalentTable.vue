<script setup lang="ts">
import {GameInfoParser, TalentObject} from "../../../utils/gameInfoParser";

const props = defineProps({
  talentObj:{
    type: TalentObject,
    default: () => {
    }
  },
  gameParser:{
    type: GameInfoParser,
    default: () => new GameInfoParser()
  },
})
</script>
<template>
  <div class="card bg-base-100 rounded-md mt-1 w-[40rem] ring-primary ring-1 flex items-end">
    <table class="table table-zebra table-compact w-[40rem]">
      <thead>
      <tr>
        <th style="width: 4rem;white-space: break-spaces!important;" class="lh-.8">名称</th>
        <th style="width: 20rem;white-space: break-spaces!important;" class="lh-.8">描述</th>
        <th style="width: 6.5rem;white-space: break-spaces!important;" class="lh-.8">解锁条件</th>
        <th style="width: 4rem;white-space: break-spaces!important;" class="lh-.8">说明</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="(ani,i) in talentObj.talent">
        <td style="white-space: break-spaces!important;" class="lh-.8">{{ ani.name }}</td>
        <td style="white-space: break-spaces!important;" class="lh-.8"
            v-html="gameParser.compileDescRichText(ani.description, '', false)">
        </td>
        <td style="white-space: break-spaces!important;" class="lh-.8">{{ gameParser.parseUnlockCond(ani) }}</td>
        <td style="white-space: break-spaces!important;" class="lh-.8">
          {{ i === talentObj['current'] ? talentObj['isUnlock'] ? '当前生效' : '未解锁' : '' }}
        </td>
      </tr>
      </tbody>
    </table>
  </div>
</template>

