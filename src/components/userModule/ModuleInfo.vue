<script setup lang="ts">

import formatter from "../../utils/formatter";
import {defineProps} from "vue";
import {compileUserModule} from "../../plugins/axios";
import {useToast} from "../../hooks/toast";
import global_const from "../../utils/global_const";
import {useTranslate} from "../../hooks/translate";

const {showMessage} = useToast();
const {translate} = useTranslate();

class UserModule {
  createTs: number | undefined
  scriptName: string | undefined
  scriptDesc: string | undefined
  cAs: number | undefined
  inCompied: boolean | undefined
  scriptHash: string | undefined
  compiled: number | undefined
  moduleName: string | undefined
  moduleVersion: string | undefined
  moduleType: number | undefined
}

const props = defineProps({
  info: {
    type: Object as () => UserModule,
    default: {}
  },
  index: {
    type: Number,
    default: 0
  },
  delete: {
    type: Function,
    default: () => {
    }
  },
  fetch: {
    type: Function,
    default: () => {
    }
  }
})

const moduleRunningType = (type: number) => {
  switch (type) {
    case 0:
      return "留档模块（禁用）"
    case 1:
      return "单次执行模块"
    case 2:
      return "触发型模块"
    case 3:
      return "定时模块"
    default:
      return "未知类型(" + type + ")"
  }
}
const compiledType = (type: number) => {
  switch (type) {
    case 0:
      return {
        type: "未编译",
        color: "",
        btn: "开始编译",
      }
    case 1:
      return {
        type: "编译失败",
        color: "text-error",
      }
    case 2:
      return {
        type: "模块载入失败",
        color: "text-error",
      }
    case 3:
      return {
        type: "编译成功",
        color: "text-success",
      }
  }
}
const startCompile = () => {
  let hash = props.info?.scriptHash || ""
  if (hash === "") {
    showMessage("module.error.compile_no_hash", 2000, "success")
    return
  }
  console.log("start compile", hash)
  const {close} = showMessage("module.compile.start", 15000, "info")
  compileUserModule(hash).then((res: any) => {
    console.log("startCompile", res)
    showMessage(res.msg, 5000, "info", res.data.compiled, res.data.result)
    setTimeout(() => {
      props.fetch()
    }, 1000)
  }).catch(err => {
    console.log("startCompileErr", err)
    showMessage(err.data.msg, 5000, "danger")
  }).finally(() => {
    close()
  })
}

