<script setup lang="ts">
import {GameInfoParser, SkillObject} from "../../../utils/gameInfoParser";

const props = defineProps({
  skillObj: {
    type: SkillObject,
    default: () => {
    }
  },
  gameParser: {
    type: GameInfoParser,
    default: () => new GameInfoParser()
  },
})

function LevelToCnName(l: number): string {
  switch (l) {
    case 0:
      return 'LV1';
    case 1:
      return 'LV2';
    case 2:
      return 'LV3';
    case 3:
      return 'LV4';
    case 4:
      return 'LV5';
    case 5:
      return 'LV6';
    case 6:
      return 'LV7';
    case 7:
      return '专1';
    case 8:
      return '专2';
    case 9:
      return '专3';
    default:
      return l.toString();
  }
}
</script>
<template>
  <div class="card bg-base-100 rounded-md mt-1 w-[40rem] ring-primary ring-1 flex items-end">
    <table class="table table-zebra table-compact w-[40rem]">
      <thead>
      <tr>
        <th style="width: 0.5rem;white-space: break-spaces!important;" class="lh-.8 text-center">等级</th>
        <th style="width: 5.5rem;white-space: break-spaces!important;" class="lh-.8 text-center">名称</th>
        <th style="width: 20rem;white-space: break-spaces!important;" class="lh-.8">描述</th>
        <!--        <th style="width: 6.5rem;white-space: break-spaces!important;" class="lh-.8">解锁条件</th>-->
        <th style="width: 4rem;white-space: break-spaces!important;" class="lh-.8 text-center">说明</th>
      </tr>
      </thead>
      <tbody>
      <template v-for="(ani,i) in skillObj.skill.levels">
        <tr v-if="[0,3,6,7,8,9].indexOf(i) !== -1 || i === skillObj.current-1">
          <td style="white-space: break-spaces!important;" class="lh-.8 text-center">{{ LevelToCnName(i) }}</td>
          <td style="white-space: break-spaces!important;" class="lh-.8 text-center">{{ ani.name }}</td>
          <td style="white-space: break-spaces!important;" class="lh-.8"
              v-html="gameParser.compileSkillBlackboard(gameParser.compileDescRichText(ani.description, '', false),ani['blackboard'])">
          </td>
          <td style="white-space: break-spaces!important;" class="lh-.8 text-center">
            {{ i === skillObj.current - 1 ? skillObj.isUnlock ? '当前生效' : '未解锁' : '' }}
          </td>
        </tr>
      </template>
      </tbody>
    </table>
  </div>
</template>

