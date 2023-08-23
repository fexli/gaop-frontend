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
  detailed: {
    type: Boolean,
    default: false
  },
  noDescription: {
    type: Boolean,
    default: false
  },
  withDetail: {
    type: Boolean,
    default: false
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
  <div>
    <table class="table table-zebra table-compact w-[40rem]">
      <thead>
      <tr>
        <th style="width: 0.5rem;white-space: break-spaces!important;" class="lh-.8 text-center">等级</th>
        <th style="width: 5.5rem;white-space: break-spaces!important;" class="lh-.8 text-center">名称</th>
        <th style="width: 20rem;white-space: break-spaces!important;" class="lh-.8">描述</th>
        <!--        <th style="width: 6.5rem;white-space: break-spaces!important;" class="lh-.8">解锁条件</th>-->
        <th v-if="!noDescription" style="width: 4rem;white-space: break-spaces!important;" class="lh-.8 text-center">
          说明
        </th>
        <template v-if="withDetail">
          <th style="width: 2.5rem;white-space: break-spaces!important;" class="lh-.8 text-center">
            <div
                class="absolute -ml-[0.82rem] -mt-[0.35rem]"
                style="height: 23px;width: 16px"
                :style="`background-image: url('/static/charframe/charcommon/image_sp_start_bkg.png');
                  background-position: left center;background-repeat: no-repeat;background-size: cover`"
            />
            <span class="pr-0.5" style="background-color: rgb(67,67,67)">初始</span>

          </th>
          <th style="width: 2.5rem;white-space: break-spaces!important;" class="lh-.8 text-center">
            <div
                class="absolute -ml-[0.82rem] -mt-[0.35rem]"
                style="height: 23px;width: 16px"
                :style="`background-image: url('/static/charframe/charcommon/image_sp_cost_bkg.png');
                  background-position: left center;background-repeat: no-repeat;background-size: cover`"
            />
            <span class="pr-0.5" style="background-color: rgb(67,67,67)">需求</span>
          </th>
          <th style="width: 2.5rem;white-space: break-spaces!important;" class="lh-.8 text-center">
            <div
                class="absolute -ml-[0.89rem] -mt-[0.35rem]"
                style="height: 23px;width: 16px"
                :style="`background-image: url('/static/charframe/charcommon/image_sp_keep_bkg.png');
                  background-position: left center;background-repeat: no-repeat;background-size: cover`"
            />
            <span class="pr-0.5" style="background-color: rgb(67,67,67)">持续</span>
          </th>
        </template>
      </tr>
      </thead>
      <tbody>
      <template v-for="(ani,i) in skillObj.skill.levels">
        <tr v-if="detailed || [0,3,6,7,8,9].indexOf(i) !== -1 || i === skillObj.current-1">
          <td style="white-space: break-spaces!important;" class="lh-.8 text-center">{{ LevelToCnName(i) }}</td>
          <td style="white-space: break-spaces!important;" class="lh-.8 text-center">{{ ani.name }}</td>
          <td style="white-space: break-spaces!important;" class="lh-.8"
              v-html="gameParser.compileSkillBlackboard(gameParser.compileDescRichText(ani.description, '', false),ani['blackboard'])">
          </td>
          <td v-if="!noDescription" style="white-space: break-spaces!important;" class="lh-.8 text-center">
            {{ i === skillObj.current - 1 ? skillObj.isUnlock ? '当前生效' : '未解锁' : '' }}
          </td>
          <template v-if="withDetail">
            <td style="white-space: break-spaces!important;" class="lh-.8 text-center p-0 m-0">{{ ani.spData.initSp }}</td>
            <td style="white-space: break-spaces!important;" class="lh-.8 text-center p-0 m-0">{{ ani.spData.spCost }}</td>
            <td style="white-space: break-spaces!important;" class="lh-.8 text-center p-0 m-0">
              {{ gameParser.skillDuration(skillObj.skillId, i+1) }}
            </td>
          </template>
        </tr>
      </template>
      </tbody>
    </table>
  </div>
</template>