function deleteUserModule() {
  props.delete(props.info)
}
</script>
<template>
  <div class="w-full bg-base-200 rounded-xl flex items-center gap-2">
    <div class="relative flex items-center h-full bg-base-100 pr-1 rounded-l-xl min-w-[3.5rem]">
      <svg class="h-6 w-6 bottom-0 text-primary -mr-1" viewBox="0 0 24 24">
        <path fill="currentColor"
              d="M12,8A4,4 0 0,1 16,12A4,4 0 0,1 12,16A4,4 0 0,1 8,12A4,4 0 0,1 12,8M12,10A2,2 0 0,0 10,12A2,2 0 0,0 12,14A2,2 0 0,0 14,12A2,2 0 0,0 12,10M10,22C9.75,22 9.54,21.82 9.5,21.58L9.13,18.93C8.5,18.68 7.96,18.34 7.44,17.94L4.95,18.95C4.73,19.03 4.46,18.95 4.34,18.73L2.34,15.27C2.21,15.05 2.27,14.78 2.46,14.63L4.57,12.97L4.5,12L4.57,11L2.46,9.37C2.27,9.22 2.21,8.95 2.34,8.73L4.34,5.27C4.46,5.05 4.73,4.96 4.95,5.05L7.44,6.05C7.96,5.66 8.5,5.32 9.13,5.07L9.5,2.42C9.54,2.18 9.75,2 10,2H14C14.25,2 14.46,2.18 14.5,2.42L14.87,5.07C15.5,5.32 16.04,5.66 16.56,6.05L19.05,5.05C19.27,4.96 19.54,5.05 19.66,5.27L21.66,8.73C21.79,8.95 21.73,9.22 21.54,9.37L19.43,11L19.5,12L19.43,13L21.54,14.63C21.73,14.78 21.79,15.05 21.66,15.27L19.66,18.73C19.54,18.95 19.27,19.04 19.05,18.95L16.56,17.95C16.04,18.34 15.5,18.68 14.87,18.93L14.5,21.58C14.46,21.82 14.25,22 14,22H10M11.25,4L10.88,6.61C9.68,6.86 8.62,7.5 7.85,8.39L5.44,7.35L4.69,8.65L6.8,10.2C6.4,11.37 6.4,12.64 6.8,13.8L4.68,15.36L5.43,16.66L7.86,15.62C8.63,16.5 9.68,17.14 10.87,17.38L11.24,20H12.76L13.13,17.39C14.32,17.14 15.37,16.5 16.14,15.62L18.57,16.66L19.32,15.36L17.2,13.81C17.6,12.64 17.6,11.37 17.2,10.2L19.31,8.65L18.56,7.35L16.15,8.39C15.38,7.5 14.32,6.86 13.12,6.62L12.75,4H11.25Z"/>
      </svg>
      <div class="text-primary text-4xl font-bold">.{{ index || '?' }}</div>
    </div>
    <div class="lg:flex w-full h-full lg:items-center lg:justify-center gap-2 lg:justify-between lg:my-1">
      <div class="lg:flex lg:gap-2 lg:h-full lg:items-center">
        <div class="text-info text-sm w-full lg:w-[24rem]">
          <div class="text-title text-xl mb-1">// {{ info.scriptName }}</div>
          <div class="mb-1">
            <span class="rounded-md bg-gray-400 text-sm text-neutral px-1">{{
                translate('module.info.create_ts')
              }}</span>
            {{ formatter.formatDate(info.createTs * 1000, 'yyyy-MM-dd HH:mm') }}
          </div>
          <div v-if="info.scriptDesc" class="whitespace-pre-wrap">
            <span class="rounded-md bg-gray-400 text-sm text-neutral px-1">{{ translate('module.info.desc') }}</span>
            {{ info.scriptDesc }}
          </div>
          <div v-else>
            <span class="rounded-md bg-gray-400 text-sm text-neutral px-1">{{ translate('module.info.no_desc') }}</span>
          </div>
          <div class="text-sm mt-1">
            <span class="rounded-md bg-gray-400 text-sm text-neutral px-1">{{ translate('module.info.hash') }}</span>
            {{ info.scriptHash.toUpperCase() }}
          </div>
        </div>
        <div class="spacer-line bg-base-100"/>
      </div>
      <div class="mr-1 lg:mr-0 lg:mb-1">
        <template v-if="info.inCompied">
          <div class="mt-1">{{ translate('module.info.in_compiled') }}</div>
        </template>
        <template v-else>
          <div class="mt-1 flex justify-center">
            {{translate('module.info.current_state')}}<span :class="compiledType(info.compiled).color">{{ compiledType(info.compiled).type }}</span>
          </div>
          <button @click="startCompile" v-if="info.compiled === 0" class="fe-btn fe-btn_set w-full">
            <svg style="width:24px;height:24px" viewBox="0 0 24 24">
              <path fill="currentColor" :d="global_const.mdiPath['file-arrow-left-right-outline']"/>
            </svg>
            {{translate('module.info.compile') }}
          </button>
        </template>
        <template v-if="info.compiled === 3">
          <div class="text-sm mt-1">
            <span class="rounded-md bg-gray-400 text-sm text-neutral px-1">{{translate('module.info.m_name')}}</span>
            {{ info.moduleName }}
          </div>
          <div class="text-sm mt-1">
            <span class="rounded-md bg-gray-400 text-sm text-neutral px-1">{{translate('module.info.m_ver')}}</span>
            {{ info.moduleVersion }}
          </div>
          <div class="text-sm mt-1">
            <span class="rounded-md bg-gray-400 text-sm text-neutral px-1">{{translate('module.info.m_type')}}</span>
            {{ moduleRunningType(info.moduleType) }}
          </div>
        </template>
        <template v-else-if="info.compiled !== 0">
          <div class="text-sm mt-1">
            <span class="rounded-md bg-gray-400 text-sm text-neutral px-1">{{translate('module.info.m_ref')}}</span>
            {{ info.result || '-' }}
          </div>
        </template>
      </div>
      <div class="lg:flex lg:gap-2 lg:h-full lg:items-center">
        <div class="spacer-line bg-base-100"/>
        <div class="flex flex-col my-1 mr-1 lg:my-0 lg:mr-2 lg:w-32">
          <button class="fe-btn fe-btn_set" @click="deleteUserModule">
            <svg style="width:24px;height:24px" viewBox="0 0 24 24">
              <path fill="currentColor" :d="global_const.mdiPath['trash-can-outline']"/>
            </svg>
            {{translate('module.info.del_btn')}}
          </button>
          <button :disabled="info.compiled !== 3" class="fe-btn fe-btn_set mt-1">
            <svg style="width:24px;height:24px" viewBox="0 0 24 24">
              <path fill="currentColor" :d="global_const.mdiPath['content-copy']"/>
            </svg>
            {{translate('module.info.share_btn')}}
          </button>
          <button name="123" :disabled="info.compiled !== 3 || info.moduleType !== 1" class="fe-btn fe-btn_set mt-1">
            <svg style="width:24px;height:24px" viewBox="0 0 24 24">
              <path fill="currentColor" :d="global_const.mdiPath['rocket-launch-outline']"/>
            </svg>
            {{translate('module.info.apply_btn')}}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

