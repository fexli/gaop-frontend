<script setup lang="ts">

import {defineProps} from "vue";
import {useToast} from "../../../hooks/toast";
import {useTranslate} from "../../../hooks/translate";
import global_const from "../../../utils/global_const";
import formatter from "../../../utils/formatter";
import {GameModuleStatus, moduleRunningType, UserModule} from "../../../utils/userModules";
import {setGameModuleList} from "../../../plugins/axios";

const {showMessage} = useToast();
const {translate} = useTranslate();

const props = defineProps({
  gameUserName: String,
  gamePlatform: Number,
  moduleInfo: Object as () => GameModuleStatus,
  moduleDetails: Object as () => UserModule || null,
  fresh: {
    type: Function,
    default: () => {
    },
  }
})

function switchEnableType() {
  console.log("switchEnableType", props.moduleInfo)
  if (props.moduleInfo?.enabled) {
    setGameModuleList(props?.gameUserName || '', props?.gamePlatform || 1, props?.moduleInfo?.scriptHash || '', false).then((res: any) => {
      console.log("setGameModuleListOK", res)
      showMessage(res.msg, 6000, 'info')
      props.fresh()
    }).catch((err: any) => {
      showMessage(err.data.msg, 3000, 'danger')
    })
  } else {
    setGameModuleList(props?.gameUserName || '', props?.gamePlatform || 1, props?.moduleInfo?.scriptHash || '', true).then((res: any) => {
      showMessage(res.msg, 3000, 'info')
      props.fresh()
    }).catch((err: any) => {
      showMessage(err.data.msg, 3000, 'danger')
    })
  }
}
</script>
<template>
  <div class="lg:flex w-full h-full lg:items-center lg:justify-center gap-2 lg:justify-between lg:my-1 rounded-xl">
    <div class="ml-1">
      <div class="text-title text-xl mb-1 flex items-center">
        // {{ moduleInfo.scriptName }}
        <span class="rounded-md bg-gray-400 text-sm text-neutral px-1 ml-1"
              v-if="moduleDetails">{{ moduleRunningType(moduleDetails.moduleType) }}</span>
        <span
            class="rounded-md text-sm text-neutral px-1 ml-1"
            :class="moduleDetails.deleted ? 'bg-error' : moduleInfo.enabled ? 'bg-success' : 'bg-warning'"
            v-if="moduleDetails && moduleDetails.moduleType === 2">
          {{
            translate(moduleDetails.deleted ? 'module.info.mod_del' : moduleInfo.enabled ? 'module.info.mod_ena' : 'module.info.mod_dis')
          }}</span>
      </div>
      <template v-if="moduleDetails">
        <div class="mb-1">
          <span class="rounded-md bg-gray-400 text-sm text-neutral px-1">{{ translate('module.info.create_ts') }}</span>
          {{ formatter.formatDate(moduleDetails.createTs * 1000, 'yyyy-MM-dd HH:mm') }}
        </div>
        <div v-if="moduleDetails.scriptDesc" class="whitespace-pre-wrap">
          <span class="rounded-md bg-gray-400 text-sm text-neutral px-1">{{ translate('module.info.desc') }}</span>
          {{ moduleDetails.scriptDesc }}
        </div>
        <div v-else>
          <span class="rounded-md bg-gray-400 text-sm text-neutral px-1">{{ translate('module.info.no_desc') }}</span>
        </div>
        <div class="text-sm mt-1">
          <span class="rounded-md bg-gray-400 text-sm text-neutral px-1">{{ translate('module.info.m_name') }}</span>
          {{ moduleDetails.moduleName }}(v{{ moduleDetails.moduleVersion }})
        </div>
      </template>
      <template v-else>
        <div class="text-xl text-error">错误：当前模块已被删除</div>
      </template>
    </div>
    <div class="lg:flex lg:gap-2 lg:h-full lg:items-center">
      <div class="flex flex-col my-1 mr-1 lg:my-0 lg:mr-2 lg:w-32">
        <button class="fe-btn fe-btn_set">
          <svg style="width:24px;height:24px" viewBox="0 0 24 24">
            <path fill="currentColor" :d="global_const.mdiPath['trash-can-outline']"/>
          </svg>
          {{ translate('module.info.del_btn') }}
        </button>
        <button v-if="(moduleDetails && moduleDetails.moduleType === 1)" class="fe-btn fe-btn_set mt-1">
          <svg style="width:24px;height:24px" viewBox="0 0 24 24">
            <path fill="currentColor" :d="global_const.mdiPath['rocket-launch-outline']"/>
          </svg>
          {{ translate('module.info.run_once') }}
        </button>
        <button :disabled="moduleDetails.deleted" @click="switchEnableType"
                v-if="(moduleDetails && moduleDetails.moduleType === 2)"
                class="fe-btn fe-btn_set mt-1">
          <svg style="width:24px;height:24px" viewBox="0 0 24 24">
            <path fill="currentColor"
                  :d="global_const.mdiPath[moduleInfo.enabled ? 'cog-pause-outline':'cog-play-outline']"/>
          </svg>
          {{ translate(moduleInfo.enabled ? 'module.info.mod_ena_b' : 'module.info.mod_dis_b') }}
        </button>
      </div>
    </div>
  </div>
</template>

